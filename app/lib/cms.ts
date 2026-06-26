/**
 * CMS data layer for the public site.
 * Reads from Supabase CMS tables when available; falls back to empty arrays.
 * Server-side use only.
 */

import { getSupabase } from './supabase';
import type { ReportMeta } from '../reports/data';

export type CmsReport = {
  slug: string;
  title: string;
  subtitle: string;
  domain: string;
  edition: string;
  published: string;
  published_label: string;
  reading_time: string;
  status: 'published' | 'forthcoming';
  summary: string;
  accent: string;
  access: 'free' | 'paid';
  price: number | null;
  currency: string;
  has_pdf: boolean;
  has_deck: boolean;
  pages: number | null;
  cover: string;
  preview_object: string;
  preview_pages: number | null;
  keywords: string[];
  faq: { q: string; a: string }[];
  sources: string[];
  date_modified: string;
  body_component: string;
  body_params: Record<string, any>;
  seo: Record<string, any>;
};

export type CmsSignal = {
  slug: string;
  no: string;
  title: string;
  domain: string;
  date: string;
  date_label: string;
  status: 'live' | 'monitoring' | 'placeholder';
  excerpt: string;
  reading_time: string;
  body: { type: 'p' | 'h' | 'list'; text?: string; items?: string[] }[];
  takeaways: string[];
  sources: string[];
  accent: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  seo: Record<string, any>;
};

export type CmsBriefing = {
  slug: string;
  title: string;
  summary: string;
  published: string;
  status: 'published' | 'forthcoming';
  accent: string;
  seo: Record<string, any>;
};

export type CmsNewsletter = {
  slug: string;
  title: string;
  date: string;
  description: string;
  accent: string;
  seo: Record<string, any>;
};

export type CmsPage = {
  slug: string;
  title: string;
  content: string;
  seo: Record<string, any>;
};

async function fromSupabase<T>(table: string): Promise<T[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(`CMS fetch error [${table}]:`, error);
    return [];
  }
  return (data as T[]) || [];
}

export async function getReports(): Promise<CmsReport[]> {
  return fromSupabase<CmsReport>('cms_reports');
}

/** Convert a snake_case CMS row into the camelCase ReportMeta shape the UI
 *  components (cards, detail header, price badges) expect. */
export function cmsToReportMeta(c: CmsReport): ReportMeta {
  return {
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    domain: c.domain,
    edition: c.edition,
    published: c.published,
    publishedLabel: c.published_label,
    readingTime: c.reading_time,
    status: c.status,
    summary: c.summary,
    accent: c.accent,
    access: c.access,
    price: c.price ?? undefined,
    currency: (c.currency as 'INR') || 'INR',
    hasPdf: c.has_pdf,
    hasDeck: c.has_deck,
    pages: c.pages ?? undefined,
    cover: c.cover || undefined,
    previewObject: c.preview_object || undefined,
    previewPages: c.preview_pages ?? undefined,
    keywords: c.keywords || [],
    faq: c.faq || [],
    sources: c.sources || [],
    dateModified: c.date_modified || undefined,
  };
}

/** Catalogue display order: published reports newest-first by publish date,
 *  then forthcoming reports soonest-first. Independent of DB row insertion
 *  order (created_at), which is identical across the seeded rows. */
const statusRank = (s: ReportMeta['status']) => (s === 'published' ? 0 : 1);
export function sortReportsMeta(list: ReportMeta[]): ReportMeta[] {
  return [...list].sort((a, b) => {
    const sr = statusRank(a.status) - statusRank(b.status);
    if (sr !== 0) return sr;
    if (a.status === 'published') {
      return a.published < b.published ? 1 : a.published > b.published ? -1 : 0;
    }
    return a.published < b.published ? -1 : a.published > b.published ? 1 : 0;
  });
}

/** Reports in the correct UI shape and order. Use this in pages, not the raw
 *  getReports(), so price/date fields render and the sequence is newest-first. */
export async function getReportsMeta(): Promise<ReportMeta[]> {
  const rows = await getReports();
  return sortReportsMeta(rows.map(cmsToReportMeta));
}

export async function getSignals(): Promise<CmsSignal[]> {
  return fromSupabase<CmsSignal>('cms_signals');
}

export async function getBriefings(): Promise<CmsBriefing[]> {
  return fromSupabase<CmsBriefing>('cms_briefings');
}

export async function getNewsletters(): Promise<CmsNewsletter[]> {
  return fromSupabase<CmsNewsletter>('cms_newsletters');
}

export async function getPages(): Promise<CmsPage[]> {
  return fromSupabase<CmsPage>('cms_pages');
}

export async function getReportBySlug(slug: string): Promise<CmsReport | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from('cms_reports').select('*').eq('slug', slug).maybeSingle();
  return (data as CmsReport) || null;
}

export async function getSignalBySlug(slug: string): Promise<CmsSignal | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from('cms_signals').select('*').eq('slug', slug).maybeSingle();
  return (data as CmsSignal) || null;
}
