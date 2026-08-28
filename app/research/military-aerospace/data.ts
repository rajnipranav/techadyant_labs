// Server-safe data access + helpers for the Military Aerospace Atlas entity pages.
import raw from '../_aerospace.json';
import type { PackLayer, PackSignal } from '../AtlasLayers';

export type Source = { id: string; title: string; url: string | null; tier: string; verdict: string | null; resolved: boolean; indicative: boolean };
export type Platform = {
  id: string; slug: string; name: string; full_name: string; manufacturer_id: string; manufacturer_name: string; country: string;
  category: string; payload_kg: number | null; payload_tonnes: number | null; payload_notes: string; range_km: number | null; range_notes: string;
  cruise_speed_kmh: number | null; max_speed_kmh: number | null; service_ceiling_ft: number | null; role: string; engine: string; propeller: string;
  indian_relevance: string; indian_partner_id: string; indian_partner_name: string; indian_partner_role: string; production_status: string;
  indian_production_status: string; localization_summary: string; localization_depth_max: string; localization_depth_target: string;
  strategic_significance: string; strategic_criticality: string; tier_per_programme: { programme_id: string; tier: string; company_id: string }[];
  sources: Source[]; confidence: string; indicative: boolean;
};
export type Company = {
  id: string; slug: string; name: string; type: string; ownership: string; country: string; headquarters: string; locations: string;
  capability: string; programmes: string; role: string; tier_per_programme: { programme_id: string; tier: string }[] | string;
  indian_manufacturing: string; partnership: string; strategic_relevance: string; sources: Source[]; confidence: string; indicative: boolean;
};
export type Dependency = {
  id: string; slug: string; dependency: string; aircraft_id: string; aircraft: string; system_id: string; system: string; component: string;
  foreign_country: string; foreign_oem_id: string; foreign_oem: string; indian_capability: string; dependency_type: string; criticality: string;
  supply_concentration: string; substitution_difficulty: string; geopolitical_sensitivity: string; localization_potential: string;
  explanation: string; sources: Source[]; confidence: string; indicative: boolean;
};
export type Supplier = { id: string; type: string; subtype: string; source: string; target: string; context: string; tier: string; confidence: string; sources: Source[]; evidence_summary: string; indicative: boolean };
export type System = { id: string; platform_id: string; system: string; subsystem: string; component: string; technology: string; function: string; major_oem_id: string; major_oem_name: string; country: string; indian_capability: string; localization_status: string; localization_depth: string; technology_dependency: string; dependency: string; opportunity: string; criticality: string; sources: Source[]; confidence: string; indicative: boolean };
export type Localization = { id: string; platform_id: string; system_id: string; system: string; subsystem: string; component: string; localization_status: string; assembly_in_india: string; manufacturing_in_india: string; technology_ownership: string; design_ownership: string; indian_supplier: string; foreign_dependency: string; localization_difficulty: string; strategic_criticality: string; localization_depth: string; technology_dependency: string; localization_target: string; evidence_summary: string; sources: Source[]; confidence: string; indicative: boolean };
export type Opportunity = { id: string; title: string; category: string; aircraft: string; system: string; component: string; current_gap: string; existing_indian_capability: string; foreign_dependency: string; potential_customers: string; entry_barriers: string; capital_intensity: string; technology_requirement: string; strategic_importance: string; opportunity_score: number | null; time_horizon: string; evidence: string; sources: Source[]; confidence: string; indicative: boolean };
export type GeoRec = { id: string; company_id: string; company_name: string; location: string; city: string; state: string; lat: number | null; lng: number | null; capability: string; aircraft_programme: string; industrial_cluster: string; mro: string; manufacturing_type: string; strategic_relevance: string; sources: Source[]; confidence: string; indicative: boolean };
export type GeoCluster = { id: string; name: string; state: string; description: string; company_ids: string[]; evidence_strength: string; sources: Source[]; indicative: boolean };
export type Mro = { id: string; aircraft_id: string; aircraft: string; organisation: string; location: string; capability: string; component_repair: string; engine_mro: string; depot_level_maintenance: string; spare_parts_support: string; current_status: string; future_opportunity: string; mro_readiness_level: string; strategic_relevance: string; sources: Source[]; confidence: string; indicative: boolean };
export type Programme = { id: string; programme_id: string; programme: string; platform_id: string; milestone: string; date: string; date_precision: string; status: string; details: string; sources: Source[]; confidence: string; indicative: boolean };
export type Meta = {
  updated: string; atlasVersion: string; platforms: number; companies: number; suppliers: number; systems: number; programmes: number;
  localization: number; geoSites: number; clusters: number; dependencies: number; opportunities: number; mro: number; sources: number;
  sourcesResolved: number; sourcesUnresolved: number; indicativeRecords: number; records: number;
  platformByCategory: { k: string; n: number }[]; platformByStatus: { k: string; n: number }[]; companyByType: { k: string; n: number }[];
  supplierByTier: { k: string; n: number }[]; dependencyByCriticality: { k: string; n: number }[]; dependencyByConcentration: { k: string; n: number }[];
  localizationByDepth: { k: string; n: number }[]; localizationByStatus: { k: string; n: number }[]; clusterByState: { k: string; n: number }[];
  siteByState: { k: string; n: number }[]; programmeByMilestone: { k: string; n: number }[]; programmeByStatus: { k: string; n: number }[];
  systemByDependency: { k: string; n: number }[]; opportunityByCategory: { k: string; n: number }[]; mroByStatus: { k: string; n: number }[];
};

const d = raw as unknown as {
  layers?: PackLayer[];
  signals?: PackSignal[];
  meta: Meta; platforms: Platform[]; companies: Company[]; suppliers: Supplier[]; systems: System[];
  localization: Localization[]; dependencies: Dependency[]; opportunities: Opportunity[];
  geography: { records: GeoRec[]; clusters: GeoCluster[] }; mro: Mro[]; programmes: Programme[];
};
export const meta = d.meta;
export const platforms = d.platforms;
export const companies = d.companies;
export const suppliers = d.suppliers;
export const systems = d.systems;
export const localization = d.localization;
export const dependencies = d.dependencies;
export const opportunities = d.opportunities;
export const geoSites = d.geography.records;
export const clusters = d.geography.clusters;
export const mro = d.mro;
export const programmes = d.programmes;

export const platformBySlug = (s: string) => platforms.find((p) => p.slug === s);
export const companyBySlug = (s: string) => companies.find((c) => c.slug === s);
export const dependencyBySlug = (s: string) => dependencies.find((x) => x.slug === s);
export const companySlug = (id: string) => companies.find((c) => c.id === id)?.slug;
export const systemsForPlatform = (id: string) => systems.filter((x) => x.platform_id === id);
export const locForPlatform = (id: string) => localization.filter((x) => x.platform_id === id);
export const depsForPlatform = (id: string) => dependencies.filter((x) => x.aircraft_id === id);
export const mroForPlatform = (id: string) => mro.filter((x) => x.aircraft_id === id);
export const progsForPlatform = (id: string) => programmes.filter((x) => x.platform_id === id);
export const suppliersForCompany = (id: string) => suppliers.filter((x) => x.source === id || x.target === id);
export const platformsForCompany = (id: string) => platforms.filter((p) => p.manufacturer_id === id || p.indian_partner_id === id);
export const geoForCompany = (id: string) => geoSites.filter((g) => g.company_id === id);
export const mroForCompany = (id: string) => mro.filter((x) => x.organisation === id);
export const progsForProgrammeId = (pid: string) => programmes.filter((x) => x.programme_id === pid);

// Presentation helpers
export const DEPTH_ORDER = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
export const DEPTH_LABEL: Record<string, string> = {
  L0: 'Imported', L1: 'Final assembly in India', L2: 'Component manufacturing', L3: 'Subsystem integration', L4: 'System design ownership', L5: 'Full design + manufacture',
};
export const CRIT_COLOR: Record<string, string> = { CRITICAL: '#E24B4A', HIGH: '#F5B544', MEDIUM: '#6CB0FF', LOW: '#34D399' };
export const CONC_LABEL: Record<string, string> = { 'single-source': 'Single source', oligopolistic: 'Oligopolistic' };
export const TIER_LABEL: Record<string, string> = { 'tier-1': 'Tier 1', 'tier-2': 'Tier 2', 'tier-3': 'Tier 3' };
export const humanCat = (c: string) => (c || '').replace(/-/g, ' ');

export const packLayers = d.layers || [];
export const packSignals = d.signals || [];
