#!/usr/bin/env node
// Build gate for the PM GatiShakti Cargo Terminals layer.
// Fails on: malformed ids/slugs, duplicate records, unknown enums, invalid or
// disordered dates, provenance that does not resolve to the shared source registry,
// unknown associated nodes, and coverage counts that disagree with the records.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

let errors = 0, warnings = 0;
const err = (m) => { console.log(`  ERR   ${m}`); errors++; };
const warn = (m) => { console.log(`  WARN  ${m}`); warnings++; };

const db = read('data/programme-intelligence/cargo-terminals.json');
const sourceIds = new Set(read('data/industrial-intelligence/sources.json').sources.map((s) => s.id));
const nodeIds = new Set(read('data/industrial-intelligence/industrial-nodes.json').nodes.map((n) => n.id));
const programmeIds = new Set(read('data/programme-intelligence/programmes.json').programmes.map((p) => p.logistics_id));

const STATUS = new Set(['commissioned', 'sanctioned', 'under_construction', 'proposed', 'development_stage']);
const OPERATOR = new Set(['railway_operated', 'dfccil_operated', 'private_operated', 'private_siding_company_operated', 'tendered_unawarded']);
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const FRESH_DAYS = 120;

const terminals = db.terminals ?? [];
const cov = db.coverage ?? {};

if (!programmeIds.has(cov.programme_id)) err(`coverage.programme_id "${cov.programme_id}" is not a known programme logistics_id`);

const seenId = new Set(), seenSlug = new Set();
for (const t of terminals) {
  const w = t.id ?? '(no id)';
  if (!/^gct:[a-z0-9-]+$/.test(t.id ?? '')) err(`${w}: id must match gct:<kebab>`);
  if (seenId.has(t.id)) err(`${w}: duplicate id`); seenId.add(t.id);
  if (!/^[a-z0-9-]+$/.test(t.slug ?? '')) err(`${w}: slug must be kebab-case`);
  if (seenSlug.has(t.slug)) err(`${w}: duplicate slug "${t.slug}"`); seenSlug.add(t.slug);
  if (!t.canonical_name) err(`${w}: canonical_name required`);
  if (!STATUS.has(t.status)) err(`${w}: invalid status "${t.status}"`);
  if (!OPERATOR.has(t.operator_type)) err(`${w}: invalid operator_type "${t.operator_type}"`);

  for (const f of ['approval_date', 'construction_start_date', 'commissioning_date', 'last_verified']) {
    if (t[f] != null && !DATE.test(t[f])) err(`${w}.${f}: "${t[f]}" is not an ISO date`);
  }
  // A commissioned terminal needs either a date or a note saying what evidences the status
  // (several appear only on a published operator roster with no commissioning date).
  if (t.status === 'commissioned' && !t.commissioning_date && !t.status_note) {
    err(`${w}: commissioned with neither a commissioning_date nor a status_note evidencing it`);
  }
  if (t.status === 'sanctioned' && t.commissioning_date) err(`${w}: sanctioned but carries a commissioning_date`);
  if (t.construction_start_date && t.commissioning_date && t.construction_start_date > t.commissioning_date) {
    err(`${w}: construction_start_date is after commissioning_date`);
  }
  if (t.approval_date && t.construction_start_date && t.approval_date > t.construction_start_date) {
    err(`${w}: approval_date is after construction_start_date`);
  }

  if (!Array.isArray(t.provenance) || t.provenance.length === 0) err(`${w}: provenance required`);
  for (const r of t.provenance ?? []) {
    if (!sourceIds.has(r.source_id)) err(`${w}: unknown source "${r.source_id}"`);
  }
  for (const n of t.associated_node_ids ?? []) {
    if (!nodeIds.has(n)) err(`${w}: unknown industrial node "${n}"`);
  }
  // Capacity is optional, but a value without a unit is meaningless.
  if (t.capacity && t.capacity.value != null && !t.capacity.unit) err(`${w}: capacity.value set without a unit`);
  if (t.capacity && t.capacity.value == null && !t.capacity.note) {
    warn(`${w}: capacity not recorded and no note explaining why`);
  }
  if (!t.last_verified) warn(`${w}: no last_verified date`);
  else {
    const age = (Date.now() - Date.parse(t.last_verified)) / 86400000;
    if (age > FRESH_DAYS) warn(`${w}: last_verified is ${Math.round(age)} days old`);
  }
}

// Coverage must describe the records, not assert over them.
const commissioned = terminals.filter((t) => t.status === 'commissioned');
const sanctioned = terminals.filter((t) => t.status === 'sanctioned');
const fullDate = commissioned.filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t.commissioning_date ?? ''));
const check = (label, actual, declared) => {
  if (declared !== actual) err(`coverage.${label}: declared ${declared} but records give ${actual}`);
};
check('total_records', terminals.length, cov.total_records);
check('tier_a_commissioned_count', commissioned.length, cov.tier_a_commissioned_count);
check('tier_b_sanctioned_count', sanctioned.length, cov.tier_b_sanctioned_count);
check('tier_a_commissioned_with_full_date', fullDate.length, cov.tier_a_commissioned_with_full_date);
check('tier_a_commissioned_with_partial_date', commissioned.length - fullDate.length, cov.tier_a_commissioned_with_partial_date);

for (const k of ['network_aggregate_2026_07', 'network_aggregate_2026_09']) {
  const a = cov[k];
  if (!a) { err(`coverage.${k}: missing`); continue; }
  if (!sourceIds.has(a.source_id)) err(`coverage.${k}: unknown source "${a.source_id}"`);
  if (!DATE.test(a.as_of ?? '')) err(`coverage.${k}.as_of: "${a.as_of}" is not an ISO date`);
  // The network aggregate is a separate measurement; it must exceed the sample, never equal it.
  if (a.commissioned_count != null && a.commissioned_count <= commissioned.length) {
    err(`coverage.${k}: network count ${a.commissioned_count} is not greater than the ${commissioned.length} verified records — the two are different measurements and must not be reconciled`);
  }
}

console.log(`cargo-terminals: ${terminals.length} records · ${commissioned.length} commissioned · ${sanctioned.length} sanctioned · ${new Set(terminals.flatMap((t) => (t.provenance ?? []).map((p) => p.source_id))).size} sources cited`);
console.log(errors ? `✗ ${errors} error(s), ${warnings} warning(s)` : `✓ 0 errors, ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
