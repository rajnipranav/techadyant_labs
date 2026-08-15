#!/usr/bin/env node
/**
 * Renumber cms_signals so `no` matches chronological (date) order.
 *
 * Usage: node scripts/renumber-signals.mjs <mapping.json>
 *
 * mapping.json: { "<slug>": "S-0NN" } - the target number per slug, generated
 * from the date-ordered static data. Two-phase update (temp numbers first)
 * so any unique constraint on `no` cannot trip during the swap.
 *
 * After running, re-sync: node scripts/sync-cms-to-data.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const mapPath = process.argv[2];
if (!mapPath) {
  console.error('Usage: node scripts/renumber-signals.mjs <mapping.json>');
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
const mapping = JSON.parse(fs.readFileSync(path.resolve(mapPath), 'utf8'));
const slugs = Object.keys(mapping);
console.log(`renumbering ${slugs.length} signals`);

async function phase(fn) {
  let ok = 0;
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const { error } = await fn(slug, i);
    if (error) {
      console.error(`[FAIL] ${slug}: ${error.message}`);
      process.exitCode = 1;
      return;
    }
    ok++;
  }
  console.log(`  phase ok: ${ok}/${slugs.length}`);
}

// Phase 1: temporary unique numbers (no constraint collisions possible).
await phase((slug, i) => db.from('cms_signals').update({ no: `S-TMP-${String(i + 1).padStart(3, '0')}` }).eq('slug', slug));
// Phase 2: final numbers.
await phase((slug) => db.from('cms_signals').update({ no: mapping[slug] }).eq('slug', slug));

console.log('renumber complete. Next: node scripts/sync-cms-to-data.mjs');
