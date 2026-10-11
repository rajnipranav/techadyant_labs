'use client';

// Lightweight schematic map: static SVG India outline + projected points, with layer/state
// filters and a click-to-open intelligence card. No tiles, no map library, ~3 kB of logic.
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { projectToSvg } from './geo';

export interface MapPointProp {
  id: string; kind: 'node' | 'infra'; name: string; lat: number; lng: number;
  subtype: string; status: string; state: string | null; href: string | null; blurb: string; sectors: string[];
  path?: [number, number][];
}

const LAYERS = [
  { key: 'node', label: 'Industrial nodes', match: (p: MapPointProp) => p.kind === 'node' },
  { key: 'seaport', label: 'Seaports', match: (p: MapPointProp) => p.subtype === 'seaport' },
  { key: 'airport', label: 'Cargo airports', match: (p: MapPointProp) => p.subtype === 'airport' },
  { key: 'freight', label: 'DFC stations', match: (p: MapPointProp) => p.subtype === 'dfc_station' },
  { key: 'road', label: 'Linked roads', match: (p: MapPointProp) => p.subtype === 'expressway' || p.subtype === 'national_highway' },
  { key: 'gct', label: 'Cargo terminals', match: (p: MapPointProp) => p.subtype === 'cargo_terminal' },
  { key: 'rail', label: 'Rail', match: (p: MapPointProp) => p.subtype === 'railway_station' },
] as const;

const COLOR: Record<string, string> = { node: '#F5B544', seaport: '#2E86C1', airport: '#38E1C4', freight: '#C2603A', rail: '#9AA63A', gct: '#D96FD0', road: '#8B7CF6' };
const layerOf = (p: MapPointProp) => LAYERS.find((l) => l.match(p))?.key ?? 'rail';

// Optional backdrop: a traced road network (public/data/bharatmala-network.json, see
// scripts/extract-bharatmala-network.py). Each layer is a list of delta-encoded lines
// [lat0, lng0, dlat, dlng, ...] in 1/100 degree. Fetched once, drawn as thin dim paths.
interface NetworkFile { credit: string; layers: Record<string, { label: string; lines: number[][] }> }
const NET_COLOR: Record<string, string> = { expressway: '#E052D8', economic: '#E5554F', national: '#2FBF71', inter: '#F08A2C', feeder: '#22C7D6', ring: '#B07CF0', neip: '#8FD12C' };
const NET_ORDER = ['feeder', 'inter', 'neip', 'national', 'economic', 'ring', 'expressway'];
const NET_DEFAULT_ON = new Set(['expressway', 'economic', 'national']);
function netPath(lines: number[][]): string {
  let d = '';
  for (const l of lines) {
    let la = 0, ln = 0;
    for (let i = 0; i < l.length; i += 2) {
      la += l[i]; ln += l[i + 1];
      const [x, y] = projectToSvg(la / 100, ln / 100);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

export function IndustrialMap({ points, outline, network }: { points: MapPointProp[]; outline: string; network?: { url: string } }) {
  const [net, setNet] = useState<NetworkFile | null>(null);
  const [netOn, setNetOn] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!network) return;
    let alive = true;
    fetch(network.url).then((r) => (r.ok ? r.json() : null)).then((j: NetworkFile | null) => {
      if (!alive || !j) return;
      setNet(j);
      setNetOn(Object.fromEntries(Object.keys(j.layers).map((k) => [k, NET_DEFAULT_ON.has(k)])));
    }).catch(() => {});
    return () => { alive = false; };
  }, [network]);
  const netPaths = useMemo(() => (net ? Object.fromEntries(Object.entries(net.layers).map(([k, v]) => [k, netPath(v.lines)])) : {}), [net]);
  const [on, setOn] = useState<Record<string, boolean>>({ node: true, seaport: true, airport: true, freight: true, rail: true, gct: true, road: true });
  const [state, setState] = useState<string>('all');
  const [sel, setSel] = useState<string | null>((points.find((p) => p.kind === 'node') ?? points[0])?.id ?? null);

  const states = useMemo(() => Array.from(new Set(points.map((p) => p.state).filter(Boolean) as string[])).sort(), [points]);
  const visible = points.filter((p) => on[layerOf(p)] && (state === 'all' || p.state === state));
  const selected = points.find((p) => p.id === sel) ?? null;

  return (
    <div className="ii-map">
      <div className="ii-map-controls" role="group" aria-label="Map layers">
        {LAYERS.filter((l) => points.some(l.match)).map((l) => (
          <button key={l.key} type="button" aria-pressed={on[l.key]} className={on[l.key] ? 'is-on' : ''}
            onClick={() => setOn({ ...on, [l.key]: !on[l.key] })}>
            <i style={{ background: COLOR[l.key] }} />{l.label}
          </button>
        ))}
        {net && NET_ORDER.filter((k) => net.layers[k]).map((k) => (
          <button key={`net-${k}`} type="button" aria-pressed={!!netOn[k]} className={netOn[k] ? 'is-on' : ''} title="NHAI Bharatmala map layer (schematic)"
            onClick={() => setNetOn({ ...netOn, [k]: !netOn[k] })}>
            <i style={{ background: NET_COLOR[k], borderRadius: 1, height: 3, width: 12 }} />{net.layers[k].label}
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
          {net && NET_ORDER.filter((k) => netOn[k] && netPaths[k]).map((k) => (
            <path key={`net-${k}`} d={netPaths[k]} className="ii-map-net" stroke={NET_COLOR[k]} />
          ))}
          {visible.filter((p) => p.path && p.path.length > 1).map((p) => {
            const d = p.path!.map(([la, ln], i) => { const [x, y] = projectToSvg(la, ln); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
            return (
              <g key={`${p.id}-line`} className={`ii-map-pt ii-map-line${sel === p.id ? ' is-sel' : ''}`} onClick={() => setSel(p.id)} tabIndex={0} role="button" aria-label={p.name}
                onKeyDown={(e) => { if (e.key === 'Enter') setSel(p.id); }}>
                <path d={d} className="ii-map-hit" />
                <path d={d} stroke={COLOR[layerOf(p)]} className="ii-map-route" />
              </g>
            );
          })}
          {visible.filter((p) => p.kind === 'infra' && !(p.path && p.path.length > 1)).map((p) => {
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
          {net && <p className="ii-map-disc">Road network traced from {net.credit}</p>}
          <p className="ii-map-disc">Schematic. Positions are approximate centroids; distances on dossiers are straight-line and labelled as such.</p>
        </div>
      </div>
    </div>
  );
}
