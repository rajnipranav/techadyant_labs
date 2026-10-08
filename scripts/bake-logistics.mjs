#!/usr/bin/env node
/**
 * Bake the India Integrated Logistics Atlas snapshot at build time.
 *
 * Calls the logistics_export() RPC on the SID Supabase project (n8ndb) and
 * writes app/research/_logistics.json, which the /research/logistics pages
 * import at build (server-rendered into static HTML).
 *
 * Creds (same as the Atlas bake):
 *   N8NDB_URL                 e.g. https://umtfafscgbxgmmqlktlx.supabase.co
 *   N8NDB_SERVICE_ROLE_KEY    service role (server-side build only)
 *
 * Contract (mirrors bake-sid.mjs):
 *   - env absent        -> keep committed snapshot, exit 0
 *   - RPC failure       -> keep committed snapshot, exit 0
 *   - invalid payload   -> keep committed snapshot, exit 0
 *   - no committed snapshot AND env absent (first run) -> materialise the
 *     committed seed fallback (scripts/logistics-seed.json) so the static
 *     build never fails. The seed JSON mirrors supabase/logistics-seed.sql,
 *     which is authoritative for the SID.
 *
 * Never hand-edit app/research/_logistics.json — change data in the `logistics`
 * schema (supabase/logistics-*.sql) and rebuild.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../app/research/_logistics.json');
const SEED = resolve(__dirname, 'logistics-seed.json');
const log = (...a) => console.log('[bake-logistics]', ...a);

const URL_ = process.env.N8NDB_URL;
const KEY = process.env.N8NDB_SERVICE_ROLE_KEY;

const validShape = (d) =>
  d && Array.isArray(d.programmes) && Array.isArray(d.corridors) &&
  Array.isArray(d.opportunity_surfaces);

async function main() {
  if (!URL_ || !KEY) {
    log('N8NDB_URL / N8NDB_SERVICE_ROLE_KEY not set.');
    if (existsSync(OUT)) {
      log('Keeping committed _logistics.json snapshot.');
      return;
    }
    if (existsSync(SEED)) {
      writeFileSync(OUT, readFileSync(SEED, 'utf8'));
      log('No committed snapshot — materialised seed fallback (scripts/logistics-seed.json). Apply supabase/logistics-*.sql and rebuild to bake live SID data.');
      return;
    }
    log('No seed fallback found — /research/logistics will render empty. This is not fatal.');
    return;
  }

  const res = await fetch(`${URL_.replace(/\/$/, '')}/rest/v1/rpc/logistics_export`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  if (!res.ok) {
    log(`RPC failed HTTP ${res.status} — keeping committed snapshot.`);
    return;
  }
  const data = await res.json();
  if (!validShape(data) || !data.programmes.length) {
    log('RPC returned empty/invalid payload — keeping committed snapshot.');
    return;
  }
  const prev = (() => { try { return JSON.parse(readFileSync(OUT, 'utf8')); } catch { return null; } })();
  writeFileSync(OUT, JSON.stringify(data, null, 1));
  log(`baked ${data.programmes.length} programmes, ${data.corridors.length} corridors, ${data.nodes?.length ?? 0} nodes, ${data.projects?.length ?? 0} projects, ${data.opportunity_surfaces?.length ?? 0} opportunity surfaces` +
      (prev ? ` (was ${prev.programmes?.length ?? '?'} programmes)` : ''));
}

main().catch((e) => { log('error (ignored, keeping snapshot):', e?.message || e); });
