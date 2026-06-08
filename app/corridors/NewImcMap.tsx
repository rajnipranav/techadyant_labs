'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDIA_OUTLINE } from './data';
import { newImcNodes, STAGE, type NodeStage } from './node-data';

// National map plotting all 12 NICDC "12 New Projects" IMCs on the shared India
// outline. Markers are stage-coloured and link to each IMC's profile page.
export function NewImcMap() {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const items = newImcNodes().filter((x) => x.node.coords);
  const usedStages = Array.from(new Set(items.map((x) => x.node.stage)));

  // Labels sit left of marker for nodes on the eastern/right side so they don't run off-frame.
  const leftLabel = new Set(['gaya', 'prayagraj', 'kopparthy', 'orvakal']);

  return (
    <div className="nimap">
      <svg viewBox="34 60 430 470" role="img" aria-label="Map of India's 12 new Integrated Manufacturing Clusters">
        <path d={INDIA_OUTLINE} fill="none" stroke="#3a3a5c" strokeWidth={0.7} strokeOpacity={0.6} strokeLinejoin="round" />
        {items.map(({ node: n, corridor }) => {
          const [x, y] = n.coords as [number, number];
          const col = STAGE[n.stage as NodeStage].color;
          const on = hover === n.slug;
          const left = leftLabel.has(n.slug);
          const label = n.name.replace(/ IMC.*| node.*| \(.*|–.*| NIMZ.*| Port.*/, '').trim();
          return (
            <g key={n.slug} className="nimap-node" tabIndex={0} role="button"
               aria-label={`${n.name}, ${n.state} — ${STAGE[n.stage].label}`}
               onMouseEnter={() => setHover(n.slug)} onMouseLeave={() => setHover(null)}
               onFocus={() => setHover(n.slug)} onBlur={() => setHover(null)}
               onClick={() => router.push(`/corridors/${corridor}/${n.slug}`)}
               onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/corridors/${corridor}/${n.slug}`); }}>
              {on && <circle cx={x} cy={y} r={10} fill="none" stroke={col} strokeOpacity={0.5} strokeWidth={1.2} />}
              <circle cx={x} cy={y} r={on ? 6.5 : 4.6} fill={col} stroke="#0a0a13" strokeWidth={1} />
              <text x={left ? x - 7 : x + 7} y={y + 3} textAnchor={left ? 'end' : 'start'}
                    className={`nimap-label${on ? ' on' : ''}`}>{label}</text>
            </g>
          );
        })}
      </svg>
      <div className="nimap-legend">
        {usedStages.map((s) => (
          <span key={s}><i style={{ background: STAGE[s].color }} />{STAGE[s].label}</span>
        ))}
        <span className="nimap-hint">Tap any cluster for its profile →</span>
      </div>
    </div>
  );
}
