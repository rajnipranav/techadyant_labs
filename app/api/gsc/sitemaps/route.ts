/**
 * GET /api/gsc/sitemaps
 *
 * Server-side endpoint that refreshes the Google OAuth token using the
 * stored refresh_token, then calls searchconsole.googleapis.com to list
 * all sitemaps for the verified GSC property.
 *
 * Auth credentials come from GitHub Actions secrets injected as env vars
 * at build/deploy time. This endpoint is intended to be called from a
 * GitHub Actions workflow, not from the browser.
 *
 * Env vars required:
 *   GSC_CLIENT_ID
 *   GSC_CLIENT_SECRET
 *   GSC_REFRESH_TOKEN
 *   GSC_PROPERTY_URL   e.g. https://labs.techadyant.com/
 */
import { NextResponse } from 'next/server';

async function gscRefreshAccessToken(): Promise<string> {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing GSC_CLIENT_ID, GSC_CLIENT_SECRET, or GSC_REFRESH_TOKEN');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`No access_token in refresh response: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function gscListSitemaps(accessToken: string, propertyUrl: string) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/sitemaps?` +
      new URLSearchParams({ }),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC sitemaps list failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.sitemap || [];
}

export async function GET() {
  const propertyUrl = process.env.GSC_PROPERTY_URL;

  if (!propertyUrl) {
    return NextResponse.json({ ok: false, error: 'GSC_PROPERTY_URL not configured' }, { status: 500 });
  }

  try {
    const accessToken = await gscRefreshAccessToken();
    const sitemaps = await gscListSitemaps(accessToken, propertyUrl);

    return NextResponse.json({
      ok: true,
      property: propertyUrl,
      count: sitemaps.length,
      sitemaps,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
