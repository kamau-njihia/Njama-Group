# NJAMA GROUP — Master Development & Implementation Blueprint

**Status:** Full-scope parent-platform implementation deployed to the existing AppDeploy application. Persistent business registers remain gated pending supported AppDeploy database table-catalog provisioning.

## 1. Identity and governing principle

**Official principle:** **Distinct in purpose. United in strength. Boundless in ambition.**

**Visual identity**
- Royal Navy: `#142D65`
- Electric Cobalt: `#356BFF`
- Champagne Gold: `#D6B66E`
- Platinum: `#D9E2F2`
- White: `#FFFFFF`
- Midnight: `#111827`

The identity is a combination of modern technological power, international prestige and futuristic ambition. Use a distinctive standalone N emblem, refined typography, strong contrast and restrained metallic accents. Avoid excessive glow, ornamentation, competing effects and busy gradients.

## 2. Corporate model and governance

NJAMA GROUP is both:
1. A holding company that owns and oversees subsidiaries, protects group assets, establishes governance and allocates capital.
2. An actively managed operating group that coordinates strategy, finance, performance, shared services, technology and intelligence.

The group must be able to function effectively when the owner is absent. Executives receive meaningful delegated authority and remain accountable for outcomes. Ownership and reserved matters remain with the owner.

Reserved matters include major acquisitions and disposals, ownership changes, substantial borrowing, major capital commitments, new subsidiary creation, material changes to group strategy and other defined high-impact decisions.

Subsidiaries remain operationally independent. The parent coordinates direction and shared capabilities without taking over routine specialist decisions.

## 3. Founding business portfolio

The initial portfolio is:
- **Quick Task Errands & Cleaning Services** — errands, cleaning, workforce scheduling, service delivery, customer experience and quality control.
- **Njama Creations** — an independent creative enterprise with its own production, client, project and commercial workflows.
- **Njama Property Managers** — the property-management business, with specialist property, tenant, facilities and financial operations.

Each subsidiary should have its own leadership, customers, employees, workflows, budgets, financial records, assets and performance targets.

Existing applications such as PropertyOS, Atira, FORGED and Business Mastery Academy are separate systems in the wider user ecosystem. They are not automatically subsidiaries and are not connected to NJAMA GROUP data. No shared credentials or cross-app data access are enabled.

## 4. Group departments

Shared group functions:
1. Group Executive Office — governance, strategy, leadership and performance.
2. Finance & Investments — consolidated accounting, treasury, budgets, capital allocation and investment analysis.
3. NJAMA INTELLIGENCE — research, analysis, forecasting, risk signals and decision support.
4. Technology & Innovation — applications, infrastructure, cybersecurity, data and innovation.
5. Human Capital — recruitment, development, performance, rewards, culture and succession.
6. Legal & Compliance — corporate governance, contracts, regulatory obligations and legal risk.
7. Strategy & Expansion — market research, new ventures, partnerships, acquisitions and international growth.

Centralize shared expertise and oversight; decentralize specialist execution.

## 5. Financial architecture

Use a hybrid decentralized finance model with centralized group oversight.

- Each subsidiary maintains distinct books, income, expenses, assets, liabilities, receivables, payables, budgets and cash-flow records.
- The parent consolidates authorized group reporting and coordinates treasury, capital allocation, risk and investment.
- Support multiple transaction currencies from the beginning. Preserve original amount, currency, exchange rate and conversion date. Initial group reporting currency is KES.
- Track intercompany loans, shared-service charges, internal purchases and sales, capital contributions, dividends and reconciliations.
- Capital allocation should be based on strategic value, expected returns, risk, cash-flow needs and growth potential, not equal distribution.
- Routine subsidiary spending follows approved budgets. Major investments and reserved matters require the appropriate group authorization.
- Financial figures must come only from verified records. No sample balances or invented transactions.

## 6. NJAMA INTELLIGENCE

NJAMA INTELLIGENCE is an intelligence ecosystem, not merely a chatbot.

**Two connected levels**
- Business intelligence embedded within each subsidiary and specialized for its industry, processes, risks and commercial model.
- Group intelligence that supports leadership with consolidated, authorized information and strategic analysis.

**Five operating capabilities**
1. Observe — authorized information and verified sources.
2. Understand — context, patterns and relationships.
3. Predict — forecasts, risks, opportunities and scenarios.
4. Recommend — practical options, priorities and trade-offs.
5. Execute with authority — only within delegated limits and with explicit approval for consequential actions.

It must distinguish verified facts, assumptions, forecasts and recommendations. It must not claim access to disconnected records or execute payments, approvals, hiring, contracts, acquisitions or commitments without authorization.

The architecture should support multiple AI models, specialist agents, private knowledge bases, multilingual use, voice, forecasting and future provider migration.

## 7. Human capital and culture

Recruit for competence, integrity, problem-solving, adaptability, communication and leadership potential. Develop people through professional training, mentorship, continuous learning and internal career progression.

Measure productivity, outcomes, integrity, innovation, collaboration and development. Use fair remuneration, performance rewards, recognition and appropriate long-term incentives.

Every critical leadership position requires documented authority, performance review, succession coverage and continuity planning.

Cultural pillars: Integrity, Excellence, Innovation, Respect, Accountability and Growth.

## 8. Legal, compliance and expansion

Use a progressive structure: NJAMA GROUP as parent; subsidiaries incorporated separately where appropriate; business units may operate within a subsidiary until separate incorporation is justified.

Document shareholding, beneficial ownership, directors, shareholder rights, reserved matters and intercompany agreements.

The parent should protect core group intellectual property and grant subsidiaries appropriate usage rights. Subsidiary-created specialist IP must have documented ownership and licensing.

Maintain contracts, licences, tax, employment, privacy, competition, industry regulation, data retention, cross-border transfer and breach-response controls in each jurisdiction. Obtain qualified local legal and tax advice before incorporation, transactions or market entry.

Expansion should proceed through market assessment, due diligence, local legal structures and appropriately governed partnerships or acquisitions. International growth must be controlled and financially disciplined.

## 9. Technology and infrastructure

Build for independent subsidiary applications plus a central parent command platform. The group must own its data and retain export, migration and restoration capability.

Requirements:
- Independent applications and modular services.
- Secure APIs and documented integration contracts.
- Central identity with business-scoped roles.
- Relational/persistent data architecture and bounded pagination.
- Encrypted storage and transport.
- Multi-factor authentication, session and device controls.
- Audit logs, backup, restoration and disaster recovery.
- Monitoring, load testing and automated scaling.
- Provider-independent AI orchestration.
- Migration away from AppDeploy without losing data or source code.

Design for large record volumes and international operations, but prove capacity through testing rather than assumptions.

## 10. Security, permissions and integration rules

- Least-privilege access by user, role, business and purpose.
- Business membership does not automatically grant access to another subsidiary.
- Group intelligence only sees information explicitly permitted by policy and the user's authority.
- Aggregate data where individual records are unnecessary.
- Sensitive access and consequential actions must be audited.
- Revoke permissions promptly when roles or employment change.
- Cross-app integrations require target-side authentication, explicit owner-approved fields and purpose, narrow read-only contracts first, consent records, audit logs and negative permission tests.
- No shared credentials or uncontrolled database connections.

## 11. Current implementation record

**Existing application retained**
- App ID: `njama-group-4mpfw2`
- URL: https://njama-group-4mpfw2.v2.appdeploy.ai/
- GitHub repository: `kamau-njihia/Njama-Group`
- Development branch: `app/parent-command-centre-v1`
- Existing draft PR: #2 (keep draft; do not merge without a separate decision).

**Deployed parent-platform capabilities**
- Existing AppDeploy authentication and owner identity.
- Branded opening animation and in-app Back/Next history.
- Responsive mobile, laptop and desktop navigation.
- Overview, Businesses, Departments, Finance, People, NJAMA INTELLIGENCE, Governance, Legal & Risk, Technology, Activity and Settings areas.
- Founding portfolio and group department structure.
- Server-side platform role ladder: owner, admin, business_director, finance_lead, department_lead, staff, auditor.
- Platform-managed invitations, scoped roles, approval decisions and audit-write design.
- AI-assisted strategic intelligence with explicit no-live-data disclosure.
- Multi-currency finance register design and approval workflow.
- Legal and risk register design.
- Existing ecosystem app links, clearly labelled as unconnected.

**Persistent-data gate**
The app source is prepared for two AppDeploy database table catalogs:
- `njama_records`
- `njama_audit`

AppDeploy's supported catalog-provisioning process must be obtained and both catalogs provisioned before live records, finance, approvals, risk, legal and audit writes are enabled. The app deliberately blocks writes rather than using browser-only storage or fabricating data. Do not invent a table-creation endpoint.

**Not yet active**
- Live persistent group registers until catalogs are provisioned.
- Cross-app data reads/writes or subsidiary database connections.
- Payments, bank feeds, external market feeds, automated legal filings or unapproved external services.
- Legal incorporation, licences or international entities; these require real-world professional execution.
- Production-scale certification; load, security, disaster-recovery and multi-user acceptance tests remain necessary.

## 12. Release and acceptance policy

- Preserve the existing AppDeploy app ID, authentication and existing records.
- Never reset, delete or migrate data without explicit approval and a verified migration plan.
- Deploy coordinated changes, not speculative repeated releases.
- Validate frontend, backend, network, permissions and mobile/desktop workflows.
- Test with authenticated owner, executive, business-scoped and read-only roles.
- Keep cross-app connections disabled until approved and tested.
- Do not call the organisation fully production-ready until database catalogs, real user workflows, legal compliance, security and recovery have been verified.
