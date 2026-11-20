#!/usr/bin/env node
// Moves the demo repository to a given stage.
//
//   node apply-stage.js 0   reset to the starting point
//   node apply-stage.js 1   Copilot's insecure first draft
//   node apply-stage.js 2   + .github/copilot-instructions.md
//   node apply-stage.js 3   + secure implementation and tests
//
// Stages are cumulative. Run from the demo folder or the demo/repo folder.

const fs = require('node:fs');
const path = require('node:path');

const DEMO_DIR = __dirname;
const REPO_DIR = path.join(DEMO_DIR, 'repo');
const STAGES_DIR = path.join(DEMO_DIR, 'stages');
const BASELINE = '0-baseline';

function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full)];
  });
}

function stageDirs() {
  return fs
    .readdirSync(STAGES_DIR)
    .filter((name) => /^[1-3]-/.test(name))
    .sort();
}

function reset() {
  const baselineDir = path.join(STAGES_DIR, BASELINE);
  const baselineFiles = new Set(listFiles(baselineDir));
  for (const stage of stageDirs()) {
    for (const rel of listFiles(path.join(STAGES_DIR, stage))) {
      const target = path.join(REPO_DIR, rel);
      if (baselineFiles.has(rel)) {
        fs.copyFileSync(path.join(baselineDir, rel), target);
      } else if (fs.existsSync(target)) {
        fs.rmSync(target);
      }
    }
  }
}

function apply(stage) {
  const source = path.join(STAGES_DIR, stage);
  for (const rel of listFiles(source)) {
    const target = path.join(REPO_DIR, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(source, rel), target);
    console.log(`  ${stage}: ${rel}`);
  }
}

const requested = Number(process.argv[2]);
if (!Number.isInteger(requested) || requested < 0 || requested > 3) {
  console.error('Usage: node apply-stage.js <0|1|2|3>');
  process.exit(1);
}

reset();
console.log('Reset demo repository to baseline.');
for (const stage of stageDirs().filter((name) => Number(name[0]) <= requested)) {
  apply(stage);
}
console.log(`Demo repository is at stage ${requested}.`);
