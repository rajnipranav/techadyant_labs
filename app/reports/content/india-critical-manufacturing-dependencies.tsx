import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Critical Manufacturing Dependencies" (Edition I).
 * Carries the thesis (imports as a diagnostic signal of missing industrial capability),
 * the scale of the gap, the chokepoint-before-volume and descend-the-stack imperatives,
 * the CMDI and ten proprietary indices, the twelve opportunity zones and the case
 * against. The full ~130-page edition (13 chapters, 46 tables, 30 figures, the CMDD
 * database and appendices) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { cmddToc as toc, CmddContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-diagnosis', label: 'Imports as a diagnostic signal' },
  { id: 'the-gap', label: 'The scale of the capability gap' },
  { id: 'chokepoints', label: 'Chokepoints before volume' },
  { id: 'the-stack', label: 'Descend the industrial stack' },
  { id: 'the-indices', label: 'The CMDI and ten indices' },
  { id: 'the-zones', label: 'Twelve opportunity zones' },
  { id: 'the-case-against', label: 'The case against — and its limits' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#1F5C8C';
const BRASS = '#C9A84C';
const TEAL = '#0F8E78';
const CRIMSON = '#C0392B';
const SLATE = '#8C9AAE';

/* Figure 1 — the scale of India's manufacturing value-added gap */
function ScaleGapFigure() {
  const rows = [
    { n: 'China', v: 4660, c: SLATE },
    { n: 'United States', v: 2490, c: SLATE },
    { n: 'India', v: 470, c: NAVY },
  ];
  const max = 4660;
  return (
    <figure className="report-figure" id="fig-gap">
      <div className="fig-frame">
        <svg viewBox="0 0 720 210" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Manufacturing value added, 2023, USD billion">
          <text x="16" y="24" fill="#0B1D33" fontSize="15" fontWeight="700">Manufacturing value added, 2023 (USD bn)</text>
          {rows.map((r, i) => {
            const y = 50 + i * 46;
            const w = Math.round((r.v / max) * 470);
            return (
              <g key={r.n}>
                <text x="16" y={y + 17} fill="#0B1D33" fontSize="13" fontWeight="600">{r.n}</text>
                <rect x="150" y={y} width={w} height="24" rx="4" fill={r.c} />
                <text x={150 + w + 8} y={y + 17} fill="#0B1D33" fontSize="12.5" fontWeight="700">
                  ${r.v.toLocaleString()} bn
                </text>
              </g>
            );
          })}
          <text x="16" y="196" fill={SLATE} fontSize="11.5">India is 2.9% of global manufacturing value added — under one-sixth of China&rsquo;s. Source: World Bank / UNIDO.</text>
        </svg>
      </div>
      <figcaption>India&rsquo;s manufacturing base is small relative to its ambition — the report treats the import ledger as the map of where that base is missing.</figcaption>
    </figure>
  );
}

/* Figure 2 — the deepest dependencies by CMDI */
function DependencyFigure() {
  const rows = [
    { n: 'EUV photoresist', v: 95, c: CRIMSON },
    { n: 'Logic ICs (7nm & below)', v: 91, c: CRIMSON },
    { n: 'Combat aero-engines', v: 90, c: CRIMSON },
    { n: 'DRAM & NAND memory', v: 89, c: CRIMSON },
    { n: 'Display driver ICs', v: 80, c: BRASS },
    { n: 'Li-ion cells', v: 78, c: BRASS },
  ];
  return (
    <figure className="report-figure" id="fig-cmdi">
      <div className="fig-frame">
        <svg viewBox="0 0 720 250" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Deepest critical manufacturing dependencies by CMDI score">
          <text x="16" y="24" fill="#0B1D33" fontSize="15" fontWeight="700">Deepest dependencies (Critical Manufacturing Dependency Index, 0&ndash;100)</text>
          {rows.map((r, i) => {
            const y = 46 + i * 32;
            const w = Math.round((r.v / 100) * 430);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="12.5" fontWeight="600">{r.n}</text>
                <rect x="250" y={y} width={w} height="20" rx="3" fill={r.c} />
                <text x={250 + w + 7} y={y + 14} fill="#0B1D33" fontSize="12" fontWeight="700">{r.v}</text>
              </g>
            );
          })}
          <text x="16" y="242" fill={SLATE} fontSize="11.5">Red = critical (single-source, no domestic option); amber = high. The CMDI ranks by strategic risk, not import value.</text>
        </svg>
      </div>
      <figcaption>The most dangerous imports are not the largest — they are the single-source chokepoints the CMDI is built to surface.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="report-lede">
        India does not have an import problem. It has an industrial-capability problem disguised as an import problem.
        This report treats every line in the customs ledger not as an accounting entry to be taxed or restricted, but
        as a diagnostic signal — the fingerprint of a manufacturing capability that does not yet exist at scale, quality
        or competitive cost inside the country.
      </p>

      <h2 id="the-diagnosis">Imports as a diagnostic signal</h2>
      <p>
        India imports roughly $672 billion of merchandise a year. About $506 billion of that — three-quarters — is
        strategic: goods whose absence would stall a factory, a hospital, a power project or a weapons programme.
        The report identifies, scores and decomposes 312 such opportunity surfaces across twelve mega-sectors, and
        converts them into investment-grade decision intelligence: what India should make domestically over the next
        decade, why, where, how, and who should build it.
      </p>

      <h2 id="the-gap">The scale of the capability gap</h2>
      <p>
        The headline is uncomfortable. India&rsquo;s manufacturing value added is about $470 billion — 2.9% of the global
        total, less than one-sixth of China&rsquo;s and under one-fifth of the United States&rsquo;. A country that aims to be
        the world&rsquo;s third-largest economy still manufactures, per head, a fraction of its industrial peers. This is
        not a trade problem to be managed at the border; it is a capability problem to be built.
      </p>
      <ScaleGapFigure />

      <h2 id="chokepoints">Chokepoints before volume</h2>
      <p>
        The most strategically dangerous imports are not the largest. India buys about $4.8 billion of leading-edge
        logic chips a year — small next to $142 billion of crude oil — but every one comes from TSMC, Samsung or SMIC.
        There is no supplier diversity, no substitute, no domestic option. A single event in the Taiwan Strait would
        reach Indian electronics, automotive, telecom and defence within ninety days. A $400 million import of EUV
        photoresist is a more urgent target than a $4 billion commodity, because the commodity has substitutes and the
        chokepoint does not. Localisation priority must follow supply risk, not import value — which is exactly what the
        CMDI is built to measure.
      </p>
      <DependencyFigure />

      <h2 id="the-stack">Descend the industrial stack</h2>
      <p>
        India has spent two decades building final-assembly capacity — phones, appliances, two-wheelers, generic
        pharmaceuticals — on a base of imported components, imported capital equipment and imported specialty materials.
        A phone assembled in India captures perhaps 6&ndash;8% of its factory-gate value; the rest accrues abroad. The shift
        the next decade demands is downward: from assembly to components, to sub-components, to specialty materials, to
        the machinery and the test-and-certification infrastructure beneath them. Each layer descended multiplies the
        industrial return and unlocks the next.
      </p>

      <h2 id="the-indices">The CMDI and ten proprietary indices</h2>
      <p>
        Every surface is scored on the Critical Manufacturing Dependency Index and nine companion indices — localisation
        potential, investment attractiveness, supply-chain complexity, technology readiness, export potential, supply
        risk, industrial multiplier, national-security relevance and capability gap. Each index has a published formula,
        weightings, limitations and a worked example; every figure carries a confidence tag (Verified, Reasoned estimate
        or Strategic inference), so a reader can see exactly how much weight each number can bear.
      </p>

      <h2 id="the-zones">Twelve opportunity zones</h2>
      <p>
        The report concentrates capital and policy on twelve executable zones — semiconductor and display in Dholera and
        Hosur; Li-ion cells in the Chennai&ndash;Hosur&ndash;Sri City corridor; solar wafers and cells in Mundra and Visakhapatnam;
        defence aerospace in Bengaluru and Hyderabad; medical devices in Ahmedabad and Hyderabad; specialty chemicals in
        Ankleshwar&ndash;Vadodara; CNC machine tools in Bengaluru and Coimbatore; green-hydrogen electrolysers in Mundra and
        Paradip; wind-turbine gearboxes; telecom and 5G equipment; EV power electronics; and pharmaceutical API
        backward-integration. The full localisation envelope is roughly $480 billion of largely private, phased capital
        over 2026&ndash;2035 — set against $5.6 trillion of strategic imports over the same period if nothing changes.
      </p>

      <h2 id="the-case-against">The case against — and its limits</h2>
      <p>
        A report that argues in only one direction is advocacy, not intelligence. Four serious objections bound the
        thesis: comparative advantage (why not import and specialise?), the subsidy trap (India&rsquo;s licence-raj past),
        trade-rule and partner constraints, and fiscal opportunity cost. None defeats the case, but each narrows it —
        which is why every target must clear a cost-parity and subsidy-exit test, why the instruments lean on demand-side
        incentives and friend-shoring over blunt import bans, and why the report scores 312 surfaces rather than chasing
        all of them. Localisation that never reaches cost-competitiveness does not remove a dependency; it relocates it
        onto the exchequer.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full Edition I runs to thirteen chapters, 46 tables and 30 figures: the complete five-stage CMD framework
        and five-level product taxonomy; the ten index definitions with worked examples; deep-dives on 312 products
        across twelve sectors; six industrial-ecosystem maps; sixteen-nation global benchmarks; fifteen Indian industrial
        clusters scored; the policy architecture, PLI performance and eight recommended interventions; the investment
        envelope with plant economics and break-even analysis; state-by-state capability rankings; a company database; and
        the underlying Critical Manufacturing Dependencies Database (CMDD), from which the live Dependency Monitor draws a
        curated subset.
      </p>
    </>
  );
}
