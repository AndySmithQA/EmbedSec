const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { TOKENS, as, anonymous } = require('./helpers');
const { getSecurityEvents, clearSecurityEvents } = require('../src/security/securityLog');

const EXPORT_URL = '/api/customers/export.csv';

function parseIds(csv) {
  return csv
    .trim()
    .split('\r\n')
    .slice(1)
    .map((line) => line.split(',')[0]);
}

describe('GET /api/customers/export.csv', () => {
  beforeEach(() => clearSecurityEvents());

  // SAC-1 (ASVS 8.2.1): only roles with customers:export may export.
  it('rejects unauthenticated requests', async () => {
    const res = await anonymous().get(EXPORT_URL);
    assert.equal(res.status, 401);
  });

  it('allows an admin to export', async () => {
    const res = await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /^text\/csv; charset=utf-8/);
    assert.match(res.headers['content-disposition'], /^attachment; filename="customers-\d{4}-\d{2}-\d{2}\.csv"$/);
    assert.equal(res.headers['cache-control'], 'no-store');
  });

  for (const [role, token] of [['support', TOKENS.acmeSupport], ['viewer', TOKENS.acmeViewer]]) {
    it(`rejects a ${role} user with 403 and logs the denial`, async () => {
      const res = await as(token).get(EXPORT_URL);
      assert.equal(res.status, 403);
      const denied = getSecurityEvents().filter((e) => e.type === 'authz.denied');
      assert.equal(denied.length, 1);
      assert.equal(denied[0].permission, 'customers:export');
    });
  }

  // SAC-2 (ASVS 8.2.2, 8.4.1): only the caller's organisation's active records.
  it('exports only active customers from the caller\'s organisation', async () => {
    const res = await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    assert.deepEqual(parseIds(res.text).sort(), ['c-1001', 'c-1002', 'c-1003']);
  });

  it('exports the other organisation\'s records only to that organisation', async () => {
    const res = await as(TOKENS.globexAdmin).get(EXPORT_URL);
    assert.deepEqual(parseIds(res.text).sort(), ['c-2001', 'c-2002']);
    assert.doesNotMatch(res.text, /example\.com/);
  });

  // SAC-3 (ASVS 15.3.1, 8.2.3): explicit field allow-list.
  it('includes exactly the approved columns', async () => {
    const res = await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    const header = res.text.split('\r\n')[0];
    assert.equal(header, 'id,name,email,company,plan,createdAt');
  });

  it('never includes restricted field values', async () => {
    const res = await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    for (const secret of ['tok_live_', 'Escalated twice', 'Considering churn', '+44 20']) {
      assert.equal(res.text.includes(secret), false, `export leaked "${secret}"`);
    }
  });

  // SAC-4 (ASVS 1.2.10): formula injection is neutralised.
  it('neutralises cells that a spreadsheet would treat as formulas', async () => {
    const res = await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    const row = res.text.split('\r\n').find((line) => line.startsWith('c-1003'));
    assert.ok(row.includes('"\'=HYPERLINK('), `name not neutralised: ${row}`);
    assert.ok(row.includes('"\'+cmd|'), `company not neutralised: ${row}`);
  });

  // ASVS 16.3.2 (L3 extension): sensitive data access is logged without the data.
  it('logs the export with a record count and no customer data', async () => {
    await as(TOKENS.acmeAdmin).get(EXPORT_URL);
    const exported = getSecurityEvents().filter((e) => e.type === 'data.exported');
    assert.equal(exported.length, 1);
    assert.equal(exported[0].recordCount, 3);
    assert.doesNotMatch(JSON.stringify(exported[0]), /@example\.com/);
  });
});
