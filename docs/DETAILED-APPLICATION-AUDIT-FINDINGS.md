# NJAMA GROUP — Detailed Application Audit Findings

**Assessment date:** 2026-11-17  
**Scope:** Static source review of the recovery branches and reviewable pull-request descriptions. Findings below are engineering observations, not live penetration-test results or production certification.

## Executive decision

Proceed with the NJAMA GROUP parent application as a separate, initially standalone platform using sandbox/mock adapters. Do not connect production records or merge databases yet. The specialist apps have useful authenticated ownership boundaries, but several scale, integration and operational gates remain open.

## Current recovery review status

The following draft recovery PRs were returned by GitHub search as open on the assessment date:

| Application | Recovery PR | CI evidence in PR description |
|---|---|---|
| PropertyOS | [PR #1](https://github.com/kamau-njihia/Property-Os/pull/1) | Described latest run #8 as passing frontend type-check and production build |
| Atira | [PR #1](https://github.com/kamau-njihia/Atira/pull/1) | Described latest run #22 as passing type-check, five IndexedDB tests, PWA validation and build |
| FORGED | [PR #1](https://github.com/kamau-njihia/Forged/pull/1) | Described latest run #15 as passing frontend/backend TypeScript and production build |
| BMA | [PR #1](https://github.com/kamau-njihia/BMA/pull/1) | Described latest run #98 as passing type-check, eight tests, service-worker syntax and production build |
| NJAMA GROUP | [PR #1](https://github.com/kamau-njihia/Njama-Group/pull/1) | Foundation documentation PR |

Additionally, workflow runs associated with the previously recorded recovery commits for PropertyOS, Atira and FORGED were queried during this assessment and returned completed/success. These were single frontend jobs; they do not establish that a later PR head or live AppDeploy deployment is current. The current PR-head SHA and current live-source parity still need to be independently reconciled. Do not describe these results as a complete current release gate.

## Application-specific findings

### 1. PropertyOS — organisation and role isolation; scale/read-path hardening

**Positive source evidence**
- Backend uses AppDeploy `requireAuth()` and obtains the actor from `ctx.user.userId`.
- Organisation membership is checked against a user-scoped membership table before organisation routes.
- Property and operational records are stored in organisation-specific tables.
- Mutating routes inspected for property creation, inspections, work orders, assets and readings check organisation membership and role capabilities.
- Team invitations are restricted to owner/director; director assignment is owner-only.
- Work-order status updates use an expected-status conditional update, reducing stale-write races.
- Frontend includes tenant-specific navigation and a browser-history handler intended to keep Android back navigation inside the app.

**Specific issues confirmed in source**
- Organisation summary reads properties, inspections, work orders, assets and readings with a fixed `limit: 100`; it returns a page-limit marker but no continuation cursor. A portfolio above 100 records can therefore be incomplete.
- The backend's scheduled automation reads several organisation registers in fixed 100-record pages. Rent billing, reminders, compliance and preventive maintenance must be made cursor-aware or use bounded indexed queries, with idempotent job receipts.
- Bootstrap reads at most 50 memberships. Users with more than 50 organisation memberships need pagination or a clear cap.
- Team roster and invitation reads are each limited to 100. Invitation retrieval reads the shared `team_invites` table and filters by organisation after retrieval; this needs an organisation-keyed access pattern and pagination.
- The UI's local device-lock implementation stores a salted password hash in local storage. This is a convenience lock, not a substitute for server authentication or strong device-bound biometric security. Verify lock state cannot be bypassed by refresh, route changes or local-storage manipulation.
- Static inspection does not prove tenant portal read/write isolation, attachment authorization, realtime subscription scoping, payment approval controls or notification permissions. These remain mandatory tests.
- Several historic operational defects (inspection/report paste, Kent Consultants editing, modal scroll/empty states, bell, physical back and lock screen) require direct browser/device regression tests; source presence alone does not prove they are fixed.

**Required before integration**
1. Add cursor pagination or bounded aggregate endpoints to every large register and report.
2. Make automation jobs resumable, idempotent and safe under retries/concurrent workers.
3. Test tenant/contractor routes and cross-organisation object-ID substitution.
4. Verify finance/payment actions require the appropriate role and a separate approval receipt; recommendations must not approve payments.
5. Test signed attachment access, realtime filters, notification consent and Android navigation/lock behavior.

### 2. Atira — local-first finance and sync integrity

**Positive source evidence**
- Backend data routes use `requireAuth()` and derive per-user table names from the authenticated user ID.
- The frontend uses IndexedDB, an offline operation queue and AppDeploy auth/API.
- The recovery PR describes queue-acknowledgement safety and transactional backup import, with five IndexedDB regression tests.

**Specific issues confirmed in source**
- The helper used to find a record by client ID defaults to only the first page. The sync path also uses a bounded multi-page scan; duplicate detection is therefore not globally complete when a user's history exceeds the scan window.
- The AppDeploy SDK documentation reviewed for this work states list filters are applied after reads, so a filtered list scan is not a scalable substitute for a real key/index.
- The correct fix is a durable user-and-record-kind scoped client-ID index with transaction-safe create/update behavior, an idempotent backfill and conflict reconciliation. Do not simply increase the scan limit.
- The legacy data and sync routes still exist alongside the current routes; verify they cannot bypass current validation, account isolation or deletion safeguards.
- The frontend caches an authenticated user identity locally and restores it before attempting a fresh sign-in. Verify account switching, expired sessions and offline states cannot show or sync one user's data under another user's session.
- Ask Atira serializes a bounded snapshot into an AI prompt. Keep prompt size bounded, but make the included records a deterministic, current summary rather than an arbitrary first page.
- The frontend contains a destructive delete-all endpoint. Keep it inaccessible from ordinary UI flows and ensure any administrative reset requires explicit, re-authenticated confirmation and a server-side audit record.

**Required before integration**
1. Implement a durable per-user/per-kind client-ID index and test concurrent duplicate creates.
2. Test offline queue retries, unknown outcomes, account switching and sync acknowledgement loss.
3. Test backup export/import round trips, rollback on failure and preservation of all stores/queues.
4. Verify financial formulas, KES defaults and source-of-truth rules against actual records.
5. Expose only consented, explicitly scoped finance aggregates to NJAMA GROUP; no raw personal transactions by default.

### 3. FORGED — private personal data and bounded AI context

**Positive source evidence**
- Backend uses `requireAuth()` and a table derived from the verified user ID.
- CRUD operations use the authenticated user's table.
- The records endpoint has validated cursor pagination and a maximum page size of 100.
- Frontend has a `popstate` handler for in-app back navigation.

**Specific issues confirmed in source**
- The AI partner reads a fixed first page of 100 records; the coach reads 40. The order of `db.list` is not a recency guarantee, so the AI may reason from incomplete or stale context.
- Do not solve this by scanning every page on each AI request. Build a compact user-scoped activity summary/index with explicit update and rebuild rules.
- The current code's cursor pagination and front-end load-older flow need automated tests for >100 records, duplicate-free merges, stale cursors, concurrent edits and cross-user isolation.
- The recovery PR identifies durable export/backup and cross-device progress validation as outstanding.
- FORGED journals, reflections, profile details, health/body goals and personal-development records are private by default. They must never become visible to group directors, managers, employers or other subsidiaries merely because the user belongs to NJAMA GROUP.

**Required before integration**
1. Add tests for pagination boundaries and user isolation.
2. Build deterministic, user-owned AI context summaries with bounded prompt size and rebuild support.
3. Verify account restore, export/backup and cross-device behavior.
4. Keep personal content excluded from group intelligence unless the user separately grants a narrow, revocable consent.

### 4. BMA — learner identity, progress persistence and platform dependency

**Positive source evidence**
- Learner progress API routes use `requireAuth()` and the verified `ctx.user.userId`.
- The progress module derives stable hashed owner/progress/receipt IDs, checks payload-bound idempotency receipts and uses database transactions and conditional revision updates.
- Lesson validation and the 75% knowledge-check gate are present in the recovered source.
- Updated curriculum source is preserved: the expanded DOCX is the editable master, its matching PDF is the reading/print copy, and the older DOCX is retained separately.

**Specific issues confirmed in source**
- The frontend still stores learner completion, XP and study-day progress in browser local storage. The authenticated server progress endpoints are not yet connected to the frontend account lifecycle and offline queue.
- The progress module depends on the separate database catalogs `learner_progress` and `learner_progress_receipts`. AppDeploy catalog provisioning is not established by the source code or SDK type declarations; do not enable the routes until AppDeploy support confirms the supported provisioning procedure and live test is successful.
- The public coach preview route is bounded by input length but has no verified durable, platform-supported rate limit/quota. In-memory counters are not an adequate substitute.
- Certificate pages are currently previews; authoritative issuance, unique certificate IDs, public verification and revocation require server-side implementation.
- Enterprise learner analytics shown in the frontend include sample/static learner entries; they must not be presented as live cohort data.
- The PR notes that live resource byte equivalence has not been established even though the expected resource paths exist in the live resource inventory.

**Required before integration**
1. Obtain AppDeploy's written table-catalog provisioning instructions; provision only through the supported method.
2. Connect sign-in/session restoration, learner progress reads/writes and offline event retries.
3. Migrate existing local progress with preview, reconciliation and rollback; preserve local copies until cloud verification.
4. Implement persistent abuse controls for public AI endpoints.
5. Implement server-side certificate issuance and verification, and clearly label demo/sample analytics.

## NJAMA GROUP implementation implications

The parent application should initially contain:

- Group command centre with subsidiary registry and status cards.
- Owner-controlled organisation/business registry and membership.
- Per-subsidiary role and permission assignments; one user may hold different roles in different subsidiaries.
- Consent and data-sharing registry with purpose, data categories, expiry/revocation and audit trail.
- Integration registry with versioned API contracts and health status.
- Group audit log for sign-ins, access grants, approvals, data exports and consequential actions.
- Multi-currency reporting model, retaining source currency and exchange-rate provenance.
- NJAMA INTELLIGENCE orchestration with read-only summary adapters first; explicit owner approval for any consequential action.
- Sandbox adapters and synthetic test fixtures only during the first parent-app build.

**Initial integration order:** establish identity/roles/consent; then connect non-sensitive app health and aggregate status; next add approved operational summaries; only later consider sensitive finance, tenant or personal-development data under separate explicit permissions.

## Release gates — do not waive

- Recovery branches reconciled with current live source and current PR head.
- CI verified on the exact proposed head SHA.
- Automated tests cover user/org isolation, permissions, pagination, idempotency, concurrency and failure recovery.
- Each app has a verified export and tested restore path.
- Android and desktop QA passes, including offline and slow-network behavior.
- BMA database catalog and public AI quota dependencies resolved.
- NJAMA GROUP sandbox integration passes negative permission tests.
- Owner reviews test evidence before any production deployment, production data access, migration or cutover.

**Current assessment:** suitable to continue NJAMA GROUP design and sandbox implementation; not yet cleared for production integrations or cutover.
