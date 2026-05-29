export interface BriefingMeta {
  date: string;
  title: string;
  tag: string;     // 'Executive brief' | 'Strategic note' | 'Framework'
  read: string;    // e.g. '6 min'
  blurb: string;
}

/** Briefings — newest first. Both the briefings index page and the homepage
 *  read from this array. publish-report.mjs upserts new entries here when a
 *  report config includes a `briefing` block. */
export const briefings: BriefingMeta[] = [
  /* ─── Opportunity Mapping series ─── */
  {
    date: '29 May 2026',
    title: '100 SME Opportunities in India’s Semiconductor Push',
    tag: 'Strategic note',
    read: '8 min',
    blurb:
      'A tiered map of the ₹28,000–60,000 crore SME-addressable opportunity surface — ready-now precision sheet metal and cabling, 24-month builds in chillers and edge IoT, and 3–5 year partnership plays in substrates and consumables.',
  },
  {
    date: '29 May 2026',
    title: 'Hidden B2B Opportunities in India’s AI Infrastructure Buildout',
    tag: 'Executive brief',
    read: '6 min',
    blurb:
      'Where Indian industrial firms can capture value as USD 95 billion of DC capex lands in seven corridors — DCIM, UPW services, BESS, fibre splicing, cleanroom commissioning and the operations-layer workforce.',
  },
  {
    date: '29 May 2026',
    title: 'Industrial Cooling Opportunities in India',
    tag: 'Strategic note',
    read: '6 min',
    blurb:
      'Direct-liquid, immersion, hybrid evaporative — the AI-rack density transition opens a ₹7,500–36,000 crore addressable market through 2030, with Indian-vendor capture rising from 35% to 55% as Voltas, Blue Star, Thermax and Eureka Forbes Industrial scale.',
  },
  {
    date: '29 May 2026',
    title: 'Tier-2 Industrial City Opportunity Map',
    tag: 'Framework',
    read: '7 min',
    blurb:
      '30–50 Tier-2 cities will host 1–5 MW edge AI points-of-presence by 2030. This brief positions Coimbatore, Indore, Lucknow, Mysuru, Mangaluru, Hubballi-Dharwad and Vizag against six axes of industrial-AI readiness.',
  },
  {
    date: '22 May 2026',
    title: 'Reading India’s Semiconductor Incentive Architecture',
    tag: 'Executive brief',
    read: '6 min',
    blurb:
      'How the incentive stack is structured across fabrication, packaging and design — and what it reveals about the state’s actual priorities.',
  },
  {
    date: '09 May 2026',
    title: 'Five Constraints on the 2026–28 Fab Ramp',
    tag: 'Strategic note',
    read: '5 min',
    blurb:
      'A decision-oriented read on the binding constraints — water, power, materials, talent and customs throughput — that set the realistic ramp curve.',
  },
  {
    date: '28 Apr 2026',
    title: 'The Corridor Logic of Industrial Policy',
    tag: 'Framework',
    read: '7 min',
    blurb:
      'Why Special Investment Regions matter more than individual plant decisions, and how corridor infrastructure compounds across anchor tenants.',
  },
  {
    date: '14 Apr 2026',
    title: 'Mature Nodes Are Not a Consolation Prize',
    tag: 'Strategic note',
    read: '4 min',
    blurb:
      'Reframing the “bleeding edge vs mature node” debate around volume, employment and the rising value of advanced packaging.',
  },
];
