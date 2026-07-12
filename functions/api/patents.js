/**
 * Public patents endpoint — GET /api/patents
 * Query: ?q=<text>&industry=<code>&limit=<n>&offset=<n>
 * Returns { total, matched, industries[], patents[] } from sid via
 * public.platform_patents. Read-only, public, edge-cached. Free tier.
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
  if (!base || !key) return json(503, { ok: false, message: 'Patents data source not configured.' });
  const q = new URL(request.url).searchParams;
  const body = {
    p_q: q.get('q') || null,
    p_industry: q.get('industry') || null,
    p_limit: Math.min(parseInt(q.get('limit') || '60', 10) || 60, 120),
    p_offset: parseInt(q.get('offset') || '0', 10) || 0,
  };
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/platform_patents`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) { const t = await r.text(); return json(502, { ok: false, message: `Upstream ${r.status}: ${t.slice(0, 200)}` }); }
    const data = await r.json();
    return json(200, { ok: true, ...data }, 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600');
  } catch (e) {
    return json(502, { ok: false, message: String((e && e.message) || e) });
  }
}
