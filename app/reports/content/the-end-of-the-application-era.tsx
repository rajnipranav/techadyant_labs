import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ───────────────────────────────────────────────────────────────────────────
   The End of the Application Era — "Who Captures Computing When the
   Application Disappears?" · Free edition.
   The full report is rendered as static, server-side HTML so every paragraph,
   table and figure label is crawler- and AI-indexable. Each figure's SVG is
   inlined (namespaced at build) so search and answer engines read the diagram
   labels, not just the caption. Source: the report manuscript, pre-rendered to
   the co-located .body.html at authoring time and read here at build time.
   ─────────────────────────────────────────────────────────────────────────── */

export const toc: TocItem[] = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'part-i-the-operating-system-paradigm', label: 'Part I — The Operating System Paradigm' },
  { id: 'chapter-1-a-brief-history-of-operating-systems', label: 'Ch 1 · A Brief History of Operating Systems' },
  { id: 'chapter-2-the-foundational-abstractions-of-modern-operating', label: 'Ch 2 · The Foundational Abstractions of Modern Operating Systems' },
  { id: 'chapter-3-the-limits-of-the-current-model', label: 'Ch 3 · The Limits of the Current Model' },
  { id: 'part-ii-the-ai-disruption', label: 'Part II — The AI Disruption' },
  { id: 'chapter-4-from-applications-to-agents', label: 'Ch 4 · From Applications to Agents' },
  { id: 'chapter-5-new-workloads-new-requirements', label: 'Ch 5 · New Workloads, New Requirements' },
  { id: 'chapter-6-the-accelerator-revolution', label: 'Ch 6 · The Accelerator Revolution' },
  { id: 'part-iii-which-abstractions-break-first', label: 'Part III — Which Abstractions Break First' },
  { id: 'chapter-7-the-death-of-the-application', label: 'Ch 7 · The Death of the Application' },
  { id: 'chapter-8-the-future-of-processes-and-threads', label: 'Ch 8 · The Future of Processes and Threads' },
  { id: 'chapter-9-the-future-of-memory', label: 'Ch 9 · The Future of Memory' },
  { id: 'chapter-10-rethinking-security', label: 'Ch 10 · Rethinking Security' },
  { id: 'part-iv-ai-native-operating-systems', label: 'Part IV — AI-Native Operating Systems' },
  { id: 'chapter-11-emerging-aios-architectures', label: 'Ch 11 · Emerging AIOS Architectures' },
  { id: 'chapter-12-candidate-architectures-for-the-future', label: 'Ch 12 · Candidate Architectures for the Future' },
  { id: 'chapter-13-what-happens-to-windows-linux-and-macos', label: 'Ch 13 · What Happens to Windows, Linux, and macOS' },
  { id: 'part-v-industry-economic-transformation', label: 'Part V — Industry & Economic Transformation' },
  { id: 'chapter-14-impact-on-the-technology-industry', label: 'Ch 14 · Impact on the Technology Industry' },
  { id: 'chapter-15-economic-consequences', label: 'Ch 15 · Economic Consequences' },
  { id: 'chapter-16-agent-economics', label: 'Ch 16 · Agent Economics' },
  { id: 'chapter-17-winners-and-losers-in-the-agent-native-era', label: 'Ch 17 · Winners and Losers in the Agent-Native Era' },
  { id: 'chapter-18-the-enterprise-transition-timeline', label: 'Ch 18 · The Enterprise Transition Timeline' },
  { id: 'part-vi-geopolitics-sovereignty', label: 'Part VI — Geopolitics & Sovereignty' },
  { id: 'chapter-19-geopolitical-and-sovereignty-implications', label: 'Ch 19 · Geopolitical and Sovereignty Implications' },
  { id: 'part-vii-india-special-section', label: 'Part VII — India Special Section' },
  { id: 'chapter-20-indias-opportunity-in-the-ai-native-computing-era', label: 'Ch 20 · India\'s Opportunity in the AI-Native Computing Era' },
  { id: 'chapter-21-could-india-leapfrog-the-application-era', label: 'Ch 21 · Could India Leapfrog the Application Era?' },
  { id: 'chapter-22-the-india-os-blueprint', label: 'Ch 22 · The India OS Blueprint' },
  { id: 'part-viii-futures-scenarios-strategy', label: 'Part VIII — Futures, Scenarios & Strategy' },
  { id: 'chapter-23-scenarios-for-2035-global', label: 'Ch 23 · Scenarios for 2035 — Global' },
  { id: 'chapter-24-india-2035-strategic-outcomes', label: 'Ch 24 · India 2035: Strategic Outcomes' },
  { id: 'chapter-25-why-this-thesis-could-be-wrong', label: 'Ch 25 · Why This Thesis Could Be Wrong' },
  { id: 'chapter-26-strategic-forecast-and-recommendations', label: 'Ch 26 · Strategic Forecast and Recommendations' },
  { id: 'appendix-a-global-aios-research-landscape', label: 'Appendix A — Global AIOS Research Landscape' },
  { id: 'appendix-b-major-ai-infrastructure-companies', label: 'Appendix B — Major AI Infrastructure Companies' },
  { id: 'appendix-c-emerging-ai-hardware-platforms', label: 'Appendix C — Emerging AI Hardware Platforms' },
  { id: 'appendix-d-glossary', label: 'Appendix D — Glossary' },
  { id: 'appendix-e-methodology', label: 'Appendix E — Methodology' },
  { id: 'appendix-f-future-research-agenda', label: 'Appendix F — Future Research Agenda' },
  { id: 'appendix-g-the-agent-native-capture-index-scoring-tables-and', label: 'Appendix G — The Agent-Native Capture Index: Scoring Tables and Sensitivity' },
];

const BODY = readFileSync(
  path.join(process.cwd(), 'app', 'reports', 'content', 'the-end-of-the-application-era.body.html'),
  'utf8',
);

export function ReportContent() {
  // eslint-disable-next-line react/no-danger
  return <div className="rv-longform" dangerouslySetInnerHTML={{ __html: BODY }} />;
}
