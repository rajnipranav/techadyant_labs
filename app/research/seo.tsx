// Shared SEO / GEO helpers for the Atlas. Structured data tuned for both
// classic search (rich results) and AI answer-engines (citable facts).
import { gridForCorridor, corridorById, STATUS_SHORT, lastUpdated } from './atlas';

export const SITE = 'https://labs.techadyant.com';
export const ORG_ID = `${SITE}/#org`;
export const ORG_REF = { '@id': ORG_ID };

/** Render one or more JSON-LD blocks. */
export function JsonLd({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

export function breadcrumb(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE}${t.path}`,
    })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((x) => ({
      '@type': 'Question', name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };
}

interface DatasetOpts {
  name: string; description: string; path: string;
  keywords?: string[]; csv?: string[];
}
export function datasetLd({ name, description, path, keywords, csv }: DatasetOpts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name, description,
    url: `${SITE}${path}`,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'Techadyant Labs', '@id': ORG_ID },
    publisher: ORG_REF,
    dateModified: lastUpdated,
    spatialCoverage: { '@type': 'Place', name: 'India' },
    variableMeasured: 'Value-chain capture status (0 import-dependent → 5 sovereign)',
    keywords: keywords ?? [],
    distribution: (csv ?? []).map((u) => ({
      '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${SITE}${u}`,
    })),
  };
}

/** Data-driven, accurate FAQ for one corridor — citable by AI engines. */
export function corridorFaq(corridorId: number): { q: string; a: string }[] {
  const c = corridorById(corridorId);
  if (!c) return [];
  const cells = gridForCorridor(corridorId);
  if (!cells.length) return [];
  const label = c.label;
  const imp = cells.filter((x) => x.status <= 1);
  const sov = cells.filter((x) => x.status >= 4);
  const weakest = cells.reduce((m, x) => (x.status < m.status ? x : m), cells[0]);
  const list = (xs: typeof cells) => xs.map((x) => `${x.layer} (${STATUS_SHORT[x.status].toLowerCase()})`).join(', ');
  const out: { q: string; a: string }[] = [];
  out.push({
    q: `How import-dependent is India in ${label}?`,
    a: `Across ${cells.length} value-chain layers, India is import-dependent or nascent in ${imp.length}` +
       (imp.length ? ` — ${list(imp)}` : '') +
       `. The weakest link is ${weakest.layer} (${STATUS_SHORT[weakest.status].toLowerCase()}).` +
       (sov.length ? ` India has substantial-to-sovereign capability in ${sov.length} layer${sov.length > 1 ? 's' : ''}: ${list(sov)}.` : '') +
       ` Source: Techadyant Labs, ${SITE}/research/corridors.`,
  });
  out.push({
    q: `What does India import in ${label}?`,
    a: imp.length
      ? `India still imports or has only nascent capability in: ${list(imp)}. Each is assessed with sourced rationale in the Techadyant Labs Import Dependency Map.`
      : `India has at least emerging capability across all assessed ${label} layers.`,
  });
  return out;
}
