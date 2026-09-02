import type { Metadata } from "next";
import { EntityDossierView, robotsForTier } from "../react-dossier";
import { renderJsonLdScripts } from "../react-dossier/jsonLd";
import { loadCompanyDossier } from "../lib/companyDossier";
import { getThinRecordBySlug } from "../lib/thinRegistry";
import Link from "next/link";
import "../react-dossier/dossier.css";

const SITE = "https://labs.techadyant.com";

function buildBreadcrumb(vertical: string, name: string, hubPath: string) {
  const hubLabel =
    hubPath.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") ||
    vertical;
  return (
    <div className="ed-breadcrumb">
      <Link href="/">Home</Link>
      <span className="sep">/</span>
      <Link href="/research/">The Atlas</Link>
      <span className="sep">/</span>
      <Link href={hubPath}>{hubLabel}</Link>
      <span className="sep">/</span>
      <span className="ed-breadcrumb-current">{name}</span>
    </div>
  );
}

export function companyDossierMetadata(
  slug: string,
  vertical: string
): Metadata | null {
  const entry = loadCompanyDossier(slug, vertical);
  if (entry) {
    const { dossier } = entry;
    const prose = dossier.what_it_is?.prose;
    const keyRole = dossier.at_a_glance?.["Key India role"];
    const description =
      prose?.slice(0, 160) ||
      keyRole?.slice(0, 160) ||
      `${dossier.name} — ${dossier.vertical} in India's strategic ecosystem.`;
    const canonical = `${SITE}${entry.path}`;

    return {
      title: `${dossier.name} — ${dossier.vertical}`,
      description,
      alternates: { canonical },
      robots: robotsForTier(dossier.tier),
      openGraph: {
        title: dossier.name,
        description,
        url: canonical,
        type: "article",
        siteName: "Techadyant Labs",
        images: [
          { url: "/og/default.png", width: 1200, height: 630, alt: dossier.name },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: dossier.name,
        description,
        images: ["/og/default.png"],
      },
    };
  }

  const thin = getThinRecordBySlug(slug);
  if (thin) {
    return {
      title: `${thin.name} — ${thin.vertical}`,
      description: thin.summary,
      alternates: { canonical: `${SITE}${thin.path}` },
      robots: { index: false, follow: true },
    };
  }

  return null;
}

export function renderCompanyDossierPage(slug: string, vertical: string) {
  const entry = loadCompanyDossier(slug, vertical);
  if (entry) {
    return (
      <>
        {renderJsonLdScripts(entry.dossier).map((script, index) => (
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

  const thin = getThinRecordBySlug(slug);
  if (!thin) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Thing",
            name: thin.name,
            description: thin.summary,
            url: `${SITE}${thin.path}`,
          }),
        }}
      />
      <article className="ed-dossier" data-tier={thin.tier} data-vertical={thin.vertical}>
        <header className="ed-page-head">
          <div className="wrap inner">
            {buildBreadcrumb(thin.vertical, thin.name, thin.parent_hub_path)}
            <div className="ed-kicker" style={{ color: "var(--brass, #C9A84C)" }}>
              {thin.entity_type} · {thin.vertical}
            </div>
            <h1>{thin.name}</h1>
            <p className="lede">{thin.summary}</p>
          </div>
        </header>

        <section className="wrap">
          <div
            style={{
              fontSize: 14,
              color: "var(--text-dim)",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            <div>
              Status: <span style={{ color: "var(--brass)" }}>Thin record</span>
            </div>
            <div>
              Tier:{" "}
              <span style={{ color: "var(--text-muted)" }}>
                {thin.tier} — not yet assigned a full dossier
              </span>
            </div>
            {thin.website && (
              <div>
                Website:{" "}
                <a
                  href={thin.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--link, #6cb0ff)" }}
                >
                  {thin.website} ↗
                </a>
              </div>
            )}
          </div>

          {thin.open_questions?.length > 0 && (
            <div>
              <div className="ed-kicker" style={{ marginBottom: 10 }}>
                Open questions
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 8,
                }}
              >
                {thin.open_questions.map((q, i) => (
                  <li
                    key={i}
                    style={{
                      border: "1px solid var(--border, rgba(255,255,255,.12))",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--text-dim)",
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <Link href={thin.parent_hub_path} style={{ color: "var(--text-dim)", fontSize: 13 }}>
              ← Back to the hub
            </Link>
          </div>
        </section>
      </article>
    </>
  );
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
