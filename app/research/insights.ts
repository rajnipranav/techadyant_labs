// Derived, build-time insights for the visual layers (Pulse strip, Atlas health,
// Biggest gaps, corridor readiness). Everything here is computed from existing
// data modules — no hand-typed figures — so it cannot drift from the source.
import { atlas, corridorById, STATUS_SHORT, type GridCell } from './atlas';
import { signals } from '../signals/data';
import { corridorDeep, STAGE } from '../corridors/node-data';

export const VERIFICATION_LABEL: Record<string, string> = {
  verified: 'Verified',
  single_source: 'Single-source',
  unverified: 'Unverified',
};
export const VERIFICATION_COLOR: Record<string, string> = {
  verified: '#2F8F7F',
  single_source: '#C99A3A',
  unverified: '#8593A6',
};

/** Verified / single-source / unverified split across all layer assessments. */
export function verificationMix() {
  const counts: Record<string, number> = {};
  for (const g of atlas.grid) counts[g.verification] = (counts[g.verification] ?? 0) + 1;
  return Object.keys(VERIFICATION_LABEL).map((k) => ({
    key: k, label: VERIFICATION_LABEL[k], value: counts[k] ?? 0, color: VERIFICATION_COLOR[k],
  }));
}

export interface Gap extends GridCell { ecosystem: string }

/** Lowest-scoring layers across every scored ecosystem (ties keep source order). */
export function biggestGaps(n = 5): Gap[] {
  return [...atlas.grid]
    .map((g, i) => ({ g, i }))
    .sort((a, b) => a.g.status - b.g.status || a.i - b.i)
    .slice(0, n)
    .map(({ g }) => ({ ...g, ecosystem: corridorById(g.corridor_id)?.label ?? '' }));
}

/** Mean capture score (0–5) per scored ecosystem. */
export function scoreSpread() {
  return atlas.corridors.map((c) => {
    const cells = atlas.grid.filter((g) => g.corridor_id === c.id);
    const avg = cells.length ? cells.reduce((s, g) => s + g.status, 0) / cells.length : 0;
    return { id: c.id, label: c.label, avg, cells: cells.length };
  });
}

export const statusLabel = (n: number) => STATUS_SHORT[n] ?? '';

/** Corridor nodes by development stage (from the deep node dataset). */
export function nodesByStage() {
  const nodes = Object.values(corridorDeep).flatMap((c) => c.nodes);
  return (Object.keys(STAGE) as (keyof typeof STAGE)[]).map((k) => ({
    key: k, label: STAGE[k].label, color: STAGE[k].color,
    value: nodes.filter((n) => n.stage === k).length,
  }));
}

const DAY = 86_400_000;
/** Live-signal activity relative to a reference date (defaults to the newest live signal, so a stale build never reads as "0"). */
export function signalPulse() {
  const live = signals.filter((s) => s.status === 'live');
  const ts = live.map((s) => Date.parse(s.date)).filter((t) => !Number.isNaN(t));
  const ref = ts.length ? Math.max(...ts) : 0;
  const within = (from: number, to: number) => ts.filter((t) => ref - t >= from && ref - t < to).length;
  const byDomain: Record<string, number> = {};
  for (const s of live) if (ref - Date.parse(s.date) < 30 * DAY) byDomain[s.domain] = (byDomain[s.domain] ?? 0) + 1;
  return {
    asOf: ref ? new Date(ref).toISOString().slice(0, 10) : '',
    last7: within(0, 7 * DAY), prev7: within(7 * DAY, 14 * DAY), last30: within(0, 30 * DAY),
    byDomain: Object.entries(byDomain).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
  };
}
