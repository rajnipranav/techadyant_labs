/**
 * Bake curated object-kind entities (technologies, materials, products, patents,
 * standards, processes…) from the SID `platform_export()` RPC into
 * app/research/_platform.json, for static entity-page generation at build time.
 *
 * Runs in the build chain BEFORE `next build`. Graceful: if N8NDB creds are
 * missing or the call fails, the committed snapshot is kept and the build
 * continues (never throws). Same pattern as scripts/bake-sid.mjs.
 *
 * Env: N8NDB_URL + N8NDB_SERVICE_ROLE_KEY (the SID/signal Supabase project).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'research', '_platform.json');
const url = process.env.N8NDB_URL;
const key = process.env.N8NDB_SERVICE_ROLE_KEY;

async function main() {
  if (!url || !key) {
    console.log('[bake-platform] N8NDB creds absent — keeping committed _platform.json');
    return;
  }
  const r = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/platform_export`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: '{}',
  });
  if (!r.ok) {
    console.warn(`[bake-platform] RPC ${r.status} — keeping committed snapshot`);
    return;
  }
  const data = await r.json();
  if (!Array.isArray(data) || data.length === 0) {
    // Never overwrite the committed non-empty snapshot with an empty array —
    // an empty _platform.json makes the /research/e/[kind]/[slug] export build fail.
    console.warn('[bake-platform] empty/invalid payload — keeping committed snapshot');
    return;
  }
  writeFileSync(OUT, JSON.stringify(data));
  console.log(`[bake-platform] wrote ${data.length} entities to _platform.json`);
}

main().catch((e) => console.warn('[bake-platform] error, keeping snapshot:', e && e.message));
