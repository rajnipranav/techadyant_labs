#!/usr/bin/env node
// Export the Sagarmala Intelligence Database to downloadable CSV extracts
// (public/downloads/sagarmala/*.csv), linked from the programme page and the methodology page.
// Re-run after updating data/sagarmala-intelligence/*.json (wired into npm run build chain).
// Plain JS, no deps — Cloudflare-builder safe.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'data/sagarmala-intelligence');
const OUT = join(ROOT, 'public/downloads/sagarmala');
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf8'));
const sources = JSON.parse(readFileSync(join(ROOT, 'data/industrial-intelligence/sources.json'), 'utf8')).sources;

const csv = (rows) => rows.map((r) => r.map((cell) => {
  if (cell == null) return '';
  const s = String(cell).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}).join(',')).join('\n');

const srcIds = (refs) => (refs ?? []).map((r) => r.source_id).join('; ');
const srcUrls = (refs) => (refs ?? []).map((r) => {
  const s = sources.find((x) => x.id === r.source_id);
  return s ? s.source_url : '';
}).filter(Boolean).join('; ');

mkdirSync(OUT, { recursive: true });

/* projects */
const pp = load('pillar-projects.json');
const projectsCsv = csv([
  ['id', 'name', 'pillar', 'pillar_letter', 'scheme_funded', 'location', 'port_id', 'status', 'status_note', 'cost_cr', 'cost_note', 'planned_capacity', 'planned_capacity_unit', 'agency', 'operational_consequences', 'consequence_evidence', 'source_ids', 'source_urls', 'last_verified'],
  ...pp.projects.map((p) => [
    p.id, p.name, p.pillar_key, { port_modernisation: 'A', port_connectivity: 'B', port_led_industrialisation: 'C', coastal_community: 'D', coastal_shipping_iwt: 'E' }[p.pillar_key],
    p.scheme_funded ? 'yes' : 'no', p.location, p.port_id ?? '', p.status, p.status_note ?? '',
    p.cost_cr ?? '', p.cost_note ?? '',
    p.planned_capacity?.value ?? '', p.planned_capacity?.unit ?? '',
    p.agency, p.operational_consequences, p.consequence_evidence,
    srcIds(p.provenance), srcUrls(p.provenance), p.last_verified,
  ]),
]);
writeFileSync(join(OUT, 'sagarmala-projects.csv'), projectsCsv + '\n');

/* ports */
const ports = load('ports.json');
const portsCsv = csv([
  ['id', 'name', 'type', 'state', 'authority', 'status', 'lat', 'lng', 'coord_source', 'coord_confidence', 'throughput_fy2024_25_mt', 'throughput_fy2025_26_mt', 'throughput_note', 'container_fy2025_26_mteu', 'rank_fy26', 'sagarmala_project_ids', 'source_ids', 'source_urls', 'last_verified'],
  ...ports.ports.map((p) => [
    p.id, p.name, p.type, p.state, p.authority ?? '', p.status,
    p.coordinates?.lat ?? '', p.coordinates?.lng ?? '', p.coordinates?.coord_source ?? '', p.coordinates?.confidence ?? '',
    p.throughput?.fy2024_25_mt ?? '', p.throughput?.fy2025_26_mt ?? '', p.throughput_note ?? '',
    p.container_throughput?.fy2025_26_mteu ?? '', p.rank_fy26 ?? '',
    (p.sagarmala_project_ids ?? []).join('; '),
    srcIds(p.provenance), srcUrls(p.provenance), p.last_verified,
  ]),
]);
writeFileSync(join(OUT, 'sagarmala-ports.csv'), portsCsv + '\n');

/* performance */
const perf = load('port-performance.json');
const perfCsv = csv([
  ['series_id', 'metric', 'unit', 'scope', 'period', 'value', 'evidence', 'note', 'source_ids', 'source_urls'],
  ...perf.series.flatMap((s) => s.points.map((pt) => [
    s.id, s.metric, s.unit, s.scope, pt.period, pt.value, pt.evidence ?? 'fact', pt.note ?? '',
    srcIds(pt.provenance), srcUrls(pt.provenance),
  ])),
]);
writeFileSync(join(OUT, 'sagarmala-performance.csv'), perfCsv + '\n');

/* companies */
const companies = load('companies.json');
const compCsv = csv([
  ['company_id', 'company', 'category', 'hq', 'relationship_target', 'relationship_type', 'relationship_detail', 'source_ids', 'source_urls'],
  ...companies.companies.flatMap((c) => (c.relationships ?? []).map((r) => [
    c.id, c.name, c.category, c.hq ?? '', r.to, r.type, r.detail, srcIds(r.provenance), srcUrls(r.provenance),
  ]).concat(c.fleet ? [[c.id, c.name, c.category, c.hq ?? '', 'fleet', 'documented', `vessels: ${c.fleet.vessels ?? 'unknown'}${c.fleet.gt ? `; GT: ${c.fleet.gt}` : ''}${c.fleet.as_of ? ` (${c.fleet.as_of})` : ''}`, srcIds(c.provenance), srcUrls(c.provenance)]] : [])),
]);
writeFileSync(join(OUT, 'sagarmala-companies.csv'), compCsv + '\n');

/* sources */
const cited = new Set();
const walk = (x) => {
  if (Array.isArray(x)) return x.forEach(walk);
  if (x && typeof x === 'object') {
    if (Array.isArray(x.provenance)) x.provenance.forEach((r) => cited.add(r.source_id));
    Object.keys(x).forEach((k) => k !== 'provenance' && walk(x[k]));
  }
};
['dossier.json', 'pillar-projects.json', 'ports.json', 'port-performance.json', 'connectivity.json', 'industrialisation.json', 'community.json', 'companies.json', 'policies.json', 'opportunities.json', 'coverage.json'].forEach((f) => walk(load(f)));
const srcCsv = csv([
  ['source_id', 'source_name', 'publisher', 'url', 'type', 'publication_date', 'accessed_date', 'confidence', 'notes'],
  ...sources.filter((s) => cited.has(s.id)).map((s) => [
    s.id, s.source_name, s.publisher, s.source_url, s.source_type, s.publication_date ?? '', s.accessed_date, s.confidence, (s.notes ?? '').replace(/\n/g, ' '),
  ]),
]);
writeFileSync(join(OUT, 'sagarmala-sources.csv'), srcCsv + '\n');

console.log(`export-sagarmala-csv: wrote 5 extracts to public/downloads/sagarmala/ (${cited.size} sources, ${pp.projects.length} projects, ${ports.ports.length} ports, ${perf.series.reduce((a, s) => a + s.points.length, 0)} metric points)`);
