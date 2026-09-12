import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ---------------------------------------------------------------------------
   The Cloud Question — India's Dependence on Foreign Hyperscalers and the
   Sovereign Cloud Challenge (2026 Edition) — long-form reading edition.
   Source: the condensed HTML edition (Qwen_html_20260909), cleaned for the
   site: head/styles/JSON-LD/site chrome stripped, sections anchored to the
   reader TOC, figures scoped to .report-figure/.fig-frame, prices aligned to
   the live tiers (₹6,999 report / ₹11,999 report + data), purchase CTAs wired
   to the on-page access panel (#get-report-access). Read here at build time
   from the co-located .body.html.
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
  path.join(process.cwd(), 'app', 'reports', 'content', 'india-cloud-question.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
