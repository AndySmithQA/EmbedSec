# Demo walkthrough 3: Put secure defaults in the repository

**Segment:** 35–55 min · **Demo:** 6 min · **Stages:** 0 → 1 → 2  
**Goal:** show the measurable difference that a short `.github/copilot-instructions.md` makes to Copilot's plan.

## Steps

1. **"Before" plan (2 min).** Open a **new chat** in **Ask** mode. Confirm that there is no `.github/copilot-instructions.md`.

   ```text
   Give me a step-by-step implementation plan for docs/tickets/DEMO-201-activity-report.md.
   Name the files you would change and the functions you would call. Do not write the code yet.
   ```

   Point at what to watch for. Typical findings:
   - It calls `getAllAuditEvents()` and filters by `req.query.orgId`.
   - It has no `requirePermission`, or checks `req.user.role === 'admin'` inline.
   - It returns the events as they are, including `ipAddress`, `userAgent` and `metadata.sessionId`.

2. **Show the insecure draft (1 min).** If the live plan was already insecure, say "here is what that looks like as code". Otherwise, say "this is a draft from rehearsal". In the terminal:

   ```bash
   node apply-stage.js 1
   ```

   Open `repo/src/routes/reports.js`. Then run `npm test` in `repo/`. **It passes:** 14 tests.

   > **Say:** "Green tests. The happy-path test Copilot wrote passes. Any admin can read every tenant's audit log by changing a query parameter, and nothing tells us."

   Optional, 30 seconds: show the request in the terminal:

   ```bash
   npm start
   curl -H "Authorization: Bearer token-carol-viewer" "http://localhost:3000/api/reports/activity?orgId=org-globex"
   ```

   An Acme **viewer** reads Globex's audit log, including IPs and session IDs.

3. **Write the instructions (2 min).** Apply stage 2, or type the key lines live and paste the rest:

   ```bash
   node apply-stage.js 2
   ```

   Open `repo/.github/copilot-instructions.md` and walk through it:
   - It names the **exact helpers** (`requirePermission`, tenant-scoped repository functions).
   - It names the **exact things to avoid** (the LEGACY functions, client-supplied `orgId`).
   - It sets **minimum negative tests**.
   - It's about 25 lines. "This isn't a policy document. It's the five things a senior reviewer says on every PR."

4. **"After" plan (1 min).** Open a **new chat** and run the same prompt. Expand **References** to show that `copilot-instructions.md` was used. Compare the plans side by side.

## Key message

> "Instructions apply to every request, with no extra prompting. They are the cheapest secure-by-default control you have. Put rules that apply everywhere in instructions, and put task-specific workflows in skills."

## Transition to the lab

> "Run the 'before' prompt on TICKET-101 and save what you see. Then write your own instructions, at most 25 lines, specific to this codebase, and run the prompt again in a fresh chat. Worksheet Part 3."

## If something goes wrong

| Problem | Recovery |
|---|---|
| The "before" plan is already secure | Good news: Copilot read `docs/architecture.md`. Point out that it only did so because the file exists and happened to be found. Instructions make it reliable. Show stage 1 as the rehearsal draft. |
| The "after" plan still uses a LEGACY function | Check that you used a new chat and that References lists the file. If it does, strengthen the wording live. That's the iteration loop delegates will do too. |
