// ============================================================================
// Sources — full bibliography with publisher + trust tier
// ============================================================================

import type { Source } from "../types";

interface Props {
  data: Source[];
}

const TIER_LABEL: Record<string, string> = {
  official: "Official",
  credible: "Credible",
  indicative: "Indicative",
  methodology: "Methodology",
};

export function SourcesSection({ data }: Props) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => {
    const aId = a.id || `${a.publisher}-${a.title}`;
    const bId = b.id || `${b.publisher}-${b.title}`;
    return aId.localeCompare(bId);
  });

  return (
    <section className="ed-section ed-sources" aria-labelledby="sources-h">
      <h2 id="sources-h" className="ed-section-h">
        Sources
      </h2>
      <ol className="ed-source-list">
        {sorted.map((src, idx) => {
          const srcId = src.id || `${src.publisher}-${src.title}`;
          return (
            <li key={srcId} className="ed-source-item" data-tier={src.trust_tier}>
              <div className="ed-source-head">
                <span className="ed-source-id">{srcId}</span>
                <span
                  className={`ed-trust ed-trust--${src.trust_tier}`}
                  title={TIER_LABEL[src.trust_tier]}
                >
                  {TIER_LABEL[src.trust_tier]}
                </span>
              </div>
              <div className="ed-source-body">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="ed-source-title"
                >
                  {src.title}
                </a>
                <div className="ed-source-meta">
                  <span className="ed-source-publisher">{src.publisher}</span>
                  {src.published_date ? (
                    <>
                      <span className="ed-sep">·</span>
                      <span className="ed-source-date">{src.published_date}</span>
                    </>
                  ) : null}
                  <span className="ed-sep">·</span>
                  <span className="ed-source-accessed">
                    accessed {src.accessed}
                  </span>
                </div>
                {src.note ? (
                  <p className="ed-source-note">{src.note}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
