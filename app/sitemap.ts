import type { MetadataRoute } from 'next';
import { reports } from './reports/data';
import { THEMES } from './reports/themes';
import { signals } from './signals/data';
import { issues } from './newsletter/data';

// The project uses `output: 'export'` for Cloudflare Pages static deploy;
// route handlers must be marked static so they're generated at build time.
export const dynamic = 'force-static';

const SITE = 'https://labs.techadyant.com';

/** Auto-generated sitemap.xml served at /sitemap.xml — Next.js App Router
 *  picks this up automatically. Updated on every build, so freshly-published
 *  reports/signals/briefings appear in the next deploy's sitemap without any
 *  manual maintenance. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Stable top-level pages.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/reports`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/signals`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/newsletter`,lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE}/briefings`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/research`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/about`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE}/research/dependencies`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/research/players`,      lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE}/research/methodology`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Published reports (skip forthcoming — they have placeholder pages with
  // little crawl value until they ship).
  const reportRoutes: MetadataRoute.Sitemap = reports
    .filter((r) => r.status === 'published')
    .map((r) => ({
      url: `${SITE}/reports/${r.slug}`,
      lastModified: new Date(r.published),
      changeFrequency: 'monthly' as const,
      priority: r.access === 'free' ? 0.95 : 0.85,
    }));

  // Live + monitoring signals (skip 'placeholder' status).
  const signalRoutes: MetadataRoute.Sitemap = signals
    .filter((s) => s.status !== 'placeholder')
    .map((s) => ({
      url: `${SITE}/signals/${s.slug}`,
      lastModified: new Date(s.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));


  // Theme hub pages (/reports/theme/<slug>) — only those with published reports,
  // plus the Technology Sovereignty Series landing page.
  const themeHubRoutes: MetadataRoute.Sitemap = THEMES
    .filter((t) => t.count > 0)
    .map((t) => ({
      url: `${SITE}/reports/theme/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));

  const seriesRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/reports/series/technology-sovereignty`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Strategic Signals issues.
  const issueRoutes: MetadataRoute.Sitemap = issues.map((i) => ({
    url: `${SITE}/newsletter/${i.slug}`,
    lastModified: new Date(i.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...reportRoutes, ...themeHubRoutes, ...seriesRoutes, ...signalRoutes, ...issueRoutes];
}
