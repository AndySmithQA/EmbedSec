# Customer portal API: architecture and approved security patterns

A multi-tenant Express API. Each user belongs to exactly one organisation (tenant).
Data is held in memory (`src/data/fixtures.js`) to keep the lab self-contained.

## Request flow

```text
Client --HTTPS--> Express app
                  |-- /health                  (public)
                  `-- /api/*  authenticate()   -> req.user = { id, orgId, role }
                        `-- route  requirePermission('<perm>')
                              `-- tenant-scoped repository function (orgId from req.user)
                                    `-- serializer with explicit field list -> response
```

## Approved patterns

| Concern | Do this | Never do this |
|---|---|---|
| Authentication | Rely on `authenticate()`, mounted on `/api`. | Read tokens or user IDs from query strings or bodies. |
| Function-level authorisation | Add the permission to `src/auth/permissions.js`. Guard the route with `requirePermission('<perm>')`. | Write `if (req.user.role === 'admin')` inline. |
| Tenant isolation | Use `listCustomersForOrg(req.user.orgId)` or `findCustomerForOrg(...)`. Take `orgId` from `req.user` only. | Call `getAllCustomers()` or `getAllAuditEvents()` from a route. Accept `orgId` from the client. |
| Field exposure | Serialise with an explicit field list from `src/serializers/`. | Return `{ ...customer }` or a whole record. |
| Cross-tenant lookups | Return 404, so the response does not reveal that the record exists. | Return 403 for another tenant's record. |
| Security logging | Call `logSecurityEvent()` for denials and sensitive-data access. Log IDs and counts. | Log tokens, card tokens, notes or full records. |
| Errors | Let the central error handler return a generic message. | Return stack traces or internal messages. |

## Data classification

| Field | Classification | May leave the service? |
|---|---|---|
| `id`, `name`, `email`, `company`, `plan`, `createdAt` | Customer personal data (confidential) | Yes, to authorised users in the same tenant |
| `phone` | Customer personal data (confidential) | Detail view only, unless a ticket approves otherwise |
| `internalNotes` | Internal (restricted) | No |
| `riskScore` | Internal (restricted) | No |
| `paymentCardToken` | Payment data (restricted) | Never |
| `deletedAt` set | Erased record | Never returned by user-facing endpoints |

## Roles

See `src/auth/permissions.js`. Current roles: `admin`, `support`, `viewer`.
Adding a permission to a role is a security decision and needs a human reviewer.
