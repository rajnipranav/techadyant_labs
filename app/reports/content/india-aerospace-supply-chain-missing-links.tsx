import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ───────────────────────────────────────────────────────────────────────────
   India's Aerospace Supply Chain: Missing Links — long-form reading edition.
   Rendered as static, server-side HTML so every paragraph, table and figure
   label is crawler- and AI-indexable; the three analytical figures are inlined
   SVG. Source: the condensed HTML edition, cleaned and scoped to .rv-longform,
   read here at build time from the co-located .body.html.
   ─────────────────────────────────────────────────────────────────────────── */

export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The Thesis' },
  { id: 'key-numbers', label: 'Key Numbers' },
  { id: 'key-findings', label: 'Key Findings' },
  { id: 'the-framework', label: 'The Framework' },
  { id: 'what-it-means', label: 'What It Means' },
  { id: 'analytical-figures', label: 'Analytical Figures' },
  { id: 'the-numbers-tabulated', label: 'The Numbers, Tabulated' },
  { id: 'what-to-watch', label: 'What to Watch' },
  { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
  { id: 'sources-methodology', label: 'Sources & Methodology' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'india-aerospace-supply-chain-missing-links.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
