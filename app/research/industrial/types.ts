// Industrial Intelligence & Connectivity Layer — schema.
// Architecture: docs/industrial-intelligence-integration.md
// Scores:       docs/industrial-connectivity-methodology.md
//
// Data lives in data/industrial-intelligence/*.json (static, version-controlled, SID-shaped).
// IDs: inode:<slug> · infra:<slug> · proj:<slug> · opp:<slug>; external refs player:<sid-uuid>,
// corridor-node:<corridor>/<node>, sector:<atlas code>, report:<slug>, signal:<slug>.
// This file must stay free of runtime imports so scripts can load it with Node type-stripping.

/* ------------------------------------------------------------------ provenance */

export type Confidence = 'high' | 'medium' | 'low';
export type SourceType =
  | 'government' | 'government_agency' | 'state_government' | 'psu' | 'multilateral'
  | 'company' | 'trade_press' | 'reference' | 'techadyant';

/** Registry entry (sources.json). Every factual claim points at one or more of these. */
export interface SourceRecord {
  id: string;                       // src:<slug>
  source_name: string;
  publisher: string;
  source_url: string;
  source_type: SourceType;
  publication_date: string | null;  // ISO date or YYYY-MM; null if undated
  accessed_date: string;            // ISO date
  confidence: Confidence;
  /** Data-governance fields — required for programme / platform sources. */
  access?: {
    model: 'open_web' | 'self_registration' | 'nda_gated' | 'restricted' | 'unknown';
    api: 'none' | 'public' | 'registered' | 'unknown';
    download: 'none' | 'public' | 'registered' | 'unknown';
    licence: string | null;         // stated licence/terms, or null if none published
    redistribution: 'permitted' | 'not_permitted' | 'not_stated';
    techadyant_use: string;         // what we do (and don't do) with it
  };
  notes?: string;
  /** Registry/governance context only — not expected to back a specific claim. */
  context_only?: boolean;
}

/** Per-claim reference into the registry. */
export interface ProvenanceRef {
  source_id: string;
  notes?: string;
}

/** Expanded provenance object (what the UI and exports receive). */
export interface Provenance {
  source_id: string;
  source_name: string;
  source_url: string;
  source_type: SourceType;
  publication_date: string | null;
  accessed_date: string;
  confidence: Confidence;
  notes: string;
}

/** FACT = sourced; DERIVED = computed from sourced inputs; ANALYSIS = Techadyant judgement. */
export type EvidenceClass = 'fact' | 'derived' | 'analysis';

export interface Fact {
  label: string;
  value: string;
  as_of: string | null;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}

/* ------------------------------------------------------------------ geometry */

export type CoordSource = 'verified' | 'gis' | 'gazetteer' | 'approximate';
export interface Coordinates {
  lat: number | null;
  lng: number | null;
  coord_source: CoordSource | null;
  confidence: Confidence | null;
  note?: string;
}

/* ------------------------------------------------------------------ entities */

export type IndustrialNodeType =
  | 'industrial_cluster' | 'industrial_park' | 'economic_zone' | 'manufacturing_hub'
  | 'industrial_corridor_node' | 'defence_corridor_node' | 'electronics_cluster' | 'semiconductor_cluster';

export type RequirementProfile = 'semiconductor_fab' | 'semiconductor_backend' | 'electronics_assembly';

export interface ConnectivityRef {
  infra_id: string;        // infra:<slug>
  relation_id: string;     // rel:<id> that justifies it
}
/** Standardised connectivity object. Populated by the loader from relationships.json. */
export interface Connectivity {
  road: ConnectivityRef[];
  rail: ConnectivityRef[];
  ports: ConnectivityRef[];
  airports: ConnectivityRef[];
  waterways: ConnectivityRef[];
  logistics_nodes: ConnectivityRef[];
  freight_corridors: ConnectivityRef[];
}

export interface ScoreComponentInput {
  key: string;                       // component key from scoring.ts
  value: number | null;              // 0..1, null = unknown (missing)
  confidence: Confidence | null;
  rationale: string;
  relation_ids?: string[];           // rel:<id> evidence
  provenance?: ProvenanceRef[];
  /** If set, the loader derives `value` from a straight-line distance band instead. */
  derive?: { kind: 'distance_band'; target: string };
}

export interface RequirementAssessment {
  key: string;                       // requirement key from scoring.ts
  status: 'met' | 'partial' | 'gap' | 'unknown';
  confidence: Confidence | null;
  rationale: string;
  provenance?: ProvenanceRef[];
  relation_ids?: string[];
}

export interface DependencyNote {
  title: string;
  detail: string;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}

/** A company/facility present at a node. SID sometimes holds duplicate records for one entity:
 *  all are listed in player_ids; primary_player_id is the best-connected record (used for the link). */
export interface NodeCompany {
  name: string;
  role: string;                      // e.g. 'Fab (anchor)', 'OSAT', 'Materials supplier (MoU)'
  status: string;                    // sourced status line
  player_ids: string[];
  primary_player_id: string | null;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}

export interface IndustrialNode {
  id: string;                        // inode:<slug>
  slug: string;
  name: string;
  short_name: string;
  type: IndustrialNodeType;
  state: string;
  district: string | null;
  coordinates: Coordinates;
  sectors: string[];                 // sector:<atlas code> + free labels
  requirement_profile: RequirementProfile;
  headline: string;                  // one-line Techadyant framing (ANALYSIS)
  strategic_overview: string[];      // ANALYSIS paragraphs
  facts: Fact[];
  companies: NodeCompany[];          // links to Atlas players (SID IDs) — never copies them
  corridor_node_refs: string[];      // corridor-node:<corridor>/<node>
  supply_chain_position: { upstream: string[]; node: string; logistics: string[]; gateways: string[]; markets: string[] };
  strategic_dependencies: DependencyNote[];
  ics_inputs: ScoreComponentInput[];
  cgi_inputs: RequirementAssessment[];
  related_reports: string[];         // report slugs
  data_gaps: string[];               // what we could not source — shown on page
  last_verified: string;
  data_as_of: string;
}

export type InfraType =
  | 'expressway' | 'national_highway' | 'state_highway' | 'railway_line' | 'railway_station'
  | 'freight_corridor' | 'dfc_station' | 'seaport' | 'airport' | 'inland_waterway' | 'river_terminal'
  | 'mmlp' | 'mmlh' | 'icd' | 'cfs' | 'freight_terminal' | 'logistics_cluster' | 'power';

export type InfraStatus = 'operational' | 'partially_operational' | 'trial' | 'under_construction' | 'approved' | 'planned' | 'unknown';

export interface InfrastructureNode {
  id: string;                        // infra:<slug>
  name: string;
  type: InfraType;
  status: InfraStatus;
  operator: string | null;
  state: string | null;
  coordinates: Coordinates;
  /** e.g. 'major_port' | 'non_major_port' | 'international' — only when sourced. */
  classification: string | null;
  cargo_handling: boolean | null;
  facts: Fact[];
  provenance: ProvenanceRef[];
  last_verified: string;
}

export type ProjectStatus = 'approved' | 'under_construction' | 'trial' | 'partially_operational' | 'operational' | 'announced' | 'unknown';

export interface InfrastructureProject {
  id: string;                        // proj:<slug>
  name: string;
  sector: 'road' | 'rail' | 'freight_rail' | 'aviation' | 'port' | 'waterway' | 'logistics' | 'power' | 'multimodal';
  project_type: string;
  states: string[];
  districts: string[];
  implementing_agency: string | null;
  estimated_cost_cr: number | null;
  cost_note: string | null;          // what the cost covers (e.g. "aggregate for three sections")
  status: ProjectStatus;
  status_note: string;
  approval_date: string | null;
  expected_completion: string | null;
  corridor: string | null;
  infra_ids: string[];               // infra nodes this project creates/upgrades
  affected_node_ids: string[];       // inode:<slug>
  affected_sectors: string[];
  strategic_significance: string;    // ANALYSIS — the "project → industrial consequence" line
  itla_appraisal_tier: boolean | null; // ≥ ₹500 cr GoI project; null when cost unknown
  /** Programme Intelligence edges (typed, evidenced) — see app/research/programmes/types.ts. */
  programme_links?: { programme_id: string; type: 'built_under' | 'funded_under' | 'planned_on' | 'operated_under'; provenance: ProvenanceRef[] }[];
  facts: Fact[];
  provenance: ProvenanceRef[];
  last_verified: string;
}

export type OpportunityType =
  | 'supplier_localisation' | 'component_manufacturing' | 'logistics_service'
  | 'specialised_infrastructure' | 'shared_services' | 'skills_capacity';

export interface ChainStep {
  stage: 'infrastructure_change' | 'connectivity_effect' | 'industrial_impact' | 'supply_chain_effect' | 'strategic_dependency' | 'opportunity';
  text: string;
  evidence: EvidenceClass;
  provenance?: ProvenanceRef[];
}

export interface OpportunitySurface {
  id: string;                        // opp:<slug>
  title: string;
  location: string;
  node_ids: string[];
  /** SID logistics programme ids this surface is triggered by (Programme Intelligence). */
  programme_ids?: string[];
  sectors: string[];
  triggering_development: { text: string; project_ids: string[]; provenance: ProvenanceRef[] };
  chain: ChainStep[];
  opportunity_type: OpportunityType;
  horizon: 'near' | 'medium' | 'long';
  confidence: Confidence;
  constraints: string[];
  strategic_rationale: string;
  relevant_player_ids: string[];
  relevant_project_ids: string[];
  affected_supply_chains: string[];
  provenance: ProvenanceRef[];
  last_verified: string;
}

/* ------------------------------------------------------------------ relationships */

export const RELATIONSHIP_TYPES = {
  located_in:                { label: 'located in',                     inverse: 'hosts' },
  anchors:                   { label: 'anchors',                        inverse: 'anchored by' },
  overlaps_with:             { label: 'overlaps with',                  inverse: 'overlaps with' },
  specialises_in:            { label: 'specialises in',                 inverse: 'specialisation of' },
  connected_by:              { label: 'connected by road via',          inverse: 'connects (road)' },
  served_by:                 { label: 'served by rail via',             inverse: 'serves (rail)' },
  on_freight_corridor:       { label: 'linked to freight corridor',     inverse: 'freight corridor for' },
  nearest_port:              { label: 'gateway port',                   inverse: 'gateway port for' },
  nearest_airport:           { label: 'cargo airport',                  inverse: 'cargo airport for' },
  connected_to:              { label: 'connected to logistics node',    inverse: 'logistics node for' },
  improves_connectivity_of:  { label: 'improves connectivity of',       inverse: 'connectivity improved by' },
  affects:                   { label: 'affects',                        inverse: 'affected by' },
  creates:                   { label: 'creates conditions for',         inverse: 'triggered by' },
  potentially_benefits_from: { label: 'could benefit from',             inverse: 'could benefit' },
  depends_on:                { label: 'depends on',                     inverse: 'depended on by' },
  part_of:                   { label: 'part of',                        inverse: 'includes' },
} as const;
export type RelationshipType = keyof typeof RELATIONSHIP_TYPES;

export interface Relationship {
  id: string;                        // rel:<slug>
  source: string;                    // any entity/ref ID
  target: string;
  type: RelationshipType;
  evidence: EvidenceClass;
  confidence: Confidence;
  note: string;
  /** Sourced road/rail distance; straight-line is always computed, never stored. */
  sourced_distance?: { km: number; kind: 'road' | 'rail'; provenance: ProvenanceRef[] };
  provenance: ProvenanceRef[];
}

/* ------------------------------------------------------------------ supplier map (SCCS) */

export interface SupplierFacility {
  name: string;
  facility: string;
  status: string;
  player_id?: string;
  provenance: ProvenanceRef[];
}
export interface SupplierAssessment {
  node_id: string;
  category: string;
  status: 'operational_local' | 'operational_regional' | 'planned_local' | 'none_documented';
  confidence: Confidence;
  suppliers: SupplierFacility[];
  note: string;
  provenance?: ProvenanceRef[];
}
export interface SupplierMap {
  version: string;
  searched_on: string;
  note: string;
  categories: Record<RequirementProfile, { key: string; label: string }[]>;
  assessments: SupplierAssessment[];
}

/* ------------------------------------------------------------------ signals */

export interface SignalLink {
  signal_slug: string;
  related_industrial_nodes: string[];
  related_projects: string[];
  related_entities: string[];        // player:<uuid> etc.
  related_sectors: string[];
  opportunity_surfaces: string[];
  /** SID logistics programme ids (Programme Intelligence) — hand-reviewed, like every field here. */
  related_programmes?: string[];
  note: string;
}

/* ------------------------------------------------------------------ ITLA placeholder */

export interface TransportDatasetClass {
  key: string;                       // e.g. 'eway_bill'
  label: string;
  stated_in: ProvenanceRef[];        // where the Govt said ITLA would use it
  availability: 'not_available' | 'announced' | 'available';
  access: 'unknown' | 'open' | 'registered' | 'restricted';
  planned_use: string;               // how the Atlas would use it IF released
}
export interface ItlaRecord {
  institution: { name: string; form: string; approved_on: string; provenance: ProvenanceRef[] };
  stated_mandate: string[];
  dataset_classes: TransportDatasetClass[];
  integration_points: string[];
  last_verified: string;
}

/* ------------------------------------------------------------------ SME placeholder */

export type SmeClassification = 'potential_strategic_sme' | 'scale_up_relevance' | 'manufacturing_ecosystem_relevance';
export interface SmeChampion {
  id: string;                        // sme:<slug>
  company: string;
  sector: string;
  location: string;
  node_id: string | null;
  products: string[];
  supply_chain_role: string;
  classifications: SmeClassification[];
  classification_basis: 'techadyant_analysis';
  sgf_status: 'not_documented' | 'officially_documented';
  sgf_provenance: ProvenanceRef[];   // required when officially_documented
  connectivity_context: string | null;
  provenance: ProvenanceRef[];
  last_verified: string;
}

/* ------------------------------------------------------------------ scores */

export type ScoreKey = 'ics' | 'sccs' | 'cgi' | 'ios' | 'sns';
export interface ScoreComponentResult {
  key: string;
  label: string;
  weight: number;
  value: number | null;
  confidence: Confidence | null;
  rationale: string;
  derived_km?: number | null;
}
export interface ScoreResult {
  key: ScoreKey;
  label: string;
  status: 'computed' | 'insufficient_data';
  score: number | null;              // 0..100, rounded to 5
  band: string | null;
  confidence: Confidence | null;
  data_completeness: number;         // 0..1
  methodology_version: string;
  components: ScoreComponentResult[];
  note: string;
}
