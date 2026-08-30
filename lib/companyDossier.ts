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
  return vertical
    ? entries.find((entry) => entry.vertical === vertical) ?? null
    : entries[0] ?? null;
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
