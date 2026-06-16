import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India Drone Sensors, Payloads & Imaging Systems Market".
 * Carries the market thesis, the sizing, the import-dependence finding, the
 * structural shifts in value capture and the competitive read. The full
 * ~143-page edition (thirteen chapters, fifty figures, 137 tables and the full
 * segmentation and forecast model) is the paid PDF; PremiumBody renders the
 * paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The sensing layer is the dependency' },
  { id: 'market-size', label: 'A US$1.5bn market by 2035' },
  { id: 'import-dependence', label: 'Imported eyes' },
  { id: 'segmentation', label: 'Where the demand sits' },
  { id: 'germanium-free', label: 'Engineering around the chokepoint' },
  { id: 'business-models', label: 'From hardware to data' },
  { id: 'competitive', label: 'Who leads' },
  { id: 'forecast', label: 'Three phases to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure 1 - market growth, 2024 -> 2035 (USD million, midpoints) */
function MarketFigure() {
  const rows = [
    { y: '2024', v: 152 },
    { y: '2026', v: 200 },
    { y: '2028', v: 312 },
    { y: '2030', v: 540 },
    { y: '2032', v: 820 },
    { y: '2035', v: 1300 },
  ];
  const max = 1300;
  return (
    <figure className="report-figure" id="fig-market">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India drone sensors, payloads and imaging market growing from US$152M in 2024 to roughly US$1,300M by 2035">
          {rows.map((r, i) => {
            const x = 60 + i * 116;
            const h = (r.v / max) * 210;
            const y = 250 - h;
            const c = i < 2 ? CRIMSON : i < 4 ? BRASS : TEAL;
            return (
              <g key={r.y}>
                <rect x={x} y={y} width={66} height={h} rx={4} fill={c} />
                <text x={x + 33} y={y - 8} fontSize={13} fontWeight={700} fill="#E8E8F0" textAnchor="middle" fontFamily="monospace">{r.v >= 1000 ? `$${(r.v/1000).toFixed(1)}bn` : `$${r.v}M`}</text>
                <text x={x + 33} y={268} fontSize={13} fontWeight={600} fill="#8A8AA0" textAnchor="middle">{r.y}</text>
              </g>
            );
          })}
          <text x={60} y={288} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Midpoint estimates &middot; base scenario &middot; 22&ndash;26% CAGR</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The market roughly seven-to-eightfold over the decade, from ~US$200M in 2026 to ~US$1.1&ndash;1.5bn by 2035.</figcaption>
    </figure>
  );
}

/* Figure 2 - import dependence by sensor category */
function ImportFigure() {
  const rows = [
    { n: 'LiDAR', v: 85 },
    { n: 'Thermal (IR)', v: 80 },
    { n: 'IMU / inertial', v: 70 },
    { n: 'EO / RGB cameras', v: 55 },
  ];
  return (
    <figure className="report-figure" id="fig-import">
      <div className="fig-frame">
        <svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Import dependence by drone-sensor category: LiDAR 85%, thermal 80%, IMU 70%, cameras 55%">
          {rows.map((r, i) => {
            const y = 26 + i * 56;
            const w = (r.v / 100) * 470;
            return (
              <g key={r.n}>
                <text x={18} y={y + 21} fontSize={14} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={205} y={y} width={470} height={30} rx={4} fill="#1E2A3D" />
                <rect x={205} y={y} width={w} height={30} rx={4} fill={r.v >= 80 ? CRIMSON : BRASS} />
                <text x={205 + w + 10} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.v}%</text>
              </g>
            );
          })}
          <text x={205} y={246} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Share of demand met by imports &middot; China, Taiwan, United States</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The platforms are integrated in India; the sensors that decide what they can see are not. 70&ndash;80% of high-grade sensing is imported.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="report-lede">
        India has built drones it can fly but largely cannot equip. The airframes, autopilots and
        ground stations are increasingly made at home &mdash; but the sensors that turn a drone into a
        useful instrument, the LiDAR, the thermal cores, the multispectral and hyperspectral payloads,
        the inertial units, remain overwhelmingly imported. This report sizes that sensing layer,
        traces where the dependency sits, and maps where domestic value can be captured.
      </p>

      <h2 id="the-thesis">The sensing layer is the dependency</h2>
      <p>
        A drone is only as capable as what it can sense. India&rsquo;s drone story is usually told
        through platforms and assembly, but the strategic exposure lives one layer up, in the payload.
        Between 70% and 80% of high-grade drone-sensor demand is met by imports, and the most
        valuable categories &mdash; survey-grade LiDAR and cooled thermal cores &mdash; are the most
        import-bound of all. The result is an ecosystem that can build the aircraft but must buy its
        eyes, and pay import premiums of 20&ndash;40% and lead times measured in months to do so.
      </p>

      <h2 id="market-size">A US$1.5bn market by 2035</h2>
      <p>
        The market for drone sensors, payloads and imaging systems is valued at roughly
        US$190&ndash;210 million in 2026 and is modelled to reach US$1.1&ndash;1.5 billion by 2035,
        a compound growth rate of 22&ndash;26%. Three structural shifts underpin the curve: the
        transition from imported components toward indigenous manufacturing under the PLI scheme, the
        consolidation of discrete sensors into integrated payload solutions, and the monetisation of
        data rather than hardware.
      </p>
      <MarketFigure />

      <h2 id="import-dependence">Imported eyes</h2>
      <p>
        The dependency is not uniform &mdash; it concentrates in exactly the categories that matter
        most. LiDAR is about 85% imported, thermal imaging about 80%, inertial measurement units
        about 70%. China, Taiwan and the United States supply the bulk. The 2024 germanium crisis,
        which sent thermal-optics lead times to seven months and costs up tenfold, showed how a single
        upstream material can hold an entire payload category hostage.
      </p>
      <ImportFigure />

      <h2 id="segmentation">Where the demand sits</h2>
      <p>
        Commercial end-use sectors &mdash; agriculture, infrastructure, mining and logistics &mdash;
        account for 55&ndash;60% of sensor demand, ahead of defence at 25&ndash;30% and consumer at
        10&ndash;15%. Agriculture alone is roughly a fifth of commercial demand. LiDAR is the fastest
        growing category at over 35% CAGR, pulled by infrastructure inspection, mining volumetrics and
        corridor mapping. The report segments the market five ways &mdash; by sensor type, end-use
        sector, UAV class, component tier and region &mdash; and identifies the high-growth cells where
        demand and localisation potential overlap.
      </p>

      <h2 id="germanium-free">Engineering around the chokepoint</h2>
      <p>
        The most important finding in the report is that import dependence can be engineered around,
        not just replicated. Eon Space Labs&rsquo; germanium-free thermal imaging avoids the very
        material whose supply crisis exposed the category, lowering system cost by 60&ndash;70% while
        reaching roughly 80% local manufacturing. It is proof that the right architectural choice can
        convert a chokepoint into an opportunity surface &mdash; and a template for the LiDAR, IMU and
        multispectral categories that follow.
      </p>

      <h2 id="business-models">From hardware to data</h2>
      <p>
        Value is migrating from the sensor to the data it captures. Drone-as-a-Service has become the
        dominant model, with margins of 50&ndash;65% against 25&ndash;35% for hardware. Enterprise
        buyers increasingly want actionable intelligence &mdash; orthomosaics, point clouds, NDVI
        layers &mdash; rather than raw sensors, which makes sensor fusion and AI-enabled edge
        processing non-negotiable, and shifts the competitive battleground from optics to software.
      </p>

      <h2 id="competitive">Who leads</h2>
      <p>
        ideaForge leads on certification and integrated payload ecosystems; Eon Space Labs holds
        proprietary germanium-free thermal with about 80% localisation; Garuda Aerospace runs the
        largest agricultural DaaS fleet; BEL brings defence-PSU radar depth. International suppliers
        still own the high-spec LiDAR and cooled thermal cores. The competitive question for the next
        three years is whether configurability and indigenous payloads can outflank superior imported
        specifications on price, lead time and PLI eligibility.
      </p>

      <h2 id="forecast">Three phases to 2035</h2>
      <p>
        Growth will not be linear. The report models three phases: certification-led growth
        (2026&ndash;2028), as DGCA type certifications unlock enterprise procurement; indigenous
        scaling (2029&ndash;2032), as domestic thermal, LiDAR and IMU alternatives reach commercial
        scale and import dependence falls from ~75% toward 55&ndash;60%; and export and maturity
        (2033&ndash;2035), as Indian sensor-integrated payloads turn cost-competitive abroad and
        exports reach 15&ndash;20% of leading players&rsquo; revenue.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~143-page edition carries the complete market model: thirteen chapters, fifty figures
        and 137 tables. It includes the full five-way segmentation with sizing for every cell, the
        2021&ndash;2035 forecast with scenario analysis and ASP trends, the regulatory and PLI deep
        dive, the supply-chain and import-dependence mapping with the Eon Space Labs case study and a
        localisation roadmap, a technology and TRL assessment of every sensor class, detailed company
        profiles and market-share analysis, end-use sector economics, business-model and monetisation
        analysis, and a closing investment and strategic-recommendation chapter for OEMs, sensor
        manufacturers, investors and policymakers.
      </p>
    </>
  );
}
