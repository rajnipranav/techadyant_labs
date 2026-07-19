import { NextResponse } from 'next/server';

/**
 * GET /api/gsc/oauth2callback
 *
 * One-time OAuth callback used to complete the Google auth flow in the browser.
 * Stores the authorization code in the query string so the user can copy it
 * back into the Google OAuth Playground to exchange for a refresh_token.
 *
 * This endpoint is NOT called by the sitemap submission workflow — it only
 * exists so you can run the one-time Playground flow against your real
 * redirect_uri without hitting "redirect_uri_mismatch".
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { ok: false, error },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, message: 'No authorization code in query string' },
      { status: 400 }
    );
  }

  // Echo the code back as JSON so the user can copy it.
  // In production this endpoint should be protected or removed after setup.
  return NextResponse.json({
    ok: true,
    message: 'Copy this authorization code into the Google OAuth Playground Step 2 to exchange for a refresh_token.',
    code,
    next_step: 'Paste the code into https://developers.google.com/oauthplayground Step 2 to get your refresh_token, then add it as GSC_REFRESH_TOKEN in GitHub Secrets.',
  });
}
