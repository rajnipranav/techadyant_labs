/**
 * Secure report PDF delivery — Cloudflare Pages Function.
 *
 * GET /api/download?report=<slug>
 *   - free reports: served to anyone, no registration.
 *   - paid reports: require Authorization: Bearer <supabase token> AND a
 *     verified entitlement row. Fail-closed otherwise.
 *
 * Returns JSON `{ url, filename }` pointing at a 60-second Supabase Storage
 * signed URL. Frontend navigates the browser to it; Supabase serves the file
 * with Content-Disposition: attachment (forced via ?download=<name>).
 *
 * Diagnostics:
 *   ?probe=1        → env presence + code version, no outbound calls
 *   ?probe=user     → auth lookup only, returns user id or error
 *   ?probe=ent      → auth + entitlement check, returns boolean
 *   ?probe=storage  → bypass auth/ent, do sign call only (requires &report=)
 *   ?trace=1        → on the real path, return timings for each stage
 */
import { REPORTS, json, getUserFromRequest, hasEntitlement } from './_shared.js';

const CODE_VERSION = 'download-v4-timeouts';
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(label, url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    return { ok: true, res: r, ms: Date.now() - t0, label };
  } catch (e) {
    return {
      ok: false,
      label,
      ms: Date.now() - t0,
      timeout: e && e.name === 'AbortError',
      message: e && e.message ? e.message : String(e),
    };
  } finally {
    clearTimeout(t);
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const probe = url.searchParams.get('probe');
    const trace = url.searchParams.get('trace') === '1';
    const trail = [];

    if (probe === '1') {
      return json(200, {
        ok: true,
        codeVersion: CODE_VERSION,
        have: {
          SUPABASE_URL: !!env.SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: !!env.SUPABASE_SERVICE_ROLE_KEY,
          REPORTS_BUCKET: !!env.REPORTS_BUCKET,
          REPORTS_BUCKET_value: env.REPORTS_BUCKET || null,
        },
        knownReports: Object.keys(REPORTS),
      });
    }

    if (probe === 'user') {
      const r = await fetchWithTimeout('auth_user', `${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: request.headers.get('authorization') || '',
        },
      });
      if (!r.ok) return json(502, { error: 'probe_user_fetch_failed', ...r });
      let body = null;
      try { body = await r.res.json(); } catch {}
      return json(200, { codeVersion: CODE_VERSION, status: r.res.status, ms: r.ms, body });
    }

    const slug = url.searchParams.get('report');

    if (probe === 'storage') {
      const entry = slug && REPORTS[slug];
      if (!entry) return json(404, { error: 'not_found' });
      const endpoint = `${env.SUPABASE_URL}/storage/v1/object/sign/${env.REPORTS_BUCKET}/${encodeURIComponent(entry.object)}`;
      const r = await fetchWithTimeout('sign', endpoint, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 60 }),
      });
      if (!r.ok) return json(502, { error: 'probe_storage_fetch_failed', ...r, endpoint });
      let body = null; let raw = '';
      try { raw = await r.res.text(); body = JSON.parse(raw); } catch {}
      return json(200, { codeVersion: CODE_VERSION, status: r.res.status, ms: r.ms, body, raw: body ? undefined : raw.slice(0, 300), endpoint });
    }

    const entry = slug && REPORTS[slug];
    if (!entry) return json(404, { error: 'not_found', codeVersion: CODE_VERSION });

    // --- real path ---
    if (entry.access === 'paid') {
      const t0 = Date.now();
      const auth = request.headers.get('authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return json(401, { error: 'auth_required', message: 'Please sign in to download this report.' });

      const ur = await fetchWithTimeout('auth_user', `${env.SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` },
      });
      trail.push({ stage: 'auth_user', ms: ur.ms, ok: ur.ok, timeout: ur.timeout, status: ur.res?.status });
      if (!ur.ok) return json(502, { error: 'auth_fetch_failed', trail });
      if (!ur.res.ok) return json(401, { error: 'auth_invalid', status: ur.res.status, trail });
      let user;
      try { user = await ur.res.json(); } catch { return json(502, { error: 'auth_bad_json', trail }); }
      if (!user || !user.id) return json(401, { error: 'auth_no_user', trail });

      const er = await fetchWithTimeout('entitlement',
        `${env.SUPABASE_URL}/rest/v1/entitlements?select=id&user_id=eq.${encodeURIComponent(user.id)}&report_slug=eq.${encodeURIComponent(slug)}&limit=1`,
        { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } });
      trail.push({ stage: 'entitlement', ms: er.ms, ok: er.ok, timeout: er.timeout, status: er.res?.status });
      if (!er.ok) return json(502, { error: 'entitlement_fetch_failed', trail });
      let rows = [];
      try { rows = await er.res.json(); } catch {}
      if (!Array.isArray(rows) || rows.length === 0) return json(402, { error: 'payment_required', trail });

      // sign
      const signEndpoint = `${env.SUPABASE_URL}/storage/v1/object/sign/${env.REPORTS_BUCKET}/${encodeURIComponent(entry.object)}`;
      const sr = await fetchWithTimeout('sign', signEndpoint, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 60 }),
      });
      trail.push({ stage: 'sign', ms: sr.ms, ok: sr.ok, timeout: sr.timeout, status: sr.res?.status });
      if (!sr.ok) return json(502, { error: 'sign_fetch_failed', trail });
      if (!sr.res.ok) {
        let detail = ''; try { detail = (await sr.res.text()).slice(0, 300); } catch {}
        return json(502, { error: 'sign_error', status: sr.res.status, detail, trail });
      }
      let signed; try { signed = await sr.res.json(); } catch { return json(502, { error: 'sign_bad_json', trail }); }
      const path = signed.signedURL || signed.signedUrl || signed.signed_url;
      if (!path) return json(502, { error: 'sign_no_url', body: signed, trail });

      const filename = entry.filename || `${slug}.pdf`;
      const base = `${env.SUPABASE_URL}/storage/v1${path}`;
      const sep = base.includes('?') ? '&' : '?';
      const finalUrl = `${base}${sep}download=${encodeURIComponent(filename)}`;
      const totalMs = Date.now() - t0;

      return json(200, trace
        ? { url: finalUrl, filename, expiresIn: 60, codeVersion: CODE_VERSION, totalMs, trail }
        : { url: finalUrl, filename, expiresIn: 60, codeVersion: CODE_VERSION });
    }

    // free reports
    if (!env.SUPABASE_URL) {
      return json(503, { error: 'storage_unconfigured' });
    }

    // ── Public-bucket fast path ─────────────────────────────────────────────
    // For entries marked `publicBucket: true`, the file lives in a Supabase
    // Storage bucket whose policies allow anonymous reads. We don't need to
    // sign anything — just return the public object URL. This works without a
    // SERVICE_ROLE_KEY and never expires.
    if (entry.publicBucket) {
      const bucket = entry.bucket || env.REPORTS_BUCKET;
      if (!bucket) return json(503, { error: 'storage_unconfigured', message: 'No bucket configured.' });
      const filename = entry.filename || `${slug}.pdf`;
      const publicUrl =
        `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(entry.object)}` +
        `?download=${encodeURIComponent(filename)}`;
      return json(200, { url: publicUrl, filename, codeVersion: CODE_VERSION, public: true });
    }

    // Otherwise (legacy free path) sign a short-lived URL against the private bucket.
    if (!env.SUPABASE_SERVICE_ROLE_KEY || !(entry.bucket || env.REPORTS_BUCKET)) {
      return json(503, { error: 'storage_unconfigured' });
    }
    const bucket = entry.bucket || env.REPORTS_BUCKET;
    const signEndpoint = `${env.SUPABASE_URL}/storage/v1/object/sign/${bucket}/${encodeURIComponent(entry.object)}`;
    const sr = await fetchWithTimeout('sign', signEndpoint, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 60 }),
    });
    if (!sr.ok) return json(502, { error: 'sign_fetch_failed', ...sr });
    if (!sr.res.ok) return json(502, { error: 'sign_error', status: sr.res.status });
    let signed; try { signed = await sr.res.json(); } catch { return json(502, { error: 'sign_bad_json' }); }
    const path = signed.signedURL || signed.signedUrl || signed.signed_url;
    if (!path) return json(502, { error: 'sign_no_url', body: signed });
    const filename = entry.filename || `${slug}.pdf`;
    const finalUrl = `${env.SUPABASE_URL}/storage/v1${path}${path.includes('?') ? '&' : '?'}download=${encodeURIComponent(filename)}`;
    return json(200, { url: finalUrl, filename, expiresIn: 60, codeVersion: CODE_VERSION });
  } catch (e) {
    return json(500, {
      error: 'exception',
      message: e && e.message ? e.message : String(e),
      stack: e && e.stack ? String(e.stack).slice(0, 800) : undefined,
      codeVersion: CODE_VERSION,
    });
  }
}
