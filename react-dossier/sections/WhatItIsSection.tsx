// ============================================================================
// What it is — prose narrative
// ============================================================================

import type { WhatItIs, Source } from "../types";

interface Props {
  data: WhatItIs;
  sources: Source[];
}

export function WhatItIsSection({ data, sources }: Props) {
  const cited = data.sources
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));

  return (
    <section className="ed-section ed-what-it-is" aria-labelledby="what-it-is-h">
      <h2 id="what-it-is-h" className="ed-section-h">
        What It Is
      </h2>
      <div className="ed-prose">
        <p>{data.prose}</p>
      </div>
      {cited.length > 0 ? (
        <p className="ed-cite-line">
          Sources:{" "}
          {cited.map((s, i) => (
            <span key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="ed-cite"
              >
                [{i + 1}]
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
