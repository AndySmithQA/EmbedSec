# DEMO-201: Activity report API

**Type:** Feature  
**Requested by:** Head of Operations  
**Priority:** High

## Story

As a manager, I want to see recent activity in the portal so that I can spot unusual behaviour.

## Notes from the requester

- Add `GET /api/reports/activity`.
- Let us filter by organisation and date range.
- Include IP address and browser details so we can spot suspicious logins.
- Return everything we have; we'll decide what to show later.

## Acceptance criteria

- [ ] Managers can see recent activity.
- [ ] We can filter by date.
