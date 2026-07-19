/**
 * GET /api/gsc/sitemaps  (Cloudflare Pages Function)
 *
 * Refreshes the Google OAuth access token from the stored refresh_token, then
 * lists all sitemaps for the verified GSC property. Credentials come from
 * Cloudflare Pages environment variables:
 *   GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN, GSC_PROPERTY_URL
 */
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function refreshAccessToken(env) {
  const clientId = env.GSC_CLIENT_ID;
  const clientSecret = env.GSC_CLIENT_SECRET;
  const refreshToken = env.GSC_REFRESH_TOKEN;
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
  if (!res.ok) throw new Error(`Token refresh failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  if (!data.access_token) throw new Error(`No access_token in refresh response: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function listSitemaps(accessToken, propertyUrl) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/sitemaps`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`GSC sitemaps list failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.sitemap || [];
}

export async function onRequestGet({ env }) {
  const propertyUrl = env.GSC_PROPERTY_URL;
  if (!propertyUrl) return json(500, { ok: false, error: 'GSC_PROPERTY_URL not configured' });
  try {
    const accessToken = await refreshAccessToken(env);
    const sitemaps = await listSitemaps(accessToken, propertyUrl);
    return json(200, { ok: true, property: propertyUrl, count: sitemaps.length, sitemaps });
  } catch (err) {
    return json(500, { ok: false, error: (err && err.message) || String(err) });
  }
}
