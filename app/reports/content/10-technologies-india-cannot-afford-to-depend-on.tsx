import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* 10 Technologies India Cannot Afford to Depend on — free long-form edition. Read at build time from the co-located .body.html. */

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
  { id: 'get-the-report', label: 'Get the Report & Workbook' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', '10-technologies-india-cannot-afford-to-depend-on.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
