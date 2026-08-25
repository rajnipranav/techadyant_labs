import type { TocItem } from '../../components/ReportReader';

const SLUG = 'dholera-semiconductor-supplier-ecosystem';

interface FigProps {
  n: number;
  caption: string;
  ariaLabel?: string;
}

function Figure({ n, caption, ariaLabel }: FigProps) {
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

export const toc: TocItem[] = [
  { id: 'executive-summary', label: 'Executive summary' },
  { id: 'dholera-as-anchor', label: 'Dholera as anchor node' },
  { id: 'what-india-is-building', label: 'What India is building' },
  { id: 'the-supplier-stack', label: 'The supplier stack' },
  { id: 'the-binding-constraints', label: 'Binding constraints' },
  { id: 'regional-catchment', label: 'Regional catchment' },
  { id: 'investment-priority', label: 'Investment priority' },
  { id: 'what-to-watch', label: 'What to watch' },
];

export function ReportContent() {
  return (
    <>
      <div className="exec-summary">
        <div className="es-label">Executive summary · Edition 01</div>
        <p>
          Dholera is the most consequential unfinished node in India’s semiconductor
          strategy. The Tata Electronics–PSMC fab, the ISM-approved project stack,
          and the Gujarat semiconductor policy create a credible anchor. What they do not
          yet create is a self-reinforcing supplier ecosystem. This report is a
          component-level readiness assessment across wafer-fab equipment, bulk gases and
          chemicals, photoresists and substrates, packaging-and-testing infrastructure,
          wafer handling, metrology, logistics, power, water, and the policy levers that
          determine whether the node produces an industrial cluster or a capital-and-land
          headline.
        </p>
        <ul>
          <li>
            The value is not in the fab alone. <strong>Packaging, materials, equipment
            subcomponents, testing, logistics, power and water</strong> constitute the
            larger share of supplier opportunity and the larger share of current import
            dependency.
          </li>
          <li>
            Localisation is uneven. <strong>OSAT/ATMP and mature-node backend segments
            show more buildable depth</strong> than front-end wafer-fab materials and
            high-purity consumables.
          </li>
          <li>
            <strong>Industrial policy, continuous power, ultrapure water, logistics
            connectivity and process skills</strong> are now the binding constraints, not
            capital commitment.
          </li>
          <li>
            The ten-year addressable opportunity in Gujarat-linked semiconductor supplier
            segments is modelled at roughly <strong>₹28,000–62,000 crore</strong>, with a
            faster path through packaging, testing, gases, automation and logistics than
            through front-end materials.
          </li>
        </ul>
      </div>

      <div className="pull-stat">
        <div className="ps"><div className="n">₹1.64L+ CR</div><div className="l">Announced semiconductor project capex around India</div></div>
        <div className="ps"><div className="n">91K cr</div><div className="l">Tata–PSMC fab at Dholera</div></div>
        <div className="ps"><div className="n">~62%</div><div className="l">Approximate share of margin in the materials, equipment and packaging layers</div></div>
        <div className="ps"><div className="n">0 CoWoS</div><div className="l">Advanced packaging facilities announced in India as of mid-2026</div></div>
        <div className="ps"><div className="n">86–93%</div><div className="l">Estimated import share in photoresists / specialty gases / lithography inputs</div></div>
        <div className="ps"><div className="n">4 MLD+</div><div className="l">Ultrapure water demand scale for a 28–110 nm fab cluster</div></div>
      </div>

      <p className="dropcap">
        The India Semiconductor Mission is real, financed, and underway. What remains
        under-narrated is the supplier map beneath the headline projects. A fab is the
        visible apex; the cluster is decided by everything around it — bulk gases,
        chemicals, substrates, photoresists, cleanroom equipment, wafer handling,
        metrology, packaging substrates, logistics, power, water, and the skills base
        that keeps yield competitive. This report maps those layers for Dholera and the
        broader Gujarat supplier catchment.
      </p>

      <h2 id="dholera-as-anchor">
        <span className="h2-no">01 — Anchor</span>Dholera as an industrial node
      </h2>
      <p>
        Dholera sits at the intersection of three durable advantages: designated
        manufacturing land, a state-level semiconductor incentive framework, and proximity
        to ports and downstream electronics demand. The Tata Electronics–PSMC fab anchors
        the node with a mature-node, high-volume logic footprint rather than a
        leading-edge demonstration. That matters because mature nodes are where the
        world’s chip volume actually runs, where capital intensity is lower, and where
        supplier localisation is structurally more achievable.
      </p>
      <p>
        The ISM portfolio adds complementary back-end weight: OSAT and ATMP facilities,
        compound-semiconductor units, and downstream packaging capacity. Together they
        create demand signals for the chemicals, materials, precision components and
        automation that a standalone fab would not generate. The missing piece is the
        supplier response, especially in front-end materials and equipment subcomponents
        where domestic capability is thin.
      </p>

      <Figure
        n={4}
        caption="ISM-approved projects and the Dholera anchor — fab, OSAT and downstream electronics demand create a composite supplier opportunity."
        ariaLabel="Map of approved semiconductor projects in India with Dholera as anchor fab node."
      />

      <Figure
        n={6}
        caption="Dholera readiness radar — the node scores highest on policy and land, and lowest on materials, water certainty and test infrastructure."
        ariaLabel="Radar chart for Dholera across semiconductor-ready dimensions."
      />

      <h2 id="what-india-is-building">
        <span className="h2-no">02 — Build</span>What India is actually building
      </h2>
      <p>
        The early portfolio clusters around two categories: mature-node and specialty
        fabrication, and back-end assembly, test and packaging. That is not a shortcoming;
        it is the textbook entry sequence. The larger opportunity sits in the supplier
        layers that make these nodes commercially viable at competitive yield and cost.
      </p>
      <p>
        Wafer-fab equipment, specialty gases, high-purity chemicals, photoresists,
        substrates, cleanroom hardware, bonded logistics, and metrology are still
        import-led. Domestic capability exists in pockets — specialty gases, electronics
        chemicals, some cleanroom integration — but not at the volume, purity and
        qualification standards a high-volume fab demands. Packaging and testing show
        more domestic content because India already hosts mature assembly operations and
        equipment localisation is easier than chemical-process localisation.
      </p>

      <Figure
        n={1}
        caption="India fab capex timeline — the capital cycle is maturing; the supplier cycle is not yet synchronized."
        ariaLabel="Timeline of announced semiconductor capex in India through the 2020s."
      />

      <Figure
        n={20}
        caption="India OSAT capacity and packaging localisation — back-end readiness is higher than front-end materials."
        ariaLabel="Stacked view of India OSAT capacity and packaging localisation indicators."
      />

      <h2 id="the-supplier-stack">
        <span className="h2-no">03 — Supplier stack</span>Layers, gaps and readiness
      </h2>
      <p>
        Readiness varies sharply by layer. Gases and chemicals show the highest volume
        demand and the lowest domestic substitution rate outside standard industrial
        grades. Metals and wafer-handling consumables have more Indian engineering
        content but still depend on imported upstream intermediates. Metrology is both
        the most difficult to localise and the most yield-sensitive; Indian capability is
        concentrated in instrument integration rather than detector or source manufacturing.
      </p>
      <p>
        Logistics, warehousing and bonded transport are underappreciated chokepoints. A
        fab importing 20–30 specialty SKUs with short shelf life and strict storage
        requirements needs more than port access; it needs cold-chain-grade chemical
        logistics, quarantine capacity, and vendor-managed inventory close to the site.
        Gujarat has port adjacency; it does not yet have the specialized logistics
        catchment a semiconductor-grade supplier park would require.
      </p>

      <Figure
        n={8}
        caption="Specialty gas demand profile — bulk and high-purity grades diverge in localisability."
        ariaLabel="Chart showing specialty gas demand across Indian semiconductor demand centers."
      />

      <Figure
        n={9}
        caption="Gas supplier share — domestic producers cover industrial-grade segments; specialty and high-purity remain import-led."
        ariaLabel="Donut chart of gas supplier share by grade and geography."
      />

      <Figure
        n={11}
        caption="Chemicals demand — photoresists, etchants, CMP slurries and dopants are the highest-import-intensity segments."
        ariaLabel="Chart of semiconductor chemical demand by segment and import intensity."
      />

      <Figure
        n={16}
        caption="Wafer handling localisation — robotics, FOUPs and front-opening unified pods are dominated by Japanese and Korean equipment makers."
        ariaLabel="Stacked bar showing localisation share across wafer handling equipment categories."
      />

      <h2 id="the-binding-constraints">
        <span className="h2-no">04 — Constraints</span>Water, power, policy and talent
      </h2>
      <p>
        Capital is no longer the binding constraint; the India Semiconductor Mission has
        de-risked the investment decision for anchor projects. The binding constraints are
        now physical and institutional: ultrapure water at fab-grade volumes and
        consistent quality; firm, dedicated power with low outage frequency; logistics
        readiness for high-value chemical inputs; and process engineering talent at scale.
      </p>
      <p>
        Water is the most acute near-term constraint. A 28–110 nm fab cluster will demand
        multiple million litres per day of ultrapure water, with rejected streams that
        require treatment before reuse or discharge. Gujarat’s water budget, seasonal
        variability, and the interaction between industrial, agricultural and urban demand
        need explicit allocation and recycling targets. The report models the water
        arithmetic for a Dholera-scale cluster and maps the policy levers that close the
        gap.
      </p>
      <p>
        Talent is the longer-cycle constraint. Semiconductor process engineering, cleanroom
        operations, materials QA, and equipment maintenance require multi-year curricula
        and hands-on exposure that India currently provides at a fraction of the required
        scale. The near-term bridge is hiring returnee talent, importing technician
        training programmes, and partnering with equipment makers for on-site capability
        transfer.
      </p>

      <Figure
        n={13}
        caption="Ultrapure water Sankey — demand, treatment stage losses and reuse opportunities in a fab cluster."
        ariaLabel="Sankey diagram of ultrapure water flows, losses and reuse in a semiconductor fab cluster."
      />

      <Figure
        n={14}
        caption="Cleanroom cost waterfall — land and shell are the smallest shares; tools, utilities and materials dominate cost of ownership."
        ariaLabel="Waterfall chart of cleanroom cost components from construction through operations."
      />

      <h2 id="regional-catchment">
        <span className="h2-no">05 — Catchment</span>Gujarat and the broader domestic base
      </h2>
      <p>
        Dholera’s domestic supplier catchment is not limited to Gujarat. The report
        assesses supplier readiness across Maharashtra, Tamil Nadu, Karnataka, Telangana
        and Delhi-NCR — the states that already host the bulk of India’s electronics
        manufacturing, industrial gases, chemicals, precision engineering and logistics
        capability. The conclusion is that political commitment to Dholera needs to be
        matched by an equally explicit supplier-park and logistics framework if the node
        is to avoid becoming a fab island surrounded by import-dependent supply chains.
      </p>

      <Figure
        n={18}
        caption="Logistics heatmap — Gujarat’s port adjacency must be converted into semiconductor-grade chemical logistics capability."
        ariaLabel="Heatmap of logistics readiness across Indian industrial regions for semiconductor inputs."
      />

      <Figure
        n={23}
        caption="Cluster benchmark radar — Dholera compared against leading and emerging clusters on power, water, talent, policy, logistics and supplier depth."
        ariaLabel="Radar chart benchmarking Dholera against competing semiconductor clusters."
      />

      <h2 id="investment-priority">
        <span className="h2-no">06 — Priority</span>Where capital creates the most optionality
      </h2>
      <p>
        Not all supplier opportunities are equally investable today. The report ranks
        surfaces across three dimensions: capital intensity, time to revenue, and
        import-dependency severity. The highest-priority surfaces for the 2026–2030
        window are packaging substrates, high-purity gases, wafer-handling consumables,
        test equipment integration, logistics enclaves, captive power and raw-water
        recycling infrastructure. Longer-horizon plays include photoresist manufacturing,
        coater-developer localisation, and advanced metrology subsystems.
      </p>

      <Figure
        n={25}
        caption="Investment priority matrix — speed, depth and capital intensity combine to define the actionable sequence."
        ariaLabel="Two-by-two investment priority matrix with supplier opportunity surfaces."
      />

      <Figure
        n={29}
        caption="Capability gap matrix — supplier readiness versus import intensity across the semiconductor stack."
        ariaLabel="Heatmap-style capability gap matrix by segment and readiness dimension."
      />

      <h2 id="what-to-watch">
        <span className="h2-no">07 — Watch list</span>Scenarios, signals and decision thresholds
      </h2>
      <p>
        The report closes with three scenarios for Dholera’s supplier ecosystem evolution
        through 2035: a Base case in which announced policy instruments are implemented
        on schedule and supplier localisation proceeds at historical Indian industrial
        rates; an Accelerated case in which targeted co-investment, logistics parks and
        skills academies compress the timeline; and a Constrained case in which water
        allocation disputes, power interconnection delays and equipment qualification
        bottlenecks leave the fab operational but ecosystem formation lagging by seven to
        ten years.
      </p>
      <p>
        The decision thresholds are practical: if domestic gas and chemical capability is
        not at pilot-production scale within eighteen months of fab tool-in, the risk
        profile rises sharply. If the Dholera logistics framework does not explicitly
        include semiconductor-grade chemical warehousing and bonded transport by the time
        commercial wafers flow, import costs and insurance premiums will understate the
        true cost of Indian manufacturing.
      </p>

      <Figure
        n={27}
        caption="Scenario comparison — Base, Accelerated and Constrained paths for Dholera supplier ecosystem development."
        ariaLabel="Scenario comparison chart showing three trajectories for Dholera supplier ecosystem maturity."
      />

      <Figure
        n={32}
        caption="Decision tree for anchor investors and policy teams — whether to co-invest in supplier parks, logistics enclaves or skills infrastructure."
        ariaLabel="Decision tree for semiconductor supplier ecosystem investment sequencing around Dholera."
      />

      <div className="pull-stat">
        <div className="ps"><div className="n">₹28K–62K CR</div><div className="l">Ten-year addressable Gujarat-linked supplier opportunity</div></div>
        <div className="ps"><div className="n">86–93%</div><div className="l">Import dependency in photoresists, specialty gases, lithography inputs</div></div>
        <div className="ps"><div className="n">0</div><div className="l">Advanced packaging facilities announced in India as of mid-2026</div></div>
        <div className="ps"><div className="n">4 MLD+</div><div className="l">Ultrapure water demand scale for a Dholera-style fab cluster</div></div>
        <div className="ps"><div className="n">18 mo</div><div className="l">Decision window: domestic gas/chemical pilot production versus fab tool-in</div></div>
      </div>

      <p>
        The full report continues with six additional sections: supplier readiness scores
        by segment, a 130-page dependency and opportunity map, three scenario models for
        the Dholera catchment, a 32-figure evidence lattice, eighteen tables, and five
        appendices with supplier, policy, infrastructure, investment and skills-reference
        tables. The conclusion is that Dholera can become a genuine semiconductor cluster,
        but only if supplier policy, water, power, logistics and skills are treated as
        first-class strategic bets rather than downstream afterthoughts.
      </p>
    </>
  );
}
