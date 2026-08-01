// Critical Manufacturing Dependencies — data layer over the CMD dataset (cmd.json).
// The dataset is a MODELLED intelligence layer: most scores are Reasoned Estimates (R),
// with Verified (V) and Strategic-Inference (S) rows flagged. Confidence is surfaced in the UI.
// Regenerate the JSON from Reports and DPR/.../techadyant-cmd-vertical-v1 (+ reconciliation pass).

import cmd from './_cmd.json';

export type Confidence = 'V' | 'R' | 'S';

export interface Product {
  product_id: string; hs_code: string; name: string; mega_sector: string; sub_sector: string; taxonomy_level: string;
  import_usd_bn: number; import_inr_cr: number; top_source_country: string; source_hhi: number;
  top_3_sources: { country: string; share_pct: number }[];
  cmdi: number; lpi: number; iai: number; sci: number; tri: number; epi: number; sri: number; imi: number; nsri: number; icgi: number;
  index_inputs: Record<string, Record<string, number>>;
  india_capability_pct: number; dependency_tier: string; localisation_verdict: string;
  why_imported: string; why_it_matters: string; can_india_localise: string;
  investment_required_inr_cr: number | null; localisation_difficulty: number | null; time_to_scale_years: number | null;
  global_manufacturers: string[]; indian_manufacturers: string[]; related_projects: string[]; related_signals: string[];
  atlas_entity: string | null; trend: string; confidence: Confidence; sources: string[]; note?: string;
}
export interface Sector {
  sector_id: string; name: string; total_import_usd_bn: number; avg_cmdi: number; critical_product_count: number;
  sector_dependency_index: number; index_trend: { direction: string; delta: number };
  top_products: string[]; top_opportunities: string[]; key_indian_manufacturers: string[]; key_policies: string[];
  narrative: string; confidence: Confidence; sources: string[];
}
export interface StateRow {
  state_id: string; name: string; mci_composite: number; sub_dimensions: Record<string, number>;
  dependency_reduction_score: number; new_factories_12mo: number; pli_projects: number; pli_investment_inr_cr: number;
  lead_sectors: string[]; flagship_projects: string[]; narrative: string; confidence: Confidence; sources: string[];
}
export interface Opportunity {
  opportunity_id: string; name: string; linked_products: string[]; sector_id: string;
  opportunity_score: number; growth_score: number; investment_required_inr_cr: number | null;
  localisation_difficulty: number | null; industrial_multiplier: number; govt_support: string; tier: string;
  tam_usd_bn: number | null; rationale: string; confidence: Confidence; sources: string[];
}
export interface Company { company_id: string; name: string; type: string; country: string; hq_state?: string; sectors: string[]; products_made: string[]; role: string; capability_score: number; listed?: string; note?: string; confidence: Confidence; sources?: string[]; }
export interface Factory { factory_id: string; name: string; company_id: string; product_ids: string[]; state_id: string; district?: string; status: string; capacity?: string; investment_inr_cr: number | null; jobs?: number | null; commissioning_year?: string | number | null; scheme?: string; lat?: number | null; lon?: number | null; confidence: Confidence; sources: string[]; note?: string; }
export interface PliScheme { scheme_id: string; name: string; sector_id: string; outlay_inr_cr: number; realised_inr_cr: number; utilisation_pct: number; assessment: string; confidence: Confidence; sources: string[]; note?: string; }
export interface IndexPoint { month: string; overall_index: number; sector_indices: Record<string, number>; confidence?: Confidence; }

const data = cmd as unknown as {
  meta: Record<string, unknown>;
  products: Product[]; sectors: Sector[]; states: StateRow[]; opportunities: Opportunity[];
  companies: Company[]; factories: Factory[]; pli_schemes: PliScheme[]; index_history: IndexPoint[];
};

export const products = data.products;
export const sectors = data.sectors;
export const states = data.states;
export const opportunities = data.opportunities;
export const companies = data.companies;
export const factories = data.factories;
export const pliSchemes = data.pli_schemes;
export const indexHistory = data.index_history;

const pMap = new Map(products.map((p) => [p.product_id, p]));
const sMap = new Map(sectors.map((s) => [s.sector_id, s]));
const stMap = new Map(states.map((s) => [s.state_id, s]));
const cMap = new Map(companies.map((c) => [c.company_id, c]));
const fMap = new Map(factories.map((f) => [f.factory_id, f]));

export const productBySlug = (id: string) => pMap.get(id);
export const sectorBySlug = (id: string) => sMap.get(id);
export const stateBySlug = (id: string) => stMap.get(id);
export const companyById = (id: string) => cMap.get(id);
export const factoryById = (id: string) => fMap.get(id);
export const companyName = (id: string) => (id ? (cMap.get(id)?.name ?? id) : 'Undisclosed operator');

export const productsInSector = (sid: string) => products.filter((p) => p.mega_sector === sid);
export const opportunitiesInSector = (sid: string) => opportunities.filter((o) => o.sector_id === sid);
export const factoriesInState = (sid: string) => factories.filter((f) => f.state_id === sid);
export const productsForFactory = (f: Factory) => (f.product_ids || []).map((id) => pMap.get(id)).filter(Boolean) as Product[];

export const latestIndex = indexHistory[indexHistory.length - 1];
export const overallIndex = latestIndex?.overall_index ?? 0;
export const sectorsRanked = [...sectors].sort((a, b) => b.sector_dependency_index - a.sector_dependency_index);
export const statesRanked = [...states].sort((a, b) => b.mci_composite - a.mci_composite);
export const topDependencies = (n = 12) => [...products].sort((a, b) => b.cmdi - a.cmdi).slice(0, n);
export const buildNowOpportunities = (n = 12) =>
  [...opportunities].filter((o) => o.tier === 'Build-now').sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, n);

// ── UI helpers ──
export const TIER_COLOR: Record<string, string> = { 'Build-now': '#0F8E78', 'Position-early': '#B5891E', 'Watch': '#8593A6' };
export const DEP_TIER_COLOR: Record<string, string> = { Critical: '#C0392B', High: '#B5891E', Moderate: '#2E86C1', Low: '#0F8E78' };
export const CONF: Record<Confidence, { label: string; color: string; bg: string }> = {
  V: { label: 'Verified', color: '#0F8E78', bg: '#e6f4ee' },
  R: { label: 'Reasoned estimate', color: '#B5891E', bg: '#fdf3e0' },
  S: { label: 'Strategic inference', color: '#8593A6', bg: '#eef1f5' },
};
export const inr = (cr?: number | null) => (cr == null ? '—' : cr >= 100000 ? `₹${(cr / 100000).toFixed(2)} lakh cr` : `₹${Math.round(cr).toLocaleString('en-IN')} cr`);
export const usd = (bn?: number | null) => (bn == null ? '—' : `$${bn.toFixed(bn < 1 ? 2 : 1)} bn`);
