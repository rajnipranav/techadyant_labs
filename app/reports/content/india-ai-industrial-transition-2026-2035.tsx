import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { TocItem } from '../../components/ReportReader';

/* ───────────────────────────────────────────────────────────────────────────
   India’s AI Industrial Transition and Infrastructure Transformation
   (2026–2035) — Edition 01 · Baseline Architecture
   Free, frictionless, fully SEO-indexable: every paragraph rendered as static
   HTML; every figure’s inline SVG text is server-rendered into the page so
   Google indexes the labels, not just the captions. No commerce wrapper.
   ─────────────────────────────────────────────────────────────────────────── */

const SLUG = 'india-ai-industrial-transition-2026-2035';
const FIG_DIR = path.join(process.cwd(), 'public', 'figures', SLUG);

/** Escape a string for safe use inside a RegExp pattern. */
function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Read an SVG at build time and prepare it for inline embedding.
 *
 *  Adobe Illustrator emits every export with the same generic identifiers —
 *  `.st0, .st1, .st2, ...` as CSS class names, `clippath-N` and `Layer_1` as
 *  element IDs, etc. Inside an isolated .svg file this is fine. But once we
 *  inline 30 SVGs on one HTML page, those globals collide: the last `.st3`
 *  definition wins, `url(#clippath-6)` resolves to the first matching ID in
 *  document order, and text fills/clip-paths silently swap across figures.
 *
 *  To prevent the collision we namespace every class name, every id="…", every
 *  url(#…) and every href="#…" with a per-figure prefix `f{n}_`. This is
 *  visually identical to the source SVG — just scope-isolated from the other
 *  29 on the page. We also strip XML prolog + DOCTYPE (invalid in HTML5) and
 *  the absolute width/height attrs (so `.fig-frame` CSS can size responsively
 *  via the preserved viewBox). */
function readFigure(n: number): string | null {
  try {
    let svg = readFileSync(path.join(FIG_DIR, `fig-${n}.svg`), 'utf8');
    svg = svg.replace(/<\?xml[^?]*\?>\s*/i, '');
    svg = svg.replace(/<!DOCTYPE[^>]*>\s*/i, '');

    const px = `f${n}_`;

    // 1. Collect every CSS class name defined in <style> blocks or used in
    //    class="…" attributes. We rename only classes we actually find, so
    //    incidental dots elsewhere (e.g. ".png" inside a url) stay untouched.
    const classes = new Set<string>();
    const styleBlocks = svg.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
    for (const block of styleBlocks) {
      // .identifier — selector context only (not preceded by alnum / _ / -,
      // i.e. not the middle of a number like 0.8 or a path like file.svg).
      const re = /(?<![a-zA-Z0-9_-])\.([a-zA-Z_][\w-]*)/g;
      let cm: RegExpExecArray | null;
      while ((cm = re.exec(block))) classes.add(cm[1]);
    }
    const classAttrRe = /\bclass="([^"]+)"/g;
    let am: RegExpExecArray | null;
    while ((am = classAttrRe.exec(svg))) {
      for (const c of am[1].split(/\s+/)) if (c) classes.add(c);
    }

    // 2. Collect every id="…" defined in the SVG.
    const ids = new Set<string>();
    const idRe = /\bid="([^"]+)"/g;
    let im: RegExpExecArray | null;
    while ((im = idRe.exec(svg))) ids.add(im[1]);

    // 3. Rename each id and every reference to it (url(#…), href="#…",
    //    xlink:href="#…"). Order: longest-first so e.g. `clippath-10` is
    //    renamed before `clippath-1` (otherwise the shorter match would clip
    //    the longer one and leave behind "0").
    const sortedIds = [...ids].sort((a, b) => b.length - a.length);
    for (const id of sortedIds) {
      const e = escRe(id);
      svg = svg.replace(new RegExp(`\\bid="${e}"`, 'g'), `id="${px}${id}"`);
      svg = svg.replace(new RegExp(`url\\(#${e}\\)`, 'g'), `url(#${px}${id})`);
      svg = svg.replace(new RegExp(`(xlink:href|href)="#${e}"`, 'g'), `$1="#${px}${id}"`);
    }

    // 4. Rename CSS class names in <style> selectors (longest-first for the
    //    same reason as ids).
    const sortedClasses = [...classes].sort((a, b) => b.length - a.length);
    for (const cls of sortedClasses) {
      const e = escRe(cls);
      svg = svg.replace(
        new RegExp(`(?<![a-zA-Z0-9_-])\\.${e}(?![a-zA-Z0-9_-])`, 'g'),
        `.${px}${cls}`,
      );
    }

    // 5. Rename classes inside every class="…" attribute. We rewrite the whole
    //    attribute in one pass so multi-class values like class="st0 st3" come
    //    out as class="f2_st0 f2_st3".
    svg = svg.replace(/\bclass="([^"]+)"/g, (_m, cls: string) => {
      const renamed = cls.split(/\s+/).filter(Boolean).map((c) => `${px}${c}`).join(' ');
      return `class="${renamed}"`;
    });

    // 6. Finally strip absolute width/height on the outer <svg> so the figure
    //    scales responsively via .fig-frame CSS + the preserved viewBox.
    svg = svg.replace(
      /<svg\b([^>]*)>/i,
      (_full, attrs: string) => {
        const cleaned = attrs
          .replace(/\swidth="[^"]*"/i, '')
          .replace(/\sheight="[^"]*"/i, '');
        return `<svg${cleaned}>`;
      },
    );

    return svg;
  } catch {
    return null;
  }
}

interface FigProps {
  n: number;
  caption: string;
  ariaLabel?: string;
}

function Figure({ n, caption, ariaLabel }: FigProps) {
  const svg = readFigure(n);
  return (
    <figure className="report-figure" id={`fig-${n}`}>
      {svg ? (
        <div
          className="fig-frame"
          role="img"
          aria-label={ariaLabel ?? caption}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="fig-frame">
          <img
            src={`/figures/${SLUG}/fig-${n}.svg`}
            alt={ariaLabel ?? caption}
            loading="lazy"
          />
        </div>
      )}
      <figcaption>
        <span className="fig-no">Fig. {n}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/* The 38-section table of contents. Section numbers align 1:1 with the
   manuscript’s numbered chapters. Front-matter and appendices are surfaced
   via separate jump anchors at the start and end of the article body. */
export const toc: TocItem[] = [
  { id: 'sec-1', label: '01 — The Reframe: AI as Industrial Infrastructure' },
  { id: 'sec-2', label: '02 — Five Forces Shaping India’s AI Transition' },
  { id: 'sec-3', label: '03 — India AI Infrastructure Readiness Matrix' },
  { id: 'sec-4', label: '04 — India’s Compute Build-Out: 1.5 GW → 9 GW' },
  { id: 'sec-5', label: '05 — The IndiaAI Mission: Design, Delivery, Gaps' },
  { id: 'sec-6', label: '06 — Hyperscaler Commitments & Geography of Capital' },
  { id: 'sec-7', label: '07 — The GPU Dependency Stack' },
  { id: 'sec-8', label: '08 — Edge AI, Submarine Cables, Coastal-AI Thesis' },
  { id: 'sec-9', label: '09 — India Semiconductor Mission: Approved vs Real' },
  { id: 'sec-10', label: '10 — The Fab Capex Pie: Who Captures the Money' },
  { id: 'sec-11', label: '11 — The OSAT / ATMP Gap Against AI-Class Packaging' },
  { id: 'sec-12', label: '12 — Import Dependency Map (HS 8542, 8471, 8473)' },
  { id: 'sec-13', label: '13 — Design Ecosystem: DLI, C2S, Fabless' },
  { id: 'sec-14', label: '14 — The AI Power and Cooling Stress Index' },
  { id: 'sec-15', label: '15 — Grid Stress: From 13 TWh to 57 TWh' },
  { id: 'sec-16', label: '16 — The Water-Stress Paradox' },
  { id: 'sec-17', label: '17 — Cooling Transition & Captive-RE Economics' },
  { id: 'sec-18', label: '18 — AI Regional Opportunity Corridors Framework' },
  { id: 'sec-19', label: '19 — Karnataka / Bengaluru' },
  { id: 'sec-20', label: '20 — Telangana / Hyderabad' },
  { id: 'sec-21', label: '21 — Tamil Nadu / Chennai-Coimbatore' },
  { id: 'sec-22', label: '22 — Maharashtra / Mumbai-Pune-Navi Mumbai' },
  { id: 'sec-23', label: '23 — Gujarat: The Semiconductor State' },
  { id: 'sec-24', label: '24 — NCR / Uttar Pradesh: The Second OSAT Pole' },
  { id: 'sec-25', label: '25 — Andhra Pradesh / Visakhapatnam' },
  { id: 'sec-26', label: '26 — The AI Industrial Dependency Map' },
  { id: 'sec-27', label: '27 — Industrial AI in Manufacturing, Pharma, Auto' },
  { id: 'sec-28', label: '28 — Logistics Modernisation' },
  { id: 'sec-29', label: '29 — Real Estate & Construction Second-Order Demand' },
  { id: 'sec-30', label: '30 — MSME Transformation: ONDC, Udyam, AI Adoption' },
  { id: 'sec-30a', label: '30A — Quantified Opportunity Surfaces' },
  { id: 'sec-31', label: '31 — The Talent Stack' },
  { id: 'sec-32', label: '32 — The GCC Explosion as the New IT-Services' },
  { id: 'sec-33', label: '33 — Higher-Education & Skill-Gap Arithmetic' },
  { id: 'sec-34', label: '34 — The Labour-Displacement Scenario Range' },
  { id: 'sec-35', label: '35 — Three Scenarios for 2030 and 2035' },
  { id: 'sec-36', label: '36 — The AI Infrastructure Bottleneck Framework' },
  { id: 'sec-37', label: '37 — Strategic Recommendations' },
  { id: 'sec-38', label: '38 — What Can Break the Thesis' },
];

export function ReportContent() {
  return (
    <>
      {/* ─────────────────────────────── Executive summary ──────────────────────────── */}
      <div className="exec-summary">
        <div className="es-label">Executive summary · Edition 01 · Baseline Architecture</div>
        <p>
          Between 2026 and 2035 India will multiply its compute capacity four-to-six times,
          construct its first credible mature-node semiconductor fab while remaining import-dependent
          for AI accelerators, expose its power and water systems to a new layer of demand
          concentrated in seven corridors, restructure its workforce around four functional layers
          rather than twenty career titles, and absorb capital flows of roughly{' '}
          <strong>USD 95 billion of data-centre capex</strong> alongside{' '}
          <strong>₹1.65 lakh crore of semiconductor commitments</strong>. The transition is real,
          financed and underway. What it changes is the geography of Indian industrial capability,
          the dependency structure of Indian compute, the labour-market signal, the regional pattern
          of inequality, and the strategic posture of India in the global AI supply chain.
        </p>
        <ul>
          <li>
            The transition is decided at the <strong>infrastructure layer</strong>, not the
            application layer. The binding constraint is geographic — seven districts must solve
            local power-and-water — not financial.
          </li>
          <li>
            India’s semiconductor effort is a <strong>partial answer to a deeper dependency</strong>.
            Mature-node fab ≠ semiconductor sovereignty; advanced packaging is the missing layer.
          </li>
          <li>
            The cost of AI infrastructure is paid in <strong>megawatts and litres</strong>, not just
            rupees. The DC pipeline is densest where CGWB stress is highest.
          </li>
          <li>
            The unit of competition is the <strong>corridor, not the state</strong>. Visakhapatnam
            is the most important capital-allocation story of the 2026–2030 window.
          </li>
          <li>
            <strong>Second-order industrial effects</strong> dwarf the first-order AI effects.
            Indian-vendor opportunity through 2030 is roughly ₹80,000–150,000 crore; ₹28,000–60,000
            crore of it is addressable to SMEs.
          </li>
          <li>
            The workforce transition is <strong>asymmetric, not catastrophic</strong>. 1–3 million
            displaced in routine-cognitive roles under the substitution scenario; absorbable through
            re-skilling at base case.
          </li>
        </ul>
      </div>

      {/* Ten anchor numbers — rendered as a pull-stat strip for SEO + scanability */}
      <div className="pull-stat">
        <div className="ps"><div className="n">1.5 → 9 GW</div><div className="l">India DC installed capacity, 2025 → 2030</div></div>
        <div className="ps"><div className="n">13 → 57 TWh</div><div className="l">Annual DC electricity demand, 2024 → 2030</div></div>
        <div className="ps"><div className="n">USD 50B+</div><div className="l">Announced hyperscaler commitments to India through 2030</div></div>
        <div className="ps"><div className="n">USD 95B</div><div className="l">Cumulative DC-related capital commitments 2019–2025 (CEEW)</div></div>
        <div className="ps"><div className="n">₹1.65 LC</div><div className="l">Total announced ISM semiconductor project capex</div></div>
        <div className="ps"><div className="n">38,000+</div><div className="l">IndiaAI Mission GPUs deployed (vs Cabinet target of 10,000)</div></div>
        <div className="ps"><div className="n">~71%</div><div className="l">Share of India’s CLS capacity at Mumbai + Chennai today</div></div>
        <div className="ps"><div className="n">0</div><div className="l">Indian advanced-packaging (CoWoS-class) facilities announced as of May 2026</div></div>
      </div>

      <p className="dropcap">
        Every few months a new groundbreaking ceremony adds a node to the map of India’s AI
        industrial ambition. The coverage that follows tends to ask the same question: can India
        build its own AI? It is the wrong question — or at least an incomplete one. A data centre
        is not a building that happens to house GPUs; a fab is not a factory that happens to make
        chips. Each is the visible apex of a dense industrial system whose viability is decided by
        everything around it — by megawatts and litres and fibre and substrates and skilled labour
        — and by the corridors in which those layers happen to coincide.
      </p>
      <p>
        This report takes the system, rather than the model or the chip, as its unit of analysis.
        It asks a different question: when India builds AI infrastructure at the scale already
        committed, which parts of the industrial stack actually capture the value, where do the
        binding constraints sit, and what second-order transformations follow in the regions that
        host it? The answer is given through nine analytical frameworks, thirty figures, six data
        tables, seven regional corridors and three scenario ranges. The instruments are designed
        to be portable: each can be detached from the report and applied as an analytical
        instrument against new data.
      </p>

      {/* ════════════════════════════ PART I — THE THESIS ════════════════════════════ */}

      <h2 id="sec-1"><span className="h2-no">01 — Framing</span>The Reframe: AI as Industrial Infrastructure</h2>
      <p>
        The dominant framing of artificial intelligence in Indian public discourse over the past
        three years has been workforce-centric — about jobs displaced, salaries inflated, skills
        obsolesced. This framing is not wrong, but it is downstream. The underlying transition
        that produces those workforce effects is an industrial one, taking place at the layer of
        physical infrastructure: compute capacity, semiconductors, electrical power, water, fibre,
        real-estate and skilled labour. To understand the AI transition in India one must
        understand it the way one would the transition to thermal power in the 1960s, the green
        revolution in the 1970s, the IT-services build-out of the 1990s, or the highways programme
        of the 2000s — as a layered re-engineering of the physical economy.
      </p>
      <p>
        The mechanism is simple to state. A modern AI model is trained on a cluster of accelerators
        (Nvidia H100, H200, B200, GB200, Google TPU, AMD MI300, Intel Gaudi) housed in a hyperscale
        data centre, drawing tens to hundreds of megawatts of electricity, cooled by water or
        liquid loops at rates the local utility did not historically design for, connected via tens
        to hundreds of terabits per second of fibre, and operated by a workforce that is small in
        headcount but specialised in trade. The same model, once trained, is deployed on inference
        infrastructure that is geographically distributed because latency matters, and that
        infrastructure draws power and water and fibre in turn. Every layer in this stack is a
        physical, capital-intensive, location-bound system. The economic question that determines
        whether India captures the value of AI is whether India can build, own and operate each of
        those layers — and where it cannot, whether the import dependency is manageable.
      </p>
      <p>
        Once the question is framed this way, several observations follow. The unit of strategic
        competition is the corridor: a data centre is sited where power is plentiful and grid-firm,
        where water is available and water rights are clear, where fibre lands or transits, where
        land is buildable and zoned, where the regulatory environment is predictable, and where
        adjacent skilled labour exists. These conditions cluster in roughly seven Indian corridors
        — Mumbai, Chennai, Hyderabad, Bengaluru, Pune, Visakhapatnam, Noida–Sanand–Dholera. They
        do not cluster nationally. The binding constraint matters more than the headline number:
        India’s 1.26 GW (2024) to 1.5 GW (2025) installed DC capacity has a publicly stated
        pipeline to 4.5–9 GW by 2030, but reaching the upper bound depends not on capital but on
        whether power can be added, water sourced, fibre right-of-way cleared, and the DISCOM-level
        interconnection queue executed on time.
      </p>
      <p>
        The semiconductor question is two questions, not one. The first is the manufacturing-capacity
        question: can India produce its own chips at scale? The honest answer is that the India
        Semiconductor Mission is producing real capacity at mature nodes (28–110 nm logic,
        DRAM/NAND packaging, mixed-signal, power electronics) but not at the bleeding edge, and
        certainly not in the advanced packaging substrate that AI accelerators require. The second
        is the dependency-management question: given that India will continue to import the
        AI-class chips that matter for the next decade, how does the import remain reliable,
        geographically diversified, and not held hostage to US export controls or Chinese
        specialty-input retaliation? That second question is the harder one.
      </p>
      <p>
        The second-order industrial effects — automation in manufacturing, AI in pharma, AI in
        logistics, AI in MSMEs — are not separate stories but adjacent loops in the same system.
        Constructing a 100 MW data centre creates demand for industrial real-estate, high-tension
        transformers, industrial chillers, ultrapure water systems, fibre splicing, diesel back-up,
        skilled DCIM technicians, power-electronics engineers. Deploying AI in a Tata Motors plant
        or a Sun Pharma facility creates demand for industrial sensors, vision systems,
        connectivity, cloud compute, ML engineers, safety and governance professionals, and new
        regulatory categories. These second-order loops are where most of the GDP contribution of
        the AI transition will be realised, and they are where the inequality and labour-displacement
        risks will also be realised. The reframe of this report, therefore, is to treat AI in India
        as an industrial transition with seven layers: compute (Part II), semiconductor and
        packaging dependency (Part III), power-water-cooling (Part IV), regional corridors (Part V),
        industrial second-order effects (Part VI), workforce and talent (Part VII), and strategic
        outlook (Part VIII).
      </p>

      <h2 id="sec-2"><span className="h2-no">02 — Five forces</span>Five Forces Shaping India’s AI Transition (2026–2035)</h2>
      <p>
        Five forces structure the period this report covers. They are introduced here at the level
        of thesis; each is elaborated in the part where it operates.
      </p>
      <p>
        <strong>The first force is the infrastructure-capital cycle.</strong> Hyperscaler investment
        commitments to India are at an inflection. AWS announced an additional USD 8.3 billion over
        Mumbai in January 2025, bringing cumulative India commitment to USD 12.7 billion through
        2030. Microsoft announced USD 3 billion in January 2025 and a further USD 17.5 billion in
        December 2025, opening its India South Central region in Hyderabad in mid-2026 and expanding
        through Chennai, Pune and Bengaluru. Google’s Visakhapatnam AI hub, announced October 2025
        with groundbreaking April 2026, is a USD 15 billion gigawatt-scale facility tied to subsea
        cable and renewable energy. Oracle launched Database@Google Cloud out of its Mumbai region
        in December 2025. Cumulative announced hyperscaler capex through 2030 exceeds USD 50
        billion; CEEW’s roll-up of all DC-related capital commitments from 2019 onwards puts the
        figure at roughly USD 95 billion. The cycle is real, concentrated geographically, and the
        single most consequential force in the period.
      </p>
      <p>
        <strong>The second force is the semiconductor sovereignty drive.</strong> The India
        Semiconductor Mission began with a ₹76,000 crore outlay in December 2021. By May 2026,
        twelve projects had been approved with cumulative announced capex of roughly ₹1.64 lakh
        crore, including the Tata–PSMC fab at Dholera (₹91,000 crore, 50,000 wafers per month at
        28–110 nm), the Tata-TSAT OSAT in Assam (₹27,120 crore, 48 million chips per day at ramp),
        the Micron OSAT at Sanand (USD 2.75 billion), and four other OSAT facilities at Sanand and
        Surat. ISM 2.0 was announced in Union Budget 2026-27 with a ₹1,000 crore FY26-27 allocation
        focused on equipment, materials and full-stack IP. The drive is real, the centrepiece fab
        is under construction, and the strategic question — whether mature-node fab plus mid-tier
        OSAT closes India’s actual AI dependency — is the subject of Part III.
      </p>
      <p>
        <strong>The third force is the grid-and-water constraint.</strong> India’s DC electricity
        demand is on a trajectory from ~13 TWh in 2024 (about 0.8% of national consumption) to ~57
        TWh by 2030 (~2.6%) on CEEW and S&amp;P Global numbers. CEA peak-demand projections place
        India at 289 GW peak in 2026-27 rising to 459 GW by 2035-36, against a non-fossil capacity
        target of 500 GW by 2030. The aggregate numbers are accommodating; the geographic
        concentration is not. Mumbai (61 DCs), Hyderabad (33), Delhi NCR (31), Bengaluru (31) and
        Chennai (30) represent the binding constraint. The water position is more acute: CGWB
        classifies Bengaluru and Hyderabad as over-exploited, with Bengaluru Rural at 169% of
        permissible extraction; Chennai was on Day Zero in 2019. The DC pipeline is densest
        precisely where the water position is most stressed.
      </p>
      <p>
        <strong>The fourth force is the regional capital re-allocation.</strong> The states that
        have actively built AI-corridor policy frameworks — Karnataka’s GCC Policy 2024-29, Tamil
        Nadu’s Semiconductor and Advanced Electronics Policy 2024, Telangana’s Data Centres Policy
        2024, Maharashtra’s GCC Policy 2025, Gujarat’s Semiconductor Policy 2022-27, Andhra
        Pradesh’s Electronics Manufacturing Policy 4.0 — are now competing for hyperscaler capital
        and PLI capex with explicit subsidy structures. State-level outcomes will diverge sharply
        because endowments diverge sharply. Part V maps the divergence.
      </p>
      <p>
        <strong>The fifth force is the workforce re-stratification.</strong> The Indian IT-BPM
        workforce is large in aggregate (about 5 million on NASSCOM’s working figure) but Tier-1
        services headcount declined by more than 42,000 over the two years to early 2026. Net
        growth is concentrated in GCCs (1,700+ today; NASSCOM working target 2,100+ by 2030; EY
        aspirational 5,000), in mid-tier services, in engineering R&amp;D, and in the semiconductor
        and AI-infrastructure workforce that does not yet exist at the scale required. The talent
        gap is real: NASSCOM-Deloitte 2024 identifies a 1.25-million AI talent demand by 2027
        against a 51% role-unfilled rate today; industry roll-ups place the semiconductor talent
        gap at 250,000–300,000 by 2027. These five forces interact, and the report’s parts follow
        their interactions in order.
      </p>

      <Figure
        n={1}
        caption="Five forces shaping India’s AI industrial transition (2026–2035): infrastructure-capital cycle, semiconductor sovereignty, grid-and-water, regional re-allocation, workforce re-stratification — each elaborated in the corresponding part of the report."
        ariaLabel="Diagram of five interacting forces structuring India’s AI industrial transition 2026 to 2035."
      />

      <h2 id="sec-3"><span className="h2-no">03 — Framework 1</span>The India AI Infrastructure Readiness Matrix</h2>
      <p>
        The first framework of this report is the India AI Infrastructure Readiness Matrix — a
        six-axis scoring system designed to compare corridors against each other on the dimensions
        that determine whether an AI data centre, semiconductor facility, or industrial-AI
        deployment is technically and economically viable in that geography. The six axes are:
        compute capacity (installed and pipeline), power availability and reliability, water
        availability and stress, fibre and submarine-cable proximity, semiconductor and
        electronics-manufacturing adjacency, and talent concentration. Each axis is scored on a
        1–5 scale relative to other Indian corridors, not against a global benchmark.
      </p>
      <p>
        The matrix is explicitly comparative within India, because the question it is designed to
        answer is not “is Indian infrastructure ready?” but “which Indian corridor is readier for
        which workload?” A 500 MW AI training cluster has different requirements from a 50 MW
        inference farm, which has different requirements from an electronics-manufacturing PLI
        facility with embedded AI. The matrix surfaces those differences. Applied to the seven
        principal corridors, the matrix produces structural patterns: Karnataka / Bengaluru is
        highest on talent and compute pipeline, lowest on water; Telangana / Hyderabad is highest
        on hyperscaler magnetism; Tamil Nadu / Chennai is highest on electronics manufacturing and
        coastal-fibre; Maharashtra / Navi Mumbai is highest on existing compute (44% of national
        DC mass) and submarine-cable density (eight CLS at Mumbai); Gujarat / Sanand-Dholera is
        highest on semiconductor adjacency; NCR / Noida-Jewar is mid-range with a recent semiconductor
        step-up; Andhra Pradesh / Visakhapatnam is rising fastest of any corridor on compute.
      </p>
      <p>
        What the matrix makes visible is that no Indian corridor is strong on all six axes. Every
        regional bet involves a trade-off: services talent against water, semiconductor capacity
        against AI-services depth, hyperscaler magnetism against grid reliability, coastal fibre
        against industrial real-estate availability. The corollary is that capital allocation
        across Indian corridors is not a single bet but a portfolio choice, and the binding
        constraint in each corridor is different. The matrix is the instrument for naming that
        constraint, and it is meant to be re-scored annually.
      </p>

      <Figure
        n={2}
        caption="India AI Infrastructure Readiness Matrix — seven corridors (Karnataka/Bengaluru, Telangana/Hyderabad, Tamil Nadu/Chennai, Maharashtra/Mumbai-Navi Mumbai, Gujarat/Sanand-Dholera, NCR/Noida-Jewar, AP/Visakhapatnam) scored on six axes: compute, power, water, fibre, semiconductor adjacency, talent."
        ariaLabel="Radar matrix scoring seven Indian corridors across six AI-infrastructure axes."
      />

      {/* ═══════════════════════════ PART II — COMPUTE LAYER ═══════════════════════════ */}

      <h2 id="sec-4"><span className="h2-no">04 — Compute</span>India’s Compute Build-Out: From 1.5 GW to 9 GW</h2>
      <p>
        The single number that organises this part is data-centre installed IT load, measured in
        megawatts. India’s installed capacity grew from approximately 1.26 GW in 2024 (the Colliers
        benchmark) to approximately 1.5 GW in 2025 (the CEEW benchmark), with the operational
        figure entering 2026 between 1.5 and 1.7 GW depending on the cooling-and-reservation
        convention. JLL India’s Data Centre Dynamics projects 1.8 GW by 2027. Cushman &amp;
        Wakefield’s pipeline read for end-2028 is 3.29 GW (1.03 GW under construction plus 1.29 GW
        planned). Colliers’ 2030 base-case projection is 4.5 GW, CEEW’s projection is 6.5 GW, and
        S&amp;P Global’s AI-accelerated scenario takes the number to 8–9 GW. The variance in those
        projections is itself the data: the path from 1.5 GW to 4.5–9 GW will be decided by
        infrastructure debottlenecking, not capital availability.
      </p>
      <p>
        The structure of the existing base is concentrated. Mumbai and Navi Mumbai host
        approximately 44% of national capacity — about 289 MW operational in Navi Mumbai alone —
        driven by submarine-cable landings, MIDC industrial zoning, and Maharashtra’s 2023 IT-ITES
        policy commitments on 24×7 supply and renewable-energy access. Chennai is the second pole
        at approximately 200 MW operational, with the Ambattur and Siruseri-SIPCOT clusters
        drawing on the Chennai cable landing station and Tamil Nadu’s 2021 Data Centre Policy
        concessions. Hyderabad is the third pole — and here the data is genuinely disputed: state
        government communications cite operational capacity of 859 MW (2025), while Cushman-aggregated
        and trade-press sources put operational capacity at 152 MW with the rest planned or under
        construction. The disagreement is not noise; it reflects whether one counts sanctioned-and-permitted
        capacity (the larger number) or commissioned-and-energised capacity (the smaller).
      </p>
      <p>
        Bengaluru is the fourth pole, with disputed capacity estimates (107 MW per Mordor, 182 MW
        per Cushman, 79 MW on the alternative installed-IT-load convention). The KIADB-approved
        Bengaluru data park (500 MW capacity near Hoskote, fed by Pavagada solar and 60 MLD of
        treated water from BWSSB) is the dominant pipeline addition. NTT’s Bengaluru 4 announcement
        of December 2025 (₹2,400 crore, 100 MW facility load / 67.2 MW IT load on 8.5 acres) is the
        largest single new commitment. The pattern in Karnataka is that the policy framework is
        sophisticated but the water profile is degrading; the Bengaluru DC growth will be
        constrained by water, not by capital or policy. Delhi NCR is the fifth pole, with
        approximately 31 DCs across Greater Noida, Manesar, and the Yamuna Expressway corridor.
        Andhra Pradesh / Visakhapatnam, the dark-horse third coastal node, will move sharply once
        the Google-Adani 1 GW campus (groundbreaking April 2026) commissions. The operator picture
        is consolidating: the late-2025 market-share snapshot from trade-press aggregation puts NTT
        GDC at about 20%, Sify and ST Telemedia at 19% each, Airtel Nxtra and CtrlS at 15% each,
        Yotta at 5%, and AdaniConneX at 1% — with the AdaniConneX share understating its forward
        pipeline.
      </p>
      <p>
        The capital question is settled enough to be uninteresting. The geographic-and-physical
        question — power, water, fibre right-of-way, zoning, interconnection queue management — is
        the actual constraint, and is the subject of Sections 14–17.
      </p>

      <Figure
        n={3}
        caption="India data-centre installed capacity — three scenarios to 2035: Colliers base case at 4.5 GW by 2030 (and roughly 8 GW by 2035); CEEW base case at 6.5 GW by 2030; S&P Global AI-accelerated case at 8–9 GW by 2030 and 12–15 GW by 2035."
        ariaLabel="Line chart of three DC capacity scenarios to 2035."
      />

      <h2 id="sec-5"><span className="h2-no">05 — IndiaAI Mission</span>The IndiaAI Mission: Design, Delivery, Gaps</h2>
      <p>
        The IndiaAI Mission is the Union government’s principal public investment in domestic AI
        compute. The Cabinet approved the mission on 7 March 2024 with a five-year outlay of
        ₹10,371.92 crore (PIB PRID 2012375). Its seven pillars are: Compute (the subsidised GPU
        layer), the Innovation Centre, the AIKosha Dataset Platform (launched 6 March 2025),
        Application Development, FutureSkills, Startup Financing, and Safe &amp; Trusted AI. The
        headline output is the GPU procurement programme.
      </p>
      <p>
        The procurement programme has, by May 2026, substantially exceeded its original target. The
        Cabinet approval cited a 10,000-GPU goal. Through three tenders the cumulative onboarded
        count rose to 18,000-class units in the first round, 34,333 GPUs by the second round, and
        approximately 38,231 GPUs across all rounds by March 2026 — verified through PIB PRID
        2132817 and the IndiaAI Compute Portal. The tender mix is heterogeneous: the third round
        includes Locuz with 1,300 Nvidia H100s, Sify with 2,500 units in a mix of Google Trillium
        TPUs, H200s and L4s, and Ishan with 50 Trillium TPUs. The subsidised availability rate is
        ₹65 per GPU-hour at base, rising to ₹92 per GPU-hour for H100s — a substantial discount on
        the unsubsidised market rate.
      </p>
      <p>
        The mechanism is consequential and is often misunderstood. The IndiaAI Mission does not
        own the GPUs. It empanels private providers for a 36-month period (extensible by 12 months)
        and subsidises the per-GPU-hour rate at which qualified Indian users — startups,
        researchers, students, government agencies — can rent the compute. The reported fund-flow
        data is consistent with this design but is itself a source of concern: per MediaNama’s
        analysis of the parliamentary reply of February 2026, only ₹21.79 crore was released in
        FY24-25, and ₹379.15 crore through 9 February of FY25-26 — a cumulative release of
        approximately ₹400 crore against the ₹10,372 crore five-year outlay, or under 4%. The
        FY25-26 Budget allocation of ₹2,000 crore was revised down to ₹800 crore at the
        revised-estimates stage. The interpretation of this gap is more interesting than the gap
        itself: the subsidy model shifts capex risk to providers; the providers have invested
        ahead of government release; the government’s actual outflow will rise as utilisation
        rises. Alternative readings — under-demand for H100-class workloads, or price discovery
        below cost-of-capital — are also plausible.
      </p>
      <p>
        What the IndiaAI Mission does well is to establish India as a country whose government has
        stated, paid for and partly delivered on a sovereign-AI-compute capability at meaningful
        scale. The 38,000-GPU figure is large in international comparison and is a credible
        foundation. What the mission does not address — and was not designed to address — is the
        dependency on imported accelerators (every Nvidia H100, H200 and Trillium TPU in the
        empanelled fleet is imported under HS 8542 or 8473), the dependency on imported
        wafer-equipment for the OSAT-and-fab capacity that might one day produce domestic
        accelerators, and the dependency on imported HBM and CoWoS-class packaging that no current
        Indian facility can provide. Those dependencies are the subject of Part III.
      </p>

      <Figure
        n={4}
        caption="India AI policy architecture — Cabinet to ministries (MeitY, MoSDE, MoF) to agencies (C-DAC, DigiIndia Bhashini Mission, IndiaAI IBD) to instruments (Compute Portal, AIKosha, FutureSkills PRIME) to beneficiary cohorts (researchers, startups, MSMEs, governments)."
        ariaLabel="Hierarchical diagram of India AI policy architecture and its beneficiaries."
      />

      <Figure
        n={5}
        caption="IndiaAI Mission GPU procurement — from 10,000 Cabinet target to 38,231+ deployed across three rounds (Locuz H100s, Sify TPU/H200/L4 mix, Ishan Trillium TPUs, Yotta, Tata Communications and others) at subsidised ₹65–92 per GPU-hour."
        ariaLabel="Bar chart of IndiaAI Mission GPU deployment by tender round."
      />

      <h2 id="sec-6"><span className="h2-no">06 — Hyperscalers</span>Hyperscaler Commitments and the Geography of Capital</h2>
      <p>
        The hyperscaler commitment to India has, between 2024 and 2026, moved from incremental to
        transformative. AWS has the largest cumulative commitment — the January 2025 announcement
        raised cumulative India spend through 2030 to USD 12.7 billion, centred on Mumbai and
        Hyderabad. Microsoft has the largest fresh commitment of the cycle — January 2025’s USD 3
        billion was followed by December 2025’s USD 17.5 billion (cumulative USD 20.5 billion).
        The India South Central region in Hyderabad goes live in mid-2026, expanding through
        Chennai, Pune and Bengaluru. Microsoft’s 1.1 million-square-foot Gachibowli campus, ₹15,000
        crore committed with 4,800 incremental hires, is the largest Microsoft R&amp;D site outside
        the United States.
      </p>
      <p>
        Google has, since the October 2025 Visakhapatnam announcement, the highest-profile
        gigawatt-scale commitment: USD 15 billion over 2026–2030 for the AI hub, broken across
        three data-centre campuses on three tech-zone sites in Madhurawada, a gigawatt-scale
        electricity profile, a 100% renewable energy commitment, partner roles for AdaniConneX
        (200 MW initial scaling to 1 GW) and Airtel-Nxtra, and an associated subsea-cable and
        clean-energy commitment. Groundbreaking was April 2026. Reliance–NVIDIA Jamnagar is the
        largest Indian-led AI infrastructure commitment: announced 25 October 2024, a 1 GW AI data
        centre expandable to multi-GW (some sources cite 2 GW), supplied with Nvidia Blackwell
        GPUs (B200 and GB200), sited at Jamnagar — co-located with Reliance’s existing 2.4 GW
        captive power plant — eliminating the grid-interconnection bottleneck. Oracle announced a
        smaller but strategically important step in December 2025, going live with Oracle
        Database@Google Cloud out of its Mumbai region — making India a launch geography for a
        flagship multicloud offering.
      </p>
      <p>
        CEEW’s roll-up of all DC-related capital commitments from 2019 onwards puts cumulative
        committed investment at approximately USD 95 billion. The gap between USD 50 billion
        (announced hyperscaler commitments 2024–2026) and USD 95 billion (cumulative since 2019)
        is filled by domestic operators (AdaniConneX, Yotta, NTT, Sify, CtrlS, Reliance), other
        foreign operators (Equinix, Digital Realty, ST Telemedia, Digital Edge), and Indian
        conglomerates building captive AI capacity. The geography of this capital is the
        determinant of the geography of Indian AI capability through 2030: Mumbai-Navi Mumbai
        (established hub), Hyderabad (hyperscaler magnet), Chennai (coastal-cable hub), Bengaluru
        (talent hub), Visakhapatnam (rising third coastal node), Pune (emerging hyperscaler
        destination), and Jewar-Noida (second OSAT/AI cluster). The capital is not moving to
        inland Tier-2 cities, or to the agricultural states, or to the Northeast.
      </p>

      <Figure
        n={6}
        caption="Hyperscaler India commitments through 2030 — cumulative announced capex: AWS USD 12.7B, Microsoft USD 20.5B, Google USD 15B (Visakhapatnam), Reliance-NVIDIA Jamnagar 1–2 GW (capex undisclosed), Oracle Mumbai region; combined > USD 50B announced; CEEW cumulative roll-up since 2019 ~USD 95B."
        ariaLabel="Stacked bar chart of hyperscaler India capital commitments through 2030."
      />

      <Figure
        n={7}
        caption="Hyperscaler India investment timeline 2017–2030 — active commitments by provider (AWS Mumbai 2016, AWS Hyderabad 2022, AWS expansion Jan 2025; Microsoft Pune-Chennai-Mumbai legacy and Hyderabad Jan 2025 + Dec 2025; Google Mumbai 2020 + Delhi 2021 + Visakhapatnam Oct 2025; Reliance-NVIDIA Jamnagar Oct 2024; Oracle Asia-South 1 Dec 2025)."
        ariaLabel="Timeline of hyperscaler India investments 2017 to 2030."
      />

      <h2 id="sec-7"><span className="h2-no">07 — Framework 2</span>The GPU Dependency Stack</h2>
      <p>
        The framework introduced in this section is the GPU Dependency Stack, designed to map every
        Indian AI accelerator deployment to its upstream supply chain. The stack has six layers,
        read from end product to raw input. Layer one is the AI accelerator itself: an H100, H200,
        B100, B200, GB200, MI300, Trillium TPU, Gaudi 3 or equivalent. In India, every accelerator
        currently in commercial operation is imported. Layer two is the HBM (high-bandwidth memory)
        stack that sits beside or atop the accelerator die. HBM is produced by SK Hynix, Samsung
        and Micron at the leading edge; HBM3E is fully allocated through 2026 (per TrendForce and
        SemiAnalysis as of late 2025). No India facility produces HBM.
      </p>
      <p>
        Layer three is advanced packaging — the 2.5D and 3D interposers, silicon bridges and
        TSV-based assembly methods that integrate the GPU die with the HBM stacks and the
        substrate. TSMC’s CoWoS is the dominant process; capacity is oversubscribed through 2026
        and remains the binding constraint on global AI accelerator production. Alternative
        packaging from ASE (CoWoP), Amkor and emerging OSAT-led variants is stepping up in the
        second half of 2026. No India OSAT has announced CoWoS-class 2.5D/3D advanced packaging
        capability as of May 2026. Tata’s Integrated System Packaging in Assam is system-in-package
        level, not chiplet/HBM-class. This is the single most consequential gap in India’s
        semiconductor stack for AI purposes.
      </p>
      <p>
        Layer four is leading-edge logic — the 3 nm, 4 nm and 5 nm processes on which AI
        accelerators are fabricated. TSMC, Samsung Foundry and (at lower volume) Intel Foundry
        produce these wafers. The Tata–PSMC fab at Dholera targets 28 to 110 nm, several nodes
        behind the AI-accelerator requirement. India will not produce leading-edge logic wafers in
        the period of this report. Layer five is specialty materials and gases — ultrapure silane,
        EUV photoresists, special carbon-based chemicals, sputtering targets, photomask blanks.
        Most are sourced from Japan, South Korea, Germany and the United States; some are produced
        by Linde and Inox Air Products in India. Layer six is wafer-fabrication equipment (WFE) —
        ASML lithography scanners, Applied Materials and Lam Research deposition and etch tools,
        Tokyo Electron coater-developer tracks, KLA inspection systems. The Big Five hold roughly
        70% of WFE market share. India does not manufacture any of these.
      </p>
      <p>
        When the stack is laid out this way, two observations follow. India’s AI accelerator
        supply is dependent on a six-layer global chain, of which India today participates
        meaningfully only at the lowest two layers (specialty gases via Linde and Inox; assembly
        of standard-node chips via Tata OSAT, Micron, CG Semi, Kaynes and HCL-Foxconn). The
        binding global constraints on AI accelerator supply — HBM allocation, CoWoS capacity,
        leading-edge wafer slots — are precisely the constraints over which India has no agency.
        The strategic implication is that the most consequential next investment in the India
        semiconductor stack is not another mature-node fab. It is a credible advanced-packaging
        facility, ideally co-located with the Tata Assam OSAT or the HCL-Foxconn Jewar OSAT, with
        a path to OSAT-led 2.5D packaging within a four-to-five year window.
      </p>

      <Figure
        n={8}
        caption="GPU Dependency Stack — six-layer view of India’s position layer-by-layer: AI accelerator (0% indigenous), HBM (0%), advanced packaging (0%), leading-edge logic (0%), specialty materials and gases (partial — Linde, Inox), wafer-fabrication equipment (0%). India today participates only at the lowest layers."
        ariaLabel="Six-layer dependency stack showing India's position at each layer of the AI accelerator supply chain."
      />

      <h2 id="sec-8"><span className="h2-no">08 — Coastal-AI</span>Edge AI, Submarine Cables, and the Coastal-AI Thesis</h2>
      <p>
        The geography of AI inference is decided by latency. Below approximately 50 milliseconds
        end-to-end, the difference is imperceptible for typical conversational or recommendation
        workloads; above 100 ms it becomes noticeable; above 200 ms real-time agentic workflows
        degrade. The latency budget is set by physics — fibre signal propagation at roughly
        two-thirds the speed of light — and routing. The implication for India is that AI
        inference geography is coastal-and-network-adjacent geography.
      </p>
      <p>
        India operates 17 international submarine cables landing at 16-17 cable landing stations.
        Mumbai hosts eight CLS, Chennai four, and Kochi and other locations the remainder. Total
        capacity at end-2024 was approximately 193 Tbps with 148 Tbps activated. The major
        capacity additions of 2024-2026 are the Reliance Jio India-Asia Xpress (IAX), India-Europe
        Xpress (IEX, &gt;200 Tbps, operational March 2025), the NTT MIST cable (Mumbai and Chennai,
        &gt;200 Tbps, announced February 2023), and the 2Africa cable live since October 2024. The
        Telecommunications (Authorisation for Captive Telecom Services) Rules 2025 and the TRAI
        two-tier CLS framework, finalised in early 2026, are the regulatory backbone for the next
        wave.
      </p>
      <p>
        The 71% concentration of CLS capacity at Mumbai and Chennai forces AI inference geography
        toward those two cities. Both are already grid-constrained and water-constrained. The
        strategic opening is Visakhapatnam: the Sify-led Open CLS proposal positions Andhra Pradesh
        as a third coastal node, and the Google-Adani USD 15 billion commitment provides the
        demand-side anchor that justifies the cable-side investment. By 2030, Visakhapatnam could
        plausibly hold 8–12% of national CLS capacity, materially diversifying the coastal-fibre
        concentration. Edge AI — inference performed close to the end user — extends this
        geography. The economic case for edge AI is concentrated in three workload categories:
        real-time computer-vision, real-time speech-and-translation, and real-time decisioning in
        latency-sensitive industries (HFT at GIFT City, telecoms RAN AI, smart-grid balancing).
        Each requires inference compute within 10–25 ms of the user.
      </p>
      <p>
        The coastal-AI thesis can be stated cleanly. By 2030, India’s AI inference capacity will
        be split roughly 70–75% across five coastal-or-adjacent hubs (Mumbai-Navi Mumbai, Chennai,
        Visakhapatnam, Hyderabad-via-coastal-cable-from-Vizag, and the Bengaluru-Chennai twin),
        and 25–30% across inland Tier-1 metros (Delhi NCR, Pune, Ahmedabad, Indore, Lucknow). The
        coastal share is the binding consequence of submarine-cable geography. The strategic
        policy lever is whether the Visakhapatnam third coastal node materialises on schedule —
        that single project does more to reduce single-point-of-failure risk in Indian AI
        infrastructure than any other action available in the 2026–2030 window.
      </p>

      <Figure
        n={9}
        caption="India submarine cables and data-centre concentration — coastal-AI geography. Mumbai hosts 8 CLS, Chennai 4; combined ≈ 71% of national CLS capacity. Major recent additions: Jio IAX/IEX (March 2025), NTT MIST (2023), 2Africa (Oct 2024). Visakhapatnam emerges as third coastal node on Sify Open CLS plus Google-Adani demand anchor."
        ariaLabel="Map of India coastal submarine-cable landings and DC concentration."
      />

      {/* ═════════════════════ PART III — SEMICONDUCTOR DEPENDENCY ═════════════════════ */}

      <h2 id="sec-9"><span className="h2-no">09 — ISM</span>The India Semiconductor Mission: What Is Approved, What Is Real</h2>
      <p>
        The India Semiconductor Mission is the most ambitious industrial-policy programme of
        independent India outside the petrochemical and steel build-outs of the 1960s–1970s. Its
        scope is genuinely transformative if it delivers; its execution is genuinely uncertain.
        The original ₹76,000 crore outlay was approved in December 2021 under the Semicon India
        Programme. By May 2026 — the cut-off for this report — the Mission had approved twelve
        projects with cumulative announced capex of approximately ₹1.64 lakh crore across six
        states (PIB PRID 2258119, 5 May 2026).
      </p>
      <p>
        The Tata Electronics–PSMC fab at Dholera is the centrepiece. Approved 29 February 2024,
        the project has ₹91,000 crore (approximately USD 11 billion) total capex with 50%
        pari-passu fiscal support from the Centre and Gujarat. The fab targets 50,000 wafers per
        month on 300 mm wafers at 28, 40, 55, 90 and 110 nm nodes for logic and analog
        applications. ASML signed a strategic supply partnership in May 2026 for DUV-i lithography
        tools. Linde is setting up the gases plant at Dholera. The fab is expected to create more
        than 20,000 direct jobs and is now under construction. The Tata Semiconductor Assembly and
        Test (TSAT) facility at Jagiroad, Assam (₹27,120 crore, 48 million chips per day at ramp)
        produces wire-bond, flip-chip and Tata’s Integrated System Packaging (ISP). The Micron
        OSAT at Sanand (USD 2.75 billion, 500,000 sq ft cleanroom, DRAM/NAND assembly and test)
        was Phase-1 commissioned February 2025.
      </p>
      <p>
        The CG Power–Renesas–Stars Microelectronics OSAT at Sanand has ₹7,600 crore capex with
        15 million units per day at ramp; pilot line went live in 2025. Kaynes Semicon at Sanand
        (₹3,307 crore, 6 million chips per day) reached commercial production in March 2026 and
        made its first commercial shipment — 900,000 MCM units — to Alpha &amp; Omega Semiconductor
        in October 2025. HCL–Foxconn OSAT at Jewar/YEIDA (₹3,706 crore, 20,000 WSPM front-end /
        36 million units per month design output, technology focus on display driver ICs) was
        approved 14 May 2025. Suchi Semicon at Surat, Crystal Matrix at Dholera (GaN epitaxy and
        mini/micro-LED), ASIP Technologies in Andhra Pradesh, and the parallel non-ISM SCL Mohali
        modernisation (₹4,500 crore upgrade with NVM and GaN-on-Si capability) complete the
        twelve-project portfolio.
      </p>
      <p>
        ISM 2.0, announced in the Union Budget 2026-27 (PIB PRID 2221522), has an FY26-27
        allocation of ₹1,000 crore. ISM 2.0’s stated scope is equipment and materials
        manufacturing, full-stack Indian IP, and industry-led research and training centres. It
        is not a replacement for ISM 1.0 but an additional vertical layered on top. India has, in
        five years, moved from zero approved semiconductor projects to twelve, from zero fab
        approvals to one large 50,000 WSPM facility under construction, and from no major foreign
        OSAT presence to a Micron facility commissioned and ramping. The constraint, as the next
        sections argue, is that the build-out is not pointed at the part of the semiconductor
        supply chain that matters most for AI.
      </p>

      <Figure
        n={10}
        caption="Sanand semiconductor cluster ecosystem — anchor fab (Tata-PSMC Dholera adjacency), tenants (Micron OSAT, CG Power-Renesas-Stars, Kaynes Semicon, Suchi Semicon), supplier network (Inox specialty gases, Linde gases hub, L&T construction)."
        ariaLabel="Cluster map of Sanand semiconductor ecosystem tenants and suppliers."
      />

      <Figure
        n={11}
        caption="India Semiconductor Mission — 12 approved projects, May 2026 status: Tata-PSMC Dholera (under construction, ₹91,000 cr); Tata-TSAT Assam (Phase 1, ₹27,120 cr); Micron Sanand (commissioned, USD 2.75 bn); CG Semi, Kaynes, HCL-Foxconn, Suchi, Crystal Matrix, ASIP, plus SCL Mohali upgrade. Cumulative announced ≈ ₹1.65 lakh crore."
        ariaLabel="Status table of 12 ISM-approved semiconductor projects as of May 2026."
      />

      <h2 id="sec-10"><span className="h2-no">10 — Capex pie</span>The Fab Capex Pie: Who Actually Captures the Money</h2>
      <p>
        The Tata–PSMC Dholera fab is a ₹91,000 crore investment. The strategic question is: where
        does the money go? The answer determines whether the fab is an industrial-development
        success for India or a partial subsidy to global equipment OEMs. A leading-edge 300 mm fab
        — and Dholera, while not leading-edge in node terms, is leading-edge in wafer size and
        tool generation — has a capex split that is consistent across global benchmarks.
        Wafer-fabrication equipment accounts for 65–75% of total fab capex. Lithography alone is
        20–25%, with each ASML DUV-i scanner of the 1980i or 2000i class costing USD 80–110
        million. Facility shell construction is 20–30%. Specialty gases, ultrapure water, chemicals
        and abatement are embedded in the facility capex and the operating cost; ultrapure water
        systems alone consume 4 million litres per day at a 300 mm fab.
      </p>
      <p>
        Applied to the Tata–PSMC ₹91,000 crore total capex, the wafer-equipment share is roughly
        ₹60,000 crore. The five companies that capture this — ASML (Netherlands), Applied Materials
        (US), Lam Research (US), Tokyo Electron (Japan), KLA (US) — hold approximately 70% of the
        global WFE market. None is Indian. The May 2026 ASML-Tata partnership confirms the
        lithography supplier; on global benchmarks the lithography spend at a 50,000 WSPM 28–110
        nm fab would be approximately ₹12,000–18,000 crore. The remaining ₹40,000–50,000 crore of
        WFE flows to AMAT (deposition, etch, CMP, ion implant), LAM (etch, CVD), TEL
        (coater-developer tracks, etch, thermal), and KLA (process control and inspection).
      </p>
      <p>
        The Indian-capture share is therefore not the headline ₹91,000 crore. It is closer to
        ₹20,000–30,000 crore, comprising: construction (L&amp;T-class EPCs, civil and MEP
        contractors, ~₹15,000–20,000 crore at 20–30% facility-share basis); specialty gases (Linde
        India and Inox Air Products, with Inox’s ₹500 crore Electronic Specialty Gas Hub at Dholera
        the marquee India-side investment); ultrapure water systems (Tata Electronics’ ₹3,000
        crore / ~USD 360 million spend on desalination and reverse-osmosis); logistics and
        hazardous-gas transport (Stolt Tank Containers, Aegis Logistics handling silane from
        Mundra port); and the operating-cost wage bill for the 20,000+ direct jobs.
      </p>
      <p>
        The capture-share is not unfavourable. The ₹20,000–30,000 crore that lands in India is a
        serious industrial-development outcome — a domestic specialty-gases hub, a domestic
        ultrapure-water capability, a domestic civil-construction track record at fab scale, and a
        domestic operating workforce with fab experience. These are durable capabilities that
        will reduce capture-leakage on subsequent fabs. But the framing matters: the ₹91,000 crore
        is not the India number; the India number is roughly one-third of that, and growing as
        Indian-vendor depth improves. The same logic applies to the OSAT facilities. OSAT capex is
        more equipment-light (closer to 40–50% equipment vs 65–75% for fab), more construction-heavy,
        and substantially more labour-intensive in operating cost. The India-capture share of
        Micron, Tata Assam, CG Semi, Kaynes, and HCL-Foxconn is structurally higher than the
        fab’s — perhaps 50–60%. This is why OSAT investment is a higher-return industrial-policy
        bet per rupee of subsidy than fab investment.
      </p>

      <Figure
        n={12}
        caption="Tata-PSMC fab capex — where the ₹91,000 crore actually goes: wafer-fab equipment 65–75% (≈ ₹60,000 cr, captured by ASML/AMAT/LAM/TEL/KLA); facility shell construction 20–30% (≈ ₹15,000–20,000 cr, L&T-class Indian EPCs); specialty gases and UPW (₹3,000+ cr, Linde + Inox + Tata); operating wage bill and supply-chain (Indian)."
        ariaLabel="Capex breakdown pie chart of the Tata-PSMC Dholera fab showing equipment OEM capture vs Indian capture."
      />

      <h2 id="sec-11"><span className="h2-no">11 — Packaging gap</span>The OSAT / ATMP Gap Against AI-Class Packaging</h2>
      <p>
        India has built or is building substantial OSAT and ATMP capacity. This section establishes
        why that capacity does not, today, solve India’s AI-chip dependency, and then maps the
        specific technology, capacity, capital and timeline frontier of the advanced-packaging
        build-out that would be required to close it. The chips that power AI training and
        inference — Nvidia H100, H200, B100, B200, GB200, AMD MI300, Intel Gaudi 3, Google TPU —
        share a structural feature. Each is built as a multi-die assembly: a logic die at the
        leading edge (3–5 nm) paired with three to eight HBM stacks, connected through a silicon
        interposer or a similar 2.5D / 3D advanced-packaging substrate. The packaging technology
        that integrates these elements — TSMC’s CoWoS variants (CoWoS-S, CoWoS-R, CoWoS-L); Intel’s
        EMIB and Foveros; ASE’s CoWoP; emerging OSAT-led variants — is the single binding global
        constraint on AI accelerator supply.
      </p>
      <p>
        CoWoS capacity has been oversubscribed through at least 2026; HBM3E allocation is fully
        committed through 2026 per TrendForce and SemiAnalysis. The global capacity numbers are
        concentrated: TSMC operates approximately 75% of advanced 2.5D-packaging capacity at
        facilities in Taiwan and Arizona; ASE accounts for approximately 15%; Amkor for
        approximately 8%; Samsung Foundry’s I-Cube and Intel’s Foveros account for the residual.
        CoWoS revenue per wafer-equivalent rose from approximately USD 3,000 in 2022 to
        approximately USD 8,000 by mid-2025; the order-book extends 18–24 months forward.
      </p>
      <p>
        India’s announced OSAT capacity does not address this. Tata-TSAT’s Integrated System
        Packaging at Jagiroad is system-in-package — adjacent dies on a substrate, often for
        power and analog applications, not chiplets-and-HBM on an interposer. Micron Sanand is
        DRAM and NAND assembly and test. CG Semi, Kaynes and HCL-Foxconn are commodity OSAT
        (wire-bond, flip-chip, DDIC). None has announced CoWoS-class capability. As of May 2026,
        India has no advanced-packaging capability for AI accelerators. The capability gap is
        technical (the equipment, materials and process know-how for 2.5D/3D packaging are tightly
        controlled by TSMC, Samsung, SK Hynix, ASE and Amkor) and commercial (the customer base is
        a small set of fabless designers who currently allocate all available capacity to TSMC and
        ASE).
      </p>
      <p>
        A credible OSAT-led 2.5D packaging facility — the kind the report’s strategic recommendation
        argues for — has a definable capex envelope, equipment list and customer-development path.
        A first-generation Indian CoWoP-equivalent or CoWoS-equivalent facility producing
        approximately 5,000–10,000 wafer-equivalent units per month would require capex in the
        range of USD 3–6 billion (₹25,000–50,000 crore) at full-scale ramp — in the same range as
        the second-tier global competitors. Equipment required: Through-Silicon Via etch and
        deposition (Applied Materials, Lam Research), micro-bump and chip-on-wafer bonding (BESI,
        ASMPT, Hanmi), interposer-class lithography and inspection (Veeco, Onto Innovation),
        ultra-fine thermal compression bonders, high-throughput back-end-of-line inspection. None
        is currently manufactured in India; supply lead times in 2026 are 12–18 months for bonding
        tools and 18–24 months for TSV process tools. Customer qualification cycles from a fabless
        customer to a production order are 18–30 months. The realistic timeline for an Indian
        advanced-packaging facility to ship its first commercial AI-class package is therefore
        approximately 2030–2032 — five to six years from a credible 2026 commitment.
      </p>
      <p>
        The strategic case for India to enter the advanced-packaging supply rests on three
        factors. First, global capacity is genuinely constrained — TrendForce projects CoWoS
        demand growing at approximately 50% CAGR through 2027 against capacity growth of
        approximately 35% CAGR, implying a persistent supply deficit. Second, the technology is
        difficult but is not on a critical-IP control list in the same way that EUV lithography
        is — the supply chain for equipment and materials remains open to credibly-financed and
        government-supported facilities in third countries. Third, India’s existing OSAT base
        provides a foundation of clean-room labour, process-engineering talent and supply-chain
        logistics that a greenfield project would have to build from scratch. The strategic
        recommendation that follows in Section 37 is that India’s next major semiconductor
        commitment should target advanced packaging: a ₹25,000–50,000 crore facility, co-located
        with the Tata Assam OSAT or the HCL-Foxconn Jewar OSAT, with a credible technology
        partnership (Amkor, ASE, or a tier-2 Taiwanese OSAT diversifying outside Taiwan and
        China), and a four-to-five year construction timeline.
      </p>

      <Figure
        n={13}
        caption="Semiconductor Capability Stack — India’s position layer-by-layer: design (strong; 20% of global chip-design talent in India), mature-node logic fab (one under construction at Dholera), OSAT (six facilities, mid-tier), advanced packaging (zero), HBM (zero), leading-edge logic (zero), wafer-fabrication equipment (zero). The packaging-and-HBM gap is the binding AI dependency."
        ariaLabel="Layer-by-layer capability stack for India semiconductor ecosystem."
      />

      <h2 id="sec-12"><span className="h2-no">12 — Imports</span>The Import Dependency Map (HS 8542, 8471, 8473)</h2>
      <p>
        India’s monolithic IC imports (HS code 8542) were ₹1.05 lakh crore (approximately USD 12.6
        billion) in FY 2023-24. The broader IC plus microprocessor category (Nexdigm/IMARC roll-up)
        was ₹1.87 lakh crore (approximately USD 22.3 billion). The Department of Commerce’s wider
        semiconductor-device category — covering diodes, transistors and similar devices — was
        more than USD 25 billion. Imports from China and Hong Kong combined were approximately
        48.5% of the IC category in FY26-year-to-date (29.96% China, 18.51% Hong Kong, per
        Department of Commerce data analysed by Asia Business Outlook). Taiwan, South Korea,
        Singapore, Japan and Malaysia together account for most of the remaining 51%; the United
        States is approximately 6%.
      </p>
      <p>
        AI accelerators flow under HS 8542.31 (processors and controllers), HS 8542.32 (memories,
        including HBM), HS 8471 (automatic data-processing machines / servers — covering Nvidia
        DGX-class systems) and HS 8473 (parts for 8471, including GPU boards and accelerator
        cards). DGCI&amp;S does not publish AI-accelerator-specific value series; only the
        aggregate codes are available in primary government data. The strategic exposures, in order
        of decreasing severity: HBM allocation (SK Hynix and Samsung, both Korean; Micron the third
        source); CoWoS capacity (TSMC, Taiwanese); leading-edge logic wafers (TSMC and Samsung);
        commodity ICs imported via China (analog, power, mixed-signal, basic logic); and
        wafer-equipment supply feeding the Indian fab build-out.
      </p>
      <p>
        A geopolitical shock to Taiwan affects three of the five — the most severe scenario in the
        AI Infrastructure Bottleneck Framework (Section 36). India’s IC market is projected by
        IMARC to grow from USD 29.3 billion in 2024 to USD 108 billion by 2033 (14.44% CAGR). If
        the import-share-of-consumption stays at roughly 75%, India’s IC import bill rises to
        roughly USD 80 billion by 2033 — the scale of the dependency, and the scale of the
        potential industrial-policy prize if even 25% import substitution materialises domestically.
      </p>

      <h2 id="sec-13"><span className="h2-no">13 — Design</span>Design Ecosystem: DLI, C2S, Fabless</h2>
      <p>
        India’s design ecosystem is the part of the semiconductor stack where India already has
        structural depth. Approximately 20% of global chip-design talent works in India, primarily
        for foreign-headquartered captive design centres — the Intel Bengaluru and Hyderabad
        campuses, the Qualcomm Hyderabad campus, AMD India (USD 400 million five-year investment
        announced July 2023 primarily in Bengaluru), Texas Instruments Bengaluru, Synopsys and
        Cadence. India hosts approximately 60,000 semiconductor engineers across 55+ GCCs and 95
        sites.
      </p>
      <p>
        The Design-Linked Incentive (DLI) Scheme, implemented by C-DAC and listed at
        chips-dli.gov.in, has three components: Chip Design Infrastructure, Product-DLI, and
        Deployment-DLI. The Product-DLI subsidy provides up to 50% of eligible expenditure with a
        ceiling of ₹15 crore per application. By July 2025, 23 chip-design projects had been
        approved (later reports cite 24), spanning surveillance, drone detection, energy metering,
        microprocessors, satellite communications and IoT SoCs. Key India-headquartered fabless
        companies include Saankhya Labs (5G SoC, satcom), Mindgrove Technologies (RISC-V 700 MHz
        Secure IoT MCU, 28 nm MPW tape-out, India’s first commercial high-performance MCU),
        InCore Semiconductors (RISC-V IP, ₹3 million Peak XV Series A), Signalchip (4G LTE and 5G
        modem chips), Ceremorphic (AI compute on 5 nm, primary-source confirmation pending).
      </p>
      <p>
        The Chips to Startup (C2S) programme, launched 2022 with a ₹250 crore outlay over five
        years, targets 85,000 industry-ready engineers, 25 startups and 10 technology transfers.
        By 2025, 46 academic institutions were participating; 122 chip designs had been submitted
        via six shared wafer runs at SCL Mohali on the 180 nm process; more than 1 lakh students
        had enrolled and approximately 67,000 had been trained. ISM 2.0 expands participating
        institutions from 315 to 500. The ChipIN Centre at C-DAC Bengaluru provides centralised
        EDA-tool access — 4,855 technical-support requests handled, 265+ industry-led training
        sessions, 270 universities equipped with EDA tools, approximately 1.2 crore tool-usage
        logs in 2025.
      </p>
      <p>
        India’s design ecosystem is real and improving, but the centre of gravity is captive
        design centres for foreign IDMs and fabless companies. The next tier — India-headquartered
        fabless with multi-product portfolios at scale — is small. The combined headcount of all
        India-headquartered fabless companies is in the low thousands, against the 60,000+
        semiconductor engineers working at foreign captives. The shift from “design talent in
        India” to “Indian design companies at scale” has not yet happened, and is the deeper
        strategic frontier than the fab itself.
      </p>

      {/* ═══════════════════════ PART IV — POWER, WATER, COOLING ═══════════════════════ */}

      <h2 id="sec-14"><span className="h2-no">14 — Framework 4</span>The AI Power and Cooling Stress Index</h2>
      <p>
        The framework introduced in this section is the AI Power and Cooling Stress Index,
        designed to quantify the binding physical constraints on data-centre and AI infrastructure
        deployment at the district level. The index has four components: peak-grid headroom (the
        gap between current peak demand and approved generation-plus-transmission capacity in the
        local grid), water-stress classification (the CGWB Ground Water Resource Assessment
        category for the district, ranging from safe through semi-critical, critical and
        over-exploited), tariff burden (the effective industrial tariff after cross-subsidy
        surcharges, additional surcharges, ToD adjustments and applicable concessions), and
        renewable-PPA accessibility (whether captive solar or wind PPAs are practical under the
        state’s open-access regime). Each component is scored 1–5, with 5 indicating the most
        stressed; the aggregate is the sum across the four components.
      </p>
      <p>
        Applied to the seven major DC districts, the index produces the following profile. Mumbai
        City and Mumbai Suburban score moderate-to-high on grid (peak summer headroom is tight
        under MSEDCL’s MYT order Case 217/2024), moderate on water, high on tariff (the HT
        industrial rate revised in July 2025 is ₹7.86/unit for 20 kW and ₹9.15/unit for higher
        loads, though MERC reduced HT cross-subsidy from 113% to 101% of ACoS), and moderate on
        RE accessibility — moderate-to-stressed net. Hyderabad/Rangareddy/Medak score moderate on
        grid (the Telangana Data Centres Policy 2024 mandates dual-grid and 100% renewable access),
        high on water (CGWB moved Hyderabad from critical to over-exploited in 2024), moderate-to-low
        on tariff, and moderate on RE — stressed on water, moderate on the rest.
      </p>
      <p>
        Bengaluru Urban/Bengaluru Rural/Ramanagara score high across the board. Grid headroom
        under BESCOM is constrained, with the 2026 True-Up adding 56 paise/unit. Water is the most
        stressed of any major DC district: CGWB classifies Bengaluru Urban as over-exploited at
        approximately 100% of recharge in 2024, and Bengaluru Rural at 169% of permissible
        extraction. Net score is the highest of any major DC district. Chennai/Tiruvallur/Kanchipuram
        score moderate net (TANGEDCO has been de-stressing; Tamil Nadu’s DC policy waives 40–50%
        of cross-subsidy surcharge and the full additional surcharge for RE-sourced power; water
        is stressed but desalination capacity is rising). Gautam Buddha Nagar (Greater Noida and
        Yamuna Expressway) scores moderate net. Ahmedabad/Gandhinagar (Sanand and Dholera) scores
        the lowest of any major industrial-corridor district — Gujarat is the most accommodating
        environment for industrial AI infrastructure at this scale. Visakhapatnam Urban is the
        special case: rising-corridor district with the lowest net stress score, structurally why
        the Visakhapatnam pipeline is plausible. The index is meant to be re-scored annually.
      </p>

      <Figure
        n={14}
        caption="AI Power and Cooling Stress Index — seven principal DC districts scored on grid, water, tariff and RE-PPA access. Bengaluru highest stress; Hyderabad water-stressed; Mumbai cost-stressed; Chennai moderate; NCR moderate; Ahmedabad/Sanand and Visakhapatnam most accommodating."
        ariaLabel="Heatmap matrix of stress index across seven DC districts and four components."
      />

      <h2 id="sec-15"><span className="h2-no">15 — Grid</span>Grid Stress: From 13 TWh to 57 TWh</h2>
      <p>
        The aggregate numbers on Indian data-centre electricity demand are accommodating; the
        disaggregated numbers are not. CEEW and S&amp;P Global estimate DC electricity demand at
        approximately 13 TWh in 2024 (0.8% of national consumption), rising to approximately 57
        TWh by 2030 (2.6%). The CEA-aligned alternative (per Outlook Business) puts the 2030
        figure at 40–45 TWh. CEA’s 20th Electric Power Survey places India’s all-India peak demand
        at 289 GW in 2026-27 and 459 GW by 2035-36. The non-fossil capacity target is 500 GW by
        2030 under India’s Nationally Determined Contribution. Inter-regional transfer capacity
        is more than 120 GW.
      </p>
      <p>
        The disaggregated reality is different. Five districts host 75% of the DC mass: Mumbai
        City, Hyderabad, Delhi NCR, Bengaluru and Chennai. A single 100 MW hyperscale DC is
        equivalent in load to a small aluminium smelter or approximately 100,000 households.
        Stacking 600 MW of new DC pipeline in Hyderabad over 36 months — roughly the scale of the
        AWS, Microsoft and CtrlS Chandan Valley commitments combined — is a load increment that
        requires substation upgrades, transmission line additions, and DISCOM-level capacity
        planning that does not happen automatically. The CEA has asked states and DISCOMs to
        explicitly incorporate DC demand into their resource adequacy plans; this is a necessary
        administrative step, but it does not by itself add transformer capacity, transmission
        lines or generation. The binding bottleneck in 2026–2030 will not be aggregate generation
        but local transmission and DISCOM-level execution.
      </p>
      <p>
        The captive-renewable-PPA route is the principal mitigant. Most major DC operators in
        India now target 80%+ renewable sourcing through open-access solar and wind PPAs. Recent
        representative deals include the Equinix-CleanMax 33 MW captive arrangement (26.4 MWp
        solar plus 6.6 MW wind, commissioned November 2025 for the Mumbai IBX), and the Digital
        Edge-Hexa Climate 83 MW PPA (signed February 2026 for the 350 MW Mumbai BOM campus in
        Navi Mumbai). The Reliance-NVIDIA Jamnagar project is the extreme case: it sits adjacent
        to a 2.4 GW captive power plant and is therefore not grid-dependent at all for its base
        load. State cross-subsidy-surcharge waivers (Tamil Nadu 40–50%, Karnataka full above 30%
        RE, Maharashtra pipeline) have made the open-access RE economics increasingly favourable.
        What the captive-RE route does not solve is the night-time inference load and the
        firm-power back-up requirement — battery storage, pumped storage, captive thermal back-up,
        and grid-firm interconnection each carry non-trivial costs.
      </p>

      <Figure
        n={15}
        caption="India data-centre electricity demand 2024–2030 vs national consumption. DC demand rises from ~13 TWh (0.8% of national) in 2024 to ~57 TWh (2.6%) in 2030 (CEEW / S&P Global). CEA national peak demand: 289 GW (2026-27) → 459 GW (2035-36). Non-fossil target 500 GW by 2030."
        ariaLabel="Trend chart of India DC electricity demand vs national consumption 2024 to 2030."
      />

      <h2 id="sec-16"><span className="h2-no">16 — Water paradox</span>The Water-Stress Paradox: Why DC Capital Lands in Water-Scarce Hubs</h2>
      <p>
        The most under-reported feature of India’s AI infrastructure build-out is the water-stress
        paradox. The data-centre pipeline is densest precisely in the cities where CGWB
        ground-water status is most stressed. Bengaluru Urban: over-exploited. Bengaluru Rural:
        169% of permissible extraction. Hyderabad: over-exploited (upgraded from critical in 2024).
        Chennai: critical (with the 2019 Day Zero as the historical reference). Greater Noida:
        critical. Sanand: semi-critical-to-critical. The paradox is structural, not accidental:
        the locational drivers of DC siting (fibre proximity, talent, industrial agglomeration,
        state policy depth) cluster in cities that are also water-stressed because they are
        population centres on stressed aquifers.
      </p>
      <p>
        The water consumption of a data centre depends on cooling architecture. Karnataka’s IT
        Minister and CEEW researchers have estimated approximately 25–26 million litres per year
        per megawatt of IT load — equivalent to roughly 68,500 litres per day per megawatt. Net
        Sol Water’s industry estimate is 1.5–2.5 litres per kWh of IT load. The Squirrels and
        CEEW report a 100 MW hyperscale facility on evaporative cooling at approximately 800,000
        litres per day — equivalent to 8,000 litres per day per megawatt. The 8× range is real,
        and reflects the cooling architecture. CEEW’s roll-up estimates total India DC water
        consumption at approximately 150 billion litres per year in 2025, projected to more than
        double to over 300 billion litres per year by 2030. Newslaundry’s April 2026 report on the
        Bengaluru DC cluster cites approximately 20 ML per day of DC water consumption, with the
        combined Bengaluru-and-Ramanagara DC permits at approximately 813 ML per year.
      </p>
      <p>
        Mitigation strategies fall into four categories. The cooling-technology transition (from
        evaporative to liquid to immersion): CtrlS Chandan Valley uses both DLC and immersion;
        Digital Connexion’s Chennai MAA10 supports up to 70 kW per rack with liquid cooling.
        Treated-wastewater sourcing: the Bengaluru KIADB park’s 60 MLD secondary-treated water
        from BWSSB is the marquee example; Hyderabad HMWS&amp;SB has explored similar arrangements.
        Captive desalination, viable only for coastal sites — Chennai DC operators draw on the
        Chennai Metro desalination plants; Visakhapatnam DCs will draw on the planned APIIC
        desalination capacity. Operator commitments to water-neutral or water-positive operations
        (AdaniConneX, Sify and others) — CEEW has flagged that these are not independently
        verified and have significant greenwash risk. The strategic implication is sharp: the
        Bengaluru DC pipeline, in particular, is exposed to a binding water constraint that
        current technology choices and treated-wastewater sourcing partially but not fully
        address. A Chennai-2019-style Day Zero event in Bengaluru in the 2027-2029 window is a
        non-trivial scenario, not a tail risk.
      </p>

      <Figure
        n={16}
        caption="The water-stress paradox — DC pipeline density vs groundwater status. Bengaluru Urban over-exploited; Bengaluru Rural at 169% of permissible extraction; Hyderabad over-exploited (2024 upgrade); Chennai critical (Day Zero 2019); Greater Noida critical; Sanand semi-critical-to-critical. Coastal Visakhapatnam is the most favourable rising-corridor district."
        ariaLabel="Map of India DC pipeline overlaid on CGWB groundwater status by district."
      />

      <h2 id="sec-17"><span className="h2-no">17 — Cooling & RE</span>Cooling Technology Transition and Captive-RE Economics</h2>
      <p>
        The cooling architecture of an AI data centre is determined by the rack power density it
        must support. A traditional enterprise-IT rack consumes 5–15 kW and is air-cooled. A
        hyperscale colocation rack consumes 10–25 kW and uses contained-aisle air cooling. An AI
        training rack hosting Nvidia H100/H200/B200 nodes consumes 35–80 kW and requires
        direct-liquid cooling. An Nvidia GB200 NVL72 rack consumes approximately 120 kW and
        requires advanced liquid cooling with high-flow CDU loops. Future GB300-class racks are
        designed for 140+ kW. AI workloads push rack density up by a factor of 4–10× compared to
        traditional IT, and the cooling architecture must follow.
      </p>
      <p>
        The implication is that the capacity numbers in this report (1.5 GW operational, 4.5–9 GW
        by 2030) understate the AI-relevant capacity. A 50 MW conventional-IT data centre with 10
        kW per rack hosts 5,000 racks; a 50 MW AI-training data centre with 80 kW per rack hosts
        approximately 625 racks. Per megawatt, the AI-training facility houses one-eighth the rack
        count but six-to-eight times the GPU count, because each rack is densely populated. The
        financial-and-revenue comparison is therefore best done at per-MW economics, not per-rack
        economics; this is why hyperscaler capital is moving toward MW-denominated capacity
        announcements rather than rack-count announcements. The cooling-architecture transition is
        currently underway across most major Indian operators: Yotta’s NM1 has migrated from air
        to liquid for its NVIDIA H100/GH200 clusters; CtrlS Chandan Valley is designed with DLC
        and immersion provision from inception; the Reliance-NVIDIA Jamnagar facility uses
        Blackwell-class architecture which requires liquid cooling end-to-end.
      </p>
      <p>
        The captive-renewable-PPA economics combine four elements: state cross-subsidy-surcharge
        waivers (Tamil Nadu 40–50%, Karnataka full above 30% RE, Maharashtra increasing, Andhra
        emerging, Telangana DC-policy provision for 100% RE access); open-access regulatory
        clarity; the cost-of-solar trajectory (Indian utility-scale solar PPAs settled at ₹2.50–3.50
        per kWh in 2025 auctions, materially below industrial-tariff rates of ₹6–9 per kWh); and
        the cost-of-wind trajectory. A captive RE PPA at the scale of 100 MW IT load is now
        economically attractive against the grid alternative even before counting any carbon or
        ESG benefits. The combination — liquid cooling, captive RE, battery storage,
        treated-wastewater sourcing, dual-site redundancy with at least one coastal site — defines
        the design profile of the next-generation Indian AI data centre. Operators who execute on
        all five elements will dominate the 2027-2030 capacity addition; those who execute on only
        two or three will retain a colocation business but will lose AI-training and
        hyperscale-inference market share to integrated competitors.
      </p>

      {/* ════════════════════════════ PART V — CORRIDORS ════════════════════════════ */}

      <h2 id="sec-18"><span className="h2-no">18 — Framework 5</span>The AI Regional Opportunity Corridors Framework</h2>
      <p>
        The framework introduced in this part is the AI Regional Opportunity Corridors — the unit
        of competitive analysis for India’s AI build-out. The seven principal corridors are:
        Bengaluru–Chennai (the services-and-electronics spine), Mumbai–Pune (the
        financial-and-data-centre core), Ahmedabad–Sanand–Dholera (the semiconductor corridor),
        Delhi–Jewar–Noida (the second OSAT pole and aviation-cargo hub), Hyderabad–Visakhapatnam
        (the hyperscaler-magnet plus rising coastal node), Coimbatore–Salem (the electronics
        Tier-2 cluster), and the GIFT-City–Surat corridor (financial-and-electronics dual track).
        The corridor is the right unit because the underlying economic relationships — supply
        chains, talent pools, fibre networks, port-and-airport access, state-policy regimes —
        operate at the multi-city level, not at the city level.
      </p>

      <Figure
        n={17}
        caption="India AI Regional Opportunity Corridors — seven principal corridors: Bengaluru–Chennai, Mumbai–Pune, Ahmedabad–Sanand–Dholera, Delhi–Jewar–Noida, Hyderabad–Visakhapatnam, Coimbatore–Salem, and GIFT City–Surat. Each combines a different mix of compute, semiconductors, manufacturing, ports, talent and energy."
        ariaLabel="Map of India highlighting seven AI opportunity corridors."
      />

      <h2 id="sec-19"><span className="h2-no">19 — Karnataka</span>Karnataka / Bengaluru: Services Capital, Water-Stressed</h2>
      <p>
        Karnataka’s policy framework is anchored by three documents: the Karnataka Industrial
        Policy 2025-30 (notified 8 February 2025), the Karnataka ESDM/Semiconductor Policy (10%
        capital subsidy and 20% subsidy on plant and machinery), and the Karnataka GCC Policy
        2024-2029 — the first dedicated GCC policy of any Indian state. The GCC policy targets
        500 new GCCs, USD 50 billion of economic output and 3.5 lakh jobs by 2029, with a ₹100
        crore Innovation Fund, an AI Centre of Excellence in Bengaluru, and a “Beyond Bengaluru”
        thrust covering Mysuru, Hubballi-Dharwad, Belagavi, Kalaburagi, Tumakuru and Shivamogga.
      </p>
      <p>
        The IT-and-services baseline is the largest in India. STPI-Bengaluru software exports were
        ₹4,53,593 crore (~USD 53 billion) in FY25, accounting for more than 45% of India’s total
        IT exports. Karnataka’s overall services-sector exports were ₹14,03,811 crore (~USD 159
        billion) with 13.7% year-on-year growth. The GCC count in Karnataka — approximately 580 —
        is the highest of any state. Operational DC capacity in Bengaluru is disputed (107 MW
        Mordor, 182 MW Cushman, 79 MW on the alternative installed-IT-load convention). The
        dominant pipeline addition is the KIADB-approved 500 MW Bengaluru data park near Hoskote;
        the combined Karnataka data-park plan across Bengaluru, Mysuru and Mangaluru is 1,000 MW
        on approximately 350 acres at Baikampady. NTT’s Bengaluru 4 announcement of December 2025
        (₹2,400 crore, 100 MW facility load / 67.2 MW IT load) is the largest single new
        commitment.
      </p>
      <p>
        The power-and-water position is the binding constraint. CGWB classifies Bengaluru Urban as
        over-exploited at approximately 100% of recharge in 2024; Bengaluru Rural is at 169% of
        permissible extraction. KERC’s Combined Tariff Order 2025 governs power tariff, with
        BESCOM levying an additional 56 paise per unit FY25 True-Up from 1 May 2026. Talent
        concentration is the strongest of any Indian corridor — IISc, IIIT-B, IIM-B, the deepest
        GCC base in India, the largest concentration of AI-product startups, and the most mature
        venture-capital ecosystem for deep-tech. The strategic outlook is therefore a trade-off.
        Karnataka has the talent, the policy depth, the GCC magnetism and the services anchor. It
        does not have the water, and increasingly does not have the grid headroom for incremental
        DC mass beyond the 500 MW Hoskote pipeline. The most likely outcome is that Karnataka
        holds and grows its services-and-design centre of gravity, that the Mangaluru coastal DC
        node becomes the principal physical-capacity expansion, and that the Bengaluru DC base
        grows incrementally rather than transformatively. The “Beyond Bengaluru” strategy is a
        tacit acknowledgement of this constraint.
      </p>

      <h2 id="sec-20"><span className="h2-no">20 — Telangana</span>Telangana / Hyderabad: The Hyperscaler Magnet</h2>
      <p>
        Telangana has emerged in the 2024-2026 window as the principal hyperscaler magnet in
        India. The Telangana Data Centres Policy 2024 mandates dual-grid power, up to 100%
        renewable access and subsidised tariffs — a package designed to convert announced capacity
        into commissioned capacity faster than any other state. The hyperscaler commitments to
        Hyderabad are the most concentrated of any Indian city. AWS announced USD 7 billion over
        14 years to expand its Hyderabad DC region. Microsoft’s Gachibowli campus — 1.1 million
        square feet, LEED-certified, announced February 2025 with ₹15,000 crore investment
        commitment and 4,800 incremental hires — is the largest Microsoft R&amp;D site outside
        the United States, and the India South Central Azure region went live in mid-2026. The
        Yotta-GoT MoU of September 2024 commits a 50 MW AI cloud DC campus in Hyderabad AI City
        with 25,000 GPUs. CtrlS’s Chandan Valley facility — 40 acres, 612 MW total IT capacity at
        Rated-4, with 250 MW Phase 1 sanctioned and 900 MW GIS provision — is the largest single
        Indian DC commitment.
      </p>
      <p>
        Operational data-centre capacity is disputed. The state government cites operational
        capacity that grew from 54 MW (2024) to 859 MW (2025); Cushman-aggregated sources cite
        152 MW operational with the rest in planned or under-construction status. By the
        convention of this report, the operational figure is 152 MW with the residual treated as
        pipeline. The 2027 pipeline (Yotta, CtrlS Phase 1, AdaniConneX Hyderabad, NTT expansions)
        plausibly takes operational capacity to 500–700 MW. The IT-services baseline is large:
        Hyderabad’s IT exports were ₹2.68 lakh crore (~USD 32.2 billion) in FY24, with a workforce
        of 9.46 lakh growing at 11.2% year-on-year.
      </p>
      <p>
        The water position is the principal constraint. CGWB upgraded Hyderabad from critical to
        over-exploited in 2024. Hyderabad’s current supply is approximately 650 MGD; the Godavari
        Phase II/III scheme (₹7,360 crore) will add 20 TMC over the medium term. The Telangana
        Godavari entitlement is 967.94 TMC, providing a structural source that Bengaluru does not
        have access to. The strategic outlook is that Hyderabad has become India’s principal
        hyperscaler destination through 2030, on the strength of its policy depth, its talent
        base, its lower-cost real estate compared to Bengaluru, and its central-Indian geography
        that gives it lower latency to the demographic centre of the country than the coastal hubs.
        The principal risk is water; the principal opportunity is to anchor not just hyperscale
        DCs but the AI-services and chip-design talent ecosystem that increasingly clusters around
        the GCC tenants.
      </p>

      <h2 id="sec-21"><span className="h2-no">21 — Tamil Nadu</span>Tamil Nadu / Chennai–Coimbatore: Electronics Manufacturing Meets Coastal Compute</h2>
      <p>
        Tamil Nadu’s policy framework is anchored by the Tamil Nadu Semiconductor and Advanced
        Electronics Policy 2024 (released January 2024 at the Global Investors Meet, targeting a
        skilled talent pool of 200,000 by 2030), and the Tamil Nadu Electronics Hardware
        Manufacturing Policy 2020 (USD 100 billion output target by 2025). The Tamil Nadu GCC
        payroll-subsidy scheme (announced 19 February 2024, effective April 2024 through March
        2027) provides 30%, 20% and 10% payroll subsidy in Years 1, 2 and 3 for roles exceeding ₹1
        lakh per month at Forbes Global 2000 or Fortune 1000 firms with at least 200 employees.
      </p>
      <p>
        The electronics-manufacturing baseline is the strongest of any Indian state. Tamil Nadu’s
        electronics exports were USD 14.65 billion in FY25 — the highest of any Indian state,
        ahead of Karnataka’s USD 7.8 billion and Uttar Pradesh’s USD 5.26 billion. Foxconn’s
        Sriperumbudur operations recorded revenue exceeding USD 20 billion (₹1.7 lakh crore) in
        FY25 alone, with iPhone exports to the US of USD 4.4 billion in the first five months of
        CY2025. Pegatron, Tata-Wistron and the Ola Electric facility complete the manufacturing
        cluster. (A note on a common misattribution: there is no Micron facility in Chengalpattu
        or anywhere else in Tamil Nadu. Micron’s India OSAT is exclusively at Sanand, Gujarat.)
      </p>
      <p>
        The data-centre capacity in Chennai is the second-largest in India. The total Chennai DC
        market was approximately 202 MW operational in 2025 (Mordor estimate), projected to 551
        MW by 2030 at a 22% CAGR. The Ambattur cluster hosts STT Chennai 2 (25.5 MW IT load),
        STT Chennai 3 (15 MW), NTT (34.8 MW), the Digital Connexion JV — Reliance, Brookfield and
        Digital Realty — with MAA10 at 100 MW campus capacity (20 MW Phase 1 live January 2024,
        supporting up to 70 kW per rack), Iron Mountain CHN-1 at 23 MW, and the Blackstone Lumina
        Cloud Infra facility at 216 MW initial. The Siruseri-SIPCOT cluster hosts STT Chennai 7,
        Sify hyperscale at 130+ MW, and the STT new campus at 50 MW. Coimbatore as the Tier-2
        cluster has more than 50 GCCs, more than 11,000 GCC professionals, with approximately 60%
        focused on engineering R&amp;D.
      </p>
      <p>
        The water position is constrained — Chennai’s 2019 Day Zero remains the binding historical
        reference. The strategic outlook is that Tamil Nadu combines four advantages no other
        state matches: the highest electronics-manufacturing depth, coastal submarine-cable access
        at Chennai, a deep Tier-2 industrial R&amp;D ecosystem in Coimbatore, and a policy
        framework that is both targeted (the GCC payroll subsidy) and broad (the 2024 semiconductor
        policy). Tamil Nadu’s most likely 2030 outcome is to be the second coastal compute hub
        (after Mumbai-Navi Mumbai) and the dominant electronics-manufacturing-plus-AI integration
        centre.
      </p>

      <h2 id="sec-22"><span className="h2-no">22 — Maharashtra</span>Maharashtra / Mumbai–Pune–Navi Mumbai: India’s Largest DC Mass</h2>
      <p>
        Maharashtra holds approximately 44% of India’s data-centre capacity, concentrated in Navi
        Mumbai. The state’s policy framework is anchored by the Maharashtra IT-ITES Policy 2023
        (assured 24×7 DISCOM supply, RE incentives, dedicated DC land zones) and the Maharashtra
        GCC Policy 2025 notified in November 2025. Navi Mumbai is the centre of mass — operational
        capacity is approximately 289 MW across 3.6 million square feet. Yotta’s NM1 (Panvel) at
        Tier IV has 7,000 racks and 52 MW operational, with a full park plan of five buildings,
        30,000 racks and 160 MW; AdaniConneX Mumbai (Mahape) at 100 MW design; and NTT NAV2 Navi
        Mumbai at a 500 MW announcement scale. AWS’s Mumbai region was the original India region,
        with the USD 8.3 billion January 2025 expansion taking cumulative India spend to USD 12.7
        billion through 2030.
      </p>
      <p>
        Pune-Hinjewadi is the second pole. Rajiv Gandhi Infotech Park Hinjewadi covers 2,800 acres
        across Phases I–III and hosts more than 800 companies. Pune hosts approximately 24–25% of
        India’s GCCs (about 400 centres). The Pune GCC pipeline is 400+ new GCCs planned over
        five years, with approximately 55% of Pune office leasing being GCC-led in FY26.
        Aurangabad-Sambhajinagar — a Delhi-Mumbai Industrial Corridor node — is the third pole.
        AURIC (Shendra-Bidkin Industrial City) has cumulative investment of approximately ₹6,500
        crore with expected employment of 7.5 lakh.
      </p>
      <p>
        The power tariff position is governed by MERC’s MYT Order Case 217/2024 for the FY26-FY30
        Fifth Control Period. The HT industrial tariff revised in July 2025 is ₹7.86/unit for 20
        kW and ₹9.15/unit for higher loads. MERC reduced the HT cross-subsidy from 113% to 101%
        of ACoS in FY26, with a further 4% annual reduction through FY30 — a structural softening
        of the industrial-tariff burden. The strategic outlook is that Maharashtra has the largest
        installed DC base, the deepest submarine-cable connectivity at Mumbai (eight CLS), the
        most established financial-services concentration, and the strongest secondary GCC
        concentration at Pune. The pipeline through 2030 plausibly takes the state to 1,500+ MW
        of operational capacity. The likely 2030 share of national DC capacity remains in the
        35–40% band — slightly lower than today as Hyderabad and Visakhapatnam grow — but in
        absolute terms the addition is large.
      </p>

      <h2 id="sec-23"><span className="h2-no">23 — Gujarat</span>Gujarat: The Semiconductor State</h2>
      <p>
        Gujarat is the only Indian state with a major semiconductor fab. The Gujarat Semiconductor
        Policy 2022-27 layers a 40% additional state subsidy on top of the central capex
        assistance (effectively raising the total fiscal-support ratio to approximately 70%), with
        100% stamp-duty reimbursement, a ₹2-per-unit power tariff subsidy for ten years, water at
        ₹12 per cubic metre for five years, and 50% land subsidy. The policy is the most aggressive
        in India for industrial-investment attraction, and the semiconductor cluster at
        Sanand-and-Dholera is the result. The Tata Electronics–PSMC fab at Dholera and the Sanand
        OSAT cluster (Micron USD 2.75 billion, CG Semi ₹7,600 crore, Kaynes ₹3,307 crore, Suchi
        Semicon, Crystal Matrix) represent the densest concentration of semiconductor
        manufacturing investment in India. Cumulative Gujarat-semi-cluster capex announced is
        approximately ₹1.25 lakh crore (USD 15 billion).
      </p>
      <p>
        GIFT City has 1,034+ registered entities, 38 banks with USD 100.14 billion in assets,
        150+ capital-markets intermediaries, 194 Fund Management Entities and 310 schemes as of
        2025. Ports are a major economic anchor — Mundra recorded 17.6 million tonnes of cargo in
        Q1 FY25, with DP World Mundra handling 138,000 TEUs in January 2025 and a planned 8
        million TEU capacity by 2026; Hazira handles approximately 27 million tonnes annually.
        The combination gives Gujarat the deepest port capacity of any Indian industrial state,
        operationally relevant because gases, chemicals, equipment and silicon wafers all transit
        through these ports. The strategic outlook is that Gujarat is the semiconductor state, the
        most accommodating industrial-investment environment in India, and an emerging
        logistics-and-port hub. The principal weakness is the absence of a major AI-services
        talent base. The base case is that Gujarat dominates Indian semiconductor manufacturing,
        supplies RE to the Mumbai DC cluster, and remains a junior partner in AI services through
        the period of this report.
      </p>

      <h2 id="sec-24"><span className="h2-no">24 — NCR / UP</span>NCR / Uttar Pradesh: The Second OSAT Pole</h2>
      <p>
        The Uttar Pradesh and Delhi NCR corridor has transformed in the 2024-2026 window from an
        established electronics-manufacturing region to a serious semiconductor-and-data-centre
        destination. The HCL-Foxconn OSAT at Jewar/YEIDA — ₹3,706 crore, 20,000 WSPM front-end /
        36 million units per month design output, focused on display driver ICs — approved 14 May
        2025 is the sixth ISM unit and the first semiconductor unit in Uttar Pradesh. The
        Electronic Manufacturing Cluster (EMC 2.0) at Gautam Buddha Nagar/YEIDA has ₹417 crore
        project cost, 200 acres, expected to attract ₹2,500 crore investment with 15,000 jobs.
        Uttar Pradesh’s electronics exports were USD 5.26 billion in FY25, the third-highest among
        Indian states, with consumer electronics the dominant category (approximately ₹37,000
        crore in FY24, making UP India’s largest consumer-electronics exporter).
      </p>
      <p>
        The Jewar Noida International Airport — inaugurated by the Prime Minister on 28 March 2026
        with DGCA aerodrome licence on 6 March 2026 — is the single largest infrastructure
        addition in the corridor. The AISATS cargo hub starts at 250,000 metric tonnes per year
        and is expandable to 1.8 million metric tonnes per year. The proximity to the HCL-Foxconn
        OSAT, to EMC 2.0, and to the existing Noida-Greater Noida-Yamuna Expressway electronics
        belt makes Jewar the logistics anchor for the corridor. Approximately 31 DCs operate today
        across Greater Noida, Manesar, and the Yamuna Expressway corridor. The talent base is
        large at aggregate scale but qualitatively different from Bengaluru-Chennai: NCR’s depth
        is in financial services, public-sector technology, ed-tech, e-commerce, and increasingly
        in fundamental AI research (IIT-Delhi’s Yardi School of AI, IIIT-Delhi, Ashoka University).
        The strategic outlook is that the NCR-UP corridor becomes the second OSAT pole, the
        principal e-commerce and fintech AI deployment cluster, and a logistics-anchor for the
        wider north-Indian industrial belt.
      </p>

      <h2 id="sec-25"><span className="h2-no">25 — Visakhapatnam</span>Andhra Pradesh / Visakhapatnam: The Third Coastal Node</h2>
      <p>
        Andhra Pradesh is the dark-horse corridor of this report. The AP Electronics Manufacturing
        Policy 4.0 (2024-29) and the AP Semiconductor and Display Fab Policy 4.0 are in force.
        ASIP Technologies in Andhra Pradesh was approved on 12 August 2025 as part of a four-project
        ISM tranche worth ₹4,600 crore cumulative. The single most consequential commitment is the
        AdaniConneX Visakhapatnam project: initial scope is a 200 MW data-centre campus in
        Madhurawada (one of three planned tech zones), scaling to a 1 GW AI-ready capacity, with
        total Adani Group investment of approximately USD 10 billion (₹83,000 crore). The
        associated Google AI hub at Visakhapatnam — approximately USD 15 billion across 2026–2030,
        including gigawatt-scale DC, subsea cable and clean energy — was announced October 2025
        with groundbreaking April 2026. A 100% renewable energy commitment is part of the park
        design.
      </p>
      <p>
        The combination positions Visakhapatnam as India’s third coastal node for AI infrastructure.
        The strategic significance is geographic diversification: the current 71% concentration of
        submarine-cable capacity at Mumbai and Chennai is the single largest geographic risk to
        Indian AI infrastructure. Visakhapatnam shifts this concentration meaningfully. The
        Sify-led Open CLS at Visakhapatnam is the regulatory-and-physical foundation; the
        Google-Adani demand-side commitment is the economic foundation. The Sricity industrial
        cluster — a separate physical site in AP — adds an electronics-and-light-manufacturing
        layer, securing ₹11,750 crore at the 2025 CII Partnership Summit (cumulative ₹20,250 crore
        across 43 MoUs and approximately 1 lakh jobs).
      </p>
      <p>
        The power-and-tariff position is favourable. APERC’s FY26 tariff order held rates flat
        for the year, with the Government of Andhra Pradesh providing a ₹12,632.40 crore subsidy.
        The water position is the most favourable of any rising-corridor district: Visakhapatnam
        is coastal, with potential for captive desalination; CGWB stress classifications are
        relatively benign. The strategic outlook is that AP/Visakhapatnam becomes the fastest-rising
        corridor in India for AI infrastructure through 2030. The bet is concentrated and binary —
        if the Google-Adani project executes on schedule, AP is transformed from a Tier-2
        industrial state into a strategic AI-coastal hub; if the project slips, the trajectory is
        more incremental. The AP corridor is, in this report’s view, the single most important
        capital-allocation story of the 2026–2030 window for incremental India AI capacity.
      </p>

      <Figure
        n={18}
        caption="State-by-state snapshot — endowments and binding constraints across the seven AI corridors: Karnataka (talent rich, water poor), Telangana (hyperscaler magnet, water stressed), Tamil Nadu (electronics + coastal-fibre), Maharashtra (largest DC mass, cost-pressured), Gujarat (semiconductors, no AI-services depth), NCR/UP (second OSAT + Jewar cargo), AP (third coastal node, rising fastest)."
        ariaLabel="Comparison table summarising endowments and binding constraints across seven corridors."
      />

      {/* ══════════════════════ PART VI — SECOND-ORDER EFFECTS ══════════════════════ */}

      <h2 id="sec-26"><span className="h2-no">26 — Framework 6</span>The AI Industrial Dependency Map</h2>
      <p>
        The framework introduced in this section is the AI Industrial Dependency Map — a
        directional flow chart of upstream and downstream economic effects radiating outward from
        the AI infrastructure layer. The map distinguishes four concentric rings. The first ring
        is the direct supply chain of AI infrastructure construction and operation: data-centre
        civil construction (L&amp;T-class EPCs, MEP specialists), high-tension transformers and
        switchgear (BHEL, Siemens India, ABB India), industrial chillers and cooling systems,
        ultrapure water systems, fibre and structured cabling, security and access systems,
        diesel back-up generators, battery storage systems, fire suppression. The second ring is
        the operational ecosystem: DCIM software and operations, security operations centres,
        network operations centres, hands-and-feet technician workforce, hardware refresh
        logistics, e-waste recycling, specialist legal and regulatory advisors.
      </p>
      <p>
        The third ring is the application-layer demand created by AI deployment in Indian
        industry: industrial automation (Section 27), pharma and life sciences (Section 27),
        logistics (Section 28), real estate and construction (Section 29), MSME digitisation
        (Section 30), agriculture and retail. This is where the macroeconomic value-add is
        created. The compute layer makes the application layer possible; the application layer
        pays for the compute layer; the cycle scales. The fourth ring is the second-order labour
        and consumption multiplier: skilled-worker wages flowing back into housing, education,
        healthcare and consumer goods in the corridor cities; corporate-tax flowing back into
        state-level public investment. The multiplier coefficient in Indian metropolitan economies
        (3.0–4.5 by NIPFP and IMF estimates for high-skill services) is among the highest of any
        industrial activity.
      </p>
      <p>
        The map is directional: capital flows inward through the first and second rings, value
        flows outward through the third and fourth rings, and the labour-and-tax loops close back
        to the corridor. Understanding this map is the key to seeing why the strategic competition
        between Indian states (Part V) is more consequential than national-aggregate analysis
        would suggest: the corridor that captures the second-and-third-ring depth captures most
        of the value, while the corridor that hosts only the first ring (the DC mass itself)
        captures meaningfully less.
      </p>

      <Figure
        n={19}
        caption="AI Industrial Dependency Map — four concentric rings of economic effect. Inner: direct supply chain (EPC, transformers, chillers, UPW, fibre). Second: operational ecosystem (DCIM, NOC/SOC, hands-and-feet, regulatory). Third: application-layer demand (industrial AI in manufacturing, pharma, auto, BFSI, logistics, MSME). Outer: second-order labour-and-consumption multiplier."
        ariaLabel="Concentric-ring diagram of AI industrial dependency map across four economic layers."
      />

      <h2 id="sec-27"><span className="h2-no">27 — Industrial AI</span>Industrial AI in Manufacturing, Pharma, Auto</h2>
      <p>
        The CII-Protiviti AI Trends and Future Impact 2025 survey of approximately 300 senior
        leaders across healthcare, BFSI, manufacturing, automotive, transport, telecom and
        aviation reports that 59% of Indian enterprises consider themselves fully or moderately
        prepared to implement AI. The EY-CII report of November 2025 finds that 47% of Indian
        enterprises have multiple Generative AI use cases live in production and a further 23%
        in pilot. EY’s GCC Pulse Survey 2025 finds that 58% of Indian GCCs are investing in
        agentic AI, with 29% planning to do so in the next twelve months, and 83% scaling
        Generative AI deployment.
      </p>
      <p>
        The automotive sector is the most visible. Tata Motors has publicly committed to using AI
        to compress vehicle-development cycles from 4.5 years to 26 months, with a target of
        reskilling more than 50% of the workforce in new-age automotive technologies over five
        years. TAL Manufacturing, a Tata-group robotics supplier, has supplied industrial robots
        to Tata Motors (2 units), Bosch (5 units) and Mahindra &amp; Mahindra (15 units) for
        sealant application and machine-tending. The pharma sector has been moving more slowly
        but with sharper specific bets — Pharma 4.0 covers smart manufacturing, AI-assisted drug
        discovery, AI patient support, and AI-enabled regulatory and quality systems. Sun Pharma,
        Cipla, Dr Reddy’s Laboratories, Lupin, Aurobindo and Biocon are the named leaders. The
        PLI Bulk Drugs scheme launched Penicillin-G and Clavulanic Acid greenfield production in
        2024 — the supporting process-control, quality and supply-chain layers are AI-instrumented
        from inception.
      </p>
      <p>
        The manufacturing-broadly category is where the picture is most uneven. Tier-1 OEMs
        (auto, electronics, pharma, large engineering) have deployed AI in production-and-process;
        Tier-2 and Tier-3 suppliers have not. The CII Manufacturing Survey 2024 finds that
        approximately 45% of SMEs cite budget constraints as the primary barrier to
        smart-manufacturing technology. The aggregate AI deployment story in Indian industry is
        one of two-speed adoption: Tier-1 corporations and GCCs are in production-scale deployment;
        Tier-2 suppliers and MSMEs are in pilot-or-not-yet phases. The macroeconomic AI value-add
        in India through 2030 will come disproportionately from the first segment, with the
        second segment as the strategic opportunity for the second half of the decade.
      </p>

      <Figure
        n={20}
        caption="Industrial AI Adoption Readiness Curve — sectoral S-curves to 2035: BFSI and IT-services GCCs ahead of the curve; auto/pharma in production-scale rollout; manufacturing broadly two-speed; agriculture and retail rural/MSME tail laggard. Two-speed adoption defines the macroeconomic value distribution through 2030."
        ariaLabel="S-curve adoption chart by industry sector through 2035."
      />

      <h2 id="sec-28"><span className="h2-no">28 — Logistics</span>Logistics Modernisation: Gati Shakti, KAVACH, DFC</h2>
      <p>
        The logistics modernisation programme is a separate but increasingly AI-instrumented
        industrial transformation. The principal anchors are the PM Gati Shakti National Master
        Plan, the Indian Railways KAVACH train collision-avoidance system, the Dedicated Freight
        Corridors, and the National Logistics Policy 2022. PM Gati Shakti has evaluated 352
        projects worth ₹16.10 lakh crore through the Network Planning Group, with 201 sanctioned
        and 167 in implementation as of February 2026. The Union Budget 2025 opened selective
        private-player access to the Gati Shakti portal data with DPIIT framing secure-access
        rules.
      </p>
      <p>
        KAVACH 4.0 has been commissioned on 1,452 route-kilometres of the Delhi-Mumbai and
        Delhi-Howrah corridors. Indian Railways has optimised KAVACH across more than 34,000 km,
        with a target of 44,000 km in five years. The infrastructure to date includes 8,570 km of
        optical fibre cable laid, 1,100 telecom towers, 6,776 route-kilometres of trackside
        equipment, 767 station data centres, and 4,154 locomotives equipped. KAVACH on the DFC
        covers a 931-km double-line section from New Boraki to Khurja to Bhaupur to Unchdih to
        Sonnagar. DFC traffic has grown from 247 trains per day in FY24 to 371 per day in February
        2025. The National Logistics Policy 2022 targets a top-25 Logistics Performance Index
        ranking by 2030; India’s LPI rank improved from 44 (2018) to 38 (2023). ULIP had more than
        30 systems integrated and 160+ crore digital transactions as of August 2025; the Logistics
        Data Bank has tracked 75 million+ EXIM containers across 101 inland container depots.
      </p>
      <p>
        The AI overlay operates through three principal mechanisms. Route and asset optimisation
        at the operator level (Delhivery, BlueDart, Maersk India, DP World India, Adani Ports,
        Container Corporation of India). Predictive maintenance and safety (KAVACH and the
        DFCCIL AI safety system). Fraud-and-anomaly detection at customs and the GST layer. The
        logistics modernisation programme is the most institutionally-anchored AI-deployment
        programme in India, with substantial cross-ministry coordination, and is the area where
        AI’s contribution to Indian GDP can be most explicitly tracked.
      </p>

      <h2 id="sec-29"><span className="h2-no">29 — Real estate</span>Real Estate and Construction Second-Order Demand</h2>
      <p>
        The construction of an AI data centre, semiconductor fab or OSAT facility creates demand
        for industrial real estate, construction labour, electrical and mechanical equipment, and
        supply-chain logistics that ripples through adjacent sectors. The CBRE India Data Centre
        Market Update places operational DC stock at approximately 1,530 MW / 23 million square
        feet as of 9M 2025, with 260 MW added during the year and approximately 475 MW under
        construction. Cumulative investment commitments from 2019 to 9M 2025 are approximately
        USD 94 billion. The Colliers projection takes India’s live DC capacity from 1,263 MW in
        2024 to 4,500 MW by 2030, requiring approximately 50 million square feet of additional
        real estate, predominantly for AI-driven workloads.
      </p>
      <p>
        The Knight Frank India Warehousing Report tracks broader industrial-and-warehousing
        leasing. CY2024 leasing was 56 million square feet (a 12% year-on-year increase across the
        top eight cities), with a Grade-A share of 62%. CY2025 transactions were 72.5 million
        square feet (a 29% year-on-year increase), with a Grade-A share of approximately 63%.
        Manufacturing absorbed approximately 47% of total warehousing in 2025 (around 34 million
        square feet, a 55% year-on-year increase). The shift toward Grade-A and toward
        manufacturing-anchor demand is a direct consequence of the PLI build-out, the GCC
        expansion, and the e-commerce-warehousing scale.
      </p>
      <p>
        The combined real-estate-and-construction second-order demand from AI infrastructure
        through 2030 includes: approximately 50 million square feet of DC-specific real estate;
        approximately 200–300 million square feet of warehousing for the GCC-and-manufacturing-and-e-commerce
        ecosystem; approximately 30–50 million square feet of new GCC office absorption (Pune,
        Bengaluru, Hyderabad, Chennai); and the construction-labour intensity associated with
        each. The Indian construction sector employs approximately 70 million workers; the
        AI-and-industrial-build-out cycle is a meaningful demand driver for that workforce.
      </p>

      <h2 id="sec-30"><span className="h2-no">30 — MSMEs</span>MSME Transformation: ONDC, Udyam, AI Adoption</h2>
      <p>
        The MSME segment is approximately 30% of India’s GDP and approximately 60% of India’s
        manufacturing employment. As of 28 February 2026, 7.83 crore enterprises were registered
        on the Udyam Portal and the Udyam Assist Platform, with employment of 34.63 crore. The
        cumulative growth has been steep: FY22 0.79 crore → FY23 1.64 crore → FY24 4.12 crore →
        FY25 6.19 crore → February 2026 7.83 crore. The 2.86 crore women-led MSMEs (as of 30
        November 2025) are a substantial share. The MSME thresholds were revised effective 1
        April 2025 (micro: investment ₹2.5 crore / turnover ₹10 crore; small: ₹25 crore / ₹100
        crore; medium: ₹125 crore / ₹500 crore).
      </p>
      <p>
        The Open Network for Digital Commerce (ONDC) is the principal AI-and-data infrastructure
        for MSME digital commerce. ONDC’s transaction layer has scaled materially through 2025-2026,
        and the underlying recommendation, search, fraud-prevention and matching layers are
        AI-driven. The MSE Team initiative within the Ministry of MSME has committed to onboarding
        500,000 micro-and-small enterprises (including 250,000 women-owned MSEs) onto ONDC. The
        deployment of AI inside Indian MSMEs is at a much earlier stage. The constraint is the
        cost-of-deployment for capex-intensive automation, the absence of AI-skilled staff, and
        the digital infrastructure gap. No publication-grade national survey of MSME AI adoption
        exists at the level of granularity needed for policy targeting. This is a data gap.
      </p>
      <p>
        The directional argument is that MSME AI deployment through 2030 will be platform-mediated
        rather than capex-led. The platform layer — ONDC for commerce, Udyam for identity, TReDS
        for finance, GSTIN for tax, DigiLocker for documents — provides the substrate on which AI
        services can be delivered to small businesses at zero or near-zero per-transaction cost.
        The companies that will dominate MSME AI delivery are the platform operators (NPCI, ONDC,
        Razorpay, Pine Labs, BharatPe), the GCCs of the major banks (HDFC, ICICI, SBI, Axis), and
        the new wave of small-business-SaaS providers (Zoho, Khatabook, OkCredit). The MSME
        segment is the principal channel through which the AI transition will reach the bottom
        half of the Indian distribution of households. The productivity uplift to MSMEs (1–3
        percentage points of GDP over the decade) is the largest single channel through which AI
        improves Indian living standards if platform-mediated delivery scales as projected — and
        the segment where the productivity divide widens fastest if it underdelivers.
      </p>

      <h2 id="sec-30a"><span className="h2-no">30A — Opportunity surfaces</span>Quantified Opportunity Surfaces: The Industrial Markets AI Creates</h2>
      <p>
        This section converts the second-order industrial effects into quantified opportunity
        surfaces — the addressable Indian market sizes for the specific industrial segments AI
        infrastructure expansion creates. <strong>Industrial cooling and HVAC for AI
        infrastructure</strong>: cumulative addressable through 2030 is USD 0.9–4.3 billion
        (₹7,500–36,000 crore); Indian-vendor share (Voltas, Blue Star, Carrier-Midea India, Eureka
        Forbes Industrial, Thermax) plausibly 35–55% by 2030, implying ₹3,000–15,000 crore for
        Indian HVAC and chiller manufacturers. <strong>Semiconductor-grade specialty gases</strong>:
        by 2032, plausibly USD 600–900 million per year (₹5,000–7,500 crore) total India market,
        of which Indian-capture share (Linde India, Inox Air Products) is 40–55% — ₹2,000–4,000
        crore per year by 2032.
      </p>
      <p>
        <strong>Edge AI infrastructure deployment</strong>: 30–50 Tier-2 Indian cities hosting 1–5
        MW edge AI points-of-presence by 2030, totalling 100–300 MW. Capex per MW is higher than
        hyperscale (USD 12–18 million per MW). Cumulative addressable USD 1.2–5.4 billion
        (₹10,000–45,000 crore) — the most accessible category to Indian system integrators and
        Tier-2-city MSP firms. <strong>AI-enabled industrial automation</strong>: Indian market
        was ~USD 4.5 billion in 2024 (CII / ISA / FICCI roll-ups), projected to USD 12–18 billion
        by 2030 at 17–22% CAGR. Indian-vendor share (TAL Manufacturing, Asteria Aerospace, Ati
        Motors, Addverb, GreyOrange, Forge Robotics) plausibly 25–40% — implied Indian supplier
        opportunity USD 3.0–7.2 billion (₹25,000–60,000 crore) cumulative through 2030.
      </p>
      <p>
        <strong>Cleanroom systems and precision construction</strong>: cumulative Indian
        semiconductor cleanroom demand 2026–2032 is USD 2–4 billion; Indian system integrators
        (Praj Industries, L&amp;T, Tata Projects, Macawber Beekay, Astha Cleantech) participate
        at 30–50% — ₹5,000–15,000 crore opportunity. <strong>Power conditioning and DC-side
        electrical equipment</strong>: cumulative USD 3–6 billion (₹25,000–50,000 crore), Indian
        capture 40–60% (BHEL, Crompton Greaves, Bharat Bijlee, ABB India, Siemens India,
        Schneider Electric India). <strong>Specialty industrial software and platforms</strong>:
        from ~USD 800 million (2024) to USD 3–5 billion by 2030; Indian-vendor capture ~50–65%
        (Tata Elxsi, Cyient, L&amp;T Technology Services, Tech Mahindra Industrial, KPIT, Faclon
        Labs and others) — ₹12,000–25,000 crore opportunity. <strong>Fibre deployment and
        structured cabling</strong>: cumulative USD 2–4 billion (₹17,000–33,000 crore), Indian
        capture 70–85% (Sterlite Technologies, Aksh Optifibre, Polycab, KEI Industries, Vindhya
        Telelinks, Birla Cable).
      </p>

      <Figure
        n={21}
        caption="Capital flow — from announced capex (USD 95B DC + ₹1.65 LC ISM) through infrastructure layers (compute, semiconductors, power, water, cooling, fibre) to economic beneficiaries (Indian EPCs, vendors, GCCs, services firms, MSMEs). Aggregate Indian-vendor opportunity 2026–2030: ₹80,000–150,000 crore; SME-addressable subset: ₹28,000–60,000 crore across three accessibility tiers."
        ariaLabel="Sankey-style flow diagram from announced capex to Indian beneficiaries."
      />

      <div className="pull-stat">
        <div className="ps"><div className="n">₹80–150 KCR</div><div className="l">Aggregate Indian-vendor opportunity 2026–2030</div></div>
        <div className="ps"><div className="n">₹28–60 KCR</div><div className="l">SME-addressable subset, three tiers (Ready / 24-month build / partnership)</div></div>
        <div className="ps"><div className="n">8 segments</div><div className="l">Cooling, gases, edge AI, automation, cleanrooms, electricals, software, fibre</div></div>
      </div>

      <p>
        The aggregate Indian-vendor opportunity from the second-order industrial AI infrastructure
        cycle through 2030 — the sum of the eight categories above — is approximately
        ₹80,000–150,000 crore (USD 10–18 billion) cumulative through 2030. This is approximately
        0.6–1.0% of cumulative Indian industrial-sector capex over the same period, but is
        concentrated in a small number of vendor categories where the Indian competitive position
        is real and improving. The strategic implication for Indian industrial firms — particularly
        mid-tier and SME firms with the right adjacencies — is that the AI infrastructure cycle is
        the largest single addressable opportunity of the decade for industrial equipment and
        services. Where they sit in this opportunity stack is the subject of the SME Opportunity
        Stack (Tier 1 — Ready now, low capital, short cycle, ₹8,000–15,000 crore; Tier 2 — Build
        within 24 months, medium capital, ₹12,000–25,000 crore; Tier 3 — Build through partnership,
        high technology, multi-year cycle, ₹8,000–20,000 crore).
      </p>

      {/* ═══════════════════════ PART VII — WORKFORCE & TALENT ═══════════════════════ */}

      <h2 id="sec-31"><span className="h2-no">31 — Framework 8</span>The Talent Stack: Design, Infrastructure, Application, Governance</h2>
      <p>
        The framework introduced in this section is the Talent Stack — a four-layer decomposition
        of the workforce an AI economy requires. The framework replaces the workforce-as-list-of-twenty-careers
        approach with a structural view of where talent is needed, what it does, and where India
        is in supplying it. <strong>Layer one is design talent</strong>: the workforce that designs
        AI accelerators (chip architects, RTL designers, verification engineers, physical-design
        engineers, EDA-tool specialists), AI models (ML researchers, model architects, LLM
        engineers, computer-vision specialists, RL specialists), and AI systems (compiler engineers,
        runtime engineers, distributed-systems specialists). India has approximately 60,000
        semiconductor design engineers and approximately 100,000–150,000 ML/AI design engineers,
        concentrated in Bengaluru, Hyderabad, Noida, Pune, and Chennai.
      </p>
      <p>
        <strong>Layer two is infrastructure talent</strong>: data-centre construction engineers,
        MEP specialists, ultrapure water specialists, power-electronics engineers, DCIM operations
        engineers, network engineers, cybersecurity specialists, MLOps engineers, AIOps engineers,
        platform-reliability engineers, cloud-native specialists. Current count: 200,000–300,000
        across major operators; 2030 requirement: 700,000–1,000,000. <strong>Layer three is
        application talent</strong>: industrial-automation engineers, healthcare-AI specialists,
        fintech-and-banking AI specialists, retail-and-e-commerce ML practitioners, agricultural-AI
        specialists, edu-tech, legal-tech. Approximately 500,000–800,000 today; plausibly 2–3
        million by 2030. The largest by headcount, the most distributed geographically, deployed
        wherever the underlying industries operate. <strong>Layer four is governance talent</strong>:
        AI ethicists, AI policy specialists, AI risk-and-governance officers, AI auditors, AI
        safety researchers, AI regulatory affairs specialists, legal-tech compliance specialists.
        The smallest today (in the low thousands), fastest-growing in percentage terms; demand by
        2030 may be 100,000–200,000.
      </p>
      <p>
        The framework is useful because the demand-supply dynamics at each layer are different, the
        educational requirements are different, the career-progression paths are different, and the
        policy interventions that scale supply are different. India is structurally strong at the
        design layer (the deep IIT-and-IISc graduate base, the captive design centres of foreign
        IDMs, the growing fabless ecosystem). India has a credible base at the infrastructure layer
        (the IT-services workforce can be re-skilled into MLOps and AIOps). India has the largest
        opportunity at the application layer (the breadth of Indian industry creates demand across
        automotive, pharma, financial services, retail, logistics, agriculture). India is weakest
        at the governance layer.
      </p>

      <Figure
        n={22}
        caption="The four-layer Talent Stack — design (60,000 semi + 100,000–150,000 AI; deepest), infrastructure (200,000–300,000 today → 700,000–1,000,000 by 2030; re-skillable), application (500,000–800,000 → 2–3 million; largest cohort), governance (low thousands → 100,000–200,000; weakest layer). India strongest at design; weakest at governance."
        ariaLabel="Four-layer talent stack pyramid showing India's depth at each AI workforce layer."
      />

      <h2 id="sec-32"><span className="h2-no">32 — GCC</span>The GCC Explosion as the New IT-Services</h2>
      <p>
        India hosts approximately 1,700 Global Capability Centres today, with approximately 2.5
        million professionals and approximately USD 64.6 billion in annual revenue (NASSCOM India
        GCC Landscape Report). NASSCOM’s working target for 2030 is approximately 2,100+ GCCs. The
        aspirational EY and Deloitte commentary projects a 1,800-to-5,000 GCC range with 20–25
        million jobs (5 million direct), GDP contribution of USD 470–600 billion, and a market
        size of USD 100 billion. The lower bound of the NASSCOM target is the credible policy
        benchmark; the EY-Deloitte vision is the upside case.
      </p>
      <p>
        The 2024-2025 year added approximately 110 new GCCs to India. 58% of Indian GCCs are
        investing in agentic AI, 29% planning to do so in the next twelve months, and 83% scaling
        Generative AI deployment (EY GCC Pulse Survey 2025). 120,000+ AI/ML professionals work
        inside GCCs, with 185+ AI/ML Centres of Excellence. The largest individual GCCs are not
        in technology firms but in financial services. JPMorgan Chase’s India GCC has more than
        55,000 employees — the largest GCC employer in India. Wells Fargo India has approximately
        37,000 professionals. Goldman Sachs India has approximately 9,000 employees across
        Bengaluru and Hyderabad. Accenture’s global headcount of 779,000 in FY25 includes a large
        India component.
      </p>
      <p>
        The state-level GCC policies are diverging. Karnataka’s GCC Policy 2024-29 targets 500
        new GCCs, 350,000 jobs, USD 50 billion output, with 50% stipend reimbursement, 20%
        skilling reimbursement, and a “Beyond Bengaluru” thrust. Tamil Nadu’s GCC payroll subsidy
        provides 30%, 20% and 10% payroll subsidy in Years 1, 2 and 3. Maharashtra’s GCC Policy
        2025 reserves 10% of MIDC new estates for GCC units through FY29-30. The strategic
        significance is that the GCC explosion is the principal channel through which Indian
        high-skill employment is growing while traditional IT-services employment shrinks.
        Combined Tier-1 IT-services headcount (TCS, Infosys, Wipro, HCLTech) declined by more than
        42,000 over the two years to early 2026. By 2030 the GCC segment will plausibly be the
        larger employer of Indian high-skill tech talent in absolute headcount terms.
      </p>

      <Figure
        n={23}
        caption="India’s GCC explosion — trajectory and state-level concentration. 1,700 today → NASSCOM working target 2,100+ by 2030 → EY-Deloitte aspirational 5,000. Karnataka leads with ~580 GCCs; Pune ~24–25% of national share; Tamil Nadu’s payroll subsidy and Maharashtra’s MIDC set-aside compete for incremental capital."
        ariaLabel="Bar chart of GCC count growth and state-level concentration."
      />

      <h2 id="sec-33"><span className="h2-no">33 — Skill gap</span>Higher-Education Capacity and the Skill-Gap Arithmetic</h2>
      <p>
        The headline gap is real. The NASSCOM-Deloitte 2024 report projects India’s AI talent
        demand at 1.25 million+ by 2027, with approximately 51% of AI/ML roles currently unfilled
        and demand-supply gaps of 60–73% in specific roles (ML Engineer, Data Scientist, DevOps
        Engineer, Data Architect). The NASSCOM-BCG 2024 report projects AI talent demand CAGR of
        approximately 15% to 2027, with AI/ML job postings up 40% year-on-year and AI Engineer
        roles growing 67% year-on-year. The India AI market is projected at USD 17 billion by
        2027 (25–35% CAGR). India already has approximately 3× the AI-skilled talent of peer
        countries.
      </p>
      <p>
        The semiconductor talent gap is similarly large. Industry roll-ups point to a 250,000–300,000
        shortage of qualified semiconductor professionals by 2027 across R&amp;D, design, fab and
        packaging. The global semi-talent gap is projected at more than 1 million by 2030;
        approximately 20% of global chip-design talent is already in India. India targets a design
        pool of 275,000 by 2032. The ChipIN Centre is supporting 270 universities equipped with EDA
        tools, with 1.2 crore tool-usages in 2025. IIT Madras founded the Wadhwani School of Data
        Science and AI (WSAI) in 2024 with a ₹110 crore endowment, 15 full-time faculty, and the
        framing as the largest AI department across all 23 IITs. IIT Bombay leads the BharatGen
        consortium launched 30 September 2024 with a ₹988 crore grant — 2B-parameter Hindi-and-English
        models are live; 5B-parameter models for 13 Indian languages in development. The Chips to
        Startup (C2S) programme has trained approximately 67,000 out of more than 1 lakh enrolled.
        ISM 2.0 expands participating institutions from 315 to 500. FutureSkills PRIME had 18.56
        lakh+ sign-ups and 3.37 lakh+ course completions as of August 2024 — the largest
        mass-skilling programme for AI in India.
      </p>
      <p>
        Skill-gap arithmetic. AI-services workforce: India demand 1.25 million+ by 2027 against a
        current AI-skilled base of 300,000–500,000; annual supply addition ~100,000–150,000 from
        formal higher-education AI programmes plus 200,000–300,000 from re-skilling. The gap is
        structurally manageable if the supply continues to scale through 2030. Semiconductor
        workforce: current 60,000 designers against a 2027 target of 300,000+; supply addition
        30,000–50,000 per year. The gap is wider; the scale-up is later in the cycle. The picture
        is that India’s higher-education and skilling infrastructure is being scaled in parallel
        with the demand. The aggregate scale-up is approximately on track for the application and
        infrastructure layers; somewhat behind on the design layer (particularly chip-design and
        AI-systems-design); significantly behind on the governance layer.
      </p>

      <Figure
        n={24}
        caption="India AI talent — demand vs supply trajectory through 2030. Demand reaches 1.25 million by 2027 (NASSCOM-Deloitte); base of 300,000–500,000 today; annual addition ~100,000–150,000 from formal higher education plus 200,000–300,000 from re-skilling (FutureSkills PRIME, corporate). Design-and-governance layers are the binding constraints."
        ariaLabel="Trend chart of India AI talent demand and supply through 2030."
      />

      <h2 id="sec-34"><span className="h2-no">34 — Labour</span>The Labour-Displacement Scenario Range</h2>
      <p>
        The labour-market consequences of the AI transition are the most discussed and least
        precisely measurable. The Periodic Labour Force Survey 2023-24 reports an unemployment
        rate of 3.2% for the 15+ population (principal-status-plus-subsidiary-status basis), with
        labour-force participation at 60.1% (rural 63.7%, urban 52.0%). The India Employment Report
        2024 finds that youth (15–24) constitute 83% of total unemployed; 65.7% of unemployed youth
        are educated; 18.4% of secondary-educated and 29.1% of college-educated youth were
        unemployed in 2022. India adds 7–8 million youth per year to the labour force; the
        demographic dividend window extends to at least 2036. Approximately 90% of the Indian
        workforce is informal, meaning automation shocks are visible as informalisation and
        wage suppression rather than as unemployment.
      </p>
      <p>
        The McKinsey 2023 estimate cited in the IER 2024 places 280 million Indian workers as
        exposed to automation by 2030. An IIM Ahmedabad 2024 survey found 68% of Indian
        white-collar employees expect AI to partially or fully automate their jobs in the next
        five years. India’s AI skill penetration is approximately 2.5× the global average —
        suggestive that the country’s relative position is favourable for augmentation rather
        than displacement.
      </p>
      <p>
        Three scenarios bound the labour-market impact through 2030. <strong>Scenario A
        (augmentation-dominant)</strong> — the base case — projects AI deployed as an augmentation
        layer across white-collar work, increasing productivity 15–25% and freeing workers to
        deliver higher-value services. Net job impact is small in either direction. 2030
        unemployment rate is in the 3–4% band, similar to 2024. <strong>Scenario B
        (substitution-dominant for routine cognitive work)</strong> — substantial automation of
        routine cognitive tasks. Net displacement 1–3 million in 2027–2030, concentrated in
        entry-level IT-BPM, customer service and back-office. Re-skilling pipelines partly absorb
        the displaced; absorption is uneven by gender (women in BPM over-represented) and region
        (Tier-2 BPM hubs more exposed). 2030 unemployment rate 4–5%. <strong>Scenario C
        (acceleration-and-bifurcation)</strong> — faster substitution with the second-order
        industrial-AI deployment lagging 2–3 years. 3–5 million displaced in 2027–2029 followed
        by recovery. The labour-displacement risk is not uniform — concentrated by occupation
        (routine cognitive), by sector (IT-BPM, customer service), by city (Tier-2 services hubs
        more exposed than Tier-1), and by demographic (women in routine roles, younger workers in
        entry-level positions). The policy response that addresses these at the occupational and
        geographic level can substantially soften the transition.
      </p>

      <Figure
        n={25}
        caption="India in global context — six-axis benchmark against comparable AI-infrastructure economies (Taiwan, South Korea, Singapore, Malaysia, UAE, Saudi Arabia, Vietnam): DC capacity, semiconductor ecosystem, energy and cooling economics, sovereign AI positioning, workforce. India strongest on workforce; competitive on DC capacity (large absolute, moderate per-capita); behind on semiconductor ecosystem; moderate on sovereign-AI commitment."
        ariaLabel="Radar chart of India vs comparable economies on six AI-infrastructure axes."
      />

      {/* ════════════════════════ PART VIII — STRATEGIC OUTLOOK ════════════════════════ */}

      <h2 id="sec-35"><span className="h2-no">35 — Scenarios</span>Three Scenarios for 2030 and 2035</h2>
      <p>
        This report consistently uses scenario ranges rather than point forecasts because the
        underlying primary-source variance is wide. <strong>Scenario A — On-Trajectory (base case,
        probability ~50%)</strong>. Hyperscaler capital flows execute substantially as announced;
        AWS, Microsoft, Google and Reliance-NVIDIA each deliver their committed capacity through
        2030. India’s DC installed capacity reaches 4.5–6.5 GW by 2030, with the Google-Adani
        Visakhapatnam project commissioning on schedule. The Tata-PSMC fab at Dholera begins
        commercial production in late 2027, with phased ramp to full 50,000 WSPM capacity by
        2030. The OSAT cluster at Sanand executes. ISM 2.0 absorbs an additional ₹10,000–20,000
        crore through 2030 across equipment, materials and advanced packaging. Hyperscaler GPU
        deployment in India totals 200,000–300,000 H100/H200/B200-equivalent accelerators by
        2030. Indian AI services revenue is in USD 50–80 billion range; GCC count is 2,100–2,500.
        2035 picture extends linearly: 8–10 GW DC capacity, full Tata-PSMC ramp plus a second
        mature-node fab approval, the first credible Indian advanced-packaging facility under
        construction.
      </p>
      <p>
        <strong>Scenario B — Acceleration (upside case, probability ~25%)</strong>. Hyperscaler
        capex commitments exceeded on stronger AI demand from Indian enterprises and GCCs. The
        Visakhapatnam corridor scales beyond initial Google-Adani commitment; a second hyperscaler
        commits a USD 5–10 billion gigawatt-class facility at Vizag or Kakinada-Sricity. The
        Tata-PSMC fab ramps faster than planned; a second fab approval granted. ISM 2.0 absorbs
        ₹30,000–50,000 crore through 2030, with an advanced-packaging facility approved at
        ₹25,000+ crore scale. Hyperscaler GPU deployment in India reaches 400,000–500,000 by 2030.
        Indian AI services revenue USD 80–120 billion band; GCCs approach EY-aspirational 3,000
        mark. 2035 picture sees India approaching 12–15 GW DC capacity, two operational fabs, a
        credible advanced-packaging cluster, and beginnings of indigenous AI accelerator design at
        meaningful scale.
      </p>
      <p>
        <strong>Scenario C — Constraint-Bound (downside case, probability ~25%)</strong>. The
        binding constraints — power, water, fibre right-of-way, talent — bind harder than
        projected. The Visakhapatnam project slips 12–24 months due to transmission, port or
        regulatory delays. Bengaluru experiences a water-stress event in 2027-2029 forcing sudden
        DC pipeline relocation. The Tata-PSMC fab faces yield-ramp or technology-transfer delays.
        Hyperscaler GPU deployment in India is 100,000–150,000 range by 2030. Indian AI services
        revenue USD 30–50 billion band. 2035 sees India at 6–8 GW DC capacity, one operational
        fab, and substantial unresolved dependencies on imported AI accelerators and advanced
        packaging. Across all three scenarios, the structural geography (five-corridor
        concentration, coastal-vs-inland split, semiconductor-versus-services state divergence) is
        largely preserved. What varies is magnitude and pace, not pattern.
      </p>

      <Figure
        n={26}
        caption="Three scenarios for India’s AI infrastructure — capacity and GPU deployment to 2035. A (On-Trajectory, ~50%): 4.5–6.5 GW / 200–300k GPUs by 2030, 8–10 GW by 2035. B (Acceleration, ~25%): 7–9 GW / 400–500k GPUs by 2030, 12–15 GW by 2035. C (Constraint-Bound, ~25%): 4–6 GW / 100–150k GPUs by 2030, 6–8 GW by 2035."
        ariaLabel="Multi-line chart of three scenarios for India DC capacity and GPU deployment 2026 to 2035."
      />

      <h2 id="sec-36"><span className="h2-no">36 — Framework 9</span>The AI Infrastructure Bottleneck Framework</h2>
      <p>
        The framework introduced in this section is the AI Infrastructure Bottleneck Framework — a
        structured taxonomy of the binding constraints on India’s AI industrial transition through
        2030. Five bottlenecks are identified, in order of severity for the period of this report.
      </p>
      <p>
        <strong>Bottleneck 1: Advanced Packaging.</strong> India has no announced CoWoS-class or
        HBM-stacking capability as of May 2026. The single most consequential gap in India’s
        semiconductor stack for AI purposes. Global supply of advanced packaging is structurally
        constrained (TSMC CoWoS oversubscribed through 2026; HBM3E fully allocated). Mitigation:
        the recommendation in Section 37 — a ₹25,000–50,000 crore advanced-packaging facility
        under ISM 2.0. <strong>Bottleneck 2: Power-and-Water at Corridor Level.</strong> The
        Bengaluru-and-Hyderabad water position is the binding constraint on current corridor
        deployment. CGWB over-exploitation classifications, Bengaluru Rural’s 169% extraction
        stage, Hyderabad’s 2024 over-exploited upgrade, and Chennai’s history of stress events.
        Mitigations — liquid cooling, treated-wastewater, desalination, captive RE plus pumped
        storage — are technical answers to a partly structural problem.
      </p>
      <p>
        <strong>Bottleneck 3: Local Transmission and DISCOM Execution.</strong> Aggregate grid
        capacity is sufficient through 2030; local transmission and DISCOM-level execution is not.
        The DISCOMs in the principal DC corridors must process 600+ MW of incremental DC load
        over 36 months while continuing to serve existing peak demand. The execution risk is
        principally at substation, transmission-line and feeder level. <strong>Bottleneck 4:
        Talent at the Design and Governance Layers.</strong> Infrastructure-and-application-layer
        talent supply is on track. Design-layer supply (chip designers, AI-systems designers, ML
        researchers) is moderately behind demand. Governance-layer supply (AI policy, ethics,
        safety, regulatory affairs) is significantly behind. Targeted policy interventions are at
        the post-graduate and PhD level. <strong>Bottleneck 5: Geopolitical Supply-Chain Risk.</strong>
        India’s AI accelerator supply is dependent on Taiwanese fab capacity (TSMC), Korean memory
        and packaging (Samsung, SK Hynix), and US technology controls (BIS rules, export-control
        discretion). The Biden-era AI Diffusion Rule was rescinded May 2025. Re-imposition under a
        different US administration, a Taiwan-Strait incident, or a Korean export-control episode
        would each affect the Indian AI pipeline. Mitigation is supplier-and-geography
        diversification.
      </p>

      <Figure
        n={27}
        caption="AI Infrastructure Bottleneck Framework — five binding constraints, severity-ranked: (1) Advanced packaging (zero Indian capability vs structural global supply deficit); (2) Power-and-water at corridor level; (3) Local transmission and DISCOM execution; (4) Design-and-governance-layer talent; (5) Geopolitical supply-chain risk (Taiwan, Korea, US BIS)."
        ariaLabel="Severity-ranked taxonomy of five binding constraints on India AI infrastructure."
      />

      <h2 id="sec-37"><span className="h2-no">37 — Recommendations</span>Strategic Recommendations: Capital, Policy, Capability</h2>
      <p>
        <strong>Recommendation 1: Make advanced packaging the centrepiece of ISM 2.0.</strong> The
        strategic gap in India’s semiconductor stack for AI purposes is not the fab (the Tata-PSMC
        Dholera fab is sufficient at the mature-node layer) but the advanced packaging that bridges
        the leading-edge logic die and the HBM stacks. A ₹25,000–50,000 crore advanced-packaging
        facility, co-located with the Tata Assam OSAT or the HCL-Foxconn Jewar OSAT, with a
        credible technology partnership (Amkor, ASE, or a tier-2 Taiwanese OSAT diversifying
        outside Taiwan and China), is the highest-impact incremental investment available to ISM
        2.0 in the 2026–2030 window. The fiscal cost is comparable to one additional mature-node
        fab; the strategic-payoff is asymmetrically higher because the global packaging supply is
        structurally constrained.
      </p>
      <p>
        <strong>Recommendation 2: Build the corridor-level data infrastructure for water, power and
        talent.</strong> Principal data gaps that limit institutional capital allocation are CGWB
        block-level water-stress data for DC-segregated consumption, CEA DC-segregated
        electricity-demand projections, DISCOM-level interconnection-queue transparency, and AICTE
        district-level talent-supply data. Each gap can be closed at a fiscal cost of less than
        ₹100 crore (probably ₹25–50 crore each) but unlocks much larger private capital flows
        because investors currently underinvest in geographies where the data is poor. The
        cost-benefit ratio is unusually favourable.
      </p>
      <p>
        <strong>Recommendation 3: Open the captive-RE and treated-wastewater regulatory regime.</strong>
        Economics of liquid-cooled, captive-RE-supplied, treated-wastewater-fed AI data centres
        is favourable; constraints are regulatory rather than technical. Targeted reforms:
        simplification of the open-access regulatory framework across principal DC states;
        harmonisation of cross-subsidy-surcharge and additional-surcharge waivers for RE-supplied
        DCs across states; explicit treated-wastewater allocation rights for DCs from urban local
        bodies with state guarantees; a uniform inter-state pumped-storage power-purchase
        framework. <strong>Recommendation 4: Pivot the talent strategy from horizontal IT-services
        to vertical four-layer stack.</strong> The current FutureSkills PRIME, NEAT, NPTEL, AICTE
        and IIT-driven talent infrastructure was designed for the horizontal IT-services era. The
        four-layer talent stack (design, infrastructure, application, governance) requires explicit
        pipeline targets and corresponding programmatic investments for each layer. A fifth
        recommendation, addressed to private operators and investors: invest in coastal-AI
        infrastructure ahead of inland. Capital that lands in inland corridors before the coastal
        corridors are saturated is, in this report’s view, sub-optimally allocated.
      </p>

      <h3 id="sec-37a">37A — The Strategic Opportunity Matrix · Techadyant Labs signature framework</h3>
      <p>
        The framework introduced in this section is the Strategic Opportunity Matrix — the report’s
        signature analytical instrument. The matrix has two axes: strategic importance (low to
        high) vs time-to-execution (0–24 months to 60+ months). The combination produces four
        quadrants: Quick Wins, Strategic Bets, Tactical Wins, Watch-and-Wait. The matrix is
        populated with twenty-four specific opportunity surfaces.
      </p>
      <p>
        <strong>Quick Wins</strong> (high importance, 0–24 months execution). Where capital should
        move first: (1) AI-class GPU and accelerator cluster deployment at hyperscaler and large
        operator scale — Indian addressable ₹60,000–100,000 crore through 2030; (2) Captive RE PPA
        structuring — ₹25,000–50,000 crore; (3) Treated-wastewater allocation policy for inland
        DCs (Bengaluru, Hyderabad, Greater Noida) — capex addressable ₹5,000–10,000 crore;
        (4) Industrial AI services delivery through GCCs and mid-tier services firms —
        ₹80,000–150,000 crore revenue opportunity through 2030; (5) Edge AI infrastructure
        deployment in 30–50 Tier-2 Indian cities — ₹10,000–45,000 crore capex; (6) High-density
        cooling and liquid-cooling retrofit market — ₹7,500–36,000 crore through 2030.
      </p>
      <p>
        <strong>Strategic Bets</strong> (high importance, 24–60 months). The long-cycle commitments
        that will define India’s structural position: (7) Advanced packaging facility (CoWoS-class)
        — ₹25,000–50,000 crore, 4–5 year build; (8) Visakhapatnam coastal hub at gigawatt scale —
        ₹80,000–100,000 crore cumulative through 2030; (9) HBM stacking partnership with Korean or
        US OEM — ₹15,000–25,000 crore investment, 4–6 year build; (10) Semiconductor
        specialty-gases hub beyond Inox-Dholera — ₹5,000–10,000 crore; (11) National foundation-model
        programme at scale (BharatGen-2 / sovereign-LLM cluster) — ₹5,000–10,000 crore;
        (12) Tier-2 OSAT-led 2.5D packaging at HCL-Foxconn / Tata-TSAT — ₹10,000–20,000 crore;
        (13) Inter-state water-rights modernisation for DC siting — policy-led with downstream
        capex of ₹20,000–40,000 crore; (14) Tier-2 GCC anchor-city development outside
        Bengaluru-Hyderabad-Mumbai-Pune — ₹30,000–60,000 crore cumulative.
      </p>
      <p>
        <strong>Tactical Wins</strong> (moderate importance, 0–24 months). Smaller but still
        meaningful opportunities accessible to mid-tier firms: (15) DCIM and operations software
        localisation; (16) Precision-piping and ultrapure-water specialist services; (17)
        Industrial-sensor and edge-IoT device manufacture; (18) Cleanroom certification and
        standards bodies; (19) Submarine-cable landing-station infrastructure; (20) DC InvIT and
        REIT structuring services. <strong>Watch-and-Wait</strong> (currently moderate importance,
        longer execution): (21) Leading-edge logic fab (3–5 nm) — premature, requires
        advanced-packaging-first sequencing; (22) Indigenous AI accelerator design at scale —
        premature; (23) Quantum computing infrastructure — early-stage; (24) Brain-computer
        interface and post-classical AI hardware — speculative. The single most important entry
        in the matrix is the advanced-packaging facility (entry 7, Strategic Bets) — the binding
        constraint on every layer of the AI accelerator value chain that India currently does not
        participate in.
      </p>

      <Figure
        n={28}
        caption="Strategic Opportunity Matrix — Techadyant Labs signature framework. Twenty-four opportunity surfaces mapped to strategic importance (y) vs time-to-execution (x): Quick Wins (high importance, 0–24 months), Strategic Bets (high importance, 24–60 months), Tactical Wins (moderate importance, 0–24 months), Watch-and-Wait (moderate importance, 60+ months)."
        ariaLabel="Two-by-two strategic opportunity matrix populated with 24 named opportunity surfaces."
      />

      <h3 id="sec-37b">37B — Likely Winners of India’s AI Industrial Transition</h3>
      <p>
        <strong>Winning states</strong>: Karnataka (services anchor), Tamil Nadu (electronics
        manufacturing), Andhra Pradesh (rising coastal node), Gujarat (semiconductor cluster).
        Mid-tier: Telangana, Maharashtra, Uttar Pradesh. <strong>Winning industrial sectors</strong>:
        BFSI / financial services (highest AI absorption); Auto / OEMs (Tata Motors, Mahindra,
        Maruti as production-AI leaders); Pharma (Sun, Cipla, Dr Reddy’s, Lupin); GCC-and-mid-tier
        services rather than traditional contract services; industrial-automation suppliers (TAL,
        Addverb, GreyOrange, Ati Motors, Asteria); manufacturing electronics under PLI (Foxconn
        India, Pegatron, Tata Electronics, Dixon, Amber); AI-enabled logistics (Delhivery, Mahindra
        Logistics, CONCOR); construction and EPC firms anchored to DC and semiconductor build-out
        (L&amp;T, Tata Projects, Shapoorji Pallonji, Megha Engineering).
      </p>
      <p>
        <strong>Winning infrastructure operators</strong>: AdaniConneX (Visakhapatnam anchor,
        gigawatt-scale platform); Yotta-Hiranandani (Mumbai-Hyderabad twin, NVIDIA partnership);
        CtrlS (Chandan Valley scale, RE-PPA depth); Reliance-Jamnagar (captive-power scale, NVIDIA
        partnership); NTT GDC; Sify (CLS and submarine-cable adjacency, Visakhapatnam pioneer);
        Tata Communications; Digital Connexion (Reliance-Brookfield-Digital Realty alliance); the
        hyperscaler regions (AWS, Microsoft, Google, Oracle). <strong>Winning utilities</strong>:
        GUVNL (Gujarat), TSDISCOM (Telangana), TANGEDCO (Tamil Nadu), APCPDCL (Andhra). At the
        captive-RE layer: CleanMax, ReNew Power, Amplus, Continuum Green, JSW Energy, Tata Power
        Renewables, Adani Green. <strong>Winning precision manufacturers</strong>: Sterlite
        Technologies, Aksh Optifibre, Polycab (fibre); Macawber Beekay, Astha Cleantech, Praj
        Industries (cleanroom); Voltas, Blue Star, Eureka Forbes Industrial (HVAC); Honeywell
        India, Forbes Marshall (instrumentation); Cyient, L&amp;T Technology Services, Tata Elxsi
        (precision engineering services).
      </p>
      <p>
        <strong>Winning Indian-fabless and design firms</strong>: Tata Electronics, Saankhya Labs,
        Mindgrove Technologies, InCore Semiconductors, Ceremorphic; plus captive-design centres of
        Intel, Qualcomm, AMD, TI, Synopsys, Cadence operating in India. <strong>Winning gases,
        chemicals and materials suppliers</strong>: Linde India, Inox Air Products, Air Liquide
        India, Aegis Logistics, SRF; plus emerging Indian-JV partnerships. The losers, by contrast,
        are the categories where the import dependency is structural and where Indian-vendor
        substitution is unlikely within the period of this report: leading-edge fab equipment OEMs
        (ASML, AMAT, Lam, TEL, KLA), HBM suppliers (Samsung, SK Hynix, Micron), advanced-packaging
        incumbents (TSMC, ASE, Amkor), and the AI accelerator designers themselves (Nvidia, AMD,
        Intel, Google TPU programme, Broadcom).
      </p>

      <Figure
        n={29}
        caption="Likely winners of India’s AI industrial transition — ten categories with named institutional and corporate winners: winning states, industrial sectors, infrastructure operators, utilities, logistics firms, precision manufacturers, real-estate and InvIT players, EPCs, Indian-fabless firms, gases/chemicals/materials suppliers."
        ariaLabel="Comprehensive who-wins table across ten beneficiary categories."
      />

      <h2 id="sec-38"><span className="h2-no">38 — Failure modes</span>What Can Break the Thesis</h2>
      <p>
        This report’s working thesis is conditioned on five assumptions; each can fail. The
        report’s discipline requires that the failure modes be named. <strong>Failure Mode 1:
        Hyperscaler capex retrenchment.</strong> A serious global recession, a sharp escalation in
        the cost of capital, or a structural retrenchment in AI enterprise demand could compress
        the 2026–2030 hyperscaler commitment by 30–50%. Principal trigger to monitor: quarterly
        capex disclosure of AWS, Microsoft, Google and Oracle through 2026-2027. Leading
        indicator: order-book commentary of Indian DC operators. <strong>Failure Mode 2: US AI
        Diffusion Rule re-imposition.</strong> The Biden-era AI Diffusion Rule placed India in
        Tier 2 with country-cap implications for advanced-AI-accelerator imports. The Trump
        administration rescinded the rule on 13 May 2025. A future US administration — or a
        serious US-China escalation — could re-impose an equivalent framework. The hard mitigation
        is the indigenous-AI-accelerator development capability, a 10–15 year programme outside
        the window of this report. The medium-term mitigation is geopolitical: the US-India
        strategic relationship, the iCET framework.
      </p>
      <p>
        <strong>Failure Mode 3: Water-stress shutdown event.</strong> A Chennai-2019-class Day Zero
        event in Bengaluru or Hyderabad in 2027-2029 would force a sudden DC pipeline relocation.
        Probability is non-trivial given the CGWB classifications. Mitigation: the cooling-technology
        transition, treated-wastewater policy, desalination build-out, dual-site redundancy
        practice. <strong>Failure Mode 4: Chinese specialty-input retaliation.</strong> A
        successful Chinese export-control retaliation in specialty gases (silane), rare-earth
        elements, display drivers, or other input categories that India imports substantially from
        China could slow the OSAT ramp. Mitigation: diversification of specialty-input sources
        (Inox Air Products, Linde India, US/Japanese/Korean substitutes), strategic stockpile
        policy. <strong>Failure Mode 5: Geopolitical shock to Taiwan.</strong> A Taiwan Strait
        conflict scenario would disrupt approximately 90% of global leading-edge logic supply and
        approximately 70% of global advanced-packaging supply. Risk-management posture is
        contingency planning, strategic stockpiles, and the long-term indigenous-fab-and-packaging
        programme that ISM 2.0 partly addresses.
      </p>
      <p>
        Across the five failure modes, the base case (Scenario A) holds with approximately 50%
        probability. The combined probability of one or more materialising in a way that materially
        alters the trajectory is approximately 25–30%. The remaining probability mass is the upside
        Scenario B (~25%). The report’s frameworks are designed to remain robust across the
        failure modes: the AI Infrastructure Readiness Matrix, the Bottleneck Framework, the
        Corridor Analysis, and the Talent Stack each remain useful instruments under any of the
        failure modes. India’s strategic position is, on balance, favourable. India is a
        Tier-2-or-higher destination for hyperscaler capital under any plausible US-policy
        scenario. India’s domestic AI demand is large and growing structurally. India’s design-talent
        depth is the deepest of any large emerging economy. India’s industrial-policy machinery has
        demonstrated the capability to execute on multi-decade infrastructure programmes at scale.
      </p>

      <Figure
        n={30}
        caption="Failure-mode severity–likelihood matrix — eight stress tests positioned by impact and probability: hyperscaler capex retrenchment (15%, 30% capacity reduction); AI Diffusion re-imposition (15%, 25%); water-stress event (20%, location-specific); Chinese input retaliation (15%, 20% delay); Taiwan Strait (low probability, severe impact); oversupply glut (20%, margin compression); grid failure (10%, transient); data-localisation tightening (40%, modest expansion)."
        ariaLabel="Severity-likelihood scatter plot of eight failure-mode stress tests."
      />

      {/* ════════════════════════════════ CONCLUSION ════════════════════════════════ */}

      <h2 id="conclusion"><span className="h2-no">Close</span>Conclusion</h2>
      <p>
        The transition described in this report is not a future event. It is a present industrial
        fact. Between 2024 and 2026, India’s hyperscaler commitments crossed USD 50 billion, the
        Tata-PSMC fab moved from announcement to construction, twelve semiconductor projects
        received ISM approval, the IndiaAI Mission deployed 38,000+ GPUs, the GCC count crossed
        1,700, the Microsoft Hyderabad and Google Visakhapatnam projects of unprecedented scale
        were announced, the captive-RE PPA structure for DCs became the new operating norm, and
        the policy frameworks across Karnataka, Tamil Nadu, Telangana, Maharashtra, Gujarat,
        Andhra Pradesh and Uttar Pradesh aligned in a competitive industrial-policy environment
        that has no precedent in the post-1991 Indian economy.
      </p>
      <p>
        What this report has tried to do is to make this transition legible at the level of its
        physical substance: the megawatts, the wafers, the litres, the kilometres of fibre, the
        rupees of capex, the headcount of engineers. The frameworks introduced — the Infrastructure
        Readiness Matrix, the GPU Dependency Stack, the Semiconductor Capability Stack, the Power
        and Cooling Stress Index, the Regional Opportunity Corridors, the Industrial Dependency
        Map, the Adoption Readiness Curve, the Talent Stack, and the Bottleneck Framework — are
        designed to give institutional capital, policy makers, and serious researchers the
        analytical tools to follow this transition as it unfolds.
      </p>
      <p>
        India’s AI industrial transition is a real, financed, accelerating event whose physical
        substance is the construction of compute, semiconductor and connectivity infrastructure
        across seven corridors. The binding constraints are power, water, advanced packaging, and
        corridor-level execution capacity — not capital, not policy direction, and not aggregate
        talent supply. The corridor competition will produce divergent regional outcomes that
        mainstream national-aggregate analysis obscures. The second-order industrial-AI deployments
        will produce the bulk of macroeconomic value through 2030. The workforce transition is real
        and asymmetric but does not constitute a catastrophe scenario at the national-aggregate
        level. The strategic policy lever of greatest impact is advanced packaging plus
        corridor-level data infrastructure. The path-dependent geography of the period 2026-2030
        will set the structural pattern for the period 2030-2035 and beyond.
      </p>
      <p>
        The transition is not promised to succeed. The failure modes in Section 38 are real. The
        report’s discipline requires that the success scenario be earned through execution, not
        assumed through hope. The instruments of this report are intended to support that
        execution by making the transition’s physical structure visible. The rest is in the hands
        of the institutional actors — the operators, the governments, the universities, the
        standards bodies, the workforce, the investors — whose decisions through 2030 will
        determine the shape of India’s industrial economy in 2035.
      </p>

      {/* ────────────────────────── Related signals ────────────────────────── */}
      <div className="exec-summary" style={{ marginTop: 48 }}>
        <div className="es-label">Related signals — launching with this report</div>
        <ul>
          <li>
            <a href="/signals/advanced-packaging-binding-constraint/">
              Advanced packaging is India’s binding AI constraint
            </a>{' '}
            — links into <a href="#sec-11">Section 11</a>.
          </li>
          <li>
            <a href="/signals/visakhapatnam-coastal-ai/">
              The Visakhapatnam coastal-AI thesis in one chart
            </a>{' '}
            — links into <a href="#sec-25">Section 25</a>.
          </li>
          <li>
            <a href="/signals/ai-opportunity-surfaces-india/">
              Eight opportunity surfaces from India’s AI infrastructure cycle
            </a>{' '}
            — links into <a href="#sec-30a">Section 30A</a>.
          </li>
          <li>
            <a href="/signals/ai-corridor-competition/">
              The corridor logic: why state competition decides India’s AI geography
            </a>{' '}
            — links into <a href="#sec-18">Part V</a>.
          </li>
        </ul>
      </div>

      {/* ──────────────────────────── Download CTA ──────────────────────────── */}
      <p style={{ marginTop: 32, fontSize: 14, color: 'var(--text-muted)' }}>
        This report is published as a free, open analytical instrument. The full PDF and editable
        Word version are available at <code>/downloads/</code>. Edition 02 (anticipated May 2027)
        will re-score every framework with one full year of execution data.
      </p>
    </>
  );
}
