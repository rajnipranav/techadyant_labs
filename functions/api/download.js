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
 * Diagnostic: GET /api/download?probe=1 returns JSON with env presence and
 * the deployed code marker — no auth needed, no outbound calls. If this 502s
 * with Cloudflare's HTML page, the failure is at the platform layer, not in
 * our code.
 */
import { REPORTS, json, getUserFromRequest, hasEntitlement } from './_shared.js';

const CODE_VERSION = 'download-v3-json-2ec8c64';

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);

    if (url.searchParams.get('probe') === '1') {
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

    const slug = url.searchParams.get('report');
    const entry = slug && REPORTS[slug];
    if (!entry) return json(404, { error: 'not_found', codeVersion: CODE_VERSION });

    if (entry.access === 'paid') {
      const user = await getUserFromRequest(request, env);
      if (!user) return json(401, { error: 'auth_required', message: 'Please sign in to download this report.', codeVersion: CODE_VERSION });
      const ok = await hasEntitlement(env, user.id, slug);
      if (!ok) return json(402, { error: 'payment_required', message: 'Purchase required to download this report.', codeVersion: CODE_VERSION });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.REPORTS_BUCKET) {
      return json(503, { error: 'storage_unconfigured', message: 'Storage is not configured yet.' });
    }

    const filename = entry.filename || `${slug}.pdf`;
    const signEndpoint =
      `${env.SUPABASE_URL}/storage/v1/object/sign/${env.REPORTS_BUCKET}/${encodeURIComponent(entry.object)}`;

    let signRes;
    try {
      signRes = await fetch(signEndpoint, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 60 }),
      });
    } catch (fe) {
      return json(502, {
        error: 'sign_fetch_failed',
        message: fe && fe.message ? fe.message : String(fe),
        endpoint: signEndpoint,
      });
    }

    if (!signRes.ok) {
      let detail = '';
      try { detail = (await signRes.text()).slice(0, 500); } catch {}
      return json(502, {
        error: 'sign_error',
        status: signRes.status,
        bucket: env.REPORTS_BUCKET,
        object: entry.object,
        endpoint: signEndpoint,
        detail,
      });
    }

    let signed;
    try { signed = await signRes.json(); }
    catch { return json(502, { error: 'sign_bad_json', message: 'Storage returned non-JSON.' }); }

    const path = signed.signedURL || signed.signedUrl || signed.signed_url;
    if (!path) return json(502, { error: 'sign_no_url', body: signed });

    const base = `${env.SUPABASE_URL}/storage/v1${path}`;
    const sep = base.includes('?') ? '&' : '?';
    const finalUrl = `${base}${sep}download=${encodeURIComponent(filename)}`;

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
