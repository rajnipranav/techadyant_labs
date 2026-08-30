// ============================================================================
// Deployments / procurement — table of agency rows
// ============================================================================

import type { DeploymentsProcurement, Source } from "../types";

interface Props {
  data: DeploymentsProcurement;
  sources: Source[];
}

export function DeploymentsSection({ data, sources }: Props) {
  return (
    <section
      className="ed-section ed-deployments"
      aria-labelledby="deployments-h"
    >
      <h2 id="deployments-h" className="ed-section-h">
        Deployments & Procurement
      </h2>

      <p className="ed-summary">{data.summary}</p>

      {data.rows.length > 0 ? (
        <table className="ed-deploy-table">
          <thead>
            <tr>
              <th>Agency</th>
              <th>Context</th>
              <th>Year</th>
              <th>Quantity / Note</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => {
              const rowSrcs = (row.sources || [])
                .map((id) => sources.find((s) => s.id === id))
                .filter((s): s is Source => Boolean(s));
              return (
                <tr key={idx}>
                  <td>
                    <strong>{row.agency}</strong>
                  </td>
                  <td>{row.context}</td>
                  <td>{row.year != null ? String(row.year) : "—"}</td>
                  <td>{row.quantity_or_note || "—"}</td>
                  <td>
                    {rowSrcs.map((s, i) => (
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {data.open_questions && data.open_questions.length > 0 ? (
        <div className="ed-open-q-inline">
          <h3 className="ed-sub-h">Open Questions</h3>
          <ul>
            {data.open_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
