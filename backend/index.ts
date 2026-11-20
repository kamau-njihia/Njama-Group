import { router, json, error, requireAuth, db, roles, ai, isAppDatabaseError, isRoleError } from '@appdeploy/sdk';

const ROLE_LADDER = ['owner', 'admin', 'business_director', 'finance_lead', 'department_lead', 'staff', 'auditor'];
const roleSetup = roles.configure({ roles: ROLE_LADDER });
const REQUIRED_TABLES = ['njama_records', 'njama_audit'];
const RECORD_KINDS = ['businesses', 'transactions', 'budgets', 'approvals', 'risks', 'legal', 'assets', 'departments'];
const WRITE_ROLES: Record<string, string[]> = {
  businesses: ['owner', 'admin'],
  departments: ['owner', 'admin'],
  transactions: ['owner', 'admin', 'finance_lead'],
  budgets: ['owner', 'admin', 'finance_lead'],
  approvals: ['owner', 'admin', 'business_director', 'finance_lead', 'department_lead'],
  risks: ['owner', 'admin', 'business_director', 'department_lead'],
  legal: ['owner', 'admin', 'business_director', 'department_lead'],
  assets: ['owner', 'admin', 'finance_lead', 'business_director']
};
const FIELDS: Record<string, string[]> = {
  businesses: ['name', 'sector', 'description', 'legalStatus', 'country', 'currency', 'status'],
  departments: ['name', 'lead', 'description', 'businessId', 'status'],
  transactions: ['type', 'amount', 'currency', 'date', 'category', 'description', 'businessId', 'reference', 'status'],
  budgets: ['name', 'period', 'amount', 'currency', 'businessId', 'category', 'status'],
  approvals: ['title', 'description', 'requestedAction', 'amount', 'currency', 'businessId', 'priority', 'status'],
  risks: ['title', 'category', 'severity', 'mitigation', 'owner', 'businessId', 'reviewDate', 'status'],
  legal: ['title', 'category', 'jurisdiction', 'counterparty', 'dueDate', 'status', 'businessId', 'reference'],
  assets: ['name', 'category', 'value', 'currency', 'businessId', 'location', 'status']
};

async function assignment(ctx: any) {
  await roleSetup;
  const current = await roles.get(ctx.user!.userId);
  ctx.role = current || undefined;
  return current;
}

async function memberGuard(ctx: any) {
  const current = await assignment(ctx);
  if (!current) return error('Your signed-in account has not been assigned a NJAMA GROUP role. Ask the group owner for an invitation.', 403);
  return null;
}

async function roleGuard(ctx: any, allowed: string[]) {
  const denied = await memberGuard(ctx);
  if (denied) return denied;
  if (!allowed.includes(ctx.role?.role || '')) return error('Your NJAMA GROUP role does not authorize this action.', 403);
  return null;
}

function databaseFailure(err: unknown) {
  if (isAppDatabaseError(err)) {
    if (err.code === 'AppDatabaseQuotaExceeded') return error('The group database quota has been reached. No retry was attempted; try again after the quota window resets.', 429);
    if (err.code === 'AppDatabaseGatewayUnavailable' || err.code === 'AppDatabaseReadIncomplete') return error('The group database is temporarily unavailable or returned an incomplete read. Refresh before making another decision.', 503);
    return json({ error: 'The NJAMA GROUP database table catalogs are not provisioned or are not accessible yet.', code: 'CATALOGS_PENDING', requiredTables: REQUIRED_TABLES }, 503);
  }
  return error('The group data service could not complete the request.', 500);
}

function scoped(ctx: any, businessId: string) {
  return roles.scopeFilter(ctx.role, 'businessId')({ businessId });
}

function allowedKind(kind: string) {
  return RECORD_KINDS.includes(kind);
}

function cleanRecord(kind: string, body: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const key of FIELDS[kind] || []) {
    const value = body[key];
    if (value !== undefined && value !== null) result[key] = typeof value === 'string' ? value.trim().slice(0, 4000) : value;
  }
  return result;
}

export const handler = router({
  'GET /api/health': [async () => json({ ok: true, service: 'NJAMA GROUP', architecture: 'group-operating-platform' })],

  'GET /api/me': [
    requireAuth(),
    async ctx => {
      const current = await assignment(ctx);
      return json({ userId: ctx.user!.userId, email: ctx.user!.email || null, name: ctx.user!.name || null, role: current?.role || null, scopes: current?.scopes || [] });
    }
  ],

  'GET /api/bootstrap-status': [
    requireAuth(),
    async ctx => {
      const denied = await memberGuard(ctx);
      if (denied) return denied;
      try {
        await db.list('njama_records', { limit: 1 });
        await db.list('njama_audit', { limit: 1 });
        return json({ ready: true, requiredTables: REQUIRED_TABLES });
      } catch (err) {
        return databaseFailure(err);
      }
    }
  ],

  'GET /api/records/:kind': [
    requireAuth(),
    async ctx => {
      const denied = await memberGuard(ctx);
      if (denied) return denied;
      const kind = ctx.params.kind;
      if (!allowedKind(kind)) return error('Unknown register type.', 404);
      try {
        const page = await db.list('njama_records', { filter: { kind }, limit: 100, nextToken: ctx.query.nextToken });
        const items = page.items.filter(item => scoped(ctx, String(item.businessId || 'group')));
        return json({ items, nextToken: page.nextToken || null });
      } catch (err) {
        return databaseFailure(err);
      }
    }
  ],

  'POST /api/records/:kind': [
    requireAuth(),
    async ctx => {
      const denied = await memberGuard(ctx);
      if (denied) return denied;
      const kind = ctx.params.kind;
      if (!allowedKind(kind)) return error('Unknown register type.', 404);
      if (!(WRITE_ROLES[kind] || []).includes(ctx.role?.role || '')) return error('Your role is read-only for this register.', 403);
      const body = (ctx.body || {}) as Record<string, unknown>;
      const requestId = String(body.requestId || '');
      if (!/^[A-Za-z0-9_-]{8,80}$/.test(requestId)) return error('A valid unique request ID is required.', 400);
      const businessId = String(body.businessId || 'group');
      if (!scoped(ctx, businessId)) return error('Your role is not authorized for this business scope.', 403);
      const record = cleanRecord(kind, body);
      if (kind === 'transactions' || kind === 'budgets') {
        const amount = Number(record.amount);
        if (!Number.isFinite(amount) || amount <= 0) return error('Enter a valid positive amount.', 400);
        const currency = String(record.currency || '');
        if (!/^[A-Z]{3}$/.test(currency)) return error('Use a valid three-letter currency code.', 400);
        record.amount = amount;
        record.currency = currency;
      }
      if (kind === 'businesses' && !String(record.name || '').trim()) return error('Business name is required.', 400);
      if (kind !== 'businesses' && kind !== 'departments' && !String(record.title || record.name || '').trim()) return error('A title or name is required.', 400);
      const now = new Date().toISOString();
      const saved = { ...record, kind, businessId, createdBy: ctx.user!.userId, createdAt: now, updatedAt: now };
      const audit = { event: 'record.created', recordKind: kind, recordId: requestId, businessId, actorUserId: ctx.user!.userId, createdAt: now };
      try {
        const recordOp = db.tx.add('njama_records', [{ id: requestId, ...saved }]);
        const auditOp = db.tx.add('njama_audit', [{ id: requestId + '_audit', ...audit }]);
        await db.transact([recordOp, auditOp]);
        return json({ id: requestId, record: saved });
      } catch (err) {
        if (isAppDatabaseError(err) && (err.code === 'AppDatabaseDuplicateId' || err.code === 'AppDatabaseUnknownOutcome')) {
          try {
            const [existing] = await db.get<Record<string, unknown>>('njama_records', [requestId], { consistent: true });
            if (existing && existing.createdBy === ctx.user!.userId && existing.kind === kind) return json({ id: requestId, record: existing, replayed: true });
          } catch { /* unresolved outcomes remain unresolved */ }
        }
        if (isAppDatabaseError(err) && (err.code === 'AppDatabaseConflict' || err.code === 'AppDatabaseConditionFailed')) return error('A concurrent change prevented the write. Refresh the register and review before retrying.', 409);
        return databaseFailure(err);
      }
    }
  ],

  'POST /api/approvals/:id/decision': [
    requireAuth(),
    async ctx => {
      const denied = await roleGuard(ctx, ['owner', 'admin']);
      if (denied) return denied;
      const decision = String(((ctx.body || {}) as Record<string, unknown>).decision || '');
      if (decision !== 'approved' && decision !== 'rejected') return error('Decision must be approved or rejected.', 400);
      try {
        const [item] = await db.get<Record<string, any>>('njama_records', [ctx.params.id], { consistent: true });
        if (!item || item.kind !== 'approvals') return error('Approval request not found.', 404);
        if (!scoped(ctx, String(item.businessId || 'group'))) return error('Your role is not authorized for this business scope.', 403);
        if (item.status !== 'pending') return error('This approval has already been decided or is no longer pending.', 409);
        const now = new Date().toISOString();
        const update = db.tx.update('njama_records', [{ id: ctx.params.id, record: { status: decision, decisionBy: ctx.user!.userId, decidedAt: now }, if: { status: 'pending' } }], { patch: true });
        const audit = db.tx.add('njama_audit', [{ id: ctx.params.id + '_' + decision + '_' + Date.now(), event: 'approval.' + decision, recordKind: 'approvals', recordId: ctx.params.id, businessId: item.businessId || 'group', actorUserId: ctx.user!.userId, createdAt: now }]);
        await db.transact([update, audit]);
        return json({ ok: true, status: decision });
      } catch (err) {
        if (isAppDatabaseError(err) && (err.code === 'AppDatabaseConflict' || err.code === 'AppDatabaseConditionFailed')) return error('The approval changed before your decision was saved. Refresh and review its latest status.', 409);
        return databaseFailure(err);
      }
    }
  ],

  'GET /api/activity': [
    requireAuth(),
    async ctx => {
      const denied = await memberGuard(ctx);
      if (denied) return denied;
      try {
        const page = await db.list('njama_audit', { limit: 50, nextToken: ctx.query.nextToken });
        return json({ items: page.items.filter(item => scoped(ctx, String(item.businessId || 'group'))), nextToken: page.nextToken || null });
      } catch (err) { return databaseFailure(err); }
    }
  ],

  'GET /api/team': [
    requireAuth(),
    async ctx => {
      const denied = await roleGuard(ctx, ['owner', 'admin']);
      if (denied) return denied;
      try { return json(await roles.list()); }
      catch (err) { if (isRoleError(err)) return error(err.code, 403); throw err; }
    }
  ],

  'POST /api/team/invite': [
    requireAuth(),
    async ctx => {
      const denied = await roleGuard(ctx, ['owner', 'admin']);
      if (denied) return denied;
      const body = (ctx.body || {}) as Record<string, unknown>;
      const email = String(body.email || '').trim().toLowerCase();
      const role = String(body.role || '');
      const scopes = Array.isArray(body.scopes) ? body.scopes.map(String).slice(0, 10) : [];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error('Enter a valid email address.', 400);
      if (!ROLE_LADDER.includes(role) || role === 'owner') return error('Select a permitted group role.', 400);
      try {
        const result = await roles.invite({ email, role, scopes, joinPath: '#/join' });
        return json({ emailed: result.emailed, joinUrl: result.emailed ? null : result.joinUrl, expiresAt: result.expiresAt });
      } catch (err) { if (isRoleError(err)) return error(err.code, 403); throw err; }
    }
  ],

  'POST /api/team/join': [
    requireAuth(),
    async ctx => {
      await roleSetup;
      const code = String(((ctx.body || {}) as Record<string, unknown>).code || '');
      if (!code) return error('Invitation code is required.', 400);
      try { return json(await roles.acceptInvite({ code })); }
      catch (err) { if (isRoleError(err)) return error(err.code, 400); throw err; }
    }
  ],

  'POST /api/intelligence': [
    requireAuth(),
    async ctx => {
      const denied = await memberGuard(ctx);
      if (denied) return denied;
      const question = String(((ctx.body || {}) as Record<string, unknown>).question || '').trim().slice(0, 5000);
      if (!question) return error('Enter a question for NJAMA INTELLIGENCE.', 400);
      try {
        const result = await ai.run({
          system: 'You are NJAMA INTELLIGENCE, the strategic and operational intelligence assistant for NJAMA GROUP. The group principle is: Distinct in purpose. United in strength. Boundless in ambition. The group is designed as both a holding company and an active operating group, with independent subsidiaries, shared group departments and permission-aware intelligence. Founding businesses are Quick Task Errands & Cleaning Services, Njama Creations and Njama Property Managers. Group reporting currency starts with KES but transactions support multiple currencies. You have not been connected to subsidiary databases, financial records, customer records, employee records or external market feeds in this request. Never claim that you inspected live records, verified current figures, executed an action or contacted a person. Clearly distinguish established facts, assumptions, analysis and recommendations. For legal, tax, investment or regulated professional matters, provide general information and flag the need for qualified local professional review. Never authorize or execute payments, approvals, hiring, contracts, acquisitions or other consequential actions.',
          prompt: 'Group member question: ' + question + '\n\nRespond with practical, structured and candid guidance. Identify assumptions and missing evidence. Do not invent NJAMA GROUP operational figures.',
          maxSteps: 1,
          maxTokens: 1100,
          temperature: 0.35,
          thinkingMode: 'FAST'
        });
        return json({ answer: result.text, steps: result.steps, liveDataConnected: false });
      } catch (err) {
        const rpc = err && typeof err === 'object' ? err as { statusCode?: number } : {};
        if (rpc.statusCode === 429) return error('NJAMA INTELLIGENCE is rate-limited at the moment. Wait before retrying.', 429);
        return error('NJAMA INTELLIGENCE could not complete this request. Please retry.', 503);
      }
    }
  ]
});
