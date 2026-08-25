import type { TocItem } from '../../components/ReportReader';
import Link from 'next/link';

/**
 * Online reading version of "Industrial AI in Indian Manufacturing".
 * Carries the adoption-playbook thesis, the market/tCO/ROI key numbers,
 * the six key findings, the adoption frameworks, the three policy/industry/
 * investor implications, three analytical figures, the tabulated scenarios,
 * the watch list, and the FAQ. The full 137-page edition (10 chapters, 6
 * appendices, 36 exhibits) is the paid PDF; the companion workbook is the
 * data tier.
 *
 * Registered in app/reports/[slug]/page.tsx.
 */

export const toc: TocItem[] = [
  { id: 'thesis', label: 'The thesis' },
  { id: 'key-numbers', label: 'Key numbers' },
  { id: 'key-findings', label: 'Key findings' },
  { id: 'frameworks', label: 'The frameworks' },
  { id: 'implications', label: 'What it means' },
  { id: 'figures', label: 'Analytical figures' },
  { id: 'tables', label: 'The numbers, tabulated' },
  { id: 'watch', label: 'What to watch' },
  { id: 'faq', label: 'FAQ' },
  { id: 'sources', label: 'Sources & methodology' },
  { id: 'full-report', label: 'What the full report adds' },
];

const AMBER = '#F5B544';
const TEAL = '#2BC5B4';
const BLUE = '#3b82f6';
const RED = '#ef4444';
const PURPLE = '#8b5cf6';
const SLATE = '#94a3b8';

const statVal: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 28, fontWeight: 700,
  color: AMBER, lineHeight: 1, marginBottom: 8,
};
const statLabel: React.CSSProperties = { fontSize: 14, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 };
const statSrc: React.CSSProperties = { fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, color: TEAL };

const findingCard: React.CSSProperties = {
  background: 'var(--bg-2, rgba(255,255,255,.02))', border: '1px solid var(--border, rgba(255,255,255,.12))',
  borderRadius: 12, padding: 20,
};
const findingNum: React.CSSProperties = { fontFamily: 'var(--font-jetbrains, monospace)', color: AMBER, fontWeight: 600, fontSize: 14 };
const findingSrc: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11.5, color: 'var(--text-muted)',
  marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border, rgba(255,255,255,.12))',
};

const figBox: React.CSSProperties = {
  margin: '28px 0', background: 'var(--bg-2, rgba(255,255,255,.02))',
  padding: 18, border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12,
};
const figCap: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 12, color: 'var(--text-muted)',
  marginTop: 12, textAlign: 'center', lineHeight: 1.5,
};

const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', margin: '8px 0 26px', fontSize: 14.5,
  background: 'var(--bg-2, rgba(255,255,255,.02))', border: '1px solid var(--border, rgba(255,255,255,.12))',
};
const thStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.04)', color: 'var(--text)', textAlign: 'left',
  padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(255,255,255,.12))', fontWeight: 600, fontSize: 13.5,
};
const tdStyle: React.CSSProperties = {
  padding: '9px 12px', borderBottom: '1px solid var(--border, rgba(255,255,255,.08))', color: 'var(--text-muted)',
};

const watchDate: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains, monospace)', color: AMBER, fontWeight: 600, minWidth: 78, fontSize: 14,
};

const faqBox: React.CSSProperties = {
  background: 'var(--bg-2, rgba(255,255,255,.02))', border: '1px solid var(--border, rgba(255,255,255,.12))',
  borderRadius: 10, marginBottom: 12, overflow: 'hidden',
};
const faqQ: React.CSSProperties = { padding: '16px 18px', cursor: 'pointer', fontWeight: 600, color: 'var(--text)' };
const faqA: React.CSSProperties = { padding: '0 18px 18px', color: 'var(--text-muted)', fontSize: 15.5, lineHeight: 1.7 };

/* Figure 1 — 3-year TCO breakdown donut */
function TcoDonut() {
  const ring = (dash: number, offset: number, color: string) => (
    <circle cx="200" cy="200" r="100" fill="none" stroke={color} strokeWidth="40"
      strokeDasharray={`${dash} 628.3`} strokeDashoffset={offset} transform="rotate(-90 200 200)" />
  );
  return (
    <svg viewBox="0 0 400 400" width="100%" role="img" aria-label="Total Cost of Ownership Breakdown">
      <circle cx="200" cy="200" r="100" fill="none" stroke="#1a2332" strokeWidth="40" />
      {ring(175.9, 0, BLUE)}
      {ring(144.5, -175.9, AMBER)}
      {ring(100.5, -320.4, TEAL)}
      {ring(75.4, -420.9, RED)}
      {ring(50.3, -496.3, PURPLE)}
      {ring(37.7, -546.6, '#cbd5e1')}
      {ring(44.0, -584.3, SLATE)}
      <text x="200" y="195" textAnchor="middle" fill="#f1f5f9" fontFamily="var(--font-jetbrains, monospace)" fontSize="24" fontWeight="bold">100%</text>
      <text x="200" y="220" textAnchor="middle" fill="#94a3b8" fontFamily="Inter, sans-serif" fontSize="14">3-Year TCO</text>
    </svg>
  );
}

/* Figure 2 — median payback by use case */
function PaybackChart() {
  const rows = [
    { label: 'Anomaly Detection', w: 90, x: 250, time: '~4.5m', color: TEAL },
    { label: 'Vision Quality', w: 200, x: 360, time: '~10m', color: TEAL },
    { label: 'Energy Management', w: 200, x: 360, time: '~10m', color: TEAL },
    { label: 'Predictive Maintenance', w: 240, x: 400, time: '~12m', color: BLUE },
    { label: 'Production Scheduling', w: 280, x: 440, time: '~14m', color: AMBER },
    { label: 'Digital Twins', w: 480, x: 640, time: '~24m', color: RED },
  ];
  return (
    <svg viewBox="0 0 800 400" width="100%" role="img" aria-label="Payback Period by Use Case">
      <line x1="150" y1="50" x2="150" y2="350" stroke="#1a2332" strokeWidth="2" />
      <line x1="150" y1="350" x2="750" y2="350" stroke="#1a2332" strokeWidth="2" />
      <line x1="390" y1="50" x2="390" y2="350" stroke={AMBER} strokeWidth="2" strokeDasharray="4 4" />
      <text x="390" y="40" textAnchor="middle" fill={AMBER} fontFamily="var(--font-jetbrains, monospace)" fontSize="12">12-Month Threshold</text>
      {rows.map((r, i) => {
        const y = 70 + i * 50;
        return (
          <g key={r.label}>
            <text x="140" y={y + 15} textAnchor="end" fill="#cbd5e1" fontFamily="Inter, sans-serif" fontSize="13">{r.label}</text>
            <rect x="150" y={y} width={r.w} height="20" fill={r.color} rx="2" />
            <text x={r.x} y={y + 15} fill="#f1f5f9" fontFamily="var(--font-jetbrains, monospace)" fontSize="12">{r.time}</text>
          </g>
        );
      })}
      <text x="450" y="380" textAnchor="middle" fill="#94a3b8" fontFamily="Inter, sans-serif" fontSize="12">Median Payback Period (Months)</text>
    </svg>
  );
}

/* Figure 3 — failure mode distribution */
function FailureBars() {
  const rows = [
    { label: 'Data & Instrumentation', w: 280, x: 450, pct: '28%', color: RED },
    { label: 'Strategic (Wrong Problem)', w: 220, x: 390, pct: '22%', color: AMBER },
    { label: 'Organisational & Workforce', w: 190, x: 360, pct: '19%', color: BLUE },
    { label: 'Financial (TCO Underestimated)', w: 140, x: 310, pct: '14%', color: TEAL },
    { label: 'Technology & Infrastructure', w: 90, x: 260, pct: '9%', color: PURPLE },
    { label: 'Vendor Lock-in & Instability', w: 80, x: 250, pct: '8%', color: SLATE },
  ];
  return (
    <svg viewBox="0 0 800 400" width="100%" role="img" aria-label="Failure Mode Distribution">
      {rows.map((r, i) => {
        const y = 45 + i * 50;
        return (
          <g key={r.label}>
            <text x="150" y={y + 17} textAnchor="end" fill="#cbd5e1" fontFamily="Inter, sans-serif" fontSize="14">{r.label}</text>
            <rect x="160" y={y} width={r.w} height="24" fill={r.color} rx="4" />
            <text x={r.x} y={y + 17} fill="#f1f5f9" fontFamily="var(--font-jetbrains, monospace)" fontSize="14">{r.pct}</text>
          </g>
        );
      })}
    </svg>
  );
}

const stats = [
  { v: '$4.8–6.2B', l: 'Market size by 2030', s: 'Techadyant Model ◆ IN-003' },
  { v: '70%', l: 'Value in 3 operational levers', s: 'Value Pool Analysis ◆ VP-01' },
  { v: '2.4–3.2x', l: 'TCO multiple vs software cost', s: 'Deployment Database ◆ TCO-22' },
  { v: '58%', l: 'Base-case 3-year ROI (SMEs)', s: 'Economic Model ◆ FIN-04' },
  { v: '14 mo', l: 'Median payback period', s: 'Deployment Database ◆ PB-11' },
  { v: '35–45%', l: 'Pilot scale-up failure rate', s: 'Failure Mode DB ◆ FM-09' },
];

const findings = [
  { c: 'Value is heavily concentrated. Deploying AI against peripheral use cases before securing the high-value levers results in massive underperformance.', n: '~70% of addressable value sits in downtime, yield/scrap, and energy.', s: 'Source: Techadyant Value Pool Model' },
  { c: 'Vendor proposals systematically overstate ROI by focusing only on software licenses while ignoring integration and instrumentation.', n: 'Systems integration accounts for 20–26% of 3-year TCO.', s: 'Source: TCO Waterfall Analysis' },
  { c: 'The failure modes of industrial AI are predominantly non-technical. Poor data and solving the wrong problem destroy more value than bad algorithms.', n: 'Data (28%) and Strategic (22%) failures dominate underperformance.', s: 'Source: Failure Mode Database (n=40+)' },
  { c: 'Sector selection dictates ROI multiples as much as technology selection. High-readiness sectors compound advantages rapidly.', n: 'Auto, pharma, electronics, and chemicals earn 2–3x the ROI of low-readiness sectors.', s: 'Source: Sector Attractiveness Matrix' },
  { c: 'India\u2019s ecosystem is strong at applications but structurally dependent on imports for foundational hardware, creating supply-chain risk.', n: '100% import dependency for industrial AI accelerators and advanced sensors.', s: 'Source: Capability Stack Mapping' },
  { c: 'The competitive gap between AI leaders and laggards will widen to a point where laggards face structural displacement or M&A consolidation.', n: '700+ bps EBITDA margin gap projected by 2035 in accelerated scenarios.', s: 'Source: Scenario Model 2026-2035' },
];

const scenarios = [
  ['Accelerated', '$14–18 Billion', '35–50%', '700+ bps'],
  ['Incremental', '$7–9 Billion', '15–25%', '400–500 bps'],
  ['Fragmented', '$4–6 Billion', '5–10%', '250–350 bps'],
];

const waves = [
  ['Wave 1', '0–12 Months', 'Vision Quality, PdM (Rotary), Energy, Anomaly', '10–14 Months'],
  ['Wave 2', '12–24 Months', 'Scheduling, Demand Forecasting, Inventory', '12–16 Months'],
  ['Wave 3', '24–48 Months', 'Digital Twins, Industrial Copilots, Autonomous Robotics', '18–30 Months'],
];

const sectors = [
  ['Priority (High/High)', 'Auto Components, Pharma, Electronics, Specialty Chem', 'Accelerate deployment; capture first-mover advantage.'],
  ['High Stakes (High/Low)', 'Food Processing, Textiles', 'Invest heavily in data/instrumentation foundations first.'],
  ['Ready but Small', 'Engineering Machinery, Metals', 'Targeted deployments on critical rotary equipment.'],
];

const watch = [
  ['2026–27', 'Extension of Production Linked Incentive (PLI) eligibility to cover AI instrumentation, edge compute, and systems-integration capex, rather than just primary manufacturing equipment.'],
  ['2027–28', 'Mandatory Operational Technology (OT) cybersecurity baselines for any plant deploying AI at scale, shifting cyber from an IT hygiene issue to a board-level governance mandate.'],
  ['2027', 'Publication of sector-specific AI deployment and safety standards by the Bureau of Indian Standards (BIS), creating certification frameworks for priority sectors like pharma and auto.'],
  ['2028+', 'Consolidation in the Indian industrial AI startup ecosystem, with category leaders in vision quality and warehouse robotics acquiring niche players to complete sector-specific stacks.'],
];

const faqs = [
  ['What is the ROI of industrial AI for Indian SMEs?', 'The realistic 3-year ROI range for Indian SME manufacturers is 28% to 88%, with a base-case cumulative ROI of 58% and a median payback period of 14 months for mid-sized plants deploying focused use cases like vision quality and predictive maintenance.'],
  ['How much does an industrial AI deployment actually cost?', 'Total cost of ownership (TCO) is 2.4 to 3.2 times the AI software cost. For a mid-sized Indian plant, the all-in 3-year TCO is typically ₹2.5 to ₹5 crore, with systems integration representing the largest single component at 20–26% of the total.'],
  ['Which manufacturing sectors are most ready for AI adoption?', 'Automotive components, pharmaceuticals, electronics manufacturing, and specialty chemicals are priority sectors combining high value pools with high readiness. Food processing and textiles have large value pools but require significant data-foundation investment first due to low instrumentation.'],
  ['Why do industrial AI pilots fail to scale?', '35% to 45% of pilots that attempt scale-up underperform materially. The dominant failure modes are data-related (28%), strategic (22%), and organisational (19%), proving that technology and algorithm selection are rarely the primary causes of failure.'],
  ['What is the projected market size for industrial AI in India?', 'The Indian industrial AI market is projected to grow from a 2025 baseline of $1.1–$1.3 billion to $4.8–$6.2 billion by 2030, representing a 32–38% CAGR. In an accelerated policy and capital scenario, it could reach $14–$18 billion by 2035.'],
];

export function ReportContent() {
  return (
    <>
      <p className="dropcap">
        Industrial AI in Indian manufacturing has crossed the threshold from experimentation to operational
        economics. The Indian industrial-AI market will reach $4.8–$6.2 billion by 2030 (32–38% CAGR) — yet
        roughly 70% of addressable value is concentrated in just three operational levers. This report prices
        the opportunity, quantifies the true cost of deployment, and sets out the sequence that separates the
        manufacturers who capture value from those who only buy software.
      </p>

      <h2 id="thesis"><span className="h2-no">The thesis</span>The managerial problem</h2>
      <p>
        The strategic question for Indian manufacturing in 2026 is no longer whether to deploy industrial AI,
        but where, in what sequence, and against what governance. The winners will not be the companies deploying
        the most AI; they will be those that diagnose their loss bases, invest heavily in data instrumentation,
        and deploy against high-value operational constraints using stage-gated capital allocation. Technology is
        no longer the binding constraint — managerial discipline is.
      </p>

      <h2 id="key-numbers"><span className="h2-no">Key numbers</span>Six figures that frame the market</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: 'var(--border, rgba(255,255,255,.12))', border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 12, overflow: 'hidden', margin: '22px 0' }}>
        {stats.map((s) => (
          <div key={s.l} style={{ background: 'var(--bg-2, rgba(255,255,255,.02))', padding: '22px 18px' }}>
            <div style={statVal}>{s.v}</div>
            <div style={statLabel}>{s.l}</div>
            <div style={statSrc}>{s.s}</div>
          </div>
        ))}
      </div>

      <h2 id="key-findings"><span className="h2-no">Key findings</span>Six findings that decide ROI</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, margin: '22px 0' }}>
        {findings.map((f) => (
          <div key={f.n} style={findingCard}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 10px' }}>{f.c}</p>
            <span style={findingNum}>{f.n}</span>
            <span style={findingSrc}>{f.s}</span>
          </div>
        ))}
      </div>

      <h2 id="frameworks"><span className="h2-no">The frameworks</span>How the report is organised</h2>
      <div style={{ borderLeft: `3px solid ${AMBER}`, background: 'var(--bg-2, rgba(255,255,255,.02))', borderRadius: '0 12px 12px 0', padding: '24px 26px', margin: '22px 0' }}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7 }}>
          The report introduces the <strong>Industrial AI Adoption Architecture</strong> — a 10-stage sequence
          sitting above strategy/capital and data/governance layers that treats deployment as a system rather
          than a linear checklist. This is operationalised through the <strong>Use-Case Prioritisation Matrix</strong>,
          which separates deploy-now candidates (sub-12-month payback) from prepare-for-deployment use cases, and
          the <strong>Sector Attractiveness × Readiness Matrix</strong>, which maps where capital should concentrate
          based on loss-base intensity and data maturity.
        </p>
      </div>

      <h2 id="implications"><span className="h2-no">What it means</span>Policy, industry, investors</h2>
      <h3>For policymakers</h3>
      <p>
        Current subsidies focus on capex, but the binding constraints are integration and capability costs. Policy
        must extend PLI eligibility to AI instrumentation and mandate OT cybersecurity baselines by 2027–2028 to
        prevent systemic exposure as attack surfaces expand.
      </p>
      <h3>For industry</h3>
      <p>
        Manufacturers must invert the adoption sequence: diagnose loss bases and instrument data layers before
        selecting AI vendors. Integration must be treated as a core internal capability, not a residual outsourced
        to system integrators, to avoid vendor dependency.
      </p>
      <h3>For investors</h3>
      <p>
        Capital should concentrate on vertical application ISVs and specialist SIs with deep sector expertise in
        priority sectors. Horizontal AI platforms are constrained by global hyperscalers, while edge compute and
        industrial cybersecurity represent under-funded white-space opportunities.
      </p>

      <h2 id="figures"><span className="h2-no">Analytical figures</span>Three charts that reframe deployment</h2>
      <p>
        Vendor proposals routinely present AI software licensing as the primary investment, obscuring the reality
        of deployment economics. Across 30+ Indian SME deployments, hardware, integration and ongoing opex dominate
        the 3-year total cost of ownership.
      </p>
      <figure style={figBox}>
        <TcoDonut />
        <figcaption style={figCap}>Figure 1: 3-Year TCO Breakdown — Software (blue, 28%), Integration (amber, 23%), Sensors (teal, 16%), Edge (red, 12%), Cyber (purple, 8%), Training (grey, 6%), Opex (muted, 7%). Source: Techadyant Cost Model.</figcaption>
      </figure>
      <p>
        The economics of industrial AI are highly sensitive to time-to-value. Use cases crossing the 12-month
        payback threshold require mature data foundations and deep process integration — unsuitable for first-wave
        deployments. Sequence use cases strictly by payback.
      </p>
      <figure style={figBox}>
        <PaybackChart />
        <figcaption style={figCap}>Figure 2: Median Payback Period by Use Case. The 12-month threshold separates deploy-now candidates from prepare-for-deployment use cases. Source: Techadyant Deployment Database.</figcaption>
      </figure>
      <p>
        When industrial AI deployments fail, the root cause is rarely the algorithm. Analysis of 40+ underperforming
        deployments reveals that data-instrumentation gaps and strategic misalignment account for half of all
        failures — the case for a loss-base diagnostic before vendor engagement.
      </p>
      <figure style={figBox}>
        <FailureBars />
        <figcaption style={figCap}>Figure 3: Root Causes of Scale-Up Underperformance (n=40+). Technology accounts for less than 10% of failures. Source: Techadyant Failure Tree.</figcaption>
      </figure>
      <p>
        For continuous tracking of the policy shifts affecting these economics, see the{' '}
        <Link href="/signals/">Signals feed</Link>. For sector-level baselines, explore the{' '}
        <Link href="/research/">Indian Manufacturing Atlas</Link>.
      </p>

      <h2 id="tables"><span className="h2-no">The numbers, tabulated</span>Scenarios, waves, sectors</h2>
      <h3>Scenario projections (2035)</h3>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>Scenario</th><th style={thStyle}>Market size (2035)</th><th style={thStyle}>SME adoption (at scale)</th><th style={thStyle}>EBITDA margin gap</th></tr></thead>
        <tbody>
          {scenarios.map((r) => (
            <tr key={r[0]}>{r.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <h3>Use-case wave sequencing</h3>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>Wave</th><th style={thStyle}>Timeframe</th><th style={thStyle}>Primary use cases</th><th style={thStyle}>Avg. payback</th></tr></thead>
        <tbody>
          {waves.map((r) => (
            <tr key={r[0]}>{r.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <h3>Sector attractiveness & readiness</h3>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>Classification</th><th style={thStyle}>Sectors</th><th style={thStyle}>Strategic posture</th></tr></thead>
        <tbody>
          {sectors.map((r) => (
            <tr key={r[0]}>{r.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>

      <h2 id="watch"><span className="h2-no">What to watch</span>Four signals to track</h2>
      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '20px 0' }}>
        {watch.map((w) => (
          <li key={w[0]} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border, rgba(255,255,255,.12))' }}>
            <span style={watchDate}>{w[0]}</span>
            <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }}>{w[1]}</span>
          </li>
        ))}
      </ul>

      <h2 id="faq"><span className="h2-no">FAQ</span>Common questions</h2>
      {faqs.map((f) => (
        <details key={f[0]} style={faqBox}>
          <summary style={faqQ}>{f[0]}</summary>
          <div style={faqA}>{f[1]}</div>
        </details>
      ))}

      <h2 id="sources"><span className="h2-no">Sources & methodology</span>How this was built</h2>
      <p>
        This report synthesises primary deployment observation, structured dialogue with 80+ practitioners, and
        meta-analysis of public datasets. Core data sources include:
      </p>
      <ol>
        <li>Techadyant Labs internal deployment and failure-mode database (2022–2025).</li>
        <li>Ministry of Electronics and Information Technology (MeitY) — IndiaAI Mission documentation.</li>
        <li>Ministry of MSME &amp; DPIIT — Udyam registration data and PLI scheme progress reports.</li>
        <li>Reserve Bank of India (RBI) — Industrial Outlook Surveys (2024–25).</li>
        <li>FICCI Manufacturing Surveys (2024–25) on operational constraints.</li>
        <li>Bureau of Energy Efficiency (BEE) — PAT scheme energy intensity data.</li>
      </ol>
      <p>
        See the full <Link href="/methodology/">Methodology</Link> page for estimation categories and variance
        margins. Browse the <Link href="/reports/">Reports archive</Link> for related industrial intelligence.
      </p>

      <h2 id="full-report"><span className="h2-no">What the full report adds</span>Beyond this summary</h2>
      <p>
        This page is the condensed reading version. The full 137-page edition adds ten chapters and six appendices:
        the complete adoption architecture with the 10-stage sequence, the full value-pool and TCO models with all
        36 exhibits, sector-by-sector readiness scoring, a company and startup database, the policy tracker, and a
        three-scenario forecast through 2035.
      </p>
      <p>
        The companion <strong>data workbook</strong> — available with the data tier — carries the parameterised
        financial models, the master datasets and the forecast assumptions behind every number above.
      </p>
      <p>
        Use the access panel above to download the free condensed preview, or unlock the full edition and workbook.
      </p>
    </>
  );
}
