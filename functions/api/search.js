/**
 * Public search endpoint — GET /api/search
 * Query: ?q=<text>&kind=<code>&limit=<n>
 * Keyword full-text search over sid (public.platform_search RPC, Postgres tsvector).
 * Semantic/pgvector is intentionally deferred (needs a paid embedding model) — FTS only, free.
 * Read-only, public. Edge-cached.
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
  if (!base || !key) return json(503, { ok: false, message: 'Search data source not configured.' });
  const q = new URL(request.url).searchParams;
  const term = (q.get('q') || '').trim();
  if (!term) return json(200, { ok: true, results: [] }, 'no-store');
  const body = {
    p_q: term.slice(0, 200),
    p_kind: q.get('kind') || null,
    p_limit: Math.min(parseInt(q.get('limit') || '20', 10) || 20, 50),
  };
  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/platform_search`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) { const t = await r.text(); return json(502, { ok: false, message: `Upstream ${r.status}: ${t.slice(0, 200)}` }); }
    const results = await r.json();
    return json(200, { ok: true, results }, 'public, max-age=300, s-maxage=300, stale-while-revalidate=1800');
  } catch (e) {
    return json(502, { ok: false, message: String((e && e.message) || e) });
  }
}
