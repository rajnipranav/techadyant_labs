import type { TocItem } from '../../components/ReportReader';

const SLUG = 'india-drone-sensors-payloads-imaging-market';

export const toc: TocItem[] = [
  { id: 'executive-summary', label: 'Executive summary' },
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

function Figure({ n, caption, ariaLabel }: { n: number; caption: string; ariaLabel?: string }) {
  return (
    <figure className="report-figure" id={`fig-${n}`}>
      <div className="fig-frame">
        <img
          src={`/figures/${SLUG}/fig-${n}.svg`}
          alt={ariaLabel ?? caption}
          loading="lazy"
        />
      </div>
      <figcaption>
        <span className="fig-no">Fig. {n}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <div className="exec-summary">
        <div className="es-label">Executive summary · Edition 01</div>
        <p>
          A drone is only as capable as what it can sense, and India imports most of that
          capability. The country can increasingly build airframes, autopilots and ground
          stations, but the sensors that turn a drone into a useful instrument remain
          overwhelmingly imported. This report sizes that sensing layer, traces where the
          dependency sits, and maps where domestic value can be captured.
        </p>
        <ul>
          <li>
            Between <strong>70% and 80%</strong> of high-grade drone-sensor demand is met by
            imports, with the most valuable categories the most import-bound.
          </li>
          <li>
            <strong>LiDAR is about 85% imported</strong>, thermal imaging about 80%, and
            inertial measurement units about 70%, sourced mainly from China, Taiwan and the
            United States.
          </li>
          <li>
            The market is valued at roughly <strong>US$190–210 million in 2026</strong> and
            modelled to reach <strong>US$1.1–1.5 billion by 2035</strong> at a 22–26% CAGR.
          </li>
          <li>
            Indigenous alternatives such as <strong>Eon Space Labs’ germanium-free thermal
            imaging</strong> show that import dependence can be engineered around, not just
            replicated.
          </li>
          <li>
            Value is migrating from hardware to <strong>Drone-as-a-Service and data
            monetisation</strong>, making sensor fusion and AI-enabled edge processing
            non-negotiable.
          </li>
        </ul>
      </div>

      <div className="pull-stat">
        <div className="ps"><div className="n">US$1.1–1.5bn</div><div className="l">Modelled drone sensors and payloads market by 2035</div></div>
        <div className="ps"><div className="n">US$190–210m</div><div className="l">Market size in 2026</div></div>
        <div className="ps"><div className="n">22–26%</div><div className="l">Modelled compound growth rate</div></div>
        <div className="ps"><div className="n">85%</div><div className="l">Import share in LiDAR</div></div>
        <div className="ps"><div className="n">80%</div><div className="l">Import share in thermal imaging</div></div>
        <div className="ps"><div className="n">70%</div><div className="l">Import share in inertial measurement units</div></div>
      </div>

      <h2 id="the-thesis" className="dropcap">The sensing layer is the dependency</h2>
      <p>
        A drone is only as capable as what it can sense. India’s drone story is usually told
        through platforms and assembly, but the strategic exposure lives one layer up, in the
        payload. Between 70% and 80% of high-grade drone-sensor demand is met by imports, and
        the most valuable categories — survey-grade LiDAR and cooled thermal cores — are the
        most import-bound of all. The result is an ecosystem that can build the aircraft but
        must buy its eyes, and pay import premiums of 20–40% and lead times measured in months
        to do so.
      </p>

      <h2 id="market-size">A US$1.5bn market by 2035</h2>
      <p>
        The market for drone sensors, payloads and imaging systems is valued at roughly
        US$190–210 million in 2026 and is modelled to reach US$1.1–1.5 billion by 2035, a
        compound growth rate of 22–26%. Three structural shifts underpin the curve: the
        transition from imported components toward indigenous manufacturing under the PLI
        scheme, the consolidation of discrete sensors into integrated payload solutions, and
        the monetisation of data rather than hardware.
      </p>

      <Figure
        n={1}
        caption="India drone sensors, payloads and imaging market growing from around US$190–210M in 2026 to roughly US$1.1–1.5bn by 2035."
        ariaLabel="Bar chart showing the market size trajectory from 2026 to 2035 at midpoint estimates."
      />

      <h2 id="import-dependence">Imported eyes</h2>
      <p>
        The dependency is not uniform — it concentrates in exactly the categories that matter
        most. LiDAR is about 85% imported, thermal imaging about 80%, inertial measurement
        units about 70%. China, Taiwan and the United States supply the bulk. The 2024
        germanium crisis, which sent thermal-optics lead times to seven months and costs up
        tenfold, showed how a single upstream material can hold an entire payload category
        hostage.
      </p>

      <Figure
        n={2}
        caption="Import dependence by drone-sensor category: LiDAR at roughly 85%, thermal at about 80%, IMU at about 70%, and EO cameras at about 55%."
        ariaLabel="Horizontal bar chart displaying import dependence across sensor categories."
      />

      <h2 id="segmentation">Where the demand sits</h2>
      <p>
        Commercial end-use sectors — agriculture, infrastructure, mining and logistics —
        account for 55–60% of sensor demand, ahead of defence at 25–30% and consumer at
        10–15%. Agriculture alone is roughly a fifth of commercial demand. LiDAR is the
        fastest growing category at over 35% CAGR, pulled by infrastructure inspection, mining
        volumetrics and corridor mapping. The report segments the market five ways — by sensor
        type, end-use sector, UAV class, component tier and region — and identifies the
        high-growth cells where demand and localisation potential overlap.
      </p>

      <Figure
        n={3}
        caption="Demand decomposition by sensor class and end-use sector, highlighting agriculture, infrastructure and logistics as core commercial drivers."
        ariaLabel="Stacked market segmentation chart for drone sensors and payloads in India."
      />

      <h2 id="germanium-free">Engineering around the chokepoint</h2>
      <p>
        The most important finding in the report is that import dependence can be engineered
        around, not just replicated. Eon Space Labs’ germanium-free thermal imaging avoids the
        very material whose supply crisis exposed the category, lowering system cost by 60–70%
        while reaching roughly 80% local manufacturing. It is proof that the right
        architectural choice can convert a chokepoint into an opportunity surface — and a
        template for the LiDAR, IMU and multispectral categories that follow.
      </p>

      <h2 id="business-models">From hardware to data</h2>
      <p>
        Value is migrating from the sensor to the data it captures. Drone-as-a-Service has
        become the dominant model, with margins of 50–65% against 25–35% for hardware.
        Enterprise buyers increasingly want actionable intelligence — orthomosaics, point
        clouds, NDVI layers — rather than raw sensors, which makes sensor fusion and
        AI-enabled edge processing non-negotiable, and shifts the competitive battleground
        from optics to software.
      </p>

      <Figure
        n={4}
        caption="Business-model shift from hardware toward Drone-as-a-Service and data monetisation, with margin uplift over time."
        ariaLabel="Comparison chart between hardware margins and Drone-as-a-Service margins."
      />

      <h2 id="competitive">Who leads</h2>
      <p>
        ideaForge leads on certification and integrated payload ecosystems; Eon Space Labs
        holds proprietary germanium-free thermal with about 80% localisation; Garuda Aerospace
        runs the largest agricultural DaaS fleet; BEL brings defence-PSU radar depth.
        International suppliers still own the high-spec LiDAR and cooled thermal cores. The
        competitive question for the next three years is whether configurability and
        indigenous payloads can outflank superior imported specifications on price, lead time
        and PLI eligibility.
      </p>

      <Figure
        n={5}
        caption="Competitive map of leading Indian and international players across sensor and payload categories."
        ariaLabel="Competitive landscape matrix for India's drone sensors and payloads market."
      />

      <h2 id="forecast">Three phases to 2035</h2>
      <p>
        Growth will not be linear. The report models three phases: certification-led growth
        (2026–2028), as DGCA type certifications unlock enterprise procurement; indigenous
        scaling (2029–2032), as domestic thermal, LiDAR and IMU alternatives reach commercial
        scale and import dependence falls from ~75% toward 55–60%; and export and maturity
        (2033–2035), as Indian sensor-integrated payloads turn cost-competitive abroad and
        exports reach 15–20% of leading players’ revenue.
      </p>

      <Figure
        n={6}
        caption="Three-phase forecast curve to 2035, showing certification-led growth, indigenous scaling, and export-driven maturity."
        ariaLabel="Three-phase trajectory chart for India's drone sensors and payloads market."
      />

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~143-page edition carries the complete market model: thirteen chapters,
        fifty figures and 137 tables. It includes the full five-way segmentation with sizing
        for every cell, the 2021–2035 forecast with scenario analysis and ASP trends, the
        regulatory and PLI deep dive, the supply-chain and import-dependence mapping with the
        Eon Space Labs case study and a localisation roadmap, a technology and TRL assessment
        of every sensor class, detailed company profiles and market-share analysis, end-use
        sector economics, business-model and monetisation analysis, and a closing investment
        and strategic-recommendation chapter for OEMs, sensor manufacturers, investors and
        policymakers.
      </p>

      <div className="pull-stat">
        <div className="ps"><div className="n">13</div><div className="l">Chapters in the full report</div></div>
        <div className="ps"><div className="n">50</div><div className="l">Figures</div></div>
        <div className="ps"><div className="n">137</div><div className="l">Tables</div></div>
        <div className="ps"><div className="n">5</div><div className="l">Segmentation dimensions</div></div>
        <div className="ps"><div className="n">15–20%</div><div className="l">Export revenue potential by 2035 for leaders</div></div>
        <div className="ps"><div className="n">3</div><div className="l">Scenarios to 2035</div></div>
      </div>
    </>
  );
}
