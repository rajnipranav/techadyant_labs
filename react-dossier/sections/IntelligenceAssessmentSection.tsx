// ============================================================================
// Intelligence assessment — score-band radar (0 import-dependent … 5 sovereign)
// ============================================================================

import type { IntelligenceAssessment, Source } from "../types";

interface Props {
  data: IntelligenceAssessment;
  sources: Source[];
}

const SCORE_LABELS = [
  "Import-dependent",
  "Nascent",
  "Emerging",
  "Partial",
  "Substantial",
  "Sovereign",
];

export function IntelligenceAssessmentSection({ data, sources }: Props) {
  return (
    <section
      className="ed-section ed-intel"
      aria-labelledby="intel-h"
    >
      <h2 id="intel-h" className="ed-section-h">
        Intelligence Assessment
      </h2>

      <p className="ed-methodology-link">
        Methodology:{" "}
        <a href={data.methodology_path}>{data.methodology_path}</a>
      </p>

      <div className="ed-intel-grid">
        {data.dimensions.map((dim) => {
          const dimSrcs = (dim.sources || [])
            .map((id) => sources.find((s) => s.id === id))
            .filter((s): s is Source => Boolean(s));
          return (
            <div
              key={dim.id}
              className="ed-intel-cell"
              data-score={dim.value}
            >
              <div className="ed-intel-label">{dim.label}</div>
              <div className="ed-intel-score" title={SCORE_LABELS[dim.value]}>
                <span className="ed-score-num">{dim.value}</span>
                <span className="ed-score-max">/5</span>
              </div>
              <div className="ed-intel-band">{SCORE_LABELS[dim.value]}</div>
              {dim.note ? (
                <p className="ed-intel-note">{dim.note}</p>
              ) : null}
              {dimSrcs.length > 0 ? (
                <p className="ed-cite-line">
                  Sources:{" "}
                  {dimSrcs.map((s, i) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="ed-cite"
                    >
                      [{i + 1}]
                    </a>
                  ))}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
