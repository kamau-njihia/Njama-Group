# Specialist Application Repair Log

**Assessment date:** 2026-11-17  
**Owner:** NJAMA GROUP  
**Scope:** PropertyOS, Atira, FORGED and Business Mastery Academy

This log distinguishes changes already deployed to live applications from fixes prepared in GitHub but not yet deployed. A green AppDeploy deployment status is not treated as proof that every workflow is correct.

## Live fixes deployed and AppDeploy-checked

| Application | Live snapshot | Changes deployed | AppDeploy QA |
|---|---:|---|---|
| PropertyOS | `1794904870275` | Preventive-maintenance automation now writes to the same `workorders` register used by the application; deterministic preventive work-order IDs prevent duplicate creation on repeated runs. AI report generation now creates a factual, clearly labelled fallback draft when the AI service returns 429/5xx instead of blocking report creation. | Ready; no frontend, backend or network errors in the returned QA snapshot. |
| Atira | `1794904930130` | Sync operations are no longer removed from IndexedDB before a successful server acknowledgement and cloud ID are received. Local record update completes before queue deletion. Missing/failed acknowledgements remain queued and mark sync state as error. Duplicate lookup fails closed when the bounded legacy scan is incomplete. All four PWA SVG icons now declare intrinsic dimensions matching the manifest. | Ready; validation passed; no frontend, backend or network errors in the returned QA snapshot. |
| FORGED | `1794904978152` | Invalid refresh-token recovery detects `invalid_grant`, attempts to clear the stale AppDeploy session and returns the user to sign-in instead of leaving a rejected token in the active UI. | Ready; validation passed; no frontend, backend or network errors in the returned QA snapshot. |

These deployments did not reset accounts, delete data, migrate databases or connect apps to one another.

## Source repairs prepared; waiting for AppDeploy deployment capacity

### PropertyOS
- Improved the fallback report's register-reference section to say **Needs verification**, not imply that register counts prove operational status.
- Source branch: `recovery/appdeploy-v36-baseline`.
- PR: https://github.com/kamau-njihia/Property-Os/pull/1
- The preceding source-validation workflow passed. A new workflow for the wording correction was still running at the time of this log.

### Atira
- Added a reconciliation pass that re-queues local records with no cloud ID or with pending/error state when an earlier release left a local record without its queue item. This is intended to recover local records orphaned by the old queue-deletion bug.
- Pinned Rollup and the Linux optional binary to published version `4.68.4` to avoid CI resolving the unpublished/missing `4.68.5` tarball.
- Source branch: `fix/atira-sync-acknowledgements`.
- PR: https://github.com/kamau-njihia/Atira/pull/1
- GitHub workflow #40 passed backend syntax, frontend type-check, IndexedDB backup-import tests, PWA validation and production build.

### FORGED
- Removed five unused icon imports that failed strict TypeScript checking.
- Pinned Rollup and its Linux optional binary to published version `4.68.4` for reproducible CI installs.
- Source branch: `recovery/appdeploy-v3-baseline`.
- PR: https://github.com/kamau-njihia/Forged/pull/1
- GitHub workflow #24 passed backend syntax, frontend type-check and production build.

### BMA
- Replaced the failing `/resources/bma-logo.svg` image request with an inline SVG emblem.
- Pinned Rollup and its Linux optional binary to published version `4.68.4`; the earlier CI failure was an npm 404 for `rollup-4.68.5.tgz`, a version not yet published in the registry at the time checked.
- Source branch: `recovery/appdeploy-v23-candidate`.
- PR: https://github.com/kamau-njihia/BMA/pull/1
- GitHub workflow #104 passed source validation, type-check, lesson-validation tests, service-worker syntax and build.
- **Not live yet:** the AppDeploy deployment attempt was rejected with `CREDITS_USAGE_LIMIT_REACHED`. The current live app remains on snapshot `1793425368735` and its historical logo resource failures remain visible in status logs.

## Outstanding issues requiring separate resolution

### PropertyOS
- Large property/tenant/finance/inspection/compliance registers and scheduled jobs still need complete cursor-aware pagination/checkpointing. Fixed 100-record reads are not safe for large portfolios.
- Verify payment approval, tenant/contractor isolation, attachments, notification delivery and all historic mobile/report regressions on real authenticated test accounts.
- The live AI fallback works without AI narrative generation, but a later source correction changes its register section to Needs verification; this correction is not yet live.

### Atira
- NSE quote provider: Yahoo Finance requests for Kenyan listings are returning 404 in the app runtime. Do not fabricate prices or present stale data as live.
- A possible NSE-specific provider is Oanor. Its published free tier advertises 7,500 calls/month and 2 requests/second, but a provider API key is required for production use. No key has been created, no paid subscription has been purchased and no provider has been connected. A bounded batch/cache integration requires explicit owner approval and a secret key.
- The newly prepared orphan-record reconciliation and Rollup pin have not yet been deployed to the live app.
- The legacy client-ID lookup remains bounded to eight 500-record pages and fails closed if it cannot complete. A durable index/backfill is still needed for accounts exceeding that legacy scan window.
- Confirm financial formula/data invariants and perform real offline, account-switching and backup-restore tests.

### FORGED
- The invalid-grant session recovery is live. The strict TypeScript/import and Rollup source repairs are in GitHub and passed CI, but were not separately deployed because they do not change the live runtime behaviour.
- AI partner/coach context still reads bounded first pages; ordering is not a recency guarantee. A deterministic, user-scoped summary/index and pagination tests are needed.
- Verify >100 records, export/restore, offline and cross-device progress on authenticated accounts. Private journal and body/personal data remain excluded from NJAMA GROUP by default.

### BMA
- Inline logo and dependency fixes are in the GitHub PR and CI passes, but not live because AppDeploy rejected the deploy on the account usage limit.
- Learner progress remains browser-local; account sign-in/session restoration, safe cloud progress sync and multi-device reconciliation are not complete.
- The learner-progress implementation depends on AppDeploy database table catalogs. The supported provisioning procedure has been requested from AppDeploy support; do not invent a table-creation endpoint or enable unprovisioned routes.
- Public AI endpoints still need a durable, platform-supported quota/rate-limit design. Certificate issuance and verification must remain labelled as previews until server-side issuance exists.

## AppDeploy usage constraint

The AppDeploy account is on the Free plan. The account query showed approximately `900.34` monthly credits remaining, but the next deployment was rejected by `CREDITS_USAGE_LIMIT_REACHED`. AppDeploy documents simultaneous daily, weekly and monthly limits; Free currently lists 100 daily, 400 weekly and 1,000 monthly credits. Daily quota resets at 00:00 UTC and weekly quota on Monday at 00:00 UTC. The exact exhausted period should be confirmed in the dashboard before another deployment. Do not retry deployments while the limit remains active.

Official references:
- https://appdeploy.ai/faq
- https://appdeploy.ai/mcp-docs
- https://oanor.com/api/nairobi-stock-api

## Release policy

1. Deploy only after the platform usage limit permits it.
2. Read the latest AppDeploy snapshot before every further edit.
3. Deploy one coordinated repair set per app, not repeated speculative changes.
4. Check AppDeploy status, validation, frontend/backend/network errors and GitHub CI on the exact current PR head.
5. Run authenticated workflow tests with existing data and preserve rollback capability.
6. Do not merge recovery PRs, migrate data, provision undocumented tables or connect external providers without the necessary evidence and owner approval.
