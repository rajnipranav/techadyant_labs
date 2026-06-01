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

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}
function b64urlBytes(s) {
  const bin = b64urlDecode(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
// Verify the Cloudflare Access session JWT (Cf-Access-Jwt-Assertion header or
// CF_Authorization cookie) against the team JWKS, return the email claim.
async function accessEmailFromJwt(request, env) {
  try {
    const team = env.CF_ACCESS_TEAM_DOMAIN || 'lingering-union-aa4c.cloudflareaccess.com';
    let token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token) {
      const m = (request.headers.get('Cookie') || '').match(/CF_Authorization=([^;]+)/);
      if (m) token = m[1];
    }
    if (!token) return null;
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const header = JSON.parse(b64urlDecode(h));
    const payload = JSON.parse(b64urlDecode(p));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    const certs = await fetch(`https://${team}/cdn-cgi/access/certs`).then((r) => r.json());
    const jwk = (certs.keys || []).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key,
      b64urlBytes(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    return (payload.email || '').toLowerCase();
  } catch (_e) { return null; }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  // Allowed admins: comma-separated ADMIN_EMAIL list (falls back to the brand email).
  const allow = (env.ADMIN_EMAIL || ADMIN_FALLBACK).toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  const devBypass = env.DEV_ADMIN === 'true';
  // Identity: prefer the convenience header; otherwise verify the Access session
  // JWT (CF_Authorization cookie) — works even where the header isn't injected.
  let who = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();
  if (!who) who = (await accessEmailFromJwt(request, env)) || '';
  if (!devBypass) {
    if (!who) return json(403, { error: 'no Access identity — log in via Cloudflare Access at /admin first (no header and no valid CF_Authorization cookie present)' });
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
    if (route === '/signals')               return reply(await rpc(N, NK, 'sid_recent_signals', {
      p_limit: Number(q.get('limit') || 120), p_corridor: q.get('corridor') || null, p_status: q.get('status') || 'active',
      p_q: q.get('q') || null, p_min_score: q.get('min_score') ? Number(q.get('min_score')) : null, p_signal_only: q.get('signal_only') === '1',
    }));
    if (route === '/signals/counts')         return reply(await rpc(N, NK, 'sid_signal_counts', { p_signal_only: q.get('signal_only') === '1' }));
    if (route === '/sid/sovereignty')       return reply(await rpc(N, NK, 'sid_sovereignty'));
    if (route === '/sid/momentum')          return reply(await rpc(N, NK, 'sid_momentum', { p_days: Number(q.get('days') || 30) }));
    if (route === '/recent-activity')       return reply(await rpc(N, NK, 'sid_recent_activity', { p_days: Number(q.get('days') || 7) }));
    if (route === '/lookups')               return reply(await rpc(N, NK, 'sid_lookups'));
    if (route === '/sid/rejected')          return reply(await rpc(N, NK, 'sid_rejected_candidates'));
    if (route === '/sid/figures')           return reply(await rpc(N, NK, 'sid_figures', { p_status: q.get('status') || 'final', p_q: q.get('q'), p_type: q.get('type') }));
    if (route === '/ops/workflows')         return reply(await rpc(N, NK, 'sid_workflow_status'));
    if (route === '/ops/runs')              return reply(await rpc(N, NK, 'sid_workflow_runs', { p_limit: Number(q.get('limit') || 40) }));

    if (request.method === 'POST' && route === '/sid/entity-save') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_save_entity', { p_id: b.id || null, p_name: b.name, p_type: b.type, p_country: b.country || '', p_description: b.description || '', p_watchlist: !!b.watchlist, p_corridors: b.corridors || [], p_aliases: b.aliases || [] }));
    }
    if (request.method === 'POST' && route === '/sid/entity-retire') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_retire_entity', { p_id: b.id, p_status: b.status || 'dormant' }));
    }
    if (request.method === 'POST' && route === '/sid/relationship-add') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_add_relationship', { p_src: b.src, p_tgt: b.tgt, p_rel: b.rel, p_magnitude: b.magnitude ?? null, p_unit: b.unit || '', p_desc: b.desc || '', p_verif: b.verif || 'single_source' }));
    }
    if (request.method === 'POST' && route === '/sid/relationship-close') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_close_relationship', { p_id: b.id, p_delete: !!b.delete }));
    }
    if (request.method === 'POST' && route === '/sid/capture-add') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_add_capture', { p_corridor: b.corridor, p_layer: b.layer, p_status: b.status, p_rationale: b.rationale || '', p_verif: b.verif || 'single_source', p_analyst: b.analyst || 'admin' }));
    }
    if (request.method === 'POST' && route === '/sid/restore') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_restore_candidate', { p_id: b.id }));
    }
    if (request.method === 'POST' && route === '/sid/stoplist-add') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_stoplist_add', { p_name: b.name, p_reason: b.reason || 'manual' }));
    }
    if (request.method === 'POST' && route === '/sid/figure-status') {
      const b = await request.json();
      return reply(await rpc(N, NK, 'sid_figure_set_status', { p_path: b.path, p_status: b.status }));
    }
    if (request.method === 'POST' && route === '/candidacy/scan') {
      const fnUrl = `${N.replace(/\/+$/, '')}/functions/v1/sid-entity-extractor?min_india=8&limit=25`;
      try {
        const t0 = Date.now();
        const r = await fetch(fnUrl, { method: 'POST', headers: { 'content-type': 'application/json', apikey: NK, authorization: `Bearer ${NK}` } });
        const text = (await r.text()).slice(0, 400);
        let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
        return json(200, { ok: r.ok, status: r.status, ms: Date.now() - t0, ...parsed });
      } catch (e) { return json(502, { error: 'candidacy scan failed: ' + String(e) }); }
    }
    if (request.method === 'POST' && route === '/signals/status') {
      const b = await request.json();
      if (!['pending', 'kept', 'archived'].includes(b.status)) return json(400, { error: 'status must be pending|kept|archived' });
      return reply(await rpc(N, NK, 'sid_signal_set_status', { p_id: b.id, p_status: b.status }));
    }
    if (request.method === 'POST' && route === '/ops/trigger') {
      const b = await request.json();
      const wf = String(b.wf || '').toLowerCase();
      if (!['ingest', 'analyze', 'digest'].includes(wf)) return json(400, { error: 'unknown workflow (expected ingest|analyze|digest)' });
      const base = (env.N8N_WEBHOOK_BASE || '').replace(/\/+$/, '');
      if (!base) return json(500, { error: 'N8N_WEBHOOK_BASE not configured — set it in Cloudflare Pages env to your n8n webhook root, e.g. https://<your-n8n-host>/webhook' });
      const headers = { 'content-type': 'application/json' };
      if (env.N8N_WEBHOOK_TOKEN) headers['authorization'] = env.N8N_WEBHOOK_TOKEN;
      try {
        const t0 = Date.now();
        const r = await fetch(`${base}/${wf}`, { method: 'POST', headers, body: JSON.stringify({ source: 'admin-manual', by: who, at: new Date().toISOString() }) });
        const text = (await r.text()).slice(0, 500);
        return json(200, { ok: r.ok, status: r.status, ms: Date.now() - t0, body: text });
      } catch (e) { return json(502, { error: 'trigger failed: ' + String(e) }); }
    }

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
