#!/usr/bin/env node
/**
 * Update a report's SEO meta (title/description) in the CMS (cms_reports.seo).
 *
 * Usage: node scripts/update-report-seo.mjs <slug> <metaTitle> <metaDescription>
 *
 * Merges into the existing `seo` object (other fields preserved), then you
 * re-sync: node scripts/sync-cms-to-data.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const [slug, metaTitle, metaDescription] = process.argv.slice(2);
if (!slug || !metaTitle || !metaDescription) {
  console.error('Usage: node scripts/update-report-seo.mjs <slug> <metaTitle> <metaDescription>');
  process.exit(1);
}

function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
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
  process.exit(1);
}

const db = createClient(url, key);

async function main() {
  const { data: rows, error: getErr } = await db.from('cms_reports').select('slug, seo').eq('slug', slug);
  if (getErr) { console.error('fetch failed:', getErr.message); process.exit(1); }
  if (!rows || !rows.length) { console.error(`no cms_reports row for slug '${slug}'`); process.exit(1); }
  const seo = { ...(rows[0].seo || {}) };
  seo.metaTitle = metaTitle;
  seo.metaDescription = metaDescription;
  const { error } = await db.from('cms_reports').update({ seo }).eq('slug', slug);
  if (error) { console.error('update failed:', error.message); process.exit(1); }
  console.log(`[ok] ${slug} seo.metaTitle + seo.metaDescription set. Next: node scripts/sync-cms-to-data.mjs`);
}

main().catch((e) => { console.error(e); process.exit(1); });
