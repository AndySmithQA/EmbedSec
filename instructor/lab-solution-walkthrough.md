# Lab solution walkthrough (instructor only)

Model answers, expected Copilot behaviour and common mistakes for each exercise in `lab/lab-guide.md`.
The reference code is in `instructor/lab-solution/`. Overlay it on the starter to reproduce the finished state:

```bash
cp -r lab/starter /tmp/lab-check && cp -r instructor/lab-solution/. /tmp/lab-check/
cd /tmp/lab-check && npm install && npm test        # 32 tests pass
node scripts/check-pr-evidence.js pr-description.md # gate passes with one warning
```

On Windows PowerShell, run `Copy-Item lab\starter $env:TEMP\lab-check -Recurse`, then `Copy-Item instructor\lab-solution\* $env:TEMP\lab-check -Recurse -Force`.

| Solution file | Purpose |
|---|---|
| `src/routes/customers.js` | Export route, registered before `/:id` |
| `src/serializers/csv.js` | Shared CSV serialiser with RFC 4180 quoting and formula neutralisation |
| `src/serializers/customerSerializer.js` | Adds `CUSTOMER_EXPORT_FIELDS` |
| `src/auth/permissions.js` | Adds `customers:export` to `admin` only |
| `test/customers-export.test.js`, `test/csv.test.js` | Tests for every criterion, including negative cases |
| `.github/copilot-instructions.md` | Model repository instructions |
| `pr-description.md` | Model PR description that passes the evidence gate |

---

## Exercise 1: Open security decisions

### Model answer

| # | Open decision | Why it matters |
|---|---|---|
| 1 | Which roles may export? "A portal user" could mean anyone, including `viewer`. | Function-level authorisation (ASVS 8.2.1). Export is bulk access, so it's riskier than viewing one record. |
| 2 | Which organisation's customers? | Tenant isolation (8.2.2, 8.4.1). |
| 3 | Are deleted (erased) customers included? | `c-1004` has had a right-to-erasure request. Including it would breach the erasure. |
| 4 | Which fields? "All the customer details" would include `internalNotes`, `riskScore` and `paymentCardToken`. | Field-level exposure (8.2.3, 15.3.1). The architecture document's classification says these must never leave the service. |
| 5 | Is phone number in or out? | The classification allows phone in detail view only "unless a ticket approves otherwise". That's a product owner decision. |
| 6 | What happens when a cell starts with `=`, `+`, `-` or `@`? | CSV and formula injection (1.2.10). See `c-1003`. |
| 7 | Should exports be logged or audited? | Bulk data access should leave a trail (16.3.2, L3). |
| 8 | Is there a size or rate limit? | Bulk exfiltration and resource use (2.4.1). |
| 9 | Can exports be cached by the browser or proxies? | `Cache-Control: no-store` (14.3.2). |

### Expected Copilot behaviour

Copilot usually finds items 1, 2, 4 and often 7 and 8. It frequently misses 3 (deleted records) and 6 (formula injection) unless it reads the fixtures. If it does mention formula injection, highlight that: it shows why giving Copilot repository context matters.

---

## Exercise 2: Acceptance criteria

### Decisions to give as product owner

- **Who:** admin only. Support asked for export, but bulk export is an exfiltration path. Support can still view individual records. Accept "admin and support" if a delegate justifies it, provided the tests match.
- **Phone:** excluded for now, pending product owner confirmation. This is deliberately left as a "Needs human decision" item.

### Model criteria

| ID | Criterion | ASVS | Verification |
|---|---|---|---|
| SAC-1 | Only users with `customers:export` (admin) can call `GET /api/customers/export.csv`. Support and viewer receive 403, and the denial is logged. Unauthenticated requests receive 401. | 8.2.1 | Tests for admin 200, support 403, viewer 403 and anonymous 401. Assert an `authz.denied` event. |
| SAC-2 | The export contains only customers whose `orgId` matches the caller's organisation and whose `deletedAt` is null. | 8.2.2 | An Acme admin export contains exactly `c-1001` to `c-1003`. A Globex export contains exactly `c-2001` and `c-2002`. |
| SAC-3 | The export contains exactly the columns `id,name,email,company,plan,createdAt`. | 15.3.1 | Assert the header row, and assert that no restricted value (card token, notes, phone) appears. |
| SAC-4 (stretch) | Cells starting with `=`, `+`, `-`, `@`, tab or carriage return are neutralised. | 1.2.10 | `c-1003`'s name and company are prefixed with `'` and quoted. |

### What good critique of the skill output looks like

- It rejects any ASVS ID not in `asvs-subset.md`.
- It cuts generic criteria such as "use HTTPS". That's true, but it isn't specific to this change, and it's handled by the platform.
- It ranks by risk: tenant isolation and fields above caching headers.

---

## Exercise 3: Copilot instructions

### Model instructions

See `instructor/lab-solution/.github/copilot-instructions.md`. These are the essentials, in priority order:

1. Use `requirePermission()`, add new permissions in `permissions.js`, and never check roles inline.
2. Use tenant-scoped repository functions with `req.user.orgId`. Never use `getAllCustomers()` or `getAllAuditEvents()`.
3. Use explicit field lists. Name the restricted fields.
4. State the minimum negative tests: 401, 403, cross-tenant and restricted fields.
5. Point to the PR template and the skill.

### Expected before-and-after difference

| Aspect | Typical "before" plan | Typical "after" plan |
|---|---|---|
| Data access | `getAllCustomers()`, sometimes filtered by `req.user.orgId` but including deleted records | `listCustomersForOrg(req.user.orgId)` |
| Authorisation | None, or `req.user.role === 'admin'` inline | `requirePermission('customers:export')` plus a `permissions.js` change |
| Fields | `Object.keys(customers[0])`: every field | `CUSTOMER_EXPORT_FIELDS` in the serialiser |
| Tests | One happy-path test | Includes 403, 401 and cross-tenant tests |

> Copilot's behaviour varies by model and version. Sometimes the "before" plan is already reasonable because Copilot read `docs/architecture.md`. If so, ask the delegate: "Would it have found that file in a repository without one? Would it find it every time?" Instructions make the behaviour *reliable*, not just possible.

### Common weak instructions

- "Follow OWASP best practices." This is unactionable.
- Long lists copied from a policy. Copilot gives every rule equal weight, and the important ones get diluted.
- Instructions that duplicate the skill's workflow. Keep instructions for always-on rules.

---

## Exercise 4: Implementation and tests

### Reference implementation highlights

From `instructor/lab-solution/src/routes/customers.js`:

```js
router.get('/export.csv', requirePermission('customers:export'), (req, res) => {
  const customers = listCustomersForOrg(req.user.orgId);
  const csv = toCsv(customers, CUSTOMER_EXPORT_FIELDS);
  // ... logSecurityEvent({ type: 'data.exported', recordCount }) ...
  res.status(200).set({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="customers-${date}.csv"`,
    'Cache-Control': 'no-store',
  }).send(csv);
});
```

### Common mistakes to look for when circulating

| Mistake | How to spot it | Coaching question |
|---|---|---|
| Route after `/:id` | Admin gets 404 `Not found` | "What does Express match first?" |
| `getAllCustomers()` | Deleted `c-1004` or Globex rows in the output | "Which repository function does the architecture document approve?" |
| Inline role check | `req.user.role === 'admin'` | "How would the next engineer find out who can export?" |
| `customers:export` added to every role | `permissions.js` diff | "Which decision did you make in Exercise 2?" |
| Whole-record CSV | Header includes `internalNotes` | "Which fields does the classification allow out?" |
| Tests assert only `200` | No assertions on IDs or columns | "If I swapped in `getAllCustomers()`, would any test fail?" |
| CSV built by hand with `join(',')` | Names with commas break columns, and no formula handling | "What does `c-1003` look like in Excel?" |
| Formula neutralised but not quoted | `'=HYPERLINK("…")` unquoted, so the embedded quotes and comma break the row | "Is that still RFC 4180 compliant?" |

### "Prove your tests have teeth"

When delegates swap `listCustomersForOrg(req.user.orgId)` for `getAllCustomers()`, these reference tests fail:

- "exports only active customers from the caller's organisation" (Globex and deleted IDs present)
- "exports the other organisation's records only to that organisation"
- "logs the export with a record count…" (count is 6, not 3)

If **no** test fails, the delegate's tests don't assert tenant scope. This is the most valuable coaching moment in the lab.

---

## Exercise 5: Evidence gate

### Expected sequence

1. Template left empty: `security-evidence` fails with about 13 errors (three empty rows, each with four problems, plus no human-review item). Merge is blocked.
2. Skill in review mode: it should produce an evidence map. Typical useful findings:
   - a missing viewer-role 403 test,
   - no test for deleted records,
   - the `permissions.js` change flagged for human review.
3. Completed description: the gate passes, with warnings for any "Needs human decision" rows.

The model description is in `instructor/lab-solution/pr-description.md`.

### Model "what a human must still decide"

- Is admin-only the right policy? This is a business decision.
- Phone number: product owner sign-off on data minimisation.
- The new permission in `permissions.js`: shared control changes need a security-aware reviewer.
- Rate limiting is not implemented (ASVS 2.4.1). Accept the risk explicitly or raise a follow-up.
- Does the evidence actually prove each criterion? The gate only checks that evidence is present.
- Any change to `.github/workflows/` or to the skill itself. These are changes to the verification system.

### Gaming the gate

If a delegate gets green with "TODO done" or "tested" as evidence, ask them to read their row as if they were the reviewer: "Which test would you open?" The script only rejects empty, `TODO`, `TBD`, `-`, `...` and `<placeholder>` values on purpose. Discuss why it doesn't try to verify more.

---

## Exercise 6: Transfer (TICKET-102)

### Model classification

| Concern | Home | Why |
|---|---|---|
| Support agents may only summarise customers in their own organisation | **Shared control** (plus a spec criterion) | Enforced by `requirePermission('customers:read')` and `findCustomerForOrg(req.user.orgId, id)`. The ticket's criterion states it, and the code enforces it. |
| `internalNotes` and `paymentCardToken` must not be sent to the LLM provider | **Spec** decision, enforced by a **shared control** | Deciding which fields go to a third party is per-feature (the data classification and provider approval). Enforce it with an explicit `CUSTOMER_LLM_CONTEXT_FIELDS` allow-list. Note the tension: the ticket *asks* for internal notes, so this needs an explicit decision. |
| Customer-supplied profile text could contain prompt-injection instructions | **Skill** (to find it) plus a **shared control** (to contain it) | The skill's LLM triggers flag it at design time. Containment: treat profile text as data, delimit it, and give the model no tools or secrets that injection could abuse. Prompt injection can't be fully prevented, so limit the impact. |
| "Update the customer's plan when the agent asks" | **Spec** (decide; default no) | Excessive agency. If it's allowed, any tool call must go through `requirePermission('customers:write')` as the *human* caller, with confirmation. That part is a shared control. |
| Per-user rate limit on summary requests | **Shared control** (plus **CI** test) | Unbounded consumption (cost) and ASVS 2.4.1. Enforce it in middleware, and regression-test it. |
| Remind reviewers to check LLM-specific risks on any AI feature | **Skill** | Reusable, task-specific guidance. This is exactly what `references/llm-risk-triggers.md` is for. |
| Summary output must be encoded before rendering | **Shared control** | Improper output handling. Use the front end's standard encoding. Never render it as HTML. |

### Debrief points

- Most LLM-feature controls still live in the **surrounding application**. The LLM Top 10 helps you *find* them; ASVS-style controls *enforce* them.
- Some concerns need **two homes**: a decision in the spec and enforcement in code. That's normal.
- CI is the right home only for what can be checked automatically and reliably on every PR.
