# NJAMA GROUP — Controlled Integration Contracts

**Status:** Design baseline staged for review; no live subsidiary data connection is enabled.  
**Parent application:** https://njama-group-4mpfw2.v2.appdeploy.ai/  
**Parent AppDeploy ID:** `njama-group-4mpfw2`

## 1. Purpose and non-negotiable boundaries

NJAMA GROUP is the group command centre for independently operated specialist businesses and platforms. It coordinates governance and approved group-level visibility; it is not a shared database into which subsidiary records are copied.

Each subsidiary remains independently operable, with its own source-of-truth database, authentication boundary, roles, backups, and specialist workflows. Group access is opt-in, purpose-limited, revocable, and read-only by default.

The owner retains ultimate authority. Recommendations are not approvals. No payment, tenant action, financial posting, message, contract, business commitment, or other consequential action may be executed by NJAMA INTELLIGENCE without a separate, explicit approval flow and an auditable receipt.

## 2. Application and business register

The parent directory must distinguish operating businesses from shared/group platforms. An app is not automatically a subsidiary business merely because it is deployed.

| Business or platform | Role in the group | Permitted first integration surface | Excluded by default |
|---|---|---|---|
| Njama Property Managers (PropertyOS) | Property-management business; PropertyOS is its specialist operating application | Read-only operational summary: property count, work-order counts by status, maintenance/compliance exceptions, and approved high-level finance totals | Tenant names/contact details, unit-level access records, bank details, documents, access credentials, and unapproved arrears/financial detail |
| Quick Task Errands & Cleaning Services | Independent service business | No live data until its own application, business identity, roles, and approved summary contract exist | Customer addresses/contact details, staff personal data, job notes, payment details |
| Njama Creations | Independent creative business | No live data until its own application, business identity, roles, and approved summary contract exist | Client briefs, creative source files, personal data, unpublished work, pricing/contract terms |
| Atira | Finance and wealth platform, not automatically a group business | Only explicitly selected business-owned records or owner-approved business aggregates | Personal finance, personal accounts, private assets/liabilities, and any record not explicitly classified as group-business data |
| FORGED | Private personal-development platform | No group feed by default; no journal/body/reflection data | All private personal-development records and sensitive personal data |
| Business Mastery Academy | Learning platform | Only approved aggregate programme metrics if later authorised | Individual learner records, assessments, personal learning history and certificates |

PropertyOS remains the property-management application. The future business identity is Njama Property Managers. Do not create a second PropertyOS database or duplicate the business's records to represent the business.

## 3. Integration envelope

Every future cross-application request must be authenticated and carry a server-validated envelope with:

- `contract_version`: explicit version such as `1`.
- `request_id`: stable idempotency identifier.
- `actor_id`: verified group actor; never trusted from an unverified client field.
- `source_app` and `target_app`.
- `business_id`: the exact business scope.
- `purpose`: a declared and allow-listed purpose.
- `requested_fields`: an allow-listed minimum field set.
- `consent_id`: current, unrevoked permission covering this actor, business, purpose and fields.
- `issued_at` and `expires_at`: short-lived request validity.
- `action_class`: `read_summary` initially; any write/action class requires a separate design and approval.

The target application must independently authenticate the caller and validate the actor, scope, consent, purpose, and field allow-list. The parent app's sign-in session alone does not grant access to a subsidiary.

## 4. Initial read-only summary response

The first integration milestone is limited to a small, versioned summary response. Example shape (illustrative contract only; not a live endpoint):

```json
{
  "contract_version": 1,
  "source_app": "propertyos",
  "business_id": "approved-business-scope",
  "generated_at": "ISO-8601 timestamp",
  "currency": "KES",
  "summary": {
    "properties_count": 0,
    "open_work_orders_count": 0,
    "overdue_work_orders_count": 0,
    "compliance_exceptions_count": 0
  },
  "data_quality": {
    "complete": false,
    "as_of": "ISO-8601 timestamp",
    "notes": ["Illustrative schema only; not production data"]
  }
}
```

The target service must return an explicit completeness state and timestamp. A partial, stale, unavailable, or permission-denied response must never be displayed as a complete zero-value result. Do not infer global totals from a first page of records.

## 5. Identity, roles, consent and audit requirements

- Group membership and subsidiary membership are separate. A group member does not automatically gain a role in every business.
- Roles are scoped to a specific business and capability. The group owner may delegate access, but delegation must be explicit and revocable.
- Consent records must identify the granting authority, recipient/actor, business, purpose, fields, expiry and revocation state.
- Every successful read and every denied request must produce an audit event containing the actor, source/target app, business scope, purpose, contract version, request ID, result and timestamp. Do not log secrets or unnecessary personal data.
- Revocation must take effect at the target service, not only hide a parent-app card.
- The parent must not impersonate a user or reuse another app's browser token, API key, session cookie or service secret.

## 6. Failure and security behaviour

Default deny on missing identity, missing/expired/revoked consent, unknown business scope, unknown fields, invalid purpose, stale contract version, incomplete reads, or upstream errors.

Use bounded pagination and checkpointed processing in source applications. Do not scan entire growing tables on every dashboard request or cron run. Use stable IDs, idempotency keys, bounded retries, explicit conflict handling and observable failure states.

No direct cross-app database reads, shared database tables, bulk data copies, or shared credentials are permitted as an integration shortcut. Large/private source records remain in their originating application.

## 7. Platform prerequisites before enabling live connections

1. AppDeploy must confirm the supported provisioning process for each required table catalog. The SDK documentation states that missing table catalogs are provisioned separately before application writes; do not invent an endpoint or attempt first-write provisioning.
2. Implement persistent group organisation/business registry, group membership, business-scoped roles, consent, integration registry and append-only audit records.
3. Confirm the target app's supported server-to-server authentication mechanism and secret storage. Do not rely on a shared end-user browser session.
4. Implement and test the first read-only adapter against a sandbox/test identity and synthetic fixtures only.
5. Run positive and negative permission tests, including cross-business access denial, revoked consent, expired requests, unknown fields, incomplete pagination, duplicate request IDs and upstream outage.
6. Obtain owner review of the exact fields and purpose before enabling a production business connection.
7. Keep each app independently usable and document rollback and revocation.

## 8. Delivery order

1. Complete group identity, business registry, scoped roles, consent and audit foundations.
2. Verify the PropertyOS read-only operational summary contract first, because PropertyOS is the existing property-management system of record.
3. Add Atira only for explicitly classified business-owned financial aggregates; personal finance remains excluded.
4. Add BMA only for approved aggregate learning metrics.
5. Keep FORGED private and disconnected from group reporting.
6. Build Quick Task and Njama Creations as independent specialist businesses before integrating their data.
7. Add further business-specific integrations one at a time, with separate permission tests and owner review.

## 9. Current implementation status

- The NJAMA GROUP parent command-centre app is deployed and AppDeploy currently reports it as `ready`.
- The deployed foundation provides sign-in/session restoration, a protected identity endpoint, navigation, and links to existing applications.
- The parent UI intentionally shows empty states and labels the group registry/integrations as not configured.
- No persistent group registry, membership/consent/audit database, cross-app API, live subsidiary data read, data migration, shared credential, or write integration is enabled.
- The next implementation gate is supported database catalog provisioning plus the authenticated group identity/consent/audit model. Until that gate is satisfied, only application directory links and clearly labelled, non-live status information may be shown.
