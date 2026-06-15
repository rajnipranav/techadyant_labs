'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { corridors, INDIA_OUTLINE } from './data';
import { deepFor, STAGE, type NodeStage } from './node-data';

const linePath = (p: [number, number][]) => 'M ' + p.map((q) => `${q[0]},${q[1]}`).join(' L ');
const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function CorridorNodeMap({ slug }: { slug: string }) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const c = corridors.find((x) => x.slug === slug);
  const deep = deepFor(slug);
  if (!c || !deep) return null;

  const route = c.pts as [number, number][];
  const nodes = deep.nodes.filter((n) => n.coords) as (typeof deep.nodes[number] & { coords: [number, number] })[];
  const ends = [route[0], route[route.length - 1]];
  const [startLabel, endLabel] = c.name.replace(/ Industrial Corridor.*/, '').replace(/ Economic Corridor.*/, '').split('–');

  const go = (s: string) => router.push(`/corridors/${slug}/${s}/`);
  // For each terminus: the node sitting on it (so we don't double-draw), else the nearest node to link to.
  const nodeAt = (p: [number, number]) => {
    const within = nodes.filter((n) => dist(n.coords, p) <= 6);
    if (within.length) return within.sort((a, b) => dist(a.coords, p) - dist(b.coords, p))[0];
    return null;
  };
  const nearest = (p: [number, number]) =>
    nodes.length ? nodes.slice().sort((a, b) => dist(a.coords, p) - dist(b.coords, p))[0] : null;

  // Zoom viewBox to route + nodes.
  const xs = [...route.map((p) => p[0]), ...nodes.map((n) => n.coords[0])];
  const ys = [...route.map((p) => p[1]), ...nodes.map((n) => n.coords[1])];
  const pad = 26;
  const minx = Math.min(...xs) - pad, miny = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minx + pad, h = Math.max(...ys) - miny + pad;

  const usedStages = Array.from(new Set(deep.nodes.map((n) => n.stage)));

  return (
    <div className="cnmap">
      <svg viewBox={`${minx} ${miny} ${w} ${h}`} role="img" aria-label={`Map of ${c.name} nodes`}>
        <path d={INDIA_OUTLINE} fill="none" stroke="#3a3a5c" strokeWidth={0.6} strokeOpacity={0.55} strokeLinejoin="round" />
        <path d={linePath(route)} fill="none" stroke="#C0392B" strokeWidth={2} strokeOpacity={0.9} strokeLinecap="round" strokeLinejoin="round" />
        {ends.map((p, i) => {
          // If a node sits on this terminus, the node marker (below) renders + handles the click — skip the dot.
          if (nodeAt(p)) return null;
          const target = nearest(p);
          const lbl = i === 0 ? startLabel : endLabel;
          if (!lbl) return null;
          const clickable = !!target;
          return (
            <g key={`end-${i}`} className={clickable ? 'cnmap-node' : undefined}
               {...(clickable ? {
                 tabIndex: 0, role: 'button', 'aria-label': `${lbl.trim()} — gateway, opens nearest node`,
                 onClick: () => go(target!.slug),
                 onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') go(target!.slug); },
               } : {})}>
              <circle cx={p[0]} cy={p[1]} r={2.6} fill="#C0392B" />
              <text x={p[0]} y={p[1] - 4.5} className="cnmap-end" textAnchor="middle">{lbl.trim()}</text>
            </g>
          );
        })}
        {nodes.map((n) => {
          const col = STAGE[n.stage as NodeStage].color;
          const on = hover === n.slug;
          return (
            <g key={n.slug} className="cnmap-node" tabIndex={0} role="button"
               aria-label={`${n.name} — ${STAGE[n.stage].label}`}
               onMouseEnter={() => setHover(n.slug)} onMouseLeave={() => setHover(null)}
               onClick={() => go(n.slug)}
               onKeyDown={(e) => { if (e.key === 'Enter') go(n.slug); }}>
              <circle cx={n.coords[0]} cy={n.coords[1]} r={on ? 6.5 : 4.2} fill={col} stroke="#0a0a13" strokeWidth={1} />
              {on && <circle cx={n.coords[0]} cy={n.coords[1]} r={9} fill="none" stroke={col} strokeOpacity={0.5} strokeWidth={1} />}
              <text x={n.coords[0] + 6} y={n.coords[1] + 3} className={`cnmap-label${on ? ' on' : ''}`}>{n.name.replace(/ IMC.*| \(.*/, '')}</text>
            </g>
          );
        })}
      </svg>
      <div className="cnmap-legend">
        {usedStages.map((s) => (
          <span key={s}><i style={{ background: STAGE[s].color }} />{STAGE[s].label}</span>
        ))}
        <span className="cnmap-hint">Tap a node for its profile →</span>
      </div>
    </div>
  );
}
