// SEO/GEO hub layer for the Supplier Atlas: capability + state landing pages.
// All numbers in FAQ/copy are derived from the public data so they never drift.
import { suppliers, type Supplier } from './suppliers';

export interface CategoryHub {
  slug: string; category: string; label: string; kw: string; blurb: string;
}

// Capability hubs — slugs target real search intent ("india cnc machining suppliers").
export const CATEGORY_HUBS: CategoryHub[] = [
  { slug: 'cnc-machining', category: 'CNC Suppliers', label: 'CNC Machining Suppliers',
    kw: 'CNC machining suppliers in India',
    blurb: 'VMC, HMC, CNC turning, 5-axis and automation suppliers — the machine-tool base that cuts, mills and turns India’s precision components.' },
  { slug: 'pcb-manufacturing', category: 'PCB Manufacturers', label: 'PCB Manufacturers',
    kw: 'PCB manufacturers in India',
    blurb: 'Rigid, flex, HDI, multilayer, substrate and EMS suppliers — the printed-circuit-board base beneath India’s electronics and defence hardware.' },
  { slug: 'composites', category: 'Composite Fabricators', label: 'Composite Fabricators',
    kw: 'composite fabricators in India',
    blurb: 'Prepreg, RTM, SMC, pultrusion, hand layup and autoclave fabricators — the carbon-fibre and advanced-composite base for aerospace, defence and clean energy.' },
  { slug: 'precision-machining', category: 'Precision Machining', label: 'Precision Machining Suppliers',
    kw: 'precision machining suppliers in India',
    blurb: 'Tight-tolerance component machining shops — the sub-micron and single-digit-micron capability behind India’s critical mechanical parts.' },
  { slug: 'toolmaking', category: 'Toolmakers', label: 'Toolmakers, Dies & Moulds',
    kw: 'tool and die makers in India',
    blurb: 'Press tools, dies, moulds, cutting tools and abrasives — the tooling base that lets every other factory stamp, form and mould at volume.' },
];

export function hubBySlug(slug: string): CategoryHub | undefined {
  return CATEGORY_HUBS.find((h) => h.slug === slug);
}

export function stateSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export interface StateHub { slug: string; state: string; count: number }
export const STATE_HUBS: StateHub[] = (() => {
  const c = new Map<string, number>();
  for (const s of suppliers) if (s.state) c.set(s.state, (c.get(s.state) ?? 0) + 1);
  return [...c.entries()]
    .filter(([, n]) => n >= 3) // only states with a meaningful cluster get a page
    .sort((a, b) => b[1] - a[1])
    .map(([state, count]) => ({ slug: stateSlug(state), state, count }));
})();

export function stateHubBySlug(slug: string): StateHub | undefined {
  return STATE_HUBS.find((h) => h.slug === slug);
}

export const suppliersInCategory = (category: string): Supplier[] => suppliers.filter((s) => s.category === category);
export const suppliersInState = (state: string): Supplier[] => suppliers.filter((s) => s.state === state);
export const topRated = (list: Supplier[], n: number): Supplier[] =>
  [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, n);

function pct(part: number, whole: number) { return whole ? Math.round(part / whole * 100) : 0; }
function topStates(list: Supplier[], n = 3): string[] {
  const c = new Map<string, number>();
  for (const s of list) if (s.state) c.set(s.state, (c.get(s.state) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
}
function certPct(list: Supplier[], cert: string) {
  return pct(list.filter((s) => String(s.certifications || '').includes(cert)).length, list.length);
}

export interface Faq { q: string; a: string }

export function categoryFaq(list: Supplier[], label: string, kw: string): Faq[] {
  const verified = list.filter((s) => s.verified === 'Yes').length;
  const exportReady = list.filter((s) => s.exportExp === 'Yes').length;
  const states = topStates(list);
  return [
    { q: `How many ${label.toLowerCase()} are there in India?`,
      a: `The Techadyant Industrial Supplier Atlas maps ${list.length} ${kw}, of which ${verified} are independently verified (${pct(verified, list.length)}%). The directory is searchable by capability, location, certification, tolerance and capacity.` },
    { q: `Which Indian states have the most ${label.toLowerCase()}?`,
      a: `${states.join(', ')} host the largest clusters of ${kw} in the Atlas. Suppliers are concentrated in India’s established industrial corridors across the west and south.` },
    { q: `What certifications do Indian ${label.toLowerCase()} hold?`,
      a: `Every supplier in this category holds ISO 9001. ${certPct(list, 'IATF 16949')}% are IATF 16949 certified for automotive, and ${certPct(list, 'AS9100')}% hold AS9100 for aerospace and defence work.` },
    { q: `How many ${label.toLowerCase()} export from India?`,
      a: `${exportReady} of the ${list.length} ${kw} in the Atlas (${pct(exportReady, list.length)}%) have export experience, making them viable partners for global supply chains and China+1 sourcing.` },
  ];
}

export function stateFaq(list: Supplier[], state: string): Faq[] {
  const verified = list.filter((s) => s.verified === 'Yes').length;
  const cats = new Map<string, number>();
  for (const s of list) cats.set(s.category, (cats.get(s.category) ?? 0) + 1);
  const catList = [...cats.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} (${v})`);
  const exportReady = list.filter((s) => s.exportExp === 'Yes').length;
  return [
    { q: `How many manufacturing suppliers are in ${state}?`,
      a: `The Atlas maps ${list.length} manufacturing suppliers in ${state} across CNC machining, PCB fabrication, composites, precision machining and tooling, of which ${verified} are verified.` },
    { q: `What can ${state} manufacturers make?`,
      a: `Supplier capabilities in ${state} span ${catList.join(', ')}.` },
    { q: `Are ${state} suppliers export-ready?`,
      a: `${exportReady} of the ${list.length} suppliers in ${state} (${pct(exportReady, list.length)}%) report export experience.` },
  ];
}
