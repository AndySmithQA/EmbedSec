const express = require('express');
const { requirePermission } = require('../auth/authorize');
const { listCustomersForOrg, findCustomerForOrg } = require('../data/customerRepository');
const { toCustomerSummary, toCustomerDetail } = require('../serializers/customerSerializer');

const router = express.Router();

router.get('/', requirePermission('customers:read'), (req, res) => {
  const customers = listCustomersForOrg(req.user.orgId).map(toCustomerSummary);
  res.json({ customers });
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
