/**
 * CMS data layer for the public site.
 * Reads from Supabase CMS tables when available; falls back to empty arrays.
 * Server-side use only.
 */

import { getSupabase } from './supabase';

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
