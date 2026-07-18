import type { TocItem } from '../../components/ReportReader';

/**
 * Free online reading version of "Securing India's Industrial Future — A Strategic
 * Roadmap for Critical Minerals and Materials Dependency (2026–2035)". This is a free
 * report: the complete 174-page PDF is rendered inline on the report page beneath this
 * summary. This reading version states the thesis, teaches the vulnerability framework,
 * works the midstream finding, and previews the three-phase roadmap.
 */
export const toc: TocItem[] = [
  { id: 'the-reframe', label: 'Access is not capability' },
  { id: 'vulnerability-matrix', label: 'The Critical Mineral Vulnerability Matrix' },
  { id: 'midstream-gap', label: 'The midstream bottleneck' },
  { id: 'downstream-demand', label: 'Who is pulling the demand' },
  { id: 'policy-architecture', label: 'The policy architecture' },
  { id: 'circular-economy', label: 'The circular-economy layer' },
  { id: 'roadmap', label: 'A three-phase roadmap to 2035' },
  { id: 'in-the-full-report', label: 'What the full report covers' },
];

const BRASS = '#F5B544';
const TEAL = '#38e1c4';
const CRIMSON = '#e2725b';
const INK = '#9898A8';

/* ── Figure 1 — The midstream gap ── */
function MidstreamFigure() {
  const rows = [
    { stage: 'Mining / extraction', share: 69, india: 'Moderate', c: BRASS },
    { stage: 'Separation', share: 90, india: 'Near-zero', c: CRIMSON },
    { stage: 'Refining & alloy conversion', share: 85, india: 'Minimal', c: CRIMSON },
    { stage: 'Magnets (NdFeB)', share: 90, india: 'Nascent', c: BRASS },
  ];
  const x0 = 250, w = 360;
  return (
    <figure className="report-figure" id="fig-midstream">
      <div className="fig-frame">
        <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="China's share of the critical-minerals value chain versus India's capability, by stage">
          <text x="24" y="34" fill="#e9e7e0" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">Where the dependency actually sits</text>
          <text x="24" y="56" fill={INK} fontSize="12.5" fontFamily="Inter, sans-serif">China's estimated share of global capacity, by value-chain stage</text>
          {rows.map((r, i) => {
            const y = 92 + i * 48;
            return (
              <g key={r.stage}>
                <text x="24" y={y + 4} fill="#d6d4cc" fontSize="12.5" fontFamily="Inter, sans-serif">{r.stage}</text>
                <rect x={x0} y={y - 11} width={w} height="16" rx="3" fill="#20222e" />
                <rect x={x0} y={y - 11} width={(w * r.share) / 100} height="16" rx="3" fill={r.c} />
                <text x={x0 + (w * r.share) / 100 + 8} y={y + 2} fill="#e9e7e0" fontSize="12" fontWeight="600" fontFamily="JetBrains Mono, monospace">~{r.share}%</text>
                <text x={x0 + w + 60} y={y + 2} fill={r.c} fontSize="11.5" fontFamily="Inter, sans-serif">India: {r.india}</text>
              </g>
            );
          })}
          <text x="24" y="284" fill={INK} fontSize="11" fontFamily="Inter, sans-serif">Source: Techadyant Labs, Critical Mineral Vulnerability Matrix. Shares are indicative ranges triangulated from public data.</text>
        </svg>
      </div>
      <figcaption>Figure 1 — The dependency deepens downstream. India secures access at the mine, but separation, refining and magnet-making — where the value and the veto sit — are almost entirely offshore.</figcaption>
    </figure>
  );
}

/* ── Figure 2 — Three-phase roadmap ── */
function RoadmapFigure() {
  const phases = [
    { yrs: '2026–2028', name: 'Foundation', body: 'Policy & fiscal architecture; exploration; secure feedstock; pilot recycling', c: CRIMSON },
    { yrs: '2029–2031', name: 'Build-out', body: 'Midstream processing & refining capacity; magnet lines; rare-earth corridors', c: BRASS },
    { yrs: '2032–2035', name: 'Integration', body: 'Downstream integration; circular supply; selective export capability', c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-roadmap">
      <div className="fig-frame">
        <svg viewBox="0 0 780 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's three-phase critical-minerals roadmap to 2035">
          <text x="24" y="34" fill="#e9e7e0" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">The roadmap to 2035, in three phases</text>
          <line x1="40" y1="120" x2="740" y2="120" stroke="#2a2c38" strokeWidth="2" />
          {phases.map((p, i) => {
            const x = 60 + i * 240;
            return (
              <g key={p.name}>
                <circle cx={x} cy="120" r="9" fill={p.c} />
                <text x={x} y="86" fill={p.c} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">{p.yrs}</text>
                <text x={x} y="150" fill="#e9e7e0" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">{p.name}</text>
                <foreignObject x={x - 14} y="162" width="210" height="72">
                  <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: '#b6b4ac', font: '12px Inter, sans-serif', lineHeight: 1.35 }}>{p.body}</div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption>Figure 2 — Sequence matters. Processing capacity built before secure feedstock, or downstream integration before processing, is how mineral strategies stall.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="report-lede">
        India has spent the past two years securing access to critical minerals — overseas
        acquisitions, exploration blocks, bilateral partnerships. It has spent far less
        building the capability to <em>process</em> them. This report separates the two,
        and argues that mineral security without processing capability is a strategy that
        stops one step short of where the value and the leverage actually sit.
      </p>

      <h2 id="the-reframe">Access is not capability</h2>
      <p>
        The headline story of India&rsquo;s critical-minerals push is about reserves and
        supply deals. The more important story is about the middle of the value chain. A
        tonne of mined ore is worth a fraction of the refined metal, and a fraction again
        of the finished magnet or battery material. That value migrates downstream — and
        so does the dependency. China controls an estimated 60&ndash;90% of the world&rsquo;s
        midstream separation, refining and magnet-making capacity. Securing a mine abroad
        does little for sovereignty if the material still has to travel through a single
        country to become usable.
      </p>

      <h2 id="vulnerability-matrix">The Critical Mineral Vulnerability Matrix</h2>
      <p>
        The report scores India&rsquo;s exposure with a multi-dimensional
        <strong> Critical Mineral Vulnerability Matrix</strong> — combining import
        dependence, supplier concentration, strategic-sector demand and substitutability
        into a single read per mineral. The point of the matrix is prioritisation: not
        every mineral is equally urgent, and not every vulnerability is best solved by
        mining. It sorts minerals into those that need domestic processing first, those
        that need secure supply agreements, and those where recycling or substitution is
        the faster route.
      </p>

      <h2 id="midstream-gap">The midstream bottleneck</h2>
      <p>
        This is the core finding. India&rsquo;s weakness is not at the mine and not at the
        factory — it is in the middle, in separation, refining and alloy conversion. That
        is where China&rsquo;s share is highest and India&rsquo;s capability lowest, and it
        is precisely the layer that turns a raw mineral into something an EV, a wind
        turbine or a guided weapon can use.
      </p>
      <MidstreamFigure />
      <p>
        The strategic implication follows directly: capital and policy attention should
        concentrate on the midstream, because that is the chokepoint that converts mineral
        access into industrial capability — and the layer a rival can most easily use as
        leverage.
      </p>

      <h2 id="downstream-demand">Who is pulling the demand</h2>
      <p>
        Three sectors are driving India&rsquo;s critical-minerals demand, and each is
        accelerating. Electric-vehicle retail penetration crossed 11% in mid-2026;
        renewable capacity reached roughly 150 GW of solar and 56 GW of wind; and the
        FY2026&ndash;27 defence budget rose to &#8377;7.85 lakh crore. All three pull hard
        on lithium, cobalt, nickel and rare earths that India largely imports — which is
        why the processing gap is not an abstract risk but a live constraint on the
        sectors India most wants to grow.
      </p>

      <h2 id="policy-architecture">The policy architecture</h2>
      <p>
        India has begun to respond. The <strong>National Critical Mineral Mission</strong>,
        approved in January 2025, carries a &#8377;16,300 crore outlay plus an expected
        ~&#8377;18,000 crore of PSU and other investment, spanning exploration, overseas
        acquisition, processing and recycling. The <strong>&#8377;1,500 crore Critical
        Mineral Recycling Incentive Scheme</strong> (September 2025) adds a secondary-supply
        leg, and rare-earth magnet incentives target the single most exposed material. The
        report reads these commitments against the scale of the gap — and is candid that
        the announced outlays are a start, not a solution, for a midstream that must be
        built almost from zero.
      </p>

      <h2 id="circular-economy">The circular-economy layer</h2>
      <p>
        Recycling is not a footnote here — it is a strategic supply source. Urban mining of
        e-waste and end-of-life batteries can supply refined material without the geopolitics
        of primary mining, and it plays to an existing Indian informal-sector strength that
        formalisation could scale. The report treats secondary supply as a first-class part
        of the roadmap, not an afterthought.
      </p>

      <h2 id="roadmap">A three-phase roadmap to 2035</h2>
      <p>
        The report closes with a sequenced plan. The sequence is the point: processing
        capacity built before feedstock is secured, or downstream integration attempted
        before processing exists, is how mineral strategies stall.
      </p>
      <RoadmapFigure />

      <h2 id="in-the-full-report">What the full report covers</h2>
      <p>
        The complete 169-page edition — rendered in full below — carries the geopolitical
        concentration analysis, the full Critical Mineral Vulnerability Matrix scored
        mineral by mineral, the upstream exploration and rare-earth-corridor chapters, the
        midstream capex-and-returns modelling, the downstream EV / defence / net-zero demand
        chapters, the circular-economy build-out, the fiscal and regulatory architecture,
        and the three-phase strategic roadmap — 16 figures, 29 tables, a glossary and a
        companion data workbook. It is free to read and download.
      </p>
    </>
  );
}
