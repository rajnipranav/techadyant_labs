// Server-safe data access + helpers for the UAS Atlas entity pages.
import raw from '../_drones.json';

export type Platform = { id: string; slug: string; name: string; variant: string; category: string; origin: string; mfr: string; operator: string; mtow: number | null; payload: number | null; endurance: number | null; range: number | null; ceiling: number | null; speed: number | null; power: string; roles: string; sensors: string; payloads: string; ai: string; indig: number | null; status: string; inducted: string; inservice: number | null; unitcost: number | null; export: string; desc: string; conf: string };
export type Company = { id: string; slug: string; name: string; country: string; type: string; parent: string; hq: string; founded: string; products: string; indig: string; dgca: string; web: string };
export type Procure = { id: string; platform: string; agency: string; qty: number | null; inr_cr: number | null; usd_m: number | null; date: string; delivery: string; method: string };
export type Component = { id: string; name: string; type: string; mfr: string; supplier: string; specs: string; used_in: number; used_in_ids: string[] };

const d = raw as unknown as { platforms: Platform[]; companies: Company[]; procurement: Procure[]; components: Component[] };
export const platforms = d.platforms;
export const companies = d.companies;
export const procurement = d.procurement;
export const components = d.components;

export const platformBySlug = (s: string) => platforms.find((p) => p.slug === s);
export const companyBySlug = (s: string) => companies.find((c) => c.slug === s);
export const companySlug = (name: string) => companies.find((c) => c.name === name)?.slug;
export const procForPlatform = (name: string) => procurement.filter((p) => p.platform === name).sort((a, b) => (b.inr_cr || 0) - (a.inr_cr || 0));
export const componentsForPlatform = (id: string) => components.filter((c) => c.used_in_ids.includes(id));
export const platformsForCompany = (name: string) => platforms.filter((p) => p.mfr === name);
export const componentsForCompany = (name: string) => components.filter((c) => c.mfr === name);

export const REPORTS: Record<string, { slug: string; title: string }> = {
  flagship: { slug: 'who-builds-indias-drones', title: 'Who Builds India’s Drones?' },
  propulsion: { slug: 'india-drone-propulsion-opportunity', title: 'India’s Drone Propulsion Opportunity' },
  battery: { slug: 'indias-drone-battery-ecosystem', title: 'India’s Drone Battery Ecosystem' },
  loiter: { slug: 'india-loitering-munitions-market', title: 'India’s Loitering Munitions Market' },
  cargo: { slug: 'india-cargo-drone-market', title: 'India’s Cargo Drone Market' },
  warfare: { slug: 'indias-unmanned-warfare-transformation', title: 'India’s Unmanned Warfare Transformation' },
  electronics: { slug: 'drone-electronics-flight-controllers', title: 'Who Controls India’s Drones?' },
  sensors: { slug: 'india-drone-sensors-payloads-imaging-market', title: 'India Drone Sensors & Payloads Market' },
};
export function categoryReport(cat: string): keyof typeof REPORTS {
  const c = (cat || '').toLowerCase();
  if (c.includes('loiter')) return 'loiter';
  if (c.includes('cargo')) return 'cargo';
  if (c.includes('male') || c.includes('hale') || c.includes('tuav')) return 'warfare';
  return 'flagship';
}
// Cross-links from a drone subsystem to the other Atlas ecosystems.
export function crossAtlas(text: string): { label: string; href: string }[] {
  const t = (text || '').toLowerCase();
  const out: { label: string; href: string }[] = [];
  if (/flight controller|autopilot|avionic|electronic|semiconductor|mcu|fpga|processor|chip/.test(t)) out.push({ label: 'Semiconductors', href: '/research/dependencies/#semiconductors' });
  if (/batter|cell|magnet|rare earth|ndfeb|motor|propuls/.test(t)) out.push({ label: 'Critical Minerals', href: '/research/dependencies/#critical-minerals' });
  if (/\bai\b|autonomy|software|vision|compute/.test(t)) out.push({ label: 'AI Infrastructure', href: '/research/dependencies/#ai-infrastructure' });
  return out;
}
