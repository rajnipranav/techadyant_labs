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
  tier?: 'major' | 'minor' | 'new' | 'listed';
}

const LAYERS = [
  { key: 'node', label: 'Industrial nodes', match: (p: MapPointProp) => p.kind === 'node' },
  { key: 'port_major', label: 'Major ports', match: (p: MapPointProp) => p.tier === 'major' },
  { key: 'port_new', label: 'Ports under construction', match: (p: MapPointProp) => p.tier === 'new' },
  { key: 'port_minor', label: 'Non-major ports', match: (p: MapPointProp) => p.tier === 'minor' },
  { key: 'port_listed', label: 'Other listed ports', match: (p: MapPointProp) => p.tier === 'listed' },
  { key: 'fcor', label: 'Freight corridors', match: (p: MapPointProp) => p.subtype === 'freight_corridor' },
  { key: 'icor', label: 'Industrial corridors', match: (p: MapPointProp) => p.subtype === 'industrial_corridor' },
  { key: 'seaport', label: 'Seaports', match: (p: MapPointProp) => p.subtype === 'seaport' && !p.tier },
  { key: 'airport', label: 'Cargo airports', match: (p: MapPointProp) => p.subtype === 'airport' },
  { key: 'freight', label: 'DFC stations', match: (p: MapPointProp) => p.subtype === 'dfc_station' },
  { key: 'road', label: 'Linked roads', match: (p: MapPointProp) => p.subtype === 'expressway' || p.subtype === 'national_highway' },
  { key: 'gct', label: 'Cargo terminals', match: (p: MapPointProp) => p.subtype === 'cargo_terminal' },
  { key: 'rail', label: 'Rail', match: (p: MapPointProp) => p.subtype === 'railway_station' },
] as const;

const COLOR: Record<string, string> = { node: '#F5B544', seaport: '#2E86C1', airport: '#38E1C4', freight: '#C2603A', rail: '#9AA63A', gct: '#D96FD0', road: '#8B7CF6',
  port_major: '#2E86C1', port_new: '#F5B544', port_minor: '#6FB3E0', port_listed: '#8A94A6', fcor: '#C2603A', icor: '#B89B5E' };
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
  const [on, setOn] = useState<Record<string, boolean>>({ node: true, seaport: true, airport: true, freight: true, rail: true, gct: true, road: true,
    port_major: true, port_new: true, port_minor: true, port_listed: true, fcor: true, icor: true });
  const [state, setState] = useState<string>('all');
  const [sel, setSel] = useState<string | null>((points.find((p) => p.tier === 'major') ?? points.find((p) => p.kind === 'node') ?? points[0])?.id ?? null);

  const states = useMemo(() => Array.from(new Set(points.map((p) => p.state).filter(Boolean) as string[])).sort(), [points]);
  const visible = points.filter((p) => on[layerOf(p)] && (state === 'all' || p.state === state));
  const selected = points.find((p) => p.id === sel) ?? null;
  // Port labels: major and new ports only, west-coast labels to the left, skipping any that would overlap.
  const labels = useMemo(() => {
    const placed: { x: number; y: number; w: number }[] = [];
    const out: Record<string, { x: number; y: number; end: boolean }> = {};
    for (const p of visible.filter((q) => q.tier === 'major' || q.tier === 'new')) {
      const [x, y] = projectToSvg(p.lat, p.lng); const end = p.lng < 77.5; const w = p.name.length * 3.5 + 6;
      const lx = end ? x - 5 : x + 5; const x0 = end ? lx - w : lx;
      if (placed.some((b) => Math.abs(b.y - y) < 7 && x0 < b.x + b.w && b.x < x0 + w)) continue;
      placed.push({ x: x0, y, w }); out[p.id] = { x: lx, y: y + 2.5, end };
    }
    return out;
  }, [visible]);

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
          {[...visible.filter((p) => p.path && p.path.length > 1)].sort((a, b) => (a.subtype === 'industrial_corridor' ? 0 : 1) - (b.subtype === 'industrial_corridor' ? 0 : 1)).map((p) => {
            const d = p.path!.map(([la, ln], i) => { const [x, y] = projectToSvg(la, ln); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
            const style = p.subtype === 'industrial_corridor' ? { strokeWidth: 1.2, strokeDasharray: '1.5 3', opacity: 0.8 } : p.subtype === 'freight_corridor' ? { strokeWidth: 1.8, strokeDasharray: '7 2.5' } : undefined;
            return (
              <g key={`${p.id}-line`} className={`ii-map-pt ii-map-line${sel === p.id ? ' is-sel' : ''}`} onClick={() => setSel(p.id)} tabIndex={0} role="button" aria-label={p.name}
                onKeyDown={(e) => { if (e.key === 'Enter') setSel(p.id); }}>
                <path d={d} className="ii-map-hit" />
                <path d={d} stroke={COLOR[layerOf(p)]} className="ii-map-route" style={style} />
              </g>
            );
          })}
          {visible.filter((p) => p.kind === 'infra' && !(p.path && p.path.length > 1)).map((p) => {
            const [x, y] = projectToSvg(p.lat, p.lng);
            const lab = labels[p.id];
            return (
              <g key={p.id} className={`ii-map-pt${sel === p.id ? ' is-sel' : ''}`} onClick={() => setSel(p.id)} tabIndex={0} role="button" aria-label={p.name}
                onKeyDown={(e) => { if (e.key === 'Enter') setSel(p.id); }}>
                {p.tier ? (
                  <>
                    {sel === p.id && <circle cx={x} cy={y} r={7} fill="none" stroke="var(--text, #fff)" strokeWidth={1} opacity={0.8} />}
                    {p.tier === 'major' && <circle cx={x} cy={y} r={3.4} fill={COLOR.port_major} stroke="#fff" strokeWidth={0.7} />}
                    {p.tier === 'new' && <circle cx={x} cy={y} r={3.2} fill="none" stroke={COLOR.port_new} strokeWidth={1.3} strokeDasharray="2 1.4" />}
                    {p.tier === 'minor' && <circle cx={x} cy={y} r={2.1} fill={COLOR.port_minor} />}
                    {p.tier === 'listed' && <circle cx={x} cy={y} r={1.7} fill={COLOR.port_listed} opacity={0.85} />}
                    {lab && <text x={lab.x} y={lab.y} textAnchor={lab.end ? 'end' : 'start'} className="ii-map-plabel">{p.name}</text>}
                  </>
                ) : (
                  <rect x={x - 2.6} y={y - 2.6} width={5.2} height={5.2} transform={`rotate(45 ${x} ${y})`} fill={COLOR[layerOf(p)]} opacity={p.status === 'operational' ? 0.95 : 0.45} />
                )}
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
