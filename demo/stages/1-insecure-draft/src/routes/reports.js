const express = require('express');
const { getAllAuditEvents } = require('../data/auditRepository');

const router = express.Router();

// GET /api/reports/activity?orgId=...&from=...&to=...
router.get('/activity', (req, res) => {
  const { orgId, from, to } = req.query;
  let events = getAllAuditEvents();

  if (orgId) {
    events = events.filter((e) => e.orgId === orgId);
  }
  if (from) {
    events = events.filter((e) => e.timestamp >= from);
  }
  if (to) {
    events = events.filter((e) => e.timestamp <= to);
  }

  res.json({ events });
});

module.exports = router;
