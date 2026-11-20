# Deck content: Embed Security into AI Development by Default with GitHub Copilot

Slide-by-slide content for the deck builder. Each slide has:

- **On slide:** the text that appears on the slide (keep it to this, or less).
- **Visual:** what to design or screenshot.
- **Speaker notes:** paste into the notes field.

24 slides. The slide numbers match the session plan in `instructor/instructor-guide.md`. Demo and lab slides are deliberately sparse, because the room should be looking at VS Code, not the deck.

## Design guidance

- **Running motif:** the *ticket-to-PR trace*, a horizontal chain of six nodes: **Decision → Criterion → Control → Test → Check → Reviewer**. It appears on slide 3, highlights the current node on each section divider, and is complete on slide 23.
- **Section dividers:** six, one per segment, each showing the segment time and the trace with the relevant node lit.
- **Code on slides:** at most 8 lines, monospace, with the key line highlighted. Use real snippets from the repository (paths given).
- **Colour coding:** use one accent for "Copilot proposes" and a second for "Human decides". Use both consistently.
- **Demo and lab slides:** use a standard template with a large "DEMO" or "LAB" label, the exercise number, a timer, and the prompt delegates will paste.

---

## Segment 1: Start with an incomplete ticket (0–15 min)

### Slide 1: Title

**On slide**
> **Embed Security into AI Development by Default**
> with GitHub Copilot
> Short ILT · 2 hours · hands-on

**Visual:** title template. Faint background of a PR page with a green "All checks have passed" banner.

**Speaker notes**
Welcome. Introduce yourself and any lab assistants. "For the next two hours we follow one feature request from a ticket to a pull request, and we make the security decisions on purpose rather than by accident. You'll do almost everything hands-on in your own repository." Check that everyone completed Exercise 0, and ask anyone who didn't to raise a hand now so an assistant can help.

---

### Slide 2: What you'll be able to do

**On slide**
1. Spot the security decisions a ticket leaves open
2. Turn them into testable criteria mapped to OWASP ASVS
3. Steer Copilot with repository instructions and a reusable skill
4. Prove controls with tests that fail when the control is removed
5. Gate the PR on evidence, and know what humans still decide
6. Put each control in the right place

**Visual:** six icons, one per outcome, aligned to the six segments.

**Speaker notes**
Run through these quickly. Emphasise outcome 4: "We're going to break our own controls on purpose." And outcome 5: "Automation doesn't remove the reviewer. It changes what the reviewer spends time on."

---

### Slide 3: What you'll leave with: the ticket-to-PR trace

**On slide**
> One PR that connects:
> **Decision → Criterion → Control → Test → Check → Reviewer**

**Visual:** the six-node trace motif, with an example label under each node:
"Who can export?" → "SAC-1: admin only (ASVS 8.2.1)" → `requirePermission('customers:export')` → "rejects a support user with 403" → `security-regression-tests ✅` → "Policy confirmed by product owner".

**Speaker notes**
This is the artefact you leave with. If someone asks "why is this export admin-only?" six months from now, the PR answers it: the decision, the standard, the code, the test that proves it, the check that ran, and who signed it off. Most teams have some of these links. Few have all of them, and AI-generated code makes the gaps bigger, because code arrives faster than decisions do.

---

### Slide 4: Copilot builds what the ticket says

**On slide**
> Code generation got faster.
> Ticket quality didn't.
> Copilot only knows what's in its context.

**Visual:** a split. Left: a vague ticket ("Include all the customer details"). Right: Copilot-generated code spreading `...customer` into a CSV. An arrow between them labelled "faithfully implemented".

**Speaker notes**
This isn't about Copilot writing insecure code out of malice or incompetence. It implements what we ask for. If the ticket says "all the details" and the repository has a convenient `getAllCustomers()` function, that's a perfectly reasonable completion. The security decisions were never made. They were left implicit, and implicit decisions get made by whoever, or whatever, writes the code.

---

### Slide 5: Secure by default means...

**On slide**
| Mechanism | Contributes |
|---|---|
| Threat modelling and acceptance criteria | Decide access and disclosure *before* code |
| Shared application controls | Enforce in reusable code |
| Copilot instructions and skills | Steer generation towards approved patterns |
| Automated verification | Regression tests and required checks |
| Human review | Policy intent and judgement calls |

**Visual:** five stacked layers, each with an icon. Label it "No single layer is enough".

**Speaker notes**
This is the model for the whole session. Each segment exercises one or two layers. Notice that Copilot features are only one row. Instructions and skills *steer* generation, but enforcement lives in the application, verification lives in CI, and judgement stays with people. We'll come back to this table at the end.

---

### Slide 6: DEMO + LAB 1: Read the ticket

**On slide**
> **Demo:** DEMO-201 activity report
> **Lab, Exercise 1 (8 min):** TICKET-101 customer CSV export
> 1. List the open security decisions *without* Copilot
> 2. Then ask Copilot what you missed
> 📝 Worksheet Part 1

**Visual:** demo and lab template, with the timer and the prompt in a code box:
`List the security decisions this ticket leaves open, phrased as questions for the product owner. Do not propose an implementation.`

**Speaker notes**
Demo walkthrough 1 (4 min). Then set the lab. Insist on the "without Copilot first" step. The comparison is the learning. At the end, ask: "Who did Copilot beat? Who beat Copilot?" Usually both happen.

---

## Segment 2: Turn risks into acceptance criteria (15–35 min)

### Slide 7: Section divider: from risks to criteria

**On slide**
> **15–35 min · Turn risks into acceptance criteria**

**Visual:** the trace motif with **Decision** and **Criterion** lit.

**Speaker notes**
We've found the open decisions. Now we turn them into something a test and a reviewer can check.

---

### Slide 8: Why ASVS, and why a curated subset

**On slide**
- **OWASP ASVS 5.0.0:** specific, numbered, versioned requirements
- Traceable: criterion → test → review finding
- **Curated subset** in the repository: relevant, pinned and owned by AppSec
- **OWASP Top 10 for LLM Applications:** add it when the *feature itself* uses an LLM

**Visual:** a snippet of `references/asvs-subset.md` showing the version header and three rows (8.2.1, 8.2.2, 15.3.1).

**Speaker notes**
The OWASP Top 10 is great for awareness, but you can't write a test against "Broken Access Control". ASVS gives you "8.2.2: data-specific access is restricted to consumers with explicit permissions", which you *can* test. We keep a curated, versioned subset in the repository so Copilot cites requirements from a known list rather than from memory. Using Copilot to build an ordinary web feature still needs ordinary application security requirements. The LLM Top 10 only comes in when the feature itself calls a model. We'll see that at the end.

---

### Slide 9: The Security Requirements and Evidence skill

**On slide**
> **Design time:** ticket → open decisions → applicable ASVS → criteria and verification
> **Review time:** criteria + diff + tests → evidence map → gaps → human decisions
>
> `.github/skills/security-requirements-and-evidence/`
> `SKILL.md` (workflow) · `references/asvs-subset.md` (standard)

**Visual:** a two-lane diagram. The design lane feeds the review lane via "Acceptance criteria in the PR". A folder tree beside it.

**Speaker notes**
One skill, two entry points. The workflow lives in `SKILL.md`. The standard lives in a separate reference file, so when ASVS changes you update one file without touching the workflow. Agent skills work with Copilot agent mode, Copilot code review, the cloud agent and the CLI. Copilot loads a skill when the task matches its description. The key rule in the skill: cite only IDs from the reference file. And it *proposes*: it never approves.

---

### Slide 10: DEMO + LAB 2: Write criteria you can verify

**On slide**
> ✅ "Export returns only customers whose `orgId` matches the caller's and whose `deletedAt` is null. **ASVS 8.2.2.** Verified by: Acme export contains no Globex or deleted IDs."
> ❌ "The export is secure and follows OWASP."
>
> **Lab, Exercise 2 (12 min):** threat sketch → skill in design mode → commit to 2–3 criteria
> 📝 Worksheet Part 2

**Visual:** good and bad criteria side by side, with the good one annotated: *specific behaviour · standard · verification*.

**Speaker notes**
Demo walkthrough 2 (6 min). Then set the lab. Tell delegates you're their product owner. The recommended answers are admin-only export, and phone excluded pending confirmation. During the check, read a delegate's criterion aloud and ask "Could CI or a reviewer verify that?" Watch for ASVS IDs that aren't in the curated list.

---

## Segment 3: Put secure defaults in the repository (35–55 min)

### Slide 11: Section divider: secure defaults

**On slide**
> **35–55 min · Put secure defaults in the repository**

**Visual:** the trace motif with **Control** lit, faintly.

**Speaker notes**
We know what we want. Now we make Copilot reach for the right patterns without anyone having to ask each time.

---

### Slide 12: Instructions compared with skills

**On slide**
| | `copilot-instructions.md` | Agent skill |
|---|---|---|
| Loaded | On every request | When relevant to the task |
| Holds | Short, always-on rules about *this codebase* | Task-specific workflows and references |
| Example | "Use `requirePermission()`; never call `getAllCustomers()` from a route" | "Map this change to ASVS and propose criteria" |
| Size | 15–25 lines | As long as the task needs |

**Visual:** the table, with two small file-tree callouts.

**Speaker notes**
GitHub's own guidance: use custom instructions for simple instructions relevant to almost every task, and skills for more detailed instructions Copilot should only load when relevant. Good instructions read like the five things your best reviewer says on every PR. They name the actual helpers and the actual anti-patterns. "Write secure code" achieves nothing.

---

### Slide 13: DEMO + LAB 3: Before and after

**On slide**
> 1. **Before:** new chat → ask for an implementation plan → note what it uses
> 2. Write `.github/copilot-instructions.md` (≤ 25 lines)
> 3. **After:** *new* chat → same prompt → compare
> 📝 Worksheet Part 3

**Visual:** a before-and-after comparison table:

| | Before | After |
|---|---|---|
| Data | `getAllCustomers()` | `listCustomersForOrg(req.user.orgId)` |
| Authorisation | none / inline role check | `requirePermission('customers:export')` |
| Fields | every field | `CUSTOMER_EXPORT_FIELDS` |

**Speaker notes**
Demo walkthrough 3 (6 min). In the demo, show the stage 1 draft passing its own test while an Acme *viewer* reads Globex's audit log. That's the moment the room pays attention. Stress the *new* chat. Re-using a chat carries context and invalidates the comparison. Ask delegates to check the References list for the instructions file.

---

## Segment 4: Implement and verify one control (55–85 min)

### Slide 14: Section divider: implement and verify

**On slide**
> **55–85 min · Implement and verify one control**

**Visual:** the trace motif with **Control** and **Test** lit.

**Speaker notes**
The longest hands-on block. Copilot writes most of the code; you define correct and check the proof.

---

### Slide 15: A security test you've never seen fail is a hypothesis

**On slide**
Minimum tests for an access-controlled endpoint:
- ✅ authorised user, correct data
- 🚫 forbidden role → 403
- 🚫 unauthenticated → 401
- 🚫 other tenant's data absent
- 🚫 restricted fields absent

Then **break the control once** and watch a test fail.

**Visual:** a test run showing a red failure: `exports only active customers from the caller's organisation`, with an expected and actual diff showing `c-2001`.

**Speaker notes**
Most generated tests are happy-path only. They prove the feature works, not that it's safe. Negative tests prove the boundary holds. And the only way to know a negative test works is to remove the control and see it fail. In the demo I'll swap the tenant-scoped function for the legacy one. Everyone does the same in the lab.

---

### Slide 16: DEMO + LAB 4: Implement TICKET-101

**On slide**
> **Lab, Exercise 4 (22 min)**
> Agent mode → review every change → `npm test` → break tenant scoping → see red → revert
> Check: route above `/:id` · `requirePermission` · `listCustomersForOrg` · explicit fields
> Stretch: `=HYPERLINK(` in customer `c-1003` (ASVS 1.2.10)

**Visual:** the review checklist as tick boxes. A small inset of the `c-1003` fixture line.

**Speaker notes**
Demo walkthrough 4 (6 min). Circulate during the lab. Common issues: the route after `/:id` gives a 404, `customers:export` gets added to every role, and tests only check for 200. At 83 minutes, ask "Who saw a test fail when they broke tenant scoping?" Anyone who didn't has tests that don't assert isolation.

---

## Segment 5: Apply a pull request evidence gate (85–110 min)

### Slide 17: Section divider: the evidence gate

**On slide**
> **85–110 min · Apply a pull request evidence gate**

**Visual:** the trace motif with **Check** and **Reviewer** lit.

**Speaker notes**
We have code and tests. Now we make the PR itself carry the evidence, and make missing evidence block the merge.

---

### Slide 18: Layers of verification

**On slide**
| Layer | Catches | Can't catch |
|---|---|---|
| `security-regression-tests` (required) | Broken controls | Wrong policy |
| `security-evidence` (required) | Missing evidence or human-review items | Weak evidence |
| `dependency-audit` (advisory) | Known vulnerable packages | Your logic bugs |
| Copilot code review | Pattern deviations, missing tests | Business intent |
| Human reviewer | Policy, judgement, accepted risk | Fatigue: so narrow their job |

**Visual:** the table, with a "Merge blocked: Required statuses must pass" banner screenshot.

**Speaker notes**
Required status checks on a protected branch must pass before a merge. Not every check should be required: the dependency audit is advisory so a new upstream advisory doesn't block unrelated work. Copilot code review reads the instructions and skills from the head branch, so your security guidance applies to reviews automatically. Each layer covers a gap in the others.

---

### Slide 19: Untrusted input in your own pipeline

**On slide**
```yaml
- name: Check the PR description contains complete security evidence
  env:
    PR_BODY: ${{ github.event.pull_request.body }}
  run: node scripts/check-pr-evidence.js
```
> ❌ Never: `run: echo "${{ github.event.pull_request.body }}"`

**Visual:** code from `.github/workflows/security-checks.yml`, with the `env:` line highlighted. The "never" line in red.

**Speaker notes**
A short but important aside. The PR body is attacker-controlled input. Interpolating it directly into a `run:` script is script injection in your CI, with access to whatever secrets that job has. Pass it through an environment variable. Secure by default applies to the pipeline too, and Copilot will generate the unsafe version if you let it.

---

### Slide 20: DEMO + LAB 5: Open the PR

**On slide**
> **Lab, Exercise 5 (16 min)**
> 1. Open the PR with the template **empty** → watch `security-evidence` fail → merge blocked
> 2. Skill in **review mode** → fix real gaps
> 3. Complete the evidence table → green
> 4. Request a Copilot review
> 📝 Part 4: what must a human still decide?

**Visual:** two PR check screenshots side by side, ❌ then ✅, with the warning "SAC-3: needs a human decision before merge".

**Speaker notes**
Demo walkthrough 5 (7 min). Point out that "Tested manually" passes the gate: it checks presence, not quality. During the check, collect what delegates wrote for "what must a human decide". Aim for policy intent, data-minimisation sign-off, permission changes and accepted risks such as rate limiting. If anyone got green with "TODO done", ask them which test a reviewer would open.

---

## Segment 6: Transfer to the next feature (110–120 min)

### Slide 21: Section divider: transfer

**On slide**
> **110–120 min · Transfer to the next feature**
> TICKET-102: AI account summary

**Visual:** the full trace motif, all nodes lit.

**Speaker notes**
One ticket was practice. The habit is what matters. The next ticket uses an LLM, which brings in a second OWASP reference.

---

### Slide 22: Every control has a home

**On slide**
| Home | When | Example |
|---|---|---|
| **Spec** | A decision for this feature | "Only admins may export" |
| **Skill** | Reusable guidance, used when relevant | "On AI features, check LLM risks" |
| **Shared control** | Must be enforced at runtime, every time | `requirePermission()`, CSV serialiser |
| **CI** | Verifiable automatically on every PR | Regression tests, evidence gate |
| *Instructions* | A codebase-wide rule Copilot should always follow | "Never call LEGACY functions" |

**Visual:** five labelled "homes" (house icons), each with an example card.

**Speaker notes**
Model one: "the assistant could update the customer's plan". That's excessive agency. The decision goes in the spec, and the default is no. If it's allowed, enforcement is a shared control: the tool call runs with the human caller's permissions. The reminder to look for this on every AI feature belongs in the skill, which is why the skill has an LLM risk triggers file. Pairs, five minutes, Exercise 6.

---

### Slide 23: What we built

**On slide**
> **Decision** "Who can export?"
> → **Criterion** SAC-1 · ASVS 8.2.1
> → **Control** `requirePermission('customers:export')`
> → **Test** "rejects a support user with 403"
> → **Check** `security-regression-tests ✅` `security-evidence ✅`
> → **Reviewer** "Admin-only confirmed"

**Visual:** the completed trace motif with real values from the lab, possibly a screenshot of a delegate's PR (with permission).

**Speaker notes**
Debrief Exercise 6: take two or three classifications (answers in the solution walkthrough). Make the point that most LLM-feature controls still live in the surrounding application. The LLM Top 10 helps you find them, and ASVS-style controls enforce them. Then return to the trace: every link here was a deliberate decision, made before or during implementation, and verified after.

---

### Slide 24: One thing for next week

**On slide**
Pick **one** for your own repository:
- A `copilot-instructions.md` with your five review rules
- A skill pinned to your security standard
- One required security check on `main`

Keep: your lab repository · the skill · the workflow · the worksheet

**Visual:** three cards. A QR code or link to the course materials.

**Speaker notes**
Ask each delegate to write their one commitment in the last line of the worksheet. Remind them the lab repository is theirs to keep: the skill, the workflow and the evidence script are designed to be copied into real repositories. Point AppSec-minded delegates at the curated ASVS file as the thing to own. Thank everyone, and share the feedback link.

---

## Appendix: assets to capture for the deck

| Asset | Source | Slide |
|---|---|---|
| Vague ticket snippet | `lab/starter/docs/tickets/TICKET-101-customer-csv-export.md` | 4 |
| `asvs-subset.md` header and rows | `lab/starter/.github/skills/.../references/asvs-subset.md` | 8 |
| Skill folder tree | `lab/starter/.github/skills/` | 9 |
| Before-and-after plan screenshots | Rehearsal (demo walkthrough 3) | 13 |
| Red test failure | `demo/repo` stage 3 with the tenant scoping broken | 15 |
| `c-1003` fixture line | `lab/starter/src/data/fixtures.js` | 16 |
| "Merge blocked" banner | The demo PR with the incomplete description | 18 |
| Workflow `env:` snippet | `.github/workflows/security-checks.yml` | 19 |
| PR checks ❌ and ✅ | The demo PR before and after the description update | 20 |
