# NJAMA GROUP engineering recovery status

**Status date:** 17 November 2026  
**Scope:** Source recovery, static repairs and CI validation only. This document is not a production deployment approval.

## Current GitHub review queue

| Product | Source branch | Draft pull request | CI status | Outstanding priority |
|---|---|---|---|---|
| Atira | `fix/atira-sync-acknowledgements` | [PR #1](https://github.com/kamau-njihia/Atira/pull/1) | Passed: TypeScript, 5 IndexedDB tests, Vite build | Browser/device sync QA; account-scoped restore and real backup testing |
| FORGED | `recovery/appdeploy-v3-baseline` | [PR #1](https://github.com/kamau-njihia/Forged/pull/1) | Passed: frontend/backend TypeScript, Vite build | >100-record tests; AI context index; session recovery and backup |
| PropertyOS | `recovery/appdeploy-v36-baseline` | [PR #1](https://github.com/kamau-njihia/Property-Os/pull/1) | Passed: frontend TypeScript, Vite build | Audit/repair fixed 100-row reads, especially tenant lookup and scheduled jobs |
| BMA | `recovery/appdeploy-v23-candidate` | [PR #1](https://github.com/kamau-njihia/BMA/pull/1) | Passed: frontend/backend TypeScript, 4 lesson-validation tests, service-worker syntax and Vite build | Three binary curriculum resources awaiting upload; learner accounts/progress; persistent AI abuse controls; performance and offline/device QA |
| NJAMA GROUP | `foundation/group-architecture-charter` | [PR #1](https://github.com/kamau-njihia/Njama-Group/pull/1) | Documentation-only | Review group architecture charter and implementation gates |

## Important source and repair notes

### Atira
- AppDeploy source v60 recovered.
- Sync acknowledgements are retained until confirmed by the server.
- Backup import uses one IndexedDB transaction, preserves stores missing from older backups, and restores/reconstructs the sync queue safely.
- Five automated IndexedDB regression tests pass.

### FORGED
- AppDeploy source v3 recovered.
- The records API now uses opaque cursor pagination (page size 1–100); the UI can load older records without replacing already loaded pages.
- AI partner/coach context remains bounded and needs a reliable per-user recent-activity index.

### PropertyOS
- AppDeploy source v36 recovered.
- The original App.tsx was 2,497 lines; the first capture stopped at the 2,000-line read limit. The remaining 497 lines were restored from AppDeploy.
- The fixed 100-row reads remain a major scale and tenant-access risk; the existing issue lists the high-risk endpoints.

### BMA
- v23 is the provisional source master after comparing the older offline-focused candidate; older app histories remain preserved.
- Offline resource caching and failure-tolerant background pre-caching are implemented; public AI input/cache validation has been improved.
- The PDF and two DOCX originals are verified in the user's Library; checksums are recorded in [the BMA resource manifest](https://github.com/kamau-njihia/BMA/blob/recovery/appdeploy-v23-candidate/docs/BMA-RESOURCE-MANIFEST.md).
- The three resources have not yet been uploaded or bound to the app. Do not claim offline curriculum access is complete until they are attached and tested.

## Production safety gates

- All listed pull requests are drafts and remain unmerged.
- No production AppDeploy deployment has been performed.
- No production database, user account, authentication state or stored attachment has been migrated, reset or deleted.
- Build-manifest ZIPs and source recovery branches are not substitutes for restorable production database and attachment backups.
- Before any coordinated production cutover: verify backups and restore tests, complete security and scale tests, complete Android/browser QA, reconcile records and attachments, obtain explicit cutover approval, and document rollback.
