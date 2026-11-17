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
- Oanor NSE integration is now staged on the same PR branch in commit `05ad4c3a50b06593debd78db05fc20ba1e452d48`: backend-only secret access, documented `/v1/quote` response parsing, maximum 20 tickers/request, sequential batch spacing, per-ticker 60-minute cache, and explicit unavailable states instead of fabricated prices. The secure `OANOR_API_KEY` entry has been created for Atira but is still awaiting the owner to submit the key. This commit has not yet passed a new CI run or been deployed.

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


## 2026-11-17 — second technical audit and integration preparation

### New source changes staged

**PropertyOS** — latest source commit `ae3af0e7d4b0c005c89aba82eb3080b8fa83ed04`; workflow #41 is pending.
- Found the device-lock overlay had been explicitly disabled with a `false &&` condition. Re-enabled the lock and added a checking state; the opening animation is layered above it so the animation finishes before PIN setup/unlock is requested.
- Added cursor-based pagination (maximum 100 rows per request) to the organisation module registers for finance, people, compliance, planning and projects. The UI now loads further pages on demand, merges by record ID, and labels metrics as based on loaded records rather than claiming partial totals are whole-register totals.
- Added controlled edits for existing register records, including people/supplier/contractor entries. The backend uses module-specific field allowlists, role checks, field validation, organisation-scoped property checks and optimistic concurrency on status/updatedAt. This should allow an authorised manager to edit an existing supplier such as Kent Consultants without changing its record ID.
- Made inspection category explicitly required in the UI to match backend validation. Pasted observations remain limited to 10,000 characters and are saved as inspection observations.
- Added regression scenarios for lock enforcement, >100-row registers, existing-record editing, Need a Hand guidance and inspection paste validation.
- Still outstanding: summary/dashboard registers, report source-register reads and scheduled automation still use bounded first-page reads. Scheduled jobs need checkpointed incremental processing; do not solve this by draining all pages in one cron invocation. Report generation can fall back when the AI service returns 5xx, but database write/provisioning failures still require live verification.

**Atira** — latest source commit `7399fdb449490cfe6f49b0146522de016826ec1c`; workflow #52 passed.
- Staged Oanor NSE quote integration using backend secret access only, up to 20 symbols per request, sequential spacing, a 60-minute per-ticker cache and explicit unavailable states. The secure `OANOR_API_KEY` entry is pending owner submission. No key value has been stored yet, and the integration is not live.
- Corrected dashboard and intelligence savings rate to use income minus expenses minus investments.
- Corrected dashboard gain/loss to use total current portfolio value minus total invested capital, not the selected month's contributions.
- Changed the forecast's suggested monthly contribution default to KES 12,000 (this does not alter any saved transaction).
- Added regression tests for savings, portfolio gain/loss and net worth.

**FORGED** — latest source commit `62d96253b8c1d4f929d194fd7678f32847a5337e`; workflow #30 passed.
- Connected the existing backend cursor pagination to the frontend. Users can load older records in pages of 100; page merges are deduplicated by record ID.
- Added a QA scenario for accounts with more than 200 records and user isolation.
- Still outstanding: partner/coach AI context needs a durable user-scoped summary/index rather than a first-100-record context read.

**BMA** — latest source commit `583039660aa2155d1d30a7b157f0934968d173f8`; workflow #108 passed.
- Removed illustrative learner names, sample cohort metrics and sample community activity from Enterprise Academy and Community. These areas now show honest empty states until verified accounts and real records are connected.
- Added a regression scenario to prevent sample records being presented as live activity.
- Authentication and cloud learner-progress sync remain blocked on the supported database-table provisioning procedure. The earlier support request is still the required dependency; do not invent a table-provisioning endpoint or deploy cloud writes until support confirms the supported method.

### Release gate for 18 November 2026
- AppDeploy reported fewer than 16 of 100 daily credits remaining; deployment requires at least 16. Daily reset is `2026-11-18T00:00:00Z` (03:00 Nairobi time). Recheck account quota before deploying; do not retry before the reset.
- PropertyOS workflow #41 must pass before its new source changes are considered release-ready.
- Atira, FORGED and BMA latest workflows have passed. Atira's live Oanor test still requires the owner to submit the API key through the secure AppDeploy entry and a live quote check after deployment.
- BMA remains subject to the database-provisioning support response.
- The NJAMA GROUP parent app exists as a separate deployment, but subsidiary apps are not connected to it. Any 18 November integration should start with permission-aware links and verified read-only status surfaces. Do not share databases, credentials or user records across apps as a shortcut.
- No PRs have been merged, no user databases reset or migrated, and no cross-app data connection has been made.


## 2026-11-17 — PropertyOS accounting and edit follow-up

- Expanded PropertyOS cursor pagination to the accounting registers: chart of accounts, journal entries, journal lines, bank statement rows, payment approvals and the finance transactions used for bank matching. Each page is bounded to 100 rows; the UI merges by record ID and identifies totals/counts as based on loaded records until the remaining pages are loaded.
- Completed the People & Services / Planning & Compliance pagination UI and backend. The separate Finance register also uses this paginated component.
- Added safe field editing for existing People & Services, Finance, Compliance, Planning and Projects records. Field allowlists, validation, role checks, organisation-scoped property references and optimistic concurrency are enforced server-side. This addresses the reported inability to change an existing supplier/contractor record such as Kent Consultants, provided the record is in the organisation's People & Services register and the user has an authorised role.
- Made inspection category required in the UI to match the backend's required validation, preventing a blank category from causing a 400 response when the user pastes an observation.
- Added an AI 502/503 report-generation fallback QA scenario. The existing backend fallback should preserve user notes and save a clearly marked draft when the AI provider is unavailable; database write failures still need live verification.
- PropertyOS dependency validation: workflow #45 failed before TypeScript checks because npm requested unavailable `csstype@3.2.4`. The package was pinned to `csstype@3.2.3` and Rollup `4.68.4`. Workflow #47 then passed npm install, backend syntax validation, frontend type-check and build on the earlier source commit. Workflow #57 is now running on the expanded accounting-pagination source. Do not treat the latest PropertyOS branch as release-ready until #57 (or a later run for its final head) passes.
- Current CI confirmation: Atira workflow #52 passed; FORGED workflow #30 passed; BMA workflow #108 passed. These are source validations, not live AppDeploy deployments.

### PropertyOS final validation update
- Workflow #57 completed successfully on the latest audited PropertyOS source commit `a2d1b90ae6193d96985af29c39d2cb46593074b4`: npm install, backend syntax validation, TypeScript type-check and production build all passed. This covers the register editing, inspection category validation, accounting cursor pagination and dependency pins described above.


## 2026-11-17 continuation — NSE provider and pre-integration checks

### Atira / Oanor NSE provider
- The Atira recovery PR branch `fix/atira-sync-acknowledgements` contains a server-only Oanor NSE quote adapter using the AppDeploy secret `OANOR_API_KEY`, batched NSE tickers (up to 20 per request), 60-minute in-process quote caching, KES normalization, source/timestamp metadata, and an explicit unavailable result rather than fabricated prices.
- Commit `3721a37b5126bafe52452e5278ab236e2f8af9cf` corrects the market-group and watchlist response provider labels so they no longer incorrectly report Yahoo Finance for NSE data. GitHub Actions run #54 completed successfully: backend syntax, frontend type-check, IndexedDB backup-import tests, PWA validation and production build all passed.
- A secure AppDeploy secret-entry record was created for existing app `greenledger-xfj1js`; it is pending user entry. No key value is visible to ChatGPT and no secret has been bound or deployed yet.
- **Provider quota correction (supersedes the previous note):** Oanor's official NSE API pricing page lists a free API tier of 7,500 calls/month, 2 requests/second, no credit card and a hard 429 quota cap. Its page also advertises 10 free browser test calls/day, and one FAQ line conflicts with the plan table (100 calls/month / 1 request per second). Treat the plan table as the published free-tier offer but verify the actual account quota with a live test before release. Do not enable a paid plan. Handle 401/402/429 and provider failures as unavailable data, never as a zero price or stale live quote.
- NSE historical charts and NSE symbol search still use the existing Yahoo endpoints and may fail for Kenyan tickers; do not represent Oanor's quote endpoint as providing historical prices unless its documented endpoint supports that.

### Cross-app release readiness
- Latest live status checks: PropertyOS, Atira and FORGED remain `ready` with no frontend/backend errors in their latest QA snapshots. BMA remains on snapshot `1793425368735`; its known live logo-resource error is still present because the corrected inline-SVG source has not been deployed.
- The AppDeploy deployment preflight returned `CREDITS_USAGE_LIMIT_REACHED`. The account reports approximately 900.34 monthly credits remaining, but the tool does not expose which simultaneous daily/weekly/monthly quota triggered the rejection. The next daily reset is `2026-11-18T00:00:00Z` (03:00 Africa/Nairobi); the weekly quota resets Monday, so a daily reset alone is not a guarantee that deployment will be allowed. Recheck the quota before deploying; do not repeatedly retry. Existing deployed apps remain intact.
- BMA's recovery branch contains authenticated progress API candidates and validation tests, but production writes remain blocked pending AppDeploy's supported database table-catalog provisioning instructions. Do not guess a provisioning endpoint or migrate local learner progress.
- PropertyOS still has first-page-only reads in automation, overview aggregates, tenant identity lookup and accounting summary paths. Generic register and accounting-register endpoints have cursor support, but this does not eliminate the remaining 100-record truncation risks. A robust cron/checkpoint design is still required before claiming large-portfolio readiness.
- FORGED frontend and record API support cursor pagination, but its AI accountability/partner context still reads only the first 100 records. Stage a bounded, cursor-aware context fix and tests before release.
- No deployment, PR merge, database migration, account reset, or cross-app data connection was performed by this continuation.


### Additional staged repair commits — 17 November
- Atira PR branch received commit `3721a37b5126bafe52452e5278ab236e2f8af9cf` to correct provider metadata for NSE market-group and watchlist responses. The Oanor quote adapter itself was already present in the recovery branch. This is GitHub source only; it is not live.
- FORGED PR branch received commit `847d9bc9e7e362427ddc054daf0a5f9cca2482be`: the accountability partner now refuses to generate a report when the first 100-record read has a continuation token, rather than silently coaching from incomplete history or scanning an unbounded history on every AI request. A recent-activity summary/index remains the proper scale fix. This is GitHub source only; it is not live.
- The latest observed FORGED PR head is `847d9bc9e7e362427ddc054daf0a5f9cca2482be`. GitHub Actions run #34 completed successfully: backend syntax, TypeScript check and production build all passed.


### Register pagination and provider-quota hardening — 17 November
- PropertyOS PR branch now adds cursor-based “Load more records” to the remaining generic organisation register in `src/App.tsx`, matching the already paginated `PropertyOperations` register. Its page-level totals are relabelled as loaded counts to avoid presenting a first-page count as the organisation-wide total. Commit: `900c562009719e369bde86092c6d620732852890`. The current workflow lookup has not yet returned a CI result for this commit; keep it staged and unmerged until validated.
- Atira Oanor warm-instance cache was first raised to eight hours while the provider quota was being rechecked, then set to 60 minutes for a better freshness/free-tier balance in commit `9559c1b7103f8a9544411035db22ba2f10303512`. CI for this latest commit is still to be checked. The 60-minute cache is in-process, not a strict global quota: serverless cold starts can reset process memory. Oanor's hard free-tier cap remains the final safeguard; no paid plan is enabled or authorised.


### PropertyOS report and register hardening — 17 November
- PropertyOS generic organisation register now requests 100-record cursor pages and exposes a “Load more records” action; page-scoped counts are labelled as loaded counts. Commit `900c562009719e369bde86092c6d620732852890`.
- PropertyOS management-report generation now falls back to a clearly labelled manual-review draft for any AI-provider error, including provider-side 4xx/429/5xx, after input, property and permission validation have succeeded. User-supplied observations are retained and source-register references are marked as needing verification. Commit `d6a608fafe2edcbf5e827c43d2063aa1b8f61367`.
- These PropertyOS commits are staged on the existing recovery PR branch. GitHub Actions run #63 completed successfully: backend syntax, TypeScript check and production build all passed. The changes remain staged and unmerged.
- The report builder, automation cron, overview aggregates and tenant email lookup still have first-page limits. The above fixes improve the generic register and report failure handling but do not remove all large-portfolio truncation risks.


### Atira calculation audit — 17 November
- Source review confirms the Atira recovery branch computes period savings as income minus expenses minus investment contributions; total return percentage as current investment value minus total invested capital, divided by invested capital; and net worth as manual assets plus current portfolio value minus liabilities. The explanatory copy explicitly states that portfolio value is counted once and contributions are not added again. This matches the approved calculation rules. This was a source review, not a live-account data reconciliation.


### Oanor quota re-verification — 17 November
- The official Oanor NSE API page at `oanor.dev/api/nairobi-stock-api` now lists a Free tier of 7,500 calls/month, 2 requests/second, no credit card and a hard quota cap. The same page separately advertises 10 free browser test calls/day and contains an inconsistent FAQ line stating 100 calls/month / 1 request per second. The release checklist therefore requires a live test of the actual free account quota before rollout; do not enable paid usage.
- Atira's latest Oanor cache setting is 60 minutes in commit `9559c1b7103f8a9544411035db22ba2f10303512`. This supersedes the temporary 8-hour setting. The secret-entry form remains pending and no API key has been stored.
