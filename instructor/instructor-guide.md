# Instructor guide

## Embed Security into AI Development by Default with GitHub Copilot

| | |
|---|---|
| **Format** | 2-hour short instructor-led training (ILT), with a hands-on lab |
| **Audience** | Software engineers and tech leads who already use GitHub Copilot and are familiar with pull requests |
| **Group size** | 8–20 delegates per instructor. Add a lab assistant above 14. |
| **Delivery** | In person or virtual. Delegates need their own machine and GitHub account. |
| **Distinguishing outcome** | Each delegate leaves with a PR that connects a security decision to an application control, a test result and a reviewer's decision: the **ticket-to-PR trace**. |

---

## 1. Course design in one paragraph

The whole session follows **one feature request from ticket to pull request**. Delegates use Copilot to identify security requirements *before* writing code, implement the feature using the repository's approved patterns, and show how a CI check and human review verify the result. A reusable Copilot agent skill, **Security Requirements and Evidence**, maps changes to a curated, versioned subset of **OWASP ASVS 5.0.0**. At design time it turns a ticket into acceptance criteria; at review time it checks a diff for evidence against them. The OWASP Top 10 for LLM Applications comes in only where a feature itself uses an LLM, in the transfer exercise. We supply the starter app, the skill and the CI workflow, so the two hours go into *making and verifying security decisions*, not boilerplate.

## 2. Learning outcomes

By the end, delegates can:

1. **Identify** the security decisions a feature ticket leaves open, before implementation starts.
2. **Write** security acceptance criteria that are specific, testable and traceable to an OWASP ASVS requirement, using a Copilot skill as an assistant, not an authority.
3. **Configure** repository-level Copilot instructions that steer generated code towards approved shared controls, and measure the effect.
4. **Implement** a feature with Copilot and **prove** the security controls with negative tests that fail when the control is removed.
5. **Use** a PR evidence gate and required status checks, and **articulate** what a human reviewer must still decide.
6. **Decide** whether a security concern belongs in the feature spec, a reusable skill, a shared application control, or CI.

## 3. Key messages

Return to these throughout the session.

1. **Copilot builds what the ticket says.** Secure by default starts by deciding what the ticket *should* say.
2. **The skill proposes; the engineer decides.** Standards stay in a versioned reference that AppSec owns.
3. **Instructions are the cheapest secure-default control.** They apply to every request without anyone remembering to ask.
4. **A security test you have never seen fail is a hypothesis.**
5. **Automation narrows the reviewer's job; it doesn't replace it.** The gate checks that evidence is *present*. Humans judge whether it's *right*.
6. **Every control has a home:** spec, skill, shared control, CI, or instructions.

## 4. Materials

| Material | Location | Who uses it |
|---|---|---|
| Deck content (slide-by-slide, with speaker notes) | `presentation/deck-content.md` | Deck builder, instructor |
| This guide | `instructor/instructor-guide.md` | Instructor |
| Lab answers, expected Copilot behaviour and debrief answers | `instructor/lab-solution-walkthrough.md` | Instructor, lab assistants |
| Reference solution code | `instructor/lab-solution/` | Instructor (do not share) |
| Demo repository, stages and stage script | `demo/` | Instructor |
| Demo walkthroughs, one per segment | `demo/walkthroughs/` | Instructor |
| Delegate lab guide | `lab/lab-guide.md` | Delegates |
| Delegate worksheet | `lab/delegate-worksheet.md` | Delegates |
| Lab starter repository | `lab/starter/` | Delegates (via a template repository) |

## 5. Preparation

### Two weeks before

- [ ] Confirm delegates have **Copilot Business or Enterprise** seats (or individual plans) with **agent mode** and **Copilot code review** enabled by organisation policy.
- [ ] Decide where delegate repositories will live:
  - **Personal public repositories** are simplest. Branch protection works on GitHub Free for public repositories.
  - An **organisation** on GitHub Team or Enterprise lets you use private repositories.
- [ ] Publish `lab/starter/` as a **template repository**:
  ```bash
  cd lab/starter
  git init -b main && git add . && git commit -m "Lab starter"
  gh repo create <org>/embedsec-lab-starter --public --source . --push
  gh repo edit <org>/embedsec-lab-starter --template
  ```
  Exclude `node_modules/`. The included `.gitignore` handles this.
- [ ] Send joining instructions: the template link, prerequisites (VS Code, the Copilot extensions, Node.js 22+, Git), and **Exercise 0** of the lab guide to complete before the session.

### One week before

- [ ] **Check the ASVS IDs.** Open `lab/starter/.github/skills/security-requirements-and-evidence/references/asvs-subset.md` and confirm that every ID and summary still matches the official ASVS 5.0.0 text at [asvs.owasp.org](https://asvs.owasp.org). Make the same change in `demo/repo/` and in the lab solution. If your organisation has adopted a newer ASVS version, update the version header and IDs together.
- [ ] **Check the LLM risk names** in `references/llm-risk-triggers.md` against the edition of the OWASP Top 10 for LLM Applications your organisation uses. The file uses the 2025 names. The 2026 edition was published in September 2026.
- [ ] Do a full **run-through of the lab** in a fresh template copy, timing yourself. Copilot behaviour changes between releases, so update the expected behaviour in `lab-solution-walkthrough.md` if needed.

### The day before

- [ ] Follow `demo/walkthroughs/00-prepare.md`: publish the demo repository, make the checks required, rehearse, capture fallback screenshots, and push the demo PR branch.
- [ ] Email a reminder to complete Exercise 0.

### On the day (30 minutes before)

- [ ] `node demo/apply-stage.js 0`, and confirm that `demo/repo` is clean and on `main`.
- [ ] Open the deck, VS Code (zoomed), the browser tabs and the terminal tabs (see walkthrough 0).
- [ ] Put the template link and the lab guide link in the chat or on the whiteboard.
- [ ] As delegates arrive, check that Exercise 0 is complete. Help anyone who is blocked. The most common issue is branch protection on a private repository.

## 6. Session plan

Every segment follows the same rhythm: **brief framing (slides) → short demo on DEMO-201 → delegates do the same on TICKET-101 → quick check**. Demo timings are deliberately short. The lab time is the course.

| Time | Segment | Slides | Demo | Delegates | Lab exercise |
|---|---|---|---|---|---|
| 0–15 | Start with an incomplete ticket | 1–6 | 4 min, walkthrough 1 | 8 min | Exercise 1 |
| 15–35 | Turn risks into acceptance criteria | 7–10 | 6 min, walkthrough 2 | 12 min | Exercise 2 |
| 35–55 | Put secure defaults in the repository | 11–13 | 6 min, walkthrough 3 | 12 min | Exercise 3 |
| 55–85 | Implement and verify one control | 14–16 | 6 min, walkthrough 4 | 22 min | Exercise 4 |
| 85–110 | Apply a pull request evidence gate | 17–20 | 7 min, walkthrough 5 | 16 min | Exercise 5 |
| 110–120 | Transfer to the next feature | 21–24 | 2 min, walkthrough 6 | 5 min plus 3 min debrief | Exercise 6 |

### Segment 1 (0–15): Start with an incomplete ticket

**Purpose:** establish the course thread and the core problem: Copilot implements tickets literally, and tickets are incomplete.

**Facilitation**

1. **Slides 1–3 (3 min).** Introductions, outcomes, and the ticket-to-PR trace. Show the trace diagram and tell delegates they will build it.
2. **Slides 4–5 (2 min).** Why AI-assisted development needs security *by default*: the speed of generation outpaces review, and Copilot only knows what's in its context.
3. **Demo (4 min).** Walkthrough 1, annotating DEMO-201.
4. **Lab (8 min).** Exercise 1. Insist on the "without Copilot first" step; it makes the comparison meaningful.
5. **Quick check (1 min, slide 6).** "Hands up if Copilot found something you missed. And if you found something Copilot missed?" Usually both happen, which is the point.

**Watch for:** delegates skipping straight to Copilot. Delegates fixating on the CSV format instead of the access questions.

### Segment 2 (15–35): Turn risks into acceptance criteria

**Purpose:** introduce the skill and ASVS, and practise writing criteria that are verifiable.

**Facilitation**

1. **Slides 7–8 (2 min).** What ASVS is and why we curate a subset: specific, versioned, traceable. When the LLM Top 10 applies.
2. **Demo (6 min).** Walkthrough 2, including critiquing the skill output live.
3. **Lab (12 min).** Exercise 2. **You play the product owner.** Circulate and answer questions such as "can support export?" consistently. The recommended answers are admin-only, and phone excluded pending confirmation (see the solution walkthrough). Accepting a well-justified alternative is fine, as long as the criteria and tests match it.
4. **Quick check (slides 9–10).** Ask one delegate to read a criterion aloud. Ask the room: "Could CI or a reviewer verify that?" Rewrite it together if not.

**Watch for:** vague criteria ("secure", "follows OWASP"). ASVS IDs cited from memory or invented by Copilot. Too many criteria: cap at three.

### Segment 3 (35–55): Put secure defaults in the repository

**Purpose:** show that repository instructions measurably change Copilot's output.

**Facilitation**

1. **Slides 11–12 (2 min).** Instructions compared with skills: which to use when.
2. **Demo (6 min).** Walkthrough 3. The before-and-after comparison is the key moment. If live behaviour doesn't show a difference, use stage 1 and say honestly that it's from rehearsal.
3. **Lab (12 min).** Exercise 3.
4. **Quick check (slide 13).** "Which rule changed Copilot's plan the most?" Collect two answers.

**Watch for:** instructions that are long, generic or aspirational ("write secure code"). Delegates reusing the same chat for "after", which carries context over. They must start a new chat.

### Segment 4 (55–85): Implement and verify one control

**Purpose:** implement with Agent mode, review critically, and write tests that would fail if the control were removed.

**Facilitation**

1. **Slides 14–15 (2 min).** What "verified" means: negative tests, and breaking the control once.
2. **Demo (6 min).** Walkthrough 4, including the "break it and watch it fail" moment.
3. **Lab (22 min).** Exercise 4. This is the longest block. Circulate, and prioritise anyone whose tests don't pass by minute 75.
4. **Quick check (slide 16, at 83 min).** "Who saw a test fail when they removed tenant scoping?" Anyone who didn't: their tests don't assert isolation.

**Watch for** (see the solution walkthrough for details):

- The route registered after `/:id`, which gives a 404.
- Copilot adding `customers:export` to every role, or checking roles inline.
- Tests that only check status 200.
- `getAllCustomers()` creeping back in through autocomplete.

### Segment 5 (85–110): Apply a pull request evidence gate

**Purpose:** experience a required check blocking a merge, use the skill in review mode, and define the human reviewer's remaining role.

**Facilitation**

1. **Slides 17–18 (2 min).** Layers of verification, and what each layer catches.
2. **Demo (7 min).** Walkthrough 5. Point out the `env:` pattern for the untrusted PR body.
3. **Lab (16 min).** Exercise 5.
4. **Quick check (slides 19–20).** Collect what delegates wrote for "what must a human still decide". Aim for policy intent, data-minimisation sign-off, changes to shared controls and permissions, and accepted risks such as rate limiting.

**Watch for:** delegates writing "TODO" or "tested" as evidence to get green. Call this out. The gate checks presence, and the reviewer checks quality.

### Segment 6 (110–120): Transfer to the next feature

**Purpose:** generalise from one ticket to a habit, using an AI feature (TICKET-102) to bring in LLM risks.

**Facilitation**

1. **Slides 21–22 (1 min).** The four homes for a control, plus instructions.
2. **Demo (2 min).** Walkthrough 6: model the "update the plan" concern.
3. **Pairs (5 min).** Exercise 6.
4. **Debrief (2 min, slide 23).** Take two or three classifications. Use the answers in the solution walkthrough.
5. **Close (1 min, slide 24).** One commitment for next week. Point delegates to the materials they keep.

## 7. Assessment: the ticket-to-PR trace

Short ILT is not formally assessed. Use this rubric for self-assessment, or for an optional badge.

| Criterion | Developing | Proficient | Strong |
|---|---|---|---|
| Open decisions | Fewer than three, or mostly functional | Five or more, including access, scope and fields | Also identifies abuse cases (formula injection, bulk exfiltration) |
| Acceptance criteria | Vague or untestable | Two or three specific and testable criteria, each with a valid ASVS ID | Each traces to a decision and names the control to reuse |
| Copilot instructions | Generic advice | Names specific helpers and anti-patterns, with a measurable before-and-after difference | Concise (25 lines or fewer), and includes test expectations |
| Tests | Happy path only | 401, 403, cross-tenant and restricted-field tests | Demonstrated failure when the control was removed. Stretch goals covered. |
| PR evidence | Gate passes with placeholder evidence | Every row links a real test | Human-review list captures genuine policy decisions and accepted risks |
| Transfer | Fewer than half classified sensibly | Most classified, with reasons | Identifies controls that need more than one home |

## 8. Timing adjustments

| If you are... | Do this |
|---|---|
| **10 minutes behind at 55 min** | Shorten Exercise 3: delegates use the solution's `copilot-instructions.md` as a starting point and adapt it (give it out on a slide). |
| **Behind at 85 min** | Delegates who aren't green copy `instructor/lab-solution/` files for the route and tests, so they can still do the PR exercise. The PR exercise matters more than finishing the code. |
| **Ahead of time** | Stretch goals in Exercise 4. In Exercise 5, the optional "break a required check". Ask the skill to review TICKET-102 in design mode. |
| **Delivering in 90 minutes** | Cut Exercise 6 to a 3-minute instructor-led discussion. Give out instructions in Exercise 3 instead of having delegates write them. |
| **Delivering in 3 hours** | Add a CodeQL or secret scanning segment to Exercise 5. Have delegates implement TICKET-102's shared controls with a stubbed LLM client. |

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Copilot doesn't use the skill | Ask mode, skills disabled, or the request doesn't match the description | Use Agent mode. Name the skill explicitly. Enable agent skills in VS Code settings and reload. |
| Copilot ignores `copilot-instructions.md` | Same chat session, wrong path, or instruction files disabled | Start a new chat. The path must be exactly `.github/copilot-instructions.md`. Check that **Use instruction files** is enabled in settings. |
| `export.csv` returns 404 | Route registered after `/:id` | Move the route above `/:id`. |
| `export.csv` returns `{"customer": ...}` or 404 for admins | Same as above: `export.csv` is being treated as an ID | Same fix. |
| Required checks can't be selected | The workflow hasn't run yet | Push to `main` or open a PR once, then configure. |
| Branch protection is unavailable | Private repository on a free plan | Make the repository public, or use the training organisation. |
| Admin can merge despite failing checks | The ruleset allows bypass, or the admin "include administrators" option is off | Remove bypass actors. For classic rules, enable "Do not allow bypassing". |
| `security-evidence` doesn't re-run on edit | Events throttled, or `edited` is missing from the workflow | Check the Actions tab. Push an empty commit. |
| `npm ci` fails in Actions | `package-lock.json` missing or out of date | Run `npm install` locally and commit the lock file. |
| `npm test` finds no tests, or a glob error | Node.js older than 22 | Install Node.js 22 LTS or later. |
| `dependency-audit` is red | A new upstream advisory | It's advisory (`continue-on-error`). Use it as a talking point about which checks to make required. |

## 10. Frequently asked questions

**Why ASVS and not the OWASP Top 10?**
The Top 10 is an awareness document about risk categories. ASVS gives specific, numbered, versioned requirements you can trace to a criterion, a test and a review finding. That's what makes the trace possible.

**Why a curated subset, and not all of ASVS?**
A focused, versioned list keeps the skill's output relevant and stops it citing requirements from memory, which can be wrong. AppSec owns the list and updates it through PRs.

**Isn't the evidence gate easy to game?**
Yes. It checks that evidence is present, not that it's correct. That's deliberate: it makes gaps visible and gives the reviewer a map. Quality is the reviewer's job. Compare it with required tests, which *do* verify behaviour.

**Why not just rely on Copilot code review?**
Copilot code review is one layer, and it benefits from the same instructions and skills. But it's advisory, and it can't make policy decisions. Required checks enforce; humans decide.

**Should instructions or skills hold our security standards?**
Instructions should hold short, always-on rules about *this codebase*. Skills should hold task-specific workflows, with references to versioned standards. Standards themselves belong in a reference file the skill reads.

**What about when the feature itself uses an LLM?**
Then bring in the OWASP Top 10 for LLM Applications during threat modelling, as TICKET-102 shows. Most resulting controls still land in the surrounding application: access control, field allow-lists, output encoding and rate limits.

**Can we use this with other languages and frameworks?**
Yes. The pattern doesn't depend on the stack. Replace the helpers named in the instructions and the skill's "unapproved patterns" list with your own.
