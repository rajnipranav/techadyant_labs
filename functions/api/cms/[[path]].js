/**
 * CMS BFF — Cloudflare Pages Function handling /api/cms/*.
 * Security: gated by Cloudflare Access (add /api/cms/* to your Access policy).
 * Uses Supabase service-role key server-side; never reaches the browser.
 */
const ADMIN_FALLBACK = 'praveenrajnipranav@gmail.com';

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function accessEmailFromJwt(request) {
  try {
    const team = process.env.CF_ACCESS_TEAM_DOMAIN || 'lingering-union-aa4c.cloudflareaccess.com';
    let token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token) {
      const m = (request.headers.get('Cookie') || '').match(/CF_Authorization=([^;]+)/);
      if (m) token = m[1];
    }
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const header = JSON.parse(atob(h.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    const certsRes = await fetch(`https://${team}/cdn-cgi/access/certs`);
    const certs = await certsRes.json();
    const jwk = (certs.keys || []).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const sigBin = new Uint8Array(atob(s.replace(/-/g, '+').replace(/_/g, '/')).split('').map((c) => c.charCodeAt(0)));
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sigBin, new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    return (payload.email || '').toLowerCase();
  } catch (_e) { return null; }
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

const CMS_TABLES = ['cms_reports', 'cms_signals', 'cms_briefings', 'cms_newsletters', 'cms_pages'];

export async function onRequest(context) {
  const { request, env } = context;
  const S = env.SUPABASE_URL;
  const SK = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!S || !SK) return json(500, { error: 'Supabase not configured' });

  const allow = (env.ADMIN_EMAIL || ADMIN_FALLBACK).toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  const devBypass = env.DEV_ADMIN === 'true';
  let who = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').toLowerCase();
  if (!who) who = (await accessEmailFromJwt(request, env)) || '';
  if (!devBypass) {
    if (!who) return json(403, { error: 'no Access identity' });
    if (!allow.length === 0 || !allow.includes(who)) return json(403, { error: 'email not in ADMIN_EMAIL allow-list', got: who, expected: allow });
  }

  const route = '/' + (context.params.path || []).join('/');
  const q = new URL(request.url).searchParams;

  try {
    for (const table of CMS_TABLES) {
      const base = '/' + table.replace(/^cms_/, '');
      if (route === base) {
        if (request.method === 'GET') {
          const select = q.get('select') || '*';
          const order = q.get('order') || 'created_at.desc';
          const limit = q.get('limit') || '100';
          const offset = q.get('offset') || '0';
          const r = await fetch(`${S}/rest/v1/${table}?select=${select}&order=${order}&limit=${limit}.eq.${offset}`, {
            headers: { apikey: SK, Authorization: `Bearer ${SK}` },
          });
          return json(r.ok ? 200 : 502, await r.json());
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const r = await fetch(`${S}/rest/v1/${table}`, {
            method: 'POST',
            headers: { apikey: SK, Authorization: `Bearer ${SK}`, 'content-type': 'application/json', Prefer: 'resolution=merge-duplicates' },
            body: JSON.stringify(body),
          });
          return json(r.ok ? 200 : 502, await r.json());
        }
      }
      if (route.startsWith(base + '/')) {
        const slug = route.split('/').pop();
        if (request.method === 'GET') {
          const r = await fetch(`${S}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=*`, {
            headers: { apikey: SK, Authorization: `Bearer ${SK}` },
          });
          const data = await r.json();
          return json(200, Array.isArray(data) ? data[0] || null : data);
        }
        if (request.method === 'PUT' || request.method === 'PATCH') {
          const body = await request.json();
          const r = await fetch(`${S}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}`, {
            method: 'PATCH',
            headers: { apikey: SK, Authorization: `Bearer ${SK}`, 'content-type': 'application/json', Prefer: 'resolution=merge-duplicates' },
            body: JSON.stringify(body),
          });
          return json(r.ok ? 200 : 502, await r.json());
        }
        if (request.method === 'DELETE') {
          const r = await fetch(`${S}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}`, {
            method: 'DELETE',
            headers: { apikey: SK, Authorization: `Bearer ${SK}` },
          });
          return json(r.ok ? 204 : 502, {});
        }
      }
    }

    return json(404, { error: 'unknown CMS route', route });
  } catch (e) {
    return json(500, { error: String(e) });
  }
}
