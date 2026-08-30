// ============================================================================
// CTA — track ecosystem, submit correction, related research
// ============================================================================

import type { CTA } from "../types";

interface Props {
  data: CTA;
}

export function CTASection({ data }: Props) {
  const hasRelated =
    data.related_research && data.related_research.length > 0;

  return (
    <section className="ed-section ed-cta" aria-labelledby="cta-h">
      <h2 id="cta-h" className="ed-section-h">
        Continue
      </h2>
      <div className="ed-cta-grid">
        {data.track_ecosystem ? (
          <a
            className="ed-cta-btn ed-cta-btn--primary"
            href={data.track_ecosystem}
          >
            Track ecosystem →
          </a>
        ) : null}
        {data.submit_correction ? (
          <a
            className="ed-cta-btn ed-cta-btn--ghost"
            href={data.submit_correction}
          >
            Submit a correction
          </a>
        ) : null}
      </div>
      {hasRelated ? (
        <div className="ed-related">
          <h3 className="ed-sub-h">Related research</h3>
          <ul>
            {data.related_research!.map((path) => (
              <li key={path}>
                <a href={path}>{path}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
