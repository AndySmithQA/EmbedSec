# Curated ASVS subset for the customer portal

| Field | Value |
|---|---|
| Source | OWASP Application Security Verification Standard (ASVS) |
| Version | 5.0.0 |
| Official text | https://github.com/OWASP/ASVS/tree/master/5.0 and https://asvs.owasp.org |
| Target level | L2, plus selected L3 requirements where noted |
| Curated by | AppSec guild |
| Last reviewed | 2026-11 |

These are **summaries** for quick reference. The official ASVS text is authoritative.
When you cite an ID in a PR, cite it as `v5.0.0-<id>` or plain `<id>` (this repository pins 5.0.0).
To add a requirement, open a PR against this file with the official ID and wording link.

## Authorisation (ASVS chapter V8)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 8.1.1 | L1 | Authorisation rules are documented, covering function-level and data-specific access. | `src/auth/permissions.js`, `docs/architecture.md` |
| 8.2.1 | L1 | Function-level access is restricted to consumers with explicit permissions. | `requirePermission()` in `src/auth/authorize.js` |
| 8.2.2 | L1 | Data-specific access is restricted to consumers with explicit permission to those data items (prevents IDOR and BOLA). | `listCustomersForOrg()`, `findCustomerForOrg()` |
| 8.2.3 | L2 | Field-level access is restricted to consumers with explicit permission to those fields (prevents BOPLA). | Explicit field lists in `src/serializers/` |
| 8.3.1 | L1 | Authorisation is enforced at a trusted service layer, never by client-side controls. | Server-side middleware only |
| 8.4.1 | L2 | Multi-tenant applications use cross-tenant controls so operations never affect other tenants. | Tenant-scoped repository functions using `req.user.orgId` |

## Encoding and output (ASVS chapter V1)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 1.2.10 | L3 | CSV and spreadsheet exports are protected against CSV and formula injection: follow RFC 4180 escaping, and neutralise cells beginning with `=`, `+`, `-`, `@`, tab or null. | None yet. Add a shared CSV serialiser if a feature needs one. |

## Validation and business logic (ASVS chapter V2)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 2.2.1 | L1 | Input is validated against business or functional expectations (allow-lists, ranges, formats). | Validate in the route before calling a repository |
| 2.4.1 | L2 | Anti-automation controls protect functions that could enable bulk data exfiltration or resource exhaustion. | Not yet implemented: platform rate limiting at the gateway |

## API and web service (ASVS chapter V4)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 4.1.1 | L1 | Every response with a body has a `Content-Type` matching the content, including charset. | Set explicitly for non-JSON responses |

## File handling (ASVS chapter V5)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 5.4.2 | L2 | File names served in response headers (for example `Content-Disposition`) are generated or sanitised to prevent header injection. | Generate the file name server-side; never echo user input |

## Data protection (ASVS chapter V14)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 14.1.1 | L2 | Sensitive data is identified and classified. | Data classification in `docs/architecture.md` |
| 14.3.2 | L2 | Responses containing sensitive data set anti-caching headers such as `Cache-Control: no-store`. | Set on export and report responses |

## Secure coding and architecture (ASVS chapter V15)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 15.3.1 | L1 | Only the required subset of fields is returned from a data object, never the whole object. | Explicit field lists in `src/serializers/` |

## Logging and error handling (ASVS chapter V16)

| ID | Level | Summary | Approved control in this repo |
|---|---|---|---|
| 16.3.2 | L2 | Failed authorisation attempts are logged. At L3, access to sensitive data is logged too, without logging the data itself. | `logSecurityEvent()` in `src/security/securityLog.js` |
| 16.5.1 | L2 | A generic message is returned to the consumer when an unexpected or security-sensitive error occurs. | Error handler in `src/app.js` |
