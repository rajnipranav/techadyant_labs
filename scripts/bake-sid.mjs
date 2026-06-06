#!/usr/bin/env node
/**
 * Bake the SID "Atlas" snapshot at build time.
 *
 * Calls the public.atlas_export() RPC on the signal/SID Supabase project and
 * writes app/research/_atlas.json, which the Atlas pages import at build (so
 * the data is server-rendered into static HTML — fast + SEO-friendly).
 *
 * Creds (same as the promotion campaign-kit / website BFF):
 *   N8NDB_URL                 e.g. https://umtfafscgbxgmmqlktlx.supabase.co
 *   N8NDB_SERVICE_ROLE_KEY    service role (server-side build only)
 *
 * If creds are absent (e.g. a local build), it leaves the committed snapshot
 * in place and exits 0 — never fails the build.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../app/research/_atlas.json');
const log = (...a) => console.log('[bake-sid]', ...a);

const URL = process.env.N8NDB_URL;
const KEY = process.env.N8NDB_SERVICE_ROLE_KEY;

async function main() {
  if (!URL || !KEY) {
    log('N8NDB_URL / N8NDB_SERVICE_ROLE_KEY not set — keeping committed snapshot.');
    return;
  }
  const res = await fetch(`${URL.replace(/\/$/, '')}/rest/v1/rpc/atlas_export`, {
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
  const atlas = await res.json();
  if (!atlas || !Array.isArray(atlas.players) || !atlas.players.length) {
    log('RPC returned empty/invalid payload — keeping committed snapshot.');
    return;
  }
  // Validate it parses and has the expected shape before overwriting.
  const prev = (() => { try { return JSON.parse(readFileSync(OUT, 'utf8')); } catch { return null; } })();
  writeFileSync(OUT, JSON.stringify(atlas, null, 1));
  log(`baked ${atlas.players.length} players, ${atlas.grid.length} assessments, ${atlas.corridors.length} corridors` +
      (prev ? ` (was ${prev.players?.length ?? '?'} players)` : ''));
}

main().catch((e) => { log('error (ignored, keeping snapshot):', e?.message || e); });
