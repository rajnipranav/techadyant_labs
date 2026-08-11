/**
 * Shared helpers for Pages Functions (Workers runtime).
 * No external dependencies — uses fetch + Web Crypto only.
 */

// Authoritative server-side report catalogue. Price/access live here, never trusted from client.
// Entries can override the storage bucket per-report via `bucket`; entries marked
// `publicBucket: true` skip the sign step and return the public storage URL directly.
export const REPORTS = {
  'beyond-solar-panels': {
    access: 'paid',
    priceInr: 6999,
    object: 'Beyond-Solar-Panels-Indian-Industrial-Intelligence.pdf',
    filename: 'Beyond-Solar-Panels-Indian-Industrial-Intelligence-Techadyant-Labs.pdf',
    title: 'Beyond Solar Panels',
    // Report + Data tier
    priceWithDataInr: 9999,
    dataObject: 'data/Beyond-Solar-Panels-Indian-Industrial-Intelligence.xlsx',
    dataFilename: 'Beyond-Solar-Panels-Data-Pack-Techadyant-Labs.xlsx',
  },
  'q-day-india': {
    access: 'free',
    publicBucket: true,
    object: 'free reports/Techadyant_Labs_QDay_Report.pdf',
    filename: 'Q-Day-India-Techadyant-Labs.pdf',
    title: 'Q-Day India',
  },
  'indian-navy-autonomous-maritime': {
    access: 'paid',
    priceInr: 5900,
    object: 'Indian_Navy_Autonomous_Maritime.pdf',
    filename: 'Indian-Navy-Autonomous-Maritime-Transformation-Techadyant-Labs.pdf',
    title: 'The Indian Navy\u2019s Autonomous Maritime Transformation 2026\u20132035',
    // Report + Data tier: the naval-autonomy workbook. Price authority for the data tier.
    priceWithDataInr: 10900,
    dataObject: 'data/Indian_Navy_Autonomous_Maritime.xlsx',
    dataFilename: 'Indian-Navy-Autonomous-Maritime-Data-Pack-Techadyant-Labs.xlsx',
  },
  'india-critical-manufacturing-dependencies': {
    access: 'paid',
    priceInr: 6999,
    object: 'India-Critical-Manufacturing-Dependencies-2026.pdf',
    filename: 'India-Critical-Manufacturing-Dependencies-2026-Techadyant-Labs.pdf',
    title: 'India’s Critical Manufacturing Dependencies',
    // Report + Data tier: the CMDD workbook. Price authority for the data tier.
    priceWithDataInr: 11999,
    dataObject: 'data/India-Critical-Manufacturing-Dependencies-Data-Pack.xlsx',
    dataFilename: 'India-Critical-Manufacturing-Dependencies-Data-Pack-Techadyant-Labs.xlsx',
  },
  'semicon-2-0-opportunity-map': {
    access: 'paid',
    priceInr: 6999,
    object: 'semicon 2.0 opportunity map.pdf',
    filename: 'The-Semicon-2-0-Opportunity-Map-Techadyant-Labs.pdf',
    title: 'The Semicon 2.0 Opportunity Map',
  },
  'the-sme-playbook-for-indias-drone-economy': {
    access: 'paid',
    priceInr: 4999,
    object: 'SME-Playbook-Indias-Drone-Economy.pdf',
    filename: 'The-SME-Playbook-for-Indias-Drone-Economy-Techadyant-Labs.pdf',
    title: 'The SME Playbook for India’s Drone Economy',
  },
  'india-industrial-water-opportunity-map': {
    access: 'paid',
    priceInr: 4999,
    object: 'India-Industrial-Water-Opportunity-Map.pdf',
    filename: 'India-Industrial-Water-Opportunity-Map-Techadyant-Labs.pdf',
    title: 'India\u2019s Industrial Water Opportunity Map',
  },
  'quantum-supply-chain': {
    access: 'paid',
    priceInr: 6999,
    object: 'Techadyant_Quantum_SupplyChain.pdf',
    filename: 'The-Hidden-Supply-Chain-of-Quantum-Computing-Techadyant-Labs.pdf',
    title: 'The Hidden Supply Chain of Quantum Computing',
  },
  'india-cargo-drone-market': {
    access: 'paid',
    priceInr: 4999,
    object: 'India_Cargo_Drone_Demand_Intelligence_2026-2035.pdf',
    filename: 'India-Cargo-Drone-Demand-Intelligence-Techadyant-Labs.pdf',
    title: 'India\u2019s Cargo Drone Demand Intelligence 2026\u20132035',
  },
  'india-loitering-munitions-market': {
    access: 'paid',
    priceInr: 6999,
    object: "India-Loitering-Munitions-Market-Intelligence.pdf",
    filename: 'India-Loitering-Munitions-Market-Intelligence-Techadyant-Labs.pdf',
    title: 'India’s Loitering Munitions Market Intelligence 2026–2035',
  },
  'beyond-quantum-computing': {
    access: 'paid',
    priceInr: 4999,
    object: 'Beyond-Quantum-Computing.pdf',
    filename: 'Beyond-Quantum-Computing-Techadyant-Labs.pdf',
    title: 'Beyond Quantum Computing',
  },
  'indias-unmanned-warfare-transformation': {
    access: 'paid',
    priceInr: 7499,
    object: "India's Unmanned Warfare Transformation.pdf",
    filename: 'Indias-Unmanned-Warfare-Transformation-Techadyant-Labs.pdf',
    deckObject: "India's Unmanned Warfare Transformation - Investor Deck.pptx",
    deckFilename: 'Indias-Unmanned-Warfare-Transformation-Investor-Deck.pptx',
    title: 'India\u2019s Unmanned Warfare Transformation',
  },
  'the-end-of-the-application-era': {
    access: 'free',
    publicBucket: true,
    object: 'free reports/The-End-of-the-Application-Era.pdf',
    filename: 'The-End-of-the-Application-Era-Techadyant-Labs.pdf',
    title: 'Who Captures Computing When the Application Disappears?',
  },
  'india-drone-sensors-payloads-imaging-market': {
    access: 'paid',
    priceInr: 6999,
    object: 'India-Drone-Sensors-Payloads-Imaging-Market.pdf',
    filename: 'India-Drone-Sensors-Payloads-Imaging-Systems-Market-Techadyant-Labs.pdf',
    title: 'India Drone Sensors, Payloads & Imaging Systems Market',
  },
  'india-drone-propulsion-opportunity': {
    access: 'paid',
    priceInr: 4999,
    object: 'Indias-Drone-Propulsion-Opportunity.pdf',
    filename: 'Indias-Drone-Propulsion-Opportunity-Techadyant-Labs.pdf',
    title: 'India\u2019s Drone Propulsion Opportunity',
  },
  'indias-drone-battery-ecosystem': {
    access: 'paid',
    priceInr: 6999,
    object: "India's Drone Battery Ecosystem.pdf",
    filename: 'Indias-Drone-Battery-Ecosystem-Techadyant-Labs.pdf',
    title: 'India’s Drone Battery Ecosystem',
  },
  'drone-electronics-flight-controllers': {
    access: 'paid',
    priceInr: 6999,
    object: 'Drone-Electronics-Flight-Controllers.pdf',
    filename: 'Who-Controls-Indias-Drones-Techadyant-Labs.pdf',
    title: 'Who Controls India’s Drones?',
  },
  'who-builds-indias-drones': {
    access: 'paid',
    priceInr: 6999,
    object: "who-build-india's drones.pdf",
    filename: 'Who-Builds-Indias-Drones-Techadyant-Labs.pdf',
    title: 'Who Builds India’s Drones?',
  },
  'the-opportunity-beyond-the-fab': {
    access: 'paid',
    priceInr: 6999,
    object: 'the-opportunity-beyond-fab.pdf',
    filename: 'The-Opportunity-Beyond-the-Fab-Techadyant-Labs.pdf',
    title: 'The Opportunity Beyond the Fab',
  },
  'india-fab-ecosystem': {
    access: 'paid',
    priceInr: 4900,
    object: 'india-fab-ecosystem.pdf',
    filename: 'Who-Really-Benefits-from-Indias-Fab-Ecosystem-Techadyant-Labs.pdf',
    title: 'Who Really Benefits from India’s Fab Ecosystem?',
  },
  'india-ai-industrial-transition-2026-2035': {
    access: 'free',
    bucket: 'reports-free',
    publicBucket: true,
        object: 'free reports/India-ai-industrial-transition-2026-2035.pdf',

    filename: 'Indias-AI-Industrial-Transition-and-Infrastructure-Transformation-2026-2035-Techadyant-Labs.pdf',
    title: 'India’s AI Industrial Transition and Infrastructure Transformation',
  },
  'india-battlefield-automation-gap': {
    access: 'free',
    bucket: 'reports-free',
    publicBucket: true,
        object: 'free reports/india-battlefield-automation-gap-free.pdf',

    filename: 'Indias-Battlefield-Automation-Gap-Techadyant-Labs.pdf',
    title: 'India’s Battlefield Automation Gap',
  },
  'who-actually-captures-the-india-us-minerals-alliance': {
    access: 'paid',
    priceInr: 4900,
    object: 'who-actually-captures-the-india-us-minerals-alliance.pdf',
    filename: 'Who-Actually-Captures-the-India-US-Minerals-Alliance-Techadyant-Labs.pdf',
    title: 'Who Actually Captures the India–US Minerals Alliance?',
  },
  'dholera-semiconductor-supplier-ecosystem': {
    access: 'paid',
    priceInr: 5900,
    object: 'dholera-semiconductor-supplier-ecosystem.pdf',
    filename: 'Dholera-Semiconductor-Supplier-Ecosystem-Techadyant-Labs.pdf',
    title: "India's Semiconductor Supplier Ecosystem: The Dholera Play",
  },
  'india-green-hydrogen': {
    access: 'paid',
    priceInr: 4900,
    object: 'Green_Hydrogen_Report.pdf',
    filename: 'India-Green-Hydrogen-Mirage-or-Machine-Techadyant-Labs.pdf',
    title: "The Hydrogen Mirage or Machine?",
    // Report + Data tier
    priceWithDataInr: 7900,
    dataObject: 'data/Green_Hydrogen_Report.xlsx',
    dataFilename: 'Green-Hydrogen-Mirage-or-Machine-Data-Pack-Techadyant-Labs.xlsx',
  },
};

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const enc = new TextEncoder();

/** Hex HMAC-SHA256 (used for Razorpay signature checks). */
export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time-ish string compare. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Resolve the Supabase user from a Bearer token. Returns {id,email} or null. */
export async function getUserFromRequest(request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const u = await res.json();
  return u && u.id ? { id: u.id, email: u.email } : null;
}

/** True if the user already owns the report. */
export async function hasEntitlement(env, userId, slug) {
  const url =
    `${env.SUPABASE_URL}/rest/v1/entitlements?select=id&user_id=eq.${encodeURIComponent(userId)}&report_slug=eq.${encodeURIComponent(slug)}&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

// ── Product tiers ──────────────────────────────────────────────────────────
// The tier a buyer holds is the license. Every paid entitlement grants the base
// asset (the PDF); the deck stays an ungated bonus for back-compat. A data-bearing
// tier additionally unlocks ?asset=data. New tiers (data_only, bundle, sub) slot
// in here without touching the rest of the flow.
export const DATA_TIERS = new Set(['report_plus_data', 'data_only', 'bundle']);
export function tierGrantsData(tier) { return DATA_TIERS.has(String(tier || 'report')); }
/** Rank so an upgrade never downgrades an existing entitlement. */
const TIER_RANK = { report: 0, report_plus_data: 2, data_only: 1, bundle: 3 };
export function tierRank(t) { return TIER_RANK[String(t || 'report')] ?? 0; }

/** Insert an entitlement (idempotent on user_id+report_slug), carrying its tier.
 *  If the buyer already owns a lower tier, upgrade the row's tier in place. */
export async function grantEntitlement(env, { userId, email, slug, orderId, tier }) {
  const t = String(tier || 'report');
  await fetch(`${env.SUPABASE_URL}/rest/v1/entitlements`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ user_id: userId, email: email || null, report_slug: slug, order_id: orderId || null, tier: t }),
  });
  // Upgrade path: if the row already existed at a lower tier, bump it.
  if (tierRank(t) > 0) {
    await fetch(
      `${env.SUPABASE_URL}/rest/v1/entitlements?user_id=eq.${encodeURIComponent(userId)}&report_slug=eq.${encodeURIComponent(slug)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'content-type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ tier: t }),
      }
    );
  }
}

// ── Company details (for receipts/invoices) — TechAdyant Private Limited ──
export const COMPANY = {
  name: 'TechAdyant Private Limited',
  brand: 'Techadyant Labs',
  cin: 'U62099KA2026PTC220459',
  pan: 'AANCT1174G',
  gstin: '', // set once GST registration completes -> receipts become GST tax invoices
  address: 'House No. 550 (A), Datta Galli, Vadagaon, M. Vadgaon, Belagavi (Belgaum) – 590005, Karnataka, India',
  email: 'info@techadyant.com',
};

/** Assign (idempotently) an invoice number to a paid order; returns it or null. */
export async function assignInvoiceNo(env, razorpayOrderId) {
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/assign_invoice_no`, {
      method: 'POST',
      headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p_rzp_order: razorpayOrderId }),
    });
    if (!r.ok) return null;
    return await r.json().catch(() => null);
  } catch { return null; }
}

/** Send the buyer an order confirmation + receipt via Resend. Fire-and-forget. */
export async function sendReceiptEmail(env, { email, title, slug, tier, amountInr, invoiceNo, orderId, paymentId }) {
  if (!env.RESEND_API_KEY || !email) return;
  const from = env.FROM_EMAIL || 'labs@techadyant.com';
  const site = env.SITE_URL || 'https://labs.techadyant.com';
  const tierLabel = String(tier) === 'report_plus_data' ? 'Report + Data' : 'Report';
  const amt = amountInr != null ? `₹${Number(amountInr).toLocaleString('en-IN')}` : '';
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a2432">
    <p style="font-size:18px;font-weight:700;color:#0B1D33;margin:0 0 4px">Techadyant Labs</p>
    <p style="letter-spacing:2px;font-size:11px;color:#5A7080;margin:0 0 18px">STRATEGIC INTELLIGENCE</p>
    <p>Thank you for your purchase. Your report is unlocked and ready to download.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr><td style="padding:6px 0;color:#5A7080">Report</td><td style="padding:6px 0;text-align:right"><b>${title || slug}</b></td></tr>
      <tr><td style="padding:6px 0;color:#5A7080">Licence</td><td style="padding:6px 0;text-align:right">${tierLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#5A7080">Amount paid</td><td style="padding:6px 0;text-align:right">${amt}</td></tr>
      ${invoiceNo ? `<tr><td style="padding:6px 0;color:#5A7080">Invoice</td><td style="padding:6px 0;text-align:right">${invoiceNo}</td></tr>` : ''}
      <tr><td style="padding:6px 0;color:#5A7080">Payment ID</td><td style="padding:6px 0;text-align:right">${paymentId || ''}</td></tr>
    </table>
    <p style="margin:22px 0"><a href="${site}/reports/${slug}/" style="background:#1F5C8C;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700">Access your report →</a></p>
    <p style="font-size:13px;color:#5A7080">Sign in with this email to download the PDF${String(tier) === 'report_plus_data' ? ' and the Excel data pack' : ''} from the report page or your account. Need a formal invoice for your records? Reply to this email.</p>
    <hr style="border:none;border-top:1px solid #e3e8ee;margin:22px 0">
    <p style="font-size:11px;color:#8593A6">${COMPANY.name} · CIN ${COMPANY.cin} · ${COMPANY.email}<br>${COMPANY.name} is not presently registered under GST (registration in process); no GST has been charged.</p>
  </div>`;
  const text = `Thank you for your purchase.\n\nReport: ${title || slug}\nLicence: ${tierLabel}\nAmount paid: ${amt}\n${invoiceNo ? 'Invoice: ' + invoiceNo + '\n' : ''}Payment ID: ${paymentId || ''}\n\nAccess your report: ${site}/reports/${slug}/\nSign in with this email to download. Reply for a formal invoice.\n\n${COMPANY.name} · ${COMPANY.email}`;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `Techadyant Labs <${from}>`, to: [email], subject: `Your report is ready${invoiceNo ? ' — Invoice ' + invoiceNo : ''}`, html, text, reply_to: COMPANY.email }),
    });
    if (env.INBOX_LABS) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from: `Techadyant Labs <${from}>`, to: [env.INBOX_LABS], subject: `💰 Sale: ${title || slug} (${tierLabel}) ${amt}`, text: `${email} bought ${slug} [${tier}] ${amt}. Invoice ${invoiceNo || '-'}. Order ${orderId}.` }),
      });
    }
  } catch { /* email must never block the grant */ }
}

/** Atomically claim the "receipt sent" flag for an order. Returns true exactly once
 *  (for the first caller), so verify-payment + webhook never double-email. */
export async function claimReceipt(env, razorpayOrderId) {
  try {
    const r = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}&receipt_sent_at=is.null`,
      {
        method: 'PATCH',
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'content-type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ receipt_sent_at: new Date().toISOString() }),
      }
    );
    if (!r.ok) return false;
    const rows = await r.json().catch(() => []);
    return Array.isArray(rows) && rows.length > 0;
  } catch { return false; }
}

/** Read the authoritative tier + slug recorded for a Razorpay order at checkout. */
export async function getOrder(env, razorpayOrderId) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?select=report_slug,tier,amount_inr&razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}&limit=1`,
    { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export async function markOrderPaid(env, razorpayOrderId, razorpayPaymentId) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}`, {
    method: 'PATCH',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'paid', razorpay_payment_id: razorpayPaymentId, paid_at: new Date().toISOString() }),
  });
}
