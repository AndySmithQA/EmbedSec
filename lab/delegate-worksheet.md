# Delegate worksheet: ticket-to-PR trace

**Name:**  
**Lab repository URL:**  
**Pull request URL:**

---

## Part 1: Open security decisions (Exercise 1)

| # | Open decision (as a question) | Found by (me / Copilot) | Who decides |
|---|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |
| 5 |  |  |  |
| 6 |  |  |  |

Anything Copilot suggested that you rejected, and why:

---

## Part 2: Security acceptance criteria (Exercise 2)

| ID | Criterion (specific and testable) | ASVS ref | How it will be verified | Traces to decision # |
|---|---|---|---|---|
| SAC-1 |  |  |  |  |
| SAC-2 |  |  |  |  |
| SAC-3 |  |  |  |  |

Did the skill cite any ASVS IDs that were not in the curated subset? What did you do about it?

---

## Part 3: Copilot's plan before and after repository instructions (Exercise 3)

| Aspect | Before instructions | After instructions |
|---|---|---|
| Data access function used |  |  |
| How authorisation is enforced |  |  |
| How fields are selected |  |  |
| Tests proposed |  |  |
| Anything else notable |  |  |

Which instruction made the biggest difference? Which had no effect?

---

## Part 4: Evidence and human review (Exercises 4 and 5)

| SAC | Enforced in (file:line) | Proven by (test name) | CI check run link | Status |
|---|---|---|---|---|
| SAC-1 |  |  |  |  |
| SAC-2 |  |  |  |  |
| SAC-3 |  |  |  |  |

Which change did you make to prove that your tests have teeth? Which test failed?

What must a human reviewer still decide or verify? Automation cannot verify these.

1. 
2. 
3. 

---

## Part 5: Transfer to TICKET-102 (Exercise 6)

| Concern | Spec / Skill / Shared control / CI | Why |
|---|---|---|
| Tenant-scoped summaries |  |  |
| Restricted fields not sent to the LLM |  |  |
| Prompt injection from profile text |  |  |
| Assistant updates the customer's plan |  |  |
| Per-user rate limit |  |  |
| Reviewer reminder for LLM risks |  |  |
| Output encoding before rendering |  |  |

One thing you will change in your own team's repository next week:
