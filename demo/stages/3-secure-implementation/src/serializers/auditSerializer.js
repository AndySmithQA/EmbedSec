// DEMO-201: IP address, user agent and metadata (which holds session IDs) are excluded
// pending a decision on who may see network data. See the PR.
const AUDIT_REPORT_FIELDS = Object.freeze(['id', 'actorId', 'action', 'targetId', 'timestamp']);

function toAuditReportEntry(event) {
  return Object.fromEntries(AUDIT_REPORT_FIELDS.map((f) => [f, event[f]]));
}

module.exports = { AUDIT_REPORT_FIELDS, toAuditReportEntry };
