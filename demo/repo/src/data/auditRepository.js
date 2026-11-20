const { auditEvents } = require('./fixtures');

/**
 * Returns audit events for one organisation, newest first.
 * Callers are responsible for validating `from`, `to` and `limit` before calling.
 */
function listAuditEventsForOrg(orgId, { from, to, limit } = {}) {
  if (!orgId) {
    throw new Error('orgId is required');
  }
  return auditEvents
    .filter((e) => e.orgId === orgId)
    .filter((e) => (from ? e.timestamp >= from : true))
    .filter((e) => (to ? e.timestamp <= to : true))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit ?? auditEvents.length)
    .map((e) => ({ ...e, metadata: { ...e.metadata } }));
}

/**
 * LEGACY: every audit event across all organisations. For the SIEM export job only.
 * Never call this from a request handler.
 */
function getAllAuditEvents() {
  return auditEvents.map((e) => ({ ...e, metadata: { ...e.metadata } }));
}

module.exports = { listAuditEventsForOrg, getAllAuditEvents };
