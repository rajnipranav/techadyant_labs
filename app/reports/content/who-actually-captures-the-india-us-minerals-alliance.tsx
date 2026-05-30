import type { TocItem } from '../../components/ReportReader';

/**
 * Free online reading version of "Who Actually Captures the India–US Minerals Alliance?".
 * Designed to be genuinely useful on its own: it teaches the full framework, works one
 * sector end-to-end as a sample of the report's method, and states precisely what the
 * paid 124-page edition adds. The complete report (14 chapters, 30 figures, appendices)
 * is the paid PDF; <PremiumBody/> renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-reframe', label: 'The reframe: a midstream deal' },
  { id: 'four-chokepoints', label: 'The Four Chokepoints' },
  { id: 'processing-not-reserves', label: 'Why processing, not reserves' },
  { id: 'shared-dependency', label: 'The shared dependency' },
  { id: 'worked-example', label: 'Worked example: the EV stack' },
  { id: 'who-captures-value', label: 'Who captures the value' },
  { id: 'peers', label: 'India against its peers' },
  { id: 'the-alliance-test', label: 'What the alliance must deliver' },
  { id: 'scenarios', label: 'Three scenarios to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#F5B544';
const TEAL = '#38e1c4';
const CRIMSON = '#e2725b';
const INK = '#9898A8';

/* ── Figure 1 — The Four Chokepoints ── */
function ChokepointFigure() {
  const cols = [
    { code: 'C1', name: 'Extraction', glob: 'China ~69% mining', india: 'Moderate', score: 2, c: INK },
    { code: 'C2', name: 'Separation & refining', glob: 'China ~85–92%', india: 'Near-zero', score: 1, c: CRIMSON },
    { code: 'C3', name: 'Magnets & materials', glob: 'China-dominant', india: 'Nascent', score: 2, c: BRASS },
    { code: 'C4', name: 'Downstream', glob: 'Distributed', india: 'Strong', score: 4, c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-chokepoints">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The four chokepoints of mineral value, scored for India">
          {cols.map((col, i) => {
            const x = 20 + i * 185;
            return (
              <g key={col.code}>
                <rect x={x} y={20} width={170} height={250} rx={10} fill="#161629" stroke={col.c} strokeOpacity="0.5" />
                <rect x={x} y={20} width={170} height={42} rx={10} fill={col.c} fillOpacity="0.9" />
                <text x={x + 16} y={48} fontSize={18} fontWeight={700} fill="#0B0B14">{col.code}</text>
                <text x={x + 16} y={90} fontSize={13} fontWeight={600} fill="#E8E8F0">{col.name.length > 18 ? col.name.slice(0, 18) : col.name}</text>
                <text x={x + 16} y={130} fontSize={11} fill={INK} letterSpacing="0.04em">GLOBAL</text>
                <text x={x + 16} y={150} fontSize={12.5} fontWeight={600} fill="#E8E8F0">{col.glob}</text>
                <text x={x + 16} y={186} fontSize={11} fill={INK} letterSpacing="0.04em">INDIA</text>
                <text x={x + 16} y={206} fontSize={12.5} fontWeight={600} fill="#E8E8F0">{col.india}</text>
                {Array.from({ length: 5 }).map((_, d) => (
                  <circle key={d} cx={x + 22 + d * 22} cy={240} r={7} fill={d < col.score ? col.c : 'none'} stroke={col.c} strokeOpacity="0.6" />
                ))}
                {i < 3 ? <text x={x + 178} y={150} fontSize={18} fill={INK}>›</text> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="fig-cap"><span className="fig-no">Fig 1</span>The Techadyant Chokepoint Index. Leverage concentrates in the middle two chokepoints — exactly where India is weakest.</figcaption>
    </figure>
  );
}

/* ── Figure 2 — From mine to magnet: China's share rises ── */
function ProcessingFigure() {
  const bars = [
    { label: 'Mining', v: 69, c: TEAL },
    { label: 'Separation & refining', v: 90, c: BRASS },
    { label: 'Heavy rare earths', v: 99, c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-processing">
      <div className="fig-frame">
        <svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="China's share of rare-earth supply by stage">
          {bars.map((b, i) => {
            const y = 40 + i * 64;
            const w = (b.v / 100) * 520;
            return (
              <g key={b.label}>
                <text x={20} y={y + 22} fontSize={13} fill="#E8E8F0">{b.label}</text>
                <rect x={220} y={y} width={520} height={32} rx={4} fill="#161629" />
                <rect x={220} y={y} width={w} height={32} rx={4} fill={b.c} />
                <text x={220 + w - 8} y={y + 22} fontSize={14} fontWeight={700} textAnchor="end" fill="#0B0B14" fontFamily="monospace">{b.v}%</text>
              </g>
            );
          })}
          <text x={20} y={232} fontSize={12} fill={INK}>China&apos;s share of global rare-earth supply, by stage. The leverage is in the chemistry, not the ore.</text>
        </svg>
      </div>
      <figcaption className="fig-cap"><span className="fig-no">Fig 2</span>Reserves are widely distributed; the bottleneck is separation and magnets — the steps India does not yet have.</figcaption>
    </figure>
  );
}

/* ── Figure 3 — Worked example: the EV stack scored through four chokepoints ── */
function EvScorecardFigure() {
  const steps = [
    { code: 'C1', stage: 'Ore → REO', ev: 'Monazite, beach sands', score: 2, c: INK },
    { code: 'C2', stage: 'Separated NdPr oxide', ev: 'Almost no commercial separation', score: 1, c: CRIMSON },
    { code: 'C3', stage: 'Sintered NdFeB magnet', ev: 'Scheme funded, no volume yet', score: 2, c: BRASS },
    { code: 'C4', stage: 'Motor → vehicle', ev: 'Large, growing assembler', score: 4, c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-ev-scorecard">
      <div className="fig-frame">
        <svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The electric-vehicle stack scored through the four chokepoints for India">
          <text x={20} y={26} fontSize={13} fontWeight={700} fill="#E8E8F0">The electric-vehicle stack, scored for India</text>
          {steps.map((s, i) => {
            const x = 20 + i * 185;
            return (
              <g key={s.code}>
                <rect x={x} y={44} width={170} height={196} rx={10} fill="#161629" stroke={s.c} strokeOpacity="0.45" />
                <text x={x + 14} y={74} fontSize={15} fontWeight={700} fill={s.c}>{s.code}</text>
                <text x={x + 14} y={104} fontSize={12.5} fontWeight={600} fill="#E8E8F0">{s.stage}</text>
                <foreignObject x={x + 12} y={116} width={150} height={64}>
                  <div style={{ font: '11px Inter, sans-serif', color: '#9898A8', lineHeight: 1.35 }}>{s.ev}</div>
                </foreignObject>
                <text x={x + 14} y={200} fontSize={10.5} fill={INK} letterSpacing="0.06em">INDIA SCORE</text>
                {Array.from({ length: 5 }).map((_, d) => (
                  <circle key={d} cx={x + 20 + d * 22} cy={222} r={7} fill={d < s.score ? s.c : 'none'} stroke={s.c} strokeOpacity="0.55" />
                ))}
                {i < 3 ? <text x={x + 177} y={150} fontSize={18} fill={INK}>›</text> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="fig-cap"><span className="fig-no">Fig 3</span>India can assemble the vehicle (C4) but cannot yet make the magnet that turns its motor (C2–C3). The value it captures sits at the end; the leverage it lacks sits in the middle.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="serif" style={{ fontSize: 17, color: 'var(--text-muted)' }}>
        On 26 May 2026 India and the United States signed a critical-minerals framework. Both capitals read it as a
        supply deal — a way to get minerals out of the ground and away from China. That reading is wrong in a way that
        matters, and the gap between the two readings is the whole report. This free edition carries the argument, the
        framework and the headline findings in full; the complete 124-page edition carries the evidence the way a
        decision-maker needs it.
      </p>

      <h2 id="the-reframe">The reframe: a midstream deal, not a mining deal</h2>
      <p>
        The minerals at the centre of this story are not scarce in the earth&apos;s crust. India itself sits on roughly
        <strong> 7.23 million tonnes of rare-earth oxide</strong> in monazite. They are scarce in <em>refined, separated,
        magnet-ready form</em> — and that capability is concentrated, deliberately and durably, in China. The economic
        transformation worth tracking is therefore not whether India mines more ore. It is whether India builds the
        unglamorous, capital-heavy middle of the value chain it has spent thirty years avoiding.
      </p>
      <p>
        The achievable and strategically decisive prize is not self-sufficiency. It is to become the credible third or
        fourth non-China node in a handful of midstream capabilities: separated rare-earth oxides, sintered neodymium
        magnets, mature-node semiconductors, and the electronic-grade gases and chemicals a fab consumes. The alliance
        matters only insofar as it moves India up the two chokepoints that actually carry leverage —
        <strong> separation and refining, and magnets and advanced materials</strong> — not the two it talks about most,
        extraction and assembly, where India already has capability and where leverage is lowest.
      </p>

      <h2 id="four-chokepoints">The Four Chokepoints</h2>
      <p>
        The report&apos;s organising instrument is the <strong>Techadyant Chokepoint Index</strong>. Mineral value flows
        through four sequential chokepoints, and leverage concentrates in the middle two. India is scored 1–5 at each —
        against installed capability, funded trajectory, and sovereign control — and the same scorecard is applied to
        every sector, so semiconductors, electronics, defence, electric vehicles, energy and AI infrastructure are
        measured against one ruler rather than six anecdotes.
      </p>
      <ChokepointFigure />
      <p>
        The pattern is remarkably stable, and it is the report&apos;s central empirical finding:
        <strong> India is strong at the ends of its value chains and hollow in the middle.</strong> A score near 2 at C2
        and C3 against a 4 at C4 is not a quirk of one sector — it is the shape of nearly every hardware ambition India
        holds. Once you can see that shape, the alliance stops being a mining story and becomes a test of whether India
        can do the one thing the shape says it cannot yet do.
      </p>

      <h2 id="processing-not-reserves">Why processing, not reserves</h2>
      <p>
        China controls roughly two-thirds of rare-earth <em>mining</em> — a large share, but one others are eroding. Its
        share of <em>separation and refining</em> is far higher, around nine-tenths, and approaches the entirety of
        commercial supply for the heavy rare earths that magnets need. It is this processing share, not the mining share,
        that confers leverage, because a separation plant — unlike a reserve — cannot be quickly relocated or wished into
        existence. It takes years of capital, chemistry and environmental clearance to stand one up.
      </p>
      <ProcessingFigure />
      <p>
        The 2024–25 export controls were the proof of where the leverage sits. When China restricted gallium, germanium
        and antimony, affected prices rose by several hundred per cent and export volumes collapsed toward zero. The
        squeeze worked precisely because it was applied in the middle of the chain, where there is no fast alternative.
        A country can hold large reserves and still be a hostage at the refining step — which is exactly India&apos;s
        position today.
      </p>

      <h2 id="shared-dependency">The shared dependency</h2>
      <p>
        The diverse hardware ambitions India holds — chips, electric motors, guided weapons, batteries, wind turbines,
        AI servers — reduce to a small set of shared material dependencies. Rare-earth magnets recur in motors, weapons,
        turbines and the tools that make chips. Because the dependencies are shared, the midstream that serves one sector
        serves all: it is not a sector-specific cost but shared industrial infrastructure. That is the single strongest
        argument for building it once, deliberately, at scale — and the reason a minerals framework is really an
        industrial-policy decision in disguise.
      </p>
      <div className="pull-stat">
        <div className="ps"><div className="n">18–20%</div><div className="l">Domestic value India captures in electronics — assembly without the component middle</div></div>
        <div className="ps"><div className="n">1.4 / 50</div><div className="l">GWh of battery-cell capacity built against the 50 GWh target — the midstream trap, already run once</div></div>
        <div className="ps"><div className="n">~99%</div><div className="l">Of heavy-rare-earth refining controlled by China — the binding defence dependency</div></div>
      </div>

      <h2 id="worked-example">A worked example: the electric-vehicle stack</h2>
      <p>
        The framework is only as good as what it reveals when you run a real sector through it. Take electric vehicles —
        the cleanest case, because the chain is visible end to end: mined oxide becomes separated NdPr, which becomes a
        sintered NdFeB magnet, which turns a traction motor, which sits inside an assembled vehicle. This is one of the
        fourteen sectors the full report scores; here is how the method works on it.
      </p>
      <EvScorecardFigure />
      <p>
        At <strong>C1 (ore to oxide)</strong> India scores a 2. The reserves exist — monazite in the beach sands of
        Kerala, Odisha and Tamil Nadu — but extraction is throttled by the thorium content of monazite and the regulation
        that follows from it, so installed capability lags the geology. At <strong>C2 (separated NdPr oxide)</strong> the
        score falls to a 1: India has almost no commercial separation of magnet-grade rare earths, and for the heavy rare
        earths the dependence on China runs to roughly 99%. At <strong>C3 (the sintered magnet)</strong> India scores a 2
        — the ₹7,280 crore permanent-magnet scheme is real and well-aimed, but there is no volume production yet, only a
        funded intention. Then at <strong>C4 (motor and vehicle)</strong> the score jumps to a 4: India is a large and
        fast-growing vehicle assembler with credible electric-motor and pack-integration capability.
      </p>
      <p>
        Read across the row and the verdict writes itself. India can build the car but cannot yet make the magnet that
        turns its motor. It will therefore capture assembly value — jobs, GDP, a visible industry — while remaining
        import-dependent on the one component that carries strategic leverage. The alliance, for EVs, is worth exactly as
        much as it moves the C2 and C3 scores, and not a rupee more. <strong>That single test — does this move the middle?
        — is the lens the report applies to all six sectors.</strong>
      </p>

      <h2 id="who-captures-value">Who captures the value</h2>
      <p>
        The beneficiaries are not the obvious ones — not primarily miners, and not the marquee chip and EV brands. They
        are the layer in between: the <strong>separation and refining operators</strong> (IREL and the private entrants
        the schemes are designed to attract), the <strong>magnet-makers</strong> funded by the ₹7,280 crore
        permanent-magnet scheme, the <strong>electronic-gas and specialty-chemical</strong> producers any serious base
        requires, and the <strong>recyclers</strong> who can shortcut the separation problem entirely. Downstream
        assemblers benefit too — but they gain security of supply, not cost advantage. Reading the alliance through the
        beneficiary layer rather than the headline projects is what tells you where the returns, and the policy attention,
        actually belong.
      </p>

      <h2 id="peers">India against its peers</h2>
      <p>
        Benchmarked against the countries that matter — China, Japan, South Korea, Taiwan, Vietnam and Indonesia — India
        leads its emerging-economy peers on assembly and leads all peers except the East Asian incumbents on chip design.
        But on separation and refining it trails not only China but Japan, Korea and Taiwan. The relationship is the same
        one the chokepoint scores describe at the national level: India&apos;s relative strength sits where leverage is
        lowest, and its relative weakness sits where leverage is highest. The full report scores each peer at each
        chokepoint, which is what turns &quot;India is behind China&quot; into a precise map of where, and by how much.
      </p>

      <h2 id="the-alliance-test">What the alliance must deliver</h2>
      <p>
        The framework&apos;s value is not measured in exploration acreage. It is measured in two deliverables:
        <strong> processing-technology transfer</strong> (separation chemistry and magnet-sintering know-how, held by a
        handful of firms worldwide) and <strong>guaranteed offtake</strong> from allied and defence buyers. The United
        States needs a non-China defence-magnet source badly enough to underwrite one — its military magnet demand is set
        to roughly double toward 10,000 tonnes a year by 2030. That mutual dependence is India&apos;s leverage. A
        framework that delivers technology and offtake is transformative; one that delivers acreage is a memorandum.
      </p>

      <h2 id="scenarios">Three scenarios to 2035</h2>
      <p>
        The report models three futures, distinguished by how far India moves up the second and third chokepoints. In the
        <strong> conservative</strong> case (highest probability), India builds a real but uneven midstream led by Gujarat
        and remains dependent on imported leading-edge chips and most precursors. In the <strong>accelerated</strong> case,
        magnet capacity reaches bloc-export scale, a second semiconductor cluster emerges, and battery cells finally cross
        from pilot to volume. In the <strong>breakthrough</strong> case (least likely), India becomes the global alternate
        for selected midstream products. The probability-weighted outcome is a <em>credible fourth node, not a China
        substitute</em> — but, measured against where India sits today, the largest industrial transformation since 1991.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This free edition gives you the framework and the shape of the findings. The complete 124-page edition gives you
        the resolution — the numbers, the named companies, and the five sectors this page only sampled:
      </p>
      <div className="exec-summary">
        <div className="es-label">Inside the complete edition</div>
        <ul>
          <li><strong>Fourteen chapters</strong>, each closing with a per-sector chokepoint scorecard — semiconductors, electronics, defence, EVs, energy and AI infrastructure, each scored the way the EV stack was above.</li>
          <li>The <strong>quantified 2035 scenario model</strong>, with explicit assumptions and probability weights behind the conservative, accelerated and breakthrough paths.</li>
          <li>The <strong>capital-stack analysis</strong> — who actually pays for the midstream, and the size of the financing gap that has to be closed.</li>
          <li>A dedicated chapter on <strong>China&apos;s likely counterstrategy</strong> — how the incumbent can weaponise price and supply, and how India withstands it.</li>
          <li><strong>Peer benchmarking</strong> against China, Japan, Korea, Taiwan, Vietnam and Indonesia, scored chokepoint by chokepoint.</li>
          <li><strong>Company-level beneficiary mapping</strong> and the <strong>policy roadmap</strong>, phased to 2035.</li>
          <li><strong>Seven appendices</strong> — glossary, mineral profiles, semiconductor primer, policy timeline, company profiles, methodology, and the full layered bibliography — across <strong>thirty figures</strong>.</li>
        </ul>
      </div>
      <p className="serif" style={{ color: 'var(--text-muted)' }}>
        The argument is here. The evidence, sector by sector, is in the full edition below.
      </p>
    </>
  );
}
