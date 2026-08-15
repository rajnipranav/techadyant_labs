#!/usr/bin/env node
/**
 * Append a FAQ item to a report in the CMS (cms_reports.faq).
 *
 * Usage: node scripts/update-report-faq.mjs <slug> "<question>" "<answer>"
 * Preserves existing items. Then re-sync: node scripts/sync-cms-to-data.mjs
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const [slug, q, a] = process.argv.slice(2);
if (!slug || !q || !a) {
  console.error('Usage: node scripts/update-report-faq.mjs <slug> <question> <answer>');
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

const sel = await fetch(`${url}/rest/v1/cms_reports?select=faq&slug=eq.${encodeURIComponent(slug)}`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const rows = await sel.json();
if (!rows[0]) { console.error('report not found'); process.exit(1); }
const faq = Array.isArray(rows[0].faq) ? rows[0].faq : [];
if (faq.some((f) => f.q === q)) { console.log('FAQ item already present - skipping'); process.exit(0); }
faq.push({ q, a });
const r = await fetch(`${url}/rest/v1/cms_reports?slug=eq.${encodeURIComponent(slug)}`, {
  method: 'PATCH',
  headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  body: JSON.stringify({ faq }),
});
if (!r.ok) { console.error(`PATCH failed: ${r.status} ${await r.text()}`); process.exit(1); }
const out = await r.json();
console.log(`FAQ appended (now ${out[0].faq.length} items): ${slug}`);
