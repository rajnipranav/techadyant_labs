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
    priceWithDataInr: 11999,
    dataObject: 'data/Techadyant_Semicon2_0_DataWorkbook.xlsx',
    dataFilename: 'The-Semicon-2-0-Opportunity-Map-Data-Pack-Techadyant-Labs.xlsx',
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
  'india-ai-compute-corridor-economics': {
    access: 'paid',
    priceInr: 6999,
    object: 'india-ai-compute-corridor-economics.pdf',
    filename: 'India-AI-Compute-Corridor-Economics-2026-2035-Techadyant-Labs.pdf',
    title: 'India AI Compute Corridor Economics, 2026–2035',
    // Report + Data tier: the AI Compute workbook (9 sheets — live 100/500 MW financial model, reproducible T-ACVI engine, source-traceability columns).
    priceWithDataInr: 11999,
    dataObject: 'data/india-ai-compute-corridor-economics.xlsx',
    dataFilename: 'India-AI-Compute-Corridor-Economics-2026-2035-Data-Pack-Techadyant-Labs.xlsx',
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
    // Report + Data tier: the Dholera supplier-ecosystem workbook (17 sheets).
    priceWithDataInr: 9900,
    dataObject: 'data/dholera-semiconductor-supplier-ecosystem.xlsx',
    dataFilename: 'Dholera-Semiconductor-Supplier-Ecosystem-Data-Pack-Techadyant-Labs.xlsx',
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
  'iaf-autonomous-air-power': {
    access: 'paid',
    priceInr: 5900,
    object: 'IAF_Autonomous_Air_Power_Roadmap_2026-2035.pdf',
    filename: 'IAF-Autonomous-Air-Power-Roadmap-2026-2035-Techadyant-Labs.pdf',
    title: 'IAF Autonomous Air Power Roadmap 2026\u20132035',
    // Report + Data tier: the IAF UAS workbook. Price authority for the data tier.
    priceWithDataInr: 8900,
    dataObject: 'data/IAF_Autonomous_Air_Power_Data_Workbook.xlsx',
    dataFilename: 'IAF-Autonomous-Air-Power-Data-Pack-Techadyant-Labs.xlsx',
  },
  'beyond-sea-drones-india-autonomous-maritime-systems': {
    access: 'paid',
    priceInr: 6999,
    object: 'Techadyant_BeyondSeaDrones_Report.pdf',
    filename: 'Beyond-Sea-Drones-Indias-Autonomous-Maritime-Systems-2026-2035-Techadyant-Labs.pdf',
    title: 'Beyond Sea Drones: India\u2019s Autonomous Maritime Systems Ecosystem 2026\u20132035',
    // Report + Data tier
    priceWithDataInr: 9999,
    dataObject: 'data/Techadyant_BeyondSeaDrones_Workbook.xlsx',
    dataFilename: 'Beyond-Sea-Drones-Data-Pack-Techadyant-Labs.xlsx',
  },
  'industrial-ai-in-indian-manufacturing': {
    access: 'paid',
    priceInr: 9900,
    object: 'Techadyant_Industrial_AI_Report.pdf',
    filename: 'Industrial-AI-in-Indian-Manufacturing-Techadyant-Labs.pdf',
    title: "Industrial AI in Indian Manufacturing",
    priceWithDataInr: 14900,
    dataObject: 'data/Techadyant_Industrial_AI_Workbook.xlsx',
    dataFilename: 'Industrial-AI-in-Indian-Manufacturing-Data-Pack-Techadyant-Labs.xlsx',
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
  const isData = String(tier) === 'report_plus_data';
  const host = site.replace(/^https?:\/\//, '');
  const dataStep = isData
    ? `<li style="margin-bottom:11px"><b>Download the Excel data pack.</b> Your <b>Report + Data</b> licence includes the full underlying dataset — use the “Data (XLSX)” button next to the report in your library.</li>`
    : '';
  const gstFoot = COMPANY.gstin
    ? `GSTIN: ${COMPANY.gstin}`
    : `${COMPANY.name} is not presently registered under GST (registration in process); no GST has been charged on this purchase.`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;color:#1a2432;font-size:15px;line-height:1.6">
    <div style="border-bottom:3px solid #1F5C8C;padding-bottom:14px;margin-bottom:22px">
      <div style="font-size:20px;font-weight:700;color:#0B1D33">Techadyant Labs</div>
      <div style="letter-spacing:2px;font-size:11px;color:#5A7080;margin-top:2px">STRATEGIC INTELLIGENCE</div>
    </div>

    <p>Thank you for your purchase — your report is unlocked and ready. This email is your receipt and everything you need to access it.</p>

    <div style="background:#f4f7fa;border:1px solid #e3e8ee;border-radius:8px;padding:14px 18px;margin:20px 0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:5px 0;color:#5A7080">Report</td><td style="padding:5px 0;text-align:right"><b>${title || slug}</b></td></tr>
        <tr><td style="padding:5px 0;color:#5A7080">Licence</td><td style="padding:5px 0;text-align:right">${tierLabel}${isData ? ' (PDF + Excel data pack)' : ''}</td></tr>
        <tr><td style="padding:5px 0;color:#5A7080">Amount paid</td><td style="padding:5px 0;text-align:right">${amt}</td></tr>
        ${invoiceNo ? `<tr><td style="padding:5px 0;color:#5A7080">Invoice</td><td style="padding:5px 0;text-align:right">${invoiceNo}</td></tr>` : ''}
        <tr><td style="padding:5px 0;color:#5A7080">Payment ID</td><td style="padding:5px 0;text-align:right">${paymentId || ''}</td></tr>
      </table>
    </div>

    <p style="text-align:center;margin:24px 0"><a href="${site}/account/" style="background:#1F5C8C;color:#fff;padding:13px 30px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block">Go to your library →</a></p>

    <h3 style="color:#0B1D33;font-size:16px;margin:26px 0 10px">How to access your report</h3>
    <ol style="padding-left:20px;margin:0">
      <li style="margin-bottom:11px"><b>Sign in with this email address</b> (${email}) at <a href="${site}/account/">${host}/account</a>. Use the same email you purchased with — your access is tied to it.</li>
      <li style="margin-bottom:11px"><b>Open “Your account”</b> to see your library, with every report you own.</li>
      <li style="margin-bottom:11px"><b>Download the PDF</b> using the “PDF” button next to the report. The link is personal to your account.</li>
      ${dataStep}
      <li style="margin-bottom:11px"><b>Re-download any time.</b> Your access is lifetime — return to your library whenever you need the files again.</li>
    </ol>

    <h3 style="color:#0B1D33;font-size:16px;margin:26px 0 10px">Your invoice</h3>
    <p style="margin:0">In your library, click <b>Invoice</b> next to the report — it opens a printable invoice you can save as a PDF. ${COMPANY.gstin ? '' : 'We are completing GST registration; a GST tax invoice can be issued on request once it is live. '}Need anything specific for your records? Just reply to this email.</p>

    <h3 style="color:#0B1D33;font-size:16px;margin:26px 0 10px">Staying in touch</h3>
    <p style="margin:0">As a reader you’ll occasionally hear from us when a relevant new report or briefing is published — nothing more, and you can unsubscribe from those in one click. Receipts and account emails are always sent regardless.</p>

    <p style="margin:24px 0 0">Questions, or want a walkthrough of the report for your team? Reply here or write to <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>. We read every message.</p>

    <hr style="border:none;border-top:1px solid #e3e8ee;margin:26px 0">
    <p style="font-size:11px;color:#8593A6;line-height:1.6">
      ${COMPANY.name} · CIN ${COMPANY.cin} · PAN ${COMPANY.pan}<br>
      ${COMPANY.address}<br>
      ${COMPANY.email} · labs.techadyant.com<br>
      ${gstFoot}
    </p>
  </div>`;
  const text = `Thank you for your purchase — your report is ready.

Report: ${title || slug}
Licence: ${tierLabel}${isData ? ' (PDF + Excel data pack)' : ''}
Amount paid: ${amt}
${invoiceNo ? 'Invoice: ' + invoiceNo + '\n' : ''}Payment ID: ${paymentId || ''}

HOW TO ACCESS
1. Sign in with this email (${email}) at ${site}/account
2. Open "Your account" to see your library
3. Click "PDF" to download the report${isData ? '\n4. Click "Data (XLSX)" to download the data pack' : ''}
Your access is lifetime — re-download any time.

YOUR INVOICE
Open ${site}/account and click "Invoice" next to the report to view or print it. Reply to this email if you need anything specific.

You'll occasionally get emails about new reports; unsubscribe any time.
Questions? Reply here or ${COMPANY.email}.

${COMPANY.name} · CIN ${COMPANY.cin} · ${COMPANY.address} · ${COMPANY.email}
${gstFoot}`;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `Techadyant Labs <${from}>`, to: [email], subject: `Your Techadyant Labs report is ready — access, download & invoice${invoiceNo ? ' · ' + invoiceNo : ''}`, html, text, reply_to: COMPANY.email }),
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

/** Printable HTML invoice for a paid order. GST-aware: when COMPANY.gstin is set it
 *  becomes a Tax Invoice with an 18% split; until then it is a plain (non-GST) invoice. */
export function renderInvoiceHtml({ invoiceNo, dateLabel, buyerEmail, buyerName, title, tier, amountInr, paymentId, orderId }) {
  const amt = Number(amountInr || 0);
  const inr = (n) => 'INR ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const tierLabel = String(tier) === 'report_plus_data' ? 'Report + Data' : 'Report';
  const gst = COMPANY.gstin ? amt - amt / 1.18 : 0;
  const taxable = amt - gst;
  const isTax = !!COMPANY.gstin;
  const gstRows = isTax
    ? `<tr><td class="lbl">Taxable value</td><td class="r">${inr(taxable)}</td></tr>
       <tr><td class="lbl">GST @ 18%</td><td class="r">${inr(gst)}</td></tr>`
    : `<tr><td class="lbl">GST</td><td class="r">Not applicable</td></tr>`;
  const gstNote = isTax
    ? `GSTIN: ${COMPANY.gstin}. Tax charged under SAC 998431 (online information/database services).`
    : `${COMPANY.name} is not presently registered under GST (registration in process); accordingly no GST has been charged. A revised GST tax invoice can be issued on request once registration is complete.`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${invoiceNo || ''}</title><style>
@page{size:A4;margin:18mm}*{font-family:Arial,Helvetica,sans-serif;color:#1a2432;box-sizing:border-box}
body{font-size:12px;line-height:1.5;max-width:800px;margin:24px auto;padding:0 16px}
.top{display:flex;justify-content:space-between;border-bottom:3px solid #1F5C8C;padding-bottom:14px}
.brand{font-size:20px;font-weight:700;color:#0B1D33}.brand small{display:block;font-size:10px;font-weight:400;color:#5A7080;letter-spacing:2px;margin-top:2px}
.inv-tag{text-align:right}.inv-tag h1{font-size:22px;margin:0;color:#1F5C8C;letter-spacing:2px}.inv-tag .meta{font-size:12px;color:#5A7080;margin-top:6px}
.parties{display:flex;justify-content:space-between;margin-top:22px;gap:30px}.box{width:48%}
.box h3{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#1F5C8C;margin:0 0 6px}.box p{margin:1px 0}
table{width:100%;border-collapse:collapse;margin-top:26px}
th{background:#0B1D33;color:#fff;text-align:left;padding:9px 10px;font-size:10px;text-transform:uppercase}
td{padding:11px 10px;border-bottom:1px solid #e3e8ee;vertical-align:top}.r{text-align:right}
.tot{width:60%;margin-left:40%;margin-top:8px}.tot td{border:none;padding:5px 10px}.tot .lbl{text-align:right;color:#5A7080}
.grand td{border-top:2px solid #1F5C8C;font-size:15px;font-weight:700;color:#0B1D33;padding-top:9px}
.paid{display:inline-block;background:#0F8E78;color:#fff;padding:4px 12px;border-radius:4px;font-weight:700;letter-spacing:1px;font-size:11px}
.pay{margin-top:20px;background:#f4f7fa;border:1px solid #e3e8ee;border-radius:6px;padding:12px 14px;font-size:11px}
.note{margin-top:20px;font-size:10px;color:#5A7080;border-top:1px solid #e3e8ee;padding-top:12px}
.print{margin:14px 0;font-size:11px}@media print{.print{display:none}}
</style></head><body>
<div class="print"><button onclick="window.print()">Print / Save as PDF</button></div>
<div class="top"><div><div class="brand">${COMPANY.name}<small>TECHADYANT LABS — STRATEGIC INTELLIGENCE</small></div></div>
<div class="inv-tag"><h1>${isTax ? 'TAX INVOICE' : 'INVOICE'}</h1><div class="meta"><b>Invoice No:</b> ${invoiceNo || '—'}<br><b>Date:</b> ${dateLabel || ''}<br><b>Status:</b> <span class="paid">PAID</span></div></div></div>
<div class="parties">
<div class="box"><h3>From</h3><p><b>${COMPANY.name}</b></p><p>${COMPANY.address}</p><p style="margin-top:6px">CIN: ${COMPANY.cin}</p><p>PAN: ${COMPANY.pan}</p><p>GSTIN: ${COMPANY.gstin || 'Not registered (registration in process)'}</p><p>${COMPANY.email}</p></div>
<div class="box"><h3>Bill To</h3><p><b>${buyerName || (buyerEmail || '').split('@')[0]}</b></p><p>${buyerEmail || ''}</p><p style="margin-top:6px;color:#8593A6">Buyer GSTIN / address: as provided by customer</p></div>
</div>
<table><thead><tr><th style="width:64%">Description</th><th class="r">Qty</th><th class="r">Amount (INR)</th></tr></thead>
<tbody><tr><td><b>${title || ''}</b><br><span style="color:#5A7080">Strategic-intelligence report — <b>${tierLabel}</b> licence (digital delivery).</span></td><td class="r">1</td><td class="r">${amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr></tbody></table>
<table class="tot"><tr><td class="lbl">Subtotal</td><td class="r">${inr(amt)}</td></tr>${gstRows}<tr class="grand"><td class="lbl">Total Paid</td><td class="r">${inr(amt)}</td></tr></table>
<div class="pay"><b>Payment received</b> via Razorpay.<br>Payment ID: ${paymentId || '—'} · Order ID: ${orderId || '—'}</div>
<div class="note">This is a digital product delivered electronically to the purchaser's account at labs.techadyant.com; no physical shipment is made. ${gstNote} This invoice is computer-generated and valid without signature.</div>
</body></html>`;
}

/** Add a buyer to the mailing list on purchase (soft opt-in on the customer
 *  relationship). Idempotent + safe: on_conflict=email with ignore-duplicates, so a
 *  brand-new email is added but any existing row — including someone who previously
 *  UNSUBSCRIBED — is left completely untouched. Fire-and-forget. */
export async function upsertSubscriber(env, email, source = 'purchase') {
  if (!email) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers?on_conflict=email`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify({ email, source, confirmed: true, confirmed_at: new Date().toISOString() }),
    });
  } catch { /* never block the purchase */ }
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
