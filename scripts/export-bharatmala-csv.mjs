#!/usr/bin/env node
// Exports downloadable CSV extracts for programmes with a state_coverage matrix.
// Output: public/data/programmes/<slug>-state-coverage.csv
// Run:    node scripts/export-bharatmala-csv.mjs   (also safe to run for all programmes)
// These CSVs are committed static extracts (static-first / Cloudflare Pages compatible);
// regenerate after editing the source matrix in data/programme-intelligence/programmes.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = JSON.parse(readFileSync(join(ROOT, 'data/programme-intelligence/programmes.json'), 'utf8'));
const outDir = join(ROOT, 'public/data/programmes');
mkdirSync(outDir, { recursive: true });

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

let written = 0;
for (const p of file.programmes) {
  if (!p.state_coverage) continue;
  const slug = p.slug;
  const rows = [
    ['state', 'total_km', 'awarded_km', 'constructed_km', 'under_construction_km'],
    ...p.state_coverage.rows.map((r) => [r.state, r.total_km, r.awarded_km, r.constructed_km, r.under_construction_km]),
  ];
  const header = [
    `# ${p.name} — state-wise coverage matrix`,
    `# reporting_date,${p.state_coverage.as_of}`,
    `# source,${p.state_coverage.provenance.map((x) => x.source_id).join('; ')}`,
    `# note,${p.state_coverage.note}`,
    `# generated_by,scripts/export-bharatmala-csv.mjs`,
  ].join('\n');
  const csv = header + '\n' + rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
  const out = join(outDir, `${slug}-state-coverage.csv`);
  writeFileSync(out, csv);
  console.log(`wrote ${out} (${p.state_coverage.rows.length} rows)`);
  written++;
}
if (!written) console.log('no programmes carry a state_coverage matrix');
