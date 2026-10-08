#!/usr/bin/env node
// Build-time integrity check for data/industrial-intelligence/*.json.
// Runs first in `npm run build`; any ERROR exits non-zero and stops the deploy.
// Plain JS (no TS, no deps) so it runs on any Node ≥ 18 in Cloudflare's builder.
//
//   node scripts/validate-industrial.mjs            # errors + warnings
//   node scripts/validate-industrial.mjs --strict   # warnings also fail
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'data/industrial-intelligence');
const STRICT = process.argv.includes('--strict');
const STALE_DAYS = 120;
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf8'));
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');

/* ---------------------------------------------------------------- load */
const sources = load('sources.json').sources;
const nodes = load('industrial-nodes.json').nodes;
const infra = load('infrastructure-nodes.json').nodes;
const projects = load('infrastructure-projects.json').projects;
const rels = load('relationships.json').relationships;
const opps = load('opportunity-surfaces.json').surfaces;
const sigLinks = load('signal-links.json').links;
const itla = load('itla.json');
const sme = load('sme-champions.json');
const supplierMap = load('supplier-map.json');

/* ---------------------------------------------------------------- external registries */
const atlas = JSON.parse(read('app/research/_atlas.json') || '{"players":[],"corridors":[]}');
const playerIds = new Set(atlas.players.map((p) => p.id));
const sectorCodes = new Set(atlas.corridors.map((c) => c.code));
const reportSlugs = new Set([...read('app/reports/data.ts').matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1]));
const signalSlugs = new Set([...read('app/signals/data.ts').matchAll(/^\s*slug: '([^']+)'/gm)].map((m) => m[1]));
const corridorNodes = (() => {
  const set = new Set();
  let cor = null;
  for (const line of read('app/corridors/node-data.ts').split('\n')) {
    const c = line.match(/^ {4}slug: '([^']+)',\s*$/);
    if (c) cor = c[1];
    const n = line.match(/^\s+slug: '([^']+)', name: /);
    if (n && cor) set.add(`${cor}/${n[1]}`);
  }
  return set;
})();
const typesTs = read('app/research/industrial/types.ts');
const relTypes = new Set([...(typesTs.match(/RELATIONSHIP_TYPES = \{([\s\S]*?)\} as const/)?.[1] ?? '').matchAll(/^\s+(\w+):\s*\{/gm)].map((m) => m[1]));
if (!relTypes.size) err('Could not read RELATIONSHIP_TYPES from app/research/industrial/types.ts');

/* ---------------------------------------------------------------- vocabularies */
const CONF = new Set(['high', 'medium', 'low']);
const EVIDENCE = new Set(['fact', 'derived', 'analysis']);
const SRC_TYPES = new Set(['government', 'government_agency', 'state_government', 'psu', 'multilateral', 'company', 'trade_press', 'reference', 'techadyant']);
const COORD_SRC = new Set(['verified', 'gis', 'gazetteer', 'approximate']);
const NODE_TYPES = new Set(['industrial_cluster', 'industrial_park', 'economic_zone', 'manufacturing_hub', 'industrial_corridor_node', 'defence_corridor_node', 'electronics_cluster', 'semiconductor_cluster']);
const INFRA_TYPES = new Set(['expressway', 'national_highway', 'state_highway', 'railway_line', 'railway_station', 'freight_corridor', 'dfc_station', 'seaport', 'airport', 'inland_waterway', 'river_terminal', 'mmlp', 'mmlh', 'icd', 'cfs', 'freight_terminal', 'logistics_cluster', 'power']);
const INFRA_STATUS = new Set(['operational', 'partially_operational', 'trial', 'under_construction', 'approved', 'planned', 'unknown']);
const PROJ_STATUS = new Set(['approved', 'under_construction', 'trial', 'partially_operational', 'operational', 'announced', 'unknown']);
const REQS = ['air_cargo', 'power', 'water', 'port_access', 'warehousing', 'multimodal'];
const PROFILES = { semiconductor_fab: REQS, semiconductor_backend: REQS, electronics_assembly: REQS };
const ICS_KEYS = ['road', 'rail', 'port', 'airport', 'logistics', 'freight_corridor'];
const CGI_STATUS = new Set(['met', 'partial', 'gap', 'unknown']);
const OPP_TYPES = new Set(['supplier_localisation', 'component_manufacturing', 'logistics_service', 'specialised_infrastructure', 'shared_services', 'skills_capacity']);
const HORIZONS = new Set(['near', 'medium', 'long']);
const STAGES = new Set(['infrastructure_change', 'connectivity_effect', 'industrial_impact', 'supply_chain_effect', 'strategic_dependency', 'opportunity']);
const NEAREST = new Set(['nearest:seaport', 'nearest:cargo_airport', 'nearest:dfc']);

const ISO = /^\d{4}-\d{2}(-\d{2})?$/;
const isUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:'; } catch { return false; } };
const today = new Date();
const daysOld = (d) => (today - new Date(`${d.length === 7 ? `${d}-01` : d}T00:00:00Z`)) / 864e5;

/* ---------------------------------------------------------------- id registry */
const ids = new Map();
const register = (id, where, prefix) => {
  if (!id || typeof id !== 'string') return err(`${where}: missing id`);
  if (prefix && !id.startsWith(prefix)) err(`${where}: id "${id}" must start with "${prefix}"`);
  if (ids.has(id)) err(`Duplicate id "${id}" (${ids.get(id)} and ${where})`);
  ids.set(id, where);
};
sources.forEach((s) => register(s.id, 'sources.json', 'src:'));
nodes.forEach((n) => register(n.id, 'industrial-nodes.json', 'inode:'));
infra.forEach((i) => register(i.id, 'infrastructure-nodes.json', 'infra:'));
projects.forEach((p) => register(p.id, 'infrastructure-projects.json', 'proj:'));
opps.forEach((o) => register(o.id, 'opportunity-surfaces.json', 'opp:'));
rels.forEach((r) => register(r.id, 'relationships.json', 'rel:'));
const slugs = new Set();
nodes.forEach((n) => { if (slugs.has(n.slug)) err(`Duplicate node slug "${n.slug}"`); slugs.add(n.slug); if (n.id !== `inode:${n.slug}`) err(`${n.id}: id must equal "inode:<slug>"`); });

const sourceIds = new Set(sources.map((s) => s.id));
const usedSources = new Set();
const checkProv = (refs, where, { required = false } = {}) => {
  if (!Array.isArray(refs)) { if (required) err(`${where}: provenance missing`); return; }
  if (required && !refs.length) err(`${where}: at least one source required`);
  refs.forEach((r) => { if (!sourceIds.has(r.source_id)) err(`${where}: unknown source "${r.source_id}"`); else usedSources.add(r.source_id); });
};
const resolves = (ref) => {
  if (ids.has(ref)) return true;
  if (ref.startsWith('player:')) return playerIds.has(ref.slice(7));
  if (ref.startsWith('corridor-node:')) return corridorNodes.has(ref.slice(14));
  if (ref.startsWith('sector:')) return sectorCodes.has(ref.slice(7));
  if (ref.startsWith('report:')) return reportSlugs.has(ref.slice(7));
  if (ref.startsWith('signal:')) return signalSlugs.has(ref.slice(7));
  return false;
};
const checkCoords = (c, where) => {
  if (!c || typeof c !== 'object') return err(`${where}: coordinates object missing`);
  const { lat, lng } = c;
  if ((lat === null) !== (lng === null)) return err(`${where}: lat/lng must both be set or both null`);
  if (lat === null) return;
  if (typeof lat !== 'number' || typeof lng !== 'number' || Number.isNaN(lat) || Number.isNaN(lng)) return err(`${where}: coordinates must be numbers`);
  if (lat < 6 || lat > 37.5 || lng < 68 || lng > 97.5) err(`${where}: coordinates (${lat}, ${lng}) fall outside India's bounding box`);
  if (!COORD_SRC.has(c.coord_source)) err(`${where}: coord_source required for non-null coordinates`);
  if (!CONF.has(c.confidence)) err(`${where}: coordinate confidence required`);
};
const checkDate = (d, where, { nullable = false } = {}) => {
  if (d === null && nullable) return;
  if (typeof d !== 'string' || !ISO.test(d)) err(`${where}: invalid date "${d}"`);
};
const checkFresh = (d, where) => { if (typeof d === 'string' && ISO.test(d) && daysOld(d) > STALE_DAYS) warn(`${where}: last_verified ${d} is older than ${STALE_DAYS} days`); };
const checkFacts = (facts, where) => (facts ?? []).forEach((f, i) => {
  if (!f.label || !f.value) err(`${where} fact[${i}]: label and value required`);
  if (!EVIDENCE.has(f.evidence)) err(`${where} fact[${i}]: invalid evidence "${f.evidence}"`);
  if (f.as_of !== null) checkDate(f.as_of, `${where} fact[${i}].as_of`);
  checkProv(f.provenance, `${where} fact[${i}]`, { required: f.evidence !== 'analysis' });
});

/* ---------------------------------------------------------------- sources */
for (const s of sources) {
  const w = s.id;
  ['source_name', 'publisher', 'source_url', 'source_type', 'accessed_date', 'confidence'].forEach((k) => { if (!s[k]) err(`${w}: ${k} required`); });
  if (s.source_url && !isUrl(s.source_url)) err(`${w}: malformed URL "${s.source_url}"`);
  if (s.source_url && s.source_url.startsWith('http:')) warn(`${w}: non-HTTPS URL`);
  if (!SRC_TYPES.has(s.source_type)) err(`${w}: invalid source_type "${s.source_type}"`);
  if (!CONF.has(s.confidence)) err(`${w}: invalid confidence`);
  checkDate(s.publication_date, `${w}.publication_date`, { nullable: true });
  checkDate(s.accessed_date, `${w}.accessed_date`);
  if (s.access) {
    const a = s.access;
    if (!['open_web', 'self_registration', 'nda_gated', 'restricted', 'unknown'].includes(a.model)) err(`${w}: invalid access.model`);
    if (!['permitted', 'not_permitted', 'not_stated'].includes(a.redistribution)) err(`${w}: invalid access.redistribution`);
    if (!a.techadyant_use) err(`${w}: access.techadyant_use required`);
    if (['nda_gated', 'restricted'].includes(a.model) && /ingest|import|mirror/i.test(a.techadyant_use) && !/not|no /i.test(a.techadyant_use)) err(`${w}: restricted source must not be ingested`);
  }
}

/* ---------------------------------------------------------------- infrastructure */
for (const i of infra) {
  const w = i.id;
  if (!i.name) err(`${w}: name required`);
  if (!INFRA_TYPES.has(i.type)) err(`${w}: invalid type "${i.type}"`);
  if (!INFRA_STATUS.has(i.status)) err(`${w}: invalid status "${i.status}"`);
  checkCoords(i.coordinates, w);
  checkFacts(i.facts, w);
  checkProv(i.provenance, w, { required: true });
  checkDate(i.last_verified, `${w}.last_verified`); checkFresh(i.last_verified, w);
}

/* ---------------------------------------------------------------- industrial nodes */
for (const n of nodes) {
  const w = n.id;
  ['name', 'short_name', 'state', 'headline', 'last_verified', 'data_as_of'].forEach((k) => { if (!n[k]) err(`${w}: ${k} required`); });
  if (!NODE_TYPES.has(n.type)) err(`${w}: invalid type "${n.type}"`);
  if (!PROFILES[n.requirement_profile]) err(`${w}: invalid requirement_profile`);
  checkCoords(n.coordinates, w);
  if (!n.sectors?.some((s) => s.startsWith('sector:'))) {
    // The Atlas has no electronics-assembly corridor yet; those nodes carry free-text sectors only.
    if (n.requirement_profile === 'electronics_assembly') warn(`${w}: no Atlas sector linked (no electronics-assembly corridor in the Atlas)`);
    else err(`${w}: at least one Atlas sector (sector:<code>) required`);
  }
  n.sectors.filter((s) => s.startsWith('sector:')).forEach((s) => { if (!resolves(s)) err(`${w}: unknown sector "${s}"`); });
  if (!n.facts?.length) err(`${w}: facts required`);
  checkFacts(n.facts, w);
  if (!n.companies?.length) err(`${w}: at least one company/facility required`);
  (n.companies ?? []).forEach((c) => {
    if (!c.player_ids?.length) warn(`${w}: company "${c.name}" not linked to any Atlas player`);
    c.player_ids.forEach((pid) => { if (!playerIds.has(pid)) err(`${w}: company "${c.name}" → unknown Atlas player ${pid}`); });
    if (c.primary_player_id && !c.player_ids.includes(c.primary_player_id)) err(`${w}: "${c.name}" primary_player_id not in player_ids`);
    if (!EVIDENCE.has(c.evidence)) err(`${w}: "${c.name}" invalid evidence`);
    checkProv(c.provenance, `${w} company "${c.name}"`, { required: true });
    const typesSeen = c.player_ids.map((pid) => atlas.players.find((p) => p.id === pid)?.type_code).filter(Boolean);
    if (new Set(typesSeen).size < typesSeen.length) warn(`${w}: "${c.name}" links ${c.player_ids.length} SID records of the same type — merge candidates`);
  });
  (n.corridor_node_refs ?? []).forEach((r) => { if (!resolves(r)) err(`${w}: unknown corridor node "${r}"`); });
  (n.related_reports ?? []).forEach((s) => { if (!reportSlugs.has(s)) err(`${w}: unknown report "${s}"`); });
  (n.strategic_dependencies ?? []).forEach((d, i) => { if (!EVIDENCE.has(d.evidence)) err(`${w} dependency[${i}]: invalid evidence`); checkProv(d.provenance, `${w} dependency[${i}]`, { required: d.evidence === 'fact' }); });
  const seen = new Set();
  (n.ics_inputs ?? []).forEach((c) => {
    const ww = `${w} ics.${c.key}`;
    if (!ICS_KEYS.includes(c.key)) err(`${ww}: unknown ICS component`);
    if (seen.has(c.key)) err(`${ww}: duplicate component`); seen.add(c.key);
    if (c.value !== null && (typeof c.value !== 'number' || c.value < 0 || c.value > 1)) err(`${ww}: value must be 0..1 or null (got ${c.value})`);
    if (c.value !== null && !CONF.has(c.confidence)) err(`${ww}: confidence required when a value is set`);
    if (c.value !== null && !c.relation_ids?.length && !c.provenance?.length) err(`${ww}: a set value needs relation_ids or provenance`);
    if (c.derive) {
      if (c.value !== null) err(`${ww}: derived components must have value null`);
      if (!(NEAREST.has(c.derive.target) || ids.has(c.derive.target))) err(`${ww}: invalid derive target "${c.derive.target}"`);
    }
    (c.relation_ids ?? []).forEach((r) => { if (!ids.has(r)) err(`${ww}: unknown relation "${r}"`); });
    checkProv(c.provenance, ww);
  });
  ICS_KEYS.forEach((k) => { if (!seen.has(k)) warn(`${w}: ICS component "${k}" not assessed (treated as missing)`); });
  const profile = PROFILES[n.requirement_profile] ?? [];
  (n.cgi_inputs ?? []).forEach((c) => {
    const ww = `${w} cgi.${c.key}`;
    if (!profile.includes(c.key)) err(`${ww}: requirement not in profile ${n.requirement_profile}`);
    if (!CGI_STATUS.has(c.status)) err(`${ww}: invalid status "${c.status}"`);
    if (c.status !== 'unknown' && !CONF.has(c.confidence)) err(`${ww}: confidence required for assessed requirements`);
    if (c.status !== 'unknown' && !c.provenance?.length && !c.relation_ids?.length && c.confidence !== 'medium' && c.confidence !== 'low') warn(`${ww}: high-confidence assessment without evidence`);
    checkProv(c.provenance, ww);
    (c.relation_ids ?? []).forEach((r) => { if (!ids.has(r)) err(`${ww}: unknown relation "${r}"`); });
  });
  checkDate(n.last_verified, `${w}.last_verified`); checkDate(n.data_as_of, `${w}.data_as_of`); checkFresh(n.last_verified, w);
}

/* ---------------------------------------------------------------- relationships */
for (const r of rels) {
  const w = r.id;
  if (!relTypes.has(r.type)) err(`${w}: unknown relationship type "${r.type}"`);
  if (!resolves(r.source)) err(`${w}: broken source reference "${r.source}"`);
  if (!resolves(r.target)) err(`${w}: broken target reference "${r.target}"`);
  if (r.source === r.target) err(`${w}: self-relationship`);
  if (!EVIDENCE.has(r.evidence)) err(`${w}: invalid evidence`);
  if (!CONF.has(r.confidence)) err(`${w}: invalid confidence`);
  checkProv(r.provenance, w, { required: r.evidence === 'fact' });
  if (r.sourced_distance) {
    if (!(r.sourced_distance.km > 0 && r.sourced_distance.km < 4000)) err(`${w}: implausible sourced distance`);
    if (!['road', 'rail'].includes(r.sourced_distance.kind)) err(`${w}: sourced_distance.kind must be road or rail`);
    checkProv(r.sourced_distance.provenance, `${w}.sourced_distance`, { required: true });
  }
}

/* ---------------------------------------------------------------- projects */
for (const p of projects) {
  const w = p.id;
  ['name', 'sector', 'project_type', 'status_note', 'strategic_significance', 'last_verified'].forEach((k) => { if (!p[k]) err(`${w}: ${k} required`); });
  if (!PROJ_STATUS.has(p.status)) err(`${w}: invalid status`);
  if (p.estimated_cost_cr !== null && !(typeof p.estimated_cost_cr === 'number' && p.estimated_cost_cr > 0)) err(`${w}: estimated_cost_cr must be a positive number or null`);
  if (p.itla_appraisal_tier === true && !(p.estimated_cost_cr >= 500)) err(`${w}: itla_appraisal_tier=true requires cost ≥ ₹500 cr`);
  checkDate(p.approval_date, `${w}.approval_date`, { nullable: true });
  if (!p.affected_node_ids?.length) err(`${w}: must affect at least one industrial node (project → industrial consequence)`);
  p.affected_node_ids.forEach((id) => { if (!ids.has(id)) err(`${w}: unknown node ${id}`); });
  p.infra_ids.forEach((id) => { if (!ids.has(id)) err(`${w}: unknown infra ${id}`); });
  p.affected_sectors.filter((s) => s.startsWith('sector:')).forEach((s) => { if (!resolves(s)) err(`${w}: unknown sector ${s}`); });
  checkFacts(p.facts, w);
  checkProv(p.provenance, w, { required: true });
  checkFresh(p.last_verified, w);
}

/* ---------------------------------------------------------------- opportunity surfaces */
for (const o of opps) {
  const w = o.id;
  if (!o.title || !o.strategic_rationale) err(`${w}: title and strategic_rationale required`);
  if (!OPP_TYPES.has(o.opportunity_type)) err(`${w}: invalid opportunity_type`);
  if (!HORIZONS.has(o.horizon)) err(`${w}: invalid horizon`);
  if (!CONF.has(o.confidence)) err(`${w}: invalid confidence`);
  o.node_ids.forEach((id) => { if (!ids.has(id)) err(`${w}: unknown node ${id}`); });
  if (!o.node_ids.length) err(`${w}: must reference at least one industrial node`);
  checkProv(o.triggering_development?.provenance, `${w} trigger`, { required: true });
  (o.triggering_development?.project_ids ?? []).forEach((id) => { if (!ids.has(id)) err(`${w}: unknown trigger project ${id}`); });
  o.relevant_project_ids.forEach((id) => { if (!ids.has(id)) err(`${w}: unknown project ${id}`); });
  o.relevant_player_ids.forEach((pid) => { if (!playerIds.has(pid)) err(`${w}: unknown Atlas player ${pid}`); });
  if (!o.chain?.length) err(`${w}: effect chain required`);
  if (!o.chain?.some((c) => c.stage === 'opportunity')) err(`${w}: chain must end in an 'opportunity' step`);
  (o.chain ?? []).forEach((c, i) => {
    if (!STAGES.has(c.stage)) err(`${w} chain[${i}]: invalid stage`);
    if (!EVIDENCE.has(c.evidence)) err(`${w} chain[${i}]: invalid evidence`);
    if (c.evidence === 'fact') checkProv(c.provenance, `${w} chain[${i}]`, { required: true });
    if (c.stage === 'opportunity' && c.evidence !== 'analysis') err(`${w} chain[${i}]: the opportunity step must be labelled analysis`);
    if (c.evidence === 'analysis' && /\bwill\b/i.test(c.text)) warn(`${w} chain[${i}]: analytical step uses "will" — prefer "may/could"`);
  });
  if (!o.constraints?.length) err(`${w}: constraints required`);
  checkProv(o.provenance, w);
  checkFresh(o.last_verified, w);
}

/* ---------------------------------------------------------------- signal links */
for (const l of sigLinks) {
  const w = `signal-links "${l.signal_slug}"`;
  if (!signalSlugs.has(l.signal_slug)) warn(`${w}: signal not in app/signals/data.ts (not yet synced from CMS?) — link will not render`);
  [...l.related_industrial_nodes, ...l.related_projects, ...l.opportunity_surfaces, ...l.related_entities, ...l.related_sectors]
    .forEach((ref) => { if (!resolves(ref)) err(`${w}: broken reference "${ref}"`); });
}

/* ---------------------------------------------------------------- ITLA + SME placeholders */
checkProv(itla.institution?.provenance, 'itla.institution', { required: true });
(itla.dataset_classes ?? []).forEach((d) => {
  checkProv(d.stated_in, `itla.${d.key}`, { required: true });
  if (d.availability === 'available' && d.access === 'unknown') err(`itla.${d.key}: an available dataset must state its access terms`);
});
checkProv(sme.policy_context, 'sme.policy_context');
(sme.champions ?? []).forEach((c) => {
  const w = c.id ?? c.company;
  if (c.classification_basis !== 'techadyant_analysis') err(`${w}: classification_basis must be techadyant_analysis`);
  if (c.sgf_status === 'officially_documented') checkProv(c.sgf_provenance, `${w} sgf_provenance`, { required: true });
  else if (c.sgf_status !== 'not_documented') err(`${w}: sgf_status must be not_documented unless officially documented`);
  if (c.node_id && !ids.has(c.node_id)) err(`${w}: unknown node ${c.node_id}`);
});

/* ---------------------------------------------------------------- supplier map */
const SUP_STATUS = new Set(['operational_local', 'operational_regional', 'planned_local', 'none_documented']);
for (const a of supplierMap.assessments ?? []) {
  const w = `supplier-map ${a.node_id}.${a.category}`;
  const node = nodes.find((n) => n.id === a.node_id);
  if (!node) { err(`${w}: unknown node`); continue; }
  const cats = (supplierMap.categories?.[node.requirement_profile] ?? []).map((c) => c.key);
  if (!cats.includes(a.category)) err(`${w}: category not in profile ${node.requirement_profile}`);
  if (!SUP_STATUS.has(a.status)) err(`${w}: invalid status "${a.status}"`);
  if (!CONF.has(a.confidence)) err(`${w}: invalid confidence`);
  if (a.status === 'none_documented') { if (a.suppliers.length) err(`${w}: none_documented must list no suppliers`); checkProv(a.provenance, w, { required: true }); }
  else if (!a.suppliers.length) err(`${w}: status ${a.status} needs at least one supplier`);
  a.suppliers.forEach((x) => {
    checkProv(x.provenance, `${w} ${x.name}`, { required: true });
    if (x.player_id && !playerIds.has(x.player_id)) err(`${w}: unknown Atlas player ${x.player_id}`);
  });
}
for (const n of nodes) {
  for (const c of supplierMap.categories?.[n.requirement_profile] ?? []) {
    const hits = (supplierMap.assessments ?? []).filter((a) => a.node_id === n.id && a.category === c.key).length;
    if (hits > 1) err(`supplier-map ${n.id}.${c.key}: assessed ${hits} times`);
    if (!hits) warn(`supplier-map ${n.id}.${c.key}: not assessed (SCCS supplier proximity will read missing)`);
  }
}

/* ---------------------------------------------------------------- orphans */
const referenced = new Set();
rels.forEach((r) => { referenced.add(r.source); referenced.add(r.target); });
projects.forEach((p) => p.infra_ids.forEach((i) => referenced.add(i)));
nodes.forEach((n) => n.ics_inputs.forEach((c) => c.derive && referenced.add(c.derive.target)));
nodes.forEach((n) => { if (!rels.some((r) => r.source === n.id || r.target === n.id)) err(`${n.id}: orphaned industrial node (no relationships)`); });
infra.forEach((i) => { if (!referenced.has(i.id) && !['seaport', 'airport', 'dfc_station'].includes(i.type)) warn(`${i.id}: infrastructure node not referenced by any relationship or project`); });
sources.forEach((s) => { if (!usedSources.has(s.id) && !s.access && !s.context_only) warn(`${s.id}: source not cited by any record`); });

/* ---------------------------------------------------------------- report */
const summary = `industrial-intelligence: ${nodes.length} nodes · ${infra.length} infra · ${projects.length} projects · ${rels.length} relationships · ${opps.length} opportunity surfaces · ${sources.length} sources`;
console.log(summary);
warnings.forEach((m) => console.log(`  WARN  ${m}`));
errors.forEach((m) => console.log(`  ERROR ${m}`));
if (errors.length || (STRICT && warnings.length)) {
  console.log(`✗ ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`✓ 0 errors, ${warnings.length} warning(s)`);
