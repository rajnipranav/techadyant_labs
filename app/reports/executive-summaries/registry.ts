export interface ExecSummaryMeta {
  title: string;
  description: string;
  published: string;
  publishedLabel: string;
  readingTime: string;
  ogImage: string;
}

/** Reports that have a public executive-summary page. Add a slug here when a
 *  summary ships; the route, sitemap and report-page CTA follow automatically. */
export const EXEC_SUMMARIES: Record<string, ExecSummaryMeta> = {
  'beyond-sea-drones-india-autonomous-maritime-systems': {
    title: "Beyond Sea Drones: India's Maritime Autonomy, 2026–2035",
    description:
      'Free executive summary. India ranks 9/12 in maritime autonomy; the market reaches ₹55,000 crore by 2035. Subsystem dependencies and roadmap, scored with 125 tiered sources.',
    published: '2026-08-15',
    publishedLabel: '15 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/beyond_sea-drones-indian-navy.jpg',
  },
  'india-critical-manufacturing-dependencies': {
    title: "India's Critical Manufacturing Dependencies, 2026–2035",
    description:
      "Free executive summary. India's $506B strategic import surface, 312 localisable opportunity surfaces and a $480B localisation envelope, CMDI-scored.",
    published: '2026-08-01',
    publishedLabel: '01 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/india-critical-manufacturing-dependencies.jpg',
  },
  'iaf-autonomous-air-power': {
    title: "IAF Autonomous Air Power Roadmap, 2026-2035",
    description:
      "Free executive summary. India's Air Autonomy Readiness Index is 34/100 vs USAF 88; four critical dependencies score 20/25; cost-exchange flips to ~750:1 by 2035.",
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/IAF_Autonomous_Air_Power_Roadmap_2026-2035.jpg',
  },
};

export const EXEC_SUMMARY_SLUGS = Object.keys(EXEC_SUMMARIES);

export function hasExecutiveSummary(slug: string): boolean {
  return slug in EXEC_SUMMARIES;
}
