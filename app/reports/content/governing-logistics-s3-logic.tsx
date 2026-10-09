import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ---------------------------------------------------------------------------
   Governing Logistics Under Systemic Disruption — long-form reading edition.
   Guest research paper by B. Rama Rao and K. V. Ramakrishna, published by
   Techadyant Labs. This reading edition summarises the paper's framework,
   corridor scores and reform agenda for on-page reading, search and AI-answer
   visibility; the full argument and bibliography are in the free 53-page PDF.
   Figures scoped to .report-figure/.fig-frame; CTA wired to #get-report-access.
   ------------------------------------------------------------------------- */

export const toc: TocItem[] = [
  { id: 'thesis', label: 'The Thesis' },
  { id: 'framework', label: 'The S³-LOGIC Framework' },
  { id: 'key-findings', label: 'Key Findings' },
  { id: 'figures', label: 'The Corridor Scores' },
  { id: 'international-context', label: 'India in Context' },
  { id: 'prescriptions', label: 'The Reform Agenda' },
  { id: 'faq', label: 'Frequently Asked Questions' },
  { id: 'methodology', label: 'Methodology & Sources' },
  { id: 'get-report', label: 'Read the Full Paper' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'governing-logistics-s3-logic.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
