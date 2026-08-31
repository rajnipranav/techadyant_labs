// ============================================================================
// Techadyant Atlas Entity Dossier — TypeScript types
// Matches schema/dossier.schema.json exactly.
// ============================================================================

export type EntityType =
  | "system"
  | "platform"
  | "manufacturer"
  | "company"
  | "programme";

export type Tier = "A" | "B" | "C";

export type Vertical =
  | "counter-uas"
  | "drones-uas"
  | "military-aerospace"
  | "space"
  | "defence";

export type Status =
  | "Operational"
  | "In trials"
  | "Ordered"
  | "Prototype"
  | "Development"
  | "Retired"
  | "Unknown";

export type Severity = "Critical" | "High" | "Medium" | "Low" | "Unknown";

export type TrustTier =
  | "official"
  | "credible"
  | "indicative"
  | "methodology";

export type OperationalDomain =
  | "land"
  | "naval"
  | "air"
  | "space"
  | "cyber"
  | "civilian";

export type KillChainStageId =
  | "detect"
  | "classify"
  | "track"
  | "decide"
  | "defeat"
  | "assess";

export interface Header {
  one_liner: string;
  chips: string[];
  maker?: string;
  country: string;
  indigenous_pct?: number | null;
  indigenous_label?: string;
  mobility_or_class?: string;
  operational_domains?: OperationalDomain[];
}

export interface AtAGlance {
  [key: string]: string;
}

export interface WhatItIs {
  prose: string;
  sources: string[];
}

export interface KillChainStage {
  id: KillChainStageId;
  label: string;
  covered: boolean;
  note?: string;
}

export interface KillChainOrCapability {
  stages: KillChainStage[];
  threat_or_target_classes: string[];
  sources: string[];
}

export interface DeploymentRow {
  agency: string;
  context: string;
  year?: number | string | null;
  quantity_or_note?: string;
  sources?: string[];
}

export interface DeploymentsProcurement {
  summary: string;
  rows: DeploymentRow[];
  open_questions?: string[];
}

export interface ImportDependencyItem {
  component: string;
  severity: Severity;
  note?: string;
  pillar_link?: string;
  sources?: string[];
}

export interface ImportDependencies {
  summary: string;
  items: ImportDependencyItem[];
}

export interface IntelligenceDimension {
  id: string;
  label: string;
  value: 0 | 1 | 2 | 3 | 4 | 5;
  note?: string;
  sources?: string[];
}

export interface IntelligenceAssessment {
  methodology_path: string;
  dimensions: IntelligenceDimension[];
}

export interface Graph {
  maker_other_systems?: string[];
  peer_systems?: string[];
  related_components?: string[];
  related_pillars?: string[];
  referenced_by?: string[];
}

export interface TimelineEntry {
  date: string;
  event: string;
  sources?: string[];
}

export interface FAQEntry {
  question: string;
  answer: string;
  sources?: string[];
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  published_date?: string | null;
  trust_tier: TrustTier;
  accessed: string;
  note?: string;
}

export interface SEO {
  title: string;
  meta_description: string;
  canonical_path: string;
  og_type: string;
  json_ld_types: string[];
}

export interface CTA {
  track_ecosystem?: string;
  submit_correction?: string;
  related_research?: Array<string | { label: string; path: string }>;
}

export interface EntityDossier {
  entity_id: string;
  entity_type: EntityType;
  tier: Tier;
  noindex: boolean;
  slug: string;
  name: string;
  variant?: string | null;
  vertical: Vertical;
  parent_hub_path: string;
  last_verified: string;
  status: Status;
  header: Header;
  at_a_glance: AtAGlance;
  what_it_is?: WhatItIs;
  kill_chain_or_capability?: KillChainOrCapability;
  deployments_procurement?: DeploymentsProcurement;
  import_dependencies?: ImportDependencies;
  intelligence_assessment?: IntelligenceAssessment;
  graph?: Graph;
  timeline?: TimelineEntry[];
  faq?: FAQEntry[];
  open_questions?: string[];
  sources: Source[];
  seo: SEO;
  cta?: CTA;
}

// ============================================================================
// Section ordering per tier
// ============================================================================

export const DOSSIER_SECTION_ORDER = [
  "header",
  "at_a_glance",
  "what_it_is",
  "kill_chain_or_capability",
  "deployments_procurement",
  "import_dependencies",
  "intelligence_assessment",
  "graph",
  "timeline",
  "faq",
  "open_questions",
  "sources",
  "cta",
] as const;

export type DossierSectionId =
  (typeof DOSSIER_SECTION_ORDER)[number];

export const TIER_SECTIONS: Record<Tier, readonly DossierSectionId[]> = {
  A: DOSSIER_SECTION_ORDER,
  B: [
    "header",
    "at_a_glance",
    "what_it_is",
    "deployments_procurement",
    "import_dependencies",
    "graph",
    "sources",
    "cta",
  ],
  C: ["header", "at_a_glance", "what_it_is", "sources", "cta"],
} as const;

// ============================================================================
// Helpers
// ============================================================================

export function tierAllowsSection(
  tier: Tier,
  section: DossierSectionId
): boolean {
  return TIER_SECTIONS[tier].includes(section);
}

export function seoTitleFor(
  name: string,
  entityType: EntityType,
  vertical: Vertical
): string {
  const entityLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);
  const verticalLabel = vertical
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `${name} — ${entityLabel} · India ${verticalLabel} Atlas | Techadyant`;
}
