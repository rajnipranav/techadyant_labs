// ============================================================================
// jsonLd.tsx — JSON-LD structured data generators for Entity Dossiers
// Generates: WebPage + (Product | Organization) + FAQPage + BreadcrumbList
// Plus: robots policy per tier.
// ============================================================================

import type { EntityDossier, Tier } from "./types";

export interface RobotsPolicy {
  index: boolean;
  follow: boolean;
  header: string;
  meta: string;
}

export function robotsForTier(tier: Tier, noindexOverride?: boolean): RobotsPolicy {
  const noindex = noindexOverride ?? (tier === "C");
  return {
    index: !noindex,
    follow: true,
    header: noindex ? "noindex, follow" : "index, follow",
    meta: noindex ? "noindex, follow" : "index, follow",
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbs(dossier: EntityDossier): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Techadyant", path: "/" },
    { name: "Research", path: "/research" },
  ];

  const verticalLabels: Record<string, string> = {
    "counter-uas": "Counter-UAS",
    "drones-uas": "Drones & UAS",
    "military-aerospace": "Military Aerospace",
    space: "Space",
    defence: "Defence",
  };

  // Strip trailing slash from parent_hub_path
  const hubPath = dossier.parent_hub_path.replace(/\/$/, "");
  items.push({
    name: verticalLabels[dossier.vertical] || "Atlas",
    path: hubPath,
  });

  // Add sub-category if path implies it
  if (hubPath.includes("/system/")) {
    items.push({ name: "Systems", path: `${hubPath}` });
  } else if (hubPath.includes("/manufacturer/")) {
    items.push({ name: "Manufacturers", path: `${hubPath}` });
  } else if (hubPath.includes("/entity/")) {
    items.push({ name: "Entities", path: `${hubPath}` });
  }

  items.push({ name: dossier.name, path: dossier.seo.canonical_path });

  return items;
}

export function breadcrumbJsonLd(dossier: EntityDossier) {
  const items = buildBreadcrumbs(dossier);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `https://labs.techadyant.com${item.path}`,
    })),
  };
}

export function webPageJsonLd(dossier: EntityDossier) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: dossier.seo.title,
    description: dossier.seo.meta_description,
    url: `https://labs.techadyant.com${dossier.seo.canonical_path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Techadyant Atlas",
      url: "https://labs.techadyant.com",
    },
    dateModified: dossier.last_verified,
    about: {
      "@type": "Thing",
      name: dossier.name,
    },
  };
}

export function productJsonLd(dossier: EntityDossier) {
  if (
    dossier.entity_type !== "system" &&
    dossier.entity_type !== "platform"
  ) {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dossier.name,
    category: dossier.vertical,
    manufacturer: dossier.header.maker
      ? { "@type": "Organization", name: dossier.header.maker }
      : undefined,
    brand: dossier.header.maker
      ? { "@type": "Brand", name: dossier.header.maker }
      : undefined,
    description: dossier.header.one_liner,
  };
}

export function organizationJsonLd(dossier: EntityDossier) {
  if (
    dossier.entity_type !== "manufacturer" &&
    dossier.entity_type !== "company"
  ) {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dossier.name,
    url: `https://labs.techadyant.com${dossier.seo.canonical_path}`,
    description: dossier.header.one_liner,
    address: {
      "@type": "PostalAddress",
      addressCountry: dossier.header.country,
    },
  };
}

export function faqJsonLd(dossier: EntityDossier) {
  if (!dossier.faq || dossier.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dossier.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export interface JsonLdGraph {
  webPage: object;
  product: object | null;
  organization: object | null;
  faq: object | null;
  breadcrumb: object;
}

export function buildJsonLdGraph(dossier: EntityDossier): JsonLdGraph {
  return {
    webPage: webPageJsonLd(dossier),
    product: productJsonLd(dossier),
    organization: organizationJsonLd(dossier),
    faq: faqJsonLd(dossier),
    breadcrumb: breadcrumbJsonLd(dossier),
  };
}

export function renderJsonLdScripts(dossier: EntityDossier): string[] {
  const graph = buildJsonLdGraph(dossier);
  const blocks: object[] = [graph.webPage, graph.breadcrumb];
  if (graph.product) blocks.push(graph.product);
  if (graph.organization) blocks.push(graph.organization);
  if (graph.faq) blocks.push(graph.faq);

  return blocks.map(
    (b) =>
      `<script type="application/ld+json">${JSON.stringify(b)}</script>`
  );
}
