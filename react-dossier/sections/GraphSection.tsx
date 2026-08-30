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
  const groups: { label: string; slugs: string[] | undefined }[] = [
    { label: "Maker — Other Systems", slugs: data.maker_other_systems },
    { label: "Peer Systems", slugs: data.peer_systems },
    { label: "Related Components", slugs: data.related_components },
    { label: "Related Pillars", slugs: data.related_pillars },
    { label: "Referenced By", slugs: data.referenced_by },
  ];

  const hasAny = groups.some((g) => g.slugs && g.slugs.length > 0);
  if (!hasAny) return null;

  return (
    <section className="ed-section ed-graph" aria-labelledby="graph-h">
      <h2 id="graph-h" className="ed-section-h">
        Knowledge Graph
      </h2>
      <div className="ed-graph-grid">
        {groups.map((g) =>
          g.slugs && g.slugs.length > 0 ? (
            <div key={g.label} className="ed-graph-cell">
              <h3 className="ed-sub-h">{g.label}</h3>
              <ul className="ed-graph-list">
                {g.slugs.map((slug) => (
                  <li key={slug}>
                    <a href={slugToPath(slug, parentHubPath)}>{slug}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
