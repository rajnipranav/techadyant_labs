'use client';

/**
 * Shared renderers for the Aug-2026 sourced pillar packs.
 *
 * Both blocks are additive: they render only if the data is present, so a file
 * that has not been updated yet simply shows nothing. Used by the Counter-UAS,
 * Military Aerospace and Defence service atlases.
 */

export type PackLayer = {
  id: string;
  name: string;
  score: number;          // 0-5
  status: string;
  note?: string;
  dcf_layer?: string | null;
  sources?: string[];
  service?: string;
};

export type PackSignal = {
  date: string;
  title: string;
  summary?: string;
  sources?: string[];
  service?: string;
};

const kick: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--brass, #C9A84C)',
};

// 0 import-dependent -> 5 sovereign. Matches the pillar-card strip palette.
const SCORE_COLOUR = ['#C0563B', '#C0563B', '#C99A3B', '#C99A3B', '#2BC5B4', '#2BC5B4'];
const SCORE_LABEL = ['Import-dependent', 'Nascent', 'Emerging', 'Partial', 'Substantial', 'Sovereign'];

function clamp(n: number) {
  return Math.max(0, Math.min(5, Number.isFinite(n) ? n : 0));
}

/** Value-chain layers scored 0-5, with the rationale under each. */
export function LayerScores({
  layers,
  heading = 'Value chain, scored',
  note,
}: {
  layers: PackLayer[];
  heading?: string;
  note?: string;
}) {
  if (!layers || !layers.length) return null;
  return (
    <div>
      <div style={{ ...kick, marginBottom: 4 }}>{heading}</div>
      {note ? (
        <p style={{ margin: '0 0 12px', fontSize: 12.5, color: 'var(--text-muted, #7d8496)' }}>{note}</p>
      ) : (
        <div style={{ height: 10 }} />
      )}
      <div style={{ display: 'grid', gap: 12 }}>
        {layers.map((l) => {
          const s = clamp(l.score);
          return (
            <div key={`${l.service || ''}-${l.id}`} style={{ display: 'grid', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{l.name}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-jetbrains, monospace)',
                    color: SCORE_COLOUR[s],
                    border: `1px solid ${SCORE_COLOUR[s]}55`,
                    borderRadius: 4,
                    padding: '1px 6px',
                  }}
                >
                  {s} · {l.status || SCORE_LABEL[s]}
                </span>
                {l.dcf_layer ? (
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #7d8496)' }}>
                    maps to {l.dcf_layer}
                  </span>
                ) : null}
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3 }}
                role="img"
                aria-label={`${l.name}: ${s} of 5, ${l.status || SCORE_LABEL[s]}`}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    style={{
                      height: 8,
                      borderRadius: 2,
                      background: i <= s ? SCORE_COLOUR[s] : 'var(--border, rgba(255,255,255,.12))',
                      opacity: i <= s ? 0.9 : 1,
                    }}
                  />
                ))}
              </div>
              {l.note ? (
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-dim, #9aa3b2)' }}>
                  {l.note}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Dated developments from the research pack, newest first. */
export function SignalsTimeline({
  signals,
  heading = 'What changed',
}: {
  signals: PackSignal[];
  heading?: string;
}) {
  if (!signals || !signals.length) return null;
  const rows = [...signals].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return (
    <div>
      <div style={{ ...kick, marginBottom: 10 }}>{heading}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {rows.map((s, i) => (
          <li
            key={`${s.date}-${i}`}
            style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 12, alignItems: 'start' }}
          >
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-jetbrains, monospace)',
                color: 'var(--brass, #C9A84C)',
                paddingTop: 1,
              }}
            >
              {s.date}
            </span>
            <span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s.title}</span>
              {s.service ? (
                <span style={{ fontSize: 11, color: 'var(--text-muted, #7d8496)', marginLeft: 8 }}>
                  {s.service.replace(/_/g, ' ')}
                </span>
              ) : null}
              {s.summary ? (
                <p style={{ margin: '3px 0 0', fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-dim, #9aa3b2)' }}>
                  {s.summary}
                </p>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
