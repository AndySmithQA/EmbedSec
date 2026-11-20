# Copilot instructions for the customer portal API

This is a multi-tenant API. Every change must keep tenants isolated and expose the minimum data.
Read `docs/architecture.md` before proposing changes to routes, data access or serialisation.

## Security defaults

- Protect every new route with `requirePermission('<resource>:<action>')` from `src/auth/authorize.js`. If a new permission is needed, add it to `src/auth/permissions.js` and call out the change in the PR.
- Never check roles inline (for example `req.user.role === 'admin'`).
- Access data only through tenant-scoped repository functions such as `listCustomersForOrg(req.user.orgId)`. Never call `getAllCustomers()` or `getAllAuditEvents()` from a request handler. Never take `orgId` from the request.
- Serialise responses with an explicit field list in `src/serializers/`. Never return whole records. `internalNotes`, `riskScore` and `paymentCardToken` must never leave the service.
- Return 404, not 403, when a record belongs to another tenant.
- For CSV or spreadsheet output, use the shared serialiser in `src/serializers/csv.js` so formula injection is neutralised.
- Log authorisation denials and bulk data access with `logSecurityEvent()`. Log IDs and counts, never field values.

## Tests

- For every new endpoint, write tests with `node:test` and the helpers in `test/helpers.js`.
- Include at least: an unauthenticated (401) case, a forbidden-role (403) case, a cross-tenant case proving another organisation's data is excluded, and a case proving restricted fields are absent.

## Pull requests

- Fill in the security acceptance criteria table in the PR template, with an ASVS ID and evidence for every row.
- Use the `security-requirements-and-evidence` skill to plan security criteria and to review the diff.
