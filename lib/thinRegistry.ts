export interface ThinRecord {
  slug: string;
  path: string;
  name: string;
  entity_type: 'company' | 'manufacturer' | 'platform' | 'system';
  vertical: 'drones-uas' | 'counter-uas' | 'space' | 'military-aerospace';
  parent_hub_path: string;
  status: 'thin';
  tier: 'C';
  noindex: true;
  summary: string;
  website: string | null;
  open_questions: string[];
  last_verified: string;
}

let cache: ThinRecord[] | null = null;

function loadRegistry(): ThinRecord[] {
  if (cache) return cache;
  // In production, this is replaced by the build step with the actual registry JSON.
  // For local dev, load from the adjacent project path if present.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const raw = require('../data/thin_registry.json');
    cache = raw as ThinRecord[];
  } catch {
    cache = [];
  }
  return cache || [];
}

export function getThinRecordBySlug(slug: string): ThinRecord | undefined {
  return loadRegistry().find((r) => r.slug === slug);
}

export function getThinRecordByPath(path: string): ThinRecord | undefined {
  return loadRegistry().find((r) => r.path === path);
}

export function getAllThinRecords(): ThinRecord[] {
  return loadRegistry();
}
