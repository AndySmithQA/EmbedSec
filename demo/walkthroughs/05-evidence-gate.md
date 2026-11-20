# Demo walkthrough 5: Apply a pull request evidence gate

**Segment:** 85–110 min · **Demo:** 7 min · **Branch:** `demo/DEMO-201-activity-report` (pushed during preparation)  
**Goal:** show a required check blocking a merge, the skill in review mode producing an evidence map, and the human reviewer's remaining job.

## Steps

1. **Open the PR with weak evidence (1 min).** On GitHub, open a PR from `demo/DEMO-201-activity-report` to `main`. Replace the template body with the contents of `stages/4-pull-request/pr-description-incomplete.md`. Create the PR.

2. **Watch the gate fail (1 min).** Once checks finish:
   - `security-regression-tests` ✅
   - `security-evidence` ❌
   - **Merge pull request** is blocked: "Required statuses must pass".

   Open the `security-evidence` log and read the four errors aloud:
   - SAC-1: evidence is missing.
   - SAC-2: no ASVS ID.
   - SAC-3: status "Not met".
   - No human-review item.

   > **Say:** "Notice what passed: 'Tested manually' counts as evidence to the script. The gate checks that evidence is *present*. Whether it's *good* is the reviewer's call. Automation narrows the reviewer's job; it doesn't replace it."

3. **Show the workflow file (1 min).** Open `.github/workflows/security-checks.yml` and point out:
   - The two jobs whose names match the required checks.
   - `PR_BODY: ${{ github.event.pull_request.body }}` is passed through `env`, **not** interpolated into `run:`. The PR body is untrusted input, and interpolating it would be script injection in your own pipeline.
   - `dependency-audit` is advisory (`continue-on-error`). Not every check should be required.

4. **Run the skill in review mode (2 min).** In VS Code, on the PR branch (`git switch demo/DEMO-201-activity-report`), in **Agent** mode:

   ```text
   Use the security-requirements-and-evidence skill in review mode.
   Criteria: SAC-1 to SAC-4 from docs/tickets/DEMO-201 (as agreed earlier).
   Compare them with the changes on this branch against main and with the latest npm test results.
   ```

   Show the **evidence map** table, and any **missing negative tests** or **for the human reviewer** items it produces.

5. **Complete the description (1 min).** Edit the PR description and paste `stages/4-pull-request/pr-description-complete.md`. Saving it re-runs `security-evidence`. Show it go green, with the warning "SAC-3: needs a human decision before merge".

6. **Request Copilot code review (30 s).** Go to **Reviewers** > **Copilot**. Mention that Copilot code review reads instructions and skills from the **head branch**, so the repository's security guidance applies to the review automatically.

7. **The human decision (30 s).** Point at **Decisions for the human reviewer**. The IP-address question is a privacy and policy decision. No tool can make it.

   Don't merge. Leave the PR open as a reference for delegates.

## Key message

> "The PR is the trace: decision, criterion, control, test, check run, reviewer. Each layer catches what the others can't."

## Transition to the lab

> "Push your branch and open your PR with the template empty. Watch the gate fail, run the skill in review mode, fix real gaps, and then complete the evidence. Worksheet Part 4."

## If something goes wrong

| Problem | Recovery |
|---|---|
| The check doesn't re-run after the description is edited | Push an empty commit: `git commit --allow-empty -m rerun && git push`. |
| Merge isn't blocked | Required checks weren't configured, or you're an admin with bypass permissions. Show the ruleset settings and turn off bypass. |
| Copilot code review isn't available | Skip that step. Mention that it's a licence and policy setting. |
