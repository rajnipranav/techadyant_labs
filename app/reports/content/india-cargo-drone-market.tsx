import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Cargo Drone Demand Intelligence 2026-2035".
 * Carries the reframe (which industries generate demand, not "how many drones"),
 * the three-scenario market sizing, the ten demand ecosystems and the Tier-1 lead
 * adopters, the Cargo Drone Adoption Readiness Index, and the 25 hidden opportunity
 * surfaces. The full ~124-page edition (17 chapters, 20 tables, 20 figures,
 * appendices) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { cargoToc as toc, CargoContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-shift', label: 'From pilots to structural adoption' },
  { id: 'the-numbers', label: 'The market in numbers' },
  { id: 'where-demand', label: 'Where the demand concentrates' },
  { id: 'healthcare', label: 'Why healthcare is the decisive use case' },
  { id: 'the-opportunity', label: 'The value is in the ecosystem, not the airframe' },
  { id: 'the-index', label: 'The Adoption Readiness Index' },
  { id: 'scenarios', label: 'Three scenarios to 2035' },
  { id: 'what-to-do', label: 'The 2026-2028 window' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BLUE = '#3E8EDE';
const TEAL = '#2BC5B4';
const BRASS = '#C9A84C';
const SLATE = '#8C9AAE';

/* Figure 1 - three-scenario 2035 fleet and revenue */
function MarketTrajectoryFigure() {
  const rows = [
    { n: 'Conservative', units: 14800, rev: 'INR 3,700 cr', c: SLATE },
    { n: 'Base Case', units: 50200, rev: 'INR 18,400 cr (USD 2.2 bn)', c: BLUE },
    { n: 'Accelerated', units: 142000, rev: 'INR 46,500 cr (USD 5.6 bn)', c: TEAL },
  ];
  const max = 142000;
  return (
    <figure className="report-figure" id="fig-trajectory">
      <div className="fig-frame">
        <svg viewBox="0 0 720 230" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India cargo drone fleet and revenue by scenario, 2035">
          <text x="16" y="24" fill="#0B1D33" fontSize="15" fontWeight="700">India cargo drone market in 2035 &mdash; three scenarios</text>
          {rows.map((r, i) => {
            const y = 52 + i * 56;
            const w = Math.round((r.units / max) * 470);
            return (
              <g key={r.n}>
                <text x="16" y={y + 18} fill="#0B1D33" fontSize="13" fontWeight="600">{r.n}</text>
                <rect x="150" y={y} width={w} height="26" rx="4" fill={r.c} />
                <text x={150 + w + 8} y={y + 18} fill="#0B1D33" fontSize="12.5" fontWeight="700">
                  {r.units.toLocaleString()} units
                </text>
                <text x="152" y={y + 44} fill={SLATE} fontSize="11.5">{r.rev} annual revenue</text>
              </g>
            );
          })}
          <text x="16" y="224" fill={SLATE} fontSize="10.5">Source: Techadyant Labs demand model. Active private-sector fleet from ~850 units in 2026; Base Case ~63% CAGR.</text>
        </svg>
      </div>
      <figcaption>India cargo drone fleet and annual revenue by scenario, 2035.</figcaption>
    </figure>
  );
}

/* Figure 2 - the ten demand ecosystems by readiness tier */
function ReadinessTierFigure() {
  const tiers = [
    { t: 'Tier 1 — Lead adopters', c: TEAL, eco: ['Healthcare logistics', 'Industrial-campus logistics', 'Mining operations', 'Agriculture'] },
    { t: 'Tier 2 — Fast followers', c: BLUE, eco: ['E-commerce last-mile', 'Energy & utilities', 'Oil & gas', 'Ports & maritime'] },
    { t: 'Tier 3 — Selective adopters', c: SLATE, eco: ['Railways & metro', 'Smart cities & municipal'] },
  ];
  return (
    <figure className="report-figure" id="fig-readiness">
      <div className="fig-frame">
        <svg viewBox="0 0 720 250" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Ten demand ecosystems grouped by adoption readiness tier">
          <text x="16" y="24" fill="#0B1D33" fontSize="15" fontWeight="700">Ten demand ecosystems, by Adoption Readiness tier</text>
          {tiers.map((tr, i) => {
            const y = 44 + i * 66;
            return (
              <g key={tr.t}>
                <rect x="16" y={y} width="6" height="52" rx="3" fill={tr.c} />
                <text x="32" y={y + 16} fill="#0B1D33" fontSize="13" fontWeight="700">{tr.t}</text>
                {tr.eco.map((e, j) => (
                  <g key={e}>
                    <rect x={32 + j * 168} y={y + 26} width="158" height="26" rx="13" fill="#EEF3F9" stroke={tr.c} strokeWidth="1" />
                    <text x={32 + j * 168 + 79} y={y + 43} fill="#0B1D33" fontSize="11" textAnchor="middle">{e}</text>
                  </g>
                ))}
              </g>
            );
          })}
          <text x="16" y="244" fill={SLATE} fontSize="10.5">Source: Cargo Drone Adoption Readiness Index&trade;. Tier 1 ecosystems reach ~56% of the active fleet by 2030 (Base Case).</text>
        </svg>
      </div>
      <figcaption>The ten demand ecosystems grouped by the Cargo Drone Adoption Readiness Index&trade;.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-shift">From pilots to structural adoption</h2>
      <p>
        Cargo drones in India have spent a decade confined to pilot programmes and defence peripheries. Between 2026 and
        2035 that changes: the combination of a liberalised regulatory regime, Beyond Visual Line of Sight (BVLOS) corridor
        deployment, and unit economics that finally clear in specific geographies moves the technology into structural
        commercial adoption. This report deliberately reframes the question. The useful question for a builder, operator or
        investor is not &ldquo;how many drones will India need&rdquo; but <em>which industries will generate the demand, why,
        when, and what industrial ecosystems that demand creates</em>. The answer is uneven, and the unevenness is the
        opportunity.
      </p>

      <h2 id="the-numbers">The market in numbers</h2>
      <p>
        India&apos;s active private-sector cargo drone fleet is projected to grow from roughly 850 units in 2026 to between
        14,800 and 142,000 units by 2035, depending on scenario. The Base Case &mdash; steady BVLOS corridor rollout,
        continuation of the Production-Linked Incentive scheme, and multi-state drone-corridor policy &mdash; places the 2035
        fleet at about 50,200 units generating &#8377;18,400 crore (USD 2.2 billion) a year, a compound growth rate near 63%.
        The Accelerated case, premised on large-scale logistics and healthcare deployment, reaches 142,000 units and
        &#8377;46,500 crore. Even the Conservative case clears &#8377;3,700 crore by 2035. The market is small today and
        steep tomorrow; the shape of the curve, not its 2026 level, is what matters.
      </p>
      <MarketTrajectoryFigure />

      <h2 id="where-demand">Where the demand concentrates</h2>
      <p>
        Demand will not emerge uniformly. It concentrates in ten demand ecosystems, of which four &mdash; healthcare
        logistics, industrial-campus logistics, mining operations, and agriculture &mdash; score as Tier-1 lead adopters on
        the proprietary Cargo Drone Adoption Readiness Index&trade; developed for this report. These four combine favourable
        regulatory readiness, compelling unit economics, manageable operational complexity, and high geographic advantage;
        together they account for roughly 56% of the active fleet by 2030 in the Base Case. The remaining six ecosystems
        arrive later and on different logic &mdash; some gated by regulation, some by the cost of integration into existing
        logistics.
      </p>
      <ReadinessTierFigure />

      <h2 id="healthcare">Why healthcare is the decisive use case</h2>
      <p>
        Healthcare is the singular ecosystem where economics, geography, and regulatory tailwinds converge most decisively.
        India&apos;s blood-transfusion network, the Universal Immunization Programme cold chain, organ-transport
        requirements, and the rural diagnostic gap create a demand surface that cargo drones address with measurable unit
        economics. Delivery of blood, vaccines, organs and emergency medicines to and from tier-3 and tier-4 locations offers
        cost-per-delivery that is 30&ndash;70% better than motorbike logistics in rural and remote geographies, while
        compressing response times by 60&ndash;85%. Rwanda&apos;s Zipline programme validated the model over eight years;
        India&apos;s demand surface is roughly twelve times larger by population and forty times larger by area.
      </p>

      <h2 id="the-opportunity">The value is in the ecosystem, not the airframe</h2>
      <p>
        The most valuable industrial opportunity surfaces lie not in drone manufacturing but in the ecosystem that supports
        it. The report identifies twenty-five hidden opportunity surfaces; the five highest-priority plays &mdash; UTM SaaS
        platforms, MRO hub operations, drone-port infrastructure, battery-swapping networks, and component manufacturing for
        motors and composites &mdash; together represent a 2030 addressable market of about &#8377;5,250 crore. These are the
        surfaces where SMEs and startups can build defensible positions without competing head-on with capital-intensive
        OEMs, and where India&apos;s existing EV-charging ecosystem, defence-component base and telecom-software expertise
        provide direct cross-over advantages. The industrial-campus segment, meanwhile, offers the fastest path to ROI:
        inside a fenced campus, regulatory complexity collapses, BVLOS becomes trivial, and payback can arrive in 14&ndash;22
        months against the 36&ndash;60 months typical elsewhere.
      </p>

      <h2 id="the-index">The Adoption Readiness Index</h2>
      <p>
        The Cargo Drone Adoption Readiness Index&trade; scores each of the ten ecosystems across seven parameters &mdash;
        regulatory readiness, unit economics, operational complexity, geographic advantage, buyer sophistication,
        infrastructure dependency, and time-to-scale &mdash; and resolves them into a composite leaderboard with three tiers.
        The index is the report&apos;s organising instrument: it explains not just which ecosystems adopt first but why, and
        it lets a reader test how the ranking shifts if a single parameter &mdash; a corridor policy, an insurance product, a
        battery-cost curve &mdash; moves. The full scoring matrix and a sensitivity analysis are in the appendices.
      </p>

      <h2 id="scenarios">Three scenarios to 2035</h2>
      <p>
        The forecast runs across three scenarios &mdash; Conservative, Base Case and Accelerated &mdash; each defined by
        explicit assumptions about BVLOS corridor expansion, PLI continuation, drone-port build-out, and healthcare and
        logistics deployment scale. The scenarios are not equally likely; the report assigns probabilities and identifies the
        inflection points and triggers that would move India from one path to another. The practical value is that the same
        ten-ecosystem structure holds across all three &mdash; only the timing and amplitude change &mdash; so an operator
        can position for the ecosystem regardless of which macro path materialises.
      </p>

      <h2 id="what-to-do">The 2026-2028 window</h2>
      <p>
        The regulatory environment has shifted decisively in India&apos;s favour: the New Drone Rules 2021, the Drone Airspace
        Map, the PLI scheme, the BVLOS sandbox and the 2024 certification pathway already make it one of the more liberalised
        regimes in the world. The remaining work &mdash; national corridor policy, UTM licensing, drone-port standards and
        IRDAI insurance guidelines &mdash; is expected substantially complete by 2026. That makes 2026&ndash;2028 the critical
        window in which first-mover operators and infrastructure developers secure positional advantages that compound through
        the 2030s. The report closes with a 24-month action agenda and tailored recommendations for OEMs, logistics
        platforms, investors, SMEs, state governments and the Government of India.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~124-page edition carries all seventeen chapters: a per-ecosystem deep dive for each of the ten demand
        surfaces (drivers, buyer personas, fleet forecast, payload and range requirements, unit economics, international
        benchmark and opportunity surfaces), the complete Adoption Readiness Index with its scoring matrix and sensitivity
        analysis, the three-scenario model with probabilities and triggers, twenty-five SME and startup opportunity cards with
        four archetype five-year P&amp;L models, the Indian player map and 2020&ndash;2025 funding landscape, a three-horizon
        strategic roadmap and risk register, and full appendices with the demand database, methodology and data sources.
        Twenty tables and twenty figures throughout.
      </p>
    </>
  );
}
