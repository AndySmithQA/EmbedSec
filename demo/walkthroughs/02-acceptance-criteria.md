# Demo walkthrough 2: Turn risks into acceptance criteria

**Segment:** 15–35 min · **Demo:** 6 min · **Stage:** 0  
**Goal:** show the skill turning a ticket into specific, verifiable criteria tied to ASVS, and show the engineer refining them rather than accepting them.

## Steps

1. **Sketch the data flow (1 min).** On a whiteboard or slide, draw:

   ```text
   Admin browser --(1)--> /api auth --(2)--> /api/reports/activity --(3)--> audit store
                                                     |
                                              (4) JSON response
   Trust boundaries: browser|API  ·  API|store  ·  TENANT|TENANT
   ```

   > **Say:** "The boundary that matters most in a multi-tenant app is the one that isn't on most diagrams: tenant to tenant."

2. **Show the skill (1 min).** Open `.github/skills/security-requirements-and-evidence/SKILL.md`. Scroll through it, pointing out:
   - the **two modes**: design time and review time,
   - the rule **"Cite only ASVS IDs that appear in `references/asvs-subset.md`"**,
   - the output tables.

   Then open `references/asvs-subset.md` and show the version header (ASVS 5.0.0, last reviewed).

   > **Say:** "The workflow lives in the skill. The standard lives in a versioned reference file your AppSec team owns. When ASVS moves on, you update one file."

3. **Run design mode (2 min).** In **Agent** mode:

   ```text
   Use the security-requirements-and-evidence skill in design mode for
   docs/tickets/DEMO-201-activity-report.md.
   Decisions already made: only admins may view the report; users can never choose the
   organisation; IP address and user agent are excluded until a privacy decision is made.
   ```

   While it runs, explain that Copilot loads `SKILL.md` because the request matches the skill's description.

4. **Critique the output live (2 min).** Ask the room these questions:
   - "Is every ASVS ID it cited in our curated subset?" Check one, such as 8.4.1.
   - "Which criterion is too vague to test?" Rewrite one live.
   - "Which control does it say to reuse?" It should name `requirePermission()` and `listAuditEventsForOrg()`.

5. **Commit to three or four.** Show the target criteria (also on a slide):

   | ID | Criterion | ASVS |
   |---|---|---|
   | SAC-1 | Only `audit:read` (admin) may call the endpoint. Others get 403, and the denial is logged. | 8.2.1 |
   | SAC-2 | Events come only from the caller's organisation. A client-supplied `orgId` is rejected. | 8.4.1 |
   | SAC-3 | The response contains only `id, actorId, action, targetId, timestamp`. | 15.3.1 |
   | SAC-4 | `from`/`to` must be `YYYY-MM-DD` with `from` ≤ `to`; `limit` is 1–200. Otherwise, 400. | 2.2.1 |

## Key message

> "The skill proposes; you decide. Each criterion names a specific behaviour, a standard, and how you'll prove it. That's what makes it something CI and a reviewer can check later."

## Transition to the lab

> "Copy the threat sketch template, fill in the decisions with me as your product owner, then run the skill in design mode on TICKET-101. Commit to two or three criteria. Worksheet Part 2."

## If something goes wrong

| Problem | Recovery |
|---|---|
| The skill isn't picked up | Say "Use the skill at .github/skills/security-requirements-and-evidence" explicitly. If it still fails, show the rehearsal screenshot. |
| It cites an ASVS ID that isn't in the subset | Use it as a teaching moment: "This is why the reference file is pinned, and why you check." |
| The output is very long | Ask for "the acceptance criteria table only". |
