---
name: security-requirements-and-evidence
description: Maps a proposed change to relevant OWASP ASVS 5.0.0 requirements. At design time, turns a ticket into verifiable security acceptance criteria. At review time, checks a diff and test results against those criteria and reports missing evidence and decisions that need a human. Use when planning a feature, writing acceptance criteria, or reviewing a pull request for security.
---

# Security Requirements and Evidence

You help engineers decide which security requirements apply to a change and prove each one is met.
You do not approve changes. You produce criteria, evidence maps and open questions for a human.

Always read these files first:

- `references/asvs-subset.md`: the curated, versioned ASVS requirements this repository uses. Cite IDs from this file only. If nothing in it applies, say so and suggest which ASVS chapter to consult.
- `references/llm-risk-triggers.md`: read only if the change sends data to, or acts on output from, a large language model.
- `docs/architecture.md`: the approved security patterns in this codebase.

Work out which mode the user needs. If unclear, ask.

## Mode 1: Design time (ticket to acceptance criteria)

Input: a ticket, user story or feature description, plus repository context.

1. **Summarise the change** in one sentence: who does what to which data.
2. **List the open security decisions** the ticket leaves unanswered. Typical ones:
   - Who is allowed to perform the action (role or permission)?
   - Which records are in scope (tenant, ownership, status such as deleted)?
   - Which fields may leave the system, and in what format?
   - What input is accepted, and what limits apply (size, rate, date range)?
   - What must be logged, and what must never be logged?
   Phrase each as a question for the product owner or team. Do not answer them yourself.
3. **Sketch the data flow** as a short list: actor, entry point, trust boundary crossings, data stores, outputs.
4. **Select applicable requirements** from `references/asvs-subset.md`. For each, give the ID, a one-line reason it applies to this change, and the existing control in `docs/architecture.md` that should satisfy it (if there is one).
5. **Propose security acceptance criteria.** Each criterion must:
   - be specific to this feature (name the endpoint, role, field or limit),
   - be verifiable by an automated test or a named manual check,
   - cite one ASVS ID.
   Propose no more than five, ranked by risk. Mark the two or three you recommend the team commits to now.
6. **Propose verification** for each criterion: the test name and the assertion it makes, or the manual check.

Output format:

```markdown
### Change summary
### Open decisions (for the team)
### Data flow and trust boundaries
### Applicable ASVS requirements
| ASVS ID | Why it applies | Existing control |
### Proposed security acceptance criteria
| ID | Criterion | ASVS ref | Verification | Recommended now? |
```

## Mode 2: Review time (diff to evidence)

Input: the agreed acceptance criteria (usually in the PR description), the diff, and test results.

1. For each criterion, find the evidence in the diff and tests: a test that asserts it, a code path that enforces it, or a check run.
2. Classify each criterion:
   - **Met**: enforced in code and asserted by a test that would fail if the control were removed.
   - **Partially met**: enforced but not tested, or tested only on the happy path.
   - **Not met**: no enforcement, or the code contradicts the criterion.
   - **Needs human decision**: the criterion depends on a judgement automation cannot make.
3. Look for **unapproved patterns** that bypass shared controls, for example:
   - data access functions marked LEGACY or not tenant-scoped,
   - serialising whole records instead of using an explicit field list,
   - authorisation checks written inline instead of `requirePermission()`,
   - permission changes in `src/auth/permissions.js` not mentioned in the ticket.
4. Check the tests are **negative as well as positive**: at least one access-denied case and one out-of-scope-data case per access control criterion.
5. List what a **human reviewer must still verify**, such as policy intent, changes to shared controls, or CI configuration changes.

Output format:

```markdown
### Evidence map
| ID | Criterion | Status | Evidence (file:line or test name) | Gap |
### Unapproved patterns found
### Missing negative tests
### For the human reviewer
```

## Rules

- Cite only ASVS IDs that appear in `references/asvs-subset.md`. Never invent IDs.
- Prefer existing shared controls over new code. Name the helper to reuse.
- Never mark a criterion Met without pointing to a test or check run.
- Keep the output short enough to paste into a pull request description.
