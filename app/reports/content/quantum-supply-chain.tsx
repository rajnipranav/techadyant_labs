import type { TocItem } from '../../components/ReportReader';

/** Free online reading version of "The Hidden Supply Chain of Quantum Computing" (paid flagship). */
export const toc: TocItem[] = [
  { id: 'the-reframe', label: 'The qubit is the wrong thing to watch' },
  { id: 'cost-stack', label: 'Where a quantum computer’s cost sits' },
  { id: 'india-position', label: 'India’s capability, layer by layer' },
  { id: 'chokepoints', label: 'Single-source dependency' },
  { id: 'value-migration', label: 'Where the value goes' },
  { id: 'roadmap', label: 'A ten-year industrial roadmap' },
  { id: 'in-the-full-report', label: 'What the full report covers' },
];

const BRASS = '#F5B544';
const TEAL = '#38e1c4';
const CRIMSON = '#e2725b';
const INK = '#9898A8';

/* Figure 1 — the cost stack */
function CostFigure() {
  const seg = [
    { n: 'Cryogenics', v: 1.5, c: CRIMSON },
    { n: 'Control electronics', v: 1.1, c: CRIMSON },
    { n: 'Qubit fabrication', v: 0.9, c: TEAL },
    { n: 'Photonics & lasers', v: 0.5, c: BRASS },
    { n: 'Packaging', v: 0.35, c: CRIMSON },
    { n: 'Software & cloud', v: 0.4, c: BRASS },
    { n: 'Materials', v: 0.3, c: CRIMSON },
    { n: 'Calibration', v: 0.1, c: INK },
  ];
  const total = 5.15, x0 = 30, w = 700;
  let cum = 0;
  return (
    <figure className="report-figure" id="fig-cost">
      <div className="fig-frame">
        <svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cost breakdown of a 100-qubit superconducting quantum computer, USD 5.15 million">
          <text x="30" y="34" fill="#e9e7e0" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">A 100-qubit quantum computer: $5.15M</text>
          <text x="30" y="56" fill={INK} fontSize="12.5" fontFamily="Inter, sans-serif">The visible qubit chip is ~17%. The hidden stack — cryo, control, packaging, materials — is ~63%.</text>
          {seg.map((s) => {
            const bw = (w * s.v) / total; const x = x0 + (w * cum) / total; cum += s.v;
            return <g key={s.n}><rect x={x} y="86" width={bw - 2} height="34" fill={s.c} /></g>;
          })}
          <text x={x0} y="140" fill={TEAL} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">Qubit chip ~$0.9M (17%)</text>
          <text x={x0 + 300} y="140" fill={CRIMSON} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">Hidden stack ~$3.25M (63%)</text>
          <text x="30" y="230" fill={INK} fontSize="11" fontFamily="Inter, sans-serif">Source: Techadyant Labs, system-cost waterfall. Segments left-to-right by cost.</text>
        </svg>
      </div>
      <figcaption>Figure 1 — The money is not in the qubit. Nearly two-thirds of a quantum computer’s cost is the cryogenic, control and packaging stack underneath it.</figcaption>
    </figure>
  );
}

/* Figure 2 — value migration */
function ValueFigure() {
  return (
    <figure className="report-figure" id="fig-value">
      <div className="fig-frame">
        <svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Software share of quantum value rises from 42 percent to 62 percent">
          <text x="30" y="34" fill="#e9e7e0" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">Value migrates to software and control</text>
          <text x="150" y="180" fill={INK} fontSize="12" fontFamily="Inter, sans-serif">Today</text>
          <text x="560" y="180" fill={INK} fontSize="12" fontFamily="Inter, sans-serif">By the 2030s</text>
          <rect x="120" y={160 - 42 * 1.6} width="120" height={42 * 1.6} fill={TEAL} />
          <text x="180" y="90" fill="#e9e7e0" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace">42%</text>
          <rect x="530" y={160 - 62 * 1.6} width="120" height={62 * 1.6} fill={TEAL} />
          <text x="590" y="52" fill="#e9e7e0" fontSize="18" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace">62%</text>
          <text x="30" y="210" fill={INK} fontSize="11" fontFamily="Inter, sans-serif">Source: Techadyant Labs value-migration forecast. Software + QKD hold ~70% of the margin pool.</text>
        </svg>
      </div>
      <figcaption>Figure 2 — The margin follows control, not qubits. Software and QKD already hold ~70% of the margin pool, and software’s share of value rises from 42% to 62%.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="report-lede">
        The industry watches the qubit. It is the wrong thing to watch. On a 100-qubit
        superconducting machine costing about $5.15 million, the qubit chip is roughly 17% of
        cost — and the qubit &ldquo;layer&rdquo; that attracts most of the attention is under 8%.
        The other ~63% is the hidden stack: cryogenics, control electronics, photonics,
        packaging and high-purity materials. That is where the money, the margin and the
        dependency actually live — and it is what this report maps.
      </p>

      <h2 id="the-reframe">The qubit is the wrong thing to watch</h2>
      <p>
        Quantum computing is told as a qubit story — counts, coherence, error rates. The supply
        chain tells a different one. Value in every quantum system concentrates below the qubit,
        in the enabling hardware that keeps it cold, controls it, connects it and packages it.
        A country can host quantum research and still own none of the industrial base that makes
        a machine work. That is India&rsquo;s position, and it is the gap this report scores.
      </p>

      <h2 id="cost-stack">Where a quantum computer&rsquo;s cost sits</h2>
      <CostFigure />
      <p>
        The cost waterfall settles the argument. Cryogenic infrastructure — the dilution
        refrigerator plus cryostat — is the single largest line at ~$1.5M, and it comes from a
        near-monopoly supplier base with lead times that have tripled. Control electronics add
        ~$1.1M. Together with packaging and materials, the hidden stack is ~$3.25M of a $5.15M
        machine. The visible qubit chip is ~$0.9M.
      </p>

      <h2 id="india-position">India&rsquo;s capability, layer by layer</h2>
      <p>
        The report scores India across the stack — cryogenics, control electronics, photonics,
        packaging, materials and foundry — and the capability matrix is, in the report&rsquo;s own
        words, a sea of red. India lags the global frontier by 2–4 TRL levels across the stack,
        has world-class research concentrated in four or five institutions, and almost no
        commercial translation. On the dilution refrigerator — the highest-cost, highest-
        concentration component — India has about 4% of the US installed base.
      </p>

      <h2 id="chokepoints">Single-source dependency</h2>
      <p>
        Every quantum-critical component category exceeds a Herfindahl–Hirschman Index of 2,500 —
        the threshold for single-source concentration. India&rsquo;s import dependency on critical
        components is effectively total, and Wassenaar export controls bite hardest exactly where
        India is weakest: materials and qubit chips. This is not a diversification problem; it is
        a build-from-near-zero problem, and the report is candid about the 18–30 month lead times
        that gate any response.
      </p>

      <h2 id="value-migration">Where the value goes</h2>
      <ValueFigure />
      <p>
        The strategic implication is that India should not chase the qubit. Software and QKD hold
        ~70% of the margin pool, and value migrates toward control and integration — the layers
        where India&rsquo;s software strength is real. The report maps the margin pool and the strategic
        control points so capital can target where value actually accrues, not where the headlines are.
      </p>

      <h2 id="roadmap">A ten-year industrial roadmap</h2>
      <p>
        The report closes with a sequenced, ~$5.25 billion ten-year roadmap across three phases —
        a cryogenics mission, a dilution-refrigerator consortium, and a control-electronics and
        talent build-out to close a ~21,000-FTE gap by 2030. It weighs this against a funding
        reality: India&rsquo;s ~$1.1B national programme is about 7% of China&rsquo;s and 60% of the USA&rsquo;s,
        and India is ~$205M short of even a 4% global funding share.
      </p>

      <h2 id="in-the-full-report">What the full report covers</h2>
      <p>
        The complete 150-plus-page edition carries 69 figures and 20 tables across 18 chapters:
        the full cost and cryogenics analysis, the India capability and TRL matrices, the control-
        electronics, photonics, packaging and foundry chapters, the patent, funding and talent
        landscapes, the defence QKD use-cases, the risk heat map and single-source chokepoint
        analysis, the margin-pool and value-migration models, three scenarios to 2035, and the
        ten-year roadmap — with five appendices (company, startup, policy and funding databases)
        and a 17-sheet data workbook behind every exhibit.
      </p>
    </>
  );
}
