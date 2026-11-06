import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ---------------------------------------------------------------------------
   Closing the Magnet Gap — India's Rare-Earth Permanent-Magnet Ecosystem,
   2026–2035. Long-form reading edition: sections anchored to the reader TOC,
   figures scoped to .report-figure/.fig-frame, prices aligned to the live
   tiers (₹6,999 report / ₹11,999 report + data), purchase CTAs wired to the
   on-page access panel (#get-report-access). Read at build time from the
   co-located .body.html.
   ------------------------------------------------------------------------- */

export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The Thesis' },
  { id: 'key-numbers', label: 'Key Numbers' },
  { id: 'key-findings', label: 'Key Findings' },
  { id: 'the-framework', label: 'The Framework' },
  { id: 'demand-outlook', label: 'Demand Outlook to 2035' },
  { id: 'what-to-watch', label: 'What to Watch' },
  { id: 'faq', label: 'Frequently Asked Questions' },
  { id: 'sources-methodology', label: 'Sources & Methodology' },
  { id: 'get-the-report', label: 'Get the Full Report' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'closing-the-magnet-gap-india-rare-earth-ecosystem-2026-2035.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
