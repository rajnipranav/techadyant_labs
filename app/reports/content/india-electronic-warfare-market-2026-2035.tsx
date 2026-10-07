import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ---------------------------------------------------------------------------
   India Electronic Warfare Market 2026–2035 — long-form reading edition.
   Source: the publication HTML edition, cleaned for the site: head/styles/
   JSON-LD/site chrome stripped, sections anchored to the reader TOC, figures
   scoped to .report-figure/.fig-frame, prices aligned to the live tiers
   (₹6,999 report / ₹11,999 report + data), purchase CTAs wired to the on-page
   access panel (#get-report-access). Read here at build time from the
   co-located .body.html.
   ------------------------------------------------------------------------- */

export const toc: TocItem[] = [
  { id: 'thesis', label: 'The Thesis' },
  { id: 'numbers', label: 'Key Numbers' },
  { id: 'findings', label: 'Key Findings' },
  { id: 'framework', label: 'The Framework' },
  { id: 'implications', label: 'What It Means' },
  { id: 'figures', label: 'Analytical Figures' },
  { id: 'tables', label: 'The Numbers, Tabulated' },
  { id: 'watch', label: 'What to Watch' },
  { id: 'faq', label: 'Frequently Asked Questions' },
  { id: 'sources', label: 'Sources & Methodology' },
  { id: 'get-report', label: 'Get the Full Report' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'india-electronic-warfare-market-2026-2035.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
