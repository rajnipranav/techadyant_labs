#!/usr/bin/env node
// Build-time integrity check for data/sagarmala-intelligence/*.json (Sagarmala Intelligence Database).
// Runs in the build chain after validate-programmes.mjs; any ERROR exits non-zero and stops the deploy.
// Plain JS (no TS, no deps) so it runs on any Node >= 18 in Cloudflare's builder.
//
//   node scripts/validate-sagarmala.mjs            # errors + warnings
//   node scripts/validate-sagarmala.mjs --strict   # warnings also fail
//
// Checks: file shape, id registry and uniqueness, provenance -> shared sources.json, evidence enums,
// ISO dates, pillar/status/classification vocabularies, cross-file referential integrity
// (projects -> ports, opportunities -> companies/policies/projects, cezs -> ports),
// timeline ordering, metric-series period hygiene, and the coverage manifest against actual counts.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'data/sagarmala-intelligence');
const STRICT = process.argv.includes('--strict');
const STALE_DAYS = 120;
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf8'));

const dossier = load('dossier.json');
const pillarProjects = load('pillar-projects.json');
const ports = load('ports.json');
const performance = load('port-performance.json');
const connectivity = load('connectivity.json');
const industrialisation = load('industrialisation.json');
const community = load('community.json');
const companies = load('companies.json');
const policies = load('policies.json');
const opportunities = load('opportunities.json');
const coverage = load('coverage.json');
const sources = JSON.parse(readFileSync(join(ROOT, 'data/industrial-intelligence/sources.json'), 'utf8')).sources;

/* ---------------------------------------------------------------- vocabularies */
const PILLARS = new Set(['port_modernisation', 'port_connectivity', 'port_led_industrialisation', 'coastal_community', 'coastal_shipping_iwt']);
const EVIDENCE = new Set(['fact', 'derived', 'analysis']);
const PROJ_STATUS = new Set(['approved', 'under_construction', 'trial', 'partially_operational', 'operational', 'completed', 'announced', 'proposed', 'unknown']);
const PORT_STATUS = new Set(['operational', 'partially_operational', 'under_construction', 'approved', 'planned', 'unknown']);
const PORT_TYPES = new Set(['major', 'major_dock_system', 'major_under_construction', 'non_major']);
const CLASSIFICATIONS = new Set(['documented_demand', 'emerging', 'hypothesis', 'research_lead']);
const CONF = new Set(['high', 'medium', 'low']);
const COMPANY_CATEGORIES = new Set(['port_operator', 'terminal_operator', 'shipping', 'coastal_shipping', 'shipbuilder', 'dredging', 'marine_epc', 'equipment_supplier', 'iwai_operator']);
const FY = /^FY\d{4}-\d{2}$/;
const ISO = /^\d{4}-\d{2}(-\d{2})?$/;
const today = new Date();
const daysOld = (d) => (today - new Date(`${d.length === 7 ? `${d}-01` : d}T00:00:00Z`)) / 864e5;

/* ---------------------------------------------------------------- registries */
const sourceIds = new Set(sources.map((s) => s.id));
const usedSources = new Set();
const ids = new Map();
const register = (id, where, prefix) => {
  if (!id || typeof id !== 'string') return err(`${where}: missing id`);
  if (prefix && !id.startsWith(prefix)) err(`${where}: id "${id}" must start with "${prefix}"`);
  if (ids.has(id)) err(`Duplicate id "${id}" (${ids.get(id)} and ${where})`);
  ids.set(id, where);
};

const checkProv = (refs, where, { required = false } = {}) => {
  if (!Array.isArray(refs)) { if (required) err(`${where}: provenance missing`); return; }
  if (required && !refs.length) err(`${where}: at least one source required`);
  refs.forEach((r) => {
    if (!r || typeof r !== 'object' || !r.source_id || typeof r.source_id !== 'string') return err(`${where}: malformed provenance ref`);
    if (!sourceIds.has(r.source_id)) err(`${where}: unknown source "${r.source_id}"`);
    else usedSources.add(r.source_id);
  });
};

const checkDate = (d, where, { nullable = false } = {}) => {
  if (d === null && nullable) return;
  if (typeof d !== 'string' || !ISO.test(d)) err(`${where}: invalid date "${d}"`);
};

const checkEvidence = (e, where) => { if (e !== undefined && !EVIDENCE.has(e)) err(`${where}: invalid evidence "${e}"`); };

/** A fact needs a source; analysis may cite context; "will" is discouraged in analysis. */
const claim = (c, where) => {
  if (!c || typeof c !== 'object') return err(`${where}: malformed claim`);
  checkEvidence(c.evidence, where);
  if (c.evidence !== 'analysis') checkProv(c.provenance, where, { required: true });
  else checkProv(c.provenance, where);
  if (c.evidence === 'analysis' && /\bwill\b/i.test(c.text ?? c.detail ?? '')) warn(`${where}: analysis uses "will" — prefer "may/could"`);
};

/* ---------------------------------------------------------------- dossier */
{
  const p = dossier.programme;
  const w = 'dossier.json';
  ['name', 'lead_ministry', 'official_status', 'last_verified', 'data_as_of'].forEach((k) => { if (!p[k]) err(`${w}: ${k} required`); });
  checkDate(p.last_verified, `${w}.last_verified`); checkDate(p.data_as_of, `${w}.data_as_of`);
  claim(p.approval, `${w}.approval`); claim(p.national_perspective_plan, `${w}.npp`);
  p.objectives.forEach((o, i) => claim(o, `${w}.objectives[${i}]`));
  if (p.pillars.length !== 5) err(`${w}: expected 5 pillars, found ${p.pillars.length}`);
  p.pillars.forEach((pl) => {
    if (!PILLARS.has(pl.key)) err(`${w}.pillars: invalid key "${pl.key}"`);
    if (!pl.official_name || !pl.description) err(`${w}.pillars.${pl.key}: name and description required`);
    checkProv(pl.provenance, `${w}.pillars.${pl.key}`, { required: true });
  });
  p.institutions.forEach((i) => { register(i.id, w, 'sginst:'); if (!i.name || !i.role) err(`${i.id}: name and role required`); claim(i, `${i.id}`); });
  p.statistics.forEach((s) => {
    register(s.id, w, 'sgstat:');
    if (typeof s.value !== 'number') err(`${s.id}: value must be numeric`);
    if (!s.unit) err(`${s.id}: unit required`);
    if (!s.scope) err(`${s.id}: scope required`);
    if (!s.verification) err(`${s.id}: verification required`);
    checkDate(s.as_of, `${s.id}.as_of`, { nullable: true });
    checkProv(s.provenance, `${s.id}`, { required: true });
  });
  claim(p.sagarmala_2_0, `${w}.sagarmala_2_0`);
  if (p.sagarmala_2_0.status !== 'proposed') err(`${w}: sagarmala_2_0 must be classified as proposed (no Cabinet approval captured)`);
  p.vision_links.forEach((v) => { register(v.id, w, 'sgvis:'); checkDate(v.launched, `${v.id}.launched`); claim(v, `${v.id}`); });
  const dates = p.timeline.map((t) => t.date);
  dates.forEach((d, i) => checkDate(d, `${w}.timeline[${i}]`));
  if (dates.join('|') !== [...dates].sort().join('|')) err(`${w}: timeline not in date order`);
  p.timeline.forEach((t, i) => checkProv(t.provenance, `${w}.timeline[${i}]`, { required: true }));
  p.parliament_watch.forEach((x, i) => claim(x, `${w}.parliament_watch[${i}]`));
  claim(p.funding.scheme_lifecycle, `${w}.funding.scheme_lifecycle`);
  claim(p.funding.budget_head, `${w}.funding.budget_head`);
}

/* ---------------------------------------------------------------- pillar-projects */
{
  const w = 'pillar-projects.json';
  const pp = pillarProjects;
  pp.pillar_keys.forEach((k) => { if (!PILLARS.has(k)) err(`${w}: invalid pillar_keys entry "${k}"`); });
  const snap = pp.portfolio.snapshots;
  snap.forEach((s, i) => {
    checkDate(s.as_of, `${w}.snapshots[${i}].as_of`, { nullable: true });
    if (typeof s.projects !== 'number') err(`${w}.snapshots[${i}]: projects must be numeric`);
    if (!s.scope) err(`${w}.snapshots[${i}]: scope required`);
    if (!s.verification) err(`${w}.snapshots[${i}]: verification required`);
    checkProv(s.provenance, `${w}.snapshots[${i}]`, { required: true });
  });
  const snapDates = snap.map((s) => s.as_of ?? '0000');
  if (snapDates.join('|') !== [...snapDates].sort().join('|')) err(`${w}: portfolio snapshots not in date order`);
  const split = pp.portfolio.pillar_split_839;
  if (split.rows.reduce((a, r) => a + r.projects, 0) !== 839) err(`${w}: pillar_split_839 projects do not sum to 839`);
  checkProv(split.provenance, `${w}.pillar_split_839`, { required: true });
  const sf = pp.portfolio.scheme_funded;
  if (sf.funded + sf.withdrawn !== sf.sanctioned_total) err(`${w}: scheme_funded funded+withdrawn must equal sanctioned_total`);
  if (sf.completed + sf.under_implementation !== sf.funded) err(`${w}: scheme_funded completed+under_implementation must equal funded`);
  const sfp = pp.portfolio.scheme_funded_pillar_split;
  const sfpKeys = sfp.rows.map((r) => r.pillar_key);
  if (new Set(sfpKeys).size !== sfpKeys.length) err(`${w}: scheme_funded_pillar_split has duplicate pillar rows`);
  sfp.rows.forEach((r) => { if (!PILLARS.has(r.pillar_key)) err(`${w}: scheme_funded_pillar_split invalid pillar "${r.pillar_key}"`); });
  if (sfpKeys.includes('port_led_industrialisation')) err(`${w}: scheme_funded_pillar_split must not carry an industrialisation row (none sanctioned)`);
  const sfpGrand = sfp.grand_total;
  if (sfp.rows.reduce((a, r) => a + r.completed.count, 0) !== sfpGrand.completed.count) err(`${w}: scheme_funded_pillar_split completed counts do not sum to the grand total`);
  if (sfp.rows.reduce((a, r) => a + r.under_implementation.count, 0) !== sfpGrand.under_implementation.count) err(`${w}: scheme_funded_pillar_split UI counts do not sum to the grand total`);
  claim(pp.cpcp, `${w}.cpcp`);
  pp.projects.forEach((pr) => {
    register(pr.id, w, 'sgpr:');
    const where = pr.id;
    if (!pr.name || !pr.scope) err(`${where}: name and scope required`);
    if (!PILLARS.has(pr.pillar_key)) err(`${where}: invalid pillar_key "${pr.pillar_key}"`);
    if (!PROJ_STATUS.has(pr.status)) err(`${where}: invalid status "${pr.status}"`);
    if (pr.cost_cr !== null && typeof pr.cost_cr !== 'number') err(`${where}: cost_cr must be numeric or null`);
    if (pr.cost_cr === null && !pr.cost_note) err(`${where}: cost_note required when cost is unknown`);
    if (!pr.agency) err(`${where}: agency required`);
    (pr.milestones ?? []).forEach((m, i) => { checkDate(m.date, `${where}.milestones[${i}]`); checkProv(m.provenance, `${where}.milestones[${i}]`, { required: true }); });
    (pr.contractors ?? []).forEach((c) => checkProv(c.provenance, `${where}.contractors`, { required: true }));
    checkProv(pr.provenance, where, { required: true });
    checkDate(pr.last_verified, `${where}.last_verified`);
    if (daysOld(pr.last_verified) > STALE_DAYS) warn(`${where}: last_verified older than ${STALE_DAYS} days`);
    if (pr.consequence_evidence) checkEvidence(pr.consequence_evidence, `${where}.consequence_evidence`);
  });
}

/* ---------------------------------------------------------------- ports */
const portIds = new Set();
{
  const w = 'ports.json';
  ports.ports.forEach((p) => {
    register(p.id, w, 'sgport:');
    portIds.add(p.id);
    const where = p.id;
    if (!p.name) err(`${where}: name required`);
    if (!PORT_TYPES.has(p.type)) err(`${where}: invalid type "${p.type}"`);
    if (!PORT_STATUS.has(p.status)) err(`${where}: invalid status "${p.status}"`);
    if (!p.state) err(`${where}: state required`);
    const c = p.coordinates;
    if (c !== null && c !== undefined) {
      if (typeof c.lat !== 'number' || typeof c.lng !== 'number') err(`${where}: coordinates must be numeric`);
      else if (c.lat < 6 || c.lat > 37.5 || c.lng < 68 || c.lng > 97.5) err(`${where}: coordinates (${c.lat}, ${c.lng}) fall outside India's bounding box`);
      if (!['gazetteer', 'approximate', 'verified', 'gis'].includes(c.coord_source)) err(`${where}: coord_source required`);
      if (!CONF.has(c.confidence)) err(`${where}: coordinate confidence required`);
    }
    const t = p.throughput;
    if (t) {
      ['fy2024_25_mt', 'fy2025_26_mt'].forEach((k) => { if (t[k] !== undefined && t[k] !== null && typeof t[k] !== 'number') err(`${where}: throughput.${k} must be numeric`); });
    }
    (p.facts ?? []).forEach((f, i) => claim(f, `${where}.facts[${i}]`));
    (p.sagarmala_project_ids ?? []).forEach((id) => { if (!ids.has(id) && !id.startsWith('sgpr:')) err(`${where}: sagarmala_project_ids references "${id}" before it is registered`); });
    checkProv(p.provenance, where, { required: true });
    checkDate(p.last_verified, `${where}.last_verified`);
  });
  if (ports.ports.filter((p) => p.type === 'major').length !== 12) err(`${w}: expected exactly 12 major ports`);
  claim(ports.non_major_system, `${w}.non_major_system`);
}

/* re-check project -> port references now that ports are registered */
for (const pr of pillarProjects.projects) {
  if (pr.port_id && !portIds.has(pr.port_id)) err(`${pr.id}: unknown port_id "${pr.port_id}"`);
}

/* ---------------------------------------------------------------- performance */
{
  const w = 'port-performance.json';
  const seen = new Set();
  performance.series.forEach((s) => {
    register(s.id, w, 'sgs:');
    const where = s.id;
    if (!s.metric || !s.unit || !s.scope) err(`${where}: metric, unit and scope required`);
    if (!s.points.length) err(`${where}: series needs at least one point`);
    const periods = s.points.map((pt) => pt.period);
    periods.forEach((p) => { if (seen.has(s.id + p)) err(`${where}: duplicate period "${p}"`); seen.add(s.id + p); });
    s.points.forEach((pt, i) => {
      if (typeof pt.value !== 'number') err(`${where}.points[${i}]: value must be numeric`);
      if (!FY.test(pt.period) && !/^\d{4}$/.test(pt.period)) err(`${where}.points[${i}]: period "${pt.period}" must be FYyyyy-yy or a plain year`);
      checkProv(pt.provenance, `${where}.points[${i}]`, { required: true });
      if (pt.evidence) checkEvidence(pt.evidence, `${where}.points[${i}]`);
    });
    if (s.verification) { if (typeof s.verification !== 'string') err(`${where}: verification must be a string`); }
    checkDate(s.last_verified, `${where}.last_verified`);
  });
  performance.benchmarks.forEach((b, i) => claim(b, `${w}.benchmarks[${i}]`));
}

/* ---------------------------------------------------------------- connectivity */
{
  const w = 'connectivity.json';
  claim(connectivity.cpcp_summary, `${w}.cpcp_summary`);
  claim(connectivity.gatishakti_layers, `${w}.gatishakti_layers`);
  connectivity.connections.forEach((c) => {
    register(c.id, w, 'sgx:');
    const where = c.id;
    if (!portIds.has(c.from_port)) err(`${where}: unknown from_port "${c.from_port}"`);
    if (!['road', 'rail', 'inland_waterway', 'coastal_shipping', 'multimodal'].includes(c.mode)) err(`${where}: invalid mode "${c.mode}"`);
    if (!c.name || !c.status) err(`${where}: name and status required`);
    (c.also_serves ?? []).forEach((pid) => { if (!portIds.has(pid)) err(`${where}: unknown also_serves port "${pid}"`); });
    checkProv(c.provenance, where, { required: true });
    checkDate(c.last_verified, `${where}.last_verified`);
  });
  connectivity.atlas_node_links.forEach((x, i) => claim(x, `${w}.atlas_node_links[${i}]`));
}

/* ---------------------------------------------------------------- industrialisation */
{
  const w = 'industrialisation.json';
  claim(industrialisation.pillar_status, `${w}.pillar_status`);
  if (industrialisation.pillar_status.scheme_funded_projects !== 0) err(`${w}: scheme_funded_projects must be 0 (verified absence)`);
  claim(industrialisation.ceu_definition, `${w}.ceu_definition`);
  claim(industrialisation.smart_industrial_port_cities, `${w}.smart_industrial_port_cities`);
  if (industrialisation.cezs.length !== 14) err(`${w}: expected 14 CEZs, found ${industrialisation.cezs.length}`);
  industrialisation.cezs.forEach((z) => {
    register(z.id, w, 'sgcez:');
    const where = z.id;
    if (!z.name || !z.state) err(`${where}: name and state required`);
    (z.linkage_ports ?? []).forEach((pid) => { if (!portIds.has(pid)) err(`${where}: unknown linkage port "${pid}"`); });
    if (z.status !== 'proposed') err(`${where}: CEZ must be classified "proposed" (no notification on file)`);
    checkProv(z.provenance, where, { required: true });
  });
  industrialisation.hinterland_reading.forEach((x, i) => claim(x, `${w}.hinterland_reading[${i}]`));
}

/* ---------------------------------------------------------------- community */
{
  const w = 'community.json';
  claim(community.coastal_context, `${w}.coastal_context`);
  community.initiatives.forEach((i) => {
    register(i.id, w, 'sgcc:');
    const where = i.id;
    if (!i.name || !i.category) err(`${where}: name and category required`);
    if (i.evidence !== 'fact') err(`${where}: initiative wrapper must be evidence "fact"`);
    checkProv(i.provenance, where);
    if (!i.provenance?.length) err(`${where}: at least one source required`);
    (i.components ?? []).forEach((c, j) => claim(c, `${where}.components[${j}]`));
    (i.scheme_funded_examples ?? []).forEach((e) => checkProv(e.provenance, `${where}.scheme_funded_examples`, { required: true }));
    (i.under_implementation_examples ?? []).forEach((e) => checkProv(e.provenance, `${where}.under_implementation_examples`, { required: true }));
    checkDate(i.last_verified, `${where}.last_verified`);
  });
  claim(community.outcome_caveat, `${w}.outcome_caveat`);
}

/* ---------------------------------------------------------------- companies */
const companyIds = new Set();
{
  const w = 'companies.json';
  companies.companies.forEach((c) => {
    register(c.id, w, 'sgco:');
    companyIds.add(c.id);
    const where = c.id;
    if (!c.name) err(`${where}: name required`);
    if (!COMPANY_CATEGORIES.has(c.category)) err(`${where}: invalid category "${c.category}"`);
    if (!c.relationships?.length && !c.fleet) err(`${where}: evidenced relationships or a documented fleet required`);
    (c.relationships ?? []).forEach((r, i) => {
      if (!r.to || !r.type || !r.detail) err(`${where}.relationships[${i}]: to, type and detail required`);
      checkProv(r.provenance, `${where}.relationships[${i}]`, { required: true });
    });
    (c.scale_facts ?? []).forEach((f, i) => claim(f, `${where}.scale_facts[${i}]`));
    checkProv(c.provenance, where);
    checkDate(c.last_verified, `${where}.last_verified`);
  });
  claim(companies.ecosystem_note, `${w}.ecosystem_note`);
}

/* ---------------------------------------------------------------- policies */
const policyIds = new Set();
{
  const w = 'policies.json';
  policies.policies.forEach((p) => {
    register(p.id, w, 'sgpol:');
    policyIds.add(p.id);
    const where = p.id;
    if (!p.name || !p.authority) err(`${where}: name and authority required`);
    checkDate(p.announcement_date, `${where}.announcement_date`);
    checkDate(p.approval_date, `${where}.approval_date`, { nullable: true });
    if (!['proposed', 'announced', 'approved', 'operational'].includes(p.status)) err(`${where}: invalid status "${p.status}"`);
    if (!p.objectives) err(`${where}: objectives required`);
    checkProv(p.provenance, where, { required: true });
    checkDate(p.last_verified, `${where}.last_verified`);
    if (p.status === 'approved' && !p.approval_date) err(`${where}: approved policies need an approval_date`);
  });
  const sag2 = policies.policies.find((p) => p.id === 'sgpol:sagarmala-2');
  if (!sag2 || sag2.status !== 'proposed') err(`${w}: Sagarmala 2.0 must exist and be classified "proposed"`);
}

/* ---------------------------------------------------------------- opportunities */
{
  const w = 'opportunities.json';
  opportunities.opportunities.forEach((o) => {
    register(o.id, w, 'sgo:');
    const where = o.id;
    if (!o.title) err(`${where}: title required`);
    if (!CLASSIFICATIONS.has(o.classification)) err(`${where}: invalid classification "${o.classification}"`);
    if (!PILLARS.has(o.pillar_key)) err(`${where}: invalid pillar_key "${o.pillar_key}"`);
    claim(o.trigger, `${where}.trigger`);
    if (!o.trigger.evidence || o.trigger.evidence !== 'fact') err(`${where}: trigger must be a sourced fact`);
    if (!o.reasoning) err(`${where}: reasoning required`);
    if (!o.customers?.length) err(`${where}: customers required`);
    if (!o.dependencies?.length) err(`${where}: dependencies required`);
    if (!o.constraints?.length) err(`${where}: constraints required`);
    if (!CONF.has(o.confidence)) err(`${where}: invalid confidence`);
    if (!o.evidence_needed) err(`${where}: evidence_needed required`);
    checkDate(o.last_reviewed, `${where}.last_reviewed`);
    const rel = o.related ?? {};
    (rel.project_ids ?? []).forEach((id) => { if (!ids.has(id)) err(`${where}: unknown project "${id}"`); });
    (rel.port_ids ?? []).forEach((id) => { if (!portIds.has(id)) err(`${where}: unknown port "${id}"`); });
    (rel.company_ids ?? []).forEach((id) => { if (!companyIds.has(id)) err(`${where}: unknown company "${id}"`); });
    (rel.policy_ids ?? []).forEach((id) => { if (!policyIds.has(id)) err(`${where}: unknown policy "${id}"`); });
    if (/\bwill\b/i.test(o.reasoning)) warn(`${where}: reasoning uses "will" — prefer "may/could"`);
  });
}

/* ---------------------------------------------------------------- coverage manifest cross-check */
{
  const w = 'coverage.json';
  const c = coverage.counts;
  const expect = (key, actual) => { if (c[key] !== actual) err(`${w}: counts.${key} (${c[key]}) does not match actual records (${actual}) — keep the manifest honest`); };
  expect('dossier_timeline_entries', dossier.programme.timeline.length);
  expect('dossier_institutions', dossier.programme.institutions.length);
  expect('policies', policies.policies.length);
  expect('flagship_projects', pillarProjects.projects.length);
  expect('ports_registered', ports.ports.length);
  expect('major_ports', ports.ports.filter((p) => p.type === 'major').length);
  expect('performance_series', performance.series.length);
  expect('performance_points', performance.series.reduce((a, s) => a + s.points.length, 0));
  expect('connectivity_connections', connectivity.connections.length);
  expect('cezs', industrialisation.cezs.length);
  expect('community_initiatives', community.initiatives.length);
  expect('companies', companies.companies.length);
  expect('company_relationships', companies.companies.reduce((a, x) => a + (x.relationships?.length ?? 0), 0));
  expect('opportunities', opportunities.opportunities.length);
  const newSources = sources.filter((s) => s.accessed_date === '2026-10-10').length;
  if (c.sources_added > newSources) err(`${w}: counts.sources_added (${c.sources_added}) exceeds sources accessed on 2026-10-10 in the registry (${newSources})`);
  coverage.discrepancies.forEach((d) => { if (!d.id || !d.subject || !d.observations || !d.resolution) err(`${w}: discrepancy record malformed`); register(d.id, w, 'sgdisc:'); });
  const pillars = Object.keys(coverage.pillar_coverage);
  pillars.forEach((k) => { if (!PILLARS.has(k)) err(`${w}: pillar_coverage key "${k}" invalid`); });
  if (pillars.length !== 5) err(`${w}: pillar_coverage must cover all five pillars`);
}

/* ---------------------------------------------------------------- summary */
const summary = `sagarmala-intelligence: ${pillarProjects.projects.length} flagship projects · ${ports.ports.length} ports (${ports.ports.filter((p) => p.type === 'major').length} major) · ${performance.series.reduce((a, s) => a + s.points.length, 0)} metric points · ${industrialisation.cezs.length} CEZs · ${companies.companies.length} companies (${companies.companies.reduce((a, x) => a + (x.relationships?.length ?? 0), 0)} relationships) · ${policies.policies.length} policies · ${opportunities.opportunities.length} opportunities · ${usedSources.size} sources cited`;
console.log(summary);
warnings.forEach((m) => console.log(`  WARN  ${m}`));
errors.forEach((m) => console.log(`  ERROR ${m}`));
if (errors.length || (STRICT && warnings.length)) { console.log(`✗ ${errors.length} error(s), ${warnings.length} warning(s)`); process.exit(1); }
console.log(`✓ 0 errors, ${warnings.length} warning(s)`);
