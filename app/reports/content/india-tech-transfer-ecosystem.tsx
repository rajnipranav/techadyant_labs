import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Industrial Technology Transfer Ecosystem" (2026 Edition).
 * Carries the thesis (India's public R&D apparatus is world-scale but converts poorly - DRDO
 * ~1.1% project-to-product, DPSUs 1.4% R&D intensity, IITs ~7.7% patent-to-spin-off), the
 * structural causes (no Bayh-Dole-equivalent law, under-built TLOs, TRL 7-9 valley of death),
 * what already works (8x capital growth, 40+ spin-offs, defence exports), the five-pillar
 * reform agenda and the three scenarios (5% / 12% / 22% of global deep-tech output). The full
 * 129-page edition (17 chapters, 8 sectoral deep-dives, 26 figures, 25 tables) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { ttToc as toc, TechTransferContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-inflection-point', label: "A world-scale R&D state that doesn't convert" },
  { id: 'the-conversion-gap', label: 'The conversion gap: 1.1%, 1.4% and 7.7%' },
  { id: 'where-the-value-leaks', label: 'Where the value leaks: patents, TLOs, no Bayh-Dole' },
  { id: 'what-already-works', label: 'What already works: capital, spin-offs, exports' },
  { id: 'control-points-and-dependencies', label: 'Control points: India owns output, not inputs' },
  { id: 'the-five-pillar-agenda', label: 'The five-pillar reform agenda (2026-2028)' },
  { id: 'the-three-scenarios', label: 'Three scenarios: 5%, 12% or 22% of global deep-tech' },
  { id: 'the-12-recommendations', label: 'The twelve recommendations in brief' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const STEEL = '#5B8DB8';
const NAVY = '#0B2545';
const AMBER = '#E89E1B';
const SLATE = '#8C9AAE';
const CRIMSON = '#C0392B';

/* Figure 1 - GERD/GDP 2023: India vs benchmarks (report Fig 1) */
function RdBenchmarkFigure() {
  const rows = [
    { n: 'Israel', v: 5.44 },
    { n: 'South Korea', v: 4.93 },
    { n: 'USA', v: 3.46 },
    { n: 'Japan', v: 3.27 },
    { n: 'Germany', v: 3.13 },
    { n: 'OECD average', v: 2.73 },
    { n: 'China', v: 2.65 },
    { n: 'India (2023)', v: 0.65 },
  ];
  const W = 560;
  const x = (v: number) => Math.round((v / 6) * W);
  return (
    <figure className="report-figure" id="fig-rd-benchmark">
      <div className="fig-frame">
        <svg viewBox="0 0 720 252" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Gross R&D expenditure as a share of GDP, 2023: Israel 5.44, South Korea 4.93, USA 3.46, Japan 3.27, Germany 3.13, OECD average 2.73, China 2.65, India 0.65">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">GERD as % of GDP (2023): India lags every benchmark by 4-8x</text>
          {rows.map((r, i) => {
            const y = 38 + i * 24;
            const isIndia = r.n.startsWith('India');
            const isOecd = r.n === 'OECD average';
            return (
              <g key={r.n}>
                <text x="16" y={y + 13} fill="#0B1D33" fontSize="11.5" fontWeight="600">{r.n}</text>
                <rect x="180" y={y} width={x(r.v)} height="15" rx="3"
                      fill={isIndia ? AMBER : isOecd ? SLATE : STEEL} />
                <text x={180 + x(r.v) + 6} y={y + 12} fill={isIndia ? '#B45309' : NAVY} fontSize="11.5" fontWeight="700">{r.v}%</text>
              </g>
            );
          })}
          <text x="704" y="22" fill={SLATE} fontSize="10.5" textAnchor="end">UNESCO UIS / OECD MSTI 2024 / DST</text>
        </svg>
      </div>
      <figcaption>
        India's R&D intensity of 0.65% of GDP (2023) is roughly one-fifth the OECD average (2.73%), one-eighth
        Israel's (5.44%) and about one-quarter China's (2.65%). The report models that even doubling it to ~1.3%
        would require roughly $50 billion (PPP) of incremental annual investment.
      </figcaption>
    </figure>
  );
}

/* Figure 2 - The five pillars of India's tech transfer (report Table 1 / Fig 25) */
function PillarsFigure() {
  const rows = [
    { p: 'DRDO', c: '5,000 scientists', b: '₹13,500 Cr', g: '~1.1% project-to-product', hi: true },
    { p: 'CSIR', c: '4,000 scientists', b: '₹4,400 Cr', g: '₹215 Cr licensing (<0.5% of budget)', hi: true },
    { p: 'IITs (23)', c: '10,500 faculty', b: '₹11,000 Cr', g: '7.7% patent-to-spin-off', hi: true },
    { p: 'IISc', c: '500 faculty', b: '₹1,200 Cr', g: 'Limited TLO scale', hi: false },
    { p: 'DPSUs (9)', c: '65,000 staff', b: '₹65,000 Cr revenue', g: '1.4% R&D intensity', hi: true },
  ];
  return (
    <figure className="report-figure" id="fig-pillars">
      <div className="fig-frame">
        <svg viewBox="0 0 720 178" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India's five tech-transfer pillars with headcount, annual budget and primary gap: DRDO, CSIR, 23 IITs, IISc and nine defence PSUs">
          <text x="16" y="18" fill="#0B1D33" fontSize="15" fontWeight="700">The five pillars: scale vs structural gap</text>
          {[
            { t: 'Pillar', x: 16 },
            { t: 'Headcount', x: 250 },
            { t: 'Budget', x: 400 },
            { t: 'Primary gap', x: 520 },
          ].map((h) => (
            <text key={h.t} x={h.x + 2} y={38} fill={SLATE} fontSize="10.5" fontWeight="700">{h.t}</text>
          ))}
          {rows.map((r, i) => {
            const y = 48 + i * 24;
            return (
              <g key={r.p}>
                <rect x="12" y={y - 12} width="696" height="20" rx="4"
                      fill={i % 2 ? 'rgba(91,141,184,.08)' : 'transparent'} />
                <text x="18" y={y + 1} fill={NAVY} fontSize="12" fontWeight="700">{r.p}</text>
                <text x="252" y={y + 1} fill="#0B1D33" fontSize="11">{r.c}</text>
                <text x="402" y={y + 1} fill="#0B1D33" fontSize="11">{r.b}</text>
                <text x="522" y={y + 1} fill={r.hi ? '#B45309' : SLATE} fontSize="11" fontWeight="600">{r.g}</text>
              </g>
            );
          })}
          <text x="704" y="170" fill={SLATE} fontSize="10.5" textAnchor="end">DRDO / CSIR / IIT / IISc / DPSU annual reports 2023-24</text>
        </svg>
      </div>
      <figcaption>
        Every pillar combines genuine scale with a structural conversion gap - and no single institutional reform
        fixes any of them. Source: Techadyant Labs synthesis of DRDO, CSIR, IIT, IISc and DPSU annual reports 2023-24.
      </figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-inflection-point">A world-scale R&amp;D state that doesn't convert</h2>
      <p>
        India has built, over seven decades, one of the developing world's largest publicly-funded research
        apparatuses: <strong>52 DRDO laboratories across seven cluster verticals</strong> (~5,000 scientists and 25,000
        total personnel), <strong>37 CSIR laboratories</strong>, <strong>23 Indian Institutes of Technology</strong>,
        the Indian Institute of Science (est. 1909), <strong>nine Defence PSUs</strong> (HAL, BEL, BDL, BEML, MDL, GSL,
        HSL, Midhani and the corporatised Yantra India) that generated roughly ₹65,000 crore in combined revenue in FY
        2023, and dozens of specialised institutes. Yet this report's central finding is that the conversion of that
        research capacity into commercial products, defensible IP and globally competitive companies remains
        structurally constrained - and the constraint is measurable in three ratios: R&amp;D intensity, lab-to-product
        conversion and patent-to-spin-off conversion.
      </p>
      <RdBenchmarkFigure />
      <p>
        The most permissive strategic context in a generation surrounds the problem: the China+1 supply-chain
        realignment, Western demand for a democratic manufacturing counterweight, defence exports crossing
        <strong>₹21,000 crore in FY 2024 (a thirty-fold rise from FY 2016)</strong>, Chandrayaan-3 and the commercial
        opening of space, and the Atmanirbhar Bharat programme. Sixty percent of India's impactful tech-transfer
        legislation has been enacted in the past decade. The gap is therefore not one of intent or policy volume - it
        is one of conversion mechanics.
      </p>

      <h2 id="the-conversion-gap">The conversion gap: 1.1%, 1.4% and 7.7%</h2>
      <p>
        Three headline ratios define the structural gap. First, DRDO's project-to-product conversion is estimated at
        approximately <strong>1.1%</strong> - a cumulative-statistical proxy (since 1958), not a tracked-cohort rate:
        of every 100 sanctioned projects, roughly one reaches operational service. The figure overstates the true gap
        because many sanctioned projects are exploratory and were never intended for production - but the directional
        finding holds, and DRDO's low conversion is the single largest source of value leakage in the Indian system.
        Second, the defence PSUs invest about <strong>1.4% of revenue in R&amp;D</strong> against a global defence
        industry benchmark of 5-8%, leaving them system integrators rather than product innovators. Third, the IIT
        system converts roughly <strong>7-8% of patents filed into spin-offs</strong> (7.7% in the report's scorecard)
        - well below the double-digit conversion of leading US technology-transfer offices, despite producing roughly
        five times more research papers than a single top-10 US university.
      </p>
      <PillarsFigure />
      <p>
        CSIR tells the same story in financial terms: licensing revenue of approximately ₹215 crore in FY 2024 is less
        than 0.5% of its annual budget. The causes of leakage are consistent across pillars: insufficient attention to
        TRL 7-9 transition, no dedicated funding for the prototype-to-production "valley of death", integration
        friction with DPSU production capacity, and limited transfer-of-technology economics that would attract private
        industry.
      </p>

      <h2 id="where-the-value-leaks">Where the value leaks: patents, TLOs, no Bayh-Dole</h2>
      <p>
        India's patent system is growing in volume but not in conversion. Filings grew at a <strong>7% CAGR from 2014
        to 2024, reaching 80,211 in 2024</strong> - a genuine achievement - but publicly-funded academic institutions
        convert only a small fraction of filed patents into licences, against double-digit licensing rates at Stanford
        and MIT. The leak is at the licensing stage, not the filing stage. Technology Licensing Offices across Indian
        institutions are uniformly under-staffed, under-funded and lack the IP-valuation, deal-structuring and
        commercialisation skill sets of their global peers; the report's TLO maturity heatmap puts IIT-Madras at the
        top and DRDO at the bottom of the field.
      </p>
      <p>
        Beneath all of this sits the deepest structural cause: <strong>India has no Bayh-Dole-equivalent law.</strong>
        The 1980 US Bayh-Dole Act - which gave universities title to inventions from federally-funded research and
        catalysed the American university tech-transfer system - has no Indian analogue. The Public Funded R&amp;D Bill
        (2010), modelled on Bayh-Dole, was never enacted, and the Anusandhan National Research Foundation Act 2023
        addresses research funding disbursement, not IP ownership. Without legislative clarity on who owns the IP in
        publicly-funded research, the report argues, India's pipeline will keep underperforming even with strong
        incremental policy and capital.
      </p>

      <h2 id="what-already-works">What already works: capital, spin-offs, exports</h2>
      <p>
        The commercial layer of the ecosystem is genuinely competitive and growing. India's deep-tech funding flow
        reached approximately <strong>$2.5 billion in 2024 - an eight-fold increase from 2020</strong> - and the country
        has produced more than 40 deep-tech spin-offs in the past decade (Skyroot Aerospace, Agnikul Cosmos, Pixxel,
        IdeaForge, Ather Energy and others) that have collectively raised over $1.5 billion. Defence exports have grown
        thirty-fold since FY 2016 to cross ₹21,000 crore in FY 2024. The capital layer - venture funds such as Blume,
        Accel, Peak XV, Lightspeed, Omnivore, Axilor, Speciale Invest and 3one4, plus sovereign and corporate capital
        - is the most rapidly evolving part of the system.
      </p>
      <p>
        The strength is also the concentration risk: <strong>78% of capital sits in four sectors</strong> (Space,
        AI/cyber, drones, EV), <strong>80% in three cities</strong> (Bengaluru, Chennai, Mumbai) and <strong>85% traces
        to four institutions</strong> (IIT-Bombay, IIT-Madras, IISc and ISRO). These are genuine centres of excellence
        - but any shock to that four-institution core would materially impair the national pipeline.
      </p>

      <h2 id="control-points-and-dependencies">Control points: India owns output, not inputs</h2>
      <p>
        Along the critical supply chains, India controls roughly <strong>85% of the system-level stack</strong> (UAV
        assembly, missile systems, satellite integration) but <strong>less than 15% of the input stack</strong> (rare
        earths, jet engines, semiconductors, sensors). The semiconductor dependency on China is scored as the single
        highest strategic vulnerability in the whole technology-transfer system - no amount of assembly capability
        offsets foundry-level dependency. Five capabilities sit in the report's "critical 5" category of low Indian
        capability and high strategic importance: <strong>jet engines, semiconductors (28nm and below), rare-earth
        processing, hypersonics and directed-energy weapons</strong> - each requiring a dedicated national mission on a
        5-10 year horizon.
      </p>

      <h2 id="the-five-pillar-agenda">The five-pillar reform agenda (2026-2028)</h2>
      <p>
        The report's resolution is a five-pillar reform agenda, executable over 2026-2028, that would plausibly move
        India from the Incremental scenario (5% of global deep-tech output by 2030) to the <strong>Accelerated scenario
        (12% by 2035) - the report's base case</strong>:
      </p>
      <ul>
        <li><strong>Legislative</strong> - enact a Bayh-Dole-equivalent Indian Publicly-Funded Research IP Act by 2028 (Ministry of Science &amp; Technology with MoD and Law).</li>
        <li><strong>Institutional</strong> - fully operationalise the Anusandhan National Research Foundation and execute DRDO Cadre Reform Phase 2 (DST and MoD).</li>
        <li><strong>Capital</strong> - establish a <strong>$5 billion National Deep-Tech Fund</strong> structured as a fund-of-funds, alongside expanded iDEX Prime and TDF capital (MoF and DPIIT).</li>
        <li><strong>Capacity</strong> - launch a National TLO Capacity Building Mission to bring the eight most strategically important Indian TLOs to globally-comparable maturity within five years (DST).</li>
        <li><strong>Talent</strong> - implement a Defence &amp; Deep-Tech Talent Retention Incentive Scheme addressing the structural pull of US/EU opportunities for top-tier researchers (DST and MoD).</li>
      </ul>

      <h2 id="the-three-scenarios">Three scenarios: 5%, 12% or 22% of global deep-tech</h2>
      <p>
        The report's scenario framework assigns probability weights of <strong>20% (Incremental), 50% (Accelerated) and
        30% (Transformational)</strong> over the 2030-2047 horizon. The Incremental scenario - continued policy
        activism but no legislative breakthrough - sees India at 5% of global deep-tech output by 2030, GERD/GDP of
        0.9%, 120,000 annual patent filings and 200 spin-offs a year. The Accelerated base case sees India at
        <strong>12% of global deep-tech output by 2035</strong>, GERD/GDP of 1.4%, 320,000 annual filings, 1,000
        spin-offs a year and a Bayh-Dole-equivalent law around 2028. The Transformational scenario reaches
        <strong>22% by 2047</strong> with GERD/GDP of 2.5%, 960,000 annual filings and 5,000 spin-offs a year - and
        requires the reform agenda to be executed early plus a step-change in capital (a $20 billion rather than $5
        billion National Deep-Tech Fund).
      </p>
      <p>
        The difference between the Incremental and Accelerated paths is roughly 7 percentage points of global deep-tech
        share by 2035 - modelled at the scale of a few hundred billion dollars a year in value creation. The
        geopolitical window (2026-2032) is unusually favourable; the report argues it may not recur at the same scale,
        which is why its recommendations are calibrated to a 24-36 month execution window. For investors, the thesis is
        that Indian deep-tech compounds at <strong>18-22% annually through 2035</strong> in the base case (25-30% for
        sector leaders in drones, space and AI), with defensible-IP, validated-ToT companies commanding a persistent
        valuation advantage.
      </p>

      <h2 id="the-12-recommendations">The twelve recommendations in brief</h2>
      <p>
        <strong>Three quick wins</strong> (high impact, low effort): a Talent Retention Incentive Scheme for defence and
        deep-tech researchers (24 months); a $5 billion National Deep-Tech Fund as a fund-of-funds (18 months); and a
        National TLO Capacity Building Mission bringing eight strategically important TLOs to global parity (36
        months).
      </p>
      <p>
        <strong>Three strategic bets</strong> (high impact, high effort): the Indian Bayh-Dole-equivalent Publicly-Funded
        Research IP Act (30 months); DRDO Cadre Reform Phase 2 (36 months); and full ANRF operationalisation with $2
        billion in annual disbursement (24 months).
      </p>
      <p>
        <strong>Three sector-specific interventions:</strong> a DPSU R&amp;D mandate of 5% of revenue (48 months); an
        India-US Defence IP Pact for dual-use IP protection (24 months); and a National Quantum Mission Plus with $2
        billion of incremental capital (36 months). <strong>Three enabling measures:</strong> a Strategic Materials
        Reserve for rare earths, gallium and other critical inputs (24 months); IPR fast-track courts to cut patent
        pendency from 4+ years toward 18 months (36 months); and a DPSU-Startup Engagement Tier formalising procurement
        pathways for deep-tech startups (18 months).
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full 129-page edition adds the depth behind this summary: a 12-page executive summary; macro context
        (Chapter 1); pillar-by-pillar analysis of DRDO, CSIR, IITs/IISc and the defence PSUs (Chapters 2-5); TLOs,
        patents/IP and the innovation pipeline (Chapters 6-7); spin-offs and the venture ecosystem (Chapter 8); contract
        R&amp;D and industry-academia collaboration (Chapter 9); eight sectoral deep-dives from drones and space to
        quantum and biotech with TAM/SAM/SOM sizing to 2030 (Chapter 10); international benchmarks across six countries
        (Chapter 11); the policy and regulatory landscape with a 1958-2025 milestone inventory (Chapter 12); strategic
        control points and dependency analysis (Chapter 13); the investment landscape (Chapter 14); a ten-risk register
        (Chapter 15); the full scenario model (Chapter 16); and per-stakeholder recommendations with a 2026-2028
        implementation roadmap (Chapter 17) - plus 26 figures, 25 tables, seven appendices and full methodology and
        source registers. The companion Excel workbook (₹10,999 with the report) carries the machine-readable layer:
        country R&amp;D benchmarks, company and startup databases, the policy tracker, funding vehicles, technology
        mapping of 47 labs, market sizing, scenario drivers and the source data for all 26 figures.
      </p>
    </>
  );
}
