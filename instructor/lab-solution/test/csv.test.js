const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { toCsv, escapeCell } = require('../src/serializers/csv');

describe('csv serialiser', () => {
  it('quotes cells containing commas, quotes and newlines (RFC 4180)', () => {
    assert.equal(escapeCell('a,b'), '"a,b"');
    assert.equal(escapeCell('say "hi"'), '"say ""hi"""');
    assert.equal(escapeCell('line1\nline2'), '"line1\nline2"');
  });

  for (const trigger of ['=', '+', '-', '@', '\t', '\r']) {
    it(`neutralises a leading ${JSON.stringify(trigger)}`, () => {
      assert.ok(escapeCell(`${trigger}1+1`).startsWith(`"'${trigger}`));
    });
  }

  it('leaves ordinary values alone', () => {
    assert.equal(escapeCell('Priya Shah'), 'Priya Shah');
    assert.equal(escapeCell(42), '42');
    assert.equal(escapeCell(null), '');
  });

  it('emits only the listed columns, in order', () => {
    const csv = toCsv([{ a: 1, b: 2, secret: 'x' }], ['b', 'a']);
    assert.equal(csv, 'b,a\r\n2,1\r\n');
  });
});
