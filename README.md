# Embed Security into AI Development by Default with GitHub Copilot

**Format:** 2-hour short instructor-led training (ILT), with a hands-on lab  
**Audience:** Software engineers and tech leads who already use GitHub Copilot and are familiar with pull requests

The session follows **one feature request from ticket to pull request**. Delegates use Copilot to identify security requirements before writing code, implement the feature using the repository's approved patterns, and show how a CI check and human review verify the result. Each delegate leaves with a **ticket-to-PR trace**: a PR that connects a security decision to an application control, a test result and a reviewer's decision.

## Package contents

```text
EmbedSec/
├── presentation/
│   └── deck-content.md              24 slides: on-slide text, visuals, speaker notes
├── instructor/
│   ├── instructor-guide.md          Outcomes, preparation, session plan, facilitation, rubric, troubleshooting, FAQ
│   ├── lab-solution-walkthrough.md  Model answers, expected Copilot behaviour, common mistakes, debrief answers
│   └── lab-solution/                Reference code for TICKET-101 (do not share with delegates)
├── demo/                            Instructor demo (parallel ticket DEMO-201)
│   ├── README.md
│   ├── apply-stage.js               Switches the demo repository between stages 0-3
│   ├── repo/                        Demo repository to push to GitHub
│   ├── stages/                      Insecure draft, instructions, secure implementation, PR descriptions
│   └── walkthroughs/                00-prepare to 06-transfer: a step-by-step demo script per segment
└── lab/                             Delegate lab (ticket TICKET-101)
    ├── lab-guide.md                 Delegate lab guide, Exercises 0-6
    ├── delegate-worksheet.md        Ticket-to-PR trace worksheet
    └── starter/                     Starter repository to publish as a GitHub template
```

## Session outline

| Time | Segment | Demo walkthrough | Lab exercise |
|---|---|---|---|
| 0–15 min | Start with an incomplete ticket | `01-incomplete-ticket.md` | 1 |
| 15–35 min | Turn risks into acceptance criteria | `02-acceptance-criteria.md` | 2 |
| 35–55 min | Put secure defaults in the repository | `03-secure-defaults.md` | 3 |
| 55–85 min | Implement and verify one control | `04-implement-and-verify.md` | 4 |
| 85–110 min | Apply a pull request evidence gate | `05-evidence-gate.md` | 5 |
| 110–120 min | Transfer to the next feature | `06-transfer.md` | 6 |

## Why there are separate demo and lab tracks

The instructor demonstrates each technique on **DEMO-201** (an audit activity report), and delegates apply it to **TICKET-101** (a customer CSV export). Both use the same app, skill, CI workflow and PR template, so the demo is directly transferable without giving away the lab answers.

## What is supplied to delegates

| Supplied | Location in the starter |
|---|---|
| Multi-tenant Express API with shared security controls | `src/` |
| Security Requirements and Evidence Copilot skill, with a curated OWASP ASVS 5.0.0 subset and LLM risk triggers | `.github/skills/security-requirements-and-evidence/` |
| CI workflow: regression tests, PR evidence gate and dependency audit | `.github/workflows/security-checks.yml` |
| PR template with a security acceptance criteria table | `.github/pull_request_template.md` |
| Lab ticket, transfer ticket and threat-sketch template | `docs/` |

## Verified

- `lab/starter`: 13 tests pass. The unfilled PR template fails the evidence gate, as designed.
- Starter plus `instructor/lab-solution`: 32 tests pass. The model PR description passes the gate.
- `demo/repo` at stages 0, 1, 2 and 3: 13, 14, 14 and 27 tests pass. The stage 3 security tests fail 13 times against the stage 1 insecure draft.

Requires Node.js 22 or later.

## Before first delivery

Check every ID and summary in `references/asvs-subset.md` against the official ASVS 5.0.0 text, and the LLM risk names against the OWASP Top 10 for LLM Applications edition you use. See section 5 of `instructor/instructor-guide.md`.
