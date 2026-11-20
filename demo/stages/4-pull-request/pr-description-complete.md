## Ticket

DEMO-201: Activity report API

## Summary

Adds `GET /api/reports/activity` for admins. It returns their own organisation's audit events with validated
`from`, `to` and `limit` filters, using an explicit field list that excludes network and session data.

## Security acceptance criteria

| ID | Criterion | ASVS ref | Evidence | Status |
|---|---|---|---|---|
| SAC-1 | Only users with `audit:read` (admin) can view the report. Others get 403 and the denial is logged. | 8.2.1 | `test/reports.test.js`: "rejects a support user…", "rejects a viewer user…" | Met |
| SAC-2 | Events come only from the caller's organisation. A client-supplied `orgId` is rejected. | 8.4.1 | `test/reports.test.js`: "returns only the caller's organisation's events", "rejects an attempt to choose another organisation" | Met |
| SAC-3 | Responses contain only `id, actorId, action, targetId, timestamp`. IP address, user agent and session IDs are excluded. | 15.3.1 | `test/reports.test.js`: "returns only approved fields" | Needs human decision |
| SAC-4 | `from`/`to` must be `YYYY-MM-DD` with `from` ≤ `to`. `limit` is an integer from 1 to 200 (default 50). Anything else returns 400. | 2.2.1 | `test/reports.test.js`: "rejects invalid input: …" (6 cases) | Met |

## Decisions for the human reviewer

- [ ] Operations asked for IP and browser data. Decide whether a separate `audit:read-network` permission is needed before exposing it (personal data under GDPR).
- [ ] Confirm "manager" in the ticket maps to the `admin` role.
- [ ] Should viewing the activity report itself be audited (ASVS 16.3.2 at L3)?

## How Copilot was used

- Copilot's first draft (no repository instructions) used `getAllAuditEvents()`, trusted `orgId` from the query string, skipped authorisation and returned every field.
- The `security-requirements-and-evidence` skill turned DEMO-201 into four criteria and flagged the LEGACY function in review mode.
- After adding `.github/copilot-instructions.md`, Copilot's plan used `requirePermission('audit:read')`, `listAuditEventsForOrg(req.user.orgId)` and an explicit serialiser.
