import { reports, type ReportMeta } from './data';

/** Controlled taxonomy helpers shared by the reports index, theme hub pages,
 *  the series page and the sitemap — one vocabulary across the site. */
export const themeSlug = (domain: string) =>
  domain.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export interface Theme { domain: string; slug: string; count: number }

export const THEMES: Theme[] = Array.from(new Set(reports.map((r) => r.domain)))
  .map((domain) => ({
    domain,
    slug: themeSlug(domain),
    count: reports.filter((r) => r.domain === domain && r.status === 'published').length,
  }))
  .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));

export const reportsByTheme = (slug: string): ReportMeta[] =>
  reports.filter((r) => themeSlug(r.domain) === slug);

export const themeBySlug = (slug: string): Theme | undefined => THEMES.find((t) => t.slug === slug);
