/** Channel introduction video (YouTube @techadyantlabs). Single source of truth for
 *  the embed (components/IntroVideo.tsx), the VideoObject JSON-LD on the home page,
 *  and the footer/sameAs links. Plain module (no 'use client') so server components
 *  can read the values. */
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@techadyantlabs';

export const INTRO_VIDEO = {
  id: 'fimU1mYpfu4',
  title: 'Techadyant Labs: Independent Intelligence on India’s Industrial Transformation',
  description:
    'A three-minute introduction to Techadyant Labs — the ten industrial pillars we track, the six surfaces that deliver our work, and a short tour of the platform.',
  thumbnail: 'https://labs.techadyant.com/video/techadyantlabs-intro.jpg',
  localThumb: '/video/techadyantlabs-intro.jpg',
  uploadDate: '2026-10-27',
  duration: 'PT3M10S',
  durationLabel: '3 min',
  chapters: [
    { t: 0, label: 'Welcome to Techadyant Labs' },
    { t: 64, label: 'The ten industrial pillars' },
    { t: 83, label: 'Six surfaces, including Sanket' },
    { t: 99, label: 'Platform tour: the Atlas' },
    { t: 120, label: 'Dependencies' },
    { t: 130, label: 'Corridors' },
    { t: 139, label: 'Signals' },
    { t: 149, label: 'Reports' },
    { t: 164, label: 'Commissioned research' },
  ],
} as const;

export const watchUrl = (t = 0) =>
  `https://www.youtube.com/watch?v=${INTRO_VIDEO.id}${t ? `&t=${t}s` : ''}`;

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** JSON-LD VideoObject (with chapter Clips) for the home page graph. */
export const introVideoLd = {
  '@type': 'VideoObject',
  '@id': 'https://labs.techadyant.com/#intro-video',
  name: INTRO_VIDEO.title,
  description: INTRO_VIDEO.description,
  thumbnailUrl: [INTRO_VIDEO.thumbnail],
  uploadDate: INTRO_VIDEO.uploadDate,
  duration: INTRO_VIDEO.duration,
  contentUrl: watchUrl(),
  embedUrl: `https://www.youtube-nocookie.com/embed/${INTRO_VIDEO.id}`,
  publisher: { '@id': 'https://labs.techadyant.com/#org' },
  inLanguage: 'en-IN',
  hasPart: INTRO_VIDEO.chapters.map((c, i, a) => ({
    '@type': 'Clip',
    name: c.label,
    startOffset: c.t,
    endOffset: a[i + 1]?.t ?? 190,
    url: watchUrl(c.t),
  })),
};

