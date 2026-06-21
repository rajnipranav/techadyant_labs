import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "Who Controls India's Drones?".
 * Carries the thesis, the import-dependence finding, the vulnerability stack, the
 * four proprietary frameworks and the Build-now opportunities. The full edition
 * (seventeen chapters, thirty-five figures, the Strategic Vulnerability Index, the
 * Opportunity Map, the Winners & Losers grid and the costed recommendations) is the
 * paid PDF; PremiumBody renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'India flies drones it cannot control' },
  { id: 'the-finding', label: 'The 39% that is really 70-80%' },
  { id: 'the-stack', label: 'Where the control stack is exposed' },
  { id: 'frameworks', label: 'Four frameworks' },
  { id: 'opportunity', label: 'Where to build now' },
  { id: 'winners', label: 'Winners and losers' },
  { id: 'the-path', label: 'A path to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure 1 - official 39% vs estimated 70-80% dependence */
function GapFigure() {
  const bars = [
    { n: 'Official (Lok Sabha, Apr 2025)', pct: 39, c: NAVY === NAVY ? '#5B6B82' : BRASS, sub: 'certified small drones' },
    { n: 'Estimated (total market)', pct: 75, c: CRIMSON, sub: 'all categories incl. nano, micro, DJI' },
  ];
  return (
    <figure className="report-figure" id="fig-gap">
      <div className="fig-frame">
        <svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Official 39 percent of certified small-drone flight controllers from China versus an estimated 70 to 80 percent across the total market">
          {bars.map((b, i) => {
            const x = 90 + i * 320;
            const h = (b.pct / 100) * 150;
            return (
              <g key={b.n}>
                <rect x={x} y={180 - h} width={170} height={h} rx={6} fill={b.c} />
                <text x={x + 85} y={180 - h - 12} fontSize={26} fontWeight={700} fill="#E8E8F0" textAnchor="middle">{b.pct === 75 ? '70-80%' : b.pct + '%'}</text>
                <text x={x + 85} y={202} fontSize={13} fontWeight={600} fill="#E8E8F0" textAnchor="middle">{b.n}</text>
                <text x={x + 85} y={222} fontSize={11.5} fill="#8A8AA0" textAnchor="middle" fontFamily="monospace">{b.sub}</text>
              </g>
            );
          })}
          <text x={380} y={40} fontSize={13} fontWeight={700} fill={CRIMSON} textAnchor="middle" fontFamily="monospace">a 31-41 point undercount</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The official 39% covers only DGCA-certified small drones. Add nano, micro, uncertified and complete-import categories and effective dependence is 70&ndash;80%. Government figure; total-market share is a triangulated estimate.</figcaption>
    </figure>
  );
}

/* Figure 2 - Strategic Vulnerability Index, most exposed layers */
function SviFigure() {
  const rows = [
    { n: 'Flight-control processor (SoC)', v: 98, c: CRIMSON },
    { n: 'MEMS inertial sensors (IMU)', v: 92, c: CRIMSON },
    { n: 'EW resilience / anti-jam', v: 88, c: CRIMSON },
    { n: 'Edge-AI compute hardware', v: 88, c: CRIMSON },
    { n: 'GPS-denied navigation', v: 83, c: BRASS },
    { n: 'AI mission software', v: 58, c: TEAL },
    { n: 'Firmware', v: 50, c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-svi">
      <div className="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strategic Vulnerability Index: processor 98, MEMS 92, EW resilience 88, edge-AI 88, GPS-denied 83, AI software 58, firmware 50">
          {rows.map((r, i) => {
            const y = 22 + i * 40;
            const w = (r.v / 100) * 430;
            return (
              <g key={r.n}>
                <text x={18} y={y + 16} fontSize={12.5} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={300} y={y} width={w} height={24} rx={4} fill={r.c} />
                <text x={300 + w + 8} y={y + 18} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.v}</text>
              </g>
            );
          })}
          <text x={300} y={308} fontSize={11} fill="#8A8AA0" fontFamily="monospace">0-100, higher = more exposed &middot; Techadyant model</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The Strategic Vulnerability Index. The four Critical-tier layers are all silicon (processor, MEMS, edge-AI) or the EW resilience that depends on it; India is strongest where exposure is lowest. Modelled estimate.</figcaption>
    </figure>
  );
}

const OPPS = [
  ['1', 'GPS-denied / EW autonomy', 'USD 250-350M', 'Build-now (defence)'],
  ['2', 'AI mission / autonomy software', 'USD 180-260M', 'Build-now'],
  ['3', 'Indigenous flight-control hardware', 'USD 200-300M', 'Build-now'],
  ['4', 'Counter-UAS autonomy', 'USD 150-220M', 'Position-early'],
  ['5', 'FC assembly & integration services', 'USD 80-140M', 'Cash engine'],
  ['6', 'Swarm intelligence (defence)', 'USD 120-500M by 2035', 'Long-horizon bet'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">India flies drones it cannot control</h2>
      <p>
        India is building drones faster than it can control them. The airframes, motors and even the sensors are
        increasingly assembled at home, but the component that decides where a drone goes and what it does &mdash; the
        flight controller, and the autonomy software layered on top of it &mdash; remains substantially foreign, and
        predominantly Chinese. If the companion report asked who <em>builds</em> India&apos;s drones, this one asks the
        sharper question: who <em>controls</em> them? The brain of the drone is imported, and that is a national-security
        exposure and a domestic market opportunity at the same time.
      </p>

      <h2 id="the-finding">The 39% that is really 70-80%</h2>
      <p>
        On 3 April 2025 the Government of India told the Lok Sabha that 39% of flight controllers in DGCA-certified small
        drones are sourced from China. That figure is real but narrow: it counts only certified small drones and excludes
        the nano and micro categories that dominate by volume, the uncertified and grey-market fleet, aftermarket boards,
        and fully imported platforms such as DJI. Add those back and effective dependence is 70&ndash;80%. The most acute
        exposure is deeper still: flight-control processors and MEMS inertial sensors are approximately 100% imported, so
        even &ldquo;indigenous&rdquo; controllers are assembled on foreign silicon.
      </p>
      <GapFigure />

      <h2 id="the-stack">Where the control stack is exposed</h2>
      <p>
        The control stack is a layered system, and value and vulnerability both concentrate at the ends &mdash; in the
        silicon at the base and the certified, electronic-warfare-resilient autonomy at the top. India captures value in
        assembly, firmware adaptation and, increasingly, mission software, but leaks it in the two layers that matter most
        strategically. Operation Sindoor in May 2025 made the point operationally: imported flight controllers lack the
        anti-jam and anti-spoof resilience that contested environments demand, turning electronic-warfare resilience and
        GPS-denied navigation into the highest-priority capabilities &mdash; and the ones where indigenous firms can
        differentiate.
      </p>
      <SviFigure />

      <h2 id="frameworks">Four frameworks</h2>
      <p>
        The report turns a diffuse sense of &ldquo;import dependence&rdquo; into a ranked, decision-grade picture using
        four proprietary frameworks: the <strong>Drone Autonomy Value Chain</strong> (where India captures and leaks value,
        layer by layer), the <strong>Strategic Vulnerability Index</strong> (every layer scored on dependence and strategic
        importance), the <strong>Import Vulnerability Matrix</strong> (which exposures justify state investment versus
        ordinary localisation), and the <strong>India Drone Autonomy Maturity Model</strong> (five levels, and why value
        migrates toward exactly the capabilities India is weakest in). Together they explain why a localisation programme
        optimised for the easy layers can raise the headline percentage while leaving every Critical exposure intact.
      </p>

      <h2 id="opportunity">Where to build now</h2>
      <p>
        Policy has converted localisation from a preference into a condition of market access: the new INR 2,000 crore PLI
        scheme mandates 40% domestic value addition in flight controllers, navigation and communication modules by
        FY2027-28. Against a market growing from USD 150&ndash;200 million in 2026 toward USD 800 million&ndash;1.2 billion
        by 2035, that defines a domestic substitution opportunity above USD 500 million in addressable annual value.
        Opportunity sizing &mdash; not market sizing &mdash; locates where capital earns a return.
      </p>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>#</th><th>Opportunity segment</th><th>Addressable value</th><th>Posture</th></tr>
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
      <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Addressable values are Techadyant modelled estimates for the early 2030s.</p>

      <h2 id="winners">Winners and losers</h2>
      <p>
        Four levers &mdash; the PLI scheme, the Army&apos;s 515 Base Workshop validation model, BVLOS commercialisation and
        indigenous-content procurement preference &mdash; are about to redistribute value. The clear winners are
        vertically integrated indigenous players (ideaForge, listed since 2023), patented flight-control startups (Zuppa),
        electronic-warfare and GPS-denied specialists (Tsalla), Army-validated entrants (Yaanendriya) and defence primes
        (BEL, Raphe mPhibr). The exposed are OEMs that rely on imported Pixhawk-class boards without localising,
        Pixhawk-clone importers, uncertified &ldquo;AI&rdquo; software claimants and Chinese suppliers. Beneath the
        actor-by-actor map sits one structural shift: capital is concentrating at the platform layer while the
        flight-control layer &mdash; where strategic value is highest &mdash; is starved.
      </p>

      <h2 id="the-path">A path to 2035</h2>
      <p>
        The realistic doctrine is selective sovereignty. Build now what is ready &mdash; indigenous flight-control
        hardware, EW-resilient and GPS-denied autonomy, AI mission software, and certification and integration services.
        Seed the hard layers in parallel: a RISC-V flight-control system-on-chip and MEMS packaging are five-to-eight-year
        undertakings, and processors should be exempted from the 40% localisation count until domestic capacity exists, or
        the target is unreachable. Success is one measurable number: import dependence moving from roughly 70% toward 45%
        by 2030.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the thesis, the import-dependence finding, the vulnerability stack and the
        Build-now map. The complete edition adds the full Strategic Vulnerability Index across the control stack, the
        Drone Autonomy Opportunity Map and maturity model, the Winners &amp; Losers grid, five costed recommendations with
        owner, cost and timeline, an evidence-hierarchy methodology, and twelve deep-dive chapters on flight-controller
        technology, AI and autonomy systems, market sizing and segmentation, the import-dependence and PLI analysis, the
        regulatory landscape, the competitive landscape, investment and funding, and the technology roadmap to 2035 &mdash;
        seventeen chapters and thirty-five figures in all.
      </p>
    </>
  );
}
