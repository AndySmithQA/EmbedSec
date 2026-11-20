# Demo walkthrough 4: Implement and verify one control

**Segment:** 55–85 min · **Demo:** 6 min · **Stage:** 2 → 3  
**Goal:** show Agent mode implementing against the criteria, the engineer reviewing the diff, and tests that would fail if the control were removed.

## Steps

1. **Ask Agent mode to implement (2 min).** With stage 2 applied:

   ```text
   Implement DEMO-201 to satisfy these security acceptance criteria:
   SAC-1 Only audit:read (admin) may call GET /api/reports/activity; others get 403 and the denial is logged. ASVS 8.2.1
   SAC-2 Events only from the caller's organisation; a client-supplied orgId is rejected with 400. ASVS 8.4.1
   SAC-3 Response contains only id, actorId, action, targetId, timestamp. ASVS 15.3.1
   SAC-4 from/to are YYYY-MM-DD with from <= to; limit 1-200 default 50; otherwise 400. ASVS 2.2.1
   Follow .github/copilot-instructions.md. Write tests in test/reports.test.js for every criterion,
   including negative cases. Run npm test when done.
   ```

   Let it run while you talk. If it takes too long or goes off track, stop it and apply stage 3:

   ```bash
   node apply-stage.js 3
   ```

2. **Review the diff like a reviewer (2 min).** Open `repo/src/routes/reports.js` and `repo/src/serializers/auditSerializer.js`. Call out:
   - `requirePermission('audit:read')` is the shared control, not an inline check.
   - `listAuditEventsForOrg(req.user.orgId, ...)`: the tenant comes from the session, never the query.
   - `ALLOWED_PARAMS` rejects unknown parameters, so `?orgId=` returns 400.
   - `AUDIT_REPORT_FIELDS` is an explicit allow-list.
   - `Cache-Control: no-store`.

3. **Walk through the tests (1 min).** Open `repo/test/reports.test.js`. Point out that each block is labelled with its SAC and ASVS ID, and that the tests are **negative as well as positive**: 401, 403 for two roles, cross-tenant, restricted fields, and six invalid inputs.

   ```bash
   npm test
   ```

   27 tests pass.

4. **Prove the tests have teeth (1 min).** This is the moment people remember. In `src/routes/reports.js`, change:

   ```js
   const events = listAuditEventsForOrg(req.user.orgId, params).map(toAuditReportEntry);
   ```

   to:

   ```js
   const events = require('../data/auditRepository').getAllAuditEvents().map(toAuditReportEntry);
   ```

   Run `npm test`. The tenant-isolation test fails. Revert with `node apply-stage.js 3`.

   > **Say:** "A security test you've never seen fail is a hypothesis. Break the control on purpose once."

   **Alternative:** copy the stage 3 tests onto the stage 1 insecure draft. 13 tests fail:

   ```bash
   node apply-stage.js 1
   copy stages\3-secure-implementation\test\reports.test.js repo\test\reports.test.js
   ```

   On macOS or Linux, use `cp stages/3-secure-implementation/test/reports.test.js repo/test/reports.test.js`. Then run `npm test` in `repo/`, and finish with `node apply-stage.js 3`.

## Key message

> "Copilot wrote most of this. My job was to define what 'correct' means first, then to check that the tests prove it. That's the job that doesn't go away."

## Transition to the lab

> "Implement TICKET-101 with Agent mode. Review every change against the checklist in your guide, and make sure you break the tenant scoping once to see a test fail. Stretch: the customer whose name starts with `=HYPERLINK`."

## If something goes wrong

| Problem | Recovery |
|---|---|
| Agent mode is slow or edits unrelated files | Stop it, run `node apply-stage.js 3`, and continue from the review step. |
| Tests fail after Agent mode's changes | Good material: read the failure aloud, then ask Copilot to fix it. Or apply stage 3. |
