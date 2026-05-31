'use client';

export const ADMIN_BASE = '/api/admin';

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(ADMIN_BASE + path, {
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    ...init,
  });
  const text = await r.text();
  let body: unknown;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!r.ok) {
    const msg = (body && typeof body === 'object' && 'error' in body) ? (body as { error: string }).error : `HTTP ${r.status}`;
    throw new Error(msg);
  }
  return body as T;
}

export const CORRIDORS = [
  { code: 'semiconductors', label: 'Semiconductors' },
  { code: 'critical_minerals', label: 'Critical minerals' },
  { code: 'ai_infrastructure', label: 'AI infrastructure' },
  { code: 'defence', label: 'Defence' },
];

export const ENTITY_TYPES = [
  'company', 'psu', 'facility', 'scheme', 'ministry', 'govt_body', 'mineral_material',
  'technology', 'person', 'country', 'foreign_supplier', 'financial_institution',
  'industry_body', 'research_institution', 'jv',
];

// capture status 0..5 -> fill / ink (red = import-dependent, teal = sovereign)
export const CAPTURE_FILL = ['#E24B4A', '#EF9F27', '#FAC775', '#9FE1CB', '#1D9E75', '#0F6E56'];
export const CAPTURE_INK = ['#501313', '#633806', '#633806', '#04342C', '#E1F5EE', '#E1F5EE'];
export const CAPTURE_LABEL = ['import-dependent', 'nascent', 'emerging', 'partial', 'substantial', 'sovereign'];
