const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkEvidence } = require('../scripts/check-pr-evidence');

const completeBody = `
## Ticket
TICKET-101

## Security acceptance criteria
| ID | Criterion | ASVS ref | Evidence | Status |
|---|---|---|---|---|
| SAC-1 | Only admins can export | 8.2.1 | test/export.test.js "rejects support" | Met |
| SAC-2 | Export excludes internal fields | 15.3.1 | test/export.test.js "excludes fields" | Needs human decision |

## Decisions for the human reviewer
- [ ] Confirm phone number belongs in the export.
`;

describe('checkEvidence', () => {
  it('passes a complete description and warns on human decisions', () => {
    const result = checkEvidence(completeBody);
    assert.equal(result.ok, true, result.errors.join('\n'));
    assert.equal(result.warnings.length, 1);
  });

  it('fails an empty description', () => {
    assert.equal(checkEvidence('').ok, false);
  });

  it('fails when the section is missing', () => {
    const result = checkEvidence('## Summary\nAdds export.');
    assert.equal(result.ok, false);
    assert.match(result.errors[0], /Missing/);
  });

  it('fails when evidence is TODO or status is Not met', () => {
    const body = completeBody
      .replace('test/export.test.js "rejects support"', 'TODO')
      .replace('| Needs human decision |', '| Not met |');
    const result = checkEvidence(body);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => /evidence is missing/.test(e)));
    assert.ok(result.errors.some((e) => /Not met/.test(e)));
  });

  it('accepts a justified N/A instead of an ASVS reference', () => {
    const body = completeBody.replace('| 15.3.1 |', '| N/A - business rule agreed with product |');
    assert.equal(checkEvidence(body).ok, true);
  });

  it('fails when no human review item is listed', () => {
    const body = completeBody.replace('- [ ] Confirm phone number belongs in the export.', '');
    assert.equal(checkEvidence(body).ok, false);
  });
});
