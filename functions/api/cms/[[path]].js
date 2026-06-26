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

async function accessEmailFromJwt(request, env) {
  try {
    const configTeam = (env && env.CF_ACCESS_TEAM_DOMAIN || '').toLowerCase().trim();
    const expectedTeams = [
      configTeam,
      'lingering-union-aa4c.cloudflareaccess.com',
      'lining-union-aa4c.cloudflareaccess.com'
    ].filter(Boolean);

    let token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token) {
      const m = (request.headers.get('Cookie') || '').match(/CF_Authorization=([^;]+)/);
      if (m) token = m[1];
    }
    if (!token) return { error: 'No Cf-Access-Jwt-Assertion header and no CF_Authorization cookie found' };
    const parts = token.split('.');
    if (parts.length !== 3) return { error: 'JWT token has invalid format (does not contain 3 parts)' };
    const [h, p, s] = parts;
    let header, payload;
    try {
      header = JSON.parse(b64urlDecode(h));
      payload = JSON.parse(b64urlDecode(p));
    } catch (e) {
      return { error: `Failed to decode JWT header/payload: ${e.message}` };
    }
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return { error: `JWT has expired (exp: ${payload.exp}, current: ${Math.floor(Date.now() / 1000)})` };
    }

    if (!payload.iss) return { error: 'JWT payload is missing the iss (issuer) claim' };
    let issDomain = '';
    try {
      const issUrl = new URL(payload.iss);
      issDomain = issUrl.hostname.toLowerCase();
    } catch (e) {
      return { error: `Invalid URL format in iss claim: ${payload.iss}` };
    }

    if (!expectedTeams.includes(issDomain)) {
      return {
        error: `JWT issuer '${issDomain}' is not in the trusted team domains list`,
        trustedTeams: expectedTeams
      };
    }

    let certs;
    try {
      const certsRes = await fetch(`https://${issDomain}/cdn-cgi/access/certs`);
      if (!certsRes.ok) {
        return { error: `Failed to fetch certs from https://${issDomain}/cdn-cgi/access/certs: HTTP ${certsRes.status}` };
      }
      certs = await certsRes.json();
    } catch (e) {
      return { error: `Failed to fetch certs from https://${issDomain}/cdn-cgi/access/certs: ${e.message}` };
    }
    const jwk = (certs.keys || []).find((k) => k.kid === header.kid);
    if (!jwk) return { error: `No JWK key found for kid: ${header.kid}` };
    let key;
    try {
      key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    } catch (e) {
      return { error: `Failed to import JWK key: ${e.message}` };
    }
    let ok;
    try {
      ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(s), new TextEncoder().encode(`${h}.${p}`));
    } catch (e) {
      return { error: `Signature verification error: ${e.message}` };
    }
    if (!ok) return { error: 'Signature verification failed' };
    if (!payload.email) return { error: 'JWT payload has no email field' };
    return payload.email.toLowerCase();
  } catch (e) {
    return { error: `Unexpected error in accessEmailFromJwt: ${e.message || String(e)}` };
  }
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
  let jwtError = null;
  if (!who) {
    const res = await accessEmailFromJwt(request, env);
    if (res && typeof res === 'object' && 'error' in res) {
      jwtError = res.error;
    } else {
      who = res || '';
    }
  }
  if (!devBypass) {
    if (!who) {
      const cookieHeader = request.headers.get('Cookie') || '';
      const jwtHeader = request.headers.get('Cf-Access-Jwt-Assertion');
      return json(403, {
        error: 'no Access identity',
        details: jwtError || 'No Cf-Access-Jwt-Assertion header and no CF_Authorization cookie present',
        hasJwtHeader: !!jwtHeader,
        hasCookie: cookieHeader.includes('CF_Authorization='),
        cookieNames: cookieHeader.split(';').map(c => c.split('=')[0].trim())
      });
    }
    if (allow.length === 0 || !allow.includes(who)) return json(403, { error: 'email not in ADMIN_EMAIL allow-list', got: who, expected: allow });
  }

  const route = '/' + (context.params.path || []).join('/');
  const q = new URL(request.url).searchParams;

  try {
    const CMS_ROUTES = {
      reports: 'cms_reports',
      signals: 'cms_signals',
      briefings: 'cms_briefings',
      newsletters: 'cms_newsletters',
      pages: 'cms_pages',
    };

    const path = route.slice(1);
    const [resource, ...rest] = path.split('/');

    // Publish → trigger a Cloudflare Pages rebuild so CMS edits go live.
    // Requires the CF_DEPLOY_HOOK_URL env var (Pages → Settings → Deploy hooks).
    if (resource === '_deploy') {
      if (request.method !== 'POST') return json(405, { error: 'POST only' });
      const hook = env.CF_DEPLOY_HOOK_URL;
      if (!hook) return json(400, { error: 'CF_DEPLOY_HOOK_URL not set — add a Cloudflare Pages Deploy Hook URL to the project env.' });
      try {
        const r = await fetch(hook, { method: 'POST' });
        const txt = await r.text().catch(() => '');
        return json(r.ok ? 200 : 502, { ok: r.ok, status: r.status, response: txt.slice(0, 500) });
      } catch (e) {
        return json(502, { error: `Deploy hook call failed: ${String(e)}` });
      }
    }

    // Cover-image upload → stores in the public `covers` Storage bucket and
    // returns a public URL the editor drops into the report's `cover` field.
    if (resource === '_upload') {
      if (request.method !== 'POST') return json(405, { error: 'POST only' });
      let form;
      try { form = await request.formData(); } catch { return json(400, { error: 'expected multipart/form-data' }); }
      const file = form.get('file');
      if (!file || typeof file === 'string') return json(400, { error: 'no file field' });
      const rawSlug = (form.get('slug') || 'cover').toString().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 60) || 'cover';
      const type = file.type || 'image/jpeg';
      const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' })[type] || 'jpg';
      const name = `${rawSlug}-${Date.now()}.${ext}`;
      const up = await fetch(`${S}/storage/v1/object/covers/${name}`, {
        method: 'POST',
        headers: { apikey: SK, Authorization: `Bearer ${SK}`, 'content-type': type, 'x-upsert': 'true' },
        body: await file.arrayBuffer(),
      });
      if (!up.ok) return json(502, { error: 'upload failed', status: up.status, detail: (await up.text().catch(() => '')).slice(0, 300) });
      return json(200, { url: `${S}/storage/v1/object/public/covers/${name}`, name });
    }

    const table = CMS_ROUTES[resource];
    if (!table) return json(404, { error: 'unknown CMS route', route });
    const slug = rest[0] || null;

    if (!slug) {
      if (request.method === 'GET') {
        const select = q.get('select') || '*';
        const order = q.get('order') || 'created_at.desc';
        const limit = q.get('limit') || '100';
        const offset = q.get('offset') || '0';
        const r = await fetch(`${S}/rest/v1/${table}?select=${select}&order=${order}&limit=${limit}&offset=${offset}`, {
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
    } else {
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
  } catch (e) {
    return json(500, { error: String(e) });
  }
}
