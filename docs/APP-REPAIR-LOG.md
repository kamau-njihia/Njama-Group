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
- Oanor NSE integration is now staged on the same PR branch in commit `05ad4c3a50b06593debd78db05fc20ba1e452d48`: backend-only secret access, documented `/v1/quote` response parsing, maximum 20 tickers/request, sequential batch spacing, per-ticker 30-minute cache, and explicit unavailable states instead of fabricated prices. The secure `OANOR_API_KEY` entry has been created for Atira but is still awaiting the owner to submit the key. This commit has not yet passed a new CI run or been deployed.

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
- Owner approval for Oanor has now been given. The integration code is staged in the Atira PR branch, but it is not live. The secure AppDeploy entry for `OANOR_API_KEY` is pending owner submission; the API key must never be pasted into chat or source code. Oanor's published free tier advertises 7,500 calls/month, 2 requests/second and a hard quota cap. No paid subscription is intended. Before release, confirm the secret is stored, run a live quote test, verify KES currency/timestamps and confirm missing symbols remain unavailable rather than being fabricated.
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

The AppDeploy account is on the Free plan. The account query showed approximately `900.34` monthly credits remaining, but AppDeploy confirmed that fewer than 16 of the 100 daily credits remain, below the 16-credit minimum for a deployment. New deployments are paused until `2026-11-18T00:00:00Z` (03:00 Nairobi time on 18 November). Free limits apply simultaneously: 100 daily, 400 weekly and 1,000 monthly. Do not retry before the reset; then re-check current quota before any deployment.

Official references:
- https://appdeploy.ai/faq
- https://appdeploy.ai/mcp-docs
- https://oanor.com/api/nairobi-stock-api

## NJAMA GROUP integration position

The NJAMA GROUP parent app is already present as a separate deployed AppDeploy app (`njama-group-4mpfw2`). It is not yet connected to the subsidiary apps or their databases. Tomorrow's integration must begin with permission-aware app links and verified read-only status surfaces; do not merge user data, share credentials or connect databases as a shortcut. Each subsidiary retains its own account boundary and source-of-truth database.

## Release policy

1. Deploy only after the platform usage limit permits it.
2. Read the latest AppDeploy snapshot before every further edit.
3. Deploy one coordinated repair set per app, not repeated speculative changes.
4. Check AppDeploy status, validation, frontend/backend/network errors and GitHub CI on the exact current PR head.
5. Run authenticated workflow tests with existing data and preserve rollback capability.
6. Do not merge recovery PRs, migrate data, provision undocumented tables or connect external providers without the necessary evidence and owner approval.
