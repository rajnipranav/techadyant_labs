'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { corridors, INDIA_OUTLINE } from './data';
import { deepFor, STAGE, type NodeStage } from './node-data';

const linePath = (p: [number, number][]) => 'M ' + p.map((q) => `${q[0]},${q[1]}`).join(' L ');
const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function CorridorNodeMap({ slug }: { slug: string }) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const c = corridors.find((x) => x.slug === slug);
  const deep = deepFor(slug);
  if (!c || !deep) return null;

  const route = c.pts as [number, number][];
  const nodes = deep.nodes.filter((n) => n.coords) as (typeof deep.nodes[number] & { coords: [number, number] })[];
  const ends = [route[0], route[route.length - 1]];
  // Endpoint city labels come from a "City–City" corridor name. If the name has no
  // en-dash (e.g. "Odisha Economic Corridor"), we have no two cities — skip the labels
  // rather than print the whole name huge.
  const [startLabel, endLabel] = c.name.replace(/ (Industrial|Economic) Corridor.*/, '').split('–');
  const twoTokens = Boolean(startLabel && endLabel);

  // Zoom viewBox to route + nodes.
  const xs = [...route.map((p) => p[0]), ...nodes.map((n) => n.coords[0])];
  const ys = [...route.map((p) => p[1]), ...nodes.map((n) => n.coords[1])];
  const pad = 26;
  const minx = Math.min(...xs) - pad, miny = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minx + pad, h = Math.max(...ys) - miny + pad;

  // Scale every dimension to the viewBox so a tightly-zoomed corridor doesn't magnify
  // text/markers. K is the frame's longest side; sizes are a fixed fraction of it, so
  // every corridor renders at a consistent on-screen size.
  const K = Math.max(w, h);
  const fs = clamp(K * 0.034, 2.2, 7);
  const endFs = clamp(K * 0.036, 2.4, 7.4);
  const r = clamp(K * 0.022, 1.6, 4.4);
  const rHover = r * 1.5;
  const routeSW = clamp(K * 0.011, 0.9, 2.2);
  const outlineSW = clamp(K * 0.004, 0.35, 0.7);
  const endR = clamp(K * 0.013, 1, 2.6);
  const labelGap = r + K * 0.015;

  const go = (s: string) => router.push(`/corridors/${slug}/${s}/`);
  const nodeAt = (p: [number, number]) => {
    const within = nodes.filter((n) => dist(n.coords, p) <= 6);
    return within.length ? within.sort((a, b) => dist(a.coords, p) - dist(b.coords, p))[0] : null;
  };
  const nearest = (p: [number, number]) =>
    nodes.length ? nodes.slice().sort((a, b) => dist(a.coords, p) - dist(b.coords, p))[0] : null;
  // Put a label on the left when another node sits just to its right (would collide).
  const sideOf = (n: (typeof nodes)[number]): 'left' | 'right' =>
    nodes.some((m) => m.slug !== n.slug && m.coords[0] > n.coords[0]
      && (m.coords[0] - n.coords[0]) < fs * 8 && Math.abs(m.coords[1] - n.coords[1]) < fs * 1.4)
      ? 'left' : 'right';

  const usedStages = Array.from(new Set(deep.nodes.map((n) => n.stage)));

  return (
    <div className="cnmap">
      <svg viewBox={`${minx} ${miny} ${w} ${h}`} role="img" aria-label={`Map of ${c.name} nodes`}>
        <path d={INDIA_OUTLINE} fill="none" stroke="#3a3a5c" strokeWidth={outlineSW} strokeOpacity={0.55} strokeLinejoin="round" />
        <path d={linePath(route)} fill="none" stroke="#C0392B" strokeWidth={routeSW} strokeOpacity={0.9} strokeLinecap="round" strokeLinejoin="round" />
        {ends.map((p, i) => {
          if (nodeAt(p)) return null;
          const lbl = i === 0 ? startLabel : endLabel;
          const target = nearest(p);
          const clickable = twoTokens && !!lbl && !!target;
          return (
            <g key={`end-${i}`} className={clickable ? 'cnmap-node' : undefined}
               {...(clickable ? {
                 tabIndex: 0, role: 'button', 'aria-label': `${lbl!.trim()} — gateway, opens nearest node`,
                 onClick: () => go(target!.slug),
                 onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') go(target!.slug); },
               } : {})}>
              <circle cx={p[0]} cy={p[1]} r={endR} fill="#C0392B" />
              {twoTokens && lbl ? (
                <text x={p[0]} y={p[1] - endR - endFs * 0.4} className="cnmap-end" textAnchor="middle" style={{ fontSize: endFs }}>{lbl.trim()}</text>
              ) : null}
            </g>
          );
        })}
        {nodes.map((n) => {
          const col = STAGE[n.stage as NodeStage].color;
          const on = hover === n.slug;
          const side = sideOf(n);
          const lx = side === 'left' ? n.coords[0] - labelGap : n.coords[0] + labelGap;
          return (
            <g key={n.slug} className="cnmap-node" tabIndex={0} role="button"
               aria-label={`${n.name} — ${STAGE[n.stage].label}`}
               onMouseEnter={() => setHover(n.slug)} onMouseLeave={() => setHover(null)}
               onClick={() => go(n.slug)}
               onKeyDown={(e) => { if (e.key === 'Enter') go(n.slug); }}>
              <circle cx={n.coords[0]} cy={n.coords[1]} r={on ? rHover : r} fill={col} stroke="#0a0a13" strokeWidth={outlineSW * 1.6} />
              {on && <circle cx={n.coords[0]} cy={n.coords[1]} r={rHover + r * 0.6} fill="none" stroke={col} strokeOpacity={0.5} strokeWidth={outlineSW * 1.6} />}
              <text x={lx} y={n.coords[1] + fs * 0.34} textAnchor={side === 'left' ? 'end' : 'start'}
                    style={{ fontSize: fs }} className={`cnmap-label${on ? ' on' : ''}`}>{n.name.replace(/ IMC.*| node.*| \(.*/, '')}</text>
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
