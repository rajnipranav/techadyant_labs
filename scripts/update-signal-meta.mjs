#!/usr/bin/env node
/**
 * Update a signal's title/excerpt in the CMS (cms_signals).
 *
 * Usage: node scripts/update-signal-meta.mjs <slug> <title> [excerpt]
 * Omit excerpt to keep the current one. URL slug and `no` are never touched.
 * Then re-sync: node scripts/sync-cms-to-data.mjs
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const [slug, title, excerpt] = process.argv.slice(2);
if (!slug || !title) {
  console.error('Usage: node scripts/update-signal-meta.mjs <slug> <title> [excerpt]');
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

const body = { title };
if (excerpt) body.excerpt = excerpt;
const r = await fetch(`${url}/rest/v1/cms_signals?slug=eq.${encodeURIComponent(slug)}`, {
  method: 'PATCH',
  headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  body: JSON.stringify(body),
});
if (!r.ok) { console.error(`PATCH failed: ${r.status} ${await r.text()}`); process.exit(1); }
const rows = await r.json();
console.log(`Updated cms_signals ${slug}:`, rows[0] ? `${rows[0].no} "${rows[0].title}"` : 'no row');
