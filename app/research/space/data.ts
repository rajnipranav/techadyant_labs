// Server-safe data access + helpers for the Space Atlas entity pages.
import raw from '../_space.json';

export type Company = {
  id: string;
  slug: string;
  name: string;
  country: string;
  type: string;
  parent: string;
  hq: string;
  founded: string;
  products: string;
  indig: string;
  status: string;
  web: string;
  funding_usd_mn: number | null;
  notes: string;
};

export type Platform = {
  id: string;
  slug: string;
  name: string;
  variant: string;
  category: string;
  origin: string;
  mfr: string;
  operator: string;
  payload_kg: number | null;
  orbit: string;
  status: string;
  desc: string;
  conf: string;
};

export type Dependency = {
  id: string;
  slug: string;
  name: string;
  layer: string;
  criticality: string;
  indian_capability: string;
  foreign_source: string;
  explanation: string;
  status_score: number;
};

export type Layer = {
  code: string;
  label: string;
  status: number;
  rationale: string;
};

export type Opportunity = {
  id: string;
  title: string;
  score: string;
  layer: string;
};

export type Meta = {
  generated_at: string;
  platforms: number;
  companies: number;
  indianCompanies: number;
  authorisations: number;
  ngeEntities: number;
  startupAuthorisations: number;
  fundingUsdMn: number;
  spaceEconomyUsdBn: number;
  targetEconomyUsdBn: number;
  criticalDeps: number;
  opportunities: number;
  buildNow: number;
  privateOrbitalLaunchesPlannedFy27: number;
  privateOrbitalLaunchesPlannedFy28: number;
};

const d = raw as unknown as {
  meta: Meta;
  companies: Company[];
  platforms: Platform[];
  dependencies: Dependency[];
  layers: Layer[];
  opportunities: Opportunity[];
};

export const meta = d.meta;
export const companies = d.companies;
export const platforms = d.platforms;
export const dependencies = d.dependencies;
export const layers = d.layers;
export const opportunities = d.opportunities;

export const companyBySlug = (s: string) => companies.find((c) => c.slug === s);
export const platformBySlug = (s: string) => platforms.find((p) => p.slug === s);
export const dependencyBySlug = (s: string) => dependencies.find((x) => x.slug === s);

export const platformsForCompany = (name: string) =>
  platforms.filter((p) => p.mfr === name || p.operator.includes(name));

export const indianCompanies = companies.filter((c) => c.country === 'IN');
export const foreignCompanies = companies.filter((c) => c.country !== 'IN');

export const STATUS_LABEL: Record<number, string> = {
  0: 'Import-dependent',
  1: 'Nascent',
  2: 'Emerging',
  3: 'Partial',
  4: 'Substantial',
  5: 'Sovereign',
};

export const STATUS_COLORS: string[] = [
  '#B23B3B',
  '#C2603A',
  '#C99A3A',
  '#9AA63A',
  '#4FA88B',
  '#2F8F7F',
];

/** Cross-links from a space subsystem text to other Atlas ecosystems. */
export function crossAtlas(text: string): { label: string; href: string }[] {
  const t = (text || '').toLowerCase();
  const out: { label: string; href: string }[] = [];
  if (/electronic|semiconductor|fpga|rad-hard|processor|chip|avionics/.test(t))
    out.push({ label: 'Semiconductors', href: '/research/dependencies/#semiconductors' });
  if (/propuls|engine|thruster|motor|rare earth|magnet/.test(t))
    out.push({ label: 'Critical Minerals', href: '/research/dependencies/#critical-minerals' });
  if (/\bai\b|autonomy|software|compute|analytics/.test(t))
    out.push({ label: 'AI Infrastructure', href: '/research/dependencies/#ai-infrastructure' });
  if (/defence|military|dual-use|isr/.test(t))
    out.push({ label: 'Defence', href: '/research/pillars/defence/' });
  if (/drone|uas|uav|unmanned/.test(t))
    out.push({ label: 'Unmanned Systems', href: '/research/drones-uas/' });
  if (/aerospace|aircraft|avionics|actuator/.test(t))
    out.push({ label: 'Military Aerospace', href: '/research/military-aerospace/' });
  return out;
}

export const REPORTS: Record<string, { slug: string; title: string }> = {
  // Placeholder — add real report slugs when published
  overview: { slug: 'india-space-ecosystem', title: 'India’s Space Ecosystem' },
  launch: { slug: 'india-private-launch', title: 'India’s Private Launch Race' },
  eo: { slug: 'india-eo-constellations', title: 'India EO & Hyperspectral Constellations' },
};
