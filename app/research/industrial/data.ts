// Industrial Intelligence & Connectivity Layer — loader.
// The only seam between data/industrial-intelligence/*.json and the pages. A later SID
// migration (bake-industrial.mjs → _industrial.json) replaces the imports below and nothing else.
// Server-only: imported by statically generated pages; never import from a client component.
import sourcesJson from '../../../data/industrial-intelligence/sources.json';
import nodesJson from '../../../data/industrial-intelligence/industrial-nodes.json';
import infraJson from '../../../data/industrial-intelligence/infrastructure-nodes.json';
import projectsJson from '../../../data/industrial-intelligence/infrastructure-projects.json';
import relsJson from '../../../data/industrial-intelligence/relationships.json';
import oppsJson from '../../../data/industrial-intelligence/opportunity-surfaces.json';
import signalLinksJson from '../../../data/industrial-intelligence/signal-links.json';
import itlaJson from '../../../data/industrial-intelligence/itla.json';
import supplierJson from '../../../data/industrial-intelligence/supplier-map.json';

import { playerById, playerSlug, corridorByCode } from '../atlas';
import { getReport } from '../../reports/data';
import { getSignal } from '../../signals/data';
import { corridors } from '../../corridors/data';
import { nodeBySlugs } from '../../corridors/node-data';
import {
  ICS, CGI, SCCS, IOS, SNS, CGI_PROFILES, CGI_LABELS, CGI_STATUS_VALUE, SUPPLIER_STATUS_VALUE,
  bandValue, computeScore, haversineKm, notYetComputed, roundKm, sccsFromInputs,
} from './scoring';
import type {
  Confidence, Connectivity, IndustrialNode, InfrastructureNode, InfrastructureProject, ItlaRecord,
  OpportunitySurface, Provenance, ProvenanceRef, Relationship, RelationshipType, ScoreComponentResult,
  ScoreResult, SignalLink, SourceRecord, SupplierMap,
} from './types';
import { RELATIONSHIP_TYPES } from './types';

/* ------------------------------------------------------------------ raw collections */

export const sources = (sourcesJson as { sources: SourceRecord[] }).sources;
export const industrialNodes = (nodesJson as { nodes: IndustrialNode[] }).nodes;
export const infraNodes = (infraJson as { nodes: InfrastructureNode[] }).nodes;
export const projects = (projectsJson as { projects: InfrastructureProject[] }).projects;
export const explicitRelationships = (relsJson as { relationships: Relationship[] }).relationships;
export const opportunities = (oppsJson as { surfaces: OpportunitySurface[] }).surfaces;
export const signalLinks = (signalLinksJson as { links: SignalLink[] }).links;
export const itla = itlaJson as unknown as ItlaRecord & { status: string; note: string };
export const supplierMap = supplierJson as unknown as SupplierMap;

const sourceById = new Map(sources.map((s) => [s.id, s]));
const infraById = new Map(infraNodes.map((i) => [i.id, i]));
const projectById = new Map(projects.map((p) => [p.id, p]));
const oppById = new Map(opportunities.map((o) => [o.id, o]));
const nodeById = new Map(industrialNodes.map((n) => [n.id, n]));

export const nodeBySlug = (slug: string) => industrialNodes.find((n) => n.slug === slug);
export const getInfra = (id: string) => infraById.get(id);
export const getProject = (id: string) => projectById.get(id);
export const getOpportunity = (id: string) => oppById.get(id);
export const getIndustrialNode = (id: string) => nodeById.get(id);
export const getSource = (id: string) => sourceById.get(id);

/* ------------------------------------------------------------------ provenance */

export function expand(refs: ProvenanceRef[] | undefined): Provenance[] {
  return (refs ?? []).flatMap((r) => {
    const s = sourceById.get(r.source_id);
    if (!s) return [];
    return [{
      source_id: s.id, source_name: s.source_name, source_url: s.source_url, source_type: s.source_type,
      publication_date: s.publication_date, accessed_date: s.accessed_date, confidence: s.confidence,
      notes: r.notes ?? s.notes ?? '',
    }];
  });
}

/** Every distinct source cited anywhere on a node's dossier, in registry order. */
export function sourcesForNode(node: IndustrialNode): SourceRecord[] {
  const ids = new Set<string>();
  const add = (refs?: ProvenanceRef[]) => (refs ?? []).forEach((r) => ids.add(r.source_id));
  node.facts.forEach((f) => add(f.provenance));
  node.companies.forEach((c) => add(c.provenance));
  node.strategic_dependencies.forEach((d) => add(d.provenance));
  node.ics_inputs.forEach((i) => add(i.provenance));
  node.cgi_inputs.forEach((i) => add(i.provenance));
  relationshipsFor(node.id).forEach((r) => add(r.provenance));
  projectsForNode(node.id).forEach((p) => add(p.provenance));
  opportunitiesForNode(node.id).forEach((o) => { add(o.provenance); add(o.triggering_development.provenance); });
  connectivityTargets(node).forEach((i) => add(i.provenance));
  supplierMap.assessments.filter((a) => a.node_id === node.id).forEach((a) => { add(a.provenance); a.suppliers.forEach((x) => add(x.provenance)); });
  return sources.filter((s) => ids.has(s.id));
}

/* ------------------------------------------------------------------ geometry */

const RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };
const minConf = (...cs: (Confidence | null | undefined)[]): Confidence | null =>
  cs.some((c) => !c) ? null : (cs as Confidence[]).reduce((a, b) => (RANK[a] <= RANK[b] ? a : b));

const hasCoords = (c: { lat: number | null; lng: number | null }) => c.lat !== null && c.lng !== null;

export function straightLineKm(node: IndustrialNode, infra: InfrastructureNode): number | null {
  if (!hasCoords(node.coordinates) || !hasCoords(infra.coordinates)) return null;
  return roundKm(haversineKm(
    { lat: node.coordinates.lat!, lng: node.coordinates.lng! },
    { lat: infra.coordinates.lat!, lng: infra.coordinates.lng! },
  ));
}

const NEAREST_FILTERS: Record<string, (i: InfrastructureNode) => boolean> = {
  'nearest:seaport': (i) => i.type === 'seaport' && i.status === 'operational',
  'nearest:cargo_airport': (i) => i.type === 'airport' && i.status === 'operational' && i.classification === 'international' && i.cargo_handling === true,
  'nearest:dfc': (i) => i.type === 'dfc_station' && i.status === 'operational',
};

export function resolveTarget(node: IndustrialNode, target: string): { infra: InfrastructureNode; km: number } | null {
  if (target.startsWith('infra:')) {
    const infra = infraById.get(target);
    const km = infra ? straightLineKm(node, infra) : null;
    return infra && km !== null ? { infra, km } : null;
  }
  const f = NEAREST_FILTERS[target];
  if (!f) return null;
  const ranked = infraNodes
    .filter(f)
    .map((infra) => ({ infra, km: straightLineKm(node, infra) }))
    .filter((x): x is { infra: InfrastructureNode; km: number } => x.km !== null)
    .sort((a, b) => a.km - b.km);
  return ranked[0] ?? null;
}

/* ------------------------------------------------------------------ scores */

export interface IcsComponentView extends ScoreComponentResult { target?: { id: string; name: string } }

export function icsComponents(node: IndustrialNode): IcsComponentView[] {
  return ICS.components.map((def) => {
    const input = node.ics_inputs.find((i) => i.key === def.key);
    const base = { key: def.key, label: def.label, weight: def.weight };
    if (!input) return { ...base, value: null, confidence: null, rationale: 'Not assessed.' };
    if (input.derive?.kind === 'distance_band') {
      const hit = resolveTarget(node, input.derive.target);
      if (!hit) return { ...base, value: null, confidence: null, rationale: `${input.rationale} No eligible target with coordinates.` };
      let value = bandValue(def.key, hit.km);
      if (def.key === 'logistics' && hit.infra.status !== 'operational') value = Math.min(value, 0.5);
      return {
        ...base, value, derived_km: hit.km,
        confidence: minConf(node.coordinates.confidence, hit.infra.coordinates.confidence),
        rationale: `${hit.infra.name}: ≈${hit.km} km straight-line${hit.infra.status !== 'operational' ? ` (${hit.infra.status.replace(/_/g, ' ')})` : ''}. ${input.rationale}`,
        target: { id: hit.infra.id, name: hit.infra.name },
      };
    }
    return { ...base, value: input.value, confidence: input.confidence, rationale: input.rationale };
  });
}

export function cgiComponents(node: IndustrialNode): ScoreComponentResult[] {
  const weights = CGI_PROFILES[node.requirement_profile];
  return Object.entries(weights).map(([key, weight]) => {
    const a = node.cgi_inputs.find((i) => i.key === key);
    return {
      key, label: CGI_LABELS[key], weight,
      value: a ? CGI_STATUS_VALUE[a.status] : null,
      confidence: a?.status === 'unknown' ? null : (a?.confidence ?? null),
      rationale: a ? `${a.status.toUpperCase()} — ${a.rationale}` : 'Not assessed.',
    };
  });
}

/** Supplier-map rows for a node, in profile category order (missing categories → null rows). */
export function supplierRows(node: IndustrialNode) {
  return supplierMap.categories[node.requirement_profile].map((cat) => ({
    category: cat, assessment: supplierMap.assessments.find((a) => a.node_id === node.id && a.category === cat.key) ?? null,
  }));
}

export function supplierProximity(node: IndustrialNode): { value: number | null; confidence: Confidence | null; rationale: string } {
  const rows = supplierRows(node);
  if (rows.some((r) => !r.assessment)) return { value: null, confidence: null, rationale: 'Not every critical input category has been searched yet.' };
  const vals: number[] = rows.map((r) => SUPPLIER_STATUS_VALUE[r.assessment!.status]);
  const covered = rows.filter((r) => r.assessment!.status !== 'none_documented').length;
  const anyLow = rows.some((r) => r.assessment!.confidence === 'low');
  return {
    value: vals.reduce((a, b) => a + b, 0) / vals.length,
    confidence: anyLow ? 'low' : 'medium',
    rationale: `${covered} of ${rows.length} critical input categories have a documented supplier facility (operating or planned) in reach; see the supplier map.`,
  };
}

export function sccsComponents(node: IndustrialNode): ScoreComponentResult[] {
  const ics = Object.fromEntries(icsComponents(node).map((c) => [c.key, { value: c.value, confidence: c.confidence }]));
  return sccsFromInputs(node.requirement_profile, ics, supplierProximity(node));
}

export function scoresFor(node: IndustrialNode): ScoreResult[] {
  return [
    computeScore(ICS, icsComponents(node)),
    computeScore(SCCS, sccsComponents(node)),
    computeScore(CGI, cgiComponents(node), `Requirement profile: ${node.requirement_profile.replace('_', ' ')}.`),
    notYetComputed(IOS),
    notYetComputed(SNS),
  ];
}

/* ------------------------------------------------------------------ relationships (explicit + synthesised) */

function synthesised(): Relationship[] {
  const out: Relationship[] = [];
  for (const n of industrialNodes) {
    for (const s of n.sectors.filter((x) => x.startsWith('sector:'))) {
      out.push({ id: `rel:auto:${n.slug}:sector:${s.slice(7)}`, source: n.id, target: s, type: 'specialises_in', evidence: 'fact', confidence: 'high', note: '', provenance: [] });
    }
    for (const c of n.companies) {
      for (const pid of c.player_ids) {
        out.push({ id: `rel:auto:${n.slug}:player:${pid}`, source: `player:${pid}`, target: n.id, type: c.role.startsWith('Cluster') ? 'part_of' : 'anchors', evidence: c.evidence, confidence: 'high', note: `${c.role} — ${c.status}`, provenance: c.provenance });
      }
    }
    for (const input of n.ics_inputs) {
      if (input.derive?.kind !== 'distance_band') continue;
      const hit = resolveTarget(n, input.derive.target);
      if (!hit) continue;
      const type: RelationshipType = input.key === 'port' ? 'nearest_port' : input.key === 'airport' ? 'nearest_airport' : input.key === 'freight_corridor' ? 'on_freight_corridor' : 'connected_to';
      if (explicitRelationships.some((r) => r.source === n.id && r.target === hit.infra.id)) continue;
      out.push({ id: `rel:auto:${n.slug}:${input.key}`, source: n.id, target: hit.infra.id, type, evidence: 'derived', confidence: minConf(n.coordinates.confidence, hit.infra.coordinates.confidence) ?? 'low', note: `Nearest by straight-line distance (≈${hit.km} km).`, provenance: [{ source_id: 'src:techadyant-geocoding' }] });
    }
  }
  for (const p of projects) {
    for (const nid of p.affected_node_ids) {
      out.push({ id: `rel:auto:${p.id.slice(5)}:${nid.slice(6)}`, source: p.id, target: nid, type: 'improves_connectivity_of', evidence: 'analysis', confidence: 'medium', note: p.strategic_significance, provenance: p.provenance });
    }
  }
  for (const o of opportunities) {
    for (const pid of o.triggering_development.project_ids) {
      out.push({ id: `rel:auto:${pid.slice(5)}:${o.id.slice(4)}`, source: pid, target: o.id, type: 'creates', evidence: 'analysis', confidence: o.confidence, note: '', provenance: o.triggering_development.provenance });
    }
    for (const pl of o.relevant_player_ids) {
      out.push({ id: `rel:auto:${o.id.slice(4)}:player:${pl}`, source: `player:${pl}`, target: o.id, type: 'potentially_benefits_from', evidence: 'analysis', confidence: o.confidence, note: 'Techadyant analysis — not an investment, eligibility or procurement claim.', provenance: [] });
    }
  }
  return out;
}

export const allRelationships: Relationship[] = [...explicitRelationships, ...synthesised()];

export function relationshipsFor(id: string): Relationship[] {
  return allRelationships.filter((r) => r.source === id || r.target === id);
}
export const relationshipLabel = (r: Relationship, fromId: string) =>
  r.source === fromId ? RELATIONSHIP_TYPES[r.type].label : RELATIONSHIP_TYPES[r.type].inverse;

/* ------------------------------------------------------------------ connectivity object */

const MODE_OF: Partial<Record<InfrastructureNode['type'], keyof Connectivity>> = {
  expressway: 'road', national_highway: 'road', state_highway: 'road',
  railway_line: 'rail', railway_station: 'rail', dfc_station: 'freight_corridors',
  freight_corridor: 'freight_corridors', seaport: 'ports', airport: 'airports',
  inland_waterway: 'waterways', river_terminal: 'waterways',
  mmlp: 'logistics_nodes', mmlh: 'logistics_nodes', icd: 'logistics_nodes', cfs: 'logistics_nodes', freight_terminal: 'logistics_nodes', logistics_cluster: 'logistics_nodes',
};

export function connectivityFor(node: IndustrialNode): Connectivity {
  const c: Connectivity = { road: [], rail: [], ports: [], airports: [], waterways: [], logistics_nodes: [], freight_corridors: [] };
  for (const r of relationshipsFor(node.id)) {
    if (r.source !== node.id || !r.target.startsWith('infra:')) continue;
    const infra = infraById.get(r.target);
    const mode = infra ? MODE_OF[infra.type] : undefined;
    if (infra && mode && !c[mode].some((x) => x.infra_id === infra.id)) c[mode].push({ infra_id: infra.id, relation_id: r.id });
  }
  return c;
}
export function connectivityTargets(node: IndustrialNode): InfrastructureNode[] {
  const c = connectivityFor(node);
  return Object.values(c).flat().map((x) => infraById.get(x.infra_id)!).filter(Boolean);
}
export const CONNECTIVITY_LABELS: Record<keyof Connectivity, string> = {
  road: 'Road', rail: 'Rail', freight_corridors: 'Freight corridors', ports: 'Seaports', airports: 'Airports', waterways: 'Waterways', logistics_nodes: 'Logistics nodes',
};

/* ------------------------------------------------------------------ cross-links */

export interface LinkRef { id: string; name: string; href: string | null; meta?: string }

export function playerLink(pid: string): LinkRef {
  const p = playerById(pid);
  return p ? { id: pid, name: p.name, href: `/research/players/${playerSlug(pid)}/`, meta: p.type } : { id: pid, name: pid, href: null };
}

export function corridorNodeLink(ref: string): LinkRef | null {
  const [cor, node] = ref.replace('corridor-node:', '').split('/');
  const n = nodeBySlugs(cor, node);
  const c = corridors.find((x) => x.slug === cor);
  return n && c ? { id: ref, name: n.name, href: `/corridors/${cor}/${node}/`, meta: `${c.abbr} node · ${n.stage}` } : null;
}

export function sectorLabel(s: string): string {
  return s.startsWith('sector:') ? (corridorByCode(s.slice(7))?.label ?? s.slice(7)) : s;
}

export function reportLinks(slugs: string[]): LinkRef[] {
  return slugs.flatMap((slug) => {
    const r = getReport(slug);
    return r ? [{ id: `report:${slug}`, name: r.title, href: `/reports/${slug}/`, meta: r.status === 'forthcoming' ? 'Forthcoming' : r.publishedLabel }] : [];
  });
}

export function signalsForNode(nodeId: string): LinkRef[] {
  return signalLinks
    .filter((l) => l.related_industrial_nodes.includes(nodeId))
    .flatMap((l) => {
      const s = getSignal(l.signal_slug);
      return s && s.status !== 'placeholder' ? [{ id: `signal:${s.slug}`, name: s.title, href: `/signals/${s.slug}/`, meta: `${s.no} · ${s.dateLabel}` }] : [];
    });
}

export const projectsForNode = (nodeId: string) => projects.filter((p) => p.affected_node_ids.includes(nodeId));
export const opportunitiesForNode = (nodeId: string) => opportunities.filter((o) => o.node_ids.includes(nodeId));

export const nodesForPlayer = (pid: string) => industrialNodes.filter((n) => n.companies.some((c) => c.player_ids.includes(pid)));
export const opportunitiesForPlayer = (pid: string) => opportunities.filter((o) => o.relevant_player_ids.includes(pid));
export const nodesForCorridorNode = (corridor: string, node: string) =>
  industrialNodes.filter((n) => n.corridor_node_refs.includes(`corridor-node:${corridor}/${node}`));
export const linkForSignal = (slug: string) => signalLinks.find((l) => l.signal_slug === slug);

/* ------------------------------------------------------------------ display helpers */

export const monthYear = (iso: string) =>
  new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const inrCr = (cr: number | null) =>
  cr === null ? '—' : cr >= 100000 ? `₹${(cr / 100000).toFixed(2)} lakh cr` : `₹${cr.toLocaleString('en-IN')} cr`;

/** Lightweight map payload — the only data shipped to the client. */
export interface MapPoint { id: string; kind: 'node' | 'infra'; name: string; lat: number; lng: number; subtype: string; status: string; state: string | null; href: string | null; blurb: string; sectors: string[] }
export function mapPoints(): MapPoint[] {
  const pts: MapPoint[] = [];
  for (const n of industrialNodes) {
    if (!hasCoords(n.coordinates)) continue;
    const ics = computeScore(ICS, icsComponents(n));
    pts.push({
      id: n.id, kind: 'node', name: n.short_name, lat: n.coordinates.lat!, lng: n.coordinates.lng!, subtype: n.type, status: 'node', state: n.state,
      href: `/research/industrial-nodes/${n.slug}/`,
      blurb: `${n.headline} ICS: ${ics.status === 'computed' ? `${ics.score} (${ics.band})` : 'Insufficient Data'}.`,
      sectors: n.sectors.map(sectorLabel),
    });
  }
  for (const i of infraNodes) {
    if (!hasCoords(i.coordinates) || i.type === 'mmlh') continue; // MMLH Dadri shares the DFC point
    pts.push({ id: i.id, kind: 'infra', name: i.name, lat: i.coordinates.lat!, lng: i.coordinates.lng!, subtype: i.type, status: i.status, state: i.state, href: null, blurb: i.facts[0]?.value ?? '', sectors: [] });
  }
  return pts;
}
