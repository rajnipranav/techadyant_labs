// ============================================================================
// Graph — peer systems, maker siblings, components, pillars
// ============================================================================

import type { Graph } from "../types";

interface Props {
  data: Graph;
  parentHubPath: string;
}

function slugToPath(slug: string, parentHubPath: string): string {
  return `${parentHubPath.replace(/\/$/, "")}/system/${slug}/`;
}

export function GraphSection({ data, parentHubPath }: Props) {
  const groups: { label: string; items: Array<string | { name: string; path: string }> | undefined }[] = [
    { label: "Maker — Other Systems", items: data?.maker_other_systems },
    { label: "Peer Systems", items: data?.peer_systems },
    { label: "Related Components", items: data?.related_components },
    { label: "Related Pillars", items: data?.related_pillars },
    { label: "Referenced By", items: data?.referenced_by },
  ];

  const hasAny = groups.some((g) => g.items && g.items.length > 0);
  if (!hasAny) return null;

  return (
    <section className="ed-section ed-graph" aria-labelledby="graph-h">
      <h2 id="graph-h" className="ed-section-h">
        Knowledge Graph
      </h2>
      <div className="ed-graph-grid">
        {groups.map((g) =>
          g.items && g.items.length > 0 ? (
            <div key={g.label} className="ed-graph-cell">
              <h3 className="ed-sub-h">{g.label}</h3>
              <ul className="ed-graph-list">
                {g.items.map((item, idx) => {
                  if (typeof item === "string") {
                    return (
                      <li key={item + "-" + idx}>
                        <a href={slugToPath(item, parentHubPath)}>{item}</a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.path + "-" + idx}>
                      <a href={item.path}>{item.name}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
