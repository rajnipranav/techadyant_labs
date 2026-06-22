import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "India's Unmanned Warfare Transformation".
 * Carries the thesis, the demand case, the market model, the value-below-the-platform
 * argument, the three frameworks, the competitive picture and the scenarios. The full
 * 18-chapter, 31-figure, 53-table edition — plus a 25-slide investor briefing deck —
 * is the paid product; PremiumBody renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The platform is the line item' },
  { id: 'why-now', label: 'Why demand is de-risked' },
  { id: 'the-market', label: 'The market, decomposed' },
  { id: 'where-value', label: 'Where value actually sits' },
  { id: 'subsystem-prize', label: 'The subsystem prize' },
  { id: 'who-builds', label: 'Who builds India’s drones' },
  { id: 'frameworks', label: 'The three frameworks' },
  { id: 'scenarios', label: 'Three futures, and the risks' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';
const GREEN = '#0F8E78';

/* Figure 1 - the market decomposed (TAM / SAM / SOM) */
function MarketFigure() {
  const rows = [
    { n: 'TAM — total addressable', v: 145000, c: '#9AA7B4', label: 'INR 1,45,000 cr' },
    { n: 'SAM — policy-addressable', v: 113100, c: BRASS, label: 'INR 1,13,100 cr' },
    { n: 'SOM — realistically captured', v: 84100, c: TEAL, label: 'INR 84,100 cr' },
  ];
  const max = 145000;
  return (
    <figure className="report-figure" id="fig-market">
      <div className="fig-frame">
        <svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India unmanned-systems market: TAM INR 1.45 lakh crore, SAM INR 1.13 lakh crore, SOM INR 84,100 crore, 2026 to 2035">
          {rows.map((r, i) => {
            const y = 30 + i * 60;
            const w = (r.v / max) * 470;
            return (
              <g key={r.n}>
                <text x={18} y={y + 16} fontSize={13} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={250} y={y} width={Math.max(w, 8)} height={32} rx={4} fill={r.c} />
                <text x={250 + Math.max(w, 8) + 10} y={y + 22} fontSize={12} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.label}</text>
              </g>
            );
          })}
          <text x={250} y={212} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Mid case &middot; 2026–2035 &middot; Techadyant Labs model</text>
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The market Indian industry can win, and realistically capture. The gap between addressable and captured is imported-subsystem leakage. Modelled.</figcaption>
    </figure>
  );
}

/* Figure 2 - the Autonomous Warfare Stack (value rises up) */
function StackFigure() {
  const layers = [
    { n: 'Effect — warheads, seekers, terminal effects', c: CRIMSON, v: 'High' },
    { n: 'Decide — autonomy, AI, swarm, target ID', c: NAVY, v: 'Highest' },
    { n: 'Connect — datalinks, SDR, anti-jam', c: BRASS, v: 'High' },
    { n: 'Sense — EO/IR, SAR, RF sensing', c: TEAL, v: 'High' },
    { n: 'Platform — airframe, propulsion, power', c: '#3a4a63', v: 'Low' },
  ];
  return (
    <figure className="report-figure" id="fig-stack">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Autonomous Warfare Stack: value rises from the platform layer to the decision and effect layers">
          {layers.map((l, i) => {
            const y = 20 + i * 52;
            return (
              <g key={l.n}>
                <rect x={120} y={y} width={520} height={44} rx={4} fill={l.c} />
                <text x={138} y={y + 28} fontSize={13.5} fontWeight={600} fill="#FFFFFF">{l.n}</text>
                <text x={632} y={y + 28} fontSize={11.5} fontWeight={700} fill="#FFFFFF" textAnchor="end">{l.v}</text>
              </g>
            );
          })}
          <text x={60} y={150} fontSize={12} fontWeight={700} fill={BRASS} transform="rotate(-90 60 150)" textAnchor="middle">value rises &uarr;</text>
        </svg>
      </div>
      <figcaption>Figure 2 &mdash; The Autonomous Warfare Stack. India is sovereign where value is lowest (the platform) and dependent where it is highest (sense, decide, effect).</figcaption>
    </figure>
  );
}

/* Figure 3 - margin lives up the stack */
function MarginFigure() {
  const rows = [
    { n: 'Autonomy & software', lo: 50, hi: 70, c: GREEN },
    { n: 'Sensing & payloads', lo: 45, hi: 60, c: TEAL },
    { n: 'Communications & RF', lo: 35, hi: 50, c: BRASS },
    { n: 'Propulsion & power', lo: 30, hi: 40, c: '#5B6B7B' },
    { n: 'Airframe integration', lo: 8, hi: 12, c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-margin">
      <div className="fig-frame">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gross margin by layer: airframe integration 8 to 12 percent, subsystem layers 30 to 70 percent">
          {rows.map((r, i) => {
            const y = 26 + i * 48;
            const x0 = 230, scale = 4.6;
            return (
              <g key={r.n}>
                <text x={18} y={y + 20} fontSize={13} fontWeight={600} fill="#E8E8F0">{r.n}</text>
                <rect x={x0 + r.lo * scale} y={y + 4} width={(r.hi - r.lo) * scale} height={26} rx={4} fill={r.c} />
                <text x={x0 + r.hi * scale + 10} y={y + 23} fontSize={12} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r.lo}–{r.hi}%</text>
              </g>
            );
          })}
          <text x={230} y={266} fontSize={11} fill="#8A8AA0" fontFamily="monospace">Gross-margin band, modelled</text>
        </svg>
      </div>
      <figcaption>Figure 3 &mdash; Margin lives up the stack. Integration earns 8–12%; the subsystem layers earn 30–70% behind capital, IP and certification moats.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="report-lede">
        India&apos;s Army is not buying drones. It is rebuilding the architecture of land warfare around unmanned,
        autonomous and attritable systems &mdash; and in doing so is issuing the single largest strategic demand signal
        Indian defence industry has received in a generation. This report reconstructs that roadmap and, more importantly,
        prices the industrial opportunity beneath it.
      </p>

      <h2 id="the-thesis">The platform is the line item; the subsystem is the annuity</h2>
      <p>
        Reconstructed from doctrine, procurement behaviour, the lessons of Ukraine and the live evidence of Operation
        Sindoor, the roadmap implies roughly thirty capability categories, eighty operational variants, and a procurement
        pool of INR 1.0&ndash;1.9 lakh crore through 2035, against a broader economic footprint of INR 2&ndash;3 lakh
        crore. Its central finding is uncomfortable for an industry organised around airframes: the money, the margin and
        the sovereignty are not in the platform the Army buys, but in the subsystems it buys again with every unit.
      </p>
      <p>
        A loitering munition is procured once and consumed once. But the seeker that aims it, the flight-control silicon
        that steers it, the radio that survives jamming and the magnets in its motor are bought again &mdash; across every
        variant, refresh and export order for a decade. Capturing ten per cent of the airframe market and fifty per cent of
        the subsystem market is worth far more, and lasts far longer, than the reverse.
      </p>

      <h2 id="why-now">Why is demand for India&apos;s drone industry de-risked?</h2>
      <p>
        Two forces settled the demand side. Ukraine proved drones are decisive rather than supporting, and compressed the
        cost of a precision engagement by close to two orders of magnitude. Operation Sindoor then converted that lesson
        into Indian orders in weeks, not years &mdash; emergency procurement powers, with drones and loitering munitions
        absorbing the bulk of field-formation spend. Demand is no longer a forecast; it is already happening. What remains
        uncertain is capture &mdash; whether Indian industry can localise the value-dense layers before the early reference
        designs lock imported subsystems into a decade of refresh buys.
      </p>

      <h2 id="the-market">The market, decomposed</h2>
      <p>
        Total addressable demand through 2035 is about INR 1,45,000 crore at the mid case. Of that, roughly 78 per cent is
        policy-addressable by Indian industry, and about INR 84,100 crore is realistically capturable. The largest segment
        &mdash; strike and loitering munitions &mdash; carries the widest gap between addressable and captured, because
        India can build the airframe but not yet the seeker and autonomy that make a munition lethal. Spend is front-loaded:
        roughly 40 per cent falls in 2026&ndash;28, so the firms that win the first wave set the reference designs the rest
        of the decade refreshes against.
      </p>
      <MarketFigure />

      <h2 id="where-value">Where does the value actually sit?</h2>
      <p>
        Read an unmanned system not as an aircraft but as a five-layer stack &mdash; platform, sense, connect, decide,
        effect &mdash; and the pattern is clear: value rises as you ascend it. The airframe at the base is the most visible
        and least valuable layer; the decision and effect layers at the top capture the margin, hold the intellectual
        property and decide combat outcomes. India is comparatively sovereign exactly where value is lowest, and most
        dependent exactly where it is highest.
      </p>
      <StackFigure />

      <h2 id="subsystem-prize">Where is the money actually made?</h2>
      <p>
        Integration earns eight to twelve per cent. The five subsystem layers &mdash; sensing, propulsion, autonomy
        software, communications and compute &mdash; earn thirty to seventy per cent behind capital, intellectual-property
        and certification moats. As India localises, roughly INR 40,000 crore of value moves below the platform,
        concentrated in compute and sensors, the layers that are both import-heavy and value-dense. The highest-return
        entries are not where dependency is most acute, but where India&apos;s existing design depth meets a protected
        demand signal: autonomy software and sensing are the clearest build-now calls.
      </p>
      <MarginFigure />

      <h2 id="who-builds">Who builds India&apos;s drones?</h2>
      <p>
        India has a real, order-winning integrator industry &mdash; ideaForge, NewSpace Research, Raphe mPhibr, Dhaksha,
        and Solar Industries&apos; Nagastra loitering munition. But it sits on a component base that is 45&ndash;55 per cent
        imported, and the imported half is the militarily decisive half. Rare-earth magnets are near-100 per cent imported
        and under Chinese export control; flight-control silicon is about 90 per cent Chinese-origin. India&apos;s deepest
        indigenous strengths outside airframes are in sensing (Tonbo Imaging) and counter-UAS and RF (Grene Robotics,
        Bharat Electronics, Astra Microwave, Data Patterns) &mdash; the logical anchors for component sovereignty. The Army
        can field Indian-badged platforms today, but not yet an Indian-sourced kill chain.
      </p>

      <h2 id="frameworks">The three frameworks</h2>
      <p>
        Three proprietary frameworks carry the full analysis. The <strong>Autonomous Warfare Stack</strong> locates where
        value and sovereignty sit. The <strong>Attritable Warfare Index</strong> predicts which categories migrate to mass
        production &mdash; the cheap, autonomous, expendable ones, where the unit volume and recurring component demand
        concentrate. The <strong>Drone Industrial Sovereignty Matrix</strong> maps the critical-gap quadrant &mdash;
        flight-control silicon, cooled-infrared seekers, rare-earth magnets, gallium-nitride RF &mdash; the explicit target
        list for capital and policy. Used together: build up the stack, into the attritable volume, across the critical
        gaps.
      </p>

      <h2 id="scenarios">Three futures, and what could derail them</h2>
      <p>
        Which band India lands in by 2035 is decided by capture, not demand. The uncomfortable point: the highest-spend
        scenario &mdash; a border crisis &mdash; is the lowest-sovereignty one early, because emergency procurement buys
        whatever flies. Build the component base in peacetime, or buy it foreign in wartime. The binding risks are
        supply-side: semiconductor dependency, battery cells, magnets and execution sit at the top of the register. The
        roadmap will not fail for lack of a buyer; it will fail, if it fails, because the parts could not be made in time.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This reading version is the argument. The full edition is the decision-grade analysis behind it &mdash; eighteen
        chapters, thirty-one figures and fifty-three tables, with a twenty-five-slide investor briefing deck included with
        purchase. It carries the complete market model (TAM/SAM/SOM by segment, an annual procurement-wave model and an
        indigenous-content model); the subsystem opportunity priced layer by layer with build-now and position-early
        verdicts; the competitive landscape and capability-gap map; the strategic implications for industry with distinct
        playbooks for startups, MSMEs, large firms and venture investors; three quantified scenarios; and a full risk
        register with a likelihood-impact heat map.
      </p>
    </>
  );
}
