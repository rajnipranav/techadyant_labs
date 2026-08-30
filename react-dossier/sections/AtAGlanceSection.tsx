// ============================================================================
// At-a-glance — key/value card grid
// ============================================================================

import type { AtAGlance } from "../types";

interface Props {
  data: AtAGlance;
}

export function AtAGlanceSection({ data }: Props) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  return (
    <section className="ed-section ed-at-a-glance" aria-labelledby="at-a-glance-h">
      <h2 id="at-a-glance-h" className="ed-section-h">
        At a Glance
      </h2>
      <dl className="ed-glance-grid">
        {entries.map(([k, v]) => (
          <div key={k} className="ed-glance-cell">
            <dt className="ed-glance-key">{k.replace(/_/g, " ")}</dt>
            <dd className="ed-glance-val">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
