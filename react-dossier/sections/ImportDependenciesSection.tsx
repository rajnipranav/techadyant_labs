// ============================================================================
// Import dependencies — component exposure table with severity
// ============================================================================

import type { ImportDependencies, Source } from "../types";

interface Props {
  data: ImportDependencies;
  sources: Source[];
}

export function ImportDependenciesSection({ data, sources }: Props) {
  return (
    <section
      className="ed-section ed-import-deps"
      aria-labelledby="import-deps-h"
    >
      <h2 id="import-deps-h" className="ed-section-h">
        Import Dependencies
      </h2>

      <p className="ed-summary">{data.summary}</p>

      {data.items.length > 0 ? (
        <table className="ed-import-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Severity</th>
              <th>Note</th>
              <th>Pillar</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const itemSrcs = (item.sources || [])
                .map((id) => sources.find((s) => s.id === id))
                .filter((s): s is Source => Boolean(s));
              return (
                <tr key={idx} data-severity={item.severity.toLowerCase()}>
                  <td>
                    <strong>{item.component}</strong>
                  </td>
                  <td>
                    <span
                      className={`ed-sev ed-sev--${item.severity.toLowerCase()}`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>{item.note || "—"}</td>
                  <td>
                    {item.pillar_link ? (
                      <a href={item.pillar_link}>{item.pillar_link}</a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {itemSrcs.map((s, i) => (
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
    </section>
  );
}
