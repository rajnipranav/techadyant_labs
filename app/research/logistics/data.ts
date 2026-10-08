// India Integrated Logistics Atlas — data layer.
// Reads the build-time snapshot baked from the SID `logistics` schema
// (scripts/bake-logistics.mjs -> public.logistics_export() RPC). Server-imported
// so the page renders to static HTML with the data inlined, same contract as
// app/research/atlas.ts.
//
// Evidence standard (enforced in the SID schema and surfaced verbatim here):
//   verified · single_source · unverified · needs_human_source
// Nothing in this dataset may be filled in by memory — a gap stays a gap.
import data from '../_logistics.json';

export type VerificationStatus = 'verified' | 'single_source' | 'unverified' | 'needs_human_source';

export interface LogisticsSource {
  id: string; publisher: string; title: string; published_on: string | null;
  url: string | null; url_host: string | null; kind: string; is_primary: boolean;
  capture_status: 'captured' | 'snippet_confirmed' | 'title_date_confirmed' | 'lead_only';
  capture_note: string | null; retrieved_on: string | null;
  supports: string | null; quoted_text: string | null;
}

export interface LogisticsProgramme {
  id: string; code: string | null; name: string; ministry: string | null;
  type: 'corridor_programme' | 'port' | 'waterway' | 'policy' | 'authority';
  summary: string | null; key_metrics: Record<string, unknown> | null;
  status: string | null; verification_status: VerificationStatus;
  rationale: string | null; sources: LogisticsSource[];
}
export interface LogisticsCorridor {
  id: string; name: string; mode: 'rail' | 'road' | 'coastal' | 'inland_waterway' | 'multimodal';
  endpoints: string | null; length_km: number | null; length_commissioned_km: number | null;
  status: string | null; programme_id: string | null;
  verification_status: VerificationStatus; rationale: string | null; sources: LogisticsSource[];
}
export interface LogisticsNode {
  id: string; name: string; type: 'port' | 'mmlp' | 'icd' | 'airport' | 'gateway' | 'terminal';
  state: string | null; lat: number | null; lon: number | null;
  throughput: Record<string, unknown> | null; status: string | null; programme_id: string | null;
  verification_status: VerificationStatus; rationale: string | null; sources: LogisticsSource[];
}
export interface LogisticsProject {
  id: string; name: string; programme_id: string | null; cost_cr: number | null;
  mode: string | null; status: string | null; expected_completion: string | null;
  verification_status: VerificationStatus; rationale: string | null; sources: LogisticsSource[];
}
export interface OpportunitySurface {
  id: string; title: string; body: string; basis_programme_ids: string[];
  caveat: string; verification_status: VerificationStatus; sources: LogisticsSource[];
}
export interface LogisticsExport {
  generated_at: string; rpc: string;
  evidence_standard: Record<string, string>;
  programmes: LogisticsProgramme[]; corridors: LogisticsCorridor[];
  nodes: LogisticsNode[]; projects: LogisticsProject[];
  opportunity_surfaces: OpportunitySurface[];
}

export const logistics = data as unknown as LogisticsExport;

/** Verification labels. Verified/single-source/unverified reuse the Atlas
 *  definitions in app/research/insights.ts verbatim; the fourth label marks a
 *  deliberate gap that only a human source-capture can close. */
export const LOG_VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  verified: 'Verified',
  single_source: 'Single-source',
  unverified: 'Analyst-assessed',
  needs_human_source: 'Needs a human source',
};
export const LOG_VERIFICATION_COLOR: Record<VerificationStatus, string> = {
  verified: '#2F8F7F',
  single_source: '#C99A3A',
  unverified: '#5B6CAE',
  needs_human_source: '#8593A6',
};
export const LOG_VERIFICATION_DEFINITION: Record<VerificationStatus, string> = {
  verified: 'Two or more independent primary sources on file (e.g. a ministry disclosure plus an independent dataset).',
  single_source: 'One cited reference on file; not yet independently corroborated.',
  unverified: 'Analyst judgement — no external primary source linked yet.',
  needs_human_source: 'No primary source fully captured yet. Figures are deliberately left blank rather than filled from memory; a human must capture the source first.',
};

/** Build-time verification mix across every labelled record in the module. */
export function logisticsVerificationMix() {
  const counts: Record<string, number> = {};
  const rows: VerificationStatus[] = [
    ...logistics.programmes, ...logistics.corridors, ...logistics.nodes,
    ...logistics.projects, ...logistics.opportunity_surfaces,
  ].map((r) => r.verification_status);
  for (const v of rows) counts[v] = (counts[v] ?? 0) + 1;
  return (Object.keys(LOG_VERIFICATION_LABEL) as VerificationStatus[]).map((k) => ({
    key: k, label: LOG_VERIFICATION_LABEL[k], value: counts[k] ?? 0, color: LOG_VERIFICATION_COLOR[k],
  }));
}

export const PROGRAMME_TYPE_LABEL: Record<LogisticsProgramme['type'], string> = {
  corridor_programme: 'Corridor programme',
  port: 'Ports & maritime',
  waterway: 'Inland waterways',
  policy: 'Policy & digital platform',
  authority: 'Authority / institution',
};
export const PROGRAMME_TYPE_ORDER: LogisticsProgramme['type'][] =
  ['authority', 'corridor_programme', 'port', 'waterway', 'policy'];

export const MODE_LABEL: Record<LogisticsCorridor['mode'], string> = {
  rail: 'Rail', road: 'Road', coastal: 'Coastal shipping',
  inland_waterway: 'Inland waterway', multimodal: 'Multimodal',
};

/** Human labels + unit suffixes for known key_metrics keys. Only metrics in
 *  this map render as headline figures; the map is deliberately explicit. */
const METRIC_LABELS: Record<string, { label: string; unit?: string }> = {
  appraisal_threshold_cr: { label: 'Technical-appraisal threshold', unit: '₹ crore' },
  commitment_cr: { label: 'Government commitment', unit: '₹ crore' },
  commissioned_km: { label: 'Route commissioned', unit: 'km' },
  edfc_km: { label: 'EDFC (Ludhiana–Sonnagar) — construction complete', unit: 'km' },
  wdfc_km: { label: 'WDFC (Dadri–JNPT) — fully operational', unit: 'km' },
  final_sections_dedicated_km: { label: 'Final WDFC sections dedicated, 8 Sep 2026', unit: 'route km' },
  planned_km: { label: 'Planned', unit: 'km' },
  awarded_km: { label: 'Awarded', unit: 'km' },
  constructed_km: { label: 'Constructed', unit: 'km' },
  greenfield_awarded_km: { label: 'Greenfield awarded', unit: 'km' },
  greenfield_completed_km: { label: 'Greenfield completed', unit: 'km' },
  expenditure_cr: { label: 'Expenditure incurred', unit: '₹ crore' },
  nh_road_projects_evaluated: { label: 'NH/road projects evaluated' },
  nh_road_km_approx: { label: 'NH/road km evaluated', unit: 'km (approx.)' },
  nh_road_investment_lakh_cr: { label: 'NH/road investment', unit: '₹ lakh crore' },
  npg_projects_evaluated: { label: 'NPG projects evaluated (all infrastructure)' },
  npg_investment_lakh_cr: { label: 'NPG evaluated investment', unit: '₹ lakh crore' },
  cargo_mmt_fy25: { label: 'Cargo moved FY 2024-25', unit: 'MMT' },
  cargo_mt_fy26: { label: 'Major-port cargo FY 2025-26', unit: 'MT' },
  cargo_mt_fy25: { label: 'Major-port cargo FY 2024-25', unit: 'MT' },
  cargo_mt_fy24: { label: 'Major-port cargo FY 2023-24', unit: 'MT' },
};

/** Render-safe metric rows for one programme. Unknown keys are skipped — they
 *  must be added to METRIC_LABELS (with a source) before they display. */
export function metricRows(p: LogisticsProgramme): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const m = p.key_metrics ?? {};
  for (const [k, cfg] of Object.entries(METRIC_LABELS)) {
    const v = m[k];
    if (v === undefined || v === null) continue;
    const num = typeof v === 'number' ? v.toLocaleString('en-IN') : String(v);
    out.push({ label: cfg.label, value: cfg.unit ? `${num} ${cfg.unit}` : num });
  }
  return out;
}

export const programmeById = (id: string) => logistics.programmes.find((p) => p.id === id);

const fmtDate = (d: string | null) =>
  d && /^\d{4}-\d{2}-\d{2}/.test(d)
    ? new Date(d.slice(0, 10)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : d;
export const sourceLine = (s: LogisticsSource) =>
  `${s.publisher} — ${s.title}${fmtDate(s.published_on) ? ` (${fmtDate(s.published_on)})` : ''}`;
export const lastUpdated = logistics.generated_at;
