# TICKET-102: AI account summary for support agents

**Type:** Feature  
**Requested by:** Support Operations  
**Priority:** Medium

## Story

As a support agent, I want a one-paragraph AI summary of a customer's account so that I can get up to speed before a call.

## Notes from the requester

- Add `GET /api/customers/:id/summary`.
- Send the customer's record, internal notes and recent audit events to our LLM provider and return the summary.
- Customers sometimes paste instructions into their profile fields. The summary should still be accurate.
- It would be great if the assistant could also update the customer's plan when the agent asks it to.

## Acceptance criteria

- [ ] Support agents see a summary on the customer page.
