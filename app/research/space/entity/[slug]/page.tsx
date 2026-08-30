// ============================================================================
// Space entity dossier page
// Route: /research/space/entity/[slug]/
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
  return listStaticParamsForBase("/research/space/entity/");
}

export default async function Page({ params }: DossierPageProps) {
  const { slug } = await params;
  return renderDossierPage(slug);
}

