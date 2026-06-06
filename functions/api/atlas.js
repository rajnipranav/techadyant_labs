/**
 * Public Atlas live-data endpoint — GET /api/atlas
 * Returns the same snapshot the build bakes (public.atlas_export RPC), so the
 * Atlas pages can optionally revalidate against live SID after first paint.
 * Read-only, public data; service-role key stays server-side. Edge-cached.
 */
function json(status, body, cache) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': cache || 'no-store',
    },
  });
}

export async function onRequestGet({ env }) {
  const base = env.N8NDB_URL;
  const key = env.N8NDB_SERVICE_ROLE_KEY;
  if (!base || !key) return json(503, { ok: false, message: 'Atlas data source not configured.' });
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/atlas_export`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: '{}',
    });
    if (!r.ok) {
      const t = await r.text();
      return json(502, { ok: false, message: `Upstream ${r.status}: ${t.slice(0, 200)}` });
    }
    const atlas = await r.json();
    // Cache at the edge for 30 min; allow stale-while-revalidate for an hour.
    return json(200, { ok: true, atlas }, 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600');
  } catch (e) {
    return json(502, { ok: false, message: String(e && e.message || e) });
  }
}
