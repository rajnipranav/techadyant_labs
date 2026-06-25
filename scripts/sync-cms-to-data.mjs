/**
 * Sync CMS data from Supabase into static Next.js data.ts files.
 *
 * Use this after editing content via /admin/cms to publish to the site.
 *
 * Usage: node scripts/sync-cms-to-data.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());

function loadEnv() {
  for (const f of ['.env', '.env.local', '.env.example']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Create a .env file with those values and retry.');
  process.exit(1);
}

const db = createClient(url, key);

function tsString(s) {
  return JSON.stringify(s, null, 2)
    .replace(/'/g, "\\'")
    .replace(/\\"/g, '"')
    .replace(/"([^"]+)":/g, '$1:');
}

function tsValue(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.map(tsValue).join(', ')}]`;
  if (typeof v === 'object') {
    const inner = Object.entries(v).map(([k, val]) => `  ${k}: ${tsValue(val)}`).join(',\n');
    return `{\n${inner}\n}`;
  }
  return JSON.stringify(v);
}

function mapCmsReportToMeta(r) {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle || '',
    domain: r.domain || '',
    edition: r.edition || '',
    published: r.published || '',
    publishedLabel: r.published_label || '',
    readingTime: r.reading_time || '',
    status: r.status || 'published',
    summary: r.summary || '',
    accent: r.accent || '#C9A84C',
    access: r.access || 'free',
    price: r.price ?? undefined,
    currency: r.currency || 'INR',
    hasPdf: !!r.has_pdf,
    hasDeck: !!r.has_deck,
    pages: r.pages ?? undefined,
    cover: r.cover || '',
    previewObject: r.preview_object || '',
    previewPages: r.preview_pages ?? undefined,
    keywords: Array.isArray(r.keywords) ? [...r.keywords] : [],
    faq: Array.isArray(r.faq) ? [...r.faq] : [],
    sources: Array.isArray(r.sources) ? [...r.sources] : [],
    dateModified: r.date_modified || r.published || '',
  };
}

function mapCmsSignalToMeta(s) {
  return {
    slug: s.slug,
    no: s.no || '',
    title: s.title,
    domain: s.domain || '',
    date: s.date || '',
    dateLabel: s.date_label || '',
    status: s.status || 'live',
    excerpt: s.excerpt || '',
    readingTime: s.reading_time || '',
    body: Array.isArray(s.body) ? [...s.body] : [],
    takeaways: Array.isArray(s.takeaways) ? [...s.takeaways] : [],
    sources: Array.isArray(s.sources) ? [...s.sources] : [],
  };
}

async function syncReports() {
  const { data, error } = await db.from('cms_reports').select('*').order('published', { ascending: true });
  if (error) { console.error('CMS reports fetch failed:', error.message); return []; }
  const rows = (data || []);
  const mapped = rows.map(mapCmsReportToMeta);
  const header = `export type AccessTier = 'free' | 'paid';\n\n` +
    `export interface ReportMeta {\n` +
    `  slug: string;\n  title: string;\n  subtitle: string;\n  domain: string;\n  edition: string;\n` +
    `  published: string;\n  publishedLabel: string;\n  readingTime: string;\n  status: 'published' | 'forthcoming';\n` +
    `  summary: string;\n  accent: string;\n  access: AccessTier;\n  price?: number;\n  currency?: 'INR';\n` +
    `  hasPdf: boolean;\n  hasDeck?: boolean;\n  pages?: number;\n  cover?: string;\n` +
    `  previewObject?: string;\n  previewPages?: number;\n  keywords?: string[];\n  faq?: { q: string; a: string }[];\n` +
    `  sources?: string[];\n  dateModified?: string;\n}\n\n` +
    `export const syncedAt = new Date().toISOString();\n\n`;
  const body = `export const reports: ReportMeta[] = ${tsValue(mapped)};\n\n` +
    `export function formatPrice(r: ReportMeta): string {\n` +
    `  if (!r.price) return r.access === 'free' ? 'Free' : '';\n  return \`₹\${(r.price / 100).toLocaleString('en-IN')}\`;\n}\n\n` +
    `export function getReport(slug: string): ReportMeta | undefined {\n  return reports.find((r) => r.slug === slug);\n}\n`;
  return { path: path.join(ROOT, 'app/reports/data.ts'), content: header + body };
}

async function syncSignals() {
  const { data, error } = await db.from('cms_signals').select('*').order('date', { ascending: true });
  if (error) { console.error('CMS signals fetch failed:', error.message); return []; }
  const rows = (data || []);
  const mapped = rows.map(mapCmsSignalToMeta);
  const header = `export interface SignalBody {\n  type: 'p' | 'h' | 'list';\n  text?: string;\n  items?: string[];\n}\n\n` +
    `export interface SignalMeta {\n  slug: string;\n  no: string;\n  title: string;\n  domain: string;\n` +
    `  date: string;\n  dateLabel: string;\n  status: 'live' | 'monitoring' | 'placeholder';\n` +
    `  excerpt: string;\n  readingTime: string;\n  body?: SignalBody[];\n  takeaways?: string[];\n  sources?: string[];\n}\n\n` +
    `export const syncedAt = new Date().toISOString();\n\n`;
  const body = `export const signals: SignalMeta[] = ${tsValue(mapped)};\n\n` +
    `export function getSignal(slug: string): SignalMeta | undefined {\n  return signals.find((s) => s.slug === slug);\n}\n`;
  return { path: path.join(ROOT, 'app/signals/data.ts'), content: header + body };
}

function mapCmsBriefingToMeta(b) {
  const seo = b.seo || {};
  return {
    date: b.published || '',
    slug: b.slug,
    status: b.status === 'published' ? 'live' : 'forthcoming',
    title: b.title,
    tag: seo.tag || 'Strategic note',
    read: seo.read || '',
    blurb: b.summary || '',
    takeaways: Array.isArray(seo.takeaways) ? [...seo.takeaways] : undefined,
    body: Array.isArray(seo.body) ? [...seo.body] : undefined
  };
}

async function syncBriefings() {
  const { data, error } = await db.from('cms_briefings').select('*').order('created_at', { ascending: false });
  if (error) { console.error('CMS briefings fetch failed:', error.message); return null; }
  const rows = (data || []);
  const mapped = rows.map(mapCmsBriefingToMeta);
  const header = `export interface BriefingBody {\n  type: 'p' | 'h' | 'list';\n  text?: string;\n  items?: string[];\n}\n\n` +
    `export interface BriefingMeta {\n  slug: string;\n  date: string;\n  title: string;\n  tag: string;\n` +
    `  read: string;\n  blurb: string;\n  status: 'live' | 'forthcoming';\n` +
    `  takeaways?: string[];\n  body?: BriefingBody[];\n}\n\n`;
  const body = `export const briefings: BriefingMeta[] = ${tsValue(mapped)};\n\n` +
    `export const getBriefing = (slug: string) => briefings.find((b) => b.slug === slug);\n`;
  return { path: path.join(ROOT, 'app/briefings/data.ts'), content: header + body };
}

function mapCmsNewsletterToMeta(n) {
  const seo = n.seo || {};
  const PDF_BASE = 'https://lkqojucjkpxhcngtstfy.supabase.co/storage/v1/object/public/reports-free/';
  return {
    slug: n.slug,
    no: seo.no || '',
    month: seo.month || '',
    date: n.date || '',
    published: seo.published || '',
    title: n.title,
    standfirst: n.description || '',
    readingTime: seo.readingTime || '',
    card: seo.card || '',
    cover: seo.cover || '',
    ogImage: seo.ogImage || '',
    pdf: seo.pdf || (PDF_BASE + encodeURIComponent(n.slug + '.pdf')),
    pdfReady: !!seo.pdfReady,
    status: seo.status || 'live'
  };
}

async function syncNewsletters() {
  const { data, error } = await db.from('cms_newsletters').select('*').order('created_at', { ascending: false });
  if (error) { console.error('CMS newsletters fetch failed:', error.message); return null; }
  const rows = (data || []);
  const mapped = rows.map(mapCmsNewsletterToMeta);
  const header = `export interface IssueMeta {\n  slug: string;\n  no: string;\n  month: string;\n  date: string;\n` +
    `  published: string;\n  title: string;\n  standfirst: string;\n  readingTime: string;\n` +
    `  card: string;\n  cover: string;\n  ogImage: string;\n  pdf: string;\n  pdfReady: boolean;\n  status: 'live' | 'forthcoming';\n}\n\n`;
  const body = `export const issues: IssueMeta[] = ${tsValue(mapped)};\n\n` +
    `export const getIssue = (slug: string) => issues.find((i) => i.slug === slug);\n`;
  return { path: path.join(ROOT, 'app/newsletter/data.ts'), content: header + body };
}

async function main() {
  console.log('Syncing CMS -> static data.ts files…');
  const [reports, signals, briefings, newsletters] = await Promise.all([
    syncReports(),
    syncSignals(),
    syncBriefings(),
    syncNewsletters()
  ]);
  for (const f of [reports, signals, briefings, newsletters].filter(Boolean)) {
    fs.writeFileSync(f.path, f.content, 'utf8');
    console.log(`  wrote ${f.path}`);
  }
  console.log('Sync complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });
