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
  return listStaticParamsForBase("/research/military-aerospace/entity/");
}

export default async function Page({ params }: DossierPageProps) {
  const { slug } = await params;
  return renderDossierPage(slug);
}

