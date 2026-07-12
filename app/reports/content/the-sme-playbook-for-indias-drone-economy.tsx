import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The SME Playbook for India's Drone Economy".
 * Carries the thesis (value accrues in components and the services/aftermarket
 * layer, not airframe assembly), the eight-segment opportunity matrix scored on
 * capital / gross margin / payback / SME suitability, the ₹50 lakh–₹5 crore
 * framing, the policy tailwinds, and the by-profile entry recommendations.
 * The full ~172-page edition (13 chapters, 26 figures, per-segment entry
 * roadmaps, decision matrix and appendices) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { smeToc as toc, SmeContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-window', label: 'A structured industry, and a window' },
  { id: 'the-numbers', label: 'The market in numbers' },
  { id: 'the-sweet-spot', label: 'The ₹50 lakh–₹5 crore sweet spot' },
  { id: 'the-matrix', label: 'Eight segments, scored' },
  { id: 'where-value', label: 'Where the value actually accrues' },
  { id: 'policy', label: 'The policy tailwinds' },
  { id: 'by-profile', label: 'Entry points by investor profile' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0B1D33';
const TEAL = '#2BC5B4';
const BRASS = '#C9A84C';
const SLATE = '#8C9AAE';

/* Figure 1 - the eight-segment opportunity matrix (gross-margin ceilings, ranked) */
function SegmentMatrixFigure() {
  const rows = [
    { s: 'Software', margin: 85, cap: '₹1–4 Cr', pay: '12–24 mo', fit: 'High', c: TEAL },
    { s: 'Training', margin: 60, cap: '₹50L–2 Cr', pay: '12–18 mo', fit: 'Very High', c: TEAL },
    { s: 'Inspection Services', margin: 55, cap: '₹50L–3 Cr', pay: '12–24 mo', fit: 'Very High', c: TEAL },
    { s: 'MRO', margin: 50, cap: '₹50L–2 Cr', pay: '12–18 mo', fit: 'Very High', c: TEAL },
    { s: 'Payload Systems', margin: 50, cap: '₹3–5 Cr', pay: '30–48 mo', fit: 'Low–Mod', c: SLATE },
    { s: 'Fleet Operations', margin: 45, cap: '₹1–5 Cr', pay: '18–30 mo', fit: 'High', c: BRASS },
    { s: 'Manufacturing (Components)', margin: 40, cap: '₹2–5 Cr', pay: '24–36 mo', fit: 'Moderate', c: BRASS },
    { s: 'Infrastructure', margin: 40, cap: '₹50L–5 Cr', pay: '24–48 mo', fit: 'Moderate', c: SLATE },
  ];
  const max = 90;
  return (
    <figure className="report-figure" id="fig-matrix">
      <div className="fig-frame">
        <svg viewBox="0 0 720 330" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Eight drone-economy business segments ranked by gross-margin ceiling">
          <text x="16" y="22" fill={NAVY} fontSize="15" fontWeight="700">Eight segments, by gross-margin ceiling</text>
          {rows.map((r, i) => {
            const y = 40 + i * 34;
            const w = Math.round((r.margin / max) * 300);
            return (
              <g key={r.s}>
                <text x="16" y={y + 15} fill={NAVY} fontSize="11.5" fontWeight="600">{r.s}</text>
                <rect x="250" y={y + 2} width={w} height="18" rx="3" fill={r.c} />
                <text x={250 + w + 6} y={y + 15} fill={NAVY} fontSize="11" fontWeight="700">{r.margin}%</text>
                <text x="560" y={y + 15} fill={SLATE} fontSize="10">{r.cap} · {r.pay} · {r.fit}</text>
              </g>
            );
          })}
          <text x="16" y="322" fill={SLATE} fontSize="10.5">Source: Techadyant Labs segment matrix. Bar = gross-margin ceiling; right column = capital · payback · SME suitability.</text>
        </svg>
      </div>
      <figcaption>The eight business segments ranked by gross-margin ceiling, with capital, payback and SME-suitability read-out.</figcaption>
    </figure>
  );
}

/* Figure 2 - the value-chain shape: where SME margin sits */
function ValueChainFigure() {
  const layers = [
    { l: 'Component manufacturing', note: 'upstream — where import dependence and value both sit', c: BRASS },
    { l: 'Airframe assembly', note: 'crowded, capital-heavy, thin margin — avoid head-on', c: SLATE },
    { l: 'Fleet operations & DaaS', note: 'recurring revenue over the airframe', c: BRASS },
    { l: 'MRO · Training · Inspection · Software', note: 'the services / aftermarket layer — best SME fit', c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-valuechain">
      <div className="fig-frame">
        <svg viewBox="0 0 720 232" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Drone economy value chain showing where SME margin concentrates">
          <text x="16" y="22" fill={NAVY} fontSize="15" fontWeight="700">Where SME margin concentrates in the value chain</text>
          {layers.map((r, i) => {
            const y = 40 + i * 46;
            return (
              <g key={r.l}>
                <rect x="16" y={y} width="8" height="34" rx="4" fill={r.c} />
                <text x="34" y={y + 15} fill={NAVY} fontSize="12.5" fontWeight="700">{r.l}</text>
                <text x="34" y={y + 31} fill={SLATE} fontSize="11">{r.note}</text>
              </g>
            );
          })}
          <text x="16" y="226" fill={SLATE} fontSize="10.5">Source: Techadyant Labs. Value accrues upstream (components) and downstream (services), not in assembly.</text>
        </svg>
      </div>
      <figcaption>Value in India&apos;s drone economy accrues upstream in components and downstream in the services layer — not in airframe assembly.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-window">A structured industry, and a window</h2>
      <p>
        India&apos;s drone economy has crossed the line from experiment to industry. What was a niche, pilot-programme sector
        is now regulated, structured and commercially viable, with more than 38,500 registered drones, 39,890 DGCA-certified
        pilots and 244 approved Remote Pilot Training Organisations (RPTOs) as of February 2026. This report is written for a
        specific reader: the investor or operator with <em>₹50 lakh to ₹5 crore</em> to deploy, who wants to know not that the
        sector is growing but <em>which business inside it to build</em>, at what margin, over what payback, and with what risk.
        The answer is uneven across segments &mdash; and, as with every Techadyant opportunity report, the unevenness is where
        the opportunity lives.
      </p>

      <h2 id="the-numbers">The market in numbers</h2>
      <p>
        India&apos;s drones market was valued at roughly USD 798 million in 2025 and, at a compound growth rate near 17.3%, is
        projected to reach about USD 3.93 billion by 2035 (Expert Market Research). Estimates vary by scope &mdash; across
        Research and Markets, IMARC, TechSci and others the 2030&ndash;2035 projection spans USD 1.39 billion to USD 3.93
        billion, at CAGRs from 8.45% to 24.4% &mdash; but every credible source agrees on the direction and the steepness.
        Commercial drones alone were valued near USD 879 million in 2025. The market is modest today and steep tomorrow; the
        slope of the curve, not its 2026 level, is what a builder should position against.
      </p>

      <h2 id="the-sweet-spot">The ₹50 lakh–₹5 crore sweet spot</h2>
      <p>
        This capital band is neither too small to be irrelevant nor too large to require institutional backing. It is the SME
        sweet spot &mdash; enough to build a credible operation in MRO, training, inspection, fleet operations or software,
        without the balance sheet a capital-intensive OEM demands. Three forces converge to make the timing unusually
        favourable: <strong>policy tailwinds</strong> (the PLI scheme, and an expected ~₹10,000 crore Drone Shakti incentive in
        Budget 2026), <strong>regulatory maturity</strong> (simplified type certification, the DigitalSky single-window
        platform, expanded permissions), and <strong>market pull</strong> (from Operation Sindoor&apos;s defence-procurement
        urgency to Namo Drone Didi&apos;s 1,094 drones deployed with women&apos;s self-help groups). Demand is broad-based and
        accelerating at the same moment entry barriers are falling.
      </p>

      <h2 id="the-matrix">Eight segments, scored</h2>
      <p>
        The report scores eight business segments on four dimensions that actually decide an SME&apos;s fate: capital required,
        gross-margin ceiling, payback period, and SME suitability. Software leads on margin (60&ndash;85%) but is a
        technology-first game; among physical businesses, <strong>MRO, training and inspection services</strong> stand out
        &mdash; each rated &lsquo;Very High&rsquo; on SME suitability, each enterable from ₹50 lakh&ndash;₹3 crore, each paying
        back inside 12&ndash;24 months. Manufacturing and payload systems offer strategic depth but demand more capital
        (₹2&ndash;5 crore) and patience (24&ndash;48 month paybacks). The matrix below ranks the segments by margin ceiling and
        carries the capital, payback and suitability read-out alongside.
      </p>
      <SegmentMatrixFigure />

      <h2 id="where-value">Where the value actually accrues</h2>
      <p>
        The report&apos;s organising insight is that value in India&apos;s drone economy does not sit in airframe assembly.
        Assembly is crowded, capital-heavy and thin-margin &mdash; the layer where India already competes hardest and captures
        least. Value concentrates instead at the two ends of the chain: <em>upstream</em>, in components, where import
        dependence and therefore substitution opportunity are highest; and <em>downstream</em>, in the aftermarket and services
        layer &mdash; MRO, training, inspection, fleet operations and software &mdash; that rides on top of every airframe sold.
        For an SME, the services layer is the defensible position: it needs less capital, pays back faster, and does not put a
        first-time operator head-to-head with a well-funded OEM.
      </p>
      <ValueChainFigure />

      <h2 id="policy">The policy tailwinds</h2>
      <p>
        The existing Production-Linked Incentive scheme (2021&ndash;2024) carried a ₹120 crore outlay and up to 20% of value
        addition, with MSME-friendly eligibility thresholds (₹2 crore turnover for drones, ₹50 lakh for components) covering
        airframe, propulsion, batteries, flight control, communication systems, cameras, sensors and spraying systems. Budget
        2026 is expected to raise the ambition sharply: a two-tier <strong>Drone Shakti / PLI 2.0</strong> of roughly ₹10,000
        crore over five years (10&ndash;15% capex subsidy plus 10&ndash;15% output-linked), with a 50&ndash;60% domestic-content
        requirement and a 40% critical-component localisation target by FY 2027&ndash;28. Layered on the New Drone Rules 2021,
        the Drone Airspace Map and the DigitalSky platform, the policy stack materially de-risks a well-timed entry &mdash;
        which is why the 2026&ndash;2028 window matters.
      </p>

      <h2 id="by-profile">Entry points by investor profile</h2>
      <p>
        The report maps recommended entry points to investor profiles rather than prescribing one path. A
        <strong> defence-aligned SME</strong> is pointed at component manufacturing, where Operation Sindoor&apos;s urgency and
        the localisation mandate converge. An <strong>agri-tech entrepreneur</strong> is pointed at agri-spraying fleet
        operations, riding the Namo Drone Didi demand base. A <strong>technology-first founder</strong> is pointed at software
        and payload systems &mdash; the lowest capital intensity and the highest margins. A <strong>services-led operator</strong>
        is pointed at inspection services and MRO for their low entry barriers and quick payback. And a <strong>diversifying
        component manufacturer</strong> is pointed at a manufacturing-plus-MRO combination that leverages existing capability.
        Each of these has a step-by-step entry roadmap in the full report.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~172-page edition carries all thirteen chapters: the macro picture and the investment-decision framework
        (Chapters 1&ndash;3), then a dedicated deep dive for each of the eight segments (Chapters 4&ndash;11) &mdash;
        manufacturing, MRO, fleet operations, training, payload systems, software, infrastructure and inspection services &mdash;
        each with market sizing, competitive landscape, unit economics and a detailed <em>Actionable Entry Roadmap</em>. It
        closes with the full Investment Decision Matrix and risk-mitigation strategies (Chapter 12) and strategic
        recommendations for ecosystem development (Chapter 13), plus appendices covering the regulatory reference, the
        government-scheme catalogue, a directory of selected DGCA-approved RPTOs, a glossary and full sources. Twenty-six
        figures throughout, and an eight-segment scorecard designed to be used, not just read.
      </p>
    </>
  );
}
