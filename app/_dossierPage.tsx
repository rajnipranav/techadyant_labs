// ============================================================================
// Shared dossier page renderer — used by all route family page.tsx files.
// Returns Next.js generateMetadata + Page component factory.
// ============================================================================

import type { Metadata } from "next";
import { EntityDossierView, robotsForTier } from "../react-dossier";
import { loadDossier } from "../lib/loadDossier";
import { renderJsonLdScripts } from "../react-dossier/jsonLd";
import "../react-dossier/dossier.css";

export interface DossierPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateDossierMetadata(
  slug: string
): Promise<Metadata> {
  const { dossier } = loadDossier(slug);
  if (!dossier) {
    return {
      title: "Atlas — Techadyant",
      robots: { index: false, follow: true },
    };
  }

  const description =
    dossier.summary?.slice(0, 160) ||
    `${dossier.name} — ${dossier.domain} in India's strategic ecosystem.`;

  return {
    title: `${dossier.name} — ${dossier.domain}`,
    description,
    alternates: { canonical: dossier.seo?.canonical_path || `https://labs.techadyant.com/research/${dossier.vertical}/${dossier.slug}/` },
    robots: robotsForTier(dossier.tier),
    openGraph: {
      title: dossier.name,
      description,
      url: dossier.seo?.canonical_path || `https://labs.techadyant.com/research/${dossier.vertical}/${dossier.slug}/`,
      type: 'article',
      siteName: 'Techadyant Labs',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: dossier.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dossier.name,
      description,
      images: ['/og/default.png'],
    },
  };
}

export async function renderDossierPage(slug: string) {
  const { dossier } = loadDossier(slug);
  if (!dossier) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Not found' }) }} />
      </>
    );
  }

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

export function makeGenerateStaticParams(slugs: string[]) {
  return slugs.map((slug) => ({ slug }));
}