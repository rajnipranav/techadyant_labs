// Programme Intelligence — schema.
// Architecture: docs/logistics-programme-intelligence-audit.md
//
// A programme is ONE entity with two layers sharing an id:
//   • fact layer   — SID `logistics.programmes` (metrics, status, verification label, captured sources),
//                    baked to app/research/_logistics.json; referenced here by `logistics_id`.
//   • intel layer  — data/programme-intelligence/programmes.json (this schema): the Techadyant reading.
// Graph edges live on the evidenced entity, not on the programme: projects carry `programme_links`,
// opportunity surfaces `programme_ids`, signal links `related_programmes`. A programme's projects,
// infrastructure, industrial nodes, opportunities, signals and reports are DERIVED at build time.
// Every claim cites the shared src: registry (data/industrial-intelligence/sources.json).
// This file must stay free of runtime imports so scripts can load it with Node type-stripping.
import type { Confidence, EvidenceClass, ProvenanceRef } from '../industrial/types';

/** Implementation stage — the "announced vs built" ladder. */
export type ProgrammeStage = 'announced' | 'approved' | 'under_implementation' | 'completed' | 'operational';
export const STAGE_LABEL: Record<ProgrammeStage, string> = {
  announced: 'Announced',
  approved: 'Approved',
  under_implementation: 'Under implementation',
  completed: 'Completed',
  operational: 'Operational',
};
export const STAGE_ORDER: ProgrammeStage[] = ['announced', 'approved', 'under_implementation', 'completed', 'operational'];

export type ProgrammeCategory =
  | 'integration_layer'      // Gati Shakti
  | 'road_corridors'         // Bharatmala
  | 'port_led_development'   // Sagarmala
  | 'rail_freight'           // DFC
  | 'industrial_corridors'   // NICDP
  | 'digital_logistics'      // ULIP
  | 'policy'
  | 'aviation';

/** How one claim is held: sourced fact, or Techadyant analysis (which may still cite context). */
export interface Claim {
  text: string;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}

export interface GlanceFact {
  label: string;
  value: string;
  as_of: string | null;
  provenance: ProvenanceRef[];
}

/** One rung of the status ledger: what was announced/approved vs what is built, with a date. */
export interface LedgerEntry {
  stage: ProgrammeStage;
  label: string;
  value: string;
  as_of: string | null;
  provenance: ProvenanceRef[];
}

export interface ProgrammeComponent {
  key: string;
  name: string;
  description: string;
  /** Sourced scale (e.g. "~9,000 km · ₹1.2 lakh cr approved") — null when not sourced. */
  scale: string | null;
  stage: ProgrammeStage | null;
  progress: string | null;          // sourced progress line, dated in-text
  provenance: ProvenanceRef[];
}

export interface TimelineEntry { date: string; label: string; provenance: ProvenanceRef[] }

export type ConsequenceDimension = 'manufacturing' | 'logistics' | 'trade' | 'regional' | 'supply_chains' | 'technology';
export const DIMENSION_LABEL: Record<ConsequenceDimension, string> = {
  manufacturing: 'Manufacturing',
  logistics: 'Logistics',
  trade: 'Trade',
  regional: 'Regional development',
  supply_chains: 'Supply chains',
  technology: 'Technology',
};

export interface Consequence {
  dimension: ConsequenceDimension;
  headline: string;
  claims: Claim[];
}

export interface SupplyChainStep {
  stage: 'input' | 'manufacturing_node' | 'freight_network' | 'logistics_node' | 'gateway' | 'market';
  text: string;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}
export const SUPPLY_STAGE_LABEL: Record<SupplyChainStep['stage'], string> = {
  input: 'Input',
  manufacturing_node: 'Manufacturing node',
  freight_network: 'Freight network',
  logistics_node: 'Logistics node',
  gateway: 'Port / airport',
  market: 'Market',
};

export type ProgrammeRelation = 'coordinates' | 'coordinated_by' | 'complements' | 'shares_corridor' | 'feeds';
export const RELATION_LABEL: Record<ProgrammeRelation, string> = {
  coordinates: 'plans and evaluates projects of',
  coordinated_by: 'planned through',
  complements: 'complements',
  shares_corridor: 'shares corridors with',
  feeds: 'feeds traffic to',
};
export interface RelatedProgramme {
  /** SID logistics id of the other programme (it may not have an intel page yet). */
  logistics_id: string;
  relation: ProgrammeRelation;
  note: string;
  evidence: EvidenceClass;
  provenance: ProvenanceRef[];
}

/** Build-time matching rules. Patterns are case-insensitive regex sources matched against
 *  title + excerpt + body (signals) or title + subtitle + summary + keywords (reports).
 *  Hand-curated SIGNAL links go in data/industrial-intelligence/signal-links.json
 *  (`related_programmes`), so every signal → entity link lives in one side-map;
 *  `include` is used for reports only. */
export interface MatchRule {
  patterns: string[];
  include: { slug: string; reason: string }[];
  exclude: string[];
}

export interface ProgrammeIntel {
  id: string;                       // prog:<slug>
  logistics_id: string;             // FK → SID logistics.programmes.id
  slug: string;
  name: string;
  short_name: string;
  role: 'cross_cutting' | 'programme';
  category: ProgrammeCategory;
  lead_ministry: string;
  /** One-line analytical angle — the hero subtitle. */
  angle: string;
  /** The question Techadyant asks of this programme. */
  question: string;
  stage: ProgrammeStage;
  stage_note: string;
  launch: { date: string; label: string; provenance: ProvenanceRef[] };
  time_horizon: { text: string; provenance: ProvenanceRef[] };
  geography: string;
  sectors: string[];                // free labels; sector:<code> where an Atlas sector exists
  infrastructure_types: string[];
  glance: GlanceFact[];
  ledger: LedgerEntry[];
  why_it_matters: Claim[];
  components: ProgrammeComponent[];
  timeline: TimelineEntry[];
  gaps: { title: string; detail: string; evidence: EvidenceClass; provenance: ProvenanceRef[] }[];
  consequences: Consequence[];
  supply_chain: SupplyChainStep[];
  related_programmes: RelatedProgramme[];
  /** Industrial-corridor refs (/corridors/<slug>/) with the evidence for the link. */
  corridor_refs: { corridor: string; note: string; provenance: ProvenanceRef[] }[];
  signal_match: MatchRule;
  report_match: MatchRule;
  data_gaps: string[];
  last_verified: string;
  data_as_of: string;
}

/** Edge on a project (infrastructure-projects.json) → programme. */
export type ProgrammeLinkType = 'built_under' | 'funded_under' | 'planned_on' | 'operated_under';
export const LINK_LABEL: Record<ProgrammeLinkType, string> = {
  built_under: 'built under',
  funded_under: 'funded under',
  planned_on: 'planned on',
  operated_under: 'part of',
};
export interface ProgrammeLink {
  programme_id: string;             // SID logistics id
  type: ProgrammeLinkType;
  provenance: ProvenanceRef[];
}

/** Opportunity confidence wording on programme pages (brief: High / Medium / Emerging). */
export const OPP_CONFIDENCE_LABEL: Record<Confidence, string> = { high: 'High', medium: 'Medium', low: 'Emerging' };

/** Programmes on the roadmap (no intel page yet) — shown as cards with SID facts only. */
export interface RoadmapProgramme {
  logistics_id: string | null;
  slug: string;
  name: string;
  angle: string;
  phase: number;
  /** Existing Atlas surface that already covers it (e.g. /corridors/ for NICDP). */
  href?: string;
}

export interface ProgrammeFile { version: string; note: string; roadmap: RoadmapProgramme[]; programmes: ProgrammeIntel[] }
