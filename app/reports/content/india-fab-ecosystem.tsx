import type { TocItem } from '../../components/ReportReader';

// Full structure (advertises the report's depth). Sections 04+ live behind the
// paywall and are served by /api/report-body after an entitlement check.
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
                fontFamily="ui-monospace, monospace" fontSize="11" fill="#E8E8F0" opacity="0.72"
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

/** FREE PREVIEW — exec summary + framing + first three sections. */
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

      <h2 id="the-wrong-question"><span className="h2-no">01 — Framing</span>The wrong question</h2>
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
        fabrication, display, compound semiconductors, packaging and design. The policy
        architecture implicitly concedes the point this report makes explicit: the chip is
        the smallest part of the problem.
      </p>

      <h2 id="what-india-is-building"><span className="h2-no">02 — The build</span>What India is actually building</h2>
      <p>
        Strip away the framing and the early portfolio is clear. The announced projects
        cluster around two categories: <strong>mature-node and specialty fabrication</strong>,
        and <strong>back-end assembly, test and packaging</strong>. Tata Electronics’ fab in
        Dholera, in partnership with Taiwan’s Powerchip (PSMC), targets mature and specialty
        nodes rather than the bleeding edge. The larger number of projects, however, sit in
        the back end: Micron’s assembly and test facility in Sanand, Tata’s packaging plant in
        Assam, and OSAT investments from players such as CG Power and Kaynes.
      </p>
      <p>
        This is not a shortcoming; it is the textbook entry strategy. Mature nodes and packaging
        are where most of the world’s chips by volume are actually made, where capital intensity
        is lower, where ramps are faster, and where a new manufacturing economy can build the
        operational muscle a future leading-edge ambition would require. The realistic near-term
        story is therefore an <em>industrialisation</em> story, not a frontier-technology story.
      </p>

      <DependencyFigure />

      <h2 id="the-dependency-stack"><span className="h2-no">03 — Structure</span>The dependency stack</h2>
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
    </>
  );
}
