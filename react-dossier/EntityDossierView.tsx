// ============================================================================
// EntityDossierView — top-level composer.
// Renders only sections allowed for the dossier's tier AND that have data.
// Empty data = hide section, no empty headings.
// ============================================================================

import type { EntityDossier, DossierSectionId } from "./types";
import { TIER_SECTIONS } from "./types";

import { HeaderSection } from "./sections/HeaderSection";
import { AtAGlanceSection } from "./sections/AtAGlanceSection";
import { WhatItIsSection } from "./sections/WhatItIsSection";
import { KillChainSection } from "./sections/KillChainSection";
import { DeploymentsSection } from "./sections/DeploymentsSection";
import { ImportDependenciesSection } from "./sections/ImportDependenciesSection";
import { IntelligenceAssessmentSection } from "./sections/IntelligenceAssessmentSection";
import { GraphSection } from "./sections/GraphSection";
import { TimelineSection } from "./sections/TimelineSection";
import { FAQSection } from "./sections/FAQSection";
import { OpenQuestionsSection } from "./sections/OpenQuestionsSection";
import { SourcesSection } from "./sections/SourcesSection";
import { CTASection } from "./sections/CTASection";

interface Props {
  dossier: EntityDossier;
}

function sectionHasData(
  dossier: EntityDossier,
  section: DossierSectionId
): boolean {
  switch (section) {
    case "header":
      return Boolean(dossier.header);
    case "at_a_glance":
      return (
        Boolean(dossier.at_a_glance) &&
        Object.keys(dossier.at_a_glance).length > 0
      );
    case "what_it_is":
      return Boolean(dossier.what_it_is) && dossier.what_it_is!.prose.length > 0;
    case "kill_chain_or_capability":
      return Boolean(dossier.kill_chain_or_capability);
    case "deployments_procurement":
      return Boolean(dossier.deployments_procurement);
    case "import_dependencies":
      return Boolean(dossier.import_dependencies);
    case "intelligence_assessment":
      return Boolean(dossier.intelligence_assessment);
    case "graph":
      return Boolean(dossier.graph);
    case "timeline":
      return Boolean(dossier.timeline) && dossier.timeline!.length > 0;
    case "faq":
      return Boolean(dossier.faq) && dossier.faq!.length > 0;
    case "open_questions":
      return (
        Boolean(dossier.open_questions) && dossier.open_questions!.length > 0
      );
    case "sources":
      return Boolean(dossier.sources) && dossier.sources.length > 0;
    case "cta":
      return Boolean(dossier.cta);
    default:
      return false;
  }
}

export function EntityDossierView({ dossier }: Props) {
  const allowed = TIER_SECTIONS[dossier.tier];

  return (
    <article
      className="ed-dossier wrap"
      data-entity-id={dossier.entity_id}
      data-tier={dossier.tier}
      data-vertical={dossier.vertical}
    >
      {allowed.map((section) => {
        if (!sectionHasData(dossier, section)) return null;

        switch (section) {
          case "header":
            return <HeaderSection key={section} dossier={dossier} />;
          case "at_a_glance":
            return (
              <AtAGlanceSection key={section} data={dossier.at_a_glance} />
            );
          case "what_it_is":
            return dossier.what_it_is ? (
              <WhatItIsSection
                key={section}
                data={dossier.what_it_is}
                sources={dossier.sources}
              />
            ) : null;
          case "kill_chain_or_capability":
            return dossier.kill_chain_or_capability ? (
              <KillChainSection
                key={section}
                data={dossier.kill_chain_or_capability}
                sources={dossier.sources}
              />
            ) : null;
          case "deployments_procurement":
            return dossier.deployments_procurement ? (
              <DeploymentsSection
                key={section}
                data={dossier.deployments_procurement}
                sources={dossier.sources}
              />
            ) : null;
          case "import_dependencies":
            return dossier.import_dependencies ? (
              <ImportDependenciesSection
                key={section}
                data={dossier.import_dependencies}
                sources={dossier.sources}
              />
            ) : null;
          case "intelligence_assessment":
            return dossier.intelligence_assessment ? (
              <IntelligenceAssessmentSection
                key={section}
                data={dossier.intelligence_assessment}
                sources={dossier.sources}
              />
            ) : null;
          case "graph":
            return dossier.graph ? (
              <GraphSection
                key={section}
                data={dossier.graph}
                parentHubPath={dossier.parent_hub_path}
              />
            ) : null;
          case "timeline":
            return dossier.timeline ? (
              <TimelineSection
                key={section}
                data={dossier.timeline}
                sources={dossier.sources}
              />
            ) : null;
          case "faq":
            return dossier.faq ? (
              <FAQSection
                key={section}
                data={dossier.faq}
                sources={dossier.sources}
              />
            ) : null;
          case "open_questions":
            return dossier.open_questions ? (
              <OpenQuestionsSection key={section} data={dossier.open_questions} />
            ) : null;
          case "sources":
            return <SourcesSection key={section} data={dossier.sources} />;
          case "cta":
            return dossier.cta ? (
              <CTASection key={section} data={dossier.cta} />
            ) : null;
          default:
            return null;
        }
      })}
    </article>
  );
}
