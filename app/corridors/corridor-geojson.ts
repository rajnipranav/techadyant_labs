// Builds MapLibre-ready GeoJSON for the corridor map from the authoritative modules.
// Geometry ← geo.ts · scores/tier/status ← corridor-intel.ts + data.ts · nodes ← node-data.ts.
// This is the single bridge: the map is a *view* of the source of truth, never a second dataset.

import { corridors } from './data';
import { intel, TIER_COLOR } from './corridor-intel';
import { corridorDeep, STAGE } from './node-data';
import { nodeGeo, corridorLine } from './geo';

export interface GeoFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] } | { type: 'Point'; coordinates: [number, number] };
  properties: Record<string, string | number | null>;
}
export interface FeatureCollection { type: 'FeatureCollection'; features: GeoFeature[]; }

/** Corridor LineStrings carrying our readiness/tier/status. */
export function corridorFeatures(): FeatureCollection {
  const feats: GeoFeature[] = [];
  for (const c of corridors) {
    const line = corridorLine[c.slug];
    if (!line || line.length < 2) continue;
    const sc = intel[c.slug]?.score;
    feats.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: line },
      properties: {
        slug: c.slug, name: c.name, abbr: c.abbr, status: c.status,
        length: c.length, states: c.states,
        readiness: sc?.total ?? null, tier: sc?.tier ?? null,
        color: sc ? TIER_COLOR[sc.tier] : '#8593A6',
        url: `/corridors/${c.slug}/`,
      },
    });
  }
  return { type: 'FeatureCollection', features: feats };
}

/** Deep-node Points carrying stage, sectors, jobs and the node-page URL. */
export function nodeFeatures(): FeatureCollection {
  const feats: GeoFeature[] = [];
  for (const [cslug, cd] of Object.entries(corridorDeep)) {
    const corridor = corridors.find((c) => c.slug === cslug);
    const corridorReadiness = intel[cslug]?.score?.total ?? null;
    const tier = intel[cslug]?.score?.tier ?? null;
    for (const n of cd.nodes) {
      const g = nodeGeo[`${cslug}/${n.slug}`];
      if (!g) continue;
      feats.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: g.c },
        properties: {
          slug: n.slug, name: n.name, corridor: cslug,
          corridorName: corridor?.name ?? cslug,
          state: n.state, stage: n.stage,
          stageColor: STAGE[n.stage]?.color ?? '#8593A6',
          stageLabel: STAGE[n.stage]?.label ?? n.stage,
          statusLabel: n.statusLabel ?? '',
          sectors: n.sectors ?? '',
          areaAc: n.areaAc ?? null,
          jobs: n.jobs ?? null,
          corridorReadiness, tier,
          coordSource: g.src,
          url: `/corridors/${cslug}/${n.slug}/`,
        },
      });
    }
  }
  return { type: 'FeatureCollection', features: feats };
}
