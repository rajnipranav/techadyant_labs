import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The Opportunity Beyond the Fab".
 * Carries the thesis, the Stack, the five frameworks and the top ten of 100 scored
 * opportunities. The full 167-page edition (eleven parts, 43 figures, 100 one-page
 * scorecards, 10 state dashboards) is the paid PDF/docx; PremiumBody renders the
 * paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'Around the fab, not instead of it' },
  { id: 'the-stack', label: 'The ten-layer sovereignty stack' },
  { id: 'five-frameworks', label: 'How the 100 are scored' },
  { id: 'top-ten', label: 'The top ten opportunities' },
  { id: 'four-findings', label: 'Four findings' },
  { id: 'where-to-build', label: 'Where to build' },
  { id: 'playbooks', label: 'The investor and founder playbooks' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const NAVY = '#0F1828';
const BRASS = '#C9A84C';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

/* Figure - the India Technology Sovereignty Stack (condensed) */
function StackFigure() {
  const layers = [
    { n: 'L10 Research & IP', pos: 'Emerging', c: BRASS },
    { n: 'L9 Skills & talent', pos: 'Emerging', c: BRASS },
    { n: 'L8 Services & integration', pos: 'Strong', c: TEAL },
    { n: 'L7 Cybersecurity', pos: 'Emerging', c: BRASS },
    { n: 'L6 Artificial intelligence', pos: 'Emerging', c: BRASS },
    { n: 'L5 Enterprise software', pos: 'Emerging', c: BRASS },
    { n: 'L4 Engineering software', pos: 'Emerging', c: BRASS },
    { n: 'L3 Industrial equipment', pos: 'Missing', c: CRIMSON },
    { n: 'L2 Manufacturing (fab/OSAT)', pos: 'Emerging', c: BRASS },
    { n: 'L1 Materials & chemicals', pos: 'Missing', c: CRIMSON },
  ];
  return (
    <figure className="report-figure" id="fig-stack">
      <div className="fig-frame">
        <svg viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The India Technology Sovereignty Stack, ten layers from materials to research">
          {layers.map((l, i) => {
            const y = 14 + i * 44;
            return (
              <g key={l.n}>
                <rect x={18} y={y} width={620} height={34} rx={6} fill="#161629" />
                <rect x={18} y={y} width={10} height={34} rx={3} fill={l.c} />
                <text x={42} y={y + 22} fontSize={14} fontWeight={600} fill="#E8E8F0">{l.n}</text>
                <text x={632} y={y + 22} fontSize={12} fontWeight={700} fill={l.c} textAnchor="end" fontFamily="monospace">{l.pos.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption>Figure 1 &mdash; The India Technology Sovereignty Stack. Green = strong, amber = emerging, red = missing.</figcaption>
    </figure>
  );
}

const TOP10 = [
  ['1', 'Engineering R&D (ER&D) services export', 'VII', '70.4', 'Strategic Quick Win'],
  ['2', 'Chip-design services export (VLSI/embedded)', 'VII', '70.0', 'Strategic Quick Win'],
  ['3', 'Precision machining: vacuum chambers & UHV components', 'II', '69.0', 'National Bet'],
  ['4', 'RISC-V IP cores and design services', 'V', '68.4', 'National Bet'],
  ['5', 'Cross-border IP licensing / fabless export', 'VII', '68.3', 'National Bet'],
  ['6', 'OT/ICS security platform', 'VI', '68.1', 'National Bet'],
  ['7', 'AI/ML services export', 'VII', '67.7', 'Cash Engine'],
  ['8', 'AI visual quality inspection', 'IV', '67.6', 'Strategic Quick Win'],
  ['9', 'Industrial ERP for MSMEs', 'III', '67.5', 'Strategic Quick Win'],
  ['10', 'AI for semiconductor design (EDA-AI)', 'IV', '67.5', 'National Bet'],
];

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">Around the fab, not instead of it</h2>
      <p>
        India has committed roughly &#8377;1.6 lakh crore to semiconductor manufacturing &mdash; thirteen projects across
        seven states, with the first facilities now operational. The national conversation treats this as the story. It is
        not. It is the opening of a much larger one. This is not an argument against the fab: the fab is the anchor that
        creates the surrounding demand, and many of the opportunities mapped here exist precisely because the fab
        investment is happening. The argument is about where the value is <em>captured</em> &mdash; around the fab, not
        instead of it.
      </p>
      <p>
        A fab is the visible peak of a ten-layer industrial pyramid. The layers around it &mdash; the materials and
        precision components beneath, the design tools and software beside, the applied AI, security and services above
        &mdash; are where most of the capturable economic value sits, where the capital requirements are a fraction of a
        fab&apos;s, and where India&apos;s existing industrial and talent base can actually compete. This report identifies,
        scores and ranks <strong>one hundred startup and MSME opportunities</strong> created by India&apos;s
        technology-sovereignty push.
      </p>

      <h2 id="the-stack">The ten-layer sovereignty stack</h2>
      <p>
        The organising structure is the India Technology Sovereignty Stack. India is <strong>strong</strong> at the
        downstream end &mdash; electronics manufacturing, where ninety-nine per cent of phones sold are now locally made,
        and design services, where India performs roughly a fifth of the world&apos;s chip-design work. It is
        <strong> emerging</strong> across the middle, and <strong>missing</strong> at the upstream end &mdash; materials,
        chemicals and capital equipment, where roughly ninety to ninety-five per cent of demand is imported (NITI Aayog,
        2026). Each position implies a different kind of opportunity: convert capability to ownership where India is
        strong; climb from participation to value capture where it is emerging; build behind a sovereignty mandate where
        it is missing.
      </p>
      <StackFigure />

      <h2 id="five-frameworks">How the 100 are scored</h2>
      <p>
        Every opportunity is scored on a single, reproducible system of five proprietary indices. Three diagnostics
        &mdash; the Technology Sovereignty Value Index (how strategic), the India Readiness Rating (can India compete
        today), and the Go-to-Market Ease Matrix (how hard to commercialise) &mdash; feed one headline Technology
        Opportunity &amp; Market Index (TOMI). A portfolio engine, the Strategic Opportunity Engine, then sorts the
        hundred into four classes: 21 Strategic Quick Wins, 58 National Bets, 15 Cash Engines, and 6 to watch.
      </p>

      <h2 id="top-ten">The top ten opportunities</h2>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr><th>#</th><th>Opportunity</th><th>Part</th><th>TOMI</th><th>Class</th></tr>
          </thead>
          <tbody>
            {TOP10.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><strong>{r[3]}</strong></td><td>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="four-findings">Four findings</h2>
      <p>
        <strong>First, the strongest opportunities are not the glamorous ones.</strong> The two highest scorers are
        engineering-R&amp;D and chip-design services export &mdash; capabilities India already has at world scale, needing
        only the shift from being someone else&apos;s back office to owning the relationship and the IP.
        <strong> Second, no opportunity is risk-free.</strong> The highest TOMI is 70, firmly Tier-2, not Tier-1. This is
        deliberate; the report does not inflate scores. <strong>Third, the market will under-fund what the country most
        needs</strong> &mdash; the 58 National Bets (OSAT, advanced packaging, compound semiconductors, sovereign EDA) are
        strategically vital but capital-heavy, which is the gap for patient and strategic capital. <strong>Fourth, the
        binding constraint is qualification, not capital or skill</strong> &mdash; funding state-backed metrology and
        certification infrastructure is the cheapest lever with the largest effect.
      </p>

      <h2 id="where-to-build">Where to build</h2>
      <p>
        The opportunity map and the geographic map must be read together. The report scores ten states across seven
        dimensions and renders each as a one-page dashboard. A design-IP, EDA or AI venture belongs in Karnataka or
        Telangana, where the talent and capital are; a precision-component or OSAT-adjacent manufacturer belongs in
        Gujarat or Tamil Nadu, near the fabs and the ports; an electronics-manufacturing or export play belongs in Tamil
        Nadu or Uttar Pradesh. The right opportunity in the wrong state is a worse bet than a modest opportunity in a
        state built to support it.
      </p>

      <h2 id="playbooks">The investor and founder playbooks</h2>
      <p>
        The hundred opportunities are a portfolio with a structure. The Strategic Opportunity Engine maps each onto two
        axes &mdash; strategic pull and executability &mdash; and the resulting classes are the investor&apos;s map: angels
        and venture capital in the Strategic Quick Wins and Cash Engines; private equity, strategic and sovereign capital
        in the National Bets. For the founder, the question is not which opportunity scores highest but which matches what
        they already have &mdash; domain expertise, capital, or an existing precision-engineering base to pivot.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the thesis, the framework and the top ten. The complete 167-page edition gives you
        all 100 opportunities as one-page scorecards, the eleven parts mapping the opportunity layer by layer, the ten
        state dashboards, the Investment and Startup Playbooks in full, the five proprietary frameworks with their scoring
        rubrics, the 2035 outlook, and the signature India Technology Sovereignty Opportunity Map. Forty-three figures, one
        hundred scorecards, two data tables.
      </p>
    </>
  );
}
