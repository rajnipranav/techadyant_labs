// ============================================================================
// Military Aerospace entity dossier page
// Route: /research/military-aerospace/entity/[slug]/
// ============================================================================

import type { Metadata } from "next";
import {
  generateDossierMetadata,
  renderDossierPage,
  type DossierPageProps,
} from "../../../../_dossierPage";
import { listStaticParamsForBase } from "../../../../../lib/loadDossier";

export async function generateMetadata({
  params,
}: DossierPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateDossierMetadata(slug);
}

export async function generateStaticParams() {
  const dossierSlugs = listStaticParamsForBase("/research/military-aerospace/entity/");
  const thinSlugs = [
    { slug: "a400m" }
  ];
  const seen = new Set(dossierSlugs.map(s => s.slug));
  for (const s of thinSlugs) { if (!seen.has(s.slug)) dossierSlugs.push(s); }
  return dossierSlugs;
}

export default async function Page({ params }: DossierPageProps) {
  const { slug } = await params;
  return renderDossierPage(slug);
}

