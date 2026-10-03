import type { EntityDossier } from "../react-dossier/types";
import { COMPANY_DOSSIER_MAP, type CompanyDossierMapEntry } from "./companyDossierMap";

/**
 * Returns a public company/manufacturer dossier only when its manifest entry is
 * approved for the Tier A/B soft launch. Tier C is absent from the generated map.
 */
export function loadCompanyDossier(
  slug: string,
  vertical?: string,
): CompanyDossierMapEntry | null {
  const entries = COMPANY_DOSSIER_MAP[slug];
  if (!entries) return null;
  const entry = vertical
    ? entries.find((entry) => entry.vertical === vertical) ?? null
    : entries[0] ?? null;
  if (!entry) return null;
  // Older military-company manifests used /military-aerospace/<slug>/,
  // but the public route is /military-aerospace/company/<slug>/.
  // Resolve metadata and structured data together without editing generated maps.
  const legacyMilitaryCompany = entry.vertical === "military-aerospace"
    && !entry.isPointer
    && ["company", "manufacturer"].includes(entry.dossier.entity_type)
    && /^\/research\/military-aerospace\/[^/]+\/$/.test(entry.path);
  const canonicalPath = legacyMilitaryCompany
    ? `/research/military-aerospace/company/${slug}/`
    : entry.path;
  const dossier = normaliseDossier(entry.dossier);
  if (legacyMilitaryCompany) {
    dossier.seo = { ...dossier.seo, canonical_path: canonicalPath };
    dossier.header = { ...dossier.header, entity_path: canonicalPath };
    if (dossier.parent_hub_path === entry.path) {
      dossier.parent_hub_path = "/research/military-aerospace/";
    }
    dossier.cta = {
      ...dossier.cta,
      track_ecosystem: "/research/military-aerospace/",
    };
  }
  return {
    ...entry,
    path: canonicalPath,
    dossier,
  };
}

export function loadCompanyDossierData(
  slug: string,
  vertical?: string,
): EntityDossier | null {
  return loadCompanyDossier(slug, vertical)?.dossier ?? null;
}

export function listCompanyDossierSlugs(vertical?: string): string[] {
  return Object.entries(COMPANY_DOSSIER_MAP)
    .filter(([, entries]) => !vertical || entries.some((entry) => entry.vertical === vertical))
    .map(([slug]) => slug);
}

function normaliseDossier(dossier: any): any {
  if (!dossier) return dossier;
  const out = { ...dossier };

  out.header = {
    ...(out.header || {}),
    chips: Array.isArray(out.header?.chips) ? out.header.chips : [],
    operational_domains: Array.isArray(out.header?.operational_domains)
      ? out.header.operational_domains
      : [],
  };

  if (typeof out.intelligence_assessment === "string") {
    out.intelligence_assessment = {
      methodology_path: "/research/methodology/",
      dimensions: [],
      raw: out.intelligence_assessment,
    };
  }

  if (typeof out.what_it_is === "string") {
    out.what_it_is = {
      prose: out.what_it_is,
      sources: [],
    };
  }

  const atAGlance = out.at_a_glance || {};
  out.at_a_glance = {
    ...atAGlance,
    indicators: Array.isArray(atAGlance.indicators) ? atAGlance.indicators : [],
    key_specs: Array.isArray(atAGlance.key_specs) ? atAGlance.key_specs : [],
  };
  delete (out.at_a_glance as any).atlas_legacy_record;

  const graph = out.graph || {};
  out.graph = {
    ...graph,
    maker_other_systems: Array.isArray(graph.maker_other_systems)
      ? graph.maker_other_systems
      : [],
    peer_systems: Array.isArray(graph.peer_systems) ? graph.peer_systems : [],
    related_components: Array.isArray(graph.related_components)
      ? graph.related_components
      : [],
    related_pillars: Array.isArray(graph.related_pillars) ? graph.related_pillars : [],
    referenced_by: Array.isArray(graph.referenced_by) ? graph.referenced_by : [],
  };

  out.sites = Array.isArray(out.sites) ? out.sites : [];

  return out;
}
