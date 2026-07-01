import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "Beyond Quantum Computing".
 * Carries the thesis (the ecosystem, not the computer), the National Quantum
 * Mission baseline, the ~90% hardware import dependence, where India leads,
 * the player map, the opportunity surfaces and the post-quantum risk clock.
 * The full edition is the paid PDF; PremiumBody renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'beyond-the-computer', label: 'Beyond the computer' },
  { id: 'the-mission', label: 'The National Quantum Mission' },
  { id: 'the-stack', label: 'Where India imports' },
  { id: 'the-strength', label: 'Where India leads' },
  { id: 'the-players', label: 'The ecosystem, mapped' },
  { id: 'opportunities', label: 'The opportunity surfaces' },
  { id: 'the-risk', label: 'The post-quantum clock' },
  { id: 'the-path', label: 'A path to 2033' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure 1 - where India competes vs where it imports, by layer */
function StackFigure() {
  const rows = [
    { n: 'Full-stack software & algorithms', v: 85, c: TEAL },
    { n: 'Quantum security (QKD / QRNG)', v: 80, c: TEAL },
    { n: 'Systems integration', v: 60, c: BRASS },
    { n: 'Optical clocks / metrology', v: 35, c: BRASS },
    { n: 'Cryogenics / dilution refrigerator', v: 20, c: CRIMSON },
    { n: 'Control electronics / AWGs', v: 15, c: CRIMSON },
    { n: 'Lasers & photonics', v: 12, c: CRIMSON },
    { n: 'Single-photon detectors', v: 10, c: CRIMSON },
    { n: 'Materials / substrates', v: 10, c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-stack">
      <div className="fig-frame">
        <svg viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's estimated value capture by quantum-stack layer: software and quantum security are high; cryogenics, control electronics, lasers, detectors and materials are import-dependent">
          {rows.map((r, i) => {
            const y = 20 + i * 48;
            const w = (r.v / 100) * 440;
            return (
              <g key={r.n}>
                <text x={16} y={y + 21} fontSize={13} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={300} y={y} width={Math.max(w, 6)} height={30} rx={4} fill={r.c} />
                <text x={300 + Math.max(w, 6) + 8} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.v}%</text>
              </g>
            );
          })}
          <text x={300} y={452} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Estimated India value capture by layer &middot; modelled</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; India competes at the top of the stack (software, quantum security) and imports the bottom (cryogenics, control electronics, lasers, detectors, materials) &mdash; an estimated ~90% of the critical hardware. Modelled estimate.</figcaption>
    </figure>
  );
}

/* Figure 2 - National Quantum Mission: allocated vs spent */
function MissionFigure() {
  const bars = [
    { n: 'FY25-26 allocation', v: 1260.98, c: BRASS, label: 'Rs 1,261 cr' },
    { n: 'Cumulative spent (Mar 2025)', v: 43.07, c: CRIMSON, label: 'Rs 43 cr' },
  ];
  const max = 1260.98;
  return (
    <figure className="report-figure" id="fig-mission">
      <div className="fig-frame">
        <svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="National Quantum Mission FY25-26 allocation of about Rs 1,261 crore versus cumulative spend of about Rs 43 crore">
          {bars.map((b, i) => {
            const y = 40 + i * 78;
            const w = (b.v / max) * 470;
            return (
              <g key={b.n}>
                <text x={16} y={y - 8} fontSize={14} fontWeight={600} fill="#E8E8F0">{b.n}</text>
                <rect x={16} y={y} width={Math.max(w, 6)} height={38} rx={5} fill={b.c} />
                <text x={16 + Math.max(w, 6) + 10} y={y + 25} fontSize={14} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{b.label}</text>
              </g>
            );
          })}
          <text x={16} y={222} fontSize={11} fill="#8A8AA0" fontFamily="monospace">National Quantum Mission &middot; total outlay Rs 6,003.65 cr (2023-2031)</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The mission is stood up; the money is not yet flowing. The gap between annual allocation and cumulative disbursement is the clearest near-term constraint.</figcaption>
    </figure>
  );
}

const OPPS = [
  ['Post-quantum cybersecurity', 'Build-now', 'Dated regulatory demand (SEBI, RBI CBOM); software + services'],
  ['Quantum key distribution / QRNG', 'Build-now', 'Existing Indian strength (QNu Labs); defence + BFSI offtake'],
  ['Quantum sensing', 'Position-early', 'Dual-use; defence-led (DRDO), medical proof points'],
  ['Cryogenics & enabling components', 'Position-early', 'First indigenisation done (dilution refrigerator ~70% Indian)'],
  ['Full-stack software & control', 'Build-now', 'Design-led, no fab required (QpiAI); talent-rich'],
  ['Lasers / photonics / detectors', 'Watch', 'Deep import dependence; long-horizon localisation'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="beyond-the-computer">Beyond the computer</h2>
      <p>
        India&apos;s quantum conversation is dominated by a single race: who builds the largest quantum computer, and when.
        That is the wrong frame for an industrial strategy. The more consequential story is the <em>ecosystem</em> forming
        around the machine &mdash; computing, communication and security, sensing, cryogenics, photonics, materials and
        post-quantum software &mdash; because that is where most of the capturable value sits, and where India&apos;s
        existing strengths in software, design and systems can actually compete. The question this report works is not
        &ldquo;can India build a quantum computer&rdquo; but &ldquo;what industrial ecosystem does the quantum transition
        create, and where can India capture value rather than inherit a timeline?&rdquo;
      </p>

      <h2 id="the-mission">The National Quantum Mission</h2>
      <p>
        India is not starting cold. The National Quantum Mission, approved in April 2023 at a total outlay of
        &#8377;6,003.65 crore through 2030&ndash;31, organises the effort into four thematic hubs &mdash; computing (led by
        IISc Bengaluru), communication (IIT Madras with C-DOT), sensing &amp; metrology, and materials &amp; devices &mdash;
        with headline goals of 50&ndash;1,000-qubit machines and satellite-based quantum key distribution over ~2,000 km.
        The scaffolding is real. The constraint is execution: cumulative spend was reported at roughly &#8377;43 crore as of
        early 2025 against a FY25&ndash;26 allocation of &#8377;1,261 crore. The mission is stood up; the money is not yet
        flowing at the rate the timeline implies.
      </p>
      <MissionFigure />

      <h2 id="the-stack">Where India imports</h2>
      <p>
        The dependence concentrates in the physical layer. Indian research labs import an estimated ~90% of the critical
        quantum-computing subsystems &mdash; dilution refrigerators, high-purity substrates, arbitrary waveform generators,
        specialised lasers, single-photon detectors and cryogenic components &mdash; sourced from a small set of global
        suppliers (Bluefors, Oxford Instruments and Leiden for cryogenics; Keysight and Zurich Instruments for control
        electronics; ID Quantique for detectors). This is the same shape as India&apos;s drone and semiconductor stories:
        the country competes at the top of the stack and imports the bottom. The exposure is sharpened by policy abroad
        &mdash; the United States is moving cryogenic systems toward export-controlled lists, directly over India&apos;s
        single biggest hardware gap.
      </p>
      <StackFigure />

      <h2 id="the-strength">Where India leads</h2>
      <p>
        The picture is not one of weakness everywhere. India is genuinely strong at two layers that matter most for trust
        and for near-term commercial value: quantum security and software. QNu Labs builds indigenous quantum random-number
        and key-distribution systems and has deployed a roughly 1,000 km QKD network &mdash; ahead of the mission&apos;s
        eight-year target &mdash; and is exporting. QpiAI has built full-stack systems, moving from a 25-qubit machine in
        early 2025 to a 64-qubit machine later that year. And early indigenisation is appearing at the hard layers: a
        domestic dilution refrigerator at roughly 70% Indian content, and India&apos;s first indigenous high-precision diode
        laser in late 2025. The sovereign opportunity is to widen these bridgeheads, not to attempt the entire stack at once.
      </p>

      <h2 id="the-players">The ecosystem, mapped</h2>
      <p>
        A credible ecosystem is already visible. In computing, QpiAI (backed by the mission and Avataar Ventures) anchors
        the full-stack effort. In security and communication, QNu Labs leads. In the enabling layers sit Dimira (cryogenic
        cables), PrenishQ (diode lasers), QuPrayog (optical atomic clocks), Quanastra (cryogenics and detectors), Pristine
        Diamonds (sensing materials) and Quan2D (single-photon detectors), with Sidwal Industries and QBit Force behind the
        indigenous dilution refrigerator. In sensing, the DRDO Quantum Technology Research Centre anchors defence
        applications &mdash; magnetometry for submarine and stealth detection, atomic clocks for GNSS-denied timing &mdash;
        while startups such as GDQ Labs pursue civil uses like cardiac magnetometry. The full report profiles each and maps
        how the layers connect.
      </p>

      <h2 id="opportunities">The opportunity surfaces</h2>
      <p>
        Read as an opportunity map rather than a science project, the ecosystem sorts into what India can build now and what
        it should position for. The nearest-term, most commercial surfaces are the ones with dated demand or existing
        strength; the hardest hardware layers are deliberate, longer-horizon bets.
      </p>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>Opportunity surface</th><th>Readiness</th><th>Why</th></tr>
          </thead>
          <tbody>
            {OPPS.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td><strong>{r[1]}</strong></td><td>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="the-risk">The post-quantum clock</h2>
      <p>
        Running alongside the opportunity is a risk that is already live. &ldquo;Harvest-now, decrypt-later&rdquo; means data
        exfiltrated today can be broken once a capable quantum computer exists, so any Indian data with a confidentiality
        life beyond ~2030 &mdash; government records, defence communications, financial and health data &mdash; is exposed
        now. India&apos;s response is arriving in layers: a national quantum-safe roadmap from the DST task force
        (February 2026, critical infrastructure by 2027, nationwide by 2033), SEBI&apos;s live cyber-resilience framework,
        and an RBI Q-SAFE committee with a mandatory Cryptography Bill of Materials from FY2027&ndash;28. The teeth are
        appearing sector by sector; what is still missing is a single funded, cross-government mandate of the kind the United
        States adopted in June 2026.
      </p>

      <h2 id="the-path">A path to 2033</h2>
      <p>
        The realistic doctrine is selective sovereignty. Build now where India is ready or where regulation creates demand
        &mdash; post-quantum cybersecurity, QKD/QRNG, full-stack software; position early in sensing and enabling components
        as the mission&apos;s funding flows; and secure trusted-supply arrangements for the deepest hardware layers
        (cryogenics, lasers, detectors, materials) that cannot be localised by the end of the decade. The measure of success
        is not one giant quantum computer but a widening share of the ecosystem&apos;s value captured at home.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the thesis, the mission baseline, the dependency picture, the player map and the
        opportunity surfaces. The complete edition adds the full nine-layer ecosystem framework and its scoring, the
        component-by-component import breakdown, the player and investor directories, the quantum-sensing deep dive, the
        post-quantum migration playbook by sector, market-sizing across the segments, five-nation benchmarking, and the
        strategic roadmap to 2033 in full.
      </p>
    </>
  );
}
