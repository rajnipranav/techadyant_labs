import type { Metadata } from "next";
import { EntityDossierView, robotsForTier } from "../react-dossier";
import { renderJsonLdScripts } from "../react-dossier/jsonLd";
import { loadCompanyDossier } from "../lib/companyDossier";
import "../react-dossier/dossier.css";

const SITE = "https://labs.techadyant.com";

export function companyDossierMetadata(slug: string, vertical: string): Metadata | null {
  const entry = loadCompanyDossier(slug, vertical);
  if (!entry) return null;

  const { dossier } = entry;
  const description = dossier.what_it_is?.prose?.slice(0, 160)
    || dossier.at_a_glance?.["Key India role"]?.slice(0, 160)
    || `${dossier.name} — India strategic ecosystem.`;
  const canonical = `${SITE}${entry.path}`;

  return {
    title: `${dossier.name} — dossier`,
    description,
    alternates: { canonical },
    robots: robotsForTier(dossier.tier),
    openGraph: {
      title: dossier.name,
      description,
      url: canonical,
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

export function renderCompanyDossierPage(slug: string, vertical: string) {
  const entry = loadCompanyDossier(slug, vertical);
  if (!entry) return null;

  const scripts = renderJsonLdScripts(entry.dossier);
  return (
    <>
      {scripts.map((script, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
      <EntityDossierView dossier={entry.dossier} />
    </>
  );
}
