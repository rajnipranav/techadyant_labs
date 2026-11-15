/** Research video registry (YouTube @techadyantlabs).
 *  Publishing a new video = add one entry here + a self-hosted poster in public/video/.
 *  Pages call videosFor(type, slug) and render <ResearchVideo /> with videoLd() JSON-LD.
 *  The channel intro still lives in ./introVideo.ts (home page). */
import { YOUTUBE_CHANNEL } from './introVideo';

export { YOUTUBE_CHANNEL };

export type VideoPlacementType = 'atlas' | 'dependencies' | 'report' | 'corridor' | 'pillar';

export type ResearchVideoEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  localThumb: string;
  uploadDate: string;
  duration: string; // ISO 8601
  durationSec: number;
  durationLabel: string;
  chapters: { t: number; label: string }[];
  takeaways: string[];
  placements: { type: VideoPlacementType; slug: string; heading?: string; note?: string; related?: { label: string; href: string } }[];
};

const SITE = 'https://labs.techadyant.com';

export const VIDEOS: ResearchVideoEntry[] = [
  {
    id: 'OVhdiEwsLCY',
    slug: 'india-semiconductor-reality-check-2026',
    title: 'India Makes Chips Now. So Why Are the Wafers Still Imported?',
    description:
      'India’s semiconductor push in 2026: four new chip plants are running, but every wafer inside them is still made abroad. What a fab does versus a packaging plant, what India imports, why the rules put packaging first, China’s leverage, and when India’s own wafers arrive.',
    localThumb: '/video/india-semiconductor-reality-check-2026.jpg',
    uploadDate: '2026-11-05',
    duration: 'PT12M25S',
    durationSec: 745,
    durationLabel: '12 min',
    chapters: [
      { t: 0, label: 'Four new plants, no wafers' },
      { t: 60, label: 'Fab vs packaging in 60 seconds' },
      { t: 100, label: 'What India imports' },
      { t: 135, label: '2026: the year it moved' },
      { t: 195, label: 'The catch: packaging is not a fab' },
      { t: 323, label: 'Why the back end came first' },
      { t: 388, label: 'Follow the subsidies' },
      { t: 441, label: 'China’s leverage' },
      { t: 532, label: 'Who else broke free' },
      { t: 590, label: 'So, when? Our estimate' },
      { t: 667, label: 'Five signals to watch' },
      { t: 699, label: 'The answer: a ladder' },
    ],
    takeaways: [
      'Four new chip plants began commercial or pilot production in 2026, starting with Sanand in February. All of them assemble, test and package chips; none of them makes wafers, so the silicon inside is imported.',
      'India imported $23.4 billion of integrated circuits in 2024, almost double the $12.4 billion of 2021. About 45% came from China.',
      'The mission paid half the project cost for fabs and half the capital cost for packaging plants. Packaging is cheaper and faster, so it came first by design.',
      'Techadyant estimate: the first Indian fab wafers arrive in 2028 at the earliest (90 nm); imports of chips for cars and defence ease from 2029–31; phone-class processors stay imported this decade.',
    ],
    placements: [
      { type: 'dependencies', slug: 'semiconductors', heading: 'Four plants running, no wafers', note: 'Why India’s 2026 chip plants package imported silicon, and when the wafer gap closes.', related: { label: 'Read: Who Really Benefits from India’s Fab Ecosystem?', href: '/reports/india-fab-ecosystem/' } },
      { type: 'report', slug: 'india-fab-ecosystem', related: { label: 'See India’s semiconductor import dependency', href: '/dependencies/sectors/semiconductors/' } },
      { type: 'report', slug: 'semicon-2-0-opportunity-map', related: { label: 'See India’s semiconductor import dependency', href: '/dependencies/sectors/semiconductors/' } },
      { type: 'report', slug: 'dholera-semiconductor-supplier-ecosystem', related: { label: 'See India’s semiconductor import dependency', href: '/dependencies/sectors/semiconductors/' } },
    ],
  },
  {
    id: '6DgYQdDoHIg',
    slug: 'india-drone-ambition-chinese-parts',
    title: 'India’s Drone Ambition vs. The Reality of Chinese Parts',
    description:
      'India banned imports of finished drones in 2022, yet Indian drones still fly on Chinese parts. Which parts, why the ban missed them, what the rules and money say, and when each class of drone can break free.',
    localThumb: '/video/india-drone-import-ban.jpg',
    uploadDate: '2026-11-03',
    duration: 'PT10M10S',
    durationSec: 610,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: '400 drones cancelled' },
      { t: 54, label: 'What’s inside an Indian drone' },
      { t: 115, label: 'The loophole: parts are free to import' },
      { t: 207, label: 'Operation Sindoor and the buying' },
      { t: 257, label: 'Is there a ban on Chinese parts?' },
      { t: 329, label: 'The money: PLI and the scheme that wasn’t' },
      { t: 417, label: 'China’s hand' },
      { t: 458, label: 'Who else broke free' },
      { t: 494, label: 'So, when? Our estimate' },
      { t: 577, label: 'Four signals to watch' },
    ],
    takeaways: [
      'The February 2022 ban stopped finished drones and kits, not parts. Drone parts are still free to import, and a drone assembled from them counts as Indian.',
      'Across all uses, China supplies 91% of India’s lithium-ion cell imports, 56% of small electric motors and 38% of cameras (UN Comtrade, 2024).',
      'The only official figure: 39% of flight controllers in small drones come from China, based on data the makers reported themselves.',
      'Techadyant estimate: military small drones break free around 2028–30, farm and enterprise drones around 2030–33, consumer and FPV drones in the mid-2030s or never. The deciding factor is who forces the change, and today only the military buyer does.',
    ],
    placements: [
      { type: 'atlas', slug: 'drones-uas', related: { label: 'See where India’s import dependence concentrates', href: '/dependencies/' } },
      { type: 'dependencies', slug: 'hub', related: { label: 'Explore the Drone & UAS Atlas', href: '/research/drones-uas/' } },
    ],
  },
  {
    id: 'lCTpsbZv3u8',
    slug: 'what-it-takes-for-india-to-build-grid-scale-batter',
    title: 'What It Takes for India to Build Grid-Scale Batteries (The Cell Supply Chain)',
    description:
      'India is planning energy storage at a scale that can reshape its power system. But a self-reliant battery industry goes beyond factory announcements. The real milestone is producing high-yield, reliable cells from materials India can refine and control.  A battery pack assembled in India is not nece...',
    localThumb: '/video/what-it-takes-for-india-to-build-grid-scale-batter.jpg',
    uploadDate: '2026-11-14',
    duration: 'PT11M19S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      'Strategic analysis covering What It Takes for India to Build Grid-Scale Batteries (The Cell Supply Chain).',
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'dependencies', slug: 'energy-transition', related: { label: 'See Clean Energy dependencies', href: '/dependencies/' } },
      { type: 'report', slug: 'india-grid-scale-bess-supply-chain', related: { label: 'Read: India Grid-Scale BESS Supply Chain', href: '/reports/india-grid-scale-bess-supply-chain/' } }
    ],
  },
  {
    id: 'LQpv_2Sr2Go',
    slug: 'what-will-india-s-first-chip-factory-actually-powe',
    title: 'What Will India’s First Chip Factory Actually Power?',
    description:
      "India's first commercial chip factory is being built by Tata Electronics at Dholera, Gujarat. But what will its chips actually power: electric cars, solar plants, data centres, missiles, or your phone?  In this video we follow the chips out of the factory and into the products. Dholera is a mature-n...",
    localThumb: '/video/what-will-india-s-first-chip-factory-actually-powe.jpg',
    uploadDate: '2026-11-13',
    duration: 'PT10M4S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      'Strategic analysis covering What Will India’s First Chip Factory Actually Power?.',
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'dependencies', slug: 'semiconductors', related: { label: "See India's semiconductor import dependency", href: '/dependencies/sectors/semiconductors/' } },
      { type: 'report', slug: 'india-fab-ecosystem', related: { label: "Read: Who Really Benefits from India's Fab Ecosystem?", href: '/reports/india-fab-ecosystem/' } },
      { type: 'report', slug: 'semicon-2-0-opportunity-map', related: { label: 'Read: Semicon 2.0 Opportunity Map', href: '/reports/semicon-2-0-opportunity-map/' } }
    ],
  },
  {
    id: 'OBu9zCHVyBc',
    slug: 'dholera-in-2026-what-s-actually-built-vs-what-s-st',
    title: 'Dholera in 2026: What’s Actually Built vs What’s Still Just a Plan',
    description:
      "You can now drive from Ahmedabad to Dholera in under an hour. You cannot fly there yet. That gap is the whole story of Dholera.  This is a reality check, as of November 2026, on India's planned chip capital. We sorted every big promise into three piles: running today, rising from the ground, or stil...",
    localThumb: '/video/dholera-in-2026-what-s-actually-built-vs-what-s-st.jpg',
    uploadDate: '2026-11-13',
    duration: 'PT13M13S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      'Strategic analysis covering Dholera in 2026: What’s Actually Built vs What’s Still Just a Plan.',
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'dependencies', slug: 'semiconductors', related: { label: "See India's semiconductor import dependency", href: '/dependencies/sectors/semiconductors/' } },
      { type: 'report', slug: 'india-fab-ecosystem', related: { label: "Read: Who Really Benefits from India's Fab Ecosystem?", href: '/reports/india-fab-ecosystem/' } },
      { type: 'report', slug: 'semicon-2-0-opportunity-map', related: { label: 'Read: Semicon 2.0 Opportunity Map', href: '/reports/semicon-2-0-opportunity-map/' } }
    ],
  },
  {
    id: 'TfOUf9oFLvI',
    slug: 'india-s-pli-scheme-1-97-lakh-crore-promised-what-w',
    title: "India's PLI Scheme: ₹1.97 Lakh Crore Promised, What Was Delivered?",
    description:
      "Did India's Production Linked Incentive (PLI) scheme work? We compared official targets with what ministries actually reported, sector by sector: electronics, pharmaceuticals, autos and drones, and textiles.  📌 QUICK ANSWER India's PLI scheme, approved in April 2020, offers about ₹1.97 lakh crore (r...",
    localThumb: '/video/india-s-pli-scheme-1-97-lakh-crore-promised-what-w.jpg',
    uploadDate: '2026-11-12',
    duration: 'PT13M1S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      "Strategic analysis covering India's PLI Scheme: ₹1.97 Lakh Crore Promised, What Was Delivered?.",
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'atlas', slug: 'drones-uas', related: { label: 'Explore the Drone & UAS Atlas', href: '/research/drones-uas/' } },
      { type: 'dependencies', slug: 'hub', related: { label: "See India's import dependencies", href: '/dependencies/' } },
      { type: 'report', slug: 'who-builds-indias-drones', related: { label: "Read report: Who Builds India's Drones?", href: '/reports/who-builds-indias-drones/' } }
    ],
  },
  {
    id: 'khvO3aByxfs',
    slug: 'india-has-millions-of-engineers-why-can-t-its-fact',
    title: 'India Has Millions of Engineers. Why Can’t Its Factories Hire Them?',
    description:
      "India is building semiconductor fabs, electronics factories, battery plants and defence manufacturing facilities. But there is a problem: **India has millions of engineering graduates, yet its new factories are struggling to find the skilled workforce they need.**  Why can't India's factories hire I...",
    localThumb: '/video/india-has-millions-of-engineers-why-can-t-its-fact.jpg',
    uploadDate: '2026-11-10',
    duration: 'PT12M49S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      'Strategic analysis covering India Has Millions of Engineers. Why Can’t Its Factories Hire Them?.',
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'dependencies', slug: 'semiconductors', related: { label: "See India's semiconductor import dependency", href: '/dependencies/sectors/semiconductors/' } },
      { type: 'report', slug: 'india-fab-ecosystem', related: { label: "Read: Who Really Benefits from India's Fab Ecosystem?", href: '/reports/india-fab-ecosystem/' } },
      { type: 'report', slug: 'semicon-2-0-opportunity-map', related: { label: 'Read: Semicon 2.0 Opportunity Map', href: '/reports/semicon-2-0-opportunity-map/' } }
    ],
  },
  {
    id: 'vDdDUcL3c08',
    slug: 'isro-hands-rocket-designs-to-private-companies-wha',
    title: 'ISRO Hands Rocket Designs to Private Companies: What Changes?',
    description:
      'ISRO is handing over its rocket designs, not just launch services, to Indian companies. This video explains what the ISRO technology transfer of the SSLV, PSLV and LVM3 means for factories, MSMEs, jobs and the cost of reaching orbit.  📌 QUICK ANSWER ISRO is transferring launch vehicle designs to Ind...',
    localThumb: '/video/isro-hands-rocket-designs-to-private-companies-wha.jpg',
    uploadDate: '2026-11-10',
    duration: 'PT11M13S',
    durationSec: 600,
    durationLabel: '10 min',
    chapters: [
      { t: 0, label: 'Introduction' }
    ],
    takeaways: [
      'Strategic analysis covering ISRO Hands Rocket Designs to Private Companies: What Changes?.',
      "Detailed insights on India's industrial and supply-chain capabilities."
    ],
    placements: [
      { type: 'report', slug: 'iaf-autonomous-air-power-roadmap-2026-2035', related: { label: 'Read: Autonomous Air Power Roadmap', href: '/reports/iaf-autonomous-air-power-roadmap-2026-2035/' } }
    ],
  },
];

export const videosFor = (type: VideoPlacementType, slug: string) =>
  VIDEOS.filter((v) => v.placements.some((p) => p.type === type && p.slug === slug)).map((v) => ({
    video: v,
    related: v.placements.find((p) => p.type === type && p.slug === slug)?.related,
  }));

export const videoWatchUrl = (id: string, t = 0) => `https://www.youtube.com/watch?v=${id}${t ? `&t=${t}s` : ''}`;

export const fmtVideoTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** VideoObject JSON-LD (with chapter Clips) for a page where the video is a main element. */
export const videoLd = (v: ResearchVideoEntry, pagePath: string) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  '@id': `${SITE}${pagePath}#video-${v.slug}`,
  name: v.title,
  description: v.description,
  thumbnailUrl: [`${SITE}${v.localThumb}`],
  uploadDate: v.uploadDate,
  duration: v.duration,
  contentUrl: videoWatchUrl(v.id),
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
  publisher: { '@id': `${SITE}/#org` },
  inLanguage: 'en-IN',
  hasPart: v.chapters.map((c, i, a) => ({
    '@type': 'Clip',
    name: c.label,
    startOffset: c.t,
    endOffset: a[i + 1]?.t ?? v.durationSec,
    url: videoWatchUrl(v.id, c.t),
  })),
});
