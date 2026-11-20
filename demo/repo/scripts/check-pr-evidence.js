#!/usr/bin/env node
// PR security evidence gate.
//
// Reads the pull request description and fails unless the "Security acceptance criteria"
// table is complete: every criterion has an ASVS reference (or a justified N/A), evidence,
// and a status of "Met" or "Needs human decision". "Not met" always fails.
//
// Usage:
//   PR_BODY="$(cat body.md)" node scripts/check-pr-evidence.js
//   node scripts/check-pr-evidence.js path/to/body.md

const fs = require('node:fs');

const SECTION_HEADING = /^##\s+Security acceptance criteria\s*$/im;
const HUMAN_REVIEW_HEADING = /^##\s+Decisions for the human reviewer\s*$/im;
const ASVS_REF = /\b(v5\.0\.0-)?\d{1,2}\.\d{1,2}\.\d{1,2}\b/i;
const NA_WITH_REASON = /^n\/a\s*[-–:]\s*\S+/i;
const PLACEHOLDER = /^(|todo|tbd|-|\.\.\.|<.*>)$/i;
const PASSING_STATUSES = ['met', 'needs human decision'];

function extractSection(body, headingRegex) {
  const match = headingRegex.exec(body);
  if (!match) return null;
  const rest = body.slice(match.index + match[0].length);
  const next = rest.search(/^##\s+/m);
  return next === -1 ? rest : rest.slice(0, next);
}

function parseTableRows(section) {
  const lines = section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  if (lines.length < 2) return [];
  // Skip header row and the |---| separator row.
  return lines.slice(2).map((line) =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim()),
  );
}

function checkEvidence(body) {
  const errors = [];
  const warnings = [];

  if (!body || !body.trim()) {
    return { ok: false, errors: ['The pull request description is empty.'], warnings };
  }

  const section = extractSection(body, SECTION_HEADING);
  if (section === null) {
    errors.push('Missing "## Security acceptance criteria" section. Use the pull request template.');
    return { ok: false, errors, warnings };
  }

  const rows = parseTableRows(section).filter((cells) => cells.some((c) => c !== ''));
  if (rows.length === 0) {
    errors.push('The security acceptance criteria table has no rows.');
  }

  for (const cells of rows) {
    const [id = '', criterion = '', asvs = '', evidence = '', status = ''] = cells;
    const label = id || '(row without ID)';

    if (PLACEHOLDER.test(criterion)) {
      errors.push(`${label}: criterion is empty.`);
    }
    if (!ASVS_REF.test(asvs) && !NA_WITH_REASON.test(asvs)) {
      errors.push(`${label}: give an ASVS requirement ID (for example 8.2.2) or "N/A - reason".`);
    }
    if (PLACEHOLDER.test(evidence)) {
      errors.push(`${label}: evidence is missing. Link a test, file or check run.`);
    }
    const normalisedStatus = status.toLowerCase();
    if (!PASSING_STATUSES.includes(normalisedStatus)) {
      errors.push(`${label}: status is "${status || 'empty'}". Use "Met" or "Needs human decision".`);
    } else if (normalisedStatus === 'needs human decision') {
      warnings.push(`${label}: needs a human decision before merge.`);
    }
  }

  const humanReview = extractSection(body, HUMAN_REVIEW_HEADING);
  if (humanReview === null || !/^\s*-\s*\[[ xX]\]\s*\S+/m.test(humanReview)) {
    errors.push('Add at least one item under "## Decisions for the human reviewer".');
  }

  return { ok: errors.length === 0, errors, warnings };
}

function main() {
  const fileArg = process.argv[2];
  const body = fileArg ? fs.readFileSync(fileArg, 'utf8') : process.env.PR_BODY ?? '';
  const { ok, errors, warnings } = checkEvidence(body);

  for (const w of warnings) console.log(`::warning::${w}`);
  for (const e of errors) console.log(`::error::${e}`);

  if (ok) {
    console.log('Security evidence gate passed.');
  } else {
    console.log(`Security evidence gate failed with ${errors.length} problem(s).`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkEvidence };
