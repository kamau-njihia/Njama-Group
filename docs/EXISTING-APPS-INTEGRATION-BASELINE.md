# NJAMA GROUP — Existing Applications Integration Baseline

**Assessment date:** 2026-11-17  
**Purpose:** Establish the technical and governance baseline before implementing the NJAMA GROUP parent application.  
**Scope:** Source-level inspection of the current recovery branches. This is not a production readiness certification.

## Governing architecture

NJAMA GROUP is the parent organisation and operating platform. Specialist applications remain independently operable and retain their own identity, records, permissions and workflows. NJAMA INTELLIGENCE is both embedded within each business and available across the group, but may use only data and actions explicitly authorised for the relevant user, role and business.

The owner retains ultimate authority. No payment, approval, communication, financial transaction, tenant action, business commitment or other consequential operation may be executed merely because an AI system recommends it.

Parent visual identity: minimalist, elegant, sophisticated and timeless; Midnight Navy #0B1930, Deep Navy #18365A, Platinum Silver #C5CDD8 and White #FFFFFF. Subsidiaries may retain distinct complementary identities. Multi-currency support is required, with KES as the initial reporting currency.

## Existing application source baseline

### PropertyOS
- App ID: propertyos-evb7jo
- Source recovery branch: `recovery/appdeploy-v36-baseline`
- GitHub PR: https://github.com/kamau-njihia/Property-Os/pull/1
- Source evidence: backend imports AppDeploy `requireAuth`; organisation membership is checked using the authenticated user ID and an organisation ID; records are organised in organisation-scoped tables.
- Integration strengths: role vocabulary covers owners, directors, operations, property/facility managers, accountants, technicians, security, tenants and contractors; organisation membership checks are central to backend access.
- Integration risks to resolve: verify every route applies the correct organisation and role checks; confirm all table catalogs and dynamic table naming are supported; audit tenant/contractor isolation, finance approvals, uploads and background jobs; validate pagination and large-organisation performance.
- NJAMA boundary: PropertyOS remains the specialist property/facilities product. Group dashboards may receive approved summaries, not unrestricted access to tenant or property records.

### Atira
- App ID: greenledger-xfj1js
- Source recovery branch: `recovery/appdeploy-v60-baseline`
- GitHub PR: https://github.com/kamau-njihia/Atira/pull/1
- Source evidence: frontend uses AppDeploy `auth` and `api`; backend imports `requireAuth`; records are stored in tables named by record kind and authenticated user ID.
- Integration strengths: explicit user-scoped record tables; broad finance coverage including income, expenses, investments, budgets, assets, liabilities, accounts, transfers, reconciliations and business records; local-first sync and backup/restore functionality exist in the frontend.
- Integration risks to resolve: audit the complete sync protocol, idempotency and conflict handling; the inspected backend helper scans only a bounded first page when searching for a client ID, so duplicate detection must not be assumed globally complete; test restore and offline recovery with large datasets.
- NJAMA boundary: Atira remains the finance system of record for its own users/businesses. Group-level reporting must use consented, explicitly scoped aggregates and must not silently merge personal and business finances.

### FORGED
- App ID: forged-y36jx3
- Source recovery branch: `recovery/appdeploy-v3-baseline`
- GitHub PR: https://github.com/kamau-njihia/Forged/pull/1
- Source evidence: backend routes use `requireAuth` and derive record-table names from the verified `ctx.user.userId`; list endpoint supports cursor pagination with a maximum page size of 100.
- Integration strengths: authenticated per-user record storage; bounded pagination; user-owned CRUD routes; specialist areas cover mind, body, wealth, leadership, character and purpose/legacy.
- Integration risks to resolve: AI partner context currently reads a bounded first page (100 records), so it must not be treated as a complete history; add compact, user-scoped summaries and test stale-summary rebuilding, pagination beyond 100 records, concurrent updates and payload limits.
- NJAMA boundary: FORGED remains a private personal-development product. Personal journals, reflections and sensitive personal data must never flow into group intelligence or employer/business dashboards by default.

### Business Mastery Academy (BMA)
- App ID: business-mastery-academy-4vpshh
- Source recovery branch: `recovery/appdeploy-v23-candidate`
- GitHub PR: https://github.com/kamau-njihia/BMA/pull/1
- Source evidence: backend imports `requireAuth`; learner progress GET and event POST routes are protected and derive identity from `ctx.user.userId`; a separate learner-progress module uses stable hashed owner/progress/receipt keys and transaction-based writes; lesson generation is a public preview route and validates generated lesson structure.
- Integration strengths: authenticated learner-progress API candidate; duplicate event receipts; server-side lesson structure validation; lesson quiz pass threshold is implemented in the frontend source.
- Blocking dependencies/risks: the platform database catalogs for `learner_progress` and `learner_progress_receipts` have not yet been confirmed as provisioned; reconcile the learner-progress module against the live SDK/database contract before enabling writes; verify account sign-in and safe migration of existing browser-local progress; AI lesson/coaching endpoints still need robust persistent abuse controls; certificates remain previews until server-side issuance and public verification exist.
- Curriculum: `BMA_Comprehensive_Expanded_Curriculum.docx` is the editable master; the corresponding PDF is its reading/print version; `BMA_Full_Curriculummm.docx` is retained as the older/original curriculum.

## Shared platform and group integration requirements

1. Do not assume that sharing one AppDeploy account means applications share a secure database or identity namespace.
2. Do not connect applications by copying raw records into a common table. Define explicit, versioned integration contracts and least-privilege service boundaries.
3. Every cross-app request must identify the authenticated actor, business/organisation scope, purpose, permitted fields and action class.
4. Default group intelligence to read-only, minimum-necessary, purpose-limited summaries. Raw personal, tenant, financial and journal records stay in their source application unless separately authorised.
5. Separate recommendations from actions. Require explicit approval for consequential actions and preserve an auditable approval/receipt record.
6. Use stable IDs, idempotency keys, bounded pagination, retries with reconciliation, schema versions and observable failure states.
7. Design for multiple currencies, time zones, organisations, business types and eventual migration away from AppDeploy. Do not hard-code a single deployment provider into the group domain model.
8. Build group-level identity, membership, role and consent models before cross-app data access. A user may have different roles in different subsidiaries.
9. Provide independent export/backup and tested restore paths for each app before any shared-data migration or cutover.
10. No production merge, deployment, destructive migration, data reset or cross-app data movement without explicit owner approval after test evidence is reviewed.

## Delivery sequence

### Phase A — Complete source and operational audit
- Confirm the authoritative AppDeploy source snapshot and recovery branch for each app.
- Reconcile each recovery branch against the live source and existing production behavior.
- Verify CI on the current branch heads, not merely historical workflow runs.
- Inventory database tables, ownership boundaries, storage objects, secrets, scheduled jobs, webhooks and external providers.
- Produce a verified backup/export and restore test for each app; document any platform limitation.

### Phase B — Specialist application hardening
- Close account-isolation, pagination, idempotency, offline sync, backup/restore and permission gaps.
- Test on Android and desktop, including offline/poor-network conditions.
- Keep each app independently usable and deployable.

### Phase C — NJAMA GROUP foundation
- Implement the group identity, organisation/business registry, membership and role model, consent registry, audit log, integration registry, currency model and group command centre.
- Build against mock/sandbox integration adapters first; do not connect live user records until authorisation and security tests pass.
- Add NJAMA INTELLIGENCE as a permission-aware orchestration layer, not a superuser.

### Phase D — Controlled integrations
- Integrate one specialist application at a time through documented APIs and least-privilege scopes.
- Start with non-sensitive status/aggregate data, then expand only after explicit approval and successful isolation tests.
- Maintain independent operation and rollback for every subsidiary.

### Phase E — Scale and migration readiness
- Test large datasets, pagination, queues, retries, observability, archival, restore and provider failure.
- Keep domain contracts portable so the group can later migrate to independent infrastructure and applications.

## Current status and limitations

The five recovery/foundation pull requests were found open in GitHub during this assessment:
- PropertyOS PR #1
- Atira PR #1
- FORGED PR #1
- BMA PR #1
- NJAMA GROUP foundation PR #1

This assessment confirms source-level patterns and identifies work still required. It does not certify production readiness, prove current live deployment parity, or prove that every CI workflow is passing on the latest branch head. The PRs remain unmerged unless separately verified. No production deployment, data migration, database provisioning or cross-app connection was performed by this assessment.
