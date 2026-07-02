import { reports } from '../reports/data';
import { signals } from '../signals/data';
import { curatedSeedEdges, curatedSeedEntities } from './curated-seed';
import {
  allPlayers,
  atlas,
  corridorByCode,
  lastUpdated,
  playerSlug,
  relationshipsFor,
  type Player,
} from './atlas';
import type {
  AtlasGraph,
  AtlasGraphEdge,
  AtlasGraphEntity,
  AtlasEntityKind,
  AtlasRelationshipKind,
  AtlasScore,
} from './graph-types';

export const ENTITY_KIND_LABELS: Record<AtlasEntityKind, string> = {
  company: 'Company',
  technology: 'Technology',
  material: 'Material',
  product: 'Product',
  state: 'State',
  industrial_corridor: 'Industrial Corridor',
  policy: 'Policy',
  report: 'Report',
  signal: 'Signal',
  dataset: 'Dataset',
  supply_chain: 'Supply Chain',
  ecosystem: 'Ecosystem',
  opportunity_surface: 'Opportunity Surface',
  manufacturing_process: 'Manufacturing Process',
};

export const ENTITY_KIND_ORDER: AtlasEntityKind[] = [
  'company',
  'technology',
  'material',
  'product',
  'state',
  'industrial_corridor',
  'policy',
  'report',
  'signal',
  'dataset',
  'supply_chain',
  'ecosystem',
  'opportunity_surface',
  'manufacturing_process',
];

const SCORE_LABELS = {
  industrialImportance: 'Industrial importance',
  strategicImportance: 'Strategic importance',
  localizationPotential: 'Localization potential',
  importDependency: 'Import dependency',
  technologyComplexity: 'Technology complexity',
  capitalIntensity: 'Capital intensity',
  commercialReadiness: 'Commercial readiness',
  exportPotential: 'Export potential',
} as const;

const kebab = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const idFor = (kind: AtlasEntityKind, slug: string) => `${kind}:${slug}`;

function playerKind(player: Player): AtlasEntityKind {
  if (player.type_code === 'corridor' || player.type.toLowerCase().includes('corridor')) return 'industrial_corridor';
  if (player.type_code === 'policy' || player.type.toLowerCase().includes('policy')) return 'policy';
  if (player.type_code === 'material' || player.type.toLowerCase().includes('material')) return 'material';
  if (player.type_code === 'technology' || player.type.toLowerCase().includes('technology')) return 'technology';
  if (player.type_code === 'process' || player.type.toLowerCase().includes('process')) return 'manufacturing_process';
  if (player.type_code === 'product' || player.type.toLowerCase().includes('product')) return 'product';
  return 'company';
}

function defaultScores(entity: { country?: string; corridors?: string[]; kind: AtlasEntityKind }): AtlasScore[] {
  const domestic = entity.country === 'IN';
  const ecosystemBreadth = Math.min(entity.corridors?.length ?? 0, 5);
  const importDependency = domestic ? 2 : 4;
  const strategicImportance = Math.max(2, Math.min(5, ecosystemBreadth + (entity.kind === 'company' ? 1 : 2)));
  return [
    {
      key: 'industrialImportance',
      label: SCORE_LABELS.industrialImportance,
      value: Math.max(2, Math.min(5, ecosystemBreadth + 2)),
      rationale: 'Initial score derived from current Atlas ecosystem coverage.',
    },
    {
      key: 'strategicImportance',
      label: SCORE_LABELS.strategicImportance,
      value: strategicImportance,
      rationale: 'Initial score derived from relationship breadth and entity type.',
    },
    {
      key: 'importDependency',
      label: SCORE_LABELS.importDependency,
      value: importDependency,
      rationale: domestic ? 'Domestic entity; dependency must be resolved at component/process level.' : 'Foreign-origin entity in the current Atlas.',
    },
  ];
}

function playerToEntity(player: Player): AtlasGraphEntity {
  const slug = playerSlug(player.id);
  const kind = playerKind(player);
  const corridors = player.corridors ?? [];
  return {
    id: player.id,
    slug,
    kind,
    title: player.name,
    subtitle: player.type,
    summary: player.description || `${player.name} is tracked in the Techadyant Atlas.`,
    country: player.country,
    tags: [player.type, ...corridors.map((code) => corridorByCode(code)?.label ?? code)].filter(Boolean),
    corridors,
    scores: defaultScores({ country: player.country, corridors, kind }),
    sources: [],
    href: `/research/entities/${slug}/`,
    sourceSystem: 'sid',
    updatedAt: lastUpdated,
  };
}

function reportEntities(): AtlasGraphEntity[] {
  return reports
    .filter((r) => r.status === 'published')
    .map((r) => ({
      id: idFor('report', r.slug),
      slug: r.slug,
      kind: 'report' as const,
      title: r.title,
      subtitle: r.domain,
      summary: r.summary,
      tags: [r.domain, ...(r.keywords ?? [])].filter(Boolean),
      corridors: [],
      scores: [],
      sources: (r.sources ?? []).map((title) => ({ title, evidenceLevel: 'single_source' as const })),
      href: `/reports/${r.slug}/`,
      sourceSystem: 'site' as const,
      updatedAt: r.dateModified ?? r.published,
    }));
}

function signalEntities(): AtlasGraphEntity[] {
  return signals
    .filter((s) => s.status !== 'placeholder')
    .map((s) => ({
      id: idFor('signal', s.slug),
      slug: s.slug,
      kind: 'signal' as const,
      title: s.title,
      subtitle: s.domain,
      summary: s.excerpt,
      tags: [s.domain, s.status].filter(Boolean),
      corridors: [],
      scores: [],
      sources: (s.sources ?? []).map((title) => ({ title, evidenceLevel: 'single_source' as const })),
      href: `/signals/${s.slug}/`,
      sourceSystem: 'site' as const,
      updatedAt: s.date,
    }));
}

function curatedEntities(): AtlasGraphEntity[] {
  const ecosystems = atlas.corridors.map((c) => {
    const slug = kebab(c.label);
    return {
      id: idFor('ecosystem', slug),
      slug,
      kind: 'ecosystem' as const,
      title: c.label,
      subtitle: 'Industrial ecosystem',
      summary: `A strategic industrial ecosystem tracked in the Techadyant Atlas across value-chain layers, players and dependency assessments.`,
      tags: ['Industrial ecosystem', c.code],
      corridors: [c.code],
      scores: defaultScores({ corridors: [c.code], kind: 'ecosystem' }),
      sources: [],
      href: `/research/corridors/${slug}/`,
      sourceSystem: 'curated' as const,
      updatedAt: lastUpdated,
    };
  });

  const datasets: AtlasGraphEntity[] = [
    {
      id: idFor('dataset', 'india-industrial-dependency-grid'),
      slug: 'india-industrial-dependency-grid',
      kind: 'dataset',
      title: 'India Industrial Dependency Grid',
      subtitle: 'Dataset',
      summary: 'A static dataset of Atlas dependency assessments across strategic industrial ecosystems and value-chain layers.',
      tags: ['Dataset', 'Import dependency', 'Value chain'],
      corridors: atlas.corridors.map((c) => c.code),
      scores: [],
      sources: [],
      href: '/research/dependencies/',
      sourceSystem: 'curated',
      updatedAt: lastUpdated,
    },
  ];

  return [...ecosystems, ...datasets];
}

const playerEntities = allPlayers.map(playerToEntity);
const allEntities = [...playerEntities, ...reportEntities(), ...signalEntities(), ...curatedEntities(), ...curatedSeedEntities];

const playerIds = new Set(allPlayers.map((p) => p.id));

function relationKind(type: string): AtlasRelationshipKind {
  const known: AtlasRelationshipKind[] = [
    'supplies_to', 'depends_on', 'controls', 'invests_in', 'operates', 'located_in',
    'regulates', 'beneficiary_of', 'subsidiary_of', 'customer_of', 'competes_with',
    'partners_with', 'used_in', 'manufactures', 'enables', 'substitutes_for',
  ];
  return known.includes(type as AtlasRelationshipKind) ? type as AtlasRelationshipKind : 'depends_on';
}

function relationshipEdges(): AtlasGraphEdge[] {
  return atlas.relationships
    .filter((r) => playerIds.has(r.source_id) && playerIds.has(r.target_id))
    .map((r, index) => ({
      id: `sid-rel:${index}:${r.source_id}:${r.target_id}`,
      sourceId: r.source_id,
      targetId: r.target_id,
      kind: relationKind(r.type),
      label: r.type_label || r.type,
      summary: r.description,
      magnitude: r.magnitude,
      unit: r.unit,
      evidenceLevel: 'single_source',
    }));
}

export const atlasGraph: AtlasGraph = {
  generatedAt: lastUpdated,
  entities: allEntities.sort((a, b) => a.title.localeCompare(b.title)),
  edges: [...relationshipEdges(), ...curatedSeedEdges],
};

export const graphEntities = atlasGraph.entities;
export const graphEdges = atlasGraph.edges;

export function entityBySlug(slug: string): AtlasGraphEntity | undefined {
  return graphEntities.find((entity) => entity.slug === slug);
}

export function entitiesByKind(kind: AtlasEntityKind): AtlasGraphEntity[] {
  return graphEntities.filter((entity) => entity.kind === kind);
}

export function relatedEdges(entityId: string): AtlasGraphEdge[] {
  return graphEdges.filter((edge) => edge.sourceId === entityId || edge.targetId === entityId);
}

export function relatedEntities(entityId: string): AtlasGraphEntity[] {
  const ids = new Set(relatedEdges(entityId).map((edge) => edge.sourceId === entityId ? edge.targetId : edge.sourceId));
  return graphEntities.filter((entity) => ids.has(entity.id));
}

export function legacyPlayerRelationshipCount(entityId: string): number {
  return relationshipsFor(entityId).length;
}
