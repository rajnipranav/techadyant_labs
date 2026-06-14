import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Drone Propulsion Opportunity".
 * Carries the thesis, the market numbers, the dependency map, the margin map and
 * the ten-year outlook. The full ~196-page edition (fifteen chapters across six
 * parts, native data charts, a 50+ supplier directory and an editable Excel data
 * pack) is the paid report; PremiumBody renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'Assembly, not manufacturing' },
  { id: 'the-market', label: 'A $95M market becoming $350M' },
  { id: 'the-dependency', label: 'Where India is still exposed' },
  { id: 'the-stack', label: 'Motors, ESCs, propellers, jet' },
  { id: 'the-margin', label: 'Where the margin is' },
  { id: 'defence', label: 'Why defence is the demand engine' },
  { id: 'policy', label: 'The policy tailwinds' },
  { id: 'outlook', label: 'The ten-year outlook' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';
const SLATE = '#5B7DB1';
const LABEL = '#E8E8F0';
const MUTED = '#8A8AA0';

/* Figure 1 — propulsion TAM by segment, 2030 */
function TamFigure() {
  const seg = [
    { n: 'Motors', v: 140, p: '40%', c: NAVY },
    { n: 'Hybrid / Jet', v: 87, p: '25%', c: CRIMSON },
    { n: 'ESCs', v: 70, p: '20%', c: BRASS },
    { n: 'Propellers', v: 53, p: '15%', c: TEAL },
  ];
  const max = 140;
  return (
    <figure className="report-figure" id="fig-tam">
      <div className="fig-frame">
        <svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India drone propulsion TAM by segment in 2030: motors 140 million dollars, hybrid and jet 87 million, ESCs 70 million, propellers 53 million">
          {seg.map((r, i) => {
            const y = 26 + i * 56;
            const w = (r.v / max) * 470;
            return (
              <g key={r.n}>
                <text x={18} y={y + 17} fontSize={14} fontWeight={600} fill={LABEL}>{r.n}</text>
                <rect x={210} y={y} width={Math.max(w, 8)} height={30} rx={4} fill={r.c} />
                <text x={210 + Math.max(w, 8) + 10} y={y + 21} fontSize={13} fontWeight={700} fill={LABEL} fontFamily="monospace">{'US$' + r.v + 'M · ' + r.p}</text>
              </g>
            );
          })}
          <text x={210} y={252} fontSize={11} fill={MUTED} fontFamily="monospace">Total propulsion TAM 2030 ≈ US$350M · proprietary modelling</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; Where the 2030 propulsion market sits. Motors and the emerging hybrid/jet segment dominate; ESCs hold the highest margins.</figcaption>
    </figure>
  );
}

/* Figure 2 — component import trend, 2019-2025 */
function ImportFigure() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const series = [
    { n: 'Motors', c: NAVY, v: [85, 78, 70, 55, 42, 35, 30] },
    { n: 'Magnets', c: CRIMSON, v: [38, 35, 40, 42, 45, 48, 50] },
    { n: 'ESCs', c: BRASS, v: [42, 40, 38, 32, 25, 20, 15] },
    { n: 'Propellers', c: TEAL, v: [22, 20, 18, 16, 15, 14, 13] },
  ];
  const W = 760, H = 280, x0 = 50, x1 = 560, y0 = 30, y1 = 230, max = 90;
  const X = (i: number) => x0 + (i / (years.length - 1)) * (x1 - x0);
  const Y = (v: number) => y1 - (v / max) * (y1 - y0);
  return (
    <figure className="report-figure" id="fig-imports">
      <div className="fig-frame">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India drone component imports 2019 to 2025: motor and ESC imports fall while magnet imports rise">
          {[0, 30, 60, 90].map((g) => (
            <g key={g}>
              <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="#283042" strokeWidth={1} />
              <text x={x0 - 8} y={Y(g) + 4} fontSize={11} fill={MUTED} textAnchor="end" fontFamily="monospace">{g}</text>
            </g>
          ))}
          {years.map((yr, i) => (
            <text key={yr} x={X(i)} y={y1 + 18} fontSize={11} fill={MUTED} textAnchor="middle" fontFamily="monospace">{yr}</text>
          ))}
          {series.map((s) => (
            <g key={s.n}>
              <polyline fill="none" stroke={s.c} strokeWidth={2.4} points={s.v.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} />
              <text x={x1 + 10} y={Y(s.v[s.v.length - 1]) + 4} fontSize={12} fontWeight={600} fill={s.c}>{s.n}</text>
            </g>
          ))}
          <text x={x0} y={y1 + 40} fontSize={11} fill={MUTED} fontFamily="monospace">USD million · DGCI&S customs data, proprietary apportionment</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; Motor and ESC imports collapsed; magnet imports <em>rose</em>. As assembly localised, the dependency moved upstream into rare-earth magnets and ESC silicon.</figcaption>
    </figure>
  );
}

/* Figure 3 — ten-year TAM projection */
function ForecastFigure() {
  const years = Array.from({ length: 12 }, (_, i) => 2025 + i);
  const opt = [95, 135, 185, 255, 340, 440, 550, 675, 810, 960, 1120, 1300];
  const base = [95, 125, 165, 215, 275, 350, 430, 520, 620, 730, 850, 980];
  const pess = [95, 110, 135, 165, 200, 240, 285, 335, 390, 450, 520, 600];
  const W = 760, H = 300, x0 = 52, x1 = 600, y0 = 24, y1 = 245, max = 1300;
  const X = (i: number) => x0 + (i / (years.length - 1)) * (x1 - x0);
  const Y = (v: number) => y1 - (v / max) * (y1 - y0);
  const line = (a: number[]) => a.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  return (
    <figure className="report-figure" id="fig-forecast">
      <div className="fig-frame">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India drone propulsion TAM projection to 2036 under optimistic, baseline and pessimistic scenarios">
          {[0, 400, 800, 1200].map((g) => (
            <g key={g}>
              <line x1={x0} y1={Y(g)} x2={x1} y2={Y(g)} stroke="#283042" strokeWidth={1} />
              <text x={x0 - 8} y={Y(g) + 4} fontSize={11} fill={MUTED} textAnchor="end" fontFamily="monospace">{g}</text>
            </g>
          ))}
          {years.filter((_, i) => i % 2 === 0).map((yr) => {
            const i = years.indexOf(yr);
            return <text key={yr} x={X(i)} y={y1 + 18} fontSize={11} fill={MUTED} textAnchor="middle" fontFamily="monospace">{yr}</text>;
          })}
          <polyline fill="none" stroke={TEAL} strokeWidth={2.2} points={line(opt)} />
          <polyline fill="none" stroke={BRASS} strokeWidth={2.8} points={line(base)} />
          <polyline fill="none" stroke={CRIMSON} strokeWidth={2.2} points={line(pess)} />
          <text x={x1 + 8} y={Y(opt[11]) + 4} fontSize={12} fontWeight={600} fill={TEAL}>Optimistic</text>
          <text x={x1 + 8} y={Y(base[11]) + 4} fontSize={12} fontWeight={600} fill={BRASS}>Baseline</text>
          <text x={x1 + 8} y={Y(pess[11]) + 4} fontSize={12} fontWeight={600} fill={CRIMSON}>Pessimistic</text>
          <text x={x0} y={y1 + 40} fontSize={11} fill={MUTED} fontFamily="monospace">USD million · 23.6% baseline CAGR to 2036</text>
        </svg>
      </div>
      <figcaption>Figure 3 &mdash; The propulsion TAM compounds at 18&ndash;27% to 2036. What separates the scenarios is execution on magnets, ESC silicon and BVLOS &mdash; not on assembly.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">Assembly, not manufacturing</h2>
      <p>
        India&rsquo;s drone industry is thriving by almost any headline measure &mdash; tens of thousands of registered
        aircraft, a liberalised policy stack, and a wave of defence demand. Yet underneath the growth sits a harder
        question: when an Indian drone takes off, who actually built the part that makes it fly? In 2020, more than 80% of
        drone components &mdash; and propulsion systems in particular &mdash; were imported, primarily from China. By 2025
        that figure had fallen below 40%, one of the most rapid import-substitution efforts in India&rsquo;s
        advanced-manufacturing history. But the progress is uneven, and reading it carefully changes the investment case.
      </p>
      <p>
        Propulsion &mdash; the motors, Electronic Speed Controllers (ESCs), propellers and the emerging jet-turbine
        segment &mdash; is the right lens. Unlike airframes, which are increasingly commoditised, propulsion determines a
        drone&rsquo;s payload, endurance, reliability and ultimately its commercial viability. India has built a drone
        <em> assembly</em> industry; it has not yet built a drone-propulsion <em>manufacturing</em> one. The distinction is
        the whole story.
      </p>

      <h2 id="the-market">A $95 million market becoming a $350 million one</h2>
      <p>
        We project India&rsquo;s drone-propulsion component market growing from roughly US$95 million in 2025 to US$350
        million by 2030 &mdash; a 29.8% CAGR, well ahead of the overall drone market&rsquo;s 24.2%. Propulsion is the
        fastest-growing layer of the drone because it is the primary bottleneck for performance and because import
        substitution is shifting value from low-cost imported parts to higher-value domestic ones. Motors are the largest
        segment, but the highest-margin opportunity sits in ESCs, and the fastest-growing in jet and hybrid propulsion.
      </p>
      <TamFigure />

      <h2 id="the-dependency">Where India is still exposed</h2>
      <p>
        The widely-quoted &ldquo;80% to 40%&rdquo; number is real, but it hides where the vulnerability now sits. Motor and
        ESC assembly have genuinely localised &mdash; motor imports fell from about US$85 million in 2019 to US$30 million
        in 2025. But magnet imports <em>rose</em> over the same period, from roughly US$38 million to US$50 million: as
        domestic motor assembly scaled, it pulled in more imported NdFeB magnets. The dependency did not disappear; it moved
        upstream.
      </p>
      <ImportFigure />
      <p>
        Two layers carry the real risk. Rare-earth permanent magnets are roughly 80% Chinese, and there is no
        commercial-scale domestic NdFeB production before about 2028&ndash;2029 even if the government&rsquo;s
        Rs&nbsp;7,280-crore REPM scheme delivers on schedule. ESC silicon &mdash; the microcontrollers, gate drivers and
        power MOSFETs at the heart of every speed controller &mdash; is effectively 100% imported, predominantly from
        STMicroelectronics, Texas Instruments and Infineon, with no domestic alternative in sight. India assembles the motor
        and the ESC; it does not yet make the magnet inside one or the chip inside the other. A global semiconductor
        shortage or an export restriction would halt domestic drone production within weeks.
      </p>

      <h2 id="the-stack">Motors, ESCs, propellers and the jet frontier</h2>
      <p>
        <strong>Motors.</strong> BLDC outrunners dominate, and domestic assembly is mature for the 40xx&ndash;80xx classes
        used in agriculture, logistics and defence. The gap is in raw materials &mdash; magnets, electrical steel, precision
        bearings &mdash; and in high-RPM efficiency at the top of the range. Reflex Drive (Lucknow) and Vector Technics
        (Hyderabad) lead the heavy-lift segment.
      </p>
      <p>
        <strong>ESCs.</strong> The most sophisticated and most import-exposed component. Field-Oriented-Control ESCs command
        the best margins in the entire propulsion stack but depend entirely on imported silicon. Zepco Technologies and
        Vector Technics lead domestic supply &mdash; on a foundation they do not yet own.
      </p>
      <p>
        <strong>Propellers.</strong> The easiest layer to enter. Plastic injection-moulded props are largely domestic; the
        value is migrating to carbon-fibre folding and variable-pitch propellers for VTOL and hybrid platforms, where S R
        Aerospace, Nautical Wings and Fabheads are scaling.
      </p>
      <p>
        <strong>Jet and hybrid.</strong> The smallest but fastest-growing segment. Micro-turbojets &mdash; exemplified by DG
        Propulsion&rsquo;s J40, which produces 43 kgf of thrust at 110,000 rpm &mdash; and series-hybrid architectures are
        unlocking high-speed and long-endurance missions that batteries alone cannot serve.
      </p>

      <h2 id="the-margin">Where the margin is</h2>
      <p>
        Margin concentrates where technical barriers are highest. Professional FOC ESCs (40&ndash;50% gross margin) and
        heavy-lift motors (35&ndash;45%) hold the best economics; commodity plastic propellers and micro motors the
        thinnest. For anyone deciding where to build, the margin map is the opportunity map: the highest-risk,
        highest-return surface is fabless ESC semiconductor design; the moderate play is motor-assembly scaling for export;
        the lowest-risk is composite propeller manufacturing. And the case is no longer about patriotism &mdash; after
        customs duty, GST, freight and financing, Chinese components now land in India 5&ndash;10% <em>more</em> expensively
        than comparable domestic parts, saving an OEM roughly US$50&ndash;100 per propulsion set.
      </p>

      <h2 id="defence">Why defence is the demand engine</h2>
      <p>
        Agriculture and surveying generate volume; defence generates value. The Indian armed forces are projected to induct
        over 15,650 drone-propulsion units between 2025 and 2030 across tactical UAVs, heavy-lift logistics platforms,
        loitering munitions and swarms. Defence contracts command 30&ndash;50% price premiums over commercial equivalents
        and impose reliability standards that accelerate technological maturation. Only defence demand is sovereign and
        high-value enough to pull the upstream layers &mdash; magnets, trusted silicon &mdash; that India most needs to
        build. Commercial logistics is the swing factor, but its scale unlocks only when Beyond-Visual-Line-of-Sight (BVLOS)
        corridors open.
      </p>

      <h2 id="policy">The policy tailwinds</h2>
      <p>
        Four policy levers are reshaping the cost structure. The Production-Linked Incentive now covers component
        manufacturers, making propulsion makers eligible. The Rs&nbsp;7,280-crore REPM scheme aims to seed domestic
        rare-earth-magnet production &mdash; the upstream localisation motors ultimately depend on. A uniform 5% GST on
        drones and components, effective September 2025, materially improved the landed-cost position of Indian-assembled
        parts. And BVLOS clearance remains the single largest commercial inhibitor: every month of delay costs the
        propulsion industry an estimated US$2&ndash;3 million in foregone orders.
      </p>

      <h2 id="outlook">The ten-year outlook</h2>
      <p>
        Across scenarios, the propulsion TAM compounds at 18&ndash;27% to 2036, reaching somewhere between US$600 million
        and US$1.3 billion. The variable that separates the scenarios is execution on the things India does not yet do
        &mdash; domestic magnets, ESC silicon and BVLOS timing &mdash; not on the assembly it has already mastered. A
        consolidation wave is the near-term certainty: with 15+ small players competing alongside 4&ndash;5 scaled leaders,
        we expect 2&ndash;3 significant acquisitions within 24&ndash;36 months, with Tata Advanced Systems, Adani Defence
        and ideaForge the logical acquirers.
      </p>
      <ForecastFigure />

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This reading version carries the thesis and the headline numbers. The full ~196-page edition develops every thread
        into a decision-grade reference: a 10-year forecast with component-level projections and a technology roadmap; deep
        technical analysis of BLDC motors, FOC ESCs, propeller aerodynamics and emerging jet/hybrid propulsion with
        proprietary benchmark data; the complete supply-chain map and semiconductor-dependency analysis; a competitive
        landscape with company profiles and market share; defence and commercial demand models; unit economics and
        landed-cost models; a full risk matrix; and 45+ figures and tables. It ships with an editable Excel data pack
        containing a 50+ supplier directory and a technical-specifications database.
      </p>
    </>
  );
}
