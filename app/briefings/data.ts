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
