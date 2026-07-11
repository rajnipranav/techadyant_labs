import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Industrial Water Opportunity Map".
 * Carries the thesis (regulation and hydrology, not choice, drive the market),
 * the Frost & Sullivan / Mordor sizing with attribution, where the returns sit,
 * the four decision frameworks (Policy Risk Matrix, Value Chain Economics,
 * Five Forces, Investment Heat Map) and the three named scenarios to 2030.
 * The full ~192-page edition (12 chapters, 119 tables, 46 charts, company
 * profiles, financing analysis) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { waterToc as toc, WaterContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'A market enforced, not chosen' },
  { id: 'the-numbers', label: 'The market in numbers' },
  { id: 'where-value', label: 'Where the returns actually sit' },
  { id: 'heat-map', label: 'The Investment Heat Map' },
  { id: 'regulation', label: 'Regulation as the demand engine' },
  { id: 'value-chain', label: 'Where the margin lives' },
  { id: 'geography', label: 'Four states, most of the market' },
  { id: 'scenarios', label: 'Three scenarios to 2030' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const TEAL = '#2BA6C6';
const NAVY = '#1A3557';
const BRASS = '#C9A84C';
const SLATE = '#8C9AAE';

/* Figure 1 - market trajectory 2024 to 2030 */
function TrajectoryFigure() {
  const pts = [
    { y: '2024', v: 2.87 }, { y: '2025', v: 3.11 }, { y: '2026', v: 3.37 },
    { y: '2027', v: 3.65 }, { y: '2028', v: 3.95 }, { y: '2029', v: 4.28 }, { y: '2030', v: 4.65 },
  ];
  const W = 640, H = 300, PL = 52, PB = 40, PT = 24, PR = 20;
  const max = 5, min = 0;
  const x = (i: number) => PL + (i * (W - PL - PR)) / (pts.length - 1);
  const yy = (v: number) => PT + (H - PT - PB) * (1 - (v - min) / (max - min));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${yy(p.v).toFixed(1)}`).join(' ');
  return (
    <figure style={{ margin: '1.75rem 0' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 680, background: '#fff', border: '1px solid #E3E8EF', borderRadius: 8 }} role="img" aria-label="India industrial water market USD billion, 2024 to 2030">
        {[0, 1, 2, 3, 4, 5].map((g) => (
          <g key={g}>
            <line x1={PL} x2={W - PR} y1={yy(g)} y2={yy(g)} stroke="#EDF1F6" />
            <text x={PL - 8} y={yy(g) + 4} textAnchor="end" fontSize="11" fill={SLATE}>{g}</text>
          </g>
        ))}
        <path d={line} fill="none" stroke={TEAL} strokeWidth={3} />
        {pts.map((p, i) => (
          <g key={p.y}>
            <circle cx={x(i)} cy={yy(p.v)} r={4} fill={NAVY} />
            <text x={x(i)} y={H - PB + 18} textAnchor="middle" fontSize="11" fill={SLATE}>{p.y}</text>
          </g>
        ))}
        <text x={x(0)} y={yy(2.87) - 12} textAnchor="middle" fontSize="11" fontWeight={700} fill={NAVY}>$2.87B</text>
        <text x={x(6)} y={yy(4.65) - 12} textAnchor="middle" fontSize="11" fontWeight={700} fill={NAVY}>$4.65B</text>
      </svg>
      <figcaption style={{ fontSize: '.8rem', color: SLATE, marginTop: 6 }}>
        India's industrial water and wastewater infrastructure market, USD billion, 8.3% CAGR (Frost & Sullivan, 2025).
      </figcaption>
    </figure>
  );
}

/* Figure 2 - Investment Heat Map score */
function HeatFigure() {
  const rows = [
    { k: 'Semiconductor ultrapure water', s: 87 },
    { k: 'Digital / AI water platforms', s: 77 },
    { k: 'Data-centre water systems', s: 72 },
    { k: 'O&M annuity portfolios', s: 67 },
    { k: 'ZLD with resource recovery', s: 62 },
    { k: 'Modular / containerised ZLD', s: 53 },
    { k: 'Decentralised treatment', s: 48 },
  ];
  const W = 640, rowH = 34, PL = 210, PR = 44, top = 14;
  const H = top * 2 + rows.length * rowH;
  const bw = (s: number) => ((W - PL - PR) * s) / 100;
  return (
    <figure style={{ margin: '1.75rem 0' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 680, background: '#fff', border: '1px solid #E3E8EF', borderRadius: 8 }} role="img" aria-label="Investment Heat Map segment attractiveness score">
        {rows.map((r, i) => {
          const y = top + i * rowH;
          return (
            <g key={r.k}>
              <text x={PL - 10} y={y + rowH / 2 + 4} textAnchor="end" fontSize="11.5" fill={NAVY}>{r.k}</text>
              <rect x={PL} y={y + 6} width={bw(r.s)} height={rowH - 14} rx={2} fill={i < 2 ? NAVY : i < 4 ? TEAL : SLATE} />
              <text x={PL + bw(r.s) + 6} y={y + rowH / 2 + 4} fontSize="11" fontWeight={700} fill={NAVY}>{r.s}</text>
            </g>
          );
        })}
      </svg>
      <figcaption style={{ fontSize: '.8rem', color: SLATE, marginTop: 6 }}>
        Investment Heat Map — segment attractiveness, 0–100 on growth x margin x barrier (Techadyant assessment).
      </figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p><em>India's industrial water market is not a speculative growth story. It is a systems-adaptation story enforced by hydrological constraint and regulatory mandate — and that is precisely what makes it investable.</em></p>

      <h2 id="the-thesis">A market enforced, not chosen</h2>
      <p>India holds roughly 18% of the world's population against under 4% of its freshwater, and per-capita availability has fallen from 5,177 m³ in 1951 to about 1,486 m³ today (Central Water Commission; NITI Aayog). For industry, water scarcity is no longer a sustainability footnote — it is a hard bound on every expansion plan. The decisive shift of the past two years is that policy has moved from guidance to mandate, converting compliance from a cost to avoid into non-discretionary capital expenditure.</p>

      <h2 id="the-numbers">The market in numbers</h2>
      <p>The Indian industrial water and wastewater infrastructure market is estimated at USD 2.87 billion (2024), projected to reach USD 4.65 billion by 2030 — an 8.3% CAGR (Frost &amp; Sullivan, 2025). A broader, differently-drawn market — treatment technology and equipment across the whole economy, municipal and industrial combined — runs from USD 2.73 billion (2025) to USD 4.73 billion (2031) at 9.59% (Mordor Intelligence). The two are not in conflict; they measure different boundaries.</p>
      <TrajectoryFigure />

      <h2 id="where-value">Where the returns actually sit</h2>
      <p>Headline growth hides an uneven distribution of returns. Equipment supply and EPC are competitive, working-capital-heavy and cyclical. The margin and the durable advantage sit in the annuity and knowledge layers — operations and maintenance, specialty chemicals, and digital — and in the capability-defended frontier of semiconductor-grade ultrapure water. The investable question is not who wins the construction contract, but who holds the fifteen-year service concession and the technology behind the membrane.</p>

      <h2 id="heat-map">The Investment Heat Map</h2>
      <p>Scoring each segment on growth, margin and entry barrier resolves the market into two winning archetypes: capability plays defended by know-how (semiconductor UPW, digital platforms), and annuity plays defended by installed base (O&amp;M, ZLD-with-recovery). Modular and decentralised segments grow fast but compete on cost.</p>
      <HeatFigure />

      <h2 id="regulation">Regulation as the demand engine</h2>
      <p>The bankable demand through 2028 is compliance-driven. The MoEFCC Consent Guidelines 2025 (notified, effective 30 January 2025) give state boards clear authority to cancel consent to operate on non-compliance. Maharashtra's Safe Reuse and Management of Treated Wastewater Policy 2025 (notified October 2025) requires designated bulk consumers to source 20% of demand from treated wastewater by 2027–28, rising to 50% by 2031. AMRUT 2.0 adds municipal-industrial reuse offtake. The report's Policy Risk Matrix separates these notified, funded instruments — which capital can be underwritten against — from draft proposals (the CETP clearance exemption, the revised National Water Policy) that remain optionality, not base case.</p>

      <h2 id="value-chain">Where the margin lives</h2>
      <p>A five-forces read isolates the two forces that matter most: supplier power over membranes and resins (import-dependent and concentrated) and the entry barrier in ultrapure water. Both point to the same move — secure technology and component supply through partnerships, because that is where the defensible position is won. Capability, not capital, is the binding constraint at the top of this market.</p>

      <h2 id="geography">Four states, most of the market</h2>
      <p>Maharashtra, Gujarat, Tamil Nadu and Karnataka account for roughly 69% of national spend, and enforcement strength — not incentive generosity — is what turns a cluster into a project pipeline. Karnataka and Uttar Pradesh are the fastest-growing by rate, driven by semiconductor fabs and municipal-industrial reuse respectively.</p>

      <h2 id="scenarios">Three scenarios to 2030</h2>
      <p>The market carries asymmetric risk. <strong>Water Security Revolution</strong> (9.5% CAGR, ~$4.95B) assumes full ZLD compliance by 2028 and multiple fabs online. <strong>Compliance Plateau</strong> (8.3%, $4.65B) is the base case of steady, enforcement-led adoption. <strong>Climate Shock</strong> (6.5%, ~$4.19B) models a monsoon or drought disruption compounding enforcement slippage and slower industrial CAPEX. The downside exceeds the upside — enforcement consistency is the critical variable.</p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>The full ~192-page edition carries twelve chapters, 119 tables and 46 charts: solution-tier and vertical sizing, sector deep-dives (semiconductor, pharma, chemicals, textiles, thermal power, green hydrogen, data centres), the technology landscape, verified company profiles (VA Tech Wabag, Ion Exchange, Thermax, Gradiant, CN Water), a full investment-and-financing chapter, regional opportunity mapping, and stakeholder playbooks for investors, technology providers, policymakers and industrial buyers. Every market figure is attributed to its source, and each assumption is labelled.</p>
    </>
  );
}
