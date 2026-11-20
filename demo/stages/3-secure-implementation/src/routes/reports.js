const express = require('express');
const { requirePermission } = require('../auth/authorize');
const { listAuditEventsForOrg } = require('../data/auditRepository');
const { toAuditReportEntry } = require('../serializers/auditSerializer');

const router = express.Router();

const ALLOWED_PARAMS = new Set(['from', 'to', 'limit']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parseQuery(query) {
  for (const key of Object.keys(query)) {
    if (!ALLOWED_PARAMS.has(key)) return { error: true };
  }
  const { from, to, limit } = query;

  for (const value of [from, to]) {
    if (value !== undefined && (typeof value !== 'string' || !ISO_DATE.test(value) || Number.isNaN(Date.parse(value)))) {
      return { error: true };
    }
  }
  if (from && to && from > to) return { error: true };

  let parsedLimit = DEFAULT_LIMIT;
  if (limit !== undefined) {
    if (typeof limit !== 'string' || !/^\d+$/.test(limit)) return { error: true };
    parsedLimit = Number(limit);
    if (parsedLimit < 1 || parsedLimit > MAX_LIMIT) return { error: true };
  }

  return {
    from: from ? `${from}T00:00:00Z` : undefined,
    to: to ? `${to}T23:59:59Z` : undefined,
    limit: parsedLimit,
  };
}

router.get('/activity', requirePermission('audit:read'), (req, res) => {
  const params = parseQuery(req.query);
  if (params.error) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const events = listAuditEventsForOrg(req.user.orgId, params).map(toAuditReportEntry);
  return res.set('Cache-Control', 'no-store').json({ events });
});

module.exports = router;
