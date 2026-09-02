import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India and the Emerging Lunar Economy".
 * Carries the thesis (India is under-positioned but has a decisive 2026-2032
 * window; the dominant value capture is terrestrial industrial spillover), the
 * distinctive precision-landing capability, the industrial-base gap, the eight
 * opportunity surfaces, the spillover prize and the six strategic moves. The full
 * ~127-page edition (14 chapters, 37 figures, 11 appendices) is the paid PDF; the
 * 13-sheet intelligence workbook is the data tier.
 *
 * Registered in app/reports/[slug]/page.tsx as { lunarToc as toc, LunarContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'A narrow, decisive window' },
  { id: 'the-capability', label: "India's distinctive capability" },
  { id: 'the-gap', label: 'The industrial-base gap' },
  { id: 'opportunities', label: 'Where India can capture value' },
  { id: 'the-prize', label: 'The bigger prize is terrestrial' },
  { id: 'six-moves', label: 'Six strategic moves' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0A1F3D';
const SKY = '#3B7DBF';
const TEAL = '#2BC5B4';
const GOLD = '#C9A96A';
const CRIMSON = '#C8443B';
const SLATE = '#8C9AAE';

/* Figure 1 - India capability by lunar value-chain layer (0-5) */
function CapabilityFigure() {
  const rows = [
    { n: 'Precision landing', v: 4.6, c: TEAL, note: 'proven — Tier-1' },
    { n: 'Science instruments', v: 3.4, c: SKY },
    { n: 'Ground segment / comms', v: 3.3, c: SKY },
    { n: 'Launch (LEO; NGLV in build)', v: 3.1, c: SKY },
    { n: 'Surface mobility (rover)', v: 2.0, c: GOLD },
    { n: 'Surface power', v: 1.2, c: CRIMSON },
    { n: 'ISRU / resource extraction', v: 0.9, c: CRIMSON, note: 'deep layer — Tier-3' },
  ];
  const W = 360;
  return (
    <figure className="report-figure" id="fig-capability">
      <div className="fig-frame">
        <svg viewBox="0 0 720 300" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India capability by layer of the lunar value chain, 0 to 5">
          <text x="16" y="22" fill={NAVY} fontSize="15" fontWeight="700">India&apos;s lunar capability by layer (0&ndash;5)</text>
          {rows.map((r, i) => {
            const y = 42 + i * 34;
            const w = Math.round((r.v / 5) * W);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill={NAVY} fontSize="12" fontWeight="600">{r.n}</text>
                <rect x="300" y={y} width={w} height="17" rx="3" fill={r.c} />
                <text x={300 + w + 6} y={y + 14} fill={NAVY} fontSize="11.5" fontWeight="700">{r.v.toFixed(1)}</text>
                {r.note && <text x="704" y={y + 14} fill={SLATE} fontSize="10.5" textAnchor="end">{r.note}</text>}
              </g>
            );
          })}
          <text x="16" y="294" fill={SLATE} fontSize="10.5">Illustrative Techadyant Labs assessment. India is Tier-1 in five layers, Tier-2/3 in the deeper ones.</text>
        </svg>
      </div>
      <figcaption>India&apos;s strength is concentrated in access and instruments; the deep surface-industrial layers require decade-scale build-out.</figcaption>
    </figure>
  );
}

/* Figure 2 - projected cumulative returns to 2040 (USD bn), direct vs indirect */
function ReturnsFigure() {
  const rows = [
    { n: 'Direct lunar return', lo: 4, hi: 28, c: SKY },
    { n: 'Indirect terrestrial spillover', lo: 18, hi: 95, c: TEAL },
  ];
  const MAX = 100;
  const X0 = 300;
  const SPAN = 380;
  return (
    <figure className="report-figure" id="fig-returns">
      <div className="fig-frame">
        <svg viewBox="0 0 720 190" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India projected cumulative returns to 2040 in USD billion, direct versus indirect">
          <text x="16" y="22" fill={NAVY} fontSize="15" fontWeight="700">Projected cumulative returns to 2040 (USD bn)</text>
          {rows.map((r, i) => {
            const y = 52 + i * 46;
            const x1 = X0 + Math.round((r.lo / MAX) * SPAN);
            const x2 = X0 + Math.round((r.hi / MAX) * SPAN);
            return (
              <g key={r.n}>
                <text x="16" y={y + 15} fill={NAVY} fontSize="12.5" fontWeight="600">{r.n}</text>
                <rect x={x1} y={y} width={Math.max(x2 - x1, 3)} height="20" rx="4" fill={r.c} opacity={0.9} />
                <text x={x1 - 6} y={y + 15} fill={NAVY} fontSize="11.5" fontWeight="700" textAnchor="end">{r.lo}</text>
                <text x={x2 + 6} y={y + 15} fill={NAVY} fontSize="11.5" fontWeight="700">{r.hi}</text>
              </g>
            );
          })}
          <text x="16" y="176" fill={SLATE} fontSize="10.5">Techadyant Labs scenario estimates (Stalled to Accelerated), not forecasts. Indirect spillover exceeds direct return by ~3&ndash;5x.</text>
        </svg>
      </div>
      <figcaption>The dominant value capture is terrestrial industrial uplift &mdash; defence, advanced manufacturing and electronics &mdash; not lunar commerce.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">A narrow, decisive window</h2>
      <p>
        The lunar economy is emerging &mdash; but India is structurally under-positioned. India accounts for roughly 3.3% of
        cumulative announced lunar-programme investment (about USD 6 billion of an indicative global USD 181 billion through
        2024&ndash;2035), a budget roughly one-ninth the size of NASA&apos;s and one-sixth that of China&apos;s. Yet its
        strategic position is more robust than its budget suggests. The report&apos;s central finding is that India has a
        narrow, decisive window &mdash; 2026 to 2032 &mdash; to convert demonstrated precision-landing capability and its
        post-2023 policy reforms into a strategically significant position in selected lunar value-chain segments. Miss the
        window and India is relegated to spectator status for the subsequent industrial phase; act within it and even a
        modest global scenario yields substantial Indian value.
      </p>

      <h2 id="the-capability">India&apos;s distinctive capability</h2>
      <p>
        Chandrayaan-3 demonstrated autonomous precision landing at the lunar south pole at a programme cost of approximately
        USD 75 million &mdash; roughly one-twentieth of equivalent NASA programmes. This is India&apos;s most defensible
        capability, and the anchor around which adjacent contributions can be organised. Decomposed into thirteen layers,
        the lunar value chain shows India with Tier-1 potential in five &mdash; launch, landing, communications ground
        segment, science instruments and commercial services &mdash; and Tier-2 or Tier-3 standing in the deeper layers of
        surface power, resource extraction, manufacturing and habitation.
      </p>
      <CapabilityFigure />

      <h2 id="the-gap">The industrial-base gap</h2>
      <p>
        The binding constraint is industrial, not scientific. India&apos;s supply-chain dependency audit identifies an
        estimated 90&ndash;95% import dependence in radiation-tolerant processors, space-grade multi-junction solar cells
        and travelling-wave tube amplifiers. Without closing the radiation-tolerant-electronics gap, India cannot supply
        Tier-1 components into the Artemis supply chain, regardless of how much mission investment is committed. Closing it
        requires a multi-track strategy &mdash; FDI-enabled partnerships, targeted indigenous build-out and bilateral
        technology access under iCET &mdash; sequenced alongside India&apos;s broader Semiconductor Mission.
      </p>

      <h2 id="opportunities">Where India can capture value</h2>
      <p>
        India can realistically capture value in eight opportunity surfaces spanning three tiers &mdash; five Tier-1 (near-term,
        capability-aligned: instruments, ground segment, lunar analytics, lander avionics and launch services), three Tier-2
        (build-required: propulsion components, thermal-protection materials, navigation algorithms) and long-horizon Tier-3
        surfaces. The direct addressable market is meaningful but not transformative &mdash; on the order of USD 250&ndash;450
        million a year by 2030&ndash;2032, scaling toward USD 400&ndash;800 million by 2035. Tier-1 opportunities are bankable
        today on validated government-science demand; Tier-2 and Tier-3 depend on speculative commercial demand and should be
        sequenced, not front-loaded.
      </p>

      <h2 id="the-prize">The bigger prize is terrestrial</h2>
      <p>
        The larger prize is not lunar commerce but the terrestrial industrial capability the programme forces into being.
        India&apos;s projected direct lunar return to 2040 is on the order of USD 4&ndash;28 billion across scenarios; the
        indirect terrestrial spillover &mdash; radiation-hardened electronics, precision manufacturing, autonomous robotics,
        advanced materials and energy storage feeding defence, manufacturing and electronics &mdash; is on the order of USD
        18&ndash;95 billion, roughly three-to-five times larger. The report recommends framing lunar investment explicitly as
        &ldquo;terrestrial industrial capability uplift via a lunar programme&rdquo; &mdash; a framing that broadens political
        support, attracts patient capital and justifies the public quantum even where lunar commercial returns stay speculative.
      </p>
      <ReturnsFigure />

      <h2 id="six-moves">Six strategic moves</h2>
      <p>
        The strategy is a coherent, sequenced system of six moves: <strong>M1 Artemis Anchor</strong> (position India as a
        Tier-2 contributor into the Artemis supply chain), <strong>M2 National Lunar Programme</strong> (a dedicated
        programme office with budgetary authority), <strong>M3 Lunar Technology Mission</strong> (co-funded capability
        build-out), <strong>M4 post-LUPEX ISRU Pilot</strong> (an oxygen-extraction demonstration, sequenced after
        Chandrayaan-4 sample return), <strong>M5 Industrial Anchor-Supplier</strong> (NSIL anchor-tenant demand), and
        <strong> M6 Spillover Industrial Clusters</strong> (defence, manufacturing and electronics clusters that monetise the
        terrestrial spillover). M1 and M2 must be activated in 2026&ndash;2028 &mdash; that window is the binding constraint on
        India&apos;s 2040 trajectory.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~127-page edition carries all fourteen chapters &mdash; the emergence test, the global infrastructure race,
        the thirteen-layer value chain, India&apos;s current position, the technology and supply-chain gaps, the opportunity
        surfaces, the India&ndash;US strategic position, geopolitical competition, industrial spillovers, investment
        implications, policy strategy, the 2030/2040 scenarios and the strategic conclusion &mdash; with 37 figures and eleven
        appendices (company, startup, policy and funding databases; the technology glossary; a standards reference; a nation
        comparison; supplier, investment and regulatory directories; and a strategic reading list). The companion
        thirteen-sheet Lunar Economy Intelligence Workbook is available with the data tier.
      </p>
    </>
  );
}
