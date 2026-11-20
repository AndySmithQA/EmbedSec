# Demo walkthrough 0: Prepare (the day before)

Allow 30–45 minutes. Live Copilot output varies, so the fallback stages and screenshots are part of the demo, not an afterthought.

## 1. Publish the demo repository

```bash
cd demo
node apply-stage.js 0
cd repo
git init -b main
git add .
git commit -m "Demo starting point"
gh repo create <your-org>/embedsec-demo --public --source . --push
```

> `apply-stage.js` and `stages/` live outside `repo/`, so they are never pushed. Delegates cannot see the answers in your demo repository.

## 2. Make the checks required

1. Push any trivial change to `main` (for example, a line in `README.md`) so that the `security-checks` workflow runs once.
2. Go to **Settings** > **Branches** (or **Rules** > **Rulesets**) and protect `main`:
   - Turn on **Require a pull request before merging**.
   - Turn on **Require status checks to pass**, and add `security-regression-tests` and `security-evidence`.
3. Turn on **Copilot code review** for the repository if your organisation's policy requires you to opt in.

## 3. Check that Copilot sees the skill

In VS Code, open `demo/repo`. In Copilot Chat, switch to **Agent** mode and ask:

```text
Which agent skills are available in this repository?
```

You should see `security-requirements-and-evidence`. If not, enable agent skills in VS Code settings and reload the window.

## 4. Rehearse the "before" plan and capture fallbacks

1. Open a new chat in **Ask** mode, with no `.github/copilot-instructions.md` in the repository (stage 0), and run the "before" prompt from walkthrough 3.
2. Screenshot the response. If it does **not** reach for `getAllAuditEvents()`, trust a client-supplied `orgId` or return whole records, plan to use stage 1 (`node apply-stage.js 1`) to show a typical insecure draft. Say so honestly in the demo: "Here is a draft Copilot produced in rehearsal."
3. Screenshot the design-mode skill output from walkthrough 2.
4. Run `node apply-stage.js 3` and then `npm test`. Confirm that 27 tests pass.

Store the screenshots in a folder you can open quickly during the session.

## 5. Prepare the PR branch

Do this now so that the PR in segment 5 is fast:

```bash
cd demo
node apply-stage.js 3
cd repo
git switch -c demo/DEMO-201-activity-report
git add -A
git commit -m "DEMO-201: activity report API"
git push -u origin demo/DEMO-201-activity-report
git switch main
cd ..
node apply-stage.js 0
```

Do **not** open the PR yet. You open it live in segment 5.

## 6. Set up the screen

- VS Code: zoom in (`Ctrl` + `=`) twice, close the minimap, and pin the Copilot Chat panel on the right.
- Browser: the demo repository's **Pull requests** tab, and the **Settings** > **Branches** page.
- Terminal: in `demo/` (for `apply-stage.js`), with a second tab in `demo/repo`.
- Clear every Copilot Chat history so old context does not leak into the "before" comparison.

## 7. On the day

```bash
cd demo
node apply-stage.js 0
```

Then confirm `git status` in `repo/` is clean and on `main`.
