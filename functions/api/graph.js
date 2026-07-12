/**
 * Public graph endpoint — GET /api/graph
 * Query: ?id=<entity uuid>&depth=1..3
 * Returns the n-hop neighbourhood of an entity (public.platform_graph RPC, recursive CTE).
 * Node-capped (500) and depth-capped (3) server-side. Read-only, public. Edge-cached.
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function onRequestGet({ request, env }) {
  const base = env.N8NDB_URL;
  const key = env.N8NDB_SERVICE_ROLE_KEY;
  if (!base || !key) return json(503, { ok: false, message: 'Graph data source not configured.' });
  const q = new URL(request.url).searchParams;
  const id = (q.get('id') || '').trim();
  if (!UUID_RE.test(id)) return json(400, { ok: false, message: 'valid entity id (uuid) required' });
  const body = { p_entity: id, p_depth: Math.min(Math.max(parseInt(q.get('depth') || '2', 10) || 2, 1), 3) };
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/platform_graph`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) { const t = await r.text(); return json(502, { ok: false, message: `Upstream ${r.status}: ${t.slice(0, 200)}` }); }
    const graph = await r.json();
    return json(200, { ok: true, graph }, 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600');
  } catch (e) {
    return json(502, { ok: false, message: String((e && e.message) || e) });
  }
}
