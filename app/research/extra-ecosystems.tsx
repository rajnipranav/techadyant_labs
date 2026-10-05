import React from 'react';
import Link from 'next/link';
import { meta as aeroMeta } from './military-aerospace/data';
import { meta as spaceMeta } from './space/data';
import highAltitude from './pillars/defence/_high_altitude.json';
import { atlas } from './atlas';

const haResearchNeeds = highAltitude.entities.filter((e) => e.claim_type === 'research_need').length;

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
  /** A deep-dive inside another pillar (e.g. High-Altitude Defence sits under Defence) — shown on cards but not counted as a separate ecosystem. */
  subVertical?: boolean;
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
  {
    key: 'military-aerospace',
    label: 'Military Aerospace',
    no: '08',
    href: '/research/military-aerospace/',
    accent: '#6CB0FF',
    tagline: 'India assembles transport aircraft it does not design — the engines, avionics and actuators still come from abroad.',
    strip: ['#C0563B', '#C0563B', '#C99A3B', '#C99A3B', '#2BC5B4', '#2BC5B4'],
    stat: <><b>{aeroMeta.platforms}</b> platforms · <b>{aeroMeta.companies}</b> companies</>,
    stat2: `${aeroMeta.dependencies} dependencies`,
    weakPrefix: 'Critical import dep',
    weakName: 'Engines & FADEC',
    weakStatus: 'Import-dependent',
    go: 'Explore the ecosystem ',
  },
  {
    key: 'space',
    label: 'Space',
    no: '09',
    href: '/research/space/',
    accent: '#A78BFA',
    tagline: 'India is moving from government missions to a private full-stack space economy — launch, satellites, propulsion and data still lean on imported components.',
    strip: ['#C0563B', '#C99A3B', '#C99A3B', '#2BC5B4', '#C99A3B', '#2BC5B4'],
    stat: <><b>{spaceMeta.platforms}</b> platforms · <b>{spaceMeta.companies}</b> companies</>,
    stat2: `$${spaceMeta.fundingUsdMn} Mn private funding`,
    weakPrefix: 'Critical import dep',
    weakName: 'Space-grade electronics',
    weakStatus: 'Nascent / Import-dependent',
    go: 'Explore the ecosystem →',
  },
  {
    key: 'high-altitude-defence',
    subVertical: true,
    label: 'High-Altitude Defence',
    no: '10',
    href: '/research/pillars/defence/high-altitude/',
    accent: '#38BDF8',
    tagline: 'What it takes to operate above 12,000 ft — power, shelter, soldier physiology, thin-air UAS and logistics, from DRDO research needs to demonstrated capability.',
    strip: [],
    stat: <><b>{highAltitude.entities.length}</b> entities · <b>{highAltitude.categories.length}</b> categories</>,
    stat2: `${highAltitude.suppliers.length} suppliers`,
    weakPrefix: 'Evidence mix',
    weakName: `${haResearchNeeds} of ${highAltitude.entities.length} are research needs`,
    weakStatus: 'not fielded capability',
    go: 'Explore the atlas →',
  },
];

/**
 * Locked public taxonomy (single source of truth for every static claim):
 *  - SCORED_ECOSYSTEMS_COUNT: ecosystems scored on the value-chain grid (the baked SID corridors).
 *  - EXTENDED_PILLARS_COUNT: standalone-database pillars outside the scored grid.
 *  - ATLAS_ECOSYSTEMS_COUNT: scored + extended. Sub-verticals are not counted.
 */
export const SCORED_ECOSYSTEMS_COUNT = atlas.corridors.length;
export const EXTENDED_PILLARS_COUNT = EXTRA_ECOSYSTEMS.filter((e) => !e.subVertical).length;
export const ATLAS_ECOSYSTEMS_COUNT = SCORED_ECOSYSTEMS_COUNT + EXTENDED_PILLARS_COUNT;

/** Full card — used on the /research Atlas overview (with layer strip + weakest link). */
export function ExtraEcosystemCardFull({ e }: { e: ExtraEcosystem }) {
  return (
    <Link href={e.href} className="atlas-card" style={{ ['--accent' as string]: e.accent }}>
      <div className="atlas-card-head">
        <h3>{e.label}</h3>
      </div>
      <p className="atlas-card-tag">{e.tagline}</p>
      {e.strip.length > 0 && (
        <div className="atlas-strip" aria-hidden="true">
          {e.strip.map((bg, i) => <span key={i} style={{ background: bg }} />)}
        </div>
      )}
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
      </div>
      <p className="atlas-card-tag">{e.tagline}</p>
      <div className="atlas-card-stats">
        <span>{e.stat}</span>
      </div>
      <span className="atlas-card-go">{e.go}</span>
    </Link>
  );
}
