// Atlas data layer. Reads the build-time snapshot baked from SID
// (scripts/bake-sid.mjs -> public.atlas_export RPC). Server-imported so the
// pages render to static HTML with the data inlined.
import data from './_atlas.json';

export interface Corridor { id: number; code: string; label: string }
export interface Layer { id: number; code: string; label: string }
export interface StatusLevel { id: number; code: string; label: string }
export interface GridCell {
  corridor_id: number; layer_id: number; layer: string;
  status: number; status_label: string; rationale: string;
  verification: string; date: string;
}
export interface Player {
  id: string; name: string; type_code: string; type: string;
  country: string; description: string; corridors: string[] | null;
}
export interface Relationship {
  source_id: string; source: string; target_id: string; target: string;
  type: string; type_label: string; corridor_id: number | null;
  magnitude: number | null; unit: string | null; description: string;
}
export interface AtlasEvent {
  id: string; corridor_id: number | null; title: string; summary: string;
  date: string; type_code: string; type: string; signal_score: number | null;
}
export interface Atlas {
  generated_at: string; corridors: Corridor[]; layers: Layer[];
  status_levels: StatusLevel[]; grid: GridCell[]; players: Player[];
  relationships: Relationship[]; events: AtlasEvent[];
}

export const atlas = data as Atlas;

export interface CorridorMeta { code: string; slug: string; accent: string; tagline: string }

export const CORRIDOR_META: Record<string, CorridorMeta> = {
  semiconductors:      { code: 'semiconductors',      slug: 'semiconductors',      accent: '#F5B544', tagline: 'Fabs, packaging, materials and the equipment India cannot yet build.' },
  critical_minerals:   { code: 'critical_minerals',   slug: 'critical-minerals',   accent: '#C77D4A', tagline: 'Rare earths, lithium and the refining layer China still controls.' },
  ai_infrastructure:   { code: 'ai_infrastructure',   slug: 'ai-infrastructure',   accent: '#38E1C4', tagline: 'Compute, power and the silicon every Indian data centre imports.' },
  defence:             { code: 'defence',             slug: 'defence',             accent: '#FB923C', tagline: 'Indigenous platforms riding on foreign engines and electronics.' },
  enterprise_software: { code: 'enterprise_software', slug: 'enterprise-software', accent: '#818CF8', tagline: 'The software stack running Indian industry — and who owns each layer.' },
};

export const STATUS_COLORS: string[] = ['#B23B3B', '#C2603A', '#C99A3A', '#9AA63A', '#4FA88B', '#2F8F7F'];
export const STATUS_SHORT: string[] = ['Import-dependent', 'Nascent', 'Emerging', 'Partial', 'Substantial', 'Sovereign'];

export const corridorsOrdered: Corridor[] = [...atlas.corridors].sort((a, b) => a.id - b.id);
export const meta = (code: string): CorridorMeta =>
  CORRIDOR_META[code] ?? { code, slug: code, accent: '#888', tagline: '' };
export const corridorByCode = (code: string) => atlas.corridors.find((c) => c.code === code);
export const corridorById = (id: number) => atlas.corridors.find((c) => c.id === id);

export const gridForCorridor = (id: number): GridCell[] =>
  atlas.grid.filter((g) => g.corridor_id === id).sort((a, b) => a.layer_id - b.layer_id);
export const playersForCorridor = (code: string): Player[] =>
  atlas.players.filter((p) => (p.corridors ?? []).includes(code));

export interface Rollup { code: string; cells: number; importDependent: number; avg: number; weakest: GridCell | null }
export function rollup(corridorId: number): Rollup {
  const cells = gridForCorridor(corridorId);
  const code = corridorById(corridorId)?.code ?? '';
  if (!cells.length) return { code, cells: 0, importDependent: 0, avg: 0, weakest: null };
  const importDependent = cells.filter((c) => c.status === 0).length;
  const avg = cells.reduce((s, c) => s + c.status, 0) / cells.length;
  const weakest = cells.reduce((m, c) => (c.status < m.status ? c : m), cells[0]);
  return { code, cells: cells.length, importDependent, avg, weakest };
}

export const isDomestic = (country: string) => country === 'IN';
export const lastUpdated = atlas.generated_at;

/* ---- Player slugs (stable, unique kebab of name) ---- */
const kebab = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const _slugById = new Map<string, string>();
const _idBySlug = new Map<string, string>();
(() => {
  const used = new Set<string>();
  for (const p of [...atlas.players].sort((a, b) => a.name.localeCompare(b.name))) {
    let base = kebab(p.name); if (!base) base = p.id.slice(0, 8);
    let s = base, n = 2;
    while (used.has(s)) { s = `${base}-${n++}`; }
    used.add(s); _slugById.set(p.id, s); _idBySlug.set(s, p.id);
  }
})();
export const playerSlug = (id: string): string => _slugById.get(id) ?? id;
export const playerById = (id: string): Player | undefined => atlas.players.find((p) => p.id === id);
export const playerBySlug = (slug: string): Player | undefined => {
  const id = _idBySlug.get(slug); return id ? playerById(id) : undefined;
};
export const allPlayers: Player[] = atlas.players;

/* ---- Relationships ---- */
export interface Edge { rel: Relationship; dir: 'out' | 'in'; otherId: string; other: string }
export function relationshipsFor(entityId: string): Edge[] {
  const out: Edge[] = [];
  for (const r of atlas.relationships) {
    if (r.source_id === entityId) out.push({ rel: r, dir: 'out', otherId: r.target_id, other: r.target });
    else if (r.target_id === entityId) out.push({ rel: r, dir: 'in', otherId: r.source_id, other: r.source });
  }
  return out;
}
// Supply/dependency chokepoints: rank entities by how many distinct players depend on / are supplied by them.
export interface Chokepoint { id: string; name: string; inbound: number; players: Player[] }
export function chokepointsForCorridor(code: string): Chokepoint[] {
  const cid = corridorByCode(code)?.id ?? null;
  const counts = new Map<string, Set<string>>();
  for (const r of atlas.relationships) {
    if (!['supplies_to', 'depends_on'].includes(r.type)) continue;
    if (cid !== null && r.corridor_id !== null && r.corridor_id !== cid) continue;
    // the "depended-upon" node is the supplier (source of supplies_to) or the target of depends_on
    const key = r.type === 'supplies_to' ? r.source_id : r.target_id;
    const dep = r.type === 'supplies_to' ? r.target_id : r.source_id;
    if (!counts.has(key)) counts.set(key, new Set());
    counts.get(key)!.add(dep);
  }
  return [...counts.entries()]
    .map(([id, deps]) => ({ id, name: playerById(id)?.name ?? id, inbound: deps.size, players: [...deps].map(playerById).filter((p): p is Player => Boolean(p)) }))
    .filter((c) => playerById(c.id))
    .sort((a, b) => b.inbound - a.inbound);
}

/* ---- Events ---- */
export const eventsForCorridor = (id: number): AtlasEvent[] =>
  atlas.events.filter((e) => e.corridor_id === id);
export const recentEvents = (n = 8): AtlasEvent[] => atlas.events.slice(0, n);
