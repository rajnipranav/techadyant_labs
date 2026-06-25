/**
 * Migrate existing report/signal/briefing/content data from static data.ts files
 * into the new Supabase CMS tables.
 *
 * Usage: node scripts/migrate-to-cms.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const ENV_PATH = path.join(ROOT, '.env');
const ENV_LOCAL = path.join(ROOT, '.env.local');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv(ENV_PATH);
loadEnv(ENV_LOCAL);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const db = createClient(url, key);

async function upsert(table, rows) {
  if (!rows.length) return;
  const { error } = await db.from(table).upsert(rows, { onConflict: 'slug' });
  if (error) console.error(`Failed to upsert ${table}:`, error.message);
  else console.log(`  upserted ${rows.length} rows into ${table}`);
}

async function main() {
  console.log('Starting CMS migration…');

  // Load reports data.ts
  const reportsPath = path.join(ROOT, 'app/reports/data.ts');
  const reportsSrc = fs.readFileSync(reportsPath, 'utf8');

  // Extract the reports array using a simple regex
  // We eval the module to get the actual array — safe for this controlled file
  const m = reportsSrc.match(/export const reports: ReportMeta\[\] = (\[[\s\S]*?\]);/);
  if (!m) {
    console.error('Could not find reports array in app/reports/data.ts');
    process.exit(1);
  }

  // Transform TypeScript to plain JS and eval
  const jsSrc = `
    export type AccessTier = 'free' | 'paid';
    export interface ReportMeta {
      slug: string; title: string; subtitle: string; domain: string; edition: string;
      published: string; publishedLabel: string; readingTime: string; status: 'published' | 'forthcoming';
      summary: string; accent: string; access: AccessTier; price?: number; currency?: 'INR';
      hasPdf: boolean; hasDeck?: boolean; pages?: number; cover?: string;
      previewObject?: string; previewPages?: number;
      keywords?: string[]; faq?: { q: string; a: string }[]; sources?: string[];
      dateModified?: string;
    }
    ${m[1]}
  `;

  // Use Function constructor to evaluate just the array
  const fn = new Function('return ' + m[1] + ';');
  const baseReports = fn();

  const cmsReports = baseReports.map((r) => ({
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle || '',
    domain: r.domain || '',
    edition: r.edition || '',
    published: r.published || '',
    published_label: r.publishedLabel || '',
    reading_time: r.readingTime || '',
    status: r.status === 'published' ? 'published' : 'forthcoming',
    summary: r.summary || '',
    accent: r.accent || '#C9A84C',
    access: r.access || 'free',
    price: r.price ?? null,
    currency: r.currency || 'INR',
    has_pdf: !!r.hasPdf,
    has_deck: !!r.hasDeck,
    pages: r.pages ?? null,
    cover: r.cover || '',
    preview_object: r.previewObject || '',
    preview_pages: r.previewPages ?? null,
    keywords: r.keywords || [],
    faq: r.faq || [],
    sources: r.sources || [],
    date_modified: r.dateModified || r.published || '',
    seo: {},
  }));

  await upsert('cms_reports', cmsReports);

  // Load signals data.ts
  const signalsPath = path.join(ROOT, 'app/signals/data.ts');
  if (fs.existsSync(signalsPath)) {
    const signalsSrc = fs.readFileSync(signalsPath, 'utf8');
    const sigMatch = signalsSrc.match(/export const signals: SignalMeta\[\] = (\[[\s\S]*?\]);/);
    if (sigMatch) {
      const sigFn = new Function('return ' + sigMatch[1] + ';');
      const signals = sigFn();
      const cmsSignals = signals.map((s) => ({
        slug: s.slug,
        no: s.no || '',
        title: s.title,
        domain: s.domain || '',
        date: s.date || '',
        date_label: s.dateLabel || '',
        status: s.status || 'live',
        excerpt: s.excerpt || '',
        reading_time: s.readingTime || '',
        body: s.body || [],
        takeaways: s.takeaways || [],
        sources: s.sources || [],
        accent: '#F5B544',
        category: '',
        priority: 'medium',
        seo: {},
      }));
      await upsert('cms_signals', cmsSignals);
    } else {
      console.warn('Could not find signals array in app/signals/data.ts');
    }
  }

  // Load briefings data.ts
  const briefingsPath = path.join(ROOT, 'app/briefings/data.ts');
  if (fs.existsSync(briefingsPath)) {
    const briefingsSrc = fs.readFileSync(briefingsPath, 'utf8');
    const briefMatch = briefingsSrc.match(/export const briefings: BriefingMeta\[\] = (\[[\s\S]*?\]);/);
    if (briefMatch) {
      const briefFn = new Function('return ' + briefMatch[1] + ';');
      const briefings = briefFn();
      const cmsBriefings = briefings.map((b) => ({
        slug: b.slug,
        title: b.title,
        summary: b.blurb || '',
        published: b.date || '',
        status: b.status === 'live' ? 'published' : 'forthcoming',
        accent: b.accent || '#818CF8',
        seo: {
          tag: b.tag || 'Strategic note',
          read: b.read || '',
          takeaways: b.takeaways || [],
          body: b.body || []
        }
      }));
      await upsert('cms_briefings', cmsBriefings);
    } else {
      console.warn('Could not find briefings array in app/briefings/data.ts');
    }
  }

  // Load newsletter data.ts
  const newsletterPath = path.join(ROOT, 'app/newsletter/data.ts');
  if (fs.existsSync(newsletterPath)) {
    const newsletterSrc = fs.readFileSync(newsletterPath, 'utf8');
    const nlMatch = newsletterSrc.match(/export const issues: IssueMeta\[\] = (\[[\s\S]*?\]);/);
    if (nlMatch) {
      const nlFn = new Function('const PDF_BASE = "https://lkqojucjkpxhcngtstfy.supabase.co/storage/v1/object/public/reports-free/"; return ' + nlMatch[1] + ';');
      const issues = nlFn();
      const cmsNewsletters = issues.map((i) => ({
        slug: i.slug,
        title: i.title,
        date: i.date || '',
        description: i.standfirst || '',
        accent: i.accent || '#F5B544',
        seo: {
          no: i.no || '',
          month: i.month || '',
          published: i.published || '',
          readingTime: i.readingTime || '',
          card: i.card || '',
          cover: i.cover || '',
          ogImage: i.ogImage || '',
          pdf: i.pdf || '',
          pdfReady: !!i.pdfReady,
          status: i.status || 'live'
        }
      }));
      await upsert('cms_newsletters', cmsNewsletters);
    } else {
      console.warn('Could not find issues array in app/newsletter/data.ts');
    }
  }

  // Seed default pages
  const cmsPages = [
    {
      slug: 'about',
      title: 'About Techadyant Labs',
      content: '# About Techadyant Labs\n\nTechadyant Labs studies India’s industrial transformation, infrastructure systems, and emerging strategic technologies.',
      seo: { description: 'About Techadyant Labs independent strategic intelligence platform.' }
    },
    {
      slug: 'services',
      title: 'Our Services',
      content: '# Our Services\n\nWe provide independent research, custom briefings, and strategic advisory services.',
      seo: { description: 'Services provided by Techadyant Labs.' }
    }
  ];
  await upsert('cms_pages', cmsPages);

  console.log('Migration complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
