const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { TOKENS, as, anonymous } = require('./helpers');
const { getSecurityEvents, clearSecurityEvents } = require('../src/security/securityLog');

describe('GET /api/customers', () => {
  beforeEach(() => clearSecurityEvents());

  it('rejects unauthenticated requests', async () => {
    const res = await anonymous().get('/api/customers');
    assert.equal(res.status, 401);
  });

  it('returns only active customers from the caller\'s organisation', async () => {
    const res = await as(TOKENS.acmeViewer).get('/api/customers');
    assert.equal(res.status, 200);
    const ids = res.body.customers.map((c) => c.id).sort();
    assert.deepEqual(ids, ['c-1001', 'c-1002', 'c-1003']);
  });

  it('never returns internal fields', async () => {
    const res = await as(TOKENS.acmeAdmin).get('/api/customers');
    for (const customer of res.body.customers) {
      assert.equal('internalNotes' in customer, false);
      assert.equal('riskScore' in customer, false);
      assert.equal('paymentCardToken' in customer, false);
    }
  });
});

describe('GET /api/customers/:id', () => {
  beforeEach(() => clearSecurityEvents());

  it('returns a customer in the caller\'s organisation', async () => {
    const res = await as(TOKENS.acmeSupport).get('/api/customers/c-1002');
    assert.equal(res.status, 200);
    assert.equal(res.body.customer.email, 'tom.okafor@example.com');
  });

  it('returns 404 for another organisation\'s customer', async () => {
    const res = await as(TOKENS.acmeAdmin).get('/api/customers/c-2001');
    assert.equal(res.status, 404);
  });

  it('returns 404 for a deleted customer', async () => {
    const res = await as(TOKENS.acmeAdmin).get('/api/customers/c-1004');
    assert.equal(res.status, 404);
  });
});

describe('authorisation helper', () => {
  beforeEach(() => clearSecurityEvents());

  it('logs denied requests as security events', async () => {
    const { requirePermission } = require('../src/auth/authorize');
    const guard = requirePermission('users:manage');
    let statusCode;
    const req = { user: { id: 'u-carol', orgId: 'org-acme', role: 'viewer' }, originalUrl: '/x' };
    const res = { status(code) { statusCode = code; return this; }, json() { return this; } };
    guard(req, res, () => assert.fail('should not call next'));
    assert.equal(statusCode, 403);
    const denied = getSecurityEvents().filter((e) => e.type === 'authz.denied');
    assert.equal(denied.length, 1);
    assert.equal(denied[0].permission, 'users:manage');
  });
});
