/**
 * Secure report PDF delivery — Cloudflare Pages Function.
 *
 * GET /api/download?report=<slug>
 *   - free reports: served to anyone, no registration.
 *   - paid reports: require Authorization: Bearer <supabase token> AND a
 *     verified entitlement row. Fail-closed otherwise.
 *
 * The browser never receives a storage URL: we read the private object with the
 * service-role key and stream the bytes back. There is no path to storage that
 * bypasses the entitlement check.
 */
import { REPORTS, json, getUserFromRequest, hasEntitlement } from './_shared.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('report');

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

    const objectUrl =
      `${env.SUPABASE_URL}/storage/v1/object/${env.REPORTS_BUCKET}/${encodeURIComponent(entry.object)}`;

    let upstream;
    try {
      upstream = await fetch(objectUrl, {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
    } catch (fe) {
      return json(502, {
        error: 'fetch_failed',
        message: fe && fe.message ? fe.message : String(fe),
        bucket: env.REPORTS_BUCKET,
        object: entry.object,
      });
    }

    if (!upstream.ok) {
      let detail = '';
      try { detail = (await upstream.text()).slice(0, 500); } catch {}
      return json(502, {
        error: 'storage_error',
        status: upstream.status,
        bucket: env.REPORTS_BUCKET,
        object: entry.object,
        detail,
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="${entry.filename || slug + '.pdf'}"`,
        'cache-control': 'private, no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (e) {
    return json(500, {
      error: 'exception',
      message: e && e.message ? e.message : String(e),
      stack: e && e.stack ? String(e.stack).slice(0, 800) : undefined,
    });
  }
}
