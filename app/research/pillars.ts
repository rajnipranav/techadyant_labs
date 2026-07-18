/**
 * Pillar deep-view helpers — a system-map read of each industrial pillar,
 * built on the baked Atlas graph (_atlas.json via ./atlas). See PILLAR-DEEP-VIEW-SPEC.md.
 */
import { atlas, corridorByCode, CORRIDOR_META, playerById, isDomestic } from './atlas';
import type { Player, Relationship, Corridor } from './atlas';

export const PILLAR_THESIS: Record<string, string> = {
  semiconductors: 'India is funding the fab, but roughly 65% of the value chain — the eight upstream streams and their chokepoints — is still imported.',
  critical_minerals: 'India can mine, but the refining and magnet-making layer that turns ore into usable material is controlled abroad, mostly by China.',
  ai_infrastructure: 'India is building data centres at scale, yet the compute, memory and silicon inside them are almost entirely imported.',
  defence: 'India integrates world-class platforms on a subsystem base — engines, seekers, RF electronics — it does not yet own.',
  enterprise_software: 'The software stack running Indian industry — ERP, cloud and databases — is overwhelmingly foreign-owned, layer by layer.',
};

export const PILLAR_SLUGS: string[] = Object.values(CORRIDOR_META).map((m) => m.slug);

export function pillarCorridor(slug: string): Corridor | null {
  const code = Object.values(CORRIDOR_META).find((m) => m.slug === slug)?.code;
  return code ? corridorByCode(code) ?? null : null;
}

function playerSet(code: string): Set<string> {
  return new Set(atlas.players.filter((p) => (p.corridors ?? []).includes(code)).map((p) => p.id));
}

export function pillarPlayers(code: string): Player[] {
  return atlas.players
    .filter((p) => (p.corridors ?? []).includes(code))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function pillarRelationships(code: string): Relationship[] {
  const cid = corridorByCode(code)?.id ?? null;
  const set = playerSet(code);
  return atlas.relationships.filter(
    (r) => (cid !== null && r.corridor_id === cid) || (set.has(r.source_id) && set.has(r.target_id)),
  );
}

export type Kind = 'foreign' | 'india' | 'neutral';
export interface StreamMember { id: string; name: string; kind: Kind }
export interface StreamRow { id: string; name: string; members: StreamMember[]; risk: 'import' | 'contested' | 'india' }

function kindOf(p: Player): Kind {
  if (p.type_code === 'foreign_supplier') return 'foreign';
  return isDomestic(p.country) ? 'india' : 'neutral';
}

export function streamsOf(code: string): StreamRow[] {
  const set = playerSet(code);
  const streams = atlas.players.filter(
    (p) => set.has(p.id) && (p.type_code === 'opportunity_surface' || p.type_code === 'ecosystem'),
  );
  const rels = pillarRelationships(code);
  return streams
    .map((s) => {
      const memberIds = rels
        .filter((r) => (r.type === 'part_of' || r.type === 'component_of') && r.target_id === s.id)
        .map((r) => r.source_id);
      const members: StreamMember[] = memberIds
        .map((id) => {
          const p = playerById(id);
          return p ? { id, name: p.name, kind: kindOf(p) } : null;
        })
        .filter((m): m is StreamMember => Boolean(m));
      const hasForeign = members.some((m) => m.kind === 'foreign');
      const hasIndia = members.some((m) => m.kind === 'india');
      const risk: StreamRow['risk'] = hasForeign ? (hasIndia ? 'contested' : 'import') : hasIndia ? 'india' : 'contested';
      return {
        id: s.id,
        name: s.name.replace(/\s*\((opportunity stream|chokepoint)\)/i, ''),
        members,
        risk,
      };
    })
    .sort((a, b) => b.members.length - a.members.length);
}

export interface Choke {
  source: string; sourceId: string; target: string; targetId: string;
  type: string; magnitude: number | null; unit: string | null; description: string;
}
export function chokepoints(code: string): Choke[] {
  return pillarRelationships(code)
    .filter((r) => r.type === 'controls' || r.type === 'depends_on')
    .map((r) => ({
      source: r.source, sourceId: r.source_id, target: r.target, targetId: r.target_id,
      type: r.type, magnitude: r.magnitude, unit: r.unit, description: r.description,
    }))
    .sort((a, b) => (b.magnitude ?? -1) - (a.magnitude ?? -1));
}

export function fmtMagnitude(mag: number | null, unit: string | null): string {
  if (mag === null || mag === undefined) return '';
  if (unit && /pct/i.test(unit)) return `${mag}%`;
  if (unit && /inr_cr/i.test(unit)) return `₹${mag.toLocaleString('en-IN')} cr`;
  return unit ? `${mag} ${unit.replace(/_/g, ' ')}` : String(mag);
}

export interface RoleGroup { label: string; players: Player[] }
export function playersByRole(code: string): RoleGroup[] {
  const ps = pillarPlayers(code);
  const g = (codes: string[], pred?: (p: Player) => boolean) =>
    ps.filter((p) => codes.includes(p.type_code) && (!pred || pred(p)));
  return [
    { label: 'Foreign incumbents', players: g(['foreign_supplier']) },
    { label: 'Indian challengers', players: g(['company', 'psu', 'jv'], (p) => isDomestic(p.country)) },
    { label: 'Facilities & anchors', players: g(['facility', 'industrial_park', 'district_cluster', 'mine', 'infrastructure_node']) },
    { label: 'Schemes & agencies', players: g(['scheme', 'policy', 'ministry', 'govt_body', 'industry_body', 'research_institution']) },
    { label: 'Streams & inputs', players: g(['opportunity_surface', 'ecosystem', 'mineral_material', 'technology', 'product', 'process', 'machine', 'standard']) },
  ].filter((r) => r.players.length > 0);
}

export interface CrossEdge { rel: Relationship; otherId: string; otherSlug: string; otherLabel: string; otherName: string; inThisName: string }
export function crossPillarEdges(code: string): CrossEdge[] {
  const set = playerSet(code);
  const out: CrossEdge[] = [];
  const seen = new Set<string>();
  for (const r of atlas.relationships) {
    const sIn = set.has(r.source_id);
    const tIn = set.has(r.target_id);
    if (sIn === tIn) continue;
    const otherId = sIn ? r.target_id : r.source_id;
    const op = playerById(otherId);
    const otherCode = (op?.corridors ?? []).find((cc) => cc !== code);
    if (!op || !otherCode) continue;
    const m = CORRIDOR_META[otherCode];
    if (!m) continue;
    const key = `${r.source_id}-${r.type}-${r.target_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      rel: r, otherId, otherSlug: m.slug, otherLabel: otherCode.replace(/_/g, ' '),
      otherName: op.name, inThisName: sIn ? r.source : r.target,
    });
  }
  return out.slice(0, 20);
}

export function pillarStats(code: string) {
  const ps = pillarPlayers(code);
  const india = ps.filter((p) => isDomestic(p.country)).length;
  return {
    players: ps.length,
    relationships: pillarRelationships(code).length,
    chokepoints: chokepoints(code).length,
    indiaPct: ps.length ? Math.round((india / ps.length) * 100) : 0,
  };
}
