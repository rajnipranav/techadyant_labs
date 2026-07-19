/**
 * GET /api/gsc/oauth2callback  (Cloudflare Pages Function)
 *
 * One-time OAuth callback for the Google Search Console auth flow. Echoes the
 * authorization code back as JSON so it can be exchanged for a refresh_token
 * in the Google OAuth Playground. Not called by any automated workflow.
 */
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (error) return json(400, { ok: false, error });
  if (!code) return json(400, { ok: false, message: 'No authorization code in query string' });
  return json(200, {
    ok: true,
    message: 'Copy this authorization code into the Google OAuth Playground Step 2 to exchange for a refresh_token.',
    code,
    next_step: 'Paste the code into https://developers.google.com/oauthplayground Step 2 to get your refresh_token, then add it as GSC_REFRESH_TOKEN.',
  });
}
