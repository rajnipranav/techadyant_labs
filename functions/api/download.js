/**
 * Secure report PDF delivery — Cloudflare Pages Function.
 *
 * GET /api/download?report=<slug>
 *   - free reports: served to anyone, no registration.
 *   - paid reports: require Authorization: Bearer <supabase token> AND a
 *     verified entitlement row. Fail-closed otherwise.
 *
 * Architecture: after the entitlement check, we ask Supabase Storage to mint
 * a short-lived signed URL (60s) for the private object, then 302-redirect
 * the browser to it. The signed URL is one-shot, time-limited, and only
 * issued to authorized callers — there is no path to storage that bypasses
 * the entitlement check, and the Worker never has to stream the PDF itself
 * (which avoids Pages Function CPU/wallclock limits on large files).
 *
 * GET /api/download?report=<slug>&debug=1  →  returns JSON instead of redirect
 * (useful for diagnosing failures from the browser network tab).
 */
import { REPORTS, json, getUserFromRequest, hasEntitlement } from './_shared.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('report');
    const debug = url.searchParams.get('debug') === '1';

    const entry = slug && REPORTS[slug];
    if (!entry) return json(404, { error: 'not_found' });

    if (entry.access === 'paid') {
      const user = await getUserFromRequest(request, env);
      if (!user) return json(401, { error: 'auth_required', message: 'Please sign in to download this report.' });
      const ok = await hasEntitlement(env, user.id, slug);
      if (!ok) return json(402, { error: 'payment_required', message: 'Purchase required to download this report.' });
    }

    const have = {
      SUPABASE_URL: !!env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!env.SUPABASE_SERVICE_ROLE_KEY,
      REPORTS_BUCKET: !!env.REPORTS_BUCKET,
    };
    if (!have.SUPABASE_URL || !have.SUPABASE_SERVICE_ROLE_KEY || !have.REPORTS_BUCKET) {
      return json(503, { error: 'storage_unconfigured', message: 'Storage is not configured yet.', have });
    }

    // Ask Supabase to mint a 60-second signed URL for this exact object.
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

    // Supabase returns either { signedURL: "/object/sign/..." } or { signedUrl: "..." }.
    const path = signed.signedURL || signed.signedUrl || signed.signed_url;
    if (!path) return json(502, { error: 'sign_no_url', body: signed });

    const finalUrl = `${env.SUPABASE_URL}/storage/v1${path}`;

    if (debug) {
      return json(200, { ok: true, redirect: finalUrl, bucket: env.REPORTS_BUCKET, object: entry.object });
    }

    return Response.redirect(finalUrl, 302);
  } catch (e) {
    return json(500, {
      error: 'exception',
      message: e && e.message ? e.message : String(e),
      stack: e && e.stack ? String(e.stack).slice(0, 800) : undefined,
    });
  }
}
