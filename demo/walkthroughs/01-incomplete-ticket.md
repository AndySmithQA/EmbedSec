# Demo walkthrough 1: Start with an incomplete ticket

**Segment:** 0–15 min · **Demo:** 4 min · **Stage:** 0  
**Goal:** show that the security decisions are hidden in what the ticket *doesn't* say, and that Copilot will happily build the ticket as written.

## Steps

1. **Open `docs/tickets/DEMO-201-activity-report.md`.** Read the notes aloud.

   > **Say:** "This is a real-looking ticket. Nothing here is malicious. It's just incomplete. Let's count the security decisions it leaves to whoever writes the code. Today, that's increasingly Copilot."

2. **Annotate live.** Highlight each phrase and ask the room what decision it hides:

   | Phrase in the ticket | Hidden decision |
   |---|---|
   | "As a manager" | Which role? There is no "manager" role in `src/auth/permissions.js`. |
   | "filter by organisation" | Should a user *ever* choose the organisation? That's a cross-tenant risk. |
   | "Include IP address and browser details" | That's personal data. Who may see it? |
   | "Return everything we have" | Field exposure. Audit metadata contains session IDs. |
   | "filter by date range" | Input validation and bounds. What about a 10-year range? |

3. **Show the data.** Open `src/data/fixtures.js`, scroll to `auditEvents` and point at `ipAddress`, `userAgent` and `metadata.sessionId`.

4. **Show the trap.** Open `src/data/auditRepository.js` and point at `getAllAuditEvents()` with its LEGACY comment.

   > **Say:** "The codebase has a safe path and an unsafe path. Humans learn which one to use through code review and tribal knowledge. Copilot only knows what's in its context."

5. **Ask Copilot** (Ask mode):

   ```text
   Read #file:docs/tickets/DEMO-201-activity-report.md and #file:docs/architecture.md.
   List the security decisions this ticket leaves open, phrased as questions for the product owner.
   Do not propose an implementation.
   ```

   Compare its list with the room's. Point out one thing it found that the room missed, and one thing it missed or got wrong.

## Key message

> "Copilot is very good at doing what the ticket says. Secure by default means deciding what the ticket *should* say before anyone, human or AI, writes code."

## Transition to the lab

> "Open TICKET-101 in your repository. Spend five minutes on your own listing the open decisions, then use the same prompt to see what you missed. Worksheet Part 1."

## If something goes wrong

| Problem | Recovery |
|---|---|
| Copilot starts writing code | Point out that it did, which is itself the lesson. Then re-run the prompt with "Do not write code" at the start. |
| Copilot's list is very thin | Show your annotated table instead. The point of this demo is the human analysis. |
