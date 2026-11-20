# NJAMA GROUP — Deployment and Ecosystem Status

**Checked:** 2026-11-17  
**Parent app:** NJAMA GROUP  
**AppDeploy ID:** `njama-group-4mpfw2`  
**Live URL:** https://njama-group-4mpfw2.v2.appdeploy.ai/  
**Source branch:** `app/parent-command-centre-v1`  
**Source PR:** https://github.com/kamau-njihia/Njama-Group/pull/2

## Parent application

AppDeploy reports the parent app as `ready`. The returned QA snapshot contains no frontend errors, backend errors or network errors. The current source is synced into this repository branch.

The first stage includes:
- AppDeploy sign-in redirect and startup session restoration.
- Protected identity endpoint.
- Group overview and responsive navigation.
- Directory links to the existing PropertyOS, Atira, FORGED and BMA applications.
- Quick Task and Njama Creations clearly marked as not yet integrated.
- Governance and NJAMA INTELLIGENCE boundaries.
- Empty states rather than fabricated registry, approval, activity or transaction data.

This is an authenticated foundation shell, not the completed persistent group platform. It does not yet store group businesses, member roles, consents, audit events or integrations. It does not access live subsidiary data.

## Existing AppDeploy applications — current status query

| App | AppDeploy ID | Reported deployment state | Current observations |
|---|---|---|---|
| PropertyOS | `propertyos-evb7jo` | Ready | Daily operations cron enabled; last status success and zero failure count. Historical AI report endpoint returned HTTP 429. |
| Atira | `greenledger-xfj1js` | Ready | Validation reports no errors, but four PWA icon dimension warnings remain. Historical market quote requests for the listed Kenyan symbols returned provider 404s. |
| FORGED | `forged-y36jx3` | Ready | Validation reports no errors. Historical auth refresh request returned `invalid_grant`; verify session restoration and account switching. |
| BMA | `business-mastery-academy-4vpshh` | Ready | Repeated historical failures to load `/resources/bma-logo.svg`. Learner-progress table provisioning and frontend account/sync integration remain open. |

All four states above are deployment-host status results, not evidence that every feature has passed live end-to-end testing.

## Required next build stage

1. Obtain AppDeploy's supported database catalog provisioning procedure.
2. Define and provision the NJAMA GROUP tables through that supported process.
3. Implement owner-controlled group registry, business membership, per-business roles, consent, audit receipts and integration registry.
4. Add sandbox adapters and negative permission tests.
5. Reconcile existing recovery PRs and test each app's export/restore and mobile workflows.
6. Obtain explicit owner approval before any production subsidiary data connection or cutover.

## Safety

No existing app was redeployed, modified, reset or migrated during this check. No live subsidiary record was read by NJAMA GROUP. No payment, approval or external business action was executed.
