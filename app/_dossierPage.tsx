// ============================================================================
// Shared dossier page renderer — used by route family page.tsx files.
// ============================================================================

import type { Metadata } from "next";
import { EntityDossierView, robotsForTier } from "../react-dossier";
import { loadDossier } from "../lib/loadDossier";
import { getThinRecordBySlug } from "../lib/thinRegistry";
import { ThinEntityPage } from "./_thinEntityPage";
import { renderJsonLdScripts } from "../react-dossier/jsonLd";
import "../react-dossier/dossier.css";

export interface DossierPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateDossierMetadata(
  slug: string
): Promise<Metadata> {
  const result = loadDossier(slug);
  const dossier = result?.dossier ?? null;
  if (!dossier) {
    const thin = getThinRecordBySlug(slug);
    if (thin) {
      return {
        title: `${thin.name} — ${thin.vertical}`,
        description: thin.summary,
        alternates: { canonical: `https://labs.techadyant.com${thin.path}` },
        robots: { index: false, follow: true },
      };
    }
    return {
      title: "Atlas — Techadyant",
      robots: { index: false, follow: true },
    };
  }

  const description =
    dossier.seo?.meta_description?.slice(0, 160) ||
    `${dossier.name} — India's strategic ecosystem.`;

  return {
    title: `${dossier.name} — India Atlas`,
    description,
    alternates: { canonical: dossier.seo?.canonical_path || `https://labs.techadyant.com/research/${dossier.vertical}/${dossier.slug}/` },
    robots: robotsForTier(dossier.tier),
    openGraph: {
      title: dossier.name,
      description,
      url: dossier.seo?.canonical_path || `https://labs.techadyant.com/research/${dossier.vertical}/${dossier.slug}/`,
      type: "article",
      siteName: "Techadyant Labs",
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: dossier.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: dossier.name,
      description,
      images: ["/og/default.png"],
    },
  };
}

export async function renderDossierPage(slug: string) {
  const result = loadDossier(slug);
  const dossier = result?.dossier ?? null;
  if (dossier) {
    const ld = renderJsonLdScripts(dossier);
    return (
      <>
        {ld.map((script, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ))}
        <EntityDossierView dossier={dossier} />
      </>
    );
  }
  // Thin-registry fallback
  const thin = getThinRecordBySlug(slug);
  if (thin) return <ThinEntityPage record={thin} />;
  // Ultimate safety net: return null (Next.js renders notFound only if
  // dynamicParams=false, which we removed)
  return null;
}

export function makeGenerateStaticParams(slugs: string[]) {
  return slugs.map((slug) => ({ slug }));
}
