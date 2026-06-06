// GOI primary-source library. Static catalogue (app/research/_sources.json),
// link-first; mirror_url is populated later from object storage (R2).
import data from './_sources.json';
import { CORRIDOR_META } from './atlas';

export interface Source {
  id: string; corridor: string; title: string; issuing_body: string;
  year: string; doc_type: string; verification: string; mirror_ok: boolean;
  direct_url: string | null; source_url: string | null; slug: string;
  mirror_url: string | null;
}

export const sources = data as Source[];

export const sourcesByCorridor = (code: string): Source[] =>
  sources.filter((s) => s.corridor === code);

export const sourceCorridorLabel = (code: string): string =>
  ({ semiconductors: 'Semiconductors', critical_minerals: 'Critical Minerals',
     ai_infrastructure: 'AI Infrastructure', defence: 'Defence',
     enterprise_software: 'Enterprise Software' } as Record<string, string>)[code] ?? code;

export const sourceAccent = (code: string): string => CORRIDOR_META[code]?.accent ?? '#888';

export const docTypes = Array.from(new Set(sources.map((s) => s.doc_type))).sort();
export const ministries = Array.from(new Set(sources.map((s) => s.issuing_body))).sort();
export const sourceCount = sources.length;
// Best link to open: self-hosted mirror if present, else the direct gov file, else the source page.
export const bestLink = (s: Source): string | null => s.mirror_url || s.direct_url || s.source_url;
