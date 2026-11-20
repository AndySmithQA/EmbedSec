# Demo walkthrough 6: Transfer to the next feature

**Segment:** 110–120 min · **Demo:** 2 min · **Stage:** any  
**Goal:** frame the transfer exercise and model one classification decision.

## Steps

1. **Show the four homes for a security control** (slide):

   | Home | Put it here when... | Example |
   |---|---|---|
   | **Spec** (ticket acceptance criteria) | It's a decision specific to this feature | "Only admins may export" |
   | **Skill** | It's reusable review or design guidance, used when relevant | "On AI features, check LLM risks" |
   | **Shared control** (application code) | It must be enforced every time, at runtime | `requirePermission()`, tenant-scoped repositories, CSV serialiser |
   | **CI** | It can be verified automatically on every PR | Regression tests, evidence gate, dependency audit |
   | *(Instructions)* | It's a codebase-wide rule Copilot should always follow | "Never call LEGACY functions from routes" |

2. **Model one decision.** Open `lab/starter/docs/tickets/TICKET-102-account-summary.md` (it's also in delegates' repositories) and read: *"It would be great if the assistant could also update the customer's plan."*

   > **Say:** "This is excessive agency. Where does the control belong? The *decision* to allow it or not belongs in the **spec**. If it's allowed, enforcement belongs in a **shared control**: the tool call must go through `requirePermission('customers:write')` with the caller's identity, not the model's. And the reminder to look for this on every AI feature belongs in the **skill**, which is why `llm-risk-triggers.md` exists."

3. **Set the exercise.**

   > "With a partner, classify the seven concerns in Exercise 6. Then ask the skill which LLM risks apply. Five minutes, then we'll compare."

## Debrief (last 3 minutes)

Take two or three answers. Expected classifications are in `instructor/lab-solution-walkthrough.md`. End with:

> "Next week, pick **one** thing for your own repository: a `copilot-instructions.md` with your five review rules, a skill pinned to your standard, or one required security check."
