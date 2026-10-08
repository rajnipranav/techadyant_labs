// Programme Intelligence — loader and graph traversal.
// Server-only. Joins three existing layers; nothing here is hand-listed per programme:
//   SID fact layer      app/research/_logistics.json         (via ../logistics/data)
//   Intelligence layer  data/programme-intelligence/programmes.json
//   Industrial graph    data/industrial-intelligence/*        (via ../industrial/data)
// A programme's projects, infrastructure, industrial nodes, opportunities, signals and reports
// are DERIVED from evidenced edges, so new records surface automatically on the next build.
import programmesJson from '../../../data/programme-intelligence/programmes.json';
import { logistics, programmeById as sidProgramme, type LogisticsProgramme } from '../logistics/data';
import {
  projects, getInfra, getIndustrialNode, opportunities, signalLinks, explicitRelationships, sources,
  mapPoints, reportLinks, playerLink, corridorNodeLink, type LinkRef, type MapPoint,
} from '../industrial/data';
import type {
  IndustrialNode, InfrastructureNode, InfrastructureProject, OpportunitySurface, ProvenanceRef,
  Relationship, SourceRecord,
} from '../industrial/types';
import { RELATIONSHIP_TYPES } from '../industrial/types';
import { signals, type SignalMeta } from '../../signals/data';
import { reports } from '../../reports/data';
import { corridors as nicdpCorridors } from '../../corridors/data';
import type { ProgrammeFile, ProgrammeIntel, ProgrammeLink, RoadmapProgramme } from './types';

const file = programmesJson as unknown as ProgrammeFile;
export const programmes: ProgrammeIntel[] = file.programmes;
export const roadmap: RoadmapProgramme[] = file.roadmap;

export const PROGRAMMES_PATH = '/research/programmes/';
export const programmeHref = (slug: string) => `${PROGRAMMES_PATH}${slug}/`;
export const programmeBySlug = (slug: string) => programmes.find((p) => p.slug === slug);
export const programmeByLogisticsId = (id: string) => programmes.find((p) => p.logistics_id === id);

/** SID fact record behind a programme (metrics, verification label, captured sources). */
export const sidFor = (p: { logistics_id: string | null }): LogisticsProgramme | undefined =>
  p.logistics_id ? sidProgramme(p.logistics_id) : undefined;

/** Display name for any SID programme id, with a link when an intel page exists. */
export function programmeRef(logisticsId: string): LinkRef {
  const intel = programmeByLogisticsId(logisticsId);
  if (intel) return { id: intel.id, name: intel.name, href: programmeHref(intel.slug) };
  const road = roadmap.find((r) => r.logistics_id === logisticsId);
  const sid = sidProgramme(logisticsId);
  return { id: `logistics:${logisticsId}`, name: road?.name ?? sid?.name ?? logisticsId, href: road?.href ?? (sid ? `/research/logistics/#${logisticsId}` : null), meta: road ? `Programme page in Phase ${road.phase}` : 'Logistics reference layer' };
}

/* ------------------------------------------------------------------ graph: projects & infrastructure */

export interface ProgrammeProject { project: InfrastructureProject; link: ProgrammeLink }
export function projectsFor(p: ProgrammeIntel): ProgrammeProject[] {
  return projects.flatMap((project) =>
    (project.programme_links ?? []).filter((l) => l.programme_id === p.logistics_id).map((l) => ({ project, link: l as ProgrammeLink })));
}

export function infraFor(p: ProgrammeIntel): InfrastructureNode[] {
  const ids = new Set(projectsFor(p).flatMap(({ project }) => project.infra_ids));
  return [...ids].map((id) => getInfra(id)).filter(Boolean) as InfrastructureNode[];
}

/** SID logistics corridors/nodes carrying this programme id. */
export const sidCorridorsFor = (p: ProgrammeIntel) => logistics.corridors.filter((c) => c.programme_id === p.logistics_id);
export const sidNodesFor = (p: ProgrammeIntel) => logistics.nodes.filter((n) => n.programme_id === p.logistics_id);

/* ------------------------------------------------------------------ graph: industrial nodes */

export interface ConnectedNode {
  node: IndustrialNode;
  /** Evidence path, e.g. "NE-8 expressway (built under Bharatmala) → improves connectivity of". */
  paths: { project: InfrastructureProject; via: 'project' | 'gateway'; infra?: InfrastructureNode; relationship?: Relationship }[];
}

/**
 * Industrial nodes reached by EVIDENCED edges only:
 *   programme → project → affected node, or
 *   programme → project → infrastructure node ← explicit relationship (e.g. nearest_port) ← node.
 * Synthesised straight-line "nearest" relationships are deliberately excluded: geographic
 * proximity alone is never treated as a programme connection.
 */
export function nodesFor(p: ProgrammeIntel): ConnectedNode[] {
  const out = new Map<string, ConnectedNode>();
  const add = (node: IndustrialNode | undefined, path: ConnectedNode['paths'][number]) => {
    if (!node) return;
    const cur = out.get(node.id) ?? { node, paths: [] };
    cur.paths.push(path);
    out.set(node.id, cur);
  };
  for (const { project } of projectsFor(p)) {
    project.affected_node_ids.forEach((nid) => add(getIndustrialNode(nid), { project, via: 'project' }));
    for (const iid of project.infra_ids) {
      for (const r of explicitRelationships.filter((x) => x.target === iid && x.source.startsWith('inode:'))) {
        if (project.affected_node_ids.includes(r.source)) continue;
        add(getIndustrialNode(r.source), { project, via: 'gateway', infra: getInfra(iid), relationship: r });
      }
    }
  }
  return [...out.values()];
}

export const relLabel = (r: Relationship) => RELATIONSHIP_TYPES[r.type].label;

/* ------------------------------------------------------------------ graph: opportunities, companies */

export function opportunitiesFor(p: ProgrammeIntel): { opp: OpportunitySurface; why: string }[] {
  const projIds = new Set(projectsFor(p).map(({ project }) => project.id));
  return opportunities.flatMap((opp) => {
    if (opp.programme_ids?.includes(p.logistics_id)) return [{ opp, why: 'Triggered by this programme' }];
    const hit = [...opp.relevant_project_ids, ...opp.triggering_development.project_ids].find((id) => projIds.has(id));
    if (hit) return [{ opp, why: `Via ${projects.find((x) => x.id === hit)?.name ?? hit}` }];
    return [];
  });
}

/** Companies at connected industrial nodes. Location context only — never a contract or
 *  programme-participation claim (the page says so). */
export function companiesFor(p: ProgrammeIntel): { link: LinkRef; role: string; node: IndustrialNode }[] {
  const seen = new Set<string>();
  return nodesFor(p).flatMap(({ node }) => node.companies.filter((c) => c.primary_player_id && !c.role.startsWith('Cluster')).flatMap((c) => {
    const pid = c.primary_player_id!;
    if (seen.has(pid)) return [];
    seen.add(pid);
    return [{ link: playerLink(pid), role: c.role, node }];
  }));
}

/* ------------------------------------------------------------------ signals & reports */

const signalText = (s: SignalMeta) =>
  [s.title, s.excerpt, ...(s.body ?? []).map((b) => [b.text ?? '', ...(b.items ?? [])].join(' ')), ...(s.takeaways ?? [])].join(' ');

export interface MatchedSignal { signal: SignalMeta; reasons: string[] }

/** Signals for a programme, newest first. Three evidenced routes, each shown as a reason:
 *  (1) the signal names the programme; (2) a hand-reviewed signal link names it;
 *  (3) the signal is linked to an industrial node or project this programme reaches. */
export function signalsFor(p: ProgrammeIntel): MatchedSignal[] {
  const res = p.signal_match.patterns.map((x) => new RegExp(x, 'i'));
  const out = new Map<string, MatchedSignal>();
  const add = (s: SignalMeta | undefined, reason: string) => {
    if (!s || s.status === 'placeholder' || p.signal_match.exclude.includes(s.slug)) return;
    const cur = out.get(s.slug) ?? { signal: s, reasons: [] };
    if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    out.set(s.slug, cur);
  };
  const bySlug = new Map(signals.map((s) => [s.slug, s]));
  for (const s of signals) {
    const m = res.map((re) => signalText(s).match(re)).find(Boolean);
    if (m) add(s, `Mentions “${m[0]}”`);
  }
  for (const l of signalLinks) {
    if (l.related_programmes?.includes(p.logistics_id)) add(bySlug.get(l.signal_slug), l.note || 'Linked by Techadyant');
  }
  const nodes = nodesFor(p);
  const projIds = new Set(projectsFor(p).map(({ project }) => project.id));
  for (const l of signalLinks) {
    const n = nodes.find((x) => l.related_industrial_nodes.includes(x.node.id));
    if (n) add(bySlug.get(l.signal_slug), `On ${n.node.short_name}, a node this programme reaches`);
    const pr = l.related_projects.find((id) => projIds.has(id));
    if (pr) add(bySlug.get(l.signal_slug), `On a ${p.short_name} project`);
  }
  return [...out.values()].sort((a, b) => b.signal.date.localeCompare(a.signal.date));
}

export interface MatchedReport { link: LinkRef; reasons: string[] }
export function reportsFor(p: ProgrammeIntel): MatchedReport[] {
  const res = p.report_match.patterns.map((x) => new RegExp(x, 'i'));
  const out = new Map<string, MatchedReport>();
  const add = (slug: string, reason: string) => {
    if (p.report_match.exclude.includes(slug)) return;
    const link = reportLinks([slug])[0];
    if (!link) return;
    const cur = out.get(slug) ?? { link, reasons: [] };
    if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    out.set(slug, cur);
  };
  p.report_match.include.forEach((r) => add(r.slug, r.reason));
  for (const r of reports) {
    const m = res.map((re) => [r.title, r.subtitle, r.summary, ...(r.keywords ?? [])].join(' ').match(re)).find(Boolean);
    if (m) add(r.slug, `Mentions “${m[0]}”`);
  }
  nodesFor(p).forEach(({ node }) => node.related_reports.forEach((slug) => add(slug, `Covers ${node.short_name}`)));
  return [...out.values()];
}

/* ------------------------------------------------------------------ corridors, map, sources */

export function corridorLinks(p: ProgrammeIntel): (LinkRef & { note: string; provenance: ProvenanceRef[] })[] {
  const direct = p.corridor_refs.flatMap((c) => {
    const cor = nicdpCorridors.find((x) => x.slug === c.corridor);
    return cor ? [{ id: `corridor:${cor.slug}`, name: cor.name, href: `/corridors/${cor.slug}/`, meta: cor.abbr, note: c.note, provenance: c.provenance }] : [];
  });
  const viaNodes = nodesFor(p).flatMap(({ node }) => node.corridor_node_refs.flatMap((ref) => {
    const l = corridorNodeLink(ref);
    return l ? [{ ...l, note: `Corridor node behind ${node.short_name}`, provenance: [] as ProvenanceRef[] }] : [];
  }));
  return [...direct, ...viaNodes];
}

/** Map points for the footprint: connected industrial nodes + the infrastructure the programme's
 *  projects create or upgrade (only where coordinates are recorded). */
export function footprintPoints(p: ProgrammeIntel): MapPoint[] {
  const ids = new Set<string>([...nodesFor(p).map((n) => n.node.id), ...infraFor(p).map((i) => i.id)]);
  nodesFor(p).forEach((n) => n.paths.forEach((x) => x.infra && ids.add(x.infra.id)));
  return mapPoints().filter((m) => ids.has(m.id));
}

/** Every distinct registry source cited on a programme page, in registry order, numbered. */
export function sourcesFor(p: ProgrammeIntel): SourceRecord[] {
  const ids = new Set<string>();
  const add = (refs?: ProvenanceRef[]) => (refs ?? []).forEach((r) => ids.add(r.source_id));
  add(p.launch.provenance); add(p.time_horizon.provenance);
  p.glance.forEach((g) => add(g.provenance));
  p.ledger.forEach((g) => add(g.provenance));
  p.why_it_matters.forEach((c) => add(c.provenance));
  p.components.forEach((c) => add(c.provenance));
  p.timeline.forEach((c) => add(c.provenance));
  p.gaps.forEach((c) => add(c.provenance));
  p.consequences.forEach((c) => c.claims.forEach((x) => add(x.provenance)));
  p.supply_chain.forEach((c) => add(c.provenance));
  p.related_programmes.forEach((c) => add(c.provenance));
  p.corridor_refs.forEach((c) => add(c.provenance));
  projectsFor(p).forEach(({ project, link }) => { add(project.provenance); add(link.provenance); });
  opportunitiesFor(p).forEach(({ opp }) => add(opp.triggering_development.provenance));
  return sources.filter((s) => ids.has(s.id));
}

/* ------------------------------------------------------------------ reverse links (node & project pages) */

export function programmesForNode(nodeId: string): { ref: LinkRef; via: string }[] {
  const out = programmes.flatMap((p) => {
    const hit = nodesFor(p).find((n) => n.node.id === nodeId);
    if (!hit) return [];
    const first = hit.paths[0];
    const via = first.via === 'project' ? first.project.name : `${first.project.name} → ${first.infra?.name ?? ''}`;
    return [{ ref: programmeRef(p.logistics_id), via }];
  });
  // Programmes without an intel page yet (e.g. DFC) still reach nodes through their linked projects.
  for (const project of projects.filter((x) => x.affected_node_ids.includes(nodeId))) {
    for (const l of project.programme_links ?? []) {
      const ref = programmeRef(l.programme_id);
      if (!out.some((o) => o.ref.id === ref.id)) out.push({ ref, via: project.name });
    }
  }
  return out;
}
export const programmesForProject = (project: InfrastructureProject) =>
  (project.programme_links ?? []).map((l) => ({ ref: programmeRef(l.programme_id), type: l.type }));

/* ------------------------------------------------------------------ logistics gateway helpers */

/** The six flagship cards on the Logistics gateway / programme index, in brief order. */
export const FLAGSHIP_ORDER = ['pm-gati-shakti', 'bharatmala', 'sagarmala', 'dfc', 'industrial-corridors', 'ulip'];

export interface FlagshipCard {
  key: string; name: string; angle: string; href: string | null; live: boolean;
  phase: number | null; sid?: LogisticsProgramme; sectors: string[]; counts?: { projects: number; nodes: number; signals: number };
}
export function flagshipCards(): FlagshipCard[] {
  return FLAGSHIP_ORDER.flatMap((key): FlagshipCard[] => {
    const intel = programmes.find((p) => p.logistics_id === key);
    if (intel) {
      return [{ key, name: intel.name, angle: intel.angle, href: programmeHref(intel.slug), live: true, phase: 1, sid: sidFor(intel), sectors: intel.sectors.filter((s) => !s.startsWith('sector:')).slice(0, 3),
        counts: { projects: projectsFor(intel).length, nodes: nodesFor(intel).length, signals: signalsFor(intel).length } }];
    }
    const road = roadmap.find((r) => r.logistics_id === key || r.slug === key);
    if (!road) return [];
    return [{ key, name: road.name, angle: road.angle, href: road.href ?? (road.logistics_id ? `/research/logistics/#${road.logistics_id}` : null), live: false, phase: road.phase, sid: road.logistics_id ? sidProgramme(road.logistics_id) : undefined, sectors: [] }];
  });
}

/** Signals from the logistics system (for the gateway page): freight, ports, corridors, terminals. */
const SYSTEM_RE = /\b(logistics|freight|port|ports|rail|ICD|cargo|corridor|expressway|shipping|waterway|terminal|Gati ?Shakti|Bharatmala|Sagarmala)\b/i;
export function logisticsSignals(limit = 6): SignalMeta[] {
  return signals
    .filter((s) => s.status !== 'placeholder' && SYSTEM_RE.test(`${s.title} ${s.excerpt}`))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Where an opportunity surface is read in full: its first industrial node, else its programme page. */
export function opportunityHref(o: OpportunitySurface): string {
  if (o.node_ids.length) return `/research/industrial-nodes/${o.node_ids[0].slice(6)}/#opportunities`;
  const pr = (o.programme_ids ?? []).map((id) => programmeRef(id)).find((r) => r.href?.startsWith(PROGRAMMES_PATH));
  return pr?.href ? `${pr.href}#opportunities` : '/research/programmes/';
}
