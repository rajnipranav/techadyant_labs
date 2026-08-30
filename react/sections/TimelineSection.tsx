// ============================================================================
// Timeline — chronological events
// ============================================================================

import type { TimelineEntry, Source } from "../types";

interface Props {
  data: TimelineEntry[];
  sources: Source[];
}

export function TimelineSection({ data, sources }: Props) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <section className="ed-section ed-timeline" aria-labelledby="timeline-h">
      <h2 id="timeline-h" className="ed-section-h">
        Timeline
      </h2>
      <ol className="ed-timeline-list">
        {sorted.map((entry, idx) => {
          const entrySrcs = (entry.sources || [])
            .map((id) => sources.find((s) => s.id === id))
            .filter((s): s is Source => Boolean(s));
          return (
            <li key={idx} className="ed-timeline-item">
              <time className="ed-timeline-date" dateTime={entry.date}>
                {entry.date}
              </time>
              <div className="ed-timeline-body">
                <p>{entry.event}</p>
                {entrySrcs.length > 0 ? (
                  <p className="ed-cite-line">
                    Sources:{" "}
                    {entrySrcs.map((s, i) => (
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
            </li>
          );
        })}
      </ol>
    </section>
  );
}
