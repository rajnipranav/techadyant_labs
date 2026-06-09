import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "Who Builds India's Drones?".
 * Carries the thesis, the dependency stack, the value-capture finding, the six
 * frameworks and the Build-now opportunities. The full ~150-page edition (thirteen
 * chapters, sixteen figures, the 100-opportunity registry, the 50-component Drone
 * Sovereignty Index and thirteen appendices) is the paid PDF; PremiumBody renders
 * the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'Assembles, but does not build' },
  { id: 'parts-not-planes', label: 'The customs proof' },
  { id: 'the-stack', label: 'Where India is exposed' },
  { id: 'value-capture', label: 'What the gap costs' },
  { id: 'frameworks', label: 'The six frameworks' },
  { id: 'opportunities', label: 'Where to build now' },
  { id: 'comparators', label: 'What Turkey and Korea teach' },
  { id: 'the-path', label: 'A path to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure 1 - parts, not planes (log-scaled import bars) */
function PartsFigure() {
  const rows = [
    { n: 'Finished drones', v: 8.3, c: CRIMSON, label: 'US$8.3M' },
    { n: 'Permanent magnets', v: 222, c: BRASS, label: 'US$222M' },
    { n: 'Aircraft / drone parts', v: 767, c: BRASS, label: 'US$767M' },
    { n: 'Lithium-ion cells', v: 4697, c: TEAL, label: 'US$4,697M' },
  ];
  const max = Math.log10(4697);
  return (
    <figure className="report-figure" id="fig-parts">
      <div className="fig-frame">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's drone-related imports FY2025-26: finished drones US$8.3M versus parts US$767M and cells US$4,697M, log scale">
          {rows.map((r, i) => {
            const y = 28 + i * 58;
            const w = (Math.log10(r.v) / max) * 480;
            return (
              <g key={r.n}>
                <text x={18} y={y + 16} fontSize={14} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={235} y={y} width={Math.max(w, 8)} height={30} rx={4} fill={r.c} />
                <text x={235 + Math.max(w, 8) + 10} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.label}</text>
              </g>
            );
          })}
          <text x={235} y={262} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Log scale &middot; FY2025-26 &middot; DGCIS Export-Import Data Bank</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; India buys the parts, not the planes. Finished-drone imports are negligible; parts and materials are roughly a hundred times larger.</figcaption>
    </figure>
  );
}

/* Figure 2 - value capture today vs achievable */
function ValueFigure() {
  const bars = [
    { n: 'Captured today', pct: 43, c: BRASS, sub: '~US$1.9bn' },
    { n: 'Achievable', pct: 66, c: TEAL, sub: '~US$3.0bn' },
  ];
  return (
    <figure className="report-figure" id="fig-value">
      <div className="fig-frame">
        <svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India captures about 43 percent of its drone market value today, rising to about 66 percent if upstream gaps close">
          {bars.map((b, i) => {
            const x = 90 + i * 320;
            const h = (b.pct / 100) * 150;
            return (
              <g key={b.n}>
                <rect x={x} y={180 - h} width={170} height={h} rx={6} fill={b.c} />
                <text x={x + 85} y={180 - h - 12} fontSize={26} fontWeight={700} fill="#E8E8F0" textAnchor="middle">{b.pct}%</text>
                <text x={x + 85} y={202} fontSize={14} fontWeight={600} fill="#E8E8F0" textAnchor="middle">{b.n}</text>
                <text x={x + 85} y={222} fontSize={12} fill="#8A8AA0" textAnchor="middle" fontFamily="monospace">{b.sub}</text>
              </g>
            );
          })}
          <text x={380} y={40} fontSize={13} fontWeight={700} fill={BRASS} textAnchor="middle" fontFamily="monospace">+US$1.1bn / year by 2030</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The Drone Value Capture Model. The gap between today and the achievable share is a reshoring prize concentrated in propulsion, sensors, electronics and power. Modelled estimate.</figcaption>
    </figure>
  );
}

const OPPS = [
  ['1', 'AI / autonomy software', '76.0', 'Build-now'],
  ['2', 'Counter-UAS systems', '71.5', 'Build-now'],
  ['3', 'Battery packs & BMS', '69.0', 'Build-now'],
  ['4', 'Test & certification infrastructure', '68.5', 'Build-now'],
  ['5', 'Ground control stations', '63.0', 'Position-early'],
  ['6', 'Autonomous swarm systems', '62.0', 'Position-early'],
  ['7', 'Drone motors', '60.5', 'Position-early'],
  ['8', 'Drone sensors & optics', '58.0', 'Position-early'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">Assembles, but does not build</h2>
      <p>
        India now has more than 38,500 registered drones, nearly 40,000 certified pilots and a policy stack that treats
        drones as national infrastructure. By almost any headline measure the industry is thriving. Underneath the growth,
        however, sits a harder question: when India fields a drone, who actually built it? Read from India&apos;s own trade
        data, the answer is uncomfortable. India has built a drone <em>assembly</em> industry, not a drone
        <em> manufacturing</em> one &mdash; and the distinction is the whole story.
      </p>

      <h2 id="parts-not-planes">The customs proof</h2>
      <p>
        In FY2025-26 India imported only about US$8 million of finished drones, because the 2022 import ban works on whole
        units. In the same year it imported roughly US$767 million of drone and aircraft parts &mdash; about a hundred
        times more &mdash; alongside US$4.7 billion of lithium-ion cells. The country buys the parts, not the planes, and
        assembles the difference. That is not a failure of entrepreneurship; it is a feature of policy. The 2022 ban
        prohibited finished foreign drones while leaving components free to import, creating a protected market for
        assembly without building the component base beneath it &mdash; and so relocating the dependency upstream rather
        than removing it.
      </p>
      <PartsFigure />

      <h2 id="the-stack">Where India is exposed</h2>
      <p>
        Value and vulnerability both sit upstream. The airframe &mdash; the most visible part of a drone &mdash; is the
        least strategically significant; capability and intellectual property concentrate at the back of the stack, in the
        magnets and motors, the cells, the sensors, the radio-frequency electronics and the flight-controller silicon.
        India is genuinely strong in software and systems integration and weak below that line. The dependency is also
        concentrated in one direction: China supplies roughly 78% of India&apos;s rare-earth permanent-magnet imports,
        about 84% of its lithium-ion cells, and the bulk of small-drone flight controllers and motors. China&apos;s 2025
        rare-earth export controls showed this is not merely a commercial fact but an instrument &mdash; one India met
        directly during Operation Sindoor in May 2025, which triggered an emergency-procurement ceiling of &#8377;9,100
        crore weighted heavily toward drones and counter-drone systems.
      </p>

      <h2 id="value-capture">What the gap costs</h2>
      <p>
        Measured by value-weighting localisation across the component stack, India captures roughly 43% of its drone
        market&apos;s economic value today, and could capture about two-thirds if the upstream gaps were closed. At the
        2030 market scale that difference is a reshoring prize of roughly US$1.1 billion a year, concentrated in exactly
        the four layers the data flags as critical: propulsion, sensors, electronics and power. The missing quarter of the
        value is the same quarter every time &mdash; which is what makes the problem tractable.
      </p>
      <ValueFigure />

      <h2 id="frameworks">The six frameworks</h2>
      <p>
        The report scores India&apos;s drone industrial base on one reproducible system of six indices, each running
        0&ndash;100 from published band anchors: the <strong>Drone Localization Index</strong> (how much value India
        captures in a component), the <strong>Drone Supply-Chain Dependency Map</strong> (its mirror &mdash; exposure if a
        supplier stops), the <strong>Drone Capability Stack</strong> (the picture layer by layer), the <strong>Drone
        Industrial Readiness Matrix</strong> (the hidden enabling industries), the <strong>Drone Corridor Readiness
        Index</strong> (which states can anchor manufacturing), and the headline <strong>Drone Opportunity Surface
        Framework</strong>, which turns all of it into a single question: of every place you could build, which is most
        attractive today?
      </p>

      <h2 id="opportunities">Where to build now</h2>
      <p>
        Four opportunity surfaces clear the Build-now bar &mdash; autonomy and mission software, counter-unmanned-systems,
        battery packs and management systems, and test-and-certification infrastructure. The highest-strategic-value
        layers (motors, sensors, communications) score lower today because India&apos;s readiness in them is thin, which
        is precisely why they are the deliberate, longer-horizon bets.
      </p>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>#</th><th>Opportunity surface</th><th>DOSF</th><th>Tier</th></tr>
          </thead>
          <tbody>
            {OPPS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td>{r[1]}</td><td><strong>{r[2]}</strong></td><td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="comparators">What Turkey and Korea teach</h2>
      <p>
        Turkey built export-grade drone capability from a standing start with a lever India lacks: its state procurement
        agency reportedly requires producers to pass 60&ndash;80% of contract value down to domestic subcontractors,
        deliberately constructing a component base. South Korea is the sharper near-peer &mdash; it hosts some of the
        world&apos;s largest battery-cell makers yet its drone-grade ecosystem is thin and China-dependent, proof that a
        giant adjacent industry does not automatically confer drone capability. Both point to the same instrument for
        India: attach domestic-value conditions to the large institutional offtake it already controls.
      </p>

      <h2 id="the-path">A path to 2035</h2>
      <p>
        The realistic doctrine is selective sovereignty, not autarky. Build now what is ready &mdash; autonomy software,
        counter-UAS, battery packs, certification capacity &mdash; and seed the hard layers in parallel; close the
        strategic gaps as the sintered-magnet and battery-cell schemes mature toward the end of the decade; and own the
        deep layers last &mdash; trusted flight-controller silicon and sensors &mdash; through partnership-led capability
        transfer. Success is one measurable number: value capture moving from roughly 43% toward two-thirds.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the thesis, the customs evidence, the value-capture finding and the Build-now map.
        The complete edition adds the full scoring rubrics for all six frameworks, the <strong>100-opportunity Drone
        Opportunity Registry</strong>, the <strong>50-component Drone Sovereignty Index</strong>, a supply-chain atlas and
        company directory of India&apos;s and China&apos;s drone industries, an investor opportunity matrix, state-by-state
        playbooks, supply-shock dependency scenarios with likelihoods, a bill-of-materials database by drone type, a
        manufacturing playbook for each venture type, and the customs, procurement and policy evidence base in full &mdash;
        thirteen chapters, sixteen figures and thirteen reference appendices.
      </p>
    </>
  );
}
