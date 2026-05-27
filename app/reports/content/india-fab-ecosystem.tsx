import type { TocItem } from '../../components/ReportReader';

export const toc: TocItem[] = [
  { id: 'the-wrong-question', label: 'The wrong question' },
  { id: 'what-india-is-building', label: 'What India is actually building' },
  { id: 'the-dependency-stack', label: 'The dependency stack' },
  { id: 'physical-preconditions', label: 'Water, power & land' },
  { id: 'the-packaging-layer', label: 'The packaging layer' },
  { id: 'who-captures-value', label: 'Who captures the value' },
  { id: 'the-talent-constraint', label: 'The talent constraint' },
  { id: 'second-order-effects', label: 'Second-order effects' },
  { id: 'what-to-watch', label: 'What to watch' },
];

function DependencyFigure() {
  return (
    <figure className="report-figure">
      <div className="fig-frame">
        <svg viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India semiconductor dependency map">
          <defs>
            <linearGradient id="rfEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5B544" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <g stroke="#818CF8" strokeOpacity="0.05" strokeWidth="1">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 65} y1="0" x2={i * 65} y2="420" />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 65} x2="760" y2={i * 65} />
            ))}
          </g>
          {/* edges from core */}
          <g stroke="url(#rfEdge)" strokeWidth="1.3" fill="none">
            {[
              [380, 210, 200, 110], [380, 210, 560, 110], [380, 210, 600, 250],
              [380, 210, 170, 280], [380, 210, 380, 340], [380, 210, 120, 190],
              [380, 210, 640, 190], [200, 110, 120, 190], [560, 110, 640, 190],
              [170, 280, 380, 340], [600, 250, 640, 190], [380, 340, 600, 250],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
          </g>
          {/* nodes */}
          {([
            [380, 210, 7, '#818CF8', 'FAB / FRONT-END', 'mid'],
            [200, 110, 5, '#F5B544', 'OSAT / PACKAGING', 'end'],
            [560, 110, 5, '#38e1c4', 'WATER', 'start'],
            [600, 250, 4, '#6366F1', 'POWER', 'start'],
            [170, 280, 4, '#6366F1', 'LOGISTICS', 'end'],
            [380, 340, 4, '#6366F1', 'TALENT', 'mid'],
            [120, 190, 4, '#F5B544', 'CAPITAL', 'end'],
            [640, 190, 4, '#6366F1', 'POLICY', 'start'],
          ] as const).map(([x, y, r, c, label, anchor], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r * 3} fill={c} opacity="0.12" />
              <circle cx={x} cy={y} r={r} fill={c} />
              <text
                x={anchor === 'end' ? x - r - 8 : anchor === 'start' ? x + r + 8 : x}
                y={anchor === 'mid' ? y + r + 18 : y + 4}
                textAnchor={anchor === 'mid' ? 'middle' : anchor}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                fill="#E8E8F0"
                opacity="0.72"
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption>
        <span className="fig-no">Fig. 1</span>
        <span>The semiconductor cluster as a dependency system. The fab is the visible node; the cluster’s viability is set by the edges around it — water, power, packaging, logistics, capital, policy and talent.</span>
      </figcaption>
    </figure>
  );
}

function ValueCaptureFigure() {
  const rows: [string, number, string][] = [
    ['Equipment & tool vendors (imported)', 92, '#6366F1'],
    ['Materials, substrates, specialty gases', 78, '#6366F1'],
    ['Construction & EPC contractors', 64, '#38e1c4'],
    ['Packaging / OSAT operators & labour', 55, '#F5B544'],
    ['Power & water utility providers', 48, '#38e1c4'],
    ['Domestic design & IP', 26, '#F5B544'],
  ];
  return (
    <figure className="report-figure">
      <div className="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Indicative value-capture by layer">
          {rows.map(([label, v, c], i) => {
            const y = 26 + i * 46;
            return (
              <g key={label}>
                <text x="0" y={y + 4} fontFamily="Inter, sans-serif" fontSize="13" fill="#9898A8">{label}</text>
                <rect x="360" y={y - 12} width="380" height="18" rx="3" fill="#ffffff" opacity="0.04" />
                <rect x="360" y={y - 12} width={(380 * v) / 100} height="18" rx="3" fill={c} opacity="0.75" />
                <text x={360 + (380 * v) / 100 + 8} y={y + 2} fontFamily="ui-monospace, monospace" fontSize="11" fill="#E6D1A0">{v}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption>
        <span className="fig-no">Fig. 2</span>
        <span>Indicative, illustrative relative value-capture across cluster layers (0–100 scale, author’s framework — not measured data). The point is structural: the largest early flows accrue to imported tools and materials, not domestic design.</span>
      </figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <div className="exec-summary">
        <div className="es-label">Executive summary</div>
        <p>
          India’s semiconductor effort is usually narrated as a story about chips. It is
          more accurately a story about <strong>land, water, power, packaging and
          people</strong> — and about who captures the value when a state decides to
          manufacture its way up the technology stack.
        </p>
        <ul>
          <li>The first wave is dominated by <strong>assembly, test and packaging (OSAT/ATMP)</strong> and mature-node fabrication, not leading-edge logic.</li>
          <li>The binding constraints are <strong>physical and human</strong> — ultrapure water, firm power, specialty materials and process talent — more than capital, which policy has largely de-risked.</li>
          <li>Early value capture skews heavily toward <strong>imported equipment and materials</strong>; domestic design and IP capture builds slowly and later.</li>
          <li>The most durable beneficiaries may be the <strong>infrastructure and corridor economies</strong> around the clusters, not the chip lines themselves.</li>
        </ul>
      </div>

      <p className="dropcap">
        Every few months a new groundbreaking ceremony adds a node to the map of India’s
        semiconductor ambition. The coverage that follows tends to ask the same question:
        can India make advanced chips? It is the wrong question — or at least an incomplete
        one. A fab is not a factory that happens to make chips; it is the visible apex of a
        dense industrial system whose viability is decided by everything around it.
      </p>

      <p>
        This report takes the system, rather than the chip, as its unit of analysis. It
        asks a different question: when India builds semiconductor capacity, which parts of
        the industrial stack actually capture the value, where do the binding constraints
        sit, and what second-order transformations follow in the regions that host it?
      </p>

      <h2 id="the-wrong-question">
        <span className="h2-no">01 — Framing</span>
        The wrong question
      </h2>
      <p>
        Public debate fixates on the front end — the wafer fab and its process node. Nodes
        are legible: a number, a ranking, a sense of catching up or falling behind. But the
        node tells you very little about industrial impact. A leading-edge fab and a mature-node
        line draw on overlapping ecosystems of water, power, gases, substrates, logistics and
        skilled labour. The economic transformation a cluster produces is largely a function
        of that surrounding system, not the nanometre figure on the press release.
      </p>
      <p>
        India’s flagship programme — the India Semiconductor Mission, backed by a fiscal
        envelope first announced at roughly ₹76,000 crore and subsequently broadened — was
        designed precisely to underwrite this surrounding system, offering support across
        fabrication, display, compound semiconductors, packaging and design.<sup><a href="#cite-1">[1]</a></sup>
        The policy architecture implicitly concedes the point this report makes explicit: the
        chip is the smallest part of the problem.
      </p>

      <h2 id="what-india-is-building">
        <span className="h2-no">02 — The build</span>
        What India is actually building
      </h2>
      <p>
        Strip away the framing and the early portfolio is clear. The announced projects
        cluster around two categories: <strong>mature-node and specialty fabrication</strong>,
        and <strong>back-end assembly, test and packaging</strong>. Tata Electronics’ fab in
        Dholera, in partnership with Taiwan’s Powerchip (PSMC), targets mature and specialty
        nodes rather than the bleeding edge.<sup><a href="#cite-2">[2]</a></sup> The larger number
        of projects, however, sit in the back end: Micron’s assembly and test facility in
        Sanand, Tata’s packaging plant in Assam, and OSAT investments from players such as CG
        Power and Kaynes.<sup><a href="#cite-3">[3]</a></sup>
      </p>
      <p>
        This is not a shortcoming; it is the textbook entry strategy. Mature nodes and packaging
        are where most of the world’s chips by volume are actually made, where capital intensity
        is lower, where ramps are faster, and where a new manufacturing economy can build the
        operational muscle — supplier networks, trained operators, regulatory throughput — that a
        future leading-edge ambition would require. The realistic near-term story is therefore an
        <em> industrialisation</em> story, not a frontier-technology story.
      </p>

      <DependencyFigure />

      <h2 id="the-dependency-stack">
        <span className="h2-no">03 — Structure</span>
        The dependency stack
      </h2>
      <p>
        Treat the cluster as a graph (Fig. 1). At the centre sits the fab or packaging line.
        Radiating outward are the dependencies that determine whether it can run at
        competitive yield and cost: ultrapure water and firm power on the utility side;
        substrates, photoresists, specialty gases and chemicals on the materials side;
        bonded logistics and customs throughput; capital; policy stability; and the deepest
        constraint of all, process talent.
      </p>
      <p>
        The instructive feature of the graph is that the high-value, high-risk edges point
        <em> outward and abroad</em>. The tools come from a handful of global equipment makers.
        The materials come from established suppliers concentrated in East Asia. In the early
        years, the cluster is a node that imports most of its critical inputs and exports a
        manufacturing service. Localisation of those edges — not the existence of the node — is
        the real measure of ecosystem maturity.
      </p>

      <div className="pull-stat">
        <div className="ps"><div className="n">~10B+</div><div className="l">USD-scale public support committed across India’s semiconductor programme (announced)</div></div>
        <div className="ps"><div className="n">2</div><div className="l">Dominant project types so far: mature-node fabs and back-end OSAT/ATMP</div></div>
        <div className="ps"><div className="n">Edges</div><div className="l">Where the strategic risk lives — water, power, materials, talent</div></div>
      </div>

      <h2 id="physical-preconditions">
        <span className="h2-no">04 — Preconditions</span>
        Water, power and land
      </h2>
      <p>
        Advanced manufacturing is, before it is anything else, a physical proposition.
        Fabrication consumes very large volumes of <strong>ultrapure water</strong>, and a
        meaningful share of input water is lost in the purification and use cycle. That places
        a semiconductor cluster in direct, structural relationship with the hydrology of its
        host region — surface allocation, groundwater stress, recycling capacity and monsoon
        variability all become industrial variables. The siting of clusters in Gujarat brings
        this dependency into sharp relief, and it is the explicit subject of forthcoming work
        on the Dholera corridor.
      </p>
      <p>
        <strong>Power</strong> is the second precondition: not merely cheap power, but
        <em> firm, clean, uninterrupted</em> power, since process excursions from supply
        instability can destroy in-progress wafers worth far more than the energy saved.
        <strong> Land and the corridor</strong> form the third — the reason a Special Investment
        Region matters is that it bundles land, trunk infrastructure and single-window approvals
        into something a global operator can underwrite.
      </p>
      <p>
        The strategic insight is that these preconditions are <em>regional public goods</em>.
        Once built for one anchor tenant, they lower the entry cost for the next — which is how
        a single fab decision can seed a cluster. It is also why the infrastructure layer, not
        the chip line, may prove the more durable beneficiary.
      </p>

      <h2 id="the-packaging-layer">
        <span className="h2-no">05 — The back end</span>
        The packaging layer and where jobs land
      </h2>
      <p>
        If one layer deserves more attention than it receives, it is back-end packaging.
        Assembly, test and packaging is less capital-intensive than front-end fabrication,
        ramps faster, and is more labour-absorbing per dollar invested. For a country whose
        political economy needs <em>employment</em> as much as it needs technological prestige,
        the back end is arguably the more important story — and it is where the first
        meaningful wave of semiconductor jobs will land.
      </p>
      <p>
        Packaging is also where the technology frontier is quietly moving. As gains from
        shrinking transistors slow, <strong>advanced packaging</strong> — chiplets, 2.5D and
        3D integration — has become a primary axis of performance improvement. A back-end-first
        entry is therefore not a consolation prize; it positions a cluster on a rising part of
        the value chain. The risk, examined in our signal on the subject, is input dependency:
        substrates, lead-frames and specialty consumables remain thin and largely imported.
      </p>

      <ValueCaptureFigure />

      <h2 id="who-captures-value">
        <span className="h2-no">06 — Beneficiaries</span>
        Who captures the value
      </h2>
      <p>
        Return to the title’s question. In the early phase, the largest value flows accrue to
        actors mostly outside the host economy: the global equipment vendors whose tools fill
        the cleanroom, and the materials suppliers who feed it (Fig. 2 illustrates the
        structural skew — it is a framework, not measured data). Inside the host economy, the
        clearest near-term beneficiaries are <strong>construction and EPC contractors</strong>,
        <strong> utility providers</strong>, and the <strong>operators and workforce of the
        packaging lines</strong>.
      </p>

      <blockquote className="report-quote">
        <p>The value a country captures from a fab is not set on the day it opens. It is set by how quickly the edges of the dependency graph move onshore.</p>
        <cite>— Working thesis, Techadyant Labs</cite>
      </blockquote>

      <p>
        Domestic <strong>design and IP</strong> — the highest-margin layer — capture builds
        slowest, because it depends on talent depth, anchor customers and time. The
        Design-Linked Incentive scheme is an attempt to seed it deliberately rather than waiting
        for it to emerge.<sup><a href="#cite-4">[4]</a></sup> Whether India ends up a
        manufacturing-service economy in chips, or climbs into design and IP, is the single most
        consequential open question — and it will be answered over a decade, not a news cycle.
      </p>

      <h2 id="the-talent-constraint">
        <span className="h2-no">07 — The human edge</span>
        The talent constraint
      </h2>
      <p>
        Capital can be committed in a board meeting; a fab can be built in two to three years.
        The capability to run it at competitive yield is a different kind of asset —
        accumulated, tacit, and held by process engineers, equipment specialists and
        yield-management teams who cannot be procured on the timeline of the tools. This is the
        asymmetry that ultimately sets the ramp curve, and it is the subject of a dedicated
        signal in this edition.
      </p>
      <p>
        Every late-entrant manufacturing economy has met the same wall and answered it the same
        way: seed the early lines with experienced expatriate engineers while building domestic
        pipelines through universities, vendor training and on-the-job ramp. Both halves take
        years. The leading indicators worth tracking are unglamorous — returning-diaspora hiring,
        equipment-vendor training footprints, university-to-fab placement — but they predict
        sustained output far better than groundbreaking ceremonies.
      </p>

      <h2 id="second-order-effects">
        <span className="h2-no">08 — Spillovers</span>
        Second-order effects
      </h2>
      <p>
        The most interesting consequences of an industrial cluster are rarely the ones it was
        built for. A semiconductor anchor reorganises the economic geography around it: it
        pulls in component suppliers, draws skilled labour and the services that follow them,
        upgrades regional power and water infrastructure, and raises land values along the
        corridor. These spillovers can outlast and outweigh the direct output of the lines
        themselves.
      </p>
      <p>
        They also redistribute. Water and power committed to a cluster are water and power not
        available elsewhere; corridor land that appreciates for some is priced out for others.
        A serious analysis of who benefits has to hold both the <em>creation</em> and the
        <em> reallocation</em> in view. The cluster is not only an engine of new value; it is a
        rearrangement of existing claims on scarce regional resources.
      </p>

      <h2 id="what-to-watch">
        <span className="h2-no">09 — Outlook</span>
        What to watch
      </h2>
      <p>
        The honest verdict is that India has done the legible, fundable part — committing
        capital and policy — and now faces the harder, slower part: localising materials,
        securing water and firm power, and growing process talent. Progress will not show up in
        node announcements. It will show up at the edges of the dependency graph.
      </p>
      <ul>
        <li><strong>Materials localisation</strong> — substrate, gas and chemical supply agreements are the truest tell of ecosystem depth.</li>
        <li><strong>Packaging employment</strong> — a more reliable near-term metric than wafer-fab headcount.</li>
        <li><strong>Water and power resilience</strong> — the binding physical constraints, and the clearest source of second-order conflict.</li>
        <li><strong>Talent flows</strong> — returning-diaspora and vendor-training footprints over groundbreakings.</li>
        <li><strong>Design & IP capture</strong> — the decadal question of whether India climbs the value chain or services it.</li>
      </ul>
      <p>
        Who really benefits from India’s fab ecosystem? In the near term: the toolmakers, the
        builders, the utilities and the packaging workforce. In the long term, the answer
        depends entirely on how fast the country moves the high-value edges of the system
        onshore — and that is a question of water, power and people far more than of nanometres.
      </p>

      <div className="report-citations">
        <h2 id="references">References &amp; sources</h2>
        <ol>
          <li id="cite-1">India Semiconductor Mission / Ministry of Electronics &amp; IT — programme structure and fiscal support. <a href="https://www.ism.gov.in" target="_blank" rel="noopener">ism.gov.in</a>; <a href="https://www.meity.gov.in" target="_blank" rel="noopener">meity.gov.in</a>.</li>
          <li id="cite-2">Tata Electronics &amp; Powerchip Semiconductor Manufacturing Corp (PSMC), Dholera fab — public project announcements (mature / specialty nodes).</li>
          <li id="cite-3">Back-end / OSAT projects — Micron (Sanand assembly &amp; test), Tata Electronics (Assam packaging), CG Power, Kaynes — public company and government announcements.</li>
          <li id="cite-4">Design-Linked Incentive (DLI) scheme — MeitY / India Semiconductor Mission programme documentation.</li>
        </ol>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '20px', lineHeight: 1.5 }}>
          Note: This report is independent analysis built on publicly reported information.
          Figures described as “announced” reflect public statements; Figure 2 is an explicit
          analytical framework, not measured data. Nothing here is investment, legal or policy advice.
        </p>
      </div>
    </>
  );
}
