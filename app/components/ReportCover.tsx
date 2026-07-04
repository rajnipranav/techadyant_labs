import type { ReportMeta } from '../reports/data';

/**
 * Report cover. Uses report.cover (image URL) if present, otherwise renders a
 * branded, typeset cover. `variant="card"` = landscape ratio with flush edges
 * for embedding at the top of a card; default = portrait 3:4 with its own frame.
 */
export function ReportCover({
  report,
  variant = 'portrait',
}: {
  report: ReportMeta;
  variant?: 'portrait' | 'card';
}) {
  const card = variant === 'card';

  if (report.cover) {
    return (
      <img
        className={`report-cover-img${card ? ' rc-embedded' : ''}`}
        src={report.cover}
        alt={`${report.title} — cover`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div
      className={`report-cover${card ? ' rc-embedded' : ''}`}
      style={{ ['--cover-accent' as string]: report.accent }}
    >
      <svg className="rc-motif" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`rcEdge-${report.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={report.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g stroke="#818CF8" strokeOpacity="0.06" strokeWidth="1">
          {Array.from({ length: 6 }).map((_, i) => <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="400" />)}
          {Array.from({ length: 8 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 60} x2="300" y2={i * 60} />)}
        </g>
        <g stroke={`url(#rcEdge-${report.slug})`} strokeWidth="1.1" fill="none">
          {[
            [150, 250, 80, 150], [150, 250, 230, 160], [150, 250, 220, 330],
            [150, 250, 70, 320], [80, 150, 230, 160], [70, 320, 220, 330],
          ].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        </g>
        {([
          [150, 250, 6, '#818CF8'], [80, 150, 4, report.accent], [230, 160, 4, '#38e1c4'],
          [220, 330, 3.5, '#6366F1'], [70, 320, 3.5, '#6366F1'],
        ] as const).map(([x, y, r, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={(r as number) * 3} fill={c as string} opacity="0.14" />
            <circle cx={x} cy={y} r={r as number} fill={c as string} />
          </g>
        ))}
      </svg>

      <div className="rc-top">
        <img className="rc-mark" src="https://i.ibb.co/rfwZ4YPq/white-monogram-01.png" alt="" aria-hidden="true" />
        <span className="rc-pub">Techadyant Labs · Strategic Intelligence</span>
      </div>

      <div className="rc-mid">
        <span className="rc-domain">{report.domain}</span>
        <h3 className="rc-title">{report.title}</h3>
        {!card && <p className="rc-sub">{report.subtitle}</p>}
      </div>

      <div className="rc-foot">
        <span>{report.edition}</span>
        <span>{report.readingTime}</span>
      </div>

      <div className="rc-tricolor" />
    </div>
  );
}
