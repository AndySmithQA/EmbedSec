const express = require('express');
const { requirePermission } = require('../auth/authorize');
const { listCustomersForOrg, findCustomerForOrg } = require('../data/customerRepository');
const {
  CUSTOMER_EXPORT_FIELDS,
  toCustomerSummary,
  toCustomerDetail,
} = require('../serializers/customerSerializer');
const { toCsv } = require('../serializers/csv');
const { logSecurityEvent } = require('../security/securityLog');

const router = express.Router();

router.get('/', requirePermission('customers:read'), (req, res) => {
  const customers = listCustomersForOrg(req.user.orgId).map(toCustomerSummary);
  res.json({ customers });
});

// Registered before '/:id' so "export.csv" is not treated as a customer ID.
router.get('/export.csv', requirePermission('customers:export'), (req, res) => {
  const customers = listCustomersForOrg(req.user.orgId);
  const csv = toCsv(customers, CUSTOMER_EXPORT_FIELDS);
  const date = new Date().toISOString().slice(0, 10);

  logSecurityEvent({
    type: 'data.exported',
    userId: req.user.id,
    orgId: req.user.orgId,
    resource: 'customers',
    recordCount: customers.length,
  });

  res
    .status(200)
    .set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="customers-${date}.csv"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    .send(csv);
});

router.get('/:id', requirePermission('customers:read'), (req, res) => {
  const customer = findCustomerForOrg(req.user.orgId, req.params.id);
  if (!customer) {
    // 404 rather than 403 so we do not reveal that another tenant's record exists.
    return res.status(404).json({ error: 'Not found' });
  }
  return res.json({ customer: toCustomerDetail(customer) });
});

module.exports = router;
