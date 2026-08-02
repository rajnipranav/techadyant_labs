import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The Indian Navy's Autonomous Maritime Transformation 2026-2035".
 * Carries the thesis (platforms are downstream of ecosystems), the three binding constraints,
 * the fleet posture, the market sizing, the 58 opportunity surfaces, the eight frameworks and
 * the four scenarios. The full ~153-page edition (12 chapters, ~35 figures, appendices A-R) is
 * the paid PDF.
 *
 * Registered in app/reports/[slug]/page.tsx as { navyToc as toc, NavyContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'Platforms are downstream of ecosystems' },
  { id: 'the-constraints', label: 'The three binding constraints' },
  { id: 'the-fleet', label: 'What India can field by 2035' },
  { id: 'the-market', label: 'The market beneath the fleet' },
  { id: 'the-opportunities', label: 'Where to build: 58 opportunity surfaces' },
  { id: 'the-frameworks', label: 'The eight frameworks' },
  { id: 'the-scenarios', label: 'Four scenarios to 2035' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const STEEL = '#2E6497';
const TEAL = '#2BC5B4';
const BRASS = '#C9A84C';
const SLATE = '#8C9AAE';
const CRIMSON = '#C8443B';

/* Figure 1 - the strategic posture map (0-5), India 2026 vs US benchmark vs 2035 target */
function PostureFigure() {
  const rows = [
    { n: 'Autonomy software', a: 2.4, t: 4.2, u: 4.6 },
    { n: 'Manned-unmanned teaming', a: 2.0, t: 4.0, u: 4.2 },
    { n: 'Test & certification', a: 2.2, t: 4.0, u: 4.4 },
    { n: 'Sensor stack', a: 2.8, t: 4.2, u: 4.5 },
    { n: 'Platform indigenisation', a: 3.8, t: 4.5, u: 4.6 },
  ];
  const W = 470;
  const x = (v: number) => Math.round((v / 5) * W);
  return (
    <figure className="report-figure" id="fig-posture">
      <div className="fig-frame">
        <svg viewBox="0 0 720 250" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Strategic posture map: India 2026 vs US benchmark vs 2035 target, 0-5 scale">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Strategic posture (0–5): India 2026 vs 2035 target vs US benchmark</text>
          {rows.map((r, i) => {
            const y = 44 + i * 38;
            return (
              <g key={r.n}>
                <text x="16" y={y + 13} fill="#0B1D33" fontSize="12" fontWeight="600">{r.n}</text>
                <rect x="210" y={y} width={x(r.a)} height="16" rx="3" fill={STEEL} />
                <line x1={210 + x(r.t)} y1={y - 3} x2={210 + x(r.t)} y2={y + 19} stroke={BRASS} strokeWidth="2.5" />
                <line x1={210 + x(r.u)} y1={y - 3} x2={210 + x(r.u)} y2={y + 19} stroke={SLATE} strokeWidth="2" strokeDasharray="3 2" />
                <text x={210 + x(r.a) + 6} y={y + 13} fill={STEEL} fontSize="11" fontWeight="700">{r.a.toFixed(1)}</text>
              </g>
            );
          })}
          <g fontSize="11">
            <rect x="210" y="238" width="14" height="8" fill={STEEL} /><text x="230" y="246" fill={SLATE}>India 2026</text>
            <line x1="320" y1="242" x2="320" y2="242" /><rect x="316" y="238" width="3" height="8" fill={BRASS} /><text x="326" y="246" fill={SLATE}>2035 target</text>
            <rect x="430" y="238" width="3" height="8" fill={SLATE} /><text x="440" y="246" fill={SLATE}>US benchmark</text>
          </g>
          <text x="628" y="22" fill={SLATE} fontSize="10.5" textAnchor="end">Techadyant Strategic Posture Map</text>
        </svg>
      </div>
      <figcaption>India's autonomous-naval readiness trails the US benchmark by ~1.9 points; software, MUM-T and certification are the binding dimensions.</figcaption>
    </figure>
  );
}

/* Figure 2 - four scenarios to 2035 (fleet + probability) */
function ScenarioFigure() {
  const rows = [
    { n: 'Autonomous Power (recommended)', p: 30, fleet: '80+ USV · 25+ UUV · 180+ UAV', c: TEAL },
    { n: 'Indigenous but Inefficient (default)', p: 35, fleet: '50 USV · 12 UUV · 110 UAV', c: BRASS },
    { n: 'Incremental Importer', p: 20, fleet: '15 USV · 4 UUV · 50 UAV', c: SLATE },
    { n: 'Drift and Dependency', p: 15, fleet: '30 USV · 8 UUV · 80 UAV', c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-scenarios">
      <div className="fig-frame">
        <svg viewBox="0 0 720 235" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Four scenarios for India's 2035 autonomous naval posture">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Four scenarios for India's 2035 autonomous fleet</text>
          {rows.map((r, i) => {
            const y = 42 + i * 46;
            const w = Math.round((r.p / 35) * 150);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="12.5" fontWeight="600">{r.n}</text>
                <rect x="470" y={y + 2} width={w} height="16" rx="3" fill={r.c} />
                <text x={470 + w + 6} y={y + 15} fill="#0B1D33" fontSize="12" fontWeight="700">{r.p}%</text>
                <text x="16" y={y + 32} fill={SLATE} fontSize="11">{r.fleet}</text>
              </g>
            );
          })}
          <text x="628" y="22" fill={SLATE} fontSize="10.5" textAnchor="end">probability (Techadyant assessment)</text>
        </svg>
      </div>
      <figcaption>The default trajectory is Indigenous but Inefficient (35%); the recommended path is Autonomous Power (30%). Probabilities sum to 100%.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">Platforms are downstream of ecosystems</h2>
      <p>
        The decade to 2035 is the most consequential for Indian naval power in a generation, driven by three converging
        forces: the maturation of autonomous technologies to operational reliability, the acceleration of PLAN capability in
        the Indian Ocean Region, and the shift of the defence industrial base toward the Indo-Pacific. This report is not a
        programme audit. Its central argument is that <em>platforms are downstream of ecosystems</em>: the Navy can acquire
        XLUUVs, swarming USVs and carrier-launched UAVs only if a substrate of autonomy software, marine sensors,
        semiconductor access, certified test ranges and skilled workforce exists beneath them. That substrate is currently
        underdeveloped — and the rate at which India builds it, not the next platform decision, is the strategic task of the
        decade.
      </p>

      <h2 id="the-constraints">The three binding constraints</h2>
      <p>
        India's autonomous transformation is technically feasible and strategically necessary; its pace is set by three
        binding substrate constraints. First, <strong>semiconductor access</strong> — marine-grade FPGAs, RF integrated
        circuits and AI-edge NPUs that India does not yet fabricate. Second, <strong>test-and-certification throughput</strong>
        — the DGQA and CemILAC frameworks are organised around platform-by-platform certification and lack the
        continuous-update cadence autonomous software requires. Third, <strong>skilled workforce</strong> — a projected deficit
        of 12,000–18,000 engineers and technicians in naval-autonomy disciplines by 2030 under business-as-usual. These three
        interact: software cannot mature without test infrastructure, teaming cannot deploy without software, and certification
        cannot keep pace without reform.
      </p>
      <PostureFigure />

      <h2 id="the-fleet">What India can field by 2035</h2>
      <p>
        If those constraints are addressed with focus, the Navy can field a credible force posture under the recommended
        &lsquo;Autonomous Power&rsquo; scenario: 80+ unmanned surface vessels, 25+ unmanned underwater vehicles including 4–6
        extra-large UUVs, and 180+ naval UAVs including carrier UAVs and swarm squadrons. If they are not, the default
        trajectory &mdash; &lsquo;Indigenous but Inefficient&rsquo; &mdash; delivers strong indigenisation intent but slow
        scale-up, cost overruns and limited export traction. The fleet the Navy gets is a function of the substrate the country
        builds.
      </p>

      <h2 id="the-market">The market beneath the fleet</h2>
      <p>
        The industrial prize is large. In the recommended scenario Indian industry captures ₹15,000+ crore in annual
        autonomous-naval revenue by 2035 (₹5,000+ crore of it export), building to a cumulative 2026–2035 market of
        approximately ₹1.2 lakh crore. But the value does not sit where attention does: the most defensible positions are in
        the enabling layers &mdash; autonomy middleware, marine sensors, energy systems, trusted semiconductors and
        certification &mdash; not in hull fabrication. The report separates annual revenue, cumulative market and addressable
        potential explicitly, so the three are never conflated.
      </p>

      <h2 id="the-opportunities">Where to build: 58 opportunity surfaces</h2>
      <p>
        The Maritime Opportunity Surface Matrix&trade; ranks 58 industrial opportunity surfaces, of which nine are
        &lsquo;Strategic Anchors&rsquo; &mdash; opportunities whose strategic importance and localisation potential both score
        above 8.0. They include quantum inertial navigation, XLUUV hull and energy systems, naval autonomy middleware, sonar
        transducers and arrays, air-independent-propulsion fuel cells, marine lithium-ion cells and navigation-grade IMUs. The
        top-30 surfaces alone represent about ₹48,000 crore of 2035 addressable market potential. Each surface is scored for
        strategic value, localisation potential and time-to-revenue, so a builder can see which are open now and which need
        the substrate to mature first.
      </p>

      <h2 id="the-frameworks">The eight frameworks</h2>
      <p>
        The analysis runs on eight reproducible instruments. The <strong>Autonomous Maritime Stack&trade;</strong> decomposes
        the capability into seven layers from sensor to mission. The <strong>Naval Industrial Readiness Index&trade;</strong>
        scores the ecosystem; the <strong>Naval Technology Dependency Matrix&trade;</strong> grades eight critical dependencies
        by concentration, impact and mitigation horizon; the <strong>Maritime Opportunity Surface Matrix&trade;</strong> ranks
        the 58 surfaces; and the <strong>Strategic Posture Map</strong>, <strong>Industrial Multiplier Framework&trade;</strong>
        and additional proprietary indices (Naval Sovereignty Index, Maritime AI Readiness Score, Strategic Dependency Index)
        complete the toolkit. Each is defined once and applied consistently across the twelve chapters.
      </p>
      <ScenarioFigure />

      <h2 id="the-scenarios">Four scenarios to 2035</h2>
      <p>
        The forecast runs across four scenarios on a two-axis matrix (indigenisation trajectory × scale-up aggressiveness),
        with probabilities that sum to 100%: Autonomous Power (30%, recommended), Indigenous but Inefficient (35%, the default
        without intervention), Incremental Importer (20%) and Drift and Dependency (15%). The decision points that move India
        from the default to the recommended path &mdash; DGQA certification reform, semiconductor acceleration, and an iDEX
        budget shift from breadth to depth &mdash; all sit in the 2026–2028 window.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~153-page edition carries all twelve chapters: future maritime warfare and the IOR threat surface; the Navy's
        unmanned roadmap and theatre-command architecture; deep dives on USVs, UUVs, XLUUVs and mine-countermeasures; the naval
        UAV ecosystem; AI-enabled fleet operations and manned-unmanned teaming; the Autonomous Maritime Stack; the
        DRDO/DPSU/private/startup industrial ecosystem; benchmarking against six comparator navies (US, UK, PLAN, Israel, Japan,
        Australia); the eight critical dependencies; the 58 opportunity surfaces; and a year-by-year 2026–2035 roadmap with
        per-stakeholder recommendations. Roughly 35 figures, extensive appendices (strategic-anchor deep-dive cards, entity and
        programme profiles, ten international case studies, a state-level cluster map and an implementation playbook) and a
        companion data workbook.
      </p>
    </>
  );
}
