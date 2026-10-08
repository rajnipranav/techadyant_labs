'use client';

// Lightweight schematic map: static SVG India outline + projected points, with layer/state
// filters and a click-to-open intelligence card. No tiles, no map library, ~3 kB of logic.
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { projectToSvg } from './geo';

export interface MapPointProp {
  id: string; kind: 'node' | 'infra'; name: string; lat: number; lng: number;
  subtype: string; status: string; state: string | null; href: string | null; blurb: string; sectors: string[];
}

const LAYERS = [
  { key: 'node', label: 'Industrial nodes', match: (p: MapPointProp) => p.kind === 'node' },
  { key: 'seaport', label: 'Seaports', match: (p: MapPointProp) => p.subtype === 'seaport' },
  { key: 'airport', label: 'Cargo airports', match: (p: MapPointProp) => p.subtype === 'airport' },
  { key: 'freight', label: 'DFC stations', match: (p: MapPointProp) => p.subtype === 'dfc_station' },
  { key: 'rail', label: 'Rail', match: (p: MapPointProp) => p.subtype === 'railway_station' },
] as const;

const COLOR: Record<string, string> = { node: '#F5B544', seaport: '#2E86C1', airport: '#38E1C4', freight: '#C2603A', rail: '#9AA63A' };
const layerOf = (p: MapPointProp) => LAYERS.find((l) => l.match(p))?.key ?? 'rail';

export function IndustrialMap({ points, outline }: { points: MapPointProp[]; outline: string }) {
  const [on, setOn] = useState<Record<string, boolean>>({ node: true, seaport: true, airport: true, freight: true, rail: true });
  const [state, setState] = useState<string>('all');
  const [sel, setSel] = useState<string | null>(points.find((p) => p.kind === 'node')?.id ?? null);

  const states = useMemo(() => Array.from(new Set(points.map((p) => p.state).filter(Boolean) as string[])).sort(), [points]);
  const visible = points.filter((p) => on[layerOf(p)] && (state === 'all' || p.state === state));
  const selected = points.find((p) => p.id === sel) ?? null;

  return (
    <div className="ii-map">
      <div className="ii-map-controls" role="group" aria-label="Map layers">
        {LAYERS.map((l) => (
          <button key={l.key} type="button" aria-pressed={on[l.key]} className={on[l.key] ? 'is-on' : ''}
            onClick={() => setOn({ ...on, [l.key]: !on[l.key] })}>
            <i style={{ background: COLOR[l.key] }} />{l.label}
          </button>
        ))}
        <label className="ii-map-state">
          <span>State</span>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="ii-map-body">
        <svg viewBox="30 60 425 470" role="img" aria-label="Schematic map of pilot industrial nodes and the infrastructure they connect to">
          <path d={outline} className="ii-map-outline" />
          {visible.filter((p) => p.kind === 'infra').map((p) => {
            const [x, y] = projectToSvg(p.lat, p.lng);
            return (
              <g key={p.id} className="ii-map-pt" onClick={() => setSel(p.id)} tabIndex={0} role="button" aria-label={p.name}
                onKeyDown={(e) => { if (e.key === 'Enter') setSel(p.id); }}>
                <rect x={x - 2.6} y={y - 2.6} width={5.2} height={5.2} transform={`rotate(45 ${x} ${y})`} fill={COLOR[layerOf(p)]} opacity={p.status === 'operational' ? 0.95 : 0.45} />
              </g>
            );
          })}
          {visible.filter((p) => p.kind === 'node').map((p) => {
            const [x, y] = projectToSvg(p.lat, p.lng);
            return (
              <g key={p.id} className={`ii-map-pt ii-map-node${sel === p.id ? ' is-sel' : ''}`} onClick={() => setSel(p.id)} tabIndex={0} role="button" aria-label={p.name}
                onKeyDown={(e) => { if (e.key === 'Enter') setSel(p.id); }}>
                <circle cx={x} cy={y} r={7} fill="none" stroke={COLOR.node} strokeWidth={1} opacity={0.6} />
                <circle cx={x} cy={y} r={3.6} fill={COLOR.node} />
                <text x={x + 9} y={y + 3.5}>{p.name}</text>
              </g>
            );
          })}
        </svg>
        <div className="ii-map-card" aria-live="polite">
          {selected ? (
            <>
              <div className="ii-map-card-kind">{selected.kind === 'node' ? 'Industrial node' : selected.subtype.replace(/_/g, ' ')}{selected.state ? ` · ${selected.state}` : ''}</div>
              <h3>{selected.name}</h3>
              {selected.kind === 'infra' && <div className="ii-map-card-status">{selected.status.replace(/_/g, ' ')}</div>}
              <p>{selected.blurb}</p>
              {selected.sectors.length > 0 && <div className="node-chips">{selected.sectors.slice(0, 4).map((s) => <span key={s}>{s}</span>)}</div>}
              {selected.href && <Link href={selected.href} className="see-all">Open dossier →</Link>}
            </>
          ) : <p>Select a point.</p>}
          <p className="ii-map-disc">Schematic. Positions are approximate centroids; distances on dossiers are straight-line and labelled as such.</p>
        </div>
      </div>
    </div>
  );
}
