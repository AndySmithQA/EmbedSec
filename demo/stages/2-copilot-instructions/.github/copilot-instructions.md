# Copilot instructions for the customer portal API

This is a multi-tenant API. Every change must keep tenants isolated and expose the minimum data.
Read `docs/architecture.md` before proposing changes to routes, data access or serialisation.

## Security defaults

- Protect every new route with `requirePermission('<resource>:<action>')` from `src/auth/authorize.js`. Never check roles inline.
- Access data only through tenant-scoped repository functions, passing `req.user.orgId`. Never call functions marked LEGACY (`getAllCustomers()`, `getAllAuditEvents()`) from a request handler. Never accept `orgId` from the client.
- Serialise responses with an explicit field list in `src/serializers/`. Never return whole records.
- Validate query parameters against an allow-list of formats and ranges, and return 400 with a generic message when they are invalid.
- Set `Cache-Control: no-store` on responses containing personal or audit data.

## Tests

For every new endpoint, write `node:test` tests using `test/helpers.js`, including:
- an unauthenticated (401) case and a forbidden-role (403) case,
- a cross-tenant case proving another organisation's data is excluded,
- a case proving restricted fields are absent,
- invalid-input cases for each query parameter.

## Pull requests

Fill in the security acceptance criteria table in the PR template, with an ASVS ID and evidence for each row.
