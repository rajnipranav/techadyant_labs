/**
 * Admin BFF — Cloudflare Pages Function handling /api/admin/*.
 * Security: gated at the edge by Cloudflare Access (policy on /admin* and /api/admin/*).
 * Defence-in-depth: re-checks the Cf-Access-Authenticated-User-Email header here.
 * Holds the n8ndb service-role key server-side; never reaches the browser.
 * SID + signals come from n8ndb (N8NDB_URL); site pillar from the website project (SUPABASE_URL).
 */
const ADMIN_FALLBACK = 'praveenrajnipranav@gmail.com';

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function rpc(base, key, fn, args) {
  const r = await fetch(`${base}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(args || {}),
  });
  const t = await r.text();
  if (!r.ok) return { error: `rpc ${fn} → ${r.status}: ${t.slice(0, 300)}` };
  try { return { data: JSON.parse(t) }; } catch { return { data: t }; }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  // Allowed admins: comma-separated ADMIN_EMAIL list (falls back to the brand email).
  const allow = (env.ADMIN_EMAIL || ADMIN_FALLBACK).toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  // edge auth (Cloudflare Access). DEV_ADMIN=true bypasses for local `next dev` only.
  const who = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();
  const devBypass = env.DEV_ADMIN === 'true';
  if (!devBypass) {
    if (!who) return json(403, { error: 'no Access identity — request did not arrive through Cloudflare Access', hint: 'the /api/admin path must be a protected destination on the Access app' });
    if (!allow.includes(who)) return json(403, { error: 'email not in ADMIN_EMAIL allow-list', got: who, expected: allow });
  }

  const N = env.N8NDB_URL, NK = env.N8NDB_SERVICE_ROLE_KEY;
  if (!N || !NK) return json(500, { error: 'n8ndb binding not configured (set N8NDB_URL, N8NDB_SERVICE_ROLE_KEY)' });
  const S = env.SUPABASE_URL, SK = env.SUPABASE_SERVICE_ROLE_KEY;

  const route = '/' + (params.path || []).join('/');
  const q = new URL(request.url).searchParams;

  try {
    if (route === '/overview')              return reply(await rpc(N, NK, 'sid_overview'));
    if (route === '/sid/capture')           return reply(await rpc(N, NK, 'sid_capture_grid'));
    if (route === '/sid/capture-history')   return reply(await rpc(N, NK, 'sid_capture_history', { p_corridor: q.get('corridor'), p_layer: q.get('layer') }));
    if (route === '/sid/entities')          return reply(await rpc(N, NK, 'sid_entities', { p_corridor: q.get('corridor'), p_type: q.get('type'), p_country: q.get('country'), p_search: q.get('q') }));
    if (route === '/sid/entity')            return reply(await rpc(N, NK, 'sid_entity_detail', { p_id: q.get('id') }));
    if (route === '/sid/chokepoints')       return reply(await rpc(N, NK, 'sid_chokepoints', { p_corridor: q.get('corridor') }));
    if (route === '/sid/candidates')        return reply(await rpc(N, NK, 'sid_candidates'));
    if (route === '/signals')               return reply(await rpc(N, NK, 'sid_recent_signals', { p_limit: Number(q.get('limit') || 60) }));

    if (route === '/sid/candidate-action' && request.method === 'POST') {
      const b = await request.json();
      let fn, args;
      if (b.action === 'promote') { fn = 'sid_promote_candidate'; args = { p_candidate_id: b.candidate_id, p_entity_type: b.entity_type, p_corridors: b.corridors || [], p_home_country: b.home_country || 'IN', p_aliases: b.aliases || [] }; }
      else if (b.action === 'reject') { fn = 'sid_reject_candidate'; args = { p_candidate_id: b.candidate_id, p_cooldown_days: b.cooldown_days || 90 }; }
      else if (b.action === 'merge') { fn = 'sid_merge_candidate'; args = { p_candidate_id: b.candidate_id, p_into_entity: b.into_entity }; }
      else return json(400, { error: 'unknown action' });
      return reply(await rpc(N, NK, fn, args));
    }

    if (route === '/site') {
      if (!S || !SK) return json(200, { configured: false });
      const subs = await fetch(`${S}/rest/v1/subscribers?select=email`, { headers: { apikey: SK, Authorization: `Bearer ${SK}`, Prefer: 'count=exact', Range: '0-0' } });
      const subCount = (subs.headers.get('content-range') || '').split('/')[1] || null;
      const commR = await fetch(`${S}/rest/v1/commission_inquiries?select=id,name,email,created_at&order=created_at.desc&limit=10`, { headers: { apikey: SK, Authorization: `Bearer ${SK}` } });
      const commission = commR.ok ? await commR.json() : [];
      return json(200, { configured: true, subscribers: subCount, commission });
    }

    return json(404, { error: 'unknown route', route });
  } catch (e) {
    return json(500, { error: String(e) });
  }

  function reply(res) { return res.error ? json(502, { error: res.error }) : json(200, res.data); }
}
