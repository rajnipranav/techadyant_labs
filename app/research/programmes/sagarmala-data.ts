// Sagarmala Intelligence Database — loader (server-only).
// The dedicated maritime/port intelligence layer behind the Sagarmala programme page:
//   data/sagarmala-intelligence/{dossier,pillar-projects,ports,port-performance,connectivity,
//   industrialisation,community,companies,policies,opportunities,coverage}.json
// Validated at build time by scripts/validate-sagarmala.mjs. Provenance points at the shared
// source registry (data/industrial-intelligence/sources.json), so citations on the programme page
// share one numbered source list with the rest of the Atlas.
// Other programmes can adopt the same pattern later: sagarmalaFor(slug) returns undefined for them.
import dossierJson from '../../../data/sagarmala-intelligence/dossier.json';
import pillarProjectsJson from '../../../data/sagarmala-intelligence/pillar-projects.json';
import portsJson from '../../../data/sagarmala-intelligence/ports.json';
import performanceJson from '../../../data/sagarmala-intelligence/port-performance.json';
import connectivityJson from '../../../data/sagarmala-intelligence/connectivity.json';
import industrialisationJson from '../../../data/sagarmala-intelligence/industrialisation.json';
import communityJson from '../../../data/sagarmala-intelligence/community.json';
import companiesJson from '../../../data/sagarmala-intelligence/companies.json';
import policiesJson from '../../../data/sagarmala-intelligence/policies.json';
import opportunitiesJson from '../../../data/sagarmala-intelligence/opportunities.json';
import coverageJson from '../../../data/sagarmala-intelligence/coverage.json';
import { sources } from '../industrial/data';
import type { ProvenanceRef, SourceRecord } from '../industrial/types';
import type { ProgrammeIntel } from './types';

export type SagarmalaPillarKey = 'port_modernisation' | 'port_connectivity' | 'port_led_industrialisation' | 'coastal_community' | 'coastal_shipping_iwt';

export const PILLAR_LABEL: Record<SagarmalaPillarKey, string> = {
  port_modernisation: 'Port modernisation & new ports',
  port_connectivity: 'Port connectivity',
  port_led_industrialisation: 'Port-led industrialisation',
  coastal_community: 'Coastal community development',
  coastal_shipping_iwt: 'Coastal shipping & IWT',
};
export const PILLAR_LETTER: Record<SagarmalaPillarKey, string> = {
  port_modernisation: 'A', port_connectivity: 'B', port_led_industrialisation: 'C',
  coastal_community: 'D', coastal_shipping_iwt: 'E',
};

/* ------------------------------------------------------------------ shapes (fields the UI reads) */

export interface SgClaim { text: string; evidence: string; provenance: ProvenanceRef[] }
export interface SgMilestone { date: string; label: string; provenance: ProvenanceRef[] }
export interface SgProject {
  id: string; name: string; pillar_key: SagarmalaPillarKey; scheme_funded: boolean;
  location: string; port_id: string | null; scope: string; cost_cr: number | null; cost_note?: string;
  planned_capacity?: { value: number; unit: string } | null;
  status: string; status_note?: string | null; agency: string;
  milestones?: SgMilestone[]; contractors?: { name: string; role: string; provenance: ProvenanceRef[] }[];
  operational_consequences: string; consequence_evidence: string;
  provenance: ProvenanceRef[]; last_verified: string;
}
export interface SgPort {
  id: string; name: string; type: string; state: string; authority: string | null;
  status: string; throughput: { fy2024_25_mt?: number; fy2025_26_mt?: number } | null;
  throughput_note?: string; container_throughput?: { fy2025_26_mteu?: number; fy2024_25_mteu?: number } | null;
  rank_fy26?: number; sagarmala_project_ids: string[];
  coordinates: { lat: number; lng: number } | null;
  facts: { text: string; evidence: string; provenance: ProvenanceRef[] }[];
  provenance: ProvenanceRef[]; last_verified: string;
}
export interface SgSeriesPoint { period: string; value: number; note?: string; evidence?: string; provenance: ProvenanceRef[] }
export interface SgSeries { id: string; metric: string; unit: string; scope: string; points: SgSeriesPoint[]; note?: string; verification?: string }
export interface SgCez { id: string; name: string; state: string; linkage_ports: string[]; sectors: string[]; status: string; provenance: ProvenanceRef[] }
export interface SgCompany {
  id: string; name: string; category: string; hq?: string | null;
  relationships: { to: string; type: string; detail: string; provenance: ProvenanceRef[] }[];
  fleet?: { vessels?: number; gt?: number } | null;
  scale_facts?: SgClaim[]; notes?: string; last_verified: string;
}
export interface SgOpportunity {
  id: string; title: string; classification: string; pillar_key: SagarmalaPillarKey;
  trigger: SgClaim; reasoning: string; customers: string[];
  dependencies: string[]; constraints: string[]; confidence: string;
  evidence_needed: string; last_reviewed: string;
}
export interface SgPolicy {
  id: string; name: string; authority: string; announcement_date: string;
  approval_date: string | null; status: string; objectives: string;
  funding: string | null; last_verified: string;
}

export interface SagarmalaDatabase {
  dossier: {
    programme: {
      approval: SgClaim; national_perspective_plan: SgClaim; objectives: SgClaim[];
      pillars: { key: SagarmalaPillarKey; official_name: string; description: string; pillar_letter: string; provenance: ProvenanceRef[] }[];
      institutions: { id: string; name: string; role: string }[];
      statistics: { id: string; label: string; value: number; unit: string; as_of: string | null; scope: string; verification: string; provenance: ProvenanceRef[] }[];
      sagarmala_2_0: SgClaim & { status: string };
      timeline: SgMilestone[]; last_verified: string; data_as_of: string;
    };
  };
  portfolio: {
    snapshots: { label?: string; as_of: string | null; projects: number; cost_lakh_cr: number; completed: { count: number; cost_cr?: number; cost_lakh_cr?: number }; scope: string; verification: string; provenance: ProvenanceRef[] }[];
    pillar_split_839: { rows: { pillar_key: SagarmalaPillarKey; projects: number; cost_cr: number }[]; as_of: string; verification: string; provenance: ProvenanceRef[] };
    scheme_funded: { as_of: string; sanctioned_total: number; withdrawn: number; funded: number; completed: number; under_implementation: number; provenance: ProvenanceRef[] };
    scheme_funded_pillar_split: { rows: { pillar_key: SagarmalaPillarKey; completed: { count: number; cost_cr: number }; under_implementation: { count: number; cost_cr: number } }[]; grand_total: { completed: { count: number; cost_cr: number }; under_implementation: { count: number; cost_cr: number } }; note: string; as_of: string; provenance: ProvenanceRef[] };
    cpcp: SgClaim & { as_of: string };
  };
  projects: SgProject[];
  ports: SgPort[];
  nonMajorSystem: SgClaim;
  performance: { series: SgSeries[]; benchmarks: SgClaim[] };
  connectivity: { connections: { id: string; from_port: string; mode: string; name: string; status: string; cost_cr: number | null; agency: string; provenance: ProvenanceRef[] }[]; cpcp_summary: SgClaim & { as_of: string } };
  cezs: SgCez[];
  industrialisationStatus: { pillar_status: { scheme_funded_projects: number; as_of: string; text: string; evidence: string; provenance: ProvenanceRef[] }; ceu_definition: SgClaim; smart_industrial_port_cities: SgClaim; hinterland_reading: SgClaim[] };
  community: { initiatives: { id: string; name: string; category: string; cost_cr?: number; completed?: { count?: number }; outcomes?: Record<string, string>; provenance: ProvenanceRef[] }[] };
  companies: SgCompany[];
  policies: SgPolicy[];
  opportunities: SgOpportunity[];
  coverage: { tiers: Record<string, { status: string; contents: string[]; not_covered?: string[] }>; counts: Record<string, number>; discrepancies: { id: string; subject: string; observations: string; resolution: string }[]; known_gaps: string[] };
}

const db: SagarmalaDatabase = {
  dossier: dossierJson as unknown as SagarmalaDatabase['dossier'],
  portfolio: {
    snapshots: (pillarProjectsJson as unknown as SagarmalaDatabase)['portfolio'].snapshots,
    pillar_split_839: (pillarProjectsJson as unknown as SagarmalaDatabase)['portfolio'].pillar_split_839,
    scheme_funded: (pillarProjectsJson as unknown as SagarmalaDatabase)['portfolio'].scheme_funded,
    scheme_funded_pillar_split: (pillarProjectsJson as unknown as SagarmalaDatabase)['portfolio'].scheme_funded_pillar_split,
    cpcp: (pillarProjectsJson as unknown as SagarmalaDatabase)['portfolio'].cpcp,
  },
  projects: (pillarProjectsJson as unknown as SagarmalaDatabase)['projects'],
  ports: (portsJson as unknown as { ports: SgPort[] }).ports,
  nonMajorSystem: (portsJson as unknown as { non_major_system: SgClaim }).non_major_system,
  performance: performanceJson as unknown as SagarmalaDatabase['performance'],
  connectivity: connectivityJson as unknown as SagarmalaDatabase['connectivity'],
  cezs: (industrialisationJson as unknown as { cezs: SgCez[] }).cezs,
  industrialisationStatus: industrialisationJson as unknown as SagarmalaDatabase['industrialisationStatus'],
  community: communityJson as unknown as SagarmalaDatabase['community'],
  companies: (companiesJson as unknown as { companies: SgCompany[] }).companies,
  policies: (policiesJson as unknown as { policies: SgPolicy[] }).policies,
  opportunities: (opportunitiesJson as unknown as { opportunities: SgOpportunity[] }).opportunities,
  coverage: coverageJson as unknown as SagarmalaDatabase['coverage'],
};

/** The Sagarmala database for a programme page; undefined for every other programme. */
export const sagarmalaFor = (p: ProgrammeIntel): SagarmalaDatabase | undefined =>
  p.slug === 'sagarmala' ? db : undefined;

/* ------------------------------------------------------------------ derived queries */

export const projectsByPillar = (pillar: SagarmalaPillarKey) => db.projects.filter((x) => x.pillar_key === pillar);
export const majorPorts = () => db.ports.filter((x) => x.type === 'major' || x.type === 'major_dock_system');
export const nonMajorPorts = () => db.ports.filter((x) => x.type === 'non_major');
export const underConstructionPorts = () => db.ports.filter((x) => x.type === 'major_under_construction');
export const seriesById = (id: string) => db.performance.series.find((s) => s.id === id);
export const companiesByCategory = () => {
  const order = ['port_operator', 'terminal_operator', 'shipping', 'coastal_shipping', 'shipbuilder', 'dredging', 'marine_epc', 'equipment_supplier', 'iwai_operator'];
  const labels: Record<string, string> = {
    port_operator: 'Port operators', terminal_operator: 'Terminal operators', shipping: 'Shipping lines',
    coastal_shipping: 'Coastal operators', shipbuilder: 'Shipyards & ship repair', dredging: 'Dredging',
    marine_epc: 'Marine EPC', equipment_supplier: 'Equipment suppliers', iwai_operator: 'Waterway operators',
  };
  return order.flatMap((k) => {
    const rows = db.companies.filter((c) => c.category === k);
    return rows.length ? [{ key: k, label: labels[k], rows }] : [];
  });
};
export const opportunityClassificationLabel: Record<string, string> = {
  documented_demand: 'Documented demand', emerging: 'Emerging opportunity',
  hypothesis: 'Analytical hypothesis', research_lead: 'Research lead',
};

/* ------------------------------------------------------------------ source list merge */

/** Every source id cited anywhere in the Sagarmala layer (provenance refs + inline ids). */
function collectSourceIds(): Set<string> {
  const ids = new Set<string>();
  const prov = (refs?: ProvenanceRef[]) => (refs ?? []).forEach((r) => ids.add(r.source_id));
  const walk = (x: unknown) => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      if (Array.isArray(o.provenance)) prov(o.provenance as ProvenanceRef[]);
      for (const k of Object.keys(o)) if (k !== 'provenance') walk(o[k]);
    }
  };
  walk(db);
  return ids;
}
const sgSourceIds = collectSourceIds();

/** Programme page source list: registry-ordered union of the intel-layer citations and the
 *  Sagarmala database citations, so every bracketed number on the page resolves. */
export function sourcesWithDatabase(p: ProgrammeIntel, base: SourceRecord[]): SourceRecord[] {
  if (p.slug !== 'sagarmala') return base;
  const ids = new Set(base.map((s) => s.id));
  for (const id of sgSourceIds) ids.add(id);
  return sources.filter((s) => ids.has(s.id));
}

/** Port ids -> port name, for rendering relationship targets inside the company directory. */
export const portName = (id: string) => db.ports.find((x) => x.id === id)?.name ?? id;
export const projectName = (id: string) => db.projects.find((x) => x.id === id)?.name ?? id;
