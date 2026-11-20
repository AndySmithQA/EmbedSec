## Ticket

TICKET-101: Export customers to CSV

## Summary

Adds `GET /api/customers/export.csv`. Admins can download their own organisation's active customers as CSV.
The export uses an explicit column list and a new shared CSV serialiser that neutralises spreadsheet formulas.

## Security acceptance criteria

| ID | Criterion | ASVS ref | Evidence | Status |
|---|---|---|---|---|
| SAC-1 | Only users with `customers:export` (admin) can export. Support and viewer get 403 and the denial is logged. | 8.2.1 | `test/customers-export.test.js`: "rejects a support user with 403…", "rejects a viewer user with 403…" | Met |
| SAC-2 | The export contains only active customers in the caller's organisation. | 8.2.2 | `test/customers-export.test.js`: "exports only active customers from the caller's organisation", "exports the other organisation's records only to that organisation" | Met |
| SAC-3 | The export contains exactly `id,name,email,company,plan,createdAt`. Notes, risk score, card token and phone are excluded. | 15.3.1 | `test/customers-export.test.js`: "includes exactly the approved columns", "never includes restricted field values" | Needs human decision |
| SAC-4 | Cells starting with `= + - @`, tab or carriage return are neutralised. | 1.2.10 | `test/csv.test.js`, `test/customers-export.test.js`: "neutralises cells…" | Met |

## Decisions for the human reviewer

- [ ] Product owner to confirm phone number stays out of the export (the ticket asked for "all details").
- [ ] Confirm export should be admin-only. Support agents asked for it, but it is a bulk-exfiltration path.
- [ ] Review the change to `src/auth/permissions.js` (new `customers:export` permission on admin).
- [ ] Rate limiting (ASVS 2.4.1) is not implemented. Accept the risk or raise a follow-up ticket.

## How Copilot was used

- Used the `security-requirements-and-evidence` skill at design time to turn TICKET-101 into SAC-1 to SAC-4.
- Without repository instructions, Copilot's first plan used `getAllCustomers()` and returned every field. After adding `.github/copilot-instructions.md` it used `listCustomersForOrg()` and an explicit field list.
- Rejected Copilot's suggestion to check `req.user.role === 'admin'` inline. Added a `customers:export` permission instead.
- Ran the skill in review mode against the diff. It flagged a missing negative test for the viewer role, which I added.
