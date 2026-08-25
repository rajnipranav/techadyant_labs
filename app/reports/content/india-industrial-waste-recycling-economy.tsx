import type { TocItem } from '../../components/ReportReader';

const SLUG = 'india-industrial-waste-recycling-economy';

export const toc: TocItem[] = [
  { id: 'executive-summary', label: 'Executive summary' },
  { id: 'the-thesis', label: 'Recycling as an industrial base' },
  { id: 'market-size', label: 'Market size and trajectory' },
  { id: 'materials-flow', label: 'Materials flow and recovery' },
  { id: 'energy-and-chemicals-recovery', label: 'Energy and chemicals recovery' },
  { id: 'import-dependence', label: 'Import dependence' },
  { id: 'business-models', label: 'Business models' },
  { id: 'competitive', label: 'Who leads' },
  { id: 'corridor-opportunity', label: 'Corridor opportunity' },
  { id: 'forecast', label: 'Three phases to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

function Figure({ n, caption, ariaLabel }: { n: number; caption: string; ariaLabel?: string }) {
  return (
    <figure className="report-figure" id={`fig-${n}`}>
      <div className="fig-frame">
        <img
          src={`/figures/${SLUG}/fig_${String(n).padStart(2, '0')}.svg`}
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
          India is sitting on one of the world’s largest untapped industrial recycling
          economies, but most of it is still treated as waste rather than feedstock. This
          report maps the recovery opportunity across battery metals, e-waste, industrial
          chemicals and critical minerals, and sizes the revenue, margin and capability
          stack for the decade ahead.
        </p>
        <ul>
          <li>
            The recycling economy already encompasses <strong>battery metals</strong>,
            <strong> e-waste</strong>, <strong>chemical recovery</strong> and
            <strong> critical-minerals loops</strong> that are still largely export-led or
            informal-sector-dependent.
          </li>
          <li>
            <strong>Black mass</strong>, <strong>lithium</strong>,
            <strong>cobalt/nickel recovery</strong>, <strong>PCB fractions</strong> and
            <strong>semiconductor-grade chemical recycling</strong> are the highest-value
            opportunity surfaces.
          </li>
          <li>
            The ten-year addressable opportunity across mapped segments is modelled in the
            <strong> ₹18,000–35,000 crore</strong> band, with the fastest path through
            battery-recycling clusters, e-waste urban mines and industrial-chemical
            recovery corridors.
          </li>
          <li>
            Policy support is strengthening through <strong>Battery Rules</strong>,
            <strong> E-Waste Rules</strong>, <strong> PLI-like recycling incentives</strong>
            and state-level industrial clusters, but implementation, formalisation and
            technology depth remain uneven.
          </li>
          <li>
            The competitive advantage will belong to operators who can demonstrate
            <strong> verified recovery yields</strong>, <strong> traceable feedstock</strong>
            and <strong> scalable secondary-refining capability</strong>, not just
            collection volume.
          </li>
        </ul>
      </div>

      <div className="pull-stat">
        <div className="ps"><div className="n">₹18K–35K CR</div><div className="l">Ten-year addressable recycling-economy opportunity</div></div>
        <div className="ps"><div className="n">~60–75%</div><div className="l">Estimated informal sector share in e-waste and battery scrap today</div></div>
        <div className="ps"><div className="n">3.2 mn tpa+</div><div className="l">Scale of India’s e-waste and battery waste stream growth</div></div>
        <div className="ps"><div className="n">85–92%</div><div className="l">Import dependence in specialty chemicals and refined metals inputs</div></div>
        <div className="ps"><div className="n">~26%</div><div className="l">Modelled CAGR for the battery-recycling revenue stack</div></div>
        <div className="ps"><div className="n">0</div><div className="l">Large-scale secondary lithium refineries operational in India as of mid-2026</div></div>
      </div>

      <h2 id="the-thesis" className="dropcap">Recycling as an industrial base</h2>
      <p>
        The recycling economy is often framed as an environmental compliance story. The
        stronger frame is industrial strategy: India is importing the same critical
        materials it is simultaneously throwing away, and the gap between waste stream
        composition and refining capability is where the next industrial playbook is being
        written. Battery metals, printed-circuit-board fractions, specialty chemicals and
        critical-minerals residues are all feedstock for a secondary industrial base that
        does not yet exist at scale.
      </p>

      <h2 id="market-size">Market size and trajectory</h2>
      <p>
        The report models the recyclable-metal, chemical-recovery and e-waste-processing
        markets across three scenarios. The addressable opportunity is not uniform: battery
        metals, lithium-ion recycling and high-value PCB fractions show faster monetisation
        than bulky plastics recovery or low-grade ferrous scrap. Revenue is weighted toward
        refined chemicals and metals rather than collection.
      </p>

      <Figure
        n={1}
        caption="India industrial waste and recycling economy market trajectory — battery metals and e-waste fractions drive the faster-growth segments."
        ariaLabel="Chart showing the market trajectory for India's recycling economy."
      />

      <h2 id="materials-flow">Materials flow and recovery</h2>
      <p>
        Battery waste, end-of-life electronics, industrial process residues and end-of-life
        solar and wind assets are creating a complex multi-material stream. The report
        decomposes the flow into recoverable fractions: lithium, cobalt, nickel, manganese,
        copper, aluminium, gold, silver, palladium, rare-earth magnets, silicon, glass and
        polymers. Recovery economics vary sharply by collection quality, sorting technology
        and downstream refining capability.
      </p>

      <Figure
        n={2}
        caption="Black mass and battery-metal recovery flow — feedstock, hydrometallurgical processing and refined products."
        ariaLabel="Flow diagram of black mass recovery and battery-metal refining."
      />

      <h2 id="energy-and-chemicals-recovery">Energy and chemicals recovery</h2>
      <p>
        Beyond metals, the recycling economy has a large energy and chemicals layer. Waste
        oils, solvents, acids, alkalis and process chemicals can be recovered, purified and
        reintroduced into industrial supply chains. The report maps the segments where
        recovery yields are high enough to justify closed-loop infrastructure and where
        contaminant profiles make reuse economically attractive.
      </p>

      <Figure
        n={3}
        caption="E-waste recovery decomposition — material streams, current recovery rates and upgradeable fractions."
        ariaLabel="Stacked chart of e-waste recovery streams and recovery rates."
      />

      <h2 id="import-dependence">Import dependence</h2>
      <p>
        India imports a large share of the specialty chemicals, refined metals and advanced
        materials that its recycling economy could supply domestically. The report maps
        import dependence in lithium hydroxide, cobalt salts, nickel sulphate, copper
        cathodes, high-purity acids, electronic-grade solvents and critical-minerals
        intermediates, and shows how secondary recovery can reduce exposure.
      </p>

      <Figure
        n={4}
        caption="Revenue and margin decomposition by recycling segment — chemicals and refined metals dominate value."
        ariaLabel="Donut chart of revenue share by recycling segment."
      />

      <h2 id="business-models">Business models</h2>
      <p>
        The dominant models are aggregator-led informal collection, formal producer-led
        take-back, contract-chemical recovery for industrial parks, and integrated
        recycling-refining clusters. Margins are higher in refining and chemicals recovery
        than in collection or mechanical processing. The report assesses each model against
        capital intensity, regulatory risk, feedstock security and scalability.
      </p>

      <h2 id="competitive">Who leads</h2>
      <p>
        Domestic players are active in battery recycling, e-waste processing and industrial
        waste management, but few operate at the scale or technical depth required for
        secondary refining of critical materials. International best practice is
        concentrated in Europe, China and Japan, where policy has forced higher formal
        collection rates and where advanced hydrometallurgical and direct-recycling
        processes are closer to commercial maturity.
      </p>

      <Figure
        n={5}
        caption="TAM, SAM and SOM for the recycling economy by segment and corridor."
        ariaLabel="Market sizing chart showing TAM, SAM and SOM for India's recycling economy."
      />

      <h2 id="corridor-opportunity">Corridor opportunity</h2>
      <p>
        Recycling infrastructure clusters around industrial corridors, port-adjacent special
        economic zones and existing renewable-energy and electronics-manufacturing hubs.
        The report scores seven regional corridors on feedstock density, logistics,
        regulatory readiness, power and water availability, and proximity to downstream
        manufacturers who can use recovered materials.
      </p>

      <Figure
        n={6}
        caption="Regional recycling-economy heatmap — industrial corridors scored on feedstock density, logistics and regulatory readiness."
        ariaLabel="Heatmap of industrial corridors for recycling economy opportunity."
      />

      <h2 id="forecast">Three phases to 2035</h2>
      <p>
        Base case: formalisation rises gradually, recovery rates improve slowly, and most
        secondary-material value remains in mechanical processing. Accelerated case:
        policy enforcement, producer-responsibility tightening and targeted recycling
        clusters push recovery rates higher and unlock refining investment. Constrained
        case: infrastructure delays, feedstock leakage to unorganised channels and
        technology bottlenecks keep the sector fragmented and low-margin.
      </p>

      <Figure
        n={7}
        caption="Funding and investment trends by segment — battery metals lead announced capital; chemicals recovery remains underfunded."
        ariaLabel="Bar chart of funding and investment by recycling segment."
      />

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full report includes thirty-one figures, twenty-one tables, scenario models,
        five appendices and a supplier and policy reference framework. It is designed for
        operators, investors and policymakers who need to move from waste narrative to
        industrial execution.
      </p>

      <div className="pull-stat">
        <div className="ps"><div className="n">31</div><div className="l">Figures</div></div>
        <div className="ps"><div className="n">21</div><div className="l">Tables</div></div>
        <div className="ps"><div className="n">5</div><div className="l">Appendices</div></div>
        <div className="ps"><div className="n">₹18K–35K CR</div><div className="l">Ten-year addressable opportunity</div></div>
        <div className="ps"><div className="n">3</div><div className="l">Scenarios to 2035</div></div>
        <div className="ps"><div className="n">7</div><div className="l">Regional corridors scored</div></div>
      </div>
    </>
  );
}
