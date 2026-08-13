import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "IAF Autonomous Air Power Roadmap 2026–2035".
 * Carries the thesis (the deficit is software, not aircraft), the AARI readiness
 * gap (34 vs USAF 88, 2035 projection 58–62 vs 42–46), the cost-exchange
 * revolution (1.5:1 → ~750:1), the two-front challenge, CATS Warrior 2030,
 * the four critical dependencies (20/25), the 75 IOSM opportunity surfaces and
 * the seven strategic priorities. The full 142-page edition (12 chapters, six
 * appendices, ~25 figures) is the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { iafToc as toc, IafContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'Software is the strategic bottleneck' },
  { id: 'the-readiness-gap', label: 'The readiness gap: AARI 34 vs 88' },
  { id: 'the-cost-exchange', label: 'The cost-exchange revolution' },
  { id: 'the-two-front-challenge', label: 'The two-front air challenge' },
  { id: 'the-cats-warrior', label: 'CATS Warrior and the 2030 IOC' },
  { id: 'the-critical-dependencies', label: 'Four critical dependencies' },
  { id: 'the-opportunity-surfaces', label: 'Where to build: 75 opportunity surfaces' },
  { id: 'the-seven-priorities', label: 'The seven strategic priorities' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const STEEL = '#5B8DB8';
const NAVY = '#0B2545';
const AMBER = '#E89E1B';
const SLATE = '#8C9AAE';
const CRIMSON = '#C0392B';

/* Figure 1 - AARI: India vs peers, and India's six dimensions */
function AariFigure() {
  const peers = [
    { n: 'USAF', v: 88 }, { n: 'PLAAF', v: 72 }, { n: 'RAF', v: 71 },
    { n: 'RAAF', v: 66 }, { n: 'India', v: 34 },
  ];
  const dims = [
    { n: 'Doctrine', v: 32 }, { n: 'Platform maturity', v: 28 },
    { n: 'Industrial ecosystem', v: 41 }, { n: 'AI software stack', v: 35 },
    { n: 'Test & certification', v: 38 }, { n: 'Operational integration', v: 30 },
  ];
  const W = 300;
  const x = (v: number) => Math.round((v / 100) * W);
  return (
    <figure className="report-figure" id="fig-aari">
      <div className="fig-frame">
        <svg viewBox="0 0 720 300" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Air Autonomy Readiness Index: India 34 vs USAF 88, PLAAF 72, RAF 71, RAAF 66; India's six dimensions 28-41">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Air Autonomy Readiness Index (0-100): India vs peers</text>
          {peers.map((r, i) => {
            const y = 38 + i * 26;
            const isIndia = r.n === 'India';
            return (
              <g key={r.n}>
                <text x="16" y={y + 11} fill="#0B1D33" fontSize="12" fontWeight={isIndia ? 700 : 600}>{r.n}</text>
                <rect x="120" y={y} width={x(r.v)} height="14" rx="3" fill={isIndia ? AMBER : STEEL} />
                <text x={120 + x(r.v) + 6} y={y + 11} fill={isIndia ? '#B45309' : NAVY} fontSize="11" fontWeight="700">{r.v}</text>
              </g>
            );
          })}
          <text x="430" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">India's six dimensions (0-100)</text>
          {dims.map((r, i) => {
            const y = 38 + i * 26;
            return (
              <g key={r.n}>
                <text x="430" y={y + 11} fill="#0B1D33" fontSize="11.5" fontWeight="600">{r.n}</text>
                <rect x="570" y={y} width={x(r.v) * 0.62} height="14" rx="3" fill={NAVY} />
                <text x={570 + x(r.v) * 0.62 + 6} y={y + 11} fill={NAVY} fontSize="11" fontWeight="700">{r.v}</text>
              </g>
            );
          })}
          <text x="628" y="296" fill={SLATE} fontSize="10.5" textAnchor="end">Techadyant Labs AARI - 2026 assessment [Model]</text>
        </svg>
      </div>
      <figcaption>India trails every peer on every dimension; the largest absolute gaps are AI Software Stack (-56 vs USAF) and Platform Maturity (-54).</figcaption>
    </figure>
  );
}

/* Figure 2 - cost-exchange ratio evolution 1990-2035 */
function CostExchangeFigure() {
  const rows = [
    { n: '1990 - manned fighter vs interceptor', v: 1.5, proj: false },
    { n: '2020 - 5th-gen fighter vs legacy interceptor', v: 12, proj: false },
    { n: '2020 - cruise missile vs Pantsir-class SAM', v: 50, proj: false },
    { n: '2020 - cheap drone vs Pantsir (Syria/Ukraine)', v: 90, proj: false },
    { n: '2035 - autonomous swarm vs exquisite SAM (projection)', v: 750, proj: true },
  ];
  const W = 470;
  const x = (v: number) => Math.round((Math.sqrt(v) / Math.sqrt(750)) * W);
  return (
    <figure className="report-figure" id="fig-cost-exchange">
      <div className="fig-frame">
        <svg viewBox="0 0 720 260" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Cost-exchange ratio evolution 1990 to 2035: 1.5 to 1, 12 to 1, 50 to 1, 90 to 1, projected 750 to 1">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Cost-exchange ratio (defender : attacker), 1990-2035</text>
          {rows.map((r, i) => {
            const y = 44 + i * 42;
            const w = x(r.v);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="11.5" fontWeight="600">{r.n}</text>
                <rect x="470" y={y + 2} width={w} height="16" rx="3" fill={r.proj ? AMBER : STEEL} />
                <text x={470 + w + 6} y={y + 15} fill={r.proj ? '#B45309' : NAVY} fontSize="12" fontWeight="700">{r.v}:1</text>
              </g>
            );
          })}
          <text x="628" y="22" fill={SLATE} fontSize="10.5" textAnchor="end">Techadyant Labs analysis [Model]</text>
        </svg>
      </div>
      <figcaption>From 1.5:1 in 1990 to a projected ~750:1 for autonomous swarms vs exquisite SAMs by 2035 - nearly three orders of magnitude. Ukraine, Red Sea and Israel-Lebanon engagement data inform the trajectory.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">Software is the strategic bottleneck</h2>
      <p>
        India enters the 2026-2035 decade with an assessed autonomous-air readiness score of 34/100 - less than half the
        USAF benchmark of 88 - and Techadyant Labs assesses that India is approximately a decade behind leading
        autonomous-air powers, <em>with the deficit concentrated in software rather than aircraft</em>. Three converging
        pressures define the decade: a 26% fighter-squadron shortfall (31 active vs 42 sanctioned), a maturing PLAAF
        autonomous-air threat (GJ-11 assessed operational, WZ-7 reported deployed to Tibet, a declared AI-swarm 2027
        target), and a cost-exchange ratio that has flipped nearly three orders of magnitude against exquisite
        air-defence architectures. This report's central argument is that the strategic task of the decade is not the
        next platform decision but the industrial substrate beneath autonomous air power - AI software, semiconductors,
        jet engines and advanced materials - and that India's rate of building that substrate, not the pace of platform
        announcements, is what will determine its 2035 posture.
      </p>

      <h2 id="the-readiness-gap">The readiness gap: AARI 34 vs 88</h2>
      <p>
        The Air Autonomy Readiness Index&trade; (AARI) is a composite 0-100 score across six equally weighted dimensions:
        Doctrine &amp; Concept Development (India 32), Platform Maturity (28), Industrial Ecosystem Depth (41),
        AI/Autonomy Software Stack (35), Test, Certification &amp; Airworthiness (38), and Operational Integration (30).
        India scores 34/100 against 88 for the USAF, 72 for the PLAAF, 71 for the RAF and 66 for the RAAF - trailing
        every peer on every dimension. The largest absolute gaps are AI Software Stack (-56 vs USAF) and Platform
        Maturity (-54). The report models the 2035 projection at <strong>58-62 under intervention scenarios</strong> and
        <strong>42-46 under no intervention</strong>; the 15-AARI-point gap between those paths is the strategic value at
        stake in the 2026-2027 policy choices.
      </p>
      <AariFigure />

      <h2 id="the-cost-exchange">The cost-exchange revolution</h2>
      <p>
        The cost-exchange ratio - defender cost divided by attacker cost - has shifted from approximately 1.5:1 for a
        1990 manned engagement to roughly 12:1 by 2020 for fifth-generation fighters, ~50:1 for cruise missiles,
        ~90:1 for cheap drones (Bayraktar TB2 vs Pantsir-S1, Syria 2020 and Ukraine 2022), and a projected
        <strong>~750:1 for autonomous swarms vs exquisite SAMs by 2035</strong> - nearly a three-order-of-magnitude shift
        in three decades. Recent engagements (Ukraine ~1:90 and ~1:200; Red Sea ~1:50 to 1:100; Israel-Lebanon) show the
        defender spending one to three orders of magnitude more to defeat an autonomous attacker than the attacker
        spends to launch. The implication is that an air-defence architecture built primarily around exquisite
        interceptors (S-400, Patriot, MR-SAM, Akash) would face acute affordability pressure against sustained
        autonomous mass - and must be rebalanced toward attritable interceptors, directed energy and electronic warfare.
      </p>
      <CostExchangeFigure />

      <h2 id="the-two-front-challenge">The two-front air challenge</h2>
      <p>
        India's air challenge is asymmetric. On the LAC, the PLAAF threat is severe and maturing: the GJ-11 Sharp Sword
        UCAV is assessed operational, the WZ-7 HALE ISR platform is reported deployed to Tibet, the WZ-8 supersonic
        rocket-boosted recon platform is reportedly in service, and a 2027 AI-swarm target is publicly declared.
        Tibetan-plateau geography favours HALE and high-altitude pseudo-satellite operations and constrains India's
        mountain-canyon air-defence coverage. On the LoC, the Pakistan threat is moderate but dense: loitering munitions,
        F-16/JF-17 Block IV fighters, HQ-9P long-range SAMs and developing loyal-wingman concepts. The report argues
        India's current answer - Su-30MKI + BrahMos + S-400 - is calibrated to a manned threat and is structurally
        unaffordable against autonomous mass.
      </p>

      <h2 id="the-cats-warrior">CATS Warrior and the 2030 IOC</h2>
      <p>
        In this report's assessment, the CATS Warrior IOC of 2030 is the single most consequential programme date in the
        IAF's decade. Under the Combat Autonomy Maturity Model&trade; (CAMM), CATS Warrior is targeted at Level 3-4 at
        IOC; a slip to 2032 cascades into force-structure crossover past 2035. Three subsystems determine whether 2030
        holds: the small turbofan engine, electronic warfare and the tactical data link - and no indigenous small
        turbofan exists today for CATS Warrior or Ghatak. Manned-unmanned teaming changes the unit of air combat from the
        platform to the package: a 31-squadron IAF operating in MUM-T configuration delivers the combat mass of a 60+
        squadron legacy force. On cost, the AMCA Mk2 (2035, ~$150M/unit estimated) cannot be the instrument of mass air
        combat; it must command a swarm of attritable CATS Warriors (target ~$10-15M/unit).
      </p>

      <h2 id="the-critical-dependencies">Four critical dependencies</h2>
      <p>
        The Strategic Dependency Matrix&trade; (SDM) scores eight core dependency vectors - semiconductors (advanced node
        &le;28nm), AI compute (H100/H200-class GPUs), jet engines (UCAV/AMCA-class), AESA T/R modules (GaAs/GaN),
        IR detector arrays (MCT/InSb), IMU/INS (FOG/RLG grade), rare-earth magnets (NdFeB) and aerospace-grade titanium -
        plus four supporting dependencies (carbon fibre, MilSatCom, NavIC, cybersecurity). The composite Risk Score
        (0-25) combines criticality, India exposure and substitutability. Four vectors carry the top score of
        <strong>20/25 (Critical)</strong>: <strong>semiconductors, AI compute, jet engines and carbon fibre</strong> -
        none fully mitigable before 2030. A further four sit at 16/25 (High): IR detector arrays, IMU/INS, AESA T/R
        modules and rare-earth magnets. Partial mitigation is the realistic horizon for the decade.
      </p>

      <h2 id="the-opportunity-surfaces">Where to build: 75 opportunity surfaces</h2>
      <p>
        The Industrial Opportunity Surface Matrix&trade; (IOSM) scores 75 industrial opportunities across eight clusters
        (A Propulsion &amp; Power, B Avionics &amp; Mission Systems, C Sensors &amp; EW, D Materials &amp; Structures,
        E AI Software &amp; Edge Compute, F Communications &amp; Networks, G Manufacturing &amp; MRO, H Test /
        Certification / Training) on six dimensions - Strategic Importance (30%), Export Potential (20%), Localization
        Potential (20%), with Capital Intensity, Technology Complexity and SME Opportunity as modifiers. The Top-25 is
        concentrated in <strong>AI Software (10 of 25), Avionics (5) and Sensors/EW (4)</strong>; hardware-heavy
        Propulsion and Materials clusters score high on strategic importance but low on SME opportunity due to capital
        intensity. Recommendation R2 proposes a <strong>$5B / 10-year Autonomous Aerospace Fund</strong>, with public
        capital co-invested alongside private VC, mirroring this cluster distribution. The Excel companion workbook
        carries the live formula-driven IOSM scoring.
      </p>

      <h2 id="the-seven-priorities">The seven strategic priorities</h2>
      <p>
        Forty-eight recommendations consolidate into seven strategic priorities, each developed with five actions (35
        total). The 2026-2027 window is the binding constraint: six Wave-1 critical-path recommendations determine
        whether the 2030 trajectory holds. The priorities include building the platforms (CATS Warrior, Ghatak, Kaveri
        restart), building the sovereign tech stack (AI compute, 28nm, jet engine, GPS-denied navigation), reforming
        test and certification, standing up a UCAV operator career stream, opening DRDO test ranges to startups, and
        anchoring the IOSM opportunity surfaces with the Autonomous Aerospace Fund.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full 142-page edition carries twelve chapters plus the methodology chapter and six appendices: the shift
        from manned air dominance to autonomous air power (NGAD/F-47, GCAP, FCAS); future air warfare and the
        cost-exchange revolution; the IAF's autonomous force structure and the two-front challenge; autonomous combat
        aviation (UCAV, loyal wingman, swarms); persistent intelligence (HALE/MALE/HAPS); the AI-enabled sensor-to-shooter
        cycle; the technology stack; the ADIE industrial ecosystem map; global benchmarking; the SDM dependencies; the
        75 IOSM opportunity surfaces with full scoring; and per-stakeholder recommendations. Roughly 25 figures, six
        appendices (including strategic-priority deep dives and an implementation playbook), six proprietary frameworks
        and a companion data workbook.
      </p>
    </>
  );
}
