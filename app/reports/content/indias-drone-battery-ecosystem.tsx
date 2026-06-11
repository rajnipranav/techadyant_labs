import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Drone Battery Ecosystem" (Flight Risk).
 * Carries the core finding, the China dependency, the value-capture argument,
 * the two proprietary frameworks (DBSI and the Readiness Model) and the
 * Build-now opportunities. The full ~145-page edition (nine chapters, thirty-plus
 * figures, a ten-chart CXO dashboard, four 2035 scenarios, six appendices and a
 * companion Excel data pack) is the paid PDF; PremiumBody renders the paywall
 * after this.
 */
export const toc: TocItem[] = [
  { id: 'the-finding', label: 'Built on imported power' },
  { id: 'why-battery', label: 'Why the battery decides the race' },
  { id: 'dependency', label: 'The China chokepoint' },
  { id: 'value', label: 'Where the value sits' },
  { id: 'frameworks', label: 'The Sovereignty Index & Readiness Model' },
  { id: 'opportunity', label: 'Where to build now' },
  { id: 'scenarios', label: 'Four futures to 2035' },
  { id: 'the-path', label: 'What to do' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';
const GREEN = '#2BC5B4';

/* Figure 1 - where the value sits in a 1 kWh defence drone pack */
function TeardownFigure() {
  const seg = [
    { n: 'Cell (imported)', pct: 60, c: CRIMSON, label: '60% · $600' },
    { n: 'BMS & ICs', pct: 15, c: BRASS, label: '15% · $150' },
    { n: 'Enclosure / thermal', pct: 15, c: TEAL, label: '15% · $150' },
    { n: 'Assembly / test', pct: 10, c: GREEN, label: '10% · $100' },
  ];
  let x = 60;
  return (
    <figure className="report-figure" id="fig-teardown">
      <div className="fig-frame">
        <svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Value split of a representative 1 kWh defence drone pack: 60 percent imported cell, 40 percent capturable in India">
          {seg.map((s) => {
            const w = (s.pct / 100) * 640;
            const g = (
              <g key={s.n}>
                <rect x={x} y={60} width={w} height={56} fill={s.c} />
                <text x={x + w / 2} y={92} fontSize={12} fontWeight={700} fill="#0F1828" textAnchor="middle">{s.pct}%</text>
              </g>
            );
            x += w;
            return g;
          })}
          <text x={60} y={44} fontSize={13} fontWeight={600} fill="#E8E8F0">US$1,000 pack to OEM</text>
          <line x1={60} y1={130} x2={444} y2={130} stroke={CRIMSON} strokeWidth={3} />
          <text x={252} y={150} fontSize={12} fill={CRIMSON} textAnchor="middle" fontWeight={700}>60% imported commodity</text>
          <line x1={444} y1={130} x2={700} y2={130} stroke={TEAL} strokeWidth={3} />
          <text x={572} y={150} fontSize={12} fill={TEAL} textAnchor="middle" fontWeight={700}>~40% capturable in India</text>
          <text x={60} y={210} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Representative BoM &middot; Techadyant Labs</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The cell is ~60% of a drone pack and ~100% imported; the other ~40% &mdash; BMS, thermal, enclosure, integration &mdash; is where India can compete, and where the margins are.</figcaption>
    </figure>
  );
}

/* Figure 2 - Drone Battery Sovereignty Index by country */
function DbsiFigure() {
  const rows = [
    { n: 'China', v: 85, c: BRASS },
    { n: 'South Korea', v: 75, c: TEAL },
    { n: 'Japan', v: 72, c: TEAL },
    { n: 'United States', v: 68, c: TEAL },
    { n: 'Taiwan', v: 60, c: TEAL },
    { n: 'India', v: 30, c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-dbsi">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Drone Battery Sovereignty Index: China 85, South Korea 75, Japan 72, United States 68, Taiwan 60, India 30 out of 100">
          {rows.map((r, i) => {
            const y = 24 + i * 44;
            const w = (r.v / 100) * 480;
            return (
              <g key={r.n}>
                <text x={18} y={y + 20} fontSize={13} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={170} y={y} width={w} height={28} rx={3} fill={r.c} />
                <text x={170 + w + 10} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.v}</text>
              </g>
            );
          })}
          <text x={170} y={290} fontSize={11} fill="#8A8AA0" fontFamily="monospace">DBSI 0&ndash;100 &middot; Techadyant Labs model</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; India scores 30/100 on the Drone Battery Sovereignty Index &mdash; last among the major battery nations, but strong at the pack and software layers where margin concentrates.</figcaption>
    </figure>
  );
}

const POOLS: [string, string, string, string][] = [
  ['Smart BMS & analytics', '3,200', '28–35%', 'Now'],
  ['Testing & certification', '1,200', '32–38%', 'Now'],
  ['Battery recycling', '2,500', '20–26%', 'Now'],
  ['Thermal & high-altitude IP', '1,500', '22–28%', 'Now'],
  ['Sodium-ion (build-ahead)', '3,000', '—', '3–5 yrs'],
  ['High-C cell manufacturing', '18,000', '16–20%', '5+ yrs'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="the-finding">Built on imported power</h2>
      <p>
        India is building a world-class drone industry on an imported energy core. Of every &#8377;100 of value an Indian
        drone OEM earns, more than &#8377;50 leaves the country for a concentrated, overwhelmingly Chinese, battery supply
        chain. On the report&apos;s Drone Battery Sovereignty Index, India scores just 30 out of 100 &mdash; last among the
        major battery nations. Yet the path out is counter-intuitive: India does not need to win cell manufacturing first
        to start winning. The fastest, highest-return move is to capture the intelligent layer &mdash; battery-management
        systems, analytics, certification and recycling &mdash; where value capture jumps from roughly 5% to 35&ndash;40%
        without first solving cell independence.
      </p>

      <h2 id="why-battery">Why the battery decides the race</h2>
      <p>
        Drones have become decisive infrastructure, and their single point of failure is energy. A drone&apos;s airframe
        and software can be Indian; if its battery cannot be sourced, the platform does not fly. The binding technical
        requirement is not energy density alone but high-rate (high-C) discharge &mdash; delivering power violently and
        instantly, often at 15&ndash;25C, without voltage collapse or thermal runaway. This is precisely the cell class
        India does not make, and the EV-focused PLI scheme &mdash; designed to reward energy density for electric scooters
        and grid storage &mdash; does not reward.
      </p>

      <h2 id="dependency">The China chokepoint</h2>
      <p>
        China controls roughly 78&ndash;84% of the lithium-ion cells and permanent magnets the Indian drone fleet depends
        on, by customs value. Concentration, not price, is the risk: a single administrative export halt &mdash; no formal
        ban required &mdash; could idle commercial and defence drone lines within weeks, because high-C cells have a brutal
        100&ndash;200 cycle life and almost no domestic buffer stock exists. The opacity is itself part of the finding.
        Customs data can prove the dependence but not its end-use, because a drone motor and a washing-machine motor share
        an HS code &mdash; a traceability gap that is a national-security problem as much as an economic one.
      </p>

      <h2 id="value">Where the value sits</h2>
      <p>
        The cell is roughly 60% of a pack&apos;s cost and is essentially 100% imported. The remaining ~40% &mdash; the
        enclosure, thermal management, high-current connectors, BMS firmware, state-of-health analytics, integration and
        certification &mdash; is where India can compete today, and it is where the margins are highest. Understanding
        exactly where that 40% sits is the difference between assembling drones and building an industry.
      </p>
      <TeardownFigure />

      <h2 id="frameworks">The Sovereignty Index and the Readiness Model</h2>
      <p>
        Two original frameworks turn the argument into numbers a board can track. The <strong>Drone Battery Sovereignty
        Index (DBSI)</strong> scores a country 0&ndash;100 across the six value-chain layers. India&apos;s composite of 30
        is built on strong packs and software &mdash; a far better starting position than 30 built on minerals alone. The
        <strong> Readiness Model</strong> defines five levels of value capture, from assembly to cell sovereignty: India
        sits between Level 1 and Level 2 today, and the near-term prize is Level 3, the intelligent energy systems
        provider, where capture reaches 35&ndash;40% without requiring cell independence first.
      </p>
      <DbsiFigure />

      <h2 id="opportunity">Where to build now</h2>
      <p>
        The India-addressable prize is about US$10.8 billion by 2030. The investable near-term pools are not the cells;
        they are the intelligent and service layers, defensible under Indian jurisdiction and reaching software-like
        margins. All figures are Techadyant Labs estimates, shown as base cases.
      </p>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>Opportunity pool</th><th>Base (&#8377; Cr)</th><th>Margin</th><th>Horizon</th></tr>
          </thead>
          <tbody>
            {POOLS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td><strong>{r[1]}</strong></td><td>{r[2]}</td><td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="scenarios">Four futures to 2035</h2>
      <p>
        Four scenarios to 2035 turn on a single variable: whether India invests in the layers it can build &mdash;
        intelligence, certification, recycling &mdash; or waits to solve cells first. A continued-dependence path keeps the
        least value and the most imports; a Drone Battery Mission path captures the most value, the most jobs and the most
        strategic autonomy. The difference between the best and worst case is not the size of the market &mdash; it is how
        much of it India keeps, and whether its fleet can fly without a foreign veto.
      </p>

      <h2 id="the-path">What to do</h2>
      <p>
        Sequence capital by readiness, not by ambition. Phase 1 (0&ndash;2 years) monetises the intelligent layer India
        already leads &mdash; smart BMS, certification labs, certified pack integration. Phase 2 (2&ndash;5 years) builds
        the moat in recycling, thermal IP and a sodium-ion pilot. Phase 3 (5&ndash;10 years) earns sovereignty in materials
        and cells. For government, the highest-leverage move is a domestic-value pass-through condition on defence offtake,
        paired with capex-weighted incentives for the high-power cell the PLI scheme ignores. The economics favour starting
        immediately; the strategic risk favours not waiting. The window is the next twenty-four months.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the core finding, the dependency, the value argument and the Build-now map. The
        complete ~145-page edition adds nine chapters and thirteen analytical sections, the full DBSI and Readiness Model
        rubrics, the Moat &amp; Margin Map, investment playbooks by capital tier, full financial models, six global case
        studies, a strategic risk dashboard, four quantified 2035 scenarios, thirty-plus figures, a ten-chart CXO
        dashboard, six appendices and a companion <strong>Excel data pack</strong> &mdash; India import data with a
        drone-grade flag, an interactive TAM/SAM model, a competitor battle-card database and an ED-301 certification cost
        estimator.
      </p>
    </>
  );
}
