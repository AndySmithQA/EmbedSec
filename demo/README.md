# Instructor demo

The demo models every lab step on a **parallel ticket**, so delegates see the technique without seeing the lab answer.

| | Demo (instructor) | Lab (delegates) |
|---|---|---|
| Ticket | DEMO-201: activity report API | TICKET-101: customer CSV export |
| Endpoint | `GET /api/reports/activity` | `GET /api/customers/export.csv` |
| Key risks | Cross-tenant access through `orgId`, IP and session data exposure, unvalidated filters | Bulk export permission, cross-tenant and deleted records, restricted fields, CSV formula injection |
| Same app, skill, CI and PR template | Yes | Yes |

## Folder contents

| Path | What it is |
|---|---|
| `repo/` | The demo repository. Push it to GitHub as your demo repo (see `walkthroughs/00-prepare.md`). |
| `stages/` | Files for each demo stage. Applied with `apply-stage.js`. |
| `apply-stage.js` | Moves `repo/` between stages: `node apply-stage.js 0`, `1`, `2` or `3`. |
| `walkthroughs/` | Step-by-step demo scripts, one per session segment. |

## Stages

| Stage | Command | Repository state | Used in |
|---|---|---|---|
| 0 | `node apply-stage.js 0` | Starting point: no report endpoint, no Copilot instructions | Segments 1–2 |
| 1 | `node apply-stage.js 1` | Copilot's typical insecure first draft (fallback if live generation behaves differently) | Segment 3 "before" |
| 2 | `node apply-stage.js 2` | Stage 1 + `.github/copilot-instructions.md` | Segment 3 "after" |
| 3 | `node apply-stage.js 3` | Instructions + secure implementation + tests (27 passing) | Segments 4–5 |
| - | `stages/4-pull-request/*.md` | Incomplete and complete PR descriptions to paste | Segment 5 |

`apply-stage.js` always resets to stage 0 first, so you can jump to any stage at any time.

## Walkthroughs

| File | Segment | Demo length |
|---|---|---|
| `walkthroughs/00-prepare.md` | Before the session | 30–45 min, the day before |
| `walkthroughs/01-incomplete-ticket.md` | 0–15 min | 4 min |
| `walkthroughs/02-acceptance-criteria.md` | 15–35 min | 6 min |
| `walkthroughs/03-secure-defaults.md` | 35–55 min | 6 min |
| `walkthroughs/04-implement-and-verify.md` | 55–85 min | 6 min |
| `walkthroughs/05-evidence-gate.md` | 85–110 min | 7 min |
| `walkthroughs/06-transfer.md` | 110–120 min | 2 min |
