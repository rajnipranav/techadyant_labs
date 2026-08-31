import Link from "next/link";
import type { ThinRecord } from "@/lib/thinRegistry";

interface Props {
  record: ThinRecord;
}

export function ThinEntityPage({ record }: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Thing",
            name: record.name,
            description: record.summary,
            url: `https://labs.techadyant.com${record.path}`,
          }),
        }}
      />
      <article className="ed-dossier" data-tier={record.tier} data-vertical={record.vertical}>
        <header className="ed-page-head">
          <div className="wrap inner">
            <div className="ed-breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/research/">The Atlas</Link>
              <span className="sep">/</span>
              <Link href={record.parent_hub_path}>
                {record.parent_hub_path.replace(/\/$/, "").split("/").pop()?.replace(/-/g, " ")}
              </Link>
              <span className="sep">/</span>
              <span className="ed-breadcrumb-current">{record.name}</span>
            </div>
            <div className="ed-kicker" style={{ color: "var(--brass, #C9A84C)" }}>
              {record.entity_type} · {record.vertical}
            </div>
            <h1>{record.name}</h1>
            <p className="lede">{record.summary}</p>
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
                {record.tier} — not yet assigned a full dossier
              </span>
            </div>
            {record.website && (
              <div>
                Website:{" "}
                <a
                  href={record.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--link, #6cb0ff)" }}
                >
                  {record.website} ↗
                </a>
              </div>
            )}
          </div>

          {record.open_questions?.length > 0 && (
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
                {record.open_questions.map((q, i) => (
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
            <Link href={record.parent_hub_path} style={{ color: "var(--text-dim)", fontSize: 13 }}>
              ← Back to the hub
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
