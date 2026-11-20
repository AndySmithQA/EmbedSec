const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { TOKENS, as, anonymous } = require('./helpers');
const { getSecurityEvents, clearSecurityEvents } = require('../src/security/securityLog');

const URL = '/api/reports/activity';

describe('GET /api/reports/activity', () => {
  beforeEach(() => clearSecurityEvents());

  // SAC-1 (ASVS 8.2.1): only roles with audit:read.
  it('rejects unauthenticated requests', async () => {
    const res = await anonymous().get(URL);
    assert.equal(res.status, 401);
  });

  it('allows an admin', async () => {
    const res = await as(TOKENS.acmeAdmin).get(URL);
    assert.equal(res.status, 200);
    assert.equal(res.headers['cache-control'], 'no-store');
  });

  for (const [role, token] of [['support', TOKENS.acmeSupport], ['viewer', TOKENS.acmeViewer]]) {
    it(`rejects a ${role} user and logs the denial`, async () => {
      const res = await as(token).get(URL);
      assert.equal(res.status, 403);
      assert.equal(getSecurityEvents().filter((e) => e.type === 'authz.denied').length, 1);
    });
  }

  // SAC-2 (ASVS 8.2.2, 8.4.1): only the caller's organisation, and orgId cannot be supplied.
  it('returns only the caller\'s organisation\'s events', async () => {
    const res = await as(TOKENS.acmeAdmin).get(URL);
    assert.deepEqual(res.body.events.map((e) => e.id).sort(), ['ev-1', 'ev-2', 'ev-3']);
  });

  it('rejects an attempt to choose another organisation', async () => {
    const res = await as(TOKENS.acmeAdmin).get(`${URL}?orgId=org-globex`);
    assert.equal(res.status, 400);
  });

  // SAC-3 (ASVS 15.3.1): explicit field list; network and session data excluded.
  it('returns only approved fields', async () => {
    const res = await as(TOKENS.acmeAdmin).get(URL);
    for (const event of res.body.events) {
      assert.deepEqual(Object.keys(event).sort(), ['action', 'actorId', 'id', 'targetId', 'timestamp']);
    }
    assert.doesNotMatch(JSON.stringify(res.body), /203\.0\.113|sess_|Mozilla/);
  });

  // SAC-4 (ASVS 2.2.1): validated, bounded input.
  it('filters by an inclusive date range', async () => {
    const res = await as(TOKENS.acmeAdmin).get(`${URL}?from=2025-09-02&to=2025-09-10`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.events.map((e) => e.id), ['ev-3', 'ev-2']);
  });

  for (const query of [
    'from=yesterday',
    'from=2025-09-10&to=2025-09-01',
    'limit=0',
    'limit=201',
    'limit=10abc',
    'from[]=2025-09-01',
  ]) {
    it(`rejects invalid input: ${query}`, async () => {
      const res = await as(TOKENS.acmeAdmin).get(`${URL}?${query}`);
      assert.equal(res.status, 400);
      assert.deepEqual(res.body, { error: 'Invalid query parameters' });
    });
  }
});
