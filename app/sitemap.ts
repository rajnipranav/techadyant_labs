import type { MetadataRoute } from 'next';
import { reports } from './reports/data';
import { THEMES } from './reports/themes';
import { signals } from './signals/data';
import { issues } from './newsletter/data';
import { allPlayers, playerSlug, corridorsOrdered, meta as corridorMeta, lastUpdated as atlasUpdated } from './research/atlas';
import { CATEGORY_HUBS, STATE_HUBS } from './research/suppliers-hubs';
import { graphEntities } from './research/graph';
import { corridors as indCorridors } from './corridors/data';
import { allCorridorNodePairs } from './corridors/node-data';
import platformEntities from './research/_platform.json';
import droneAtlas from './research/_drones.json';
import cuasAtlas from './research/_cuas.json';

// The project uses `output: 'export'` for Cloudflare Pages static deploy;
// route handlers must be marked static so they're generated at build time.
export const dynamic = 'force-static';

const SITE = 'https://labs.techadyant.com';

/** Auto-generated sitemap.xml served at /sitemap.xml — Next.js App Router
 *  picks this up automatically. Updated on every build, so freshly-published
 *  reports/signals/briefings appear in the next deploy's sitemap without any
 *  manual maintenance. */
// Parse a date string to epoch ms; returns 0 for missing/invalid values so it
// never throws and never wins the Math.max() below.
function toTime(d?: string): number {
  const t = d ? Date.parse(d) : NaN;
  return Number.isNaN(t) ? 0 : t;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // `now` is a STABLE "site last-updated" date derived from real content dates,
  // NOT the build time. Previously this was `new Date()`, so all 400+ pages
  // without their own date shared a timestamp that changed on every deploy —
  // which tells Google nothing about what actually changed and makes it
  // de-prioritise re-crawling. This value only moves when new content ships.
  // Per-item pages (reports, signals, issues, entities) keep their own dates.
  const contentDates: number[] = [
    ...reports.filter((r) => r.status === 'published').map((r) => toTime(r.published)),
    ...signals.filter((s) => s.status !== 'placeholder').map((s) => toTime(s.date)),
    ...issues.map((i) => toTime(i.date)),
    toTime(atlasUpdated),
  ];
  const maxContent = Math.max(0, ...contentDates);
  const now = maxContent > 0 ? new Date(maxContent) : new Date();

  // Stable top-level pages.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/reports/`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/signals/`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/newsletter/`,lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE}/briefings/`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/research/`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/about/`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE}/resources/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/methodology/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/research/dependencies/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/research/entities/`,     lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/research/players/`,      lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE}/research/suppliers/`,    lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    ...CATEGORY_HUBS.map((h) => ({ url: `${SITE}/research/suppliers/category/${h.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...STATE_HUBS.map((h) => ({ url: `${SITE}/research/suppliers/state/${h.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${SITE}/research/methodology/`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/research/supply-chains/`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE}/research/corridors/`,     lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/research/pillars/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...corridorsOrdered.map((c) => ({ url: `${SITE}/research/pillars/${corridorMeta(c.code).slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.75 })),
    { url: `${SITE}/research/sources/`,       lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE}/research/explorer/`,      lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/research/patents/`,       lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/research/drones-uas/`,   lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/research/search/`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Published reports (skip forthcoming — they have placeholder pages with
  // little crawl value until they ship).
  const reportRoutes: MetadataRoute.Sitemap = reports
    .filter((r) => r.status === 'published')
    .map((r) => ({
      url: `${SITE}/reports/${r.slug}/`,
      lastModified: new Date(r.published),
      changeFrequency: 'monthly' as const,
      priority: r.access === 'free' ? 0.95 : 0.85,
    }));

  // Live + monitoring signals (skip 'placeholder' status).
  const signalRoutes: MetadataRoute.Sitemap = signals
    .filter((s) => s.status !== 'placeholder')
    .map((s) => ({
      url: `${SITE}/signals/${s.slug}/`,
      lastModified: new Date(s.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));


  // Theme hub pages (/reports/theme/<slug>) — only those with published reports,
  // plus the Technology Sovereignty Series landing page.
  const themeHubRoutes: MetadataRoute.Sitemap = THEMES
    .filter((t) => t.count > 0)
    .map((t) => ({
      url: `${SITE}/reports/theme/${t.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));

  const seriesRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/reports/series/technology-sovereignty/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Strategic Signals issues.
  const issueRoutes: MetadataRoute.Sitemap = issues.map((i) => ({
    url: `${SITE}/newsletter/${i.slug}/`,
    lastModified: new Date(i.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Atlas — per-corridor profiles and per-player detail pages (high GEO value).
  const corridorRoutes: MetadataRoute.Sitemap = corridorsOrdered.map((c) => ({
    url: `${SITE}/research/corridors/${corridorMeta(c.code).slug}/`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
  }));
  const playerRoutes: MetadataRoute.Sitemap = allPlayers.map((pl) => ({
    url: `${SITE}/research/players/${playerSlug(pl.id)}/`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5,
  }));
  const entityRoutes: MetadataRoute.Sitemap = graphEntities.map((entity) => ({
    url: `${SITE}/research/entities/${entity.slug}/`,
    lastModified: entity.updatedAt ? new Date(entity.updatedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: entity.kind === 'company' || entity.kind === 'ecosystem' ? 0.65 : 0.55,
  }));

  const indCorridorRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/corridors/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${SITE}/corridors/new-imcs/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.75 },
    ...indCorridors.map((c) => ({ url: `${SITE}/corridors/${c.slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];

  const corridorNodeRoutes: MetadataRoute.Sitemap = allCorridorNodePairs().map((p) => ({ url: `${SITE}/corridors/${p.corridor}/${p.node}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }));

  const platformRoutes: MetadataRoute.Sitemap = (platformEntities as { kind: string; slug: string }[]).map((e) => ({ url: `${SITE}/research/e/${e.kind}/${e.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 }));

  const da = droneAtlas as { platforms: { slug: string }[]; companies: { slug: string }[] };
  const droneEntityRoutes: MetadataRoute.Sitemap = [
    ...da.platforms.map((pp) => ({ url: `${SITE}/research/drones-uas/platform/${pp.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...da.companies.map((cc) => ({ url: `${SITE}/research/drones-uas/company/${cc.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
  const ca = cuasAtlas as { systems: { slug: string }[]; manufacturers: { slug: string }[] };
  const cuasRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/research/counter-uas/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...ca.systems.map((x) => ({ url: `${SITE}/research/counter-uas/system/${x.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.55 })),
    ...ca.manufacturers.map((x) => ({ url: `${SITE}/research/counter-uas/manufacturer/${x.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
  return [...indCorridorRoutes, ...corridorRoutes, ...playerRoutes, ...entityRoutes, ...staticRoutes, ...reportRoutes, ...themeHubRoutes, ...seriesRoutes, ...signalRoutes, ...issueRoutes, ...corridorNodeRoutes, ...platformRoutes, ...droneEntityRoutes, ...cuasRoutes];
}
