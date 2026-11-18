# NJAMA GROUP — Foundation Architecture Charter

**Status:** Governing foundation document  
**Scope:** Parent group, subsidiary applications, shared intelligence, engineering standards and future migration  
**Production policy:** No production changes, data resets, destructive migrations or deployments without explicit owner approval and verified rollback safeguards.

## 1. Group model

NJAMA GROUP is the parent organisation. NJAMA INTELLIGENCE is the group's intelligence capability, present inside individual businesses and across the group.

The operating model is a federation of independent specialist businesses and applications—not one generic application with interchangeable modules. Each business owns its specialist workflows, operating decisions, data and identity. Group coordination happens through authorised interfaces and shared intelligence.

The owner retains ultimate authority. No business action, financial action, external communication or consequential workflow is to be executed without the required authority and permission.

## 2. Portfolio boundaries

The current application portfolio includes:

- **PropertyOS:** property and facilities operations, including property management.
- **Atira:** personal and business financial tracking and intelligence.
- **FORGED:** personal development, performance and growth.
- **Business Mastery Academy (BMA):** business education, curriculum and coaching.
- **NJAMA GROUP:** parent-level governance, portfolio visibility and group coordination.

Specialist businesses include Quick Task Errands & Cleaning Services and Njama Creations. Property management remains the property-management business and is represented by PropertyOS / the future Njama Property Managers operation. These businesses should not be flattened into generic modules.

## 3. Independence and group intelligence

Each subsidiary must retain:

- Its own specialist user experience and visual identity.
- Its own business rules, roles, permissions and operational workflows.
- A separately controlled data boundary.
- The ability to operate independently if group-level services are unavailable.
- Explicit interfaces for authorised group-level reporting and coordination.

NJAMA INTELLIGENCE may operate both inside a subsidiary and across NJAMA GROUP. Cross-group intelligence must use permission-aware APIs, approved event feeds or explicitly authorised data products. It must not have unrestricted access to every subsidiary database.

AI-generated recommendations are not approvals. Any action with financial, legal, operational, privacy or external consequences must follow the relevant permission and approval workflow.

## 4. Identity and design direction

Parent identity:

- Midnight Navy: `#0B1930`
- Deep Navy: `#18365A`
- Platinum Silver: `#C5CDD8`
- White: `#FFFFFF`

The parent mark should be a distinctive, memorable standalone **N** emblem, with restrained metallic silver and subtle gold accents on a dark/navy foundation. Typography should be clean, refined and well spaced. The visual language is simple, elegant, minimalist, sophisticated and timeless—not flashy or overdesigned. Avoid excessive glow, complex globes, competing effects, busy gradients and unnecessary ornament.

Subsidiaries may use their own complementary visual identities.

## 5. Architecture principles

The long-term target is a set of independently deployable applications and services with clear ownership boundaries.

- Frontends may use React and TypeScript where appropriate, subject to verification against each recovered application's actual source.
- Backend services must be independently deployable and documented.
- Each business must have an explicit data ownership and access model.
- Database technology must be selected after workload, consistency, tenancy, cost, operational and migration requirements are documented. PostgreSQL is a candidate, not an assumption.
- Object storage must support private files, controlled access, durable backups and attachment integrity.
- Background work must use durable queues and observable workers rather than relying on a user's browser session.
- Scheduled jobs must be idempotent, observable and safe to retry.
- APIs must be versioned, authenticated, authorised, rate-limited where appropriate and documented.
- Secrets must be stored in managed secret facilities, never committed to source control.
- Logging and monitoring must avoid exposing credentials or unnecessary personal data.

## 6. Scale and reliability

The platform should be designed to grow into international operations and millions of records. There must be no arbitrary application-level record ceiling.

Required engineering practices include:

- Cursor-based pagination for all potentially large collections.
- Indexes designed around real query patterns and tenant boundaries.
- Bounded queries, batch processing and back-pressure.
- Durable queues for expensive or long-running work.
- Idempotency keys for retryable operations and external side effects.
- Data retention, archival and recovery policies.
- Observability for latency, failures, queue depth, storage and database capacity.
- Load and failure testing before major scale claims are accepted.

Scale must be demonstrated by measurement and tests, not promised by architecture diagrams alone.

## 7. Security and governance

- Enforce authentication and role-based authorisation on server-side routes.
- Enforce organisation, business and user data boundaries on every read and write.
- Treat the browser as untrusted; do not rely on frontend-only permissions.
- Validate and constrain inputs, uploads and AI prompts.
- Protect AI endpoints against unauthorised use and abuse.
- Keep audit trails for approvals and consequential actions.
- Use least-privilege access for people, services and AI agents.
- Keep production and development environments separate.
- Do not expose secrets, private tenant data or financial records in logs or public repositories.

## 8. Current source recovery baselines

The following AppDeploy snapshots are the recovery baselines identified during technical discovery:

| Application | AppDeploy app ID | Baseline |
|---|---|---|
| PropertyOS | `propertyos-evb7jo` | v36 |
| FORGED | `forged-y36jx3` | v3 |
| BMA candidate | `business-mastery-academy-4vpshh` | v23; provisional pending comparison with other BMA entries |
| Atira | `greenledger-xfj1js` | v60 |

The build-manifest/source snapshots are not production database backups. They do not prove recovery of live accounts, cloud records, uploaded documents, secrets or external service configuration.

## 9. Migration and release controls

Migration must follow this sequence:

1. Recover and preserve complete source snapshots.
2. Inventory databases, records, attachments, auth, integrations, secrets, scheduled jobs and user-specific local data.
3. Take verified, restorable backups of production data and configuration.
4. Build the independent stack in an isolated staging environment.
5. Restore a copy of production data and attachments.
6. Reconcile record counts, financial totals, relationships, permissions and file checksums.
7. Test authentication, authorisation, offline behaviour, integrations, notifications, jobs, exports and restore procedures.
8. Conduct user acceptance and security testing.
9. Obtain explicit owner approval for cutover.
10. Keep a tested rollback path and preserve the existing AppDeploy environment until the new system is proven.

No production cutover is authorised by this charter alone.

## 10. Repository and engineering workflow

Each application has its own private source repository, except the parent NJAMA GROUP repository whose visibility must be reviewed before confidential implementation material is added.

Use separate recovery, development and release branches. Every change should have a clear commit message, reviewable diff, tests and deployment notes. Protect the production branch. Exclude credentials, user data, private exports and generated build artifacts unless there is a documented reason to include them.

A recovered source baseline is not a verified build. A source-level patch is not a completed test. A successful staging test is not production approval. Reports must distinguish these states accurately.

## 11. Open decisions

The following remain to be verified or approved before independent production infrastructure is selected:

- Definitive BMA master application among the existing AppDeploy entries.
- Full binary curriculum/resource recovery for BMA.
- Per-application framework, runtime and dependency verification.
- Database and object-storage selection based on measured requirements.
- Hosting regions, data residency and international compliance obligations.
- Backup retention, recovery-point and recovery-time objectives.
- Authentication provider and cross-application identity strategy.
- Group-wide event contracts and intelligence permissions.
- Cost model and operational ownership for independent infrastructure.
