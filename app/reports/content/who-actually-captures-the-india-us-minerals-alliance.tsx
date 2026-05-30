import type { TocItem } from '../../components/ReportReader';

/**
 * Free online reading version of "Who Actually Captures the India–US Minerals Alliance?".
 * This renders the report's argument, framework and key findings as a generous,
 * SEO-indexable article. The full 124-page report (all 14 chapters, 30 figures,
 * appendices) is served as the paid PDF; <PremiumBody/> renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-reframe', label: 'The reframe: a midstream deal' },
  { id: 'four-chokepoints', label: 'The Four Chokepoints' },
  { id: 'processing-not-reserves', label: 'Why processing, not reserves' },
  { id: 'shared-dependency', label: 'The shared dependency' },
  { id: 'who-captures-value', label: 'Who captures the value' },
  { id: 'the-midstream-test', label: 'What the alliance must deliver' },
  { id: 'scenarios', label: 'Three scenarios to 2035' },
  { id: 'in-the-full-report', label: 'In the full report' },
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
      <figcaption className="fig-cap">The Techadyant Chokepoint Index. Leverage concentrates in the middle two chokepoints — exactly where India is weakest.</figcaption>
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
      <figcaption className="fig-cap">Reserves are widely distributed; the bottleneck is separation and magnets — the steps India does not yet have.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="serif" style={{ fontSize: 17, color: "var(--text-muted)" }}>
        On 26 May 2026 India and the United States signed a critical-minerals framework. Both capitals read it as a
        supply deal — a way to get minerals out of the ground and away from China. That reading is wrong in a way that
        matters. This is the free reading version of the report; the complete 124-page edition is available below.
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
        The report argues that the alliance only matters insofar as it moves India up two specific chokepoints —
        <strong> separation/refining and magnets</strong> — not the two it talks about most, extraction and assembly,
        where India already has capability and where strategic leverage is lowest.
      </p>

      <h2 id="four-chokepoints">The Four Chokepoints</h2>
      <p>
        Mineral value flows through four sequential chokepoints, and leverage concentrates in the middle two. The report
        scores India 1–5 at each — against installed capability, funded trajectory, and sovereign control — and applies
        the same scorecard to every sector, so semiconductors, electronics, defence, EVs, energy and AI infrastructure
        are measured against one ruler.
      </p>
      <ChokepointFigure />
      <p>
        The pattern is remarkably stable: <strong>India is strong at the ends of its value chains and hollow in the
        middle.</strong> That single shape is the report&apos;s central empirical finding.
      </p>

      <h2 id="processing-not-reserves">Why processing, not reserves</h2>
      <p>
        China controls roughly two-thirds of rare-earth <em>mining</em> — a large share, but one others are eroding. Its
        share of <em>separation and refining</em> is far higher, around nine-tenths, and approaches the entirety of
        commercial supply for the heavy rare earths that magnets need. It is this processing share, not the mining share,
        that confers leverage, because a separation plant — unlike a reserve — cannot be quickly relocated or bombed into
        existence.
      </p>
      <ProcessingFigure />
      <p>
        The 2024–25 export controls were the proof. When China restricted gallium, germanium and antimony, affected
        prices rose by several hundred per cent and export volumes collapsed toward zero. The leverage sat in the
        middle, where there is no fast alternative.
      </p>

      <h2 id="shared-dependency">The shared dependency</h2>
      <p>
        The diverse hardware ambitions India holds — chips, electric motors, guided weapons, batteries, wind turbines,
        AI servers — reduce to a small set of shared material dependencies. Rare-earth magnets recur in motors, weapons,
        turbines and the tools that make chips. Because the dependencies are shared, the midstream that serves one sector
        serves all: it is not a sector-specific cost but shared industrial infrastructure. That is the strongest argument
        for building it once, at scale.
      </p>
      <div className="pull-stat">
        <div className="ps"><div className="n">18–20%</div><div className="l">Domestic value India captures in electronics — assembly without the component middle</div></div>
        <div className="ps"><div className="n">1.4 / 50</div><div className="l">GWh of battery-cell capacity built against the 50 GWh target — the midstream trap, already run once</div></div>
        <div className="ps"><div className="n">~99%</div><div className="l">Of heavy-rare-earth refining controlled by China — the binding defence dependency</div></div>
      </div>

      <h2 id="who-captures-value">Who captures the value</h2>
      <p>
        The beneficiaries are not the obvious ones — not primarily miners, and not the marquee chip and EV brands. They
        are the layer in between: the <strong>separation and refining operators</strong> (IREL and the private entrants
        the schemes are designed to attract), the <strong>magnet-makers</strong> funded by the ₹7,280 crore permanent-magnet
        scheme, the <strong>electronic-gas and specialty-chemical</strong> producers any serious base requires, and the
        <strong> recyclers</strong> who can shortcut the separation problem. Downstream assemblers benefit too — but they
        gain security of supply, not cost advantage.
      </p>

      <h2 id="the-midstream-test">What the alliance must deliver</h2>
      <p>
        The framework&apos;s value is not measured in exploration acreage. It is measured in two deliverables:
        <strong> processing-technology transfer</strong> (separation chemistry and magnet-sintering know-how, held by a
        handful of firms) and <strong>guaranteed offtake</strong> from allied and defence buyers. The United States needs
        a non-China defence-magnet source badly enough to underwrite one — its military magnet demand is set to roughly
        double toward 10,000 tonnes a year by 2030. That mutual dependence is India&apos;s leverage. A framework that
        delivers technology and offtake is transformative; one that delivers acreage is a memorandum.
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

      <h2 id="in-the-full-report">In the full report</h2>
      <p>
        The complete 124-page edition carries the full argument the way a decision-maker needs it: all fourteen chapters
        with their per-sector chokepoint scorecards, the quantified 2035 scenario model, the capital-stack analysis of who
        actually pays for the midstream, a chapter on China&apos;s likely counterstrategy, peer benchmarking against China,
        Japan, Korea, Taiwan, Vietnam and Indonesia, the policy roadmap, company-level beneficiary mapping, and seven
        appendices — across thirty figures and the full source base.
      </p>
    </>
  );
}
