import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The Hydrogen Mirage or Machine?" (India green-hydrogen industrial reality).
 * Carries the molecule-vs-machine thesis, the six supply-side vulnerabilities, the LCOH economics,
 * the SIGHT money, and the three 2035 scenarios. The full ~133-page edition (18 chapters, appendices,
 * ~24 figures) is the paid PDF; a companion data workbook is the data tier.
 *
 * Registered in app/reports/[slug]/page.tsx as { greenH2Toc as toc, GreenH2Content as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The molecule and the machine' },
  { id: 'the-money', label: 'The money: NGHM and SIGHT' },
  { id: 'the-machine', label: 'Six vulnerabilities in the machine' },
  { id: 'economics', label: 'When does green hydrogen cross parity?' },
  { id: 'scenarios', label: 'Mirage, Muddle or Machine?' },
  { id: 'what-to-do', label: 'Four supply-side interventions' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const GREEN = '#3DD68C';
const TEAL = '#2BC5B4';
const SLATE = '#8C9AAE';
const CRIMSON = '#C8443B';
const BRASS = '#C9A84C';

/* Figure 1 - the six supply-side vulnerabilities (India dependency, 0-5 exposure) */
function VulnFigure() {
  const rows = [
    { n: 'Electrolyser manufacturing', v: 4.0, note: '<1 GW effective vs China ~45 GW' },
    { n: 'Catalysts (iridium, platinum)', v: 4.8, note: 'India produces zero' },
    { n: 'Membranes (PFSA / Nafion)', v: 4.6, note: 'IP in 3 Western firms' },
    { n: 'Critical materials', v: 4.4, note: '0–3% processing share' },
    { n: 'Capital cost (LCOH)', v: 3.2, note: '₹350/kg, 2.3× grey' },
    { n: 'Demand aggregation', v: 3.6, note: 'mandates not yet live' },
  ];
  return (
    <figure className="report-figure" id="fig-vuln">
      <div className="fig-frame">
        <svg viewBox="0 0 720 268" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Six supply-side vulnerabilities in India's green-hydrogen machine">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Six vulnerabilities in the machine — India exposure (0–5)</text>
          {rows.map((r, i) => {
            const y = 40 + i * 36; const w = Math.round((r.v / 5) * 250);
            const c = r.v >= 4.4 ? CRIMSON : r.v >= 3.8 ? BRASS : TEAL;
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="12" fontWeight="600">{r.n}</text>
                <rect x="250" y={y} width={w} height="17" rx="3" fill={c} />
                <text x="512" y={y + 14} fill={SLATE} fontSize="10.5">{r.note}</text>
              </g>
            );
          })}
          <text x="16" y="262" fill={SLATE} fontSize="10.5">Techadyant Labs assessment. The molecule has a programme; the machine does not.</text>
        </svg>
      </div>
      <figcaption>The deepest exposure is in catalysts, membranes and critical materials — the layers of the electrolyser India does not own.</figcaption>
    </figure>
  );
}

/* Figure 2 - three 2035 scenarios (green-H2 output vs the 5 MMT target) */
function ScenarioFigure() {
  const rows = [
    { n: 'Machine (recommended)', p: 25, mmt: 5.5, c: TEAL },
    { n: 'Muddle (base case)', p: 55, mmt: 3.5, c: BRASS },
    { n: 'Mirage', p: 20, mmt: 1.2, c: CRIMSON },
  ];
  const max = 6;
  return (
    <figure className="report-figure" id="fig-scenario">
      <div className="fig-frame">
        <svg viewBox="0 0 720 210" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Three 2035 scenarios for India green hydrogen output vs the 5 MMT target">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">2035 scenarios — green-H2 output (MMT) vs the 5 MMT target</text>
          {/* target line */}
          <line x1={210 + Math.round((5 / max) * 400)} y1="34" x2={210 + Math.round((5 / max) * 400)} y2="176" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={210 + Math.round((5 / max) * 400) + 4} y="46" fill={SLATE} fontSize="10.5">5 MMT target</text>
          {rows.map((r, i) => {
            const y = 52 + i * 42; const w = Math.round((r.mmt / max) * 400);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="12.5" fontWeight="600">{r.n}</text>
                <rect x="210" y={y} width={w} height="18" rx="3" fill={r.c} />
                <text x={210 + w + 6} y={y + 14} fill="#0B1D33" fontSize="12" fontWeight="700">{r.mmt} MMT · {r.p}%</text>
              </g>
            );
          })}
          <text x="16" y="202" fill={SLATE} fontSize="10.5">Probabilities sum to 100%. Only the Machine scenario reaches the target on time.</text>
        </svg>
      </div>
      <figcaption>The base case misses the 2030 target by ~30%; only the Machine scenario — contingent on four interventions by 2027 — hits it.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">The molecule and the machine</h2>
      <p>
        Green hydrogen has moved, in thirty months, from the margins of Indian energy policy to its centre. But there is a
        distinction at the heart of the programme that policy has not yet reckoned with: <em>green hydrogen is a molecule; the
        electrolyser is the machine that makes it.</em> India has built a credible programme around the molecule — targets,
        mission money, offtake ambition. It has not, as yet, built a credible programme around the machine. That gap — in
        electrolyser manufacturing, catalysts, membranes and critical materials — is what decides whether India makes the
        molecule at home or imports the machine that makes it.
      </p>

      <h2 id="the-money">The money: NGHM and SIGHT</h2>
      <p>
        The National Green Hydrogen Mission, notified in January 2023, committed ₹19,744 crore to a single decade-long
        programme. Its operational core, the SIGHT scheme, is ₹17,490 crore — of which roughly ₹4,440 crore incentivises
        electrolyser <em>manufacturing</em> (Component I) and about ₹13,050 crore incentivises green-hydrogen
        <em> production</em> (Component II), alongside ₹1,466 crore for pilots and ₹400 crore for R&amp;D. The targets are a
        5 MMT green-hydrogen production and ~60 GW of electrolysers by 2030. On paper, India is doing what every major economy
        is doing — only more aggressively, with a tighter target and a smaller public outlay.
      </p>

      <h2 id="the-machine">Six vulnerabilities in the machine</h2>
      <p>
        The complication is on the supply side. Six interlocking vulnerabilities define the gap. India's effective electrolyser
        output is under 1 GW against China's ~45 GW (China holds ~60% of global manufacturing capacity). PEM electrolysers
        need iridium and platinum, of which India produces zero — global iridium supply is only ~7 tonnes a year, ~85%
        South-African by-product. The standard PFSA membrane (Nafion) has its IP concentrated in three Western firms. Beyond
        the platinum-group metals, India processes titanium sponge, zirconium, scandium and rare earths at 0–3%. Capital cost
        (LCOH ~₹350/kg, 2.3× grey) and an un-operationalised demand-aggregation mechanism complete the six.
      </p>
      <VulnFigure />

      <h2 id="economics">When does green hydrogen cross parity?</h2>
      <p>
        India's 2025 LCOH for green hydrogen is roughly ₹350 per kilogram — about 2.3× grey hydrogen. The MNRE 2030 target of
        ₹170/kg requires three things to move together: capex falling from ~USD 700/kW to ~USD 250/kW, capacity factors rising
        from 50% to 70%, and electricity prices falling from ₹6 to ₹3.5 per kWh. Electricity is 56% of LCOH; capex amortisation
        is 17%. All three are achievable — but only with the SIGHT production incentive and, critically, mandate-led offtake
        that makes projects bankable. Without mandates, manufacturers cannot secure contracts, and without contracts they
        cannot reach final investment decision.
      </p>

      <h2 id="scenarios">Mirage, Muddle or Machine?</h2>
      <p>
        The report models three 2035 scenarios. The base case — <strong>Muddle</strong> (55% probability) — reaches ~3.5 MMT
        by 2030, about 30% below target, with 55–65% stack-import dependency. The upside — <strong>Machine</strong> (25%),
        contingent on four supply-side interventions executed by 2027 — reaches ~5.5 MMT, 30–40% import dependency, and could
        make India a net exporter of green ammonia. The downside — <strong>Mirage</strong> (20%) — reaches ~1.2 MMT and locks
        India into grey hydrogen and imports. Only the Machine scenario hits the 5 MMT target on time.
      </p>
      <ScenarioFigure />

      <h2 id="what-to-do">Four supply-side interventions</h2>
      <p>
        The resolution is not to abandon the molecule but to build the machine, in the next twenty-four months. The report
        sets out four interventions the current policy under-emphasises: a <strong>Critical Materials Reserve</strong> (12
        months of electrolyser-industry consumption of platinum, iridium, ruthenium, titanium sponge, zirconium and rare
        earths); a <strong>Catalyst R&amp;D programme</strong> (three national catalyst centres to cut PGM loading and reach a
        PGM-free cell); a <strong>domestic value-addition mandate</strong> (tightening SIGHT eligibility from final assembly to
        stack components); and <strong>demand-side mandates</strong> (green-hydrogen blending for refineries and fertiliser,
        H2-DRI for steel) that convert policy aspiration into bankable offtake.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~133-page edition carries all eighteen chapters: the NGHM policy architecture; the anatomy of the electrolyser;
        catalysts and critical materials; India's manufacturing reality; the China vector; LCOH economics; the demand-side
        architecture across refining, steel, fertiliser and mobility; the SIGHT programme; the strategic control points; supply-
        chain and geopolitical risk; the investment landscape; a 2025–2035 technology roadmap; international benchmarking; the
        three scenarios; and stakeholder-by-stakeholder recommendations. Fifty-plus data tables, ~24 figures, fifteen
        appendices (company/startup/policy/funding databases and directories), a confidence-rating rubric, and a companion
        29-sheet data workbook available with the data tier.
      </p>
    </>
  );
}
