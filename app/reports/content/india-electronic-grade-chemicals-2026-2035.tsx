import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ---------------------------------------------------------------------------
   India's Electronic-Grade Chemicals and Process Materials, 2026–2035 —
   long-form reading edition (Edition 2.2). Source: the publication HTML
   edition, cleaned for the site: head/styles/site chrome/email form stripped,
   sections anchored to the reader TOC, figures rebuilt in the house palette
   and scoped to .report-figure/.fig-frame, every number regenerated from model
   v2.6, prices aligned to the live tiers (₹10,000 report / ₹15,000 report +
   data), purchase CTAs wired to the on-page access panel (#get-report-access).
   Read here at build time from the co-located .body.html.
   ------------------------------------------------------------------------- */

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
  { id: 'get-the-full-report', label: 'Get the Full Report' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'india-electronic-grade-chemicals-2026-2035.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
