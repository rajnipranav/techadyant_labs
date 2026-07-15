// Server-safe data access + helpers for the Counter-UAS Atlas entity pages.
import raw from '../_cuas.json';

export type System = { id: string; slug: string; name: string; variant: string; mfr: string; country: string; indig: number | null; makeInIndia: string; classification: string; domain: string; mobility: string; kill: string[]; counters: string[]; detRange: number | null; neutRange: number | null; reaction: number | null; simTargets: number | null; ai: boolean; fusion: boolean; swarmDet: string; status: string; year: string; partners: string; web: string };
export type Mfr = { id: string; slug: string; name: string; hq: string; country: string; founded: string; portfolio: string; locations: string; exports: string; certifications: string; indigenous: string };
export type Deployment = { id: string; sysId: string; system: string; location: string; state: string; agency: string; purpose: string; since: string; status: string; lat: number | null; lng: number | null };
export type Intel = { topic: string; importance: string; trl: string; indig: string; china: string; semi: string; ai: string; swarm: string; ew: string; gps: string; outlook: string };

const d = raw as unknown as { systems: System[]; manufacturers: Mfr[]; deployments: Deployment[]; intel: Intel[] };
export const systems = d.systems;
export const manufacturers = d.manufacturers;
export const deployments = d.deployments;
export const intel = d.intel;

export const systemBySlug = (s: string) => systems.find((x) => x.slug === s);
export const mfrBySlug = (s: string) => manufacturers.find((x) => x.slug === s);
export const mfrSlug = (name: string) => manufacturers.find((m) => name && (name.includes(m.name) || m.name.includes(name)))?.slug;
export const deploymentsForSystem = (id: string, name: string) => deployments.filter((x) => x.sysId === id || (name && x.system && (x.system.includes(name) || name.includes(x.system))));
export const intelForSystem = (name: string, id: string) => intel.find((x) => x.topic.includes(id) || (name && x.topic.toLowerCase().includes(name.toLowerCase().slice(0, 14))));
export const systemsForMfr = (name: string) => systems.filter((x) => x.mfr === name);

export const REPORT = { slug: 'indias-unmanned-warfare-transformation', title: 'India’s Unmanned Warfare Transformation' };
