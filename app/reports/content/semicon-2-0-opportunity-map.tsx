import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The Semicon 2.0 Opportunity Map".
 * Carries the thesis (India funds the fab; the value sits in the other 65%),
 * the eight-stream framework, the Rs 45,500 cr serviceable opportunity, the
 * import-dependency exposure, the photoresist chokepoint, the three action tiers
 * and the closing strategic window. The full ~180-page edition (15 chapters,
 * 26 figures, appendices, Excel workbook) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { semiconToc as toc, SemiconContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'India funds the fab; the value is elsewhere' },
  { id: 'semicon-2', label: 'What Semicon 2.0 is' },
  { id: 'the-prize', label: 'The prize: a Rs 45,500 crore opportunity' },
  { id: 'the-streams', label: 'The eight streams, ranked' },
  { id: 'the-exposure', label: 'How import-dependent India still is' },
  { id: 'chokepoint', label: 'The single scariest chokepoint' },
  { id: 'tiers', label: 'Three tiers, three time horizons' },
  { id: 'the-window', label: 'The window is open now' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';
const SLATE = '#8C9AAE';

/* Figure 1 — the 35/65 value-chain split */
function ValueSplitFigure() {
  return (
    <figure className="report-figure" id="fig-split">
      <div className="fig-frame">
        <svg viewBox="0 0 720 230" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India funds 35% of the semiconductor value chain; 65% sits in the upstream streams">
          <text x="16" y="24" fill={NAVY} fontSize="15" fontWeight="700">India funds the fab &mdash; the value is in the other 65%</text>
          <rect x="16" y="46" width="242" height="96" fill={NAVY} />
          <rect x="258" y="46" width="446" height="96" fill={BRASS} />
          <text x="137" y="92" fill="#FFFFFF" fontSize="34" fontWeight="800" textAnchor="middle">35%</text>
          <text x="137" y="118" fill="#FFFFFF" fontSize="12" textAnchor="middle">Fabs &amp; OSAT</text>
          <text x="481" y="90" fill={NAVY} fontSize="34" fontWeight="800" textAnchor="middle">65%</text>
          <text x="481" y="114" fill={NAVY} fontSize="11" textAnchor="middle">Materials · Chemicals · Equipment · Packaging</text>
          <text x="481" y="130" fill={NAVY} fontSize="11" textAnchor="middle">Testing · Automation · Precision · Software</text>
          <text x="16" y="166" fill={NAVY} fontSize="12.5" fontWeight="700">78%</text>
          <text x="44" y="166" fill={NAVY} fontSize="12.5">of the gross-margin pool lives in the streams India has barely started to fund.</text>
          <text x="16" y="224" fill={SLATE} fontSize="10.5">Source: Techadyant Labs value-chain model; India Semiconductor Mission project data.</text>
        </svg>
      </div>
      <figcaption>India funds roughly 35% of the value chain; the eight upstream streams hold the other 65% &mdash; and 78% of the margin.</figcaption>
    </figure>
  );
}

/* Figure 2 — India's upstream import dependence */
function ImportExposureFigure() {
  const rows = [
    { n: 'Lithography equipment', v: 99 },
    { n: 'Photoresists', v: 95 },
    { n: 'Specialty gases', v: 92 },
    { n: 'Metrology tools', v: 88 },
  ];
  return (
    <figure className="report-figure" id="fig-exposure">
      <div className="fig-frame">
        <svg viewBox="0 0 720 230" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India imports almost everything upstream">
          <text x="16" y="24" fill={NAVY} fontSize="15" fontWeight="700">India imports almost everything upstream</text>
          {rows.map((r, i) => {
            const y = 46 + i * 40;
            const w = Math.round((r.v / 100) * 420);
            return (
              <g key={r.n}>
                <text x="16" y={y + 20} fill={NAVY} fontSize="12.5">{r.n}</text>
                <rect x="196" y={y + 4} width="420" height="24" rx="3" fill="#EDE7DA" />
                <rect x="196" y={y + 4} width={w} height="24" rx="3" fill={CRIMSON} />
                <text x={196 + w - 8} y={y + 21} fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="end">{r.v}%</text>
              </g>
            );
          })}
          <text x="16" y="222" fill={SLATE} fontSize="10.5">Source: MeitY / ISM supply data; Techadyant Labs analysis. Figures are estimates of import share, 2025.</text>
        </svg>
      </div>
      <figcaption>Share of demand met by imports, by input class &mdash; the chain feeding the fab is still abroad.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">India funds the fab; the value is elsewhere</h2>
      <p>
        In July 2026 the Union Cabinet approved the second phase of the India Semiconductor Mission &mdash; a roughly
        &#8377;1.27 lakh crore, six-pillar programme that, for the first time, extends state support beyond fabrication into
        materials, equipment, chemicals and the wider component ecosystem. That decision reframes the Indian semiconductor
        story. The fab is no longer the whole ambition; it is the anchor. And the fab is only about 35% of the semiconductor
        value chain. The other 65% &mdash; materials, chemicals, equipment, precision manufacturing, packaging, testing,
        automation and industrial software &mdash; is where roughly 78% of the industry&apos;s gross-margin pool actually
        sits, and it is the part India has barely started to fund. This report maps that 65%.
      </p>
      <ValueSplitFigure />

      <h2 id="semicon-2">What Semicon 2.0 is</h2>
      <p>
        Techadyant Labs defines Semicon 2.0 as the deliberate, coordinated build-out of the eight-stream semiconductor
        ecosystem beyond fab and OSAT. Semicon 1.0 &mdash; the &#8377;76,000 crore first phase launched in December 2021 &mdash;
        did the necessary anchor work: Tata Electronics&apos; Dholera fab, Micron&apos;s Sanand facility, and the first wave of
        assembly and packaging commitments moved India from the periphery of the global map to a credible manufacturing
        geography. Semicon 2.0 is the ecosystem that decides whether those anchors compound into an industry, or quietly keep
        importing everything upstream. The distinction matters because value, margin and strategic vulnerability all sit
        upstream of the fab, not inside it.
      </p>

      <h2 id="the-prize">The prize: a Rs 45,500 crore opportunity</h2>
      <p>
        The ten-year cumulative addressable opportunity across the eight streams is modelled at about &#8377;95,500 crore in
        geographic terms, of which roughly &#8377;45,500 crore is realistically serviceable by 2035 &mdash; larger than the
        combined market capitalisation of India&apos;s listed semiconductor-ecosystem companies today. These are Techadyant
        Labs&apos; own modelled estimates, presented across Base, Accelerated and Constrained scenarios; they should be read as
        directional sizing of the opportunity, not as forecasts. The point is not the decimal place. It is that a serviceable
        market of this scale exists in the layer of the industry that currently receives the least private capital and the
        least policy attention.
      </p>

      <h2 id="the-streams">The eight streams, ranked</h2>
      <p>
        The opportunity is unevenly distributed. Equipment (about &#8377;9,580 crore a year by 2035) and Packaging (about
        &#8377;9,160 crore) are the largest pools; Industrial Software (about &#8377;4,830 crore) is India&apos;s most
        asymmetric play, because the country&apos;s existing IT and engineering base can be repurposed for manufacturing
        execution systems, digital twins and yield-optimisation software with marginal incremental capital. Chemicals,
        Materials and Testing are critical enablers requiring targeted capital; Precision Manufacturing and Automation are
        higher-uncertainty but high-leverage. The strategic error would be to treat the eight as a single undifferentiated
        &ldquo;ecosystem&rdquo; opportunity &mdash; the returns, time horizons and capital intensity differ by an order of
        magnitude across them.
      </p>

      <h2 id="the-exposure">How import-dependent India still is</h2>
      <p>
        The reason this matters now is exposure. India imports an estimated 99% of its lithography equipment, 95% of its
        photoresists, 92% of its specialty gases and 88% of its metrology tools. The fab can be built in Dholera; the chain
        that feeds it is still abroad. Of the &#8377;76,000 crore Semicon 1.0 outlay, only a small fraction was explicitly
        directed at specialty materials and equipment &mdash; which is precisely the gap Semicon 2.0&apos;s &ldquo;machines and
        materials&rdquo; pillar now begins to address. Every one of these dependencies is simultaneously a vulnerability and an
        addressable opportunity surface.
      </p>
      <ImportExposureFigure />

      <h2 id="chokepoint">The single scariest chokepoint</h2>
      <p>
        The concentration risk is starkest in photoresist. A handful of Japanese firms control the overwhelming majority of
        global photoresist supply &mdash; on the most recent data, roughly 87&ndash;91%, rising toward 91% for the advanced
        extreme-ultraviolet grades that leading-edge fabs depend on. India&apos;s domestic photoresist capability is
        effectively zero. A single supply shock in this one input would reprice the entire national ambition. A strategic joint
        venture with a Korean or European player to establish India-based photoresist manufacturing is, on the report&apos;s
        analysis, the highest-leverage single intervention in the materials domain.
      </p>

      <h2 id="tiers">Three tiers, three time horizons</h2>
      <p>
        The eight streams resolve into three capital-allocation tiers. <strong>Tier 1 (Speed up)</strong> &mdash; Industrial
        Software, Packaging, Testing and Automation &mdash; are immediate deployments with one-to-three-year time-to-revenue
        and the highest internal rates of return. <strong>Tier 2 (Invest now)</strong> &mdash; specialty gases, precision
        components, CMP slurries and sputtering targets &mdash; are three-to-five-year horizons that need government
        co-investment. <strong>Tier 3 (Long horizon)</strong> &mdash; a photoresist JV, wafer manufacturing, metrology tools
        and sub-14nm lithography &mdash; require sovereign commitment and strategic partnerships over five to ten years. The
        tiering is the actionable core of the report: it converts a map of opportunity into a sequence of decisions.
      </p>

      <h2 id="the-window">The window is open now</h2>
      <p>
        The window for capturing this opportunity is finite. Geopolitical realignment has opened a period &mdash; perhaps five
        to seven years &mdash; in which Western capital, technology and strategic intent are aligned with Indian capability
        building. India&apos;s engineering-talent dividend peaks around 2032, and global semiconductor overcapacity could emerge
        by the mid-2030s. Action deferred to 2030 is likely to meet a closed opportunity landscape. Semicon 1.0 built the fabs;
        Semicon 2.0 decides who captures the value they create.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~180-page edition carries all fifteen chapters: a stream-by-stream deep dive for each of the eight opportunity
        surfaces (market size, import dependency, competitive structure, India&apos;s position and the specific plays), the
        complete TAM/SAM/SOM model across three scenarios, the OSAT cost-arbitrage analysis, the talent-pipeline and
        finishing-school proposal, a state-by-state comparison, the risk register and ten-year roadmap, and the investment
        thesis with the three-tier allocation framework. Twenty-six figures and a ten-sheet data workbook throughout, with all
        market-sizing labelled as Techadyant Labs&apos; own modelling and load-bearing external facts traced to source.
      </p>
    </>
  );
}
