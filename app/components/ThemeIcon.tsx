import type { Theme } from '../research/data';

export function ThemeIcon({ icon }: { icon: Theme['icon'] }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (icon) {
    case 'chip':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
        </svg>
      );
    case 'signal':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 12h3l2-6 4 14 3-10 1.5 2H20" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
  }
}

/** Abstract dependency-topology visual used on the featured report card. */
export function FeaturedTopology() {
  return (
    <svg viewBox="0 0 520 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="ftGlow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1b2748" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0a0e18" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ftEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5B544" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="520" height="380" fill="url(#ftGlow)" />
      {/* grid */}
      <g stroke="#818CF8" strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 65} y1="0" x2={i * 65} y2="380" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 65} x2="520" y2={i * 65} />
        ))}
      </g>
      {/* edges */}
      <g stroke="url(#ftEdge)" strokeWidth="1.2" fill="none">
        <line x1="260" y1="190" x2="150" y2="110" />
        <line x1="260" y1="190" x2="380" y2="120" />
        <line x1="260" y1="190" x2="400" y2="260" />
        <line x1="260" y1="190" x2="160" y2="270" />
        <line x1="260" y1="190" x2="250" y2="310" />
        <line x1="150" y1="110" x2="80" y2="190" />
        <line x1="380" y1="120" x2="440" y2="190" />
        <line x1="160" y1="270" x2="250" y2="310" />
        <line x1="400" y1="260" x2="440" y2="190" />
      </g>
      {/* nodes */}
      <g>
        {[
          [260, 190, 6, '#818CF8', 'INDUSTRIAL CORE'],
          [150, 110, 5, '#F5B544', 'FABRICATION'],
          [380, 120, 4, '#6366F1', 'POWER'],
          [400, 260, 4, '#6366F1', 'LOGISTICS'],
          [160, 270, 4, '#38e1c4', 'WATER'],
          [250, 310, 4, '#6366F1', 'TALENT'],
          [80, 190, 3, '#F5B544', 'CAPITAL'],
          [440, 190, 3, '#6366F1', 'POLICY'],
        ].map(([x, y, r, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={y as number} r={(r as number) * 3.2} fill={c as string} opacity="0.12" />
            <circle cx={x as number} cy={y as number} r={r as number} fill={c as string} />
          </g>
        ))}
      </g>
      <text x="20" y="364" fontFamily="ui-monospace, monospace" fontSize="10" fill="#F5B544" opacity="0.45" letterSpacing="1.5">
        FIG · INDIA SEMICONDUCTOR DEPENDENCY MAP
      </text>
    </svg>
  );
}
