export type AtlasEntityKind =
  | 'company'
  | 'technology'
  | 'material'
  | 'product'
  | 'state'
  | 'industrial_corridor'
  | 'policy'
  | 'report'
  | 'signal'
  | 'dataset'
  | 'supply_chain'
  | 'ecosystem'
  | 'opportunity_surface'
  | 'manufacturing_process';

export type AtlasScoreKey =
  | 'industrialImportance'
  | 'strategicImportance'
  | 'localizationPotential'
  | 'importDependency'
  | 'technologyComplexity'
  | 'capitalIntensity'
  | 'commercialReadiness'
  | 'exportPotential';

export interface AtlasScore {
  key: AtlasScoreKey;
  label: string;
  value: number;
  rationale?: string;
}

export type AtlasEvidenceLevel = 'verified' | 'single_source' | 'modelled' | 'unverified';

export interface AtlasSourceRef {
  title: string;
  url?: string;
  publisher?: string;
  date?: string;
  evidenceLevel?: AtlasEvidenceLevel;
}

export interface AtlasKeyFact {
  label: string;
  value: string;
  sourceTitle?: string;
}

export interface AtlasMetric {
  label: string;
  value: string;
  unit?: string;
  date?: string;
  sourceTitle?: string;
}

export interface AtlasGraphEntity {
  id: string;
  slug: string;
  kind: AtlasEntityKind;
  title: string;
  subtitle?: string;
  summary: string;
  country?: string;
  tags: string[];
  corridors: string[];
  keyFacts?: AtlasKeyFact[];
  metrics?: AtlasMetric[];
  scores: AtlasScore[];
  sources: AtlasSourceRef[];
  href: string;
  sourceSystem: 'sid' | 'site' | 'curated';
  updatedAt?: string;
}

export type AtlasRelationshipKind =
  | 'supplies_to'
  | 'depends_on'
  | 'controls'
  | 'invests_in'
  | 'operates'
  | 'located_in'
  | 'regulates'
  | 'beneficiary_of'
  | 'subsidiary_of'
  | 'customer_of'
  | 'competes_with'
  | 'partners_with'
  | 'evidenced_by'
  | 'belongs_to'
  | 'used_in'
  | 'manufactures'
  | 'enables'
  | 'substitutes_for';

export interface AtlasGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  kind: AtlasRelationshipKind;
  label: string;
  summary?: string;
  magnitude?: number | null;
  unit?: string | null;
  evidenceLevel?: AtlasEvidenceLevel;
}

export interface AtlasGraph {
  generatedAt: string;
  entities: AtlasGraphEntity[];
  edges: AtlasGraphEdge[];
}
