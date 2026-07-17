import React from 'react';
import Link from 'next/link';

/**
 * Atlas ecosystems that live OUTSIDE the five SID corridors (which auto-populate
 * from the baked _atlas.json). Add an entry here and it appears on BOTH the
 * /research Atlas overview (full card) and the home-page Atlas grid (simple card).
 * This is the single source of truth for standalone Atlas sections.
 */
export interface ExtraEcosystem {
  key: string;
  label: string;
  no: string;
  href: string;
  accent: string;
  tagline: string;
  strip: string[];
  stat: React.ReactNode;
  stat2: string;
  weakPrefix: string;
  weakName: string;
  weakStatus: string;
  go: string;
}

export const EXTRA_ECOSYSTEMS: ExtraEcosystem[] = [
  {
    key: 'unmanned-systems',
    label: 'Unmanned Systems',
    no: '06',
    href: '/research/drones-uas/',
    accent: '#2BC5B4',
    tagline: 'India flies and assembles more drones than it builds — the components still come from abroad.',
    strip: ['#C0563B', '#C0563B', '#C99A3B', '#C99A3B', '#2BC5B4', '#C99A3B'],
    stat: <><b>3</b> of <b>6</b> layers import-dependent</>,
    stat2: '90 players',
    weakPrefix: 'Weakest link',
    weakName: 'Propulsion & Power',
    weakStatus: 'Import-dependent',
    go: 'Explore the ecosystem →',
  },
  {
    key: 'counter-uas',
    label: 'Counter-UAS',
    no: '07',
    href: '/research/counter-uas/',
    accent: '#E24B4A',
    tagline: 'India’s counter-drone shield — who detects, tracks and defeats the drone threat.',
    strip: ['#C0563B', '#C99A3B', '#C99A3B', '#2BC5B4', '#C99A3B', '#2BC5B4'],
    stat: <><b>60</b> systems · <b>24</b> Indian</>,
    stat2: '43 makers',
    weakPrefix: 'Critical import dep',
    weakName: 'AESA GaN / FPGA',
    weakStatus: 'Import-dependent',
    go: 'Explore the shield →',
  },
];

/** Full card — used on the /research Atlas overview (with layer strip + weakest link). */
export function ExtraEcosystemCardFull({ e }: { e: ExtraEcosystem }) {
  return (
    <Link href={e.href} className="atlas-card" style={{ ['--accent' as string]: e.accent }}>
      <div className="atlas-card-head">
        <h3>{e.label}</h3>
        <span className="atlas-card-no">{e.no}</span>
      </div>
      <p className="atlas-card-tag">{e.tagline}</p>
      <div className="atlas-strip" aria-hidden="true">
        {e.strip.map((bg, i) => <span key={i} style={{ background: bg }} />)}
      </div>
      <div className="atlas-card-stats">
        <span>{e.stat}</span>
        <span>{e.stat2}</span>
      </div>
      <div className="atlas-card-weak">
        {e.weakPrefix}: <strong>{e.weakName}</strong> · {e.weakStatus}
      </div>
      <span className="atlas-card-go">{e.go}</span>
    </Link>
  );
}

/** Simple card — used on the home-page Atlas grid (matches the SID corridor cards there). */
export function ExtraEcosystemCardSimple({ e }: { e: ExtraEcosystem }) {
  return (
    <Link href={e.href} className="atlas-card" style={{ ['--accent' as string]: e.accent }}>
      <div className="atlas-card-head">
        <h3>{e.label}</h3>
        <span className="atlas-card-no">{e.no}</span>
      </div>
      <p className="atlas-card-tag">{e.tagline}</p>
      <div className="atlas-card-stats">
        <span>{e.stat}</span>
      </div>
      <span className="atlas-card-go">{e.go}</span>
    </Link>
  );
}
