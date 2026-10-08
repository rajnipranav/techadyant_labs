// Techadyant scoring engine — methodology v1.0 (docs/industrial-connectivity-methodology.md).
// Pure functions, type-only imports: loadable by `node --experimental-strip-types` for tests.
import type { Confidence, RequirementProfile, ScoreComponentResult, ScoreKey, ScoreResult } from './types';

export const METHODOLOGY_VERSION = '1.0';
export const COMPLETENESS_THRESHOLD = 0.7;

export interface ComponentDef { key: string; label: string; weight: number; rule: string }
export interface ScoreDef {
  key: ScoreKey;
  label: string;
  short: string;
  question: string;
  phase1: 'computed' | 'defined';
  higherIs: 'better' | 'worse';
  components: ComponentDef[];
  whyNotComputed?: string;
}

export const ICS: ScoreDef = {
  key: 'ics', label: 'Industrial Connectivity Score', short: 'ICS', phase1: 'computed', higherIs: 'better',
  question: 'How well is this node physically connected to the national freight, gateway and logistics network?',
  components: [
    { key: 'road', label: 'Road', weight: 20, rule: '1.0 expressway · 0.8 expressway on trial · 0.6 national highway · 0.3 state highway only' },
    { key: 'rail', label: 'Rail', weight: 20, rule: '1.0 DFC station ≤ 25 km · 0.6 mainline station with goods handling · 0.5 broad-gauge line, goods handling not documented · 0.3 new line approved' },
    { key: 'port', label: 'Seaport', weight: 20, rule: 'straight-line to nearest registered gateway port: ≤150 km 1.0 · ≤300 0.7 · ≤500 0.4 · >500 0.15' },
    { key: 'airport', label: 'Airport (cargo)', weight: 20, rule: 'straight-line to nearest operational international cargo airport: ≤50 km 1.0 · ≤100 0.7 · ≤200 0.4 · >200 0.15' },
    { key: 'logistics', label: 'Logistics node', weight: 10, rule: 'operational MMLP/ICD/MMLH ≤50 km 1.0 · under construction ≤50 km or operational ≤150 km 0.5' },
    { key: 'freight_corridor', label: 'Freight corridor', weight: 10, rule: 'operational DFC ≤50 km 1.0 · ≤150 km 0.5 · evidenced >150 km 0.0' },
  ],
};

export const PROFILE_LABELS: Record<RequirementProfile, { short: string; long: string; ecosystem: string }> = {
  semiconductor_fab:     { short: 'Fab', long: 'fab', ecosystem: 'Semiconductor' },
  semiconductor_backend: { short: 'Backend (OSAT)', long: 'chip-packaging (OSAT/ATMP)', ecosystem: 'Semiconductor' },
  electronics_assembly:  { short: 'Electronics assembly', long: 'electronics-assembly', ecosystem: 'Electronics' },
};

export const CGI_PROFILES: Record<RequirementProfile, Record<string, number>> = {
  semiconductor_fab:     { air_cargo: 20, power: 20, water: 20, port_access: 15, warehousing: 10, multimodal: 15 },
  semiconductor_backend: { air_cargo: 30, power: 20, water: 10, port_access: 15, warehousing: 15, multimodal: 10 },
  electronics_assembly:  { air_cargo: 25, power: 15, water: 5, port_access: 25, warehousing: 15, multimodal: 15 },
};
export const CGI_LABELS: Record<string, string> = {
  air_cargo: 'Air cargo (time-critical, high-value)',
  power: 'Power reliability',
  water: 'Industrial water',
  port_access: 'Seaport access (bulk chemicals, gases, equipment)',
  warehousing: 'Specialised warehousing (bonded, ESD, climate-controlled)',
  multimodal: 'Multimodal integration (rail–road–air)',
};
export const CGI_STATUS_VALUE: Record<'met' | 'partial' | 'gap' | 'unknown', number | null> = { met: 0, partial: 0.5, gap: 1, unknown: null };

export const CGI: ScoreDef = {
  key: 'cgi', label: 'Connectivity Gap Index', short: 'CGI', phase1: 'computed', higherIs: 'worse',
  question: 'How far does available infrastructure fall short of what the anchor industry needs? High = large gap (constraint and opportunity).',
  components: Object.entries(CGI_PROFILES.semiconductor_fab).map(([key, weight]) => ({ key, label: CGI_LABELS[key], weight, rule: 'met 0 · partial 0.5 · gap 1.0 · unknown = missing (weights vary by requirement profile)' })),
};

export const SCCS: ScoreDef = {
  key: 'sccs', label: 'Supply Chain Connectivity Score', short: 'SCCS', phase1: 'computed', higherIs: 'better',
  question: 'How efficiently can the node’s critical inputs and outputs move?',
  components: [
    { key: 'supplier_proximity', label: 'Supplier proximity', weight: 25, rule: 'mean over the profile’s critical input categories: operating supplier ≤300 km 1.0 · operating in-state, distance undocumented 0.5 · planned/MoU ≤300 km 0.25 · none documented 0' },
    { key: 'import_gateway', label: 'Import-gateway access', weight: 20, rule: 'ICS seaport and airport values weighted by the inbound mix (fab 50/50 · backend 40/60 · electronics assembly 50/50 sea/air)' },
    { key: 'export_gateway', label: 'Export-gateway access', weight: 20, rule: 'ICS seaport and airport values weighted by the outbound mix (fab 30/70 · backend 10/90 · electronics assembly 40/60 sea/air)' },
    { key: 'multimodal', label: 'Multimodal access', weight: 15, rule: 'share of four modes in usable reach: road ≥0.6, rail ≥0.6, air ≥0.7, sea ≥0.7 (ICS values; an unknown mode counts as not in reach)' },
    { key: 'freight_infra', label: 'Freight infrastructure', weight: 20, rule: 'the higher of the ICS freight-corridor and logistics-node values' },
  ],
};

export const SUPPLIER_STATUS_VALUE = { operational_local: 1, operational_regional: 0.5, planned_local: 0.25, none_documented: 0 } as const;
export type SupplierStatus = keyof typeof SUPPLIER_STATUS_VALUE;
export const GATEWAY_MIX: Record<RequirementProfile, { inbound: { sea: number; air: number }; outbound: { sea: number; air: number } }> = {
  semiconductor_fab: { inbound: { sea: 0.5, air: 0.5 }, outbound: { sea: 0.3, air: 0.7 } },
  semiconductor_backend: { inbound: { sea: 0.4, air: 0.6 }, outbound: { sea: 0.1, air: 0.9 } },
  electronics_assembly: { inbound: { sea: 0.5, air: 0.5 }, outbound: { sea: 0.4, air: 0.6 } },
};

/** SCCS components from ICS component values + the supplier-proximity value (pure). */
export function sccsFromInputs(
  profile: RequirementProfile,
  ics: Record<string, { value: number | null; confidence: Confidence | null }>,
  supplier: { value: number | null; confidence: Confidence | null; rationale: string },
): ScoreComponentResult[] {
  const mix = GATEWAY_MIX[profile];
  const v = (k: string) => ics[k]?.value ?? null;
  const c = (...ks: string[]): Confidence | null => {
    const cs = ks.map((k) => ics[k]?.confidence ?? null);
    if (cs.some((x) => !x)) return null;
    return (cs as Confidence[]).reduce((a, b) => (RANK[a] <= RANK[b] ? a : b));
  };
  const gw = (m: { sea: number; air: number }) => (v('port') === null || v('airport') === null ? null : m.sea * (v('port') as number) + m.air * (v('airport') as number));
  const modes = [['road', 0.6], ['rail', 0.6], ['airport', 0.7], ['port', 0.7]] as const;
  const inReach = modes.filter(([k, t]) => (v(k) ?? -1) >= t).length;
  const fi = [v('freight_corridor'), v('logistics')].filter((x): x is number => x !== null);
  const def = Object.fromEntries(SCCS.components.map((x) => [x.key, x]));
  const row = (key: string, value: number | null, confidence: Confidence | null, rationale: string): ScoreComponentResult =>
    ({ key, label: def[key].label, weight: def[key].weight, value: value === null ? null : Math.round(value * 1000) / 1000, confidence, rationale });
  return [
    row('supplier_proximity', supplier.value, supplier.confidence, supplier.rationale),
    row('import_gateway', gw(mix.inbound), c('port', 'airport'), `${Math.round(mix.inbound.sea * 100)}% sea × ICS seaport + ${Math.round(mix.inbound.air * 100)}% air × ICS airport.`),
    row('export_gateway', gw(mix.outbound), c('port', 'airport'), `${Math.round(mix.outbound.sea * 100)}% sea × ICS seaport + ${Math.round(mix.outbound.air * 100)}% air × ICS airport.`),
    row('multimodal', inReach / 4, c('road', 'airport', 'port'), `${inReach} of 4 modes in usable reach (road, rail, air, sea).`),
    row('freight_infra', fi.length ? Math.max(...fi) : null, c('freight_corridor'), 'Higher of the ICS freight-corridor and logistics-node values.'),
  ];
}

export const IOS: ScoreDef = {
  key: 'ios', label: 'Industrial Opportunity Score', short: 'IOS', phase1: 'defined', higherIs: 'better',
  question: 'How much industrial opportunity is a change likely to open at this node?',
  components: [
    { key: 'infra_trigger', label: 'Infrastructure investment trigger', weight: 20, rule: 'sourced projects affecting the node' },
    { key: 'demand_growth', label: 'Demand growth', weight: 15, rule: 'sourced anchor capacity ramp' },
    { key: 'import_dependency', label: 'Import dependency of inputs', weight: 20, rule: 'Atlas grid status for the anchor ecosystem' },
    { key: 'supplier_gap', label: 'Supplier gap', weight: 15, rule: 'critical input categories with no supplier ≤ 300 km' },
    { key: 'localisation_feasibility', label: 'Localisation feasibility', weight: 10, rule: 'analyst rubric: capex, IP barrier, volume' },
    { key: 'logistics_improvement', label: 'Logistics improvement', weight: 10, rule: 'ICS delta from projects completing ≤ 3 yrs' },
    { key: 'policy_support', label: 'Policy support', weight: 10, rule: 'sourced scheme coverage' },
  ],
  whyNotComputed: 'Supplier gap and localisation feasibility depend on the SCCS supplier mapping; demand ramp is only partly sourced.',
};

export const SNS: ScoreDef = {
  key: 'sns', label: 'Strategic Node Score', short: 'SNS', phase1: 'defined', higherIs: 'better',
  question: 'How important is this location to India’s industrial network?',
  components: [
    { key: 'sector_concentration', label: 'Sector concentration', weight: 20, rule: 'approved/operating units in strategic sectors' },
    { key: 'strategic_presence', label: 'Strategic industry presence', weight: 20, rule: 'ISM / defence / critical-mineral designations' },
    { key: 'transport_convergence', label: 'Transport convergence', weight: 15, rule: 'operational modes (from ICS)' },
    { key: 'centrality', label: 'Supply-chain centrality', weight: 15, rule: 'degree / betweenness in the Atlas graph' },
    { key: 'export_relevance', label: 'Export relevance', weight: 10, rule: 'sourced export share or designation' },
    { key: 'infra_investment', label: 'Infrastructure investment', weight: 10, rule: 'sum of sourced project costs' },
    { key: 'designation', label: 'National strategic designation', weight: 10, rule: 'NICDP node, SIR, defence corridor, etc.' },
  ],
  whyNotComputed: 'Export relevance and graph centrality are not yet computed consistently across nodes; four-node rankings would be false precision.',
};

export const SCORE_DEFS: ScoreDef[] = [ICS, SCCS, CGI, IOS, SNS];

/* --------------------------------------------------------------- math */

export const round5 = (x: number): number => 5 * Math.round(x / 5);

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
/** Straight-line km rounded to 5 km (never display more precision than the coordinates support). */
export const roundKm = (km: number): number => Math.max(5, round5(km));

export const DISTANCE_BANDS: Record<string, { maxKm: number; value: number }[]> = {
  port:             [{ maxKm: 150, value: 1 }, { maxKm: 300, value: 0.7 }, { maxKm: 500, value: 0.4 }, { maxKm: Infinity, value: 0.15 }],
  airport:          [{ maxKm: 50, value: 1 }, { maxKm: 100, value: 0.7 }, { maxKm: 200, value: 0.4 }, { maxKm: Infinity, value: 0.15 }],
  logistics:        [{ maxKm: 50, value: 1 }, { maxKm: 150, value: 0.5 }, { maxKm: Infinity, value: 0 }],
  freight_corridor: [{ maxKm: 50, value: 1 }, { maxKm: 150, value: 0.5 }, { maxKm: Infinity, value: 0 }],
};
export function bandValue(component: string, km: number): number {
  const bands = DISTANCE_BANDS[component];
  if (!bands) throw new Error(`No distance bands for component "${component}"`);
  return bands.find((b) => km <= b.maxKm)!.value;
}

const RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };
const minConf = (a: Confidence, b: Confidence): Confidence => (RANK[a] <= RANK[b] ? a : b);

export function bandLabel(def: ScoreDef, score: number): string {
  const words = def.higherIs === 'worse' ? ['Low gap', 'Moderate gap', 'High gap', 'Severe gap'] : ['Weak', 'Moderate', 'Strong', 'Very strong'];
  if (score < 40) return words[0];
  if (score < 60) return words[1];
  if (score < 80) return words[2];
  return words[3];
}

/** Shared computation (§1.1–1.2 of the methodology). */
export function computeScore(def: ScoreDef, components: ScoreComponentResult[], note = ''): ScoreResult {
  const total = components.reduce((s, c) => s + c.weight, 0);
  const known = components.filter((c) => c.value !== null && c.value !== undefined);
  const knownW = known.reduce((s, c) => s + c.weight, 0);
  const completeness = total ? knownW / total : 0;
  const base = {
    key: def.key, label: def.label, methodology_version: METHODOLOGY_VERSION,
    data_completeness: Math.round(completeness * 100) / 100, components,
  };
  if (!known.length || completeness < COMPLETENESS_THRESHOLD) {
    return { ...base, status: 'insufficient_data', score: null, band: null, confidence: null,
      note: note || `Known inputs cover ${Math.round(completeness * 100)}% of the weight; ${Math.round(COMPLETENESS_THRESHOLD * 100)}% is required.` };
  }
  const raw = (100 * known.reduce((s, c) => s + c.weight * (c.value as number), 0)) / knownW;
  const score = Math.min(100, Math.max(0, round5(raw)));
  const tier1: Confidence = completeness >= 0.9 ? 'high' : completeness >= 0.8 ? 'medium' : 'low';
  const lowW = known.filter((c) => c.confidence === 'low' || c.confidence === null).reduce((s, c) => s + c.weight, 0);
  const highW = known.filter((c) => c.confidence === 'high').reduce((s, c) => s + c.weight, 0);
  const tier2: Confidence = lowW / knownW > 0.25 ? 'low' : highW / knownW >= 0.5 ? 'high' : 'medium';
  return { ...base, status: 'computed', score, band: bandLabel(def, score), confidence: minConf(tier1, tier2), note };
}

/** A defined-but-not-yet-computed score: all components missing → Insufficient Data. */
export function notYetComputed(def: ScoreDef): ScoreResult {
  return computeScore(
    def,
    def.components.map((c) => ({ key: c.key, label: c.label, weight: c.weight, value: null, confidence: null, rationale: 'Input not yet collected.' })),
    def.whyNotComputed ?? '',
  );
}
