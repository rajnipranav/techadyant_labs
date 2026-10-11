// PM GatiShakti Cargo Terminals (GCT) — loader for the dedicated terminal layer.
// Server-only. The dataset is a verified SAMPLE, not a national census: Atlas-verified
// records carry their own commissioning date and primary source, while the network
// aggregates (142/150 commissioned, 224 MTPA) are sourced separately and must never be
// derived from, or reconciled against, the record count.
import file from '../../../data/programme-intelligence/cargo-terminals.json';
import { sources } from '../industrial/data';
import type { ProvenanceRef, SourceRecord } from '../industrial/types';

export type GctStatus = 'commissioned' | 'sanctioned' | 'under_construction' | 'proposed' | 'development_stage';
export type GctOperator =
  | 'railway_operated' | 'dfccil_operated' | 'private_operated'
  | 'private_siding_company_operated' | 'tendered_unawarded';

export interface GctCapacity {
  value: number | null;
  unit: string | null;
  as_of: string | null;
  note: string | null;
}

export interface CargoTerminal {
  id: string;
  slug: string;
  canonical_name: string;
  alternative_names: string[];
  state: string | null;
  district: string | null;
  locality: string | null;
  railway_zone: string | null;
  railway_division: string | null;
  operating_entity: string | null;
  operator_type: GctOperator;
  commodity_focus: string[];
  status: GctStatus;
  status_note: string | null;
  approval_date: string | null;
  construction_start_date: string | null;
  commissioning_date: string | null;
  operational_status: string | null;
  capacity: GctCapacity | null;
  rail_connectivity: string | null;
  dfc_connectivity: string | null;
  road_port_air_links: string | null;
  associated_node_ids: string[];
  constraints: string | null;
  confidence: string | null;
  provenance: ProvenanceRef[];
  last_verified: string | null;
}

export interface GctNetworkAggregate {
  commissioned_count: number | null;
  capacity_mtpa?: number | null;
  freight_mt_2025_26?: number | null;
  approved_in_principle_locations?: number | null;
  as_of: string;
  source_id: string;
}

export interface GctCoverage {
  tier: string;
  tier_a_commissioned_count: number;
  tier_b_sanctioned_count: number;
  tier_a_commissioned_with_full_date: number;
  tier_a_commissioned_with_partial_date: number;
  total_records: number;
  programme_id: string;
  network_aggregate_2026_07: GctNetworkAggregate;
  network_aggregate_2026_09: GctNetworkAggregate;
}

interface GctFile { version: string; note: string; coverage: GctCoverage; terminals: CargoTerminal[] }
const db = file as unknown as GctFile;

export const cargoTerminals: CargoTerminal[] = db.terminals;
export const gctCoverage: GctCoverage = db.coverage;
export const gctNote: string = db.note;

export const GCT_PATH = '/research/programmes/gati-shakti/cargo-terminals/';
/** The dataset belongs to one programme; everything else gets nothing. */
export const GCT_PROGRAMME_ID = db.coverage.programme_id;

export const STATUS_LABEL: Record<GctStatus, string> = {
  commissioned: 'Commissioned',
  sanctioned: 'Sanctioned',
  under_construction: 'Under construction',
  proposed: 'Proposed',
  development_stage: 'Development stage',
};

export const OPERATOR_LABEL: Record<GctOperator, string> = {
  railway_operated: 'Indian Railways',
  dfccil_operated: 'DFCCIL',
  private_operated: 'Private operator',
  private_siding_company_operated: 'Private siding company',
  tendered_unawarded: 'Tendered, unawarded',
};

const rank: Record<GctStatus, number> = {
  commissioned: 0, under_construction: 1, sanctioned: 2, development_stage: 3, proposed: 4,
};

/** Commissioned first, then newest commissioning date, then name. */
export const terminalsSorted = (): CargoTerminal[] =>
  [...cargoTerminals].sort((a, b) =>
    rank[a.status] - rank[b.status]
    || (b.commissioning_date ?? '').localeCompare(a.commissioning_date ?? '')
    || a.canonical_name.localeCompare(b.canonical_name));

export const terminalsForNode = (nodeId: string): CargoTerminal[] =>
  cargoTerminals.filter((t) => t.associated_node_ids.includes(nodeId));

/** Source records cited anywhere in this layer, in registry order. */
export function gctSources(): SourceRecord[] {
  const ids = new Set<string>();
  cargoTerminals.forEach((t) => (t.provenance ?? []).forEach((r) => ids.add(r.source_id)));
  ids.add(gctCoverage.network_aggregate_2026_07.source_id);
  ids.add(gctCoverage.network_aggregate_2026_09.source_id);
  return sources.filter((s) => ids.has(s.id));
}

export const byState = (): { state: string; count: number }[] => {
  const m = new Map<string, number>();
  cargoTerminals.forEach((t) => m.set(t.state ?? 'Not recorded', (m.get(t.state ?? 'Not recorded') ?? 0) + 1));
  return [...m.entries()].map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count || a.state.localeCompare(b.state));
};

export const byOperator = (): { type: GctOperator; count: number }[] => {
  const m = new Map<GctOperator, number>();
  cargoTerminals.forEach((t) => m.set(t.operator_type, (m.get(t.operator_type) ?? 0) + 1));
  return [...m.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
};
