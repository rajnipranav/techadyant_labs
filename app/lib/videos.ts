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
  placements: { type: VideoPlacementType; slug: string; related?: { label: string; href: string } }[];
};

const SITE = 'https://labs.techadyant.com';

export const VIDEOS: ResearchVideoEntry[] = [
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
