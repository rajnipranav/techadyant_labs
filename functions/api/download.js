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

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.REPORTS_BUCKET) {
    return json(503, { error: 'storage_unconfigured', message: 'Storage is not configured yet.' });
  }

  const objectUrl =
    `${env.SUPABASE_URL}/storage/v1/object/${env.REPORTS_BUCKET}/${encodeURIComponent(entry.object)}`;
  const upstream = await fetch(objectUrl, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!upstream.ok) return json(502, { error: 'storage_error', status: upstream.status });

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${entry.filename || slug + '.pdf'}"`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
