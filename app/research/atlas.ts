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
export interface Atlas {
  generated_at: string; corridors: Corridor[]; layers: Layer[];
  status_levels: StatusLevel[]; grid: GridCell[]; players: Player[];
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

// 0 import-dependent -> 5 captured/sovereign, as a heat scale.
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
