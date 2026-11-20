const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { TOKENS, as } = require('./helpers');

describe('GET /api/reports/activity', () => {
  it('returns activity', async () => {
    const res = await as(TOKENS.acmeAdmin).get('/api/reports/activity?orgId=org-acme');
    assert.equal(res.status, 200);
    assert.ok(res.body.events.length > 0);
  });
});
