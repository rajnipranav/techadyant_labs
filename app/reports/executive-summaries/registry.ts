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
  'indian-navy-autonomous-maritime': {
    title: "The Indian Navy's Autonomous Maritime Transformation, 2026-2035",
    description:
      "Free executive summary. India's naval autonomy readiness is 2.6/5 vs US 4.5; a ~Rs 1.2 lakh crore market; three binding substrate constraints set the pace.",
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/Indian_Navy_Autonomous_Maritime.jpg',
  },
  'beyond-solar-panels': {
    title: "Beyond Solar Panels: India's Hidden Industrial Foundations",
    description:
      "Free executive summary. 162.15 GW deployed, but value lies upstream: China holds ~85% of supply-chain capacity; Tier 1 materials offer 16-30% IRRs.",
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/Beyond-Solar-Panels-Indian-Industrial-Intelligence.jpg',
  },
  'india-green-hydrogen': {
    title: "The Hydrogen Mirage or Machine? India's Green Hydrogen Reality",
    description:
      "Free executive summary. India committed Rs 19,744 cr to green hydrogen, but the electrolyser is ~60% Chinese-built and 100% PGM-dependent. Scenarios to 2030.",
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~6 min',
    ogImage: 'https://library.techadyant.com/covers/Green_Hydrogen_Report.jpg',
  },
  'q-day-india': {
    title: 'Q-Day India: Post-Quantum Readiness, 2026-2033',
    description:
      "Free strategic report. India has roughly four years before CNSA 2.0, SWIFT and Quad deadlines force post-quantum migration. 87% of national HND-vulnerable traffic sits in four sectors.",
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~7 min',
    ogImage: 'https://library.techadyant.com/covers/Techadyant_Labs_QDay_Report.jpg',
  },
  'kalpasar-economic-impact': {
    title: "Kalpasar: India's Rs 1.33 Lakh Crore Bay Project",
    description:
      'Free assessment of the Rs 1.33 lakh crore Gulf of Khambhat closure dam: 21.5% economic IRR vs ~1% equity IRR, and why it is unsanctioned after 40 years.',
    published: '2026-08-16',
    publishedLabel: '16 Aug 2026',
    readingTime: '~7 min',
    ogImage: 'https://labs.techadyant.com/covers/kalpasar-economic-impact.jpg',
  },
};

export const EXEC_SUMMARY_SLUGS = Object.keys(EXEC_SUMMARIES);

export function hasExecutiveSummary(slug: string): boolean {
  return slug in EXEC_SUMMARIES;
}
