const { customers } = require('./fixtures');

/**
 * Returns active (not deleted) customers belonging to one organisation.
 * Request handlers must use this function so every query is tenant-scoped.
 */
function listCustomersForOrg(orgId) {
  if (!orgId) {
    throw new Error('orgId is required');
  }
  return customers
    .filter((c) => c.orgId === orgId && c.deletedAt === null)
    .map((c) => ({ ...c }));
}

/**
 * Returns one active customer if, and only if, it belongs to the organisation.
 */
function findCustomerForOrg(orgId, customerId) {
  if (!orgId) {
    throw new Error('orgId is required');
  }
  const match = customers.find(
    (c) => c.id === customerId && c.orgId === orgId && c.deletedAt === null,
  );
  return match ? { ...match } : null;
}

/**
 * LEGACY: returns every customer in every organisation, including deleted records.
 * Used only by the nightly billing reconciliation job, which runs outside any user session.
 * Never call this from a request handler.
 */
function getAllCustomers() {
  return customers.map((c) => ({ ...c }));
}

module.exports = { listCustomersForOrg, findCustomerForOrg, getAllCustomers };
