# Acme customer portal API (instructor demo)

Instructor demo repository for **Embed Security into AI Development by Default with GitHub Copilot**.
The demo ticket is `docs/tickets/DEMO-201-activity-report.md`. Delegates work on a different ticket in their own lab repository.
Use `node ../apply-stage.js <stage>` from this folder to move between demo stages (see `../README.md`).

## Quick start

```bash
npm install
npm test          # all tests should pass before you start
npm start         # http://localhost:3000
```

Try the API as different users:

```bash
curl -H "Authorization: Bearer token-alice-admin"  http://localhost:3000/api/customers
curl -H "Authorization: Bearer token-carol-viewer" http://localhost:3000/api/customers/c-1002
```

| Token | User | Organisation | Role |
|---|---|---|---|
| `token-alice-admin` | Alice | Acme Ltd | admin |
| `token-bob-support` | Bob | Acme Ltd | support |
| `token-carol-viewer` | Carol | Acme Ltd | viewer |
| `token-dave-admin` | Dave | Globex Corporation | admin |

## What is in the repository

| Path | Purpose |
|---|---|
| `src/` | The API. Read `docs/architecture.md` for the approved security patterns. |
| `test/` | Tests run by `npm test` and in CI. |
| `docs/tickets/` | The tickets you will work on. |
| `docs/templates/threat-sketch.md` | Worksheet for turning a ticket into security acceptance criteria. |
| `.github/skills/security-requirements-and-evidence/` | Copilot agent skill that maps changes to OWASP ASVS and checks evidence. |
| `.github/workflows/security-checks.yml` | CI: regression tests, PR evidence gate and dependency audit. |
| `.github/pull_request_template.md` | PR template with the security acceptance criteria table. |
| `scripts/check-pr-evidence.js` | The PR evidence gate. Run locally with `node scripts/check-pr-evidence.js body.md`. |

`.github/copilot-instructions.md` is added live during the demo (stage 2).
