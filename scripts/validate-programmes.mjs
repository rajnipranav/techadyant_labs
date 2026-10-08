#!/usr/bin/env node
// Validates the Programme Intelligence layer (data/programme-intelligence/programmes.json) and every
// programme edge held elsewhere (project programme_links, opportunity programme_ids, signal-link
// related_programmes). Runs in the build chain before `next build`; exits 1 on any error.
// Usage: node scripts/validate-programmes.mjs [--strict]   (--strict also fails on warnings)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');
const json = (p) => JSON.parse(read(p) || 'null');

const file = json('data/programme-intelligence/programmes.json');
if (!file) { console.log('programme-intelligence: no programmes.json — skipped'); process.exit(0); }
const II = 'data/industrial-intelligence/';
const sources = json(II + 'sources.json').sources;
const projects = json(II + 'infrastructure-projects.json').projects;
const opps = json(II + 'opportunity-surfaces.json').surfaces;
const sigLinks = json(II + 'signal-links.json').links;
const logistics = json('app/research/_logistics.json') ?? { programmes: [] };

const sourceIds = new Set(sources.map((s) => s.id));
const sidIds = new Set(logistics.programmes.map((p) => p.id));
const reportSlugs = new Set([...read('app/reports/data.ts').matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1]));
const nicdp = new Set([...read('app/corridors/data.ts').matchAll(/^\s*slug: "([^"]+)", num:/gm)].map((m) => m[1]));
if (!nicdp.size) warn('could not read corridor slugs from app/corridors/data.ts');

const STAGES = new Set(['announced', 'approved', 'under_implementation', 'completed', 'operational']);
const CATEGORIES = new Set(['integration_layer', 'road_corridors', 'port_led_development', 'rail_freight', 'industrial_corridors', 'digital_logistics', 'policy', 'aviation']);
const EVIDENCE = new Set(['fact', 'derived', 'analysis']);
const DIMS = new Set(['manufacturing', 'logistics', 'trade', 'regional', 'supply_chains', 'technology']);
const SUPPLY = ['input', 'manufacturing_node', 'freight_network', 'logistics_node', 'gateway', 'market'];
const RELS = new Set(['coordinates', 'coordinated_by', 'complements', 'shares_corridor', 'feeds']);
const LINKS = new Set(['built_under', 'funded_under', 'planned_on', 'operated_under']);
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const usedSources = new Set();
function prov(refs, where, { required = false } = {}) {
  if (!Array.isArray(refs) || !refs.length) { if (required) err(`${where}: provenance required`); return; }
  refs.forEach((r) => { if (!sourceIds.has(r.source_id)) err(`${where}: unknown source "${r.source_id}"`); else usedSources.add(r.source_id); });
}
function date(d, where, nullable = false) {
  if (d === null && nullable) return;
  if (typeof d !== 'string' || !DATE.test(d)) err(`${where}: invalid date "${d}"`);
}
/** A fact needs a source; analysis may cite context; "will" is not allowed in analysis. */
function claim(c, where) {
  if (!EVIDENCE.has(c.evidence)) err(`${where}: invalid evidence "${c.evidence}"`);
  if (c.evidence !== 'analysis') prov(c.provenance, where, { required: true }); else prov(c.provenance, where);
  if (c.evidence === 'analysis' && /\bwill\b/i.test(c.text ?? c.detail ?? '')) warn(`${where}: analysis uses "will" — prefer "may/could"`);
}

const slugs = new Set();
const ids = new Set();
for (const p of file.programmes) {
  const w = p.id ?? p.slug;
  if (!/^prog:[a-z0-9-]+$/.test(p.id ?? '')) err(`${w}: id must be prog:<slug>`);
  if (p.id !== `prog:${p.slug}`) err(`${w}: id must equal prog:<slug>`);
  if (slugs.has(p.slug)) err(`${w}: duplicate slug`); slugs.add(p.slug);
  if (ids.has(p.logistics_id)) err(`${w}: duplicate logistics_id`); ids.add(p.logistics_id);
  if (!sidIds.has(p.logistics_id)) err(`${w}: logistics_id "${p.logistics_id}" not in the SID logistics export`);
  ['name', 'short_name', 'angle', 'question', 'stage_note', 'lead_ministry', 'geography', 'last_verified', 'data_as_of'].forEach((k) => { if (!p[k]) err(`${w}: ${k} required`); });
  if (!['cross_cutting', 'programme'].includes(p.role)) err(`${w}: invalid role`);
  if (!CATEGORIES.has(p.category)) err(`${w}: invalid category`);
  if (!STAGES.has(p.stage)) err(`${w}: invalid stage`);
  date(p.launch?.date, `${w}.launch`); prov(p.launch?.provenance, `${w}.launch`, { required: true });
  prov(p.time_horizon?.provenance, `${w}.time_horizon`, { required: true });
  date(p.last_verified, `${w}.last_verified`); date(p.data_as_of, `${w}.data_as_of`);
  if (!p.glance?.length) err(`${w}: glance facts required`);
  p.glance.forEach((g, i) => { date(g.as_of, `${w}.glance[${i}]`, true); prov(g.provenance, `${w}.glance[${i}] "${g.label}"`, { required: true }); });
  if (!p.ledger?.length) err(`${w}: status ledger required (announced vs built)`);
  p.ledger.forEach((l, i) => { if (!STAGES.has(l.stage)) err(`${w}.ledger[${i}]: invalid stage`); date(l.as_of, `${w}.ledger[${i}]`, true); prov(l.provenance, `${w}.ledger[${i}]`, { required: true }); });
  if (!p.why_it_matters?.length) err(`${w}: why_it_matters required`);
  p.why_it_matters.forEach((c, i) => claim(c, `${w}.why_it_matters[${i}]`));
  if (!p.why_it_matters.some((c) => c.evidence === 'analysis')) err(`${w}: why_it_matters must carry a labelled Techadyant analysis`);
  p.components.forEach((c, i) => { if (c.stage !== null && !STAGES.has(c.stage)) err(`${w}.components[${i}]: invalid stage`); prov(c.provenance, `${w}.components[${i}] ${c.key}`, { required: true }); });
  p.timeline.forEach((t, i) => { date(t.date, `${w}.timeline[${i}]`); prov(t.provenance, `${w}.timeline[${i}]`, { required: true }); });
  const sorted = [...p.timeline].map((t) => t.date).join('|') === [...p.timeline].map((t) => t.date).sort().join('|');
  if (!sorted) warn(`${w}: timeline not in date order`);
  p.gaps.forEach((g, i) => claim(g, `${w}.gaps[${i}]`));
  if (!p.consequences?.length) err(`${w}: industrial consequences required`);
  p.consequences.forEach((c, i) => {
    if (!DIMS.has(c.dimension)) err(`${w}.consequences[${i}]: invalid dimension`);
    c.claims.forEach((x, j) => claim(x, `${w}.consequences[${i}].claims[${j}]`));
  });
  const stages = p.supply_chain.map((s) => s.stage);
  if (stages.join() !== SUPPLY.join()) err(`${w}: supply_chain must run ${SUPPLY.join(' → ')}`);
  p.supply_chain.forEach((s, i) => claim(s, `${w}.supply_chain[${i}]`));
  p.related_programmes.forEach((r, i) => {
    if (!sidIds.has(r.logistics_id)) err(`${w}.related_programmes[${i}]: unknown SID programme "${r.logistics_id}"`);
    if (!RELS.has(r.relation)) err(`${w}.related_programmes[${i}]: invalid relation`);
    claim({ ...r, text: r.note }, `${w}.related_programmes[${i}]`);
  });
  p.corridor_refs.forEach((c, i) => { if (!nicdp.has(c.corridor)) err(`${w}.corridor_refs[${i}]: unknown corridor "${c.corridor}"`); prov(c.provenance, `${w}.corridor_refs[${i}]`, { required: true }); });
  for (const k of ['signal_match', 'report_match']) {
    const m = p[k];
    if (!m) { err(`${w}: ${k} required`); continue; }
    m.patterns.forEach((x) => { try { new RegExp(x, 'i'); } catch { err(`${w}.${k}: bad pattern ${x}`); } });
  }
  if (p.signal_match.include?.length) err(`${w}.signal_match.include: curate signals in signal-links.json (related_programmes), not here`);
  p.report_match.include.forEach((r) => { if (!reportSlugs.has(r.slug)) err(`${w}.report_match: unknown report ${r.slug}`); if (!r.reason) err(`${w}.report_match: include needs a reason`); });
  if (!p.data_gaps?.length) warn(`${w}: no data gaps declared — every programme has some`);
}

/* ---------------------------------------------------------------- roadmap */
for (const r of file.roadmap ?? []) {
  if (r.logistics_id && !sidIds.has(r.logistics_id)) err(`roadmap ${r.slug}: unknown SID programme "${r.logistics_id}"`);
  if (slugs.has(r.slug)) err(`roadmap ${r.slug}: already has an intel page — remove from roadmap`);
}

/* ---------------------------------------------------------------- edges held elsewhere */
for (const p of projects) {
  (p.programme_links ?? []).forEach((l, i) => {
    const w = `${p.id}.programme_links[${i}]`;
    if (!sidIds.has(l.programme_id)) err(`${w}: unknown SID programme "${l.programme_id}"`);
    if (!LINKS.has(l.type)) err(`${w}: invalid type "${l.type}"`);
    prov(l.provenance, w, { required: true });
  });
}
for (const o of opps) (o.programme_ids ?? []).forEach((id) => { if (!sidIds.has(id)) err(`${o.id}: unknown programme "${id}"`); });
for (const l of sigLinks) (l.related_programmes ?? []).forEach((id) => { if (!sidIds.has(id)) err(`signal-links ${l.signal_slug}: unknown programme "${id}"`); });

/* ---------------------------------------------------------------- reach */
for (const p of file.programmes) {
  const linked = projects.filter((x) => (x.programme_links ?? []).some((l) => l.programme_id === p.logistics_id));
  if (!linked.length) warn(`${p.id}: no project carries a programme link — the page will show no projects or industrial nodes`);
}

const summary = `programme-intelligence: ${file.programmes.length} programmes · ${(file.roadmap ?? []).length} on roadmap · ${projects.filter((x) => x.programme_links?.length).length} linked projects · ${usedSources.size} sources cited`;
console.log(summary);
warnings.forEach((m) => console.log(`  WARN  ${m}`));
errors.forEach((m) => console.log(`  ERROR ${m}`));
if (errors.length || (STRICT && warnings.length)) { console.log(`✗ ${errors.length} error(s), ${warnings.length} warning(s)`); process.exit(1); }
console.log(`✓ 0 errors, ${warnings.length} warning(s)`);
