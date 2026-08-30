// ============================================================================
// Public exports — single import surface for the React dossier library.
// ============================================================================

export type {
  EntityDossier,
  EntityType,
  Tier,
  Vertical,
  Status,
  Severity,
  TrustTier,
  OperationalDomain,
  KillChainStageId,
  Header,
  AtAGlance,
  WhatItIs,
  KillChainOrCapability,
  KillChainStage,
  DeploymentRow,
  DeploymentsProcurement,
  ImportDependencyItem,
  ImportDependencies,
  IntelligenceDimension,
  IntelligenceAssessment,
  Graph,
  TimelineEntry,
  FAQEntry,
  Source,
  SEO,
  CTA,
  DossierSectionId,
} from "./types";

export {
  DOSSIER_SECTION_ORDER,
  TIER_SECTIONS,
  tierAllowsSection,
  seoTitleFor,
} from "./types";

export { EntityDossierView } from "./EntityDossierView";

export {
  robotsForTier,
  buildBreadcrumbs,
  buildJsonLdGraph,
  renderJsonLdScripts,
} from "./jsonLd";

export { HeaderSection } from "./sections/HeaderSection";
export { AtAGlanceSection } from "./sections/AtAGlanceSection";
export { WhatItIsSection } from "./sections/WhatItIsSection";
export { KillChainSection } from "./sections/KillChainSection";
export { DeploymentsSection } from "./sections/DeploymentsSection";
export { ImportDependenciesSection } from "./sections/ImportDependenciesSection";
export { IntelligenceAssessmentSection } from "./sections/IntelligenceAssessmentSection";
export { GraphSection } from "./sections/GraphSection";
export { TimelineSection } from "./sections/TimelineSection";
export { FAQSection } from "./sections/FAQSection";
export { OpenQuestionsSection } from "./sections/OpenQuestionsSection";
export { SourcesSection } from "./sections/SourcesSection";
export { CTASection } from "./sections/CTASection";
