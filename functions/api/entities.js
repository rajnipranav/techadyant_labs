/**
 * Public entities endpoint — GET /api/entities
 * Query: ?kind=<code>&q=<text>&watchlist=true|false&limit=<n>&offset=<n>
 * Reads sid via the public.platform_entities RPC (service-role stays server-side).
 * Read-only, public curated data. Edge-cached. Free tier (no external services).
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

export async function onRequestGet({ request, env }) {
  const base = env.N8NDB_URL;
  const key = env.N8NDB_SERVICE_ROLE_KEY;
  if (!base || !key) return json(503, { ok: false, message: 'Entities data source not configured.' });
  const q = new URL(request.url).searchParams;
  const w = q.get('watchlist');
  const body = {
    p_kind: q.get('kind') || null,
    p_q: q.get('q') || null,
    p_watchlist: w == null ? null : w === 'true',
    p_limit: Math.min(parseInt(q.get('limit') || '50', 10) || 50, 200),
    p_offset: parseInt(q.get('offset') || '0', 10) || 0,
  };
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/platform_entities`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) { const t = await r.text(); return json(502, { ok: false, message: `Upstream ${r.status}: ${t.slice(0, 200)}` }); }
    const entities = await r.json();
    return json(200, { ok: true, entities }, 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600');
  } catch (e) {
    return json(502, { ok: false, message: String((e && e.message) || e) });
  }
}
