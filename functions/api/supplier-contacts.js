/**
 * POST /api/supplier-contacts — release gated supplier contact details.
 *
 * Body JSON: { id: string }  (or { ids: string[] })
 *
 * The public directory (app/research/_suppliers.json) ships WITHOUT contact
 * details, GSTIN, Udyam or MOQ. Those live only here, server-side, and are
 * released on request after the visitor has captured their email via
 * /api/subscribe (source 'atlas-supplier-unlock'). This keeps the commercially
 * valuable fields out of the crawlable/static bundle.
 *
 * Returns 200 { ok:true, contact:{...} } for { id }, or { ok:true, contacts:{id:{...}} }
 * for { ids }. 400 on bad body, 404 when the id is unknown.
 */
import CONTACTS from './_supplier-contacts.json';
import { json } from './_shared.js';

export async function onRequestPost({ request }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  if (Array.isArray(body?.ids)) {
    const out = {};
    for (const id of body.ids.slice(0, 50)) {
      if (CONTACTS[id]) out[id] = CONTACTS[id];
    }
    return json({ ok: true, contacts: out });
  }

  const id = body?.id;
  if (!id || typeof id !== 'string') return json({ ok: false, error: 'missing_id' }, 400);
  const contact = CONTACTS[id];
  if (!contact) return json({ ok: false, error: 'not_found' }, 404);
  return json({ ok: true, contact });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    },
  });
}
