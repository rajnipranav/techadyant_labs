#!/usr/bin/env node
/**
 * Publish signals from a draft JSON file into the Supabase CMS (cms_signals).
 *
 * Usage: node scripts/publish-signals.mjs <draft.json>
 *
 * The draft is an array of signal records using the CMS column names
 * (snake_case): no, slug, title, domain, date, date_label, reading_time,
 * status, excerpt, body, takeaways, sources.
 *
 * Rows are upserted on `slug`, so re-running with an edited draft updates
 * existing signals instead of duplicating them. After publishing, run
 * `node scripts/sync-cms-to-data.mjs` then a build to ship to the site.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const draftPath = process.argv[2];
if (!draftPath) {
  console.error('Usage: node scripts/publish-signals.mjs <draft.json>');
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
const draft = JSON.parse(fs.readFileSync(path.resolve(draftPath), 'utf8'));
if (!Array.isArray(draft) || draft.length === 0) {
  console.error('Draft file must contain a non-empty JSON array of signals.');
  process.exit(1);
}

async function main() {
  let ok = 0;
  for (const s of draft) {
    for (const f of ['slug', 'title', 'status', 'date']) {
      if (!s[f]) { console.error(`[skip] ${s.slug || '(no slug)'} missing required field: ${f}`); continue; }
    }
    if (!s.slug) continue;
    const { data, error } = await db.from('cms_signals').upsert(s, { onConflict: 'slug' });
    if (error) {
      console.error(`[FAIL] ${s.slug}: ${error.message}`);
      process.exitCode = 1;
    } else {
      ok++;
      console.log(`[ok] ${s.no || '?'} ${s.slug} (${s.status})`);
    }
  }
  console.log(`published ${ok}/${draft.length} signal(s) to cms_signals. Next: node scripts/sync-cms-to-data.mjs`);
}

main().catch((e) => { console.error(e); process.exit(1); });
