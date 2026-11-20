# Delegate lab guide

## Embed Security into AI Development by Default with GitHub Copilot

In this lab you take one feature request, **TICKET-101: Export customers to CSV**, from an incomplete ticket to a merge-ready pull request. You will use GitHub Copilot to find the security requirements before writing code. Then you'll implement the feature using the repository's approved patterns and prove the result with tests, a CI evidence gate and a human review decision.

**What you leave with:** a pull request that traces a security decision to an application control, a test result and a reviewer's decision. We call this the **ticket-to-PR trace**.

| Exercise | Time | You will |
|---|---|---|
| 0. Set up | Before the session | Create your lab repository and check that the tests pass |
| 1. Start with an incomplete ticket | 0–15 min | Identify the security decisions TICKET-101 leaves open |
| 2. Turn risks into acceptance criteria | 15–35 min | Sketch the data flow and use the Copilot skill to propose ASVS-based criteria |
| 3. Put secure defaults in the repository | 35–55 min | Write Copilot instructions and compare Copilot's plan before and after |
| 4. Implement and verify one control | 55–85 min | Build the export and write security tests |
| 5. Apply a pull request evidence gate | 85–110 min | Open a PR, see the gate block it, then complete the evidence |
| 6. Transfer to the next feature | 110–120 min | Decide where each control for TICKET-102 belongs |

Times include the instructor's short demonstration at the start of each segment.

---

## Before you start

### You need

- A GitHub account with a GitHub Copilot licence that includes agent mode and Copilot code review.
- VS Code with the GitHub Copilot and GitHub Copilot Chat extensions, signed in.
- Node.js 22 or later, and Git.
- Your lab repository, created from the starter repository your instructor shares.

### Conventions in this guide

- **Prompt** boxes are text to paste into Copilot Chat.
- 📝 means record something in your worksheet (`lab/delegate-worksheet.md`, or the copy your instructor shares).
- **Checkpoint** tells you what should be true before you move on.

---

## Exercise 0: Set up (before the session, about 10 minutes)

1. Open the starter repository link from your instructor and select **Use this template** > **Create a new repository**. Make the repository **public** under your own account, unless your instructor tells you otherwise.
   > Branch protection and required status checks are available on public repositories with GitHub Free. Private repositories need a paid plan.
2. Clone it and install dependencies:
   ```bash
   git clone https://github.com/<you>/<your-lab-repo>.git
   cd <your-lab-repo>
   npm install
   npm test
   ```
3. Open the folder in VS Code. Open Copilot Chat and confirm that you can switch between **Ask** and **Agent** modes.
4. Confirm that Copilot can see the skill. In Agent mode, ask:

   **Prompt**
   ```text
   Which agent skills are available in this repository? Summarise what each one does in one sentence.
   ```

   Copilot should mention `security-requirements-and-evidence`. If it does not, search VS Code settings for **agent skills** and make sure skills are enabled. Then reload the window.
5. Push any small change to `main`, such as a line in `README.md`, so the **security-checks** workflow runs once. GitHub only offers a check as "required" after it has run.
6. Protect `main`: go to **Settings** > **Branches** > **Add branch ruleset**, or a classic branch protection rule.
   - Target branch: `main`
   - Turn on **Require a pull request before merging**.
   - Turn on **Require status checks to pass**, and add `security-regression-tests` and `security-evidence`.
   - Save.

**Checkpoint:** `npm test` passes locally, the workflow has run on GitHub, and `main` requires both checks.

---

## Exercise 1: Start with an incomplete ticket (0–15 min)

Open `docs/tickets/TICKET-101-customer-csv-export.md`. It's realistic, which means it's incomplete.

1. **On your own, without Copilot**, list every security decision the ticket leaves open. Aim for at least five. Use these prompts if you get stuck:
   - Who is "a portal user"? Which roles exist in `src/auth/permissions.js`?
   - Which customers are "our customer list"? Think about tenants and deleted records.
   - "All the customer details": look at the fields in `src/data/fixtures.js` and the classification in `docs/architecture.md`.
   - What happens when a spreadsheet opens a cell beginning with `=`?
   - What should be recorded when someone exports the whole customer list?
2. 📝 Write your list in **Part 1** of the worksheet.
3. Now ask Copilot to find what you missed (Ask mode):

   **Prompt**
   ```text
   Read #file:docs/tickets/TICKET-101-customer-csv-export.md and #file:docs/architecture.md.
   List the security decisions this ticket leaves open, phrased as questions for the product owner.
   Do not propose an implementation.
   ```
4. 📝 Add anything new from Copilot's answer, marked "(C)". Cross out anything you think is irrelevant, and note why.

**Checkpoint:** you have at least five open decisions, including who can export, which records, and which fields.

---

## Exercise 2: Turn risks into acceptance criteria (15–35 min)

1. Copy `docs/templates/threat-sketch.md` to `docs/security/TICKET-101-threat-sketch.md`.
2. Fill in **sections 1 to 3** yourself (about five minutes). Your instructor will play the product owner. Make these decisions for the lab unless your instructor says otherwise:
   - Exporting is a bulk operation. Decide whether `support` should have it, and justify your answer.
   - Phone number: is it in or out? Write down who should confirm this.
3. Invoke the skill in **design mode** (Agent mode):

   **Prompt**
   ```text
   Use the security-requirements-and-evidence skill in design mode for
   docs/tickets/TICKET-101-customer-csv-export.md.
   Decisions already made: <paste your decisions from the threat sketch>.
   ```
4. Review the output critically:
   - Do the ASVS IDs it cites appear in `.github/skills/security-requirements-and-evidence/references/asvs-subset.md`? If not, reject them.
   - Is each criterion specific (it names the endpoint, role, fields or behaviour) and testable?
   - Does it name the existing control to reuse, such as `requirePermission()` or `listCustomersForOrg()`?
5. Choose **two or three criteria** your team will commit to. Write them in **section 5** of your threat sketch. Each needs an ASVS reference and a verification method.

   A good criterion looks like this:
   > **SAC-2:** `GET /api/customers/export.csv` returns only customers whose `orgId` matches the caller's organisation and whose `deletedAt` is null. *ASVS 8.2.2. Verify with a test that exports as an Acme admin and asserts that no Globex or deleted IDs are present.*

   A weak criterion looks like this:
   > ~~The export is secure and follows OWASP.~~
6. 📝 Copy your final criteria into **Part 2** of the worksheet.

**Checkpoint:** two or three criteria, each specific, testable and tied to an ASVS ID from the curated list.

---

## Exercise 3: Put secure defaults in the repository (35–55 min)

You'll see how much repository instructions change what Copilot proposes.

1. **Before.** Open a **new** chat in Ask mode, so it carries no earlier context, and ask:

   **Prompt**
   ```text
   Give me a step-by-step implementation plan for docs/tickets/TICKET-101-customer-csv-export.md.
   Name the files you would change and the functions you would call. Do not write the code yet.
   ```
   📝 In **Part 3** of the worksheet, note which data access function, authorisation approach and field selection the plan uses. Look out for `getAllCustomers()`, inline role checks and spreading whole records.

2. **Write `.github/copilot-instructions.md`.** Keep it short: 15–25 lines. Include:
   - the authorisation helper to use, and what never to do,
   - the tenant-scoped data access rule, naming the LEGACY functions to avoid,
   - the explicit field list rule and the restricted fields,
   - the minimum negative tests for every new endpoint,
   - a pointer to the PR template and the skill.

   Write instructions as rules about this codebase, not general advice. "Use `requirePermission()` from `src/auth/authorize.js`" works. "Write secure code" does not.

3. **After.** Open another **new** chat and repeat the same prompt. Expand the **References** list on the response and confirm that `.github/copilot-instructions.md` was used.
4. 📝 Record the differences in Part 3. Which of your rules changed the plan? Which didn't, and why do you think that is?
5. Commit the instructions to a new branch:
   ```bash
   git switch -c feature/ticket-101-export
   git add .github/copilot-instructions.md docs/security/
   git commit -m "Add Copilot security instructions and TICKET-101 threat sketch"
   ```

**Checkpoint:** Copilot's "after" plan uses `requirePermission`, `listCustomersForOrg(req.user.orgId)` and an explicit field list.

---

## Exercise 4: Implement and verify one control (55–85 min)

1. Use **Agent mode** to implement the export:

   **Prompt**
   ```text
   Implement TICKET-101 to satisfy these security acceptance criteria:
   <paste your SAC rows>
   Follow .github/copilot-instructions.md. Add tests in test/customers-export.test.js
   covering every criterion, including the negative cases. Run npm test when you are done.
   ```
2. **Review every change before you accept it.** Check specifically:
   - [ ] The route is registered **before** `/:id` in `src/routes/customers.js`. Otherwise `export.csv` is treated as a customer ID.
   - [ ] It uses `requirePermission('customers:export')`, and the permission was added to the role(s) you decided on in `src/auth/permissions.js`.
   - [ ] It calls `listCustomersForOrg(req.user.orgId)`, and does **not** call `getAllCustomers()`.
   - [ ] It uses an explicit field list, such as `CUSTOMER_EXPORT_FIELDS` in `src/serializers/customerSerializer.js`.
   - [ ] It sets `Content-Type: text/csv; charset=utf-8` and a server-generated file name.
3. Make sure your tests include at least:
   - an **authorised** admin who receives their own organisation's active customers,
   - a **forbidden** role (support or viewer) who receives 403,
   - an **unauthenticated** request that receives 401,
   - a **cross-tenant** assertion that no Globex customer appears in an Acme export (and the reverse),
   - a **restricted-field** assertion that no `internalNotes`, `riskScore` or `paymentCardToken` values appear.
4. Run `npm test`. Every test should pass.
5. **Prove your tests have teeth.** Temporarily change `listCustomersForOrg(req.user.orgId)` to `getAllCustomers()` and run `npm test`. At least one test must fail. Revert the change.
6. **Stretch goals,** if you finish early:
   - Customer `c-1003` has a name beginning with `=HYPERLINK(`. Neutralise formula injection (ASVS 1.2.10) in a shared CSV serialiser and test it.
   - Log a `data.exported` security event with the record count, but no customer data (ASVS 16.3.2).
   - Add `Cache-Control: no-store` (ASVS 14.3.2).
7. Commit:
   ```bash
   git add -A
   git commit -m "TICKET-101: add tenant-scoped customer CSV export"
   ```

**Checkpoint:** `npm test` passes, and removing the tenant scoping makes a test fail.

---

## Exercise 5: Apply a pull request evidence gate (85–110 min)

1. Push and open a pull request **without filling in the template**:
   ```bash
   git push -u origin feature/ticket-101-export
   ```
   On GitHub, open the PR against `main`. Leave the security acceptance criteria table empty.
2. Watch the checks. `security-regression-tests` should pass, but **`security-evidence` fails**. Open its log to see why. Note that **Merge** is blocked.
3. Run the skill in **review mode** (Agent mode):

   **Prompt**
   ```text
   Use the security-requirements-and-evidence skill in review mode.
   Criteria: <paste your SAC rows>
   Compare them with the changes on this branch against main and with the latest npm test results.
   Produce the evidence map, unapproved patterns, missing negative tests and items for the human reviewer.
   ```
4. Fix any real gaps the skill finds: add tests or correct code. Push again.
5. Edit the PR description and complete the table. For every row, give an ASVS ID, the test name as evidence, and a status (`Met` or `Needs human decision`). Add at least one item under **Decisions for the human reviewer**. Saving the description re-runs the gate.
6. When `security-evidence` passes, request a review from **Copilot** on the PR (**Reviewers** > **Copilot**). Copilot code review reads the instructions and skills from your branch.
7. 📝 In **Part 4** of the worksheet, write down what a human reviewer still needs to verify that no check can verify. For example: is admin-only the right policy? Is the phone-number decision signed off? Is the permission change acceptable?
8. **Optional:** to see a required check block a merge, remove `requirePermission('customers:export')` from the route, push, and watch `security-regression-tests` fail. Then revert.

**Checkpoint:** both required checks pass, the PR description is a complete evidence map, and your human-review list is written.

> **Why the gate checks the description and not just the tests:** tests prove the code does what the tests say. The evidence table shows a reviewer which decision each test is evidence *for*, and makes gaps visible. The gate checks that evidence is present, not that it's good. Judging quality is the human reviewer's job.

---

## Exercise 6: Transfer to the next feature (110–120 min)

Read `docs/tickets/TICKET-102-account-summary.md`. Don't implement it.

1. With a partner, decide where each concern below belongs. Write **one** of: **Spec** (the ticket's acceptance criteria), **Skill** (reusable review guidance), **Shared control** (application code everyone reuses), or **CI** (automated check).

   | Concern | Where it belongs | Why |
   |---|---|---|
   | Support agents may only summarise customers in their own organisation |  |  |
   | `internalNotes` and `paymentCardToken` must not be sent to the LLM provider |  |  |
   | Customer-supplied profile text could contain prompt-injection instructions |  |  |
   | "Update the customer's plan when the agent asks" |  |  |
   | Per-user rate limit on summary requests |  |  |
   | Remind reviewers to check LLM-specific risks on any AI feature |  |  |
   | Summary output must be encoded before rendering in the browser |  |  |
2. Ask the skill which LLM risks apply:

   **Prompt**
   ```text
   Use the security-requirements-and-evidence skill in design mode for
   docs/tickets/TICKET-102-account-summary.md. This feature calls an LLM.
   ```
3. 📝 Record your answers in **Part 5** of the worksheet.

---

## Finished? Your ticket-to-PR trace

Before you leave, make sure your worksheet links these together for at least one criterion:

```text
Open decision (Part 1) -> Criterion + ASVS ID (Part 2) -> Code that enforces it (file:line)
  -> Test that proves it (test name) -> CI check run (link) -> Human reviewer decision (Part 4)
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Copilot does not mention the skill | Use Agent mode, not Ask mode. Check that the skill is at `.github/skills/security-requirements-and-evidence/SKILL.md`. Enable agent skills in settings and reload VS Code. |
| Copilot ignores `copilot-instructions.md` | Start a **new** chat. Check that the file is at `.github/copilot-instructions.md` exactly, and that it appears under **References**. |
| `GET /api/customers/export.csv` returns 404 | The route is registered after `/:id`. Move it above. |
| The `security-evidence` check does not appear as a required option | It only appears after it has run once. Open any PR or push to `main`, then add it to the ruleset. |
| `security-evidence` did not re-run after you edited the description | The workflow runs on `edited`. Check the **Actions** tab, or push an empty commit: `git commit --allow-empty -m "rerun" && git push`. |
| Branch protection settings are greyed out | The repository is private on a free plan. Make it public, or ask your instructor for an organisation repository. |
| `npm test` finds no tests | Use Node.js 22 or later (`node --version`). |
