// Server-safe data-access layer for the Defence Atlas (Army / Navy + Coast Guard / Air Force).
// Reads the build-time Z.ai research seed (./_defence.json). Service is a many-to-many
// association on every record — entities are NEVER duplicated across services; views are
// derived by filtering on the `service` arrays. See DEFENCE-ATLAS-DB-SCHEMA.md.
import raw from './_defence.json';

/* ----------------------------------------------------------------- types */
export type ServiceCode = 'army' | 'navy' | 'coast_guard' | 'air_force' | 'joint';

export interface ServiceDef { code: ServiceCode; label: string; route: string }

export interface Entity {
  id: string;
  name: string;
  type: string;
  service: ServiceCode[];
  country: string;
  domain: string[];
  status?: string;
}

export interface Relationship {
  source: string;
  type: string;
  target: string;
  service: ServiceCode[];
  source_refs?: string[];
}

export interface Programme {
  id: string;
  name: string;
  service: ServiceCode[];
  type: string;
  status: string;
  source_refs?: string[];
  key_data?: Record<string, unknown>;
}

export interface Dependency {
  id: string;
  service: ServiceCode[];
  dependent: string;
  dependency: string;
  category: string;
  status: string;
  importance: string;
  source_refs?: string[];
}

export interface Opportunity {
  id: string;
  service: ServiceCode[];
  domain: string;
  thesis: string;
  evidence_refs?: string[];
}

export interface Source {
  id: string;
  title: string;
  date: string;
  url: string;
  scope: string;
}

interface DefenceDB {
  schema_version: string;
  as_of: string;
  purpose: string;
  principles: string[];
  services: ServiceDef[];
  domains: Record<string, string[]>;
  entities: Entity[];
  relationships: Relationship[];
  programmes: Programme[];
  dependencies: Dependency[];
  opportunities: Opportunity[];
  sources: Source[];
}

const db = raw as unknown as DefenceDB;

export const asOf = db.as_of;
export const services = db.services;
export const domainTaxonomy = db.domains;
export const entities = db.entities;
export const relationships = db.relationships;
export const programmes = db.programmes;
export const dependencies = db.dependencies;
export const opportunities = db.opportunities;
export const sources = db.sources;

/* ----------------------------------------------------------------- view codes
   A "service view" is what the public sees. `maritime` unifies navy + coast_guard
   (one Atlas) while keeping the two internal service codes distinct for filtering. */
export type ViewCode = 'army' | 'maritime' | 'air_force';
export const VIEW_SERVICES: Record<ViewCode, ServiceCode[]> = {
  army: ['army'],
  maritime: ['navy', 'coast_guard'],
  air_force: ['air_force'],
};
export const ROUTE_BY_VIEW: Record<ViewCode, string> = {
  army: 'army',
  maritime: 'navy-coast-guard',
  air_force: 'air-force',
};

/* ----------------------------------------------------------------- slugs (stable, unique) */
const kebab = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const _slugById = new Map<string, string>();
const _idBySlug = new Map<string, string>();
(() => {
  const used = new Set<string>();
  for (const e of [...entities].sort((a, b) => a.name.localeCompare(b.name))) {
    let base = kebab(e.name) || e.id;
    let s = base;
    let n = 2;
    while (used.has(s)) s = `${base}-${n++}`;
    used.add(s);
    _slugById.set(e.id, s);
    _idBySlug.set(s, e.id);
  }
})();
export const entitySlug = (id: string): string => _slugById.get(id) ?? id;
export const entityById = (id: string): Entity | undefined => entities.find((e) => e.id === id);
export const entityBySlug = (slug: string): Entity | undefined => {
  const id = _idBySlug.get(slug);
  return id ? entityById(id) : entityById(slug);
};
export const sourceById = (id: string): Source | undefined => sources.find((s) => s.id === id);
export const sourcesFor = (refs?: string[]): Source[] =>
  (refs ?? []).map(sourceById).filter((s): s is Source => Boolean(s));

/* ----------------------------------------------------------------- service filtering */
export const inService = (svc: ServiceCode[] | undefined, view: ServiceCode[]): boolean =>
  (svc ?? []).some((s) => view.includes(s));

export const entitiesForServices = (view: ServiceCode[]): Entity[] =>
  entities.filter((e) => inService(e.service, view)).sort((a, b) => a.name.localeCompare(b.name));
export const programmesForServices = (view: ServiceCode[]): Programme[] =>
  programmes.filter((p) => inService(p.service, view));
export const dependenciesForServices = (view: ServiceCode[]): Dependency[] =>
  dependencies.filter((d) => inService(d.service, view));
export const opportunitiesForServices = (view: ServiceCode[]): Opportunity[] =>
  opportunities.filter((o) => inService(o.service, view));

/* Entity classes, so a "system/platform" view differs from "industry" and "policy". */
export const INDUSTRY_TYPES = ['psu', 'jv', 'company', 'foreign_supplier'];
export const GOVT_TYPES = ['service', 'ministry', 'govt_body', 'research_institution'];
export const SYSTEM_TYPES = ['platform', 'system', 'weapon', 'component', 'programme'];
export const TECH_TYPES = ['technology'];

export const isIndustry = (e: Entity) => INDUSTRY_TYPES.includes(e.type);
export const isSystem = (e: Entity) => SYSTEM_TYPES.includes(e.type);
export const isTech = (e: Entity) => TECH_TYPES.includes(e.type);
export const isGovt = (e: Entity) => GOVT_TYPES.includes(e.type);

/* ----------------------------------------------------------------- relationships (graph) */
export interface Edge {
  rel: Relationship;
  dir: 'out' | 'in';
  otherId: string;
  other?: Entity;
  otherName: string;
}
export function relationshipsFor(entityId: string): Edge[] {
  const out: Edge[] = [];
  for (const r of relationships) {
    if (r.source === entityId) {
      const e = entityById(r.target);
      out.push({ rel: r, dir: 'out', otherId: r.target, other: e, otherName: e?.name ?? humanize(r.target) });
    } else if (r.target === entityId) {
      const e = entityById(r.source);
      out.push({ rel: r, dir: 'in', otherId: r.source, other: e, otherName: e?.name ?? humanize(r.source) });
    }
  }
  return out;
}

/* ----------------------------------------------------------------- capability domains */
export interface DomainGroup { domain: string; label: string; entities: Entity[] }
export function domainsForView(view: ServiceCode[]): DomainGroup[] {
  const map = new Map<string, Entity[]>();
  for (const e of entitiesForServices(view)) {
    if (!isSystem(e) && !isTech(e)) continue; // capability domains are about systems & technologies
    for (const d of e.domain.length ? e.domain : ['other']) {
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(e);
    }
  }
  return [...map.entries()]
    .map(([domain, es]) => ({ domain, label: humanize(domain), entities: es }))
    .sort((a, b) => b.entities.length - a.entities.length || a.label.localeCompare(b.label));
}

/* ----------------------------------------------------------------- origin / indigenisation ladder
   Conservative classification derived from the `country` field. Deliberately does NOT
   claim an item is indigenous merely because it is built in India — a mixed origin such
   as IN/RU is shown as "assembled / licensed", not indigenous. */
export type OriginTier =
  | 'indigenous'
  | 'indigenous_subsystem'
  | 'licensed'
  | 'tech_transfer'
  | 'imported'
  | 'mixed';

export interface OriginInfo { tier: OriginTier; label: string; color: string }

const ORIGIN_META: Record<OriginTier, { label: string; color: string }> = {
  indigenous: { label: 'Indigenous (Indian design)', color: '#34D399' },
  indigenous_subsystem: { label: 'Indigenous subsystem', color: '#2BC5B4' },
  licensed: { label: 'Licensed / assembled in India', color: '#F5B544' },
  tech_transfer: { label: 'Technology-transfer pathway', color: '#6CB0FF' },
  imported: { label: 'Imported', color: '#E24B4A' },
  mixed: { label: 'Mixed Indian + foreign', color: '#C99A3A' },
};

export function originOf(e: Entity): OriginInfo {
  const c = (e.country || '').toUpperCase();
  let tier: OriginTier;
  if (c === 'IN') {
    tier = e.type === 'component' || e.type === 'system' ? 'indigenous_subsystem' : 'indigenous';
    if (e.type === 'platform' || e.type === 'weapon' || e.type === 'programme') tier = 'indigenous';
  } else if (/^IN\/(RU|FR|IL|US|EU)$/.test(c)) {
    tier = 'licensed';
  } else if (/^(US|FR|DE|RU|EU|IL)\/IN$/.test(c) || (e.status ?? '').includes('technology_transfer')) {
    tier = 'tech_transfer';
  } else if (c === 'IN/FOREIGN') {
    tier = 'mixed';
  } else if (['US', 'FR', 'DE', 'RU', 'EU', 'IL', 'UK', 'JP'].includes(c)) {
    tier = 'imported';
  } else {
    tier = 'mixed';
  }
  const meta = ORIGIN_META[tier];
  return { tier, label: meta.label, color: meta.color };
}
export const ORIGIN_ORDER: OriginTier[] = ['indigenous', 'indigenous_subsystem', 'licensed', 'tech_transfer', 'mixed', 'imported'];
export const originMeta = (t: OriginTier) => ORIGIN_META[t];

/* ----------------------------------------------------------------- procurement / status ladder
   The canonical acquisition ladder from the schema. DB status strings are mapped onto a
   stage so AoN is never collapsed into "contract" and vice-versa. */
export type Stage =
  | 'concept' | 'development' | 'RFI' | 'AoN' | 'RFP' | 'contracted'
  | 'production' | 'delivery' | 'commissioned' | 'operational' | 'retired'
  | 'policy' | 'other';

export interface StatusInfo { stage: Stage; label: string; color: string }

const STAGE_META: Record<Stage, { label: string; color: string }> = {
  concept: { label: 'Concept', color: '#9898A8' },
  development: { label: 'Development', color: '#818CF8' },
  RFI: { label: 'RFI', color: '#6CB0FF' },
  AoN: { label: 'AoN (Acceptance of Necessity)', color: '#6CB0FF' },
  RFP: { label: 'RFP', color: '#38BDF8' },
  contracted: { label: 'Contracted', color: '#F5B544' },
  production: { label: 'In production', color: '#F5B544' },
  delivery: { label: 'Delivery', color: '#E6D1A0' },
  commissioned: { label: 'Commissioned / inducted', color: '#34D399' },
  operational: { label: 'Operational', color: '#2BC5B4' },
  retired: { label: 'Retired', color: '#6F6F85' },
  policy: { label: 'Policy', color: '#C99A3A' },
  other: { label: 'Tracked', color: '#9aa3b2' },
};

export function statusInfo(status?: string): StatusInfo {
  const s = (status || '').toLowerCase();
  let stage: Stage = 'other';
  if (!s) stage = 'other';
  else if (s.includes('retired')) stage = 'retired';
  else if (s.includes('operational') || s.includes('in_service')) stage = 'operational';
  else if (s.includes('commission') || s.includes('induction') || s.includes('inducted')) stage = 'commissioned';
  else if (s.includes('delivery') || s.includes('delivered')) stage = 'delivery';
  else if (s.includes('production')) stage = 'production';
  else if (s.includes('contract')) stage = 'contracted';
  else if (s.includes('aon')) stage = 'AoN';
  else if (s.includes('rfp')) stage = 'RFP';
  else if (s.includes('rfi')) stage = 'RFI';
  else if (s.includes('procurement')) stage = 'AoN';
  else if (s.includes('development') || s.includes('integration') || s.includes('pathway') || s.includes('tested')) stage = 'development';
  else if (s.includes('concept')) stage = 'concept';
  else if (s.includes('policy') || s.includes('draft') || s.includes('notified') || s.includes('in_force')) stage = 'policy';
  const meta = STAGE_META[stage];
  return { stage, label: meta.label, color: meta.color };
}
export const stageMeta = (s: Stage) => STAGE_META[s];

/* ----------------------------------------------------------------- misc helpers */
export function humanize(s: string): string {
  if (!s) return '';
  // ids like "sys-akash-tarang" or "tech-jet-engines" → strip a leading type prefix
  const stripped = s.replace(/^(org|sys|nav|air|tech|dep|opp|prg)-/, '');
  return stripped.replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
export const isDomestic = (country: string) => (country || '').toUpperCase() === 'IN';

export interface ViewStats {
  entities: number;
  systems: number;
  companies: number;
  programmes: number;
  dependencies: number;
  relationships: number;
  indigenousPct: number;
}
export function statsForView(view: ServiceCode[]): ViewStats {
  const es = entitiesForServices(view);
  const sys = es.filter(isSystem);
  const indi = sys.filter((e) => originOf(e).tier === 'indigenous' || originOf(e).tier === 'indigenous_subsystem').length;
  const ids = new Set(es.map((e) => e.id));
  const rels = relationships.filter((r) => ids.has(r.source) || ids.has(r.target));
  return {
    entities: es.length,
    systems: sys.length,
    companies: es.filter(isIndustry).length,
    programmes: programmesForServices(view).length,
    dependencies: dependenciesForServices(view).length,
    relationships: rels.length,
    indigenousPct: sys.length ? Math.round((indi / sys.length) * 100) : 0,
  };
}

export interface ServiceViewMeta { view: ViewCode; label: string; accent: string; kicker: string; blurb: string; route: string }
export const VIEW_META: Record<ViewCode, ServiceViewMeta> = {
  army: {
    view: 'army', label: 'Army Atlas', accent: '#C77D4A', route: 'army',
    kicker: 'Land warfare · India',
    blurb: 'Armour, artillery, air defence, missiles, infantry systems, unmanned and counter-UAS, electronic warfare and C4ISR — the industrial base behind the land force.',
  },
  maritime: {
    view: 'maritime', label: 'Navy + Coast Guard Atlas', accent: '#38BDF8', route: 'navy-coast-guard',
    kicker: 'Maritime power · India',
    blurb: 'Warships and submarines, naval aviation and weapons, sonar and sensors, the shipyards that build them and the Coast Guard fleet — one maritime industrial base, filterable by service.',
  },
  air_force: {
    view: 'air_force', label: 'Air Force Atlas', accent: '#818CF8', route: 'air-force',
    kicker: 'Air power · India',
    blurb: 'Fighters and future combat aircraft, air-launched weapons, radar and avionics, and — decisively — the propulsion India does not yet own. Where each platform sits on the imported-to-indigenous ladder.',
  },
};
