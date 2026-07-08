import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Loitering Munitions Market Intelligence 2026-2035"
 * (H1: Who Arms India's Loitering-Munition Decade?).
 * Carries the thesis, the procurement signal, the subsystem dependency stack, the
 * cost-exchange economics, the eight frameworks and the sovereignty schedule. The full
 * ~112-page edition (six parts, seventeen chapters, 25 figures, appendices) is the paid PDF.
 *
 * Register in app/reports/[slug]/page.tsx as e.g. { lmToc as toc, LMContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'A sovereignty problem, not a capability one' },
  { id: 'the-signal', label: 'The procurement signal is now on the record' },
  { id: 'economics', label: 'Why the weapon changes the arithmetic' },
  { id: 'the-stack', label: 'Where India is exposed' },
  { id: 'frameworks', label: 'The eight frameworks' },
  { id: 'opportunities', label: 'Where to build now' },
  { id: 'comparators', label: 'What Israel, Turkey and China teach' },
  { id: 'the-path', label: 'A path to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure 1 - the cost-exchange logic (log-scaled) */
function CostExchangeFigure() {
  const rows = [
    { n: 'FPV strike drone', v: 0.04, c: TEAL, label: '~Rs 4 lakh' },
    { n: 'Loitering munition', v: 2, c: TEAL, label: '~Rs 2 crore' },
    { n: 'Self-propelled gun', v: 40, c: CRIMSON, label: '~Rs 40 crore' },
    { n: 'Air-defence launcher', v: 200, c: CRIMSON, label: '~Rs 200 crore' },
  ];
  const min = Math.log10(0.04);
  const max = Math.log10(200);
  return (
    <figure className="report-figure" id="fig-cost-exchange">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cost-exchange: a loitering munition costing a few crore destroys targets worth tens to hundreds of crore, log scale">
          {rows.map((r, i) => {
            const y = 28 + i * 60;
            const w = ((Math.log10(r.v) - min) / (max - min)) * 460 + 20;
            return (
              <g key={r.n}>
                <text x={18} y={y + 16} fontSize={14} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={250} y={y} width={Math.max(w, 8)} height={30} rx={4} fill={r.c} />
                <text x={250 + Math.max(w, 8) + 10} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.label}</text>
              </g>
            );
          })}
          <text x={250} y={282} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Log scale &middot; indicative cost bands &middot; Techadyant Cost-Exchange Efficiency Curve</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The cost-exchange logic. Cheap, replenishable precision removes scarce, expensive targets &mdash; the economic case for buying loitering munitions in quantity. Indicative bands.</figcaption>
    </figure>
  );
}

/* Figure 2 - subsystem sovereignty stack */
function SovereigntyFigure() {
  const layers = [
    { n: 'Warhead / explosives', pct: 90, c: TEAL },
    { n: 'Airframe / integration', pct: 82, c: TEAL },
    { n: 'NavIC navigation', pct: 80, c: TEAL },
    { n: 'EO / IR seekers', pct: 45, c: BRASS },
    { n: 'Secure datalink / RF', pct: 40, c: BRASS },
    { n: 'BLDC motors / ESCs', pct: 35, c: BRASS },
    { n: 'Lithium-ion cells', pct: 16, c: CRIMSON },
    { n: 'Flight controllers', pct: 10, c: CRIMSON },
    { n: 'NdFeB magnets (Dy/Tb)', pct: 5, c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-sovereignty">
      <div className="fig-frame">
        <svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's loitering-munition subsystem sovereignty by layer: strong in warhead, airframe and NavIC, weak in magnets, flight controllers and cells">
          {layers.map((l, i) => {
            const y = 20 + i * 40;
            const w = (l.pct / 100) * 430;
            return (
              <g key={l.n}>
                <text x={18} y={y + 20} fontSize={13} fontWeight={600} fill="#E8E8F0">{l.n}</text>
                <rect x={300} y={y + 4} width={Math.max(w, 6)} height={24} rx={4} fill={l.c} />
                <text x={300 + Math.max(w, 6) + 8} y={y + 21} fontSize={12} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{l.pct}%</text>
              </g>
            );
          })}
          <text x={300} y={392} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Indicative sovereignty score &middot; Techadyant LM-Sovereignty Index (illustrative)</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The LM-Sovereignty Index, illustrative. India is sovereign at the top of the stack and dependent at the bottom &mdash; where value and vulnerability actually live.</figcaption>
    </figure>
  );
}

const OPPS = [
  ['1', 'Sintered NdFeB magnets (Dy/Tb)', 'Deepest chokepoint; guaranteed offtake', 'Build-now'],
  ['2', 'EO/IR seekers & detector integration', 'Contested frontier; import-substitution', 'Build-now'],
  ['3', 'Trusted flight controllers', '~90% imported today', 'Build-now'],
  ['4', 'Secure anti-jam datalinks', 'EW battlefield survival layer', 'Build-now'],
  ['5', 'Drone-grade BLDC motors & ESCs', 'Scales with fleet; magnet-linked', 'Position-early'],
  ['6', 'Edge-AI compute / trusted silicon', 'Autonomy & swarm premium', 'Position-early'],
  ['7', 'FPV & short-range strike at scale', 'Highest-volume category', 'Position-early'],
  ['8', 'Test, certification & sustainment', 'Throughput bottleneck; recurring', 'Position-early'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">A sovereignty problem, not a capability one</h2>
      <p>
        India has entered a ten-year window in which loitering munitions move from the margins of its arsenal to the centre
        of its land-warfare doctrine. It can already build world-class systems &mdash; the Nagastra family, the Tata ALS-50,
        the DRDO ULPGM-V3, the licence-built SkyStriker. The harder question is not whether India can field the weapon, but
        whether it can <em>sustain</em> it: when the country buys hundreds of thousands of attritable precision munitions
        over the decade, how much of that value, and how much of the security that is meant to come with it, is actually
        captured at home? Read against India&apos;s own supply chain, the answer is uncomfortable. India can integrate and
        assemble loitering munitions superbly; the layers that decide whether it could rebuild the fleet under stress remain
        foreign. That gap &mdash; not the next prototype &mdash; is the strategic task of the decade.
      </p>

      <h2 id="the-signal">The procurement signal is now on the record</h2>
      <p>
        Operation Sindoor in 2025 converted a doctrinal debate into a procurement fact. Within months the Ministry of
        Defence had exhausted a &#8377;9,100 crore emergency-powers ceiling and directed roughly four-fifths of the
        field-formation tranche to loitering and kamikaze systems. In December 2025 the Defence Acquisition Council cleared
        a package worth about &#8377;79,000 crore that, for the first time, named a &ldquo;Loiter Munition System for
        Artillery Regiments.&rdquo; The Union Budget for 2026-27 then raised the defence allocation to &#8377;7.85 lakh
        crore, carved out &#8377;1.85 lakh crore for capital acquisition, and earmarked 75% of that &mdash; &#8377;1.39 lakh
        crore &mdash; for domestic procurement, explicitly citing the post-Sindoor purchases. The demand is proven and
        primary-sourced; what is unresolved is who captures it.
      </p>

      <h2 id="economics">Why the weapon changes the arithmetic</h2>
      <p>
        Every argument for loitering munitions reduces, in the end, to arithmetic. A first-person-view drone costing a few
        lakh rupees, or a loitering munition costing a few crore, can destroy armour, artillery, radars and air-defence
        launchers worth tens to hundreds of crore. The exchange runs in the attacker&apos;s favour by orders of magnitude,
        and it runs against the defender in reverse: intercepting a cheap munition with an expensive missile is a losing
        trade, which is why saturation works. The report formalises this as the Cost-Exchange Efficiency Curve, and draws
        the conclusion that governs the rest: the correct objective is not per-unit capability but cost-per-effect and
        replenishment rate &mdash; and replenishment is exactly what a foreign-dependent supply chain cannot guarantee.
      </p>
      <CostExchangeFigure />

      <h2 id="the-stack">Where India is exposed</h2>
      <p>
        Value and vulnerability both sit below the airframe. India is genuinely sovereign at the top of the stack &mdash; in
        warheads and explosives, in airframe design and integration, and, uniquely, in NavIC satellite navigation, which
        gives it an anti-jam advantage few competitors hold. It is dependent at the bottom, where the weapon is actually
        decided. Close to 90% of India&apos;s small-drone flight controllers are imported from China; roughly 84% of its
        lithium-ion cells; and the deepest dependency of all is the sintered neodymium-iron-boron magnet, with its
        dysprosium and terbium, which sits under every electric motor in the fleet and which China placed under export
        licensing in April 2025. India&apos;s buffer against a supply shock is measured in weeks; its remedies &mdash; the
        &#8377;7,280 crore magnet scheme and the &#8377;34,300 crore critical-mineral mission &mdash; do not reach scale
        before roughly 2028.
      </p>
      <SovereigntyFigure />

      <h2 id="frameworks">The eight frameworks</h2>
      <p>
        The report scores India&apos;s position on eight reproducible instruments. The <strong>LM-Sovereignty Index</strong>
        grades roughly forty subsystems on India&apos;s capability against the global leader. The <strong>SHAKTIBAAN Demand
        Model</strong> derives the ten-year requirement from force structure rather than assertion. The
        <strong> Attritable-Precision Value Stack</strong> shows where the money and the vulnerability sit in one munition.
        The <strong>Category-Attractiveness Matrix</strong> ranks the six loitering-munition categories on market
        attractiveness against Indian readiness. The <strong>Cost-Exchange Efficiency Curve</strong> formalises the
        procurement economics; the <strong>Indigenisation Readiness Ladder</strong> grades each subsystem from import to
        sovereign export; the <strong>Investment Priority Matrix</strong> scores the opportunity surfaces for capital; and
        the <strong>Procurement Sovereignty Clock</strong> sets out, as a datable sequence, what must be true by when for
        India&apos;s fleet to be genuinely its own by 2035.
      </p>

      <h2 id="opportunities">Where to build now</h2>
      <p>
        For builders and investors the clearest conclusion is that the airframe is the crowded trade and the subsystem is
        the open one. The most defensible, least-contested positions sit in magnets, seekers, trusted flight controllers and
        anti-jam datalinks &mdash; the layers every prime needs and none owns. The highest-strategic-value layers score
        &ldquo;Build-now&rdquo; not because they are easy but because the demand is guaranteed and the substitution prize is
        largest.
      </p>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>#</th><th>Opportunity surface</th><th>Why it is open</th><th>Tier</th></tr>
          </thead>
          <tbody>
            {OPPS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="comparators">What Israel, Turkey and China teach</h2>
      <p>
        The countries that lead this field lead it because they own the upstream. Israel holds the seekers and the
        electronic-warfare depth &mdash; and routes almost all of the foreign technology transfer into India, through Elbit,
        IAI and now UVision. Turkey built export-grade capability from a standing start with a lever India lacks: a state
        expectation of 75%-plus domestic content that deliberately constructs a component base, of which Baykar&apos;s
        roughly 93% localisation is the proof. China controls an estimated four-fifths of the world&apos;s drone-component
        supply chain through the Shenzhen cluster. None of them leads by assembling well. India, which assembles well, must
        decide whether it wants to lead or merely to field.
      </p>

      <h2 id="the-path">A path to 2035</h2>
      <p>
        The realistic doctrine is selective sovereignty, not autarky. Build now what is ready &mdash; the high-volume
        categories, autonomy software, counter-UAS, certification capacity &mdash; and seed the hard layers in parallel;
        close the magnet, seeker and compute gaps as the critical-mineral and magnet schemes mature toward the end of the
        decade; and treat sovereignty as a schedule rather than a slogan. Whether India&apos;s fleet is genuinely its own by
        2035 depends less on technology than on whether the industrial policy of 2025-2028 is executed.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the thesis, the procurement signal, the cost-exchange economics and the sovereignty
        map. The complete edition adds the full <strong>LM-Sovereignty Index</strong> across every subsystem, the
        transparent <strong>SHAKTIBAAN Demand Model</strong> and its three 2035 scenarios, the six-category specification
        matrix and Category-Attractiveness Matrix, the domestic and foreign supplier atlas with company profiles, the
        Investment Priority Matrix, the force-structure and operating concepts, and the procurement, budget and subsystem
        evidence base in full &mdash; six parts, seventeen chapters, 25 figures and the appendices.
      </p>
    </>
  );
}
