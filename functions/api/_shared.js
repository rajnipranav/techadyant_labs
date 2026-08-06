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
    object: 'Beyond-Solar-Panels-Indian-Industrial-Intelligence .pdf',
    filename: 'Beyond-Solar-Panels-Indian-Industrial-Intelligence-Techadyant-Labs.pdf',
    title: 'Beyond Solar Panels',
    // Report + Data tier
    priceWithDataInr: 9999,
    dataObject: 'data/Beyond-Solar-Panels-Indian-Industrial-Intelligence .xlsx',
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
