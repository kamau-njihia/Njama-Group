import { router, json, requireAuth } from '@appdeploy/sdk';

export const handler = router({
  'GET /api/health': [
    async () => json({ ok: true, service: 'NJAMA GROUP', mode: 'foundation' }),
  ],
  'GET /api/me': [
    requireAuth(),
    async ctx =>
      json({
        userId: ctx.user!.userId,
        email: ctx.user!.email || null,
        name: ctx.user!.name || null,
      }),
  ],
});
