import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "The SAP Question — Flagship".
 * Carries the argument, the three frameworks and the headline findings in full, and
 * works the SAP dependency end-to-end as a sample of the report's method. The complete
 * ~170-page edition (nine parts, 22 figures, 21 tables, eight appendices) is the paid
 * PDF/docx; <PremiumBody/> renders the paywall after this.
 */
export const toc: TocItem[] = [
  { id: 'the-russia-warning', label: 'The Russia warning' },
  { id: 'right-layer', label: 'Enterprise, not consumer' },
  { id: 'the-stack', label: 'The eleven-layer stack' },
  { id: 'three-frameworks', label: 'Three frameworks' },
  { id: 'where-sap-runs', label: 'Where SAP runs India' },
  { id: 'build-vs-buy', label: 'The build-versus-buy finding' },
  { id: 'the-exposure', label: 'The national exposure (DIEM)' },
  { id: 'the-ai-fork', label: 'The AI fork' },
  { id: 'scenarios', label: 'Five scenarios to 2035' },
  { id: 'the-opportunity', label: 'The sovereign opportunity' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const BRASS = '#F5B544';
const TEAL = '#38e1c4';
const CRIMSON = '#e2725b';
const INK = '#9898A8';

/* ── Figure 1 — The dependency stack, scored on the EDI ── */
function StackFigure() {
  const layers = [
    { name: 'Public cloud', edi: 81.7, band: 'Captured', c: CRIMSON },
    { name: 'ERP', edi: 78.5, band: 'Captured', c: CRIMSON },
    { name: 'AI platforms', edi: 69.2, band: 'Exposed', c: BRASS },
    { name: 'Productivity', edi: 66.0, band: 'Exposed', c: BRASS },
    { name: 'Databases', edi: 62.0, band: 'Exposed', c: BRASS },
    { name: 'Desktop OS', edi: 60.0, band: 'Exposed', c: BRASS },
    { name: 'Cybersecurity', edi: 58.0, band: 'Exposed', c: BRASS },
    { name: 'CRM', edi: 55.0, band: 'Exposed', c: BRASS },
    { name: 'Server OSS', edi: 44.0, band: 'Managed', c: TEAL },
    { name: 'Identity', edi: 40.0, band: 'Managed', c: TEAL },
    { name: 'Payments', edi: 37.4, band: 'Managed', c: TEAL },
  ];
  return (
    <figure className="report-figure" id="fig-stack">
      <div className="fig-frame">
        <svg viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's eleven-layer dependency stack scored on the Enterprise Dependency Index">
          {layers.map((l, i) => {
            const y = 18 + i * 40;
            const w = (l.edi / 100) * 540;
            return (
              <g key={l.name}>
                <text x={18} y={y + 22} fontSize={13} fontWeight={600} fill="#E8E8F0">{l.name}</text>
                <rect x={170} y={y} width={540} height={30} rx={6} fill="#161629" />
                <rect x={170} y={y} width={w} height={30} rx={6} fill={l.c} fillOpacity="0.85" />
                <text x={170 + w - 8} y={y + 20} fontSize={12.5} fontWeight={700} fill="#0B0B14" textAnchor="end">{l.edi.toFixed(1)}</text>
                <text x={724} y={y + 20} fontSize={10.5} fill={l.c} textAnchor="end" letterSpacing="0.03em">{l.band.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption>Figure — The Enterprise Dependency Index across India&apos;s eleven software layers. The layers the economy most depends on to operate — public cloud and ERP — are the most captured; the layers India built itself are the most sovereign. Higher means a deeper, more dangerous dependency.</figcaption>
    </figure>
  );
}

/* ── Figure 2 — The national exposure gauge (DIEM) ── */
function DiemFigure() {
  const central = 59;
  const lo = 50, hi = 65;
  const x = (v: number) => 40 + (v / 100) * 680;
  return (
    <figure className="report-figure" id="fig-diem">
      <div className="fig-frame">
        <svg viewBox="0 0 760 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="India's national software exposure, DIEM, central estimate 59 percent">
          <rect x={40} y={56} width={680} height={20} rx={10} fill="#161629" />
          <rect x={x(lo)} y={56} width={x(hi) - x(lo)} height={20} rx={10} fill={CRIMSON} fillOpacity="0.35" />
          <line x1={x(central)} y1={44} x2={x(central)} y2={88} stroke={CRIMSON} strokeWidth={3} />
          <circle cx={x(central)} cy={66} r={7} fill={CRIMSON} />
          <text x={x(central)} y={36} fontSize={22} fontWeight={800} fill="#E8E8F0" textAnchor="middle">59%</text>
          <text x={x(lo)} y={112} fontSize={12} fill={INK} textAnchor="middle">50%</text>
          <text x={x(hi)} y={112} fontSize={12} fill={INK} textAnchor="middle">65%</text>
          <text x={40} y={140} fontSize={11.5} fill={INK}>0%</text>
          <text x={720} y={140} fontSize={11.5} fill={INK} textAnchor="end">100% captured</text>
        </svg>
      </div>
      <figcaption>Figure — The Digital Infrastructure Exposure Matrix (DIEM). A modelled 50–65 per cent — central case ~59 per cent — of India&apos;s software-operating formal-sector value-added depends, at the ERP, database and cloud layer, on foreign-headquartered software. Modelled; sensitivity-tested in the full report.</figcaption>
    </figure>
  );
}

/* ── Figure 3 — Five scenarios to 2035 ── */
function ScenarioFigure() {
  const scen = [
    { code: 'A', name: 'Business as Usual', v: 71, c: CRIMSON },
    { code: 'B', name: 'Managed Drift', v: 54, c: BRASS },
    { code: 'C', name: 'Sovereign Push', v: 43, c: BRASS },
    { code: 'E', name: 'Strategic Crisis', v: 42, c: CRIMSON },
    { code: 'D', name: 'AI Leapfrog', v: 38, c: TEAL },
  ];
  const y = (v: number) => 30 + (v / 80) * 200;
  return (
    <figure className="report-figure" id="fig-scenarios">
      <div className="fig-frame">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Five DIEM scenarios to 2035, spreading from 38 to 71 percent">
          <line x1={70} y1={y(59)} x2={120} y2={y(59)} stroke={INK} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={64} y={y(59) + 4} fontSize={11} fill={INK} textAnchor="end">59% today</text>
          {scen.map((s, i) => {
            const x2 = 250 + i * 100;
            return (
              <g key={s.code}>
                <line x1={120} y1={y(59)} x2={x2} y2={y(s.v)} stroke={s.c} strokeWidth={2.5} strokeOpacity="0.85" />
                <circle cx={x2} cy={y(s.v)} r={6} fill={s.c} />
                <text x={x2} y={y(s.v) - 14} fontSize={15} fontWeight={800} fill="#E8E8F0" textAnchor="middle">{s.v}%</text>
                <text x={x2} y={272} fontSize={10.5} fill={INK} textAnchor="middle">{s.name}</text>
              </g>
            );
          })}
          <text x={120} y={292} fontSize={11} fill={INK} textAnchor="middle">2026</text>
        </svg>
      </div>
      <figcaption>Figure — India&apos;s national software exposure (DIEM) projected to 2035 under five scenarios. The same country reaches 71 per cent captured or 38 per cent sovereign depending on the choices made before the 2027 window closes. The spread is the strategic stake of the decade.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <p className="serif" style={{ fontSize: 17, color: 'var(--text-muted)' }}>
        India built the world&apos;s software workforce and imports the software that runs its own economy. This report
        measures that dependency — layer by layer and sector by sector — assesses the strategic and economic risk it
        creates, and argues that a narrow window has, for the first time in two decades, made it possible to change. This
        online edition carries the argument, the three frameworks and the headline findings in full; the complete
        ~170-page edition carries the evidence the way a board or a finance ministry needs it.
      </p>

      <h2 id="the-russia-warning">The Russia warning</h2>
      <p>
        In late February 2022, a category of risk strategists had treated as theoretical became real. Within days of the
        invasion of Ukraine, the world&apos;s largest enterprise-software companies — SAP, Oracle, Microsoft, IBM —
        suspended operations in Russia. The machines did not stop that day; existing installations kept running. But the
        country discovered, in real time, that the software at the core of its economy was not its own, and that in
        banking and much of industry there was no domestic system to fall back on. Russia&apos;s largest banks asked their
        own government to delay a mandated switch to home-grown technology until 2027, because nothing else existed.
      </p>
      <p>
        That is the question this report makes unavoidable: not whether foreign enterprise software is good — it is often
        excellent — but who controls it, what depends on it, and what happens to a national economy if the relationship
        that supplies it changes. It is a question about software as a form of national power.
      </p>

      <h2 id="right-layer">Enterprise, not consumer</h2>
      <p>
        India has had a digital-sovereignty debate, but it has been about the wrong layer. The public conversation has
        concerned data localisation, social media and the governance of consumer platforms — the visible, citizen-facing
        surface. The enterprise layer underneath, where the strategic dependency is deepest and the consequences of
        failure gravest, has gone almost undiscussed. Consumer software is visible, switchable and individually
        low-stakes; if one app is banned, another is installed by dinnertime. Enterprise software is the opposite on every
        count — invisible, extraordinarily hard to switch, and collectively high-stakes, because a single system can sit
        beneath the operations of an entire industry. The consumer layer is a marketplace; the enterprise layer is
        infrastructure.
      </p>

      <h2 id="the-stack">The eleven-layer stack</h2>
      <p>
        The report&apos;s organising instrument is the <strong>digital dependency stack</strong>: an eleven-layer model of
        the software a modern economy runs on, from operating systems and databases through ERP, productivity and the
        public cloud, up to cybersecurity, identity, AI and the agent layer. For each layer the report asks the same five
        questions — who leads it, what share is foreign-controlled, what domestic alternative exists, how hard it is to
        switch, and how strategically critical it is — and scores it on the Enterprise Dependency Index from 0 to 100.
      </p>
      <StackFigure />
      <p>
        The shape of the result <em>is</em> the thesis. At the top, in the <strong>Captured</strong> band, sit public
        cloud and ERP — the layers the physical economy most depends on to operate, the hardest to switch, with no
        domestic alternative at scale. At the bottom, in the <strong>Managed</strong> band, sit the three layers India
        built or adopted as open infrastructure for itself — server-side open source, identity and payment rails. The
        single most important pattern is that strategic criticality and switching difficulty rise together toward the top:
        India&apos;s dependency is concentrated precisely in the layers it can least afford to lose and least easily leave.
      </p>

      <h2 id="three-frameworks">Three frameworks</h2>
      <p>
        The report measures the dependency with three proprietary instruments, each operating at a different scale. The
        <strong> Enterprise Dependency Index (EDI)</strong> scores each of the eleven layers. The
        <strong> Software Sovereignty Score (SSS)</strong> scores each sector of the economy. And the
        <strong> Digital Infrastructure Exposure Matrix (DIEM)</strong> rolls the picture up into a single,
        GVA-weighted national exposure figure. They compose: layers aggregate into sectors, sectors aggregate into the
        nation. Every score is published with its inputs, its weights and a sensitivity table, so the numbers are
        arguments made in the open rather than assertions.
      </p>

      <h2 id="where-sap-runs">Where SAP runs India</h2>
      <p>
        SAP — the German enterprise-software company — sits closer to the operational core of Indian industry than almost
        any Indian firm. More than <strong>five thousand</strong> Indian enterprises run it, including the operational
        core of ONGC, Indian Oil, NTPC, BHEL, SAIL, Bharat Electronics and the public-sector banks. Its India revenue
        reached roughly <strong>₹8,870 crore in FY25</strong>. It runs the joint-venture accounting of offshore oil
        fields, the materials management of refineries, the plant maintenance of the national power fleet, and the
        procurement of a defence-electronics manufacturer. A modelled estimate places enterprises running SAP at
        <strong> twelve to eighteen per cent of India&apos;s GDP</strong> at the system-of-record layer.
      </p>
      <div className="pull-stat">
        <div className="ps"><div className="n">5,000+</div><div className="l">Indian enterprises running SAP, including the energy, power, metals and defence-production core</div></div>
        <div className="ps"><div className="n">31 Dec 2027</div><div className="l">SAP ECC end-of-support — the forced-migration deadline pushing thousands of enterprises to a decision</div></div>
        <div className="ps"><div className="n">$16.3bn</div><div className="l">India&apos;s 2024 payments for foreign intellectual property — nearly doubled since 2020</div></div>
      </div>

      <h2 id="build-vs-buy">The build-versus-buy finding</h2>
      <p>
        The report&apos;s central finding is counter-intuitive: <strong>sovereignty is a function of whether the thing was
        built domestically, not of how strategic the sector is.</strong> Banking scores higher on the Software
        Sovereignty Score than manufacturing — despite being at least as strategic — for one reason: India built its own
        core-banking products (Infosys&apos;s Finacle, the India-originated FLEXCUBE), and manufacturing imported its
        system of record from SAP and Oracle. Where India built the product, sovereignty followed; where it imported,
        sovereignty was lost. The same mechanism runs from the layer level, through the sector level, to the nation — one
        idea at three scales, and it is the intellectual spine of the report.
      </p>

      <h2 id="the-exposure">The national exposure</h2>
      <p>
        Rolled up to the national scale, the Digital Infrastructure Exposure Matrix puts a single modelled number on the
        dependency.
      </p>
      <DiemFigure />
      <p>
        The exposure is concentrated in manufacturing, energy and large financial-services firms, and it is rising as
        cloud migration continues. The economic cost is visible in the external accounts, where India&apos;s payments for
        foreign intellectual property and software have nearly doubled in four years — growing far faster than the
        economy and more than ten times what the country earns back.
      </p>

      <h2 id="the-ai-fork">The AI fork</h2>
      <p>
        The AI reset is the first real opening in two decades, and it cuts both ways. Agentic AI lets the incumbents embed
        agents trained on the enterprise&apos;s own data and deepen the lock-in — but it also collapses the cost of
        building a greenfield, AI-native alternative, attacking the switching cost that was SAP&apos;s deepest moat. The
        same technology is simultaneously the incumbents&apos; strongest defence and the challengers&apos; best weapon.
        Which force prevails decides India&apos;s 2035 outcome, and the two are racing each other in time.
      </p>

      <h2 id="scenarios">Five scenarios to 2035</h2>
      <p>
        Run forward under five scenarios, the national exposure figure spreads dramatically — and the spread is the
        strategic stake of the decade.
      </p>
      <ScenarioFigure />
      <p>
        Under <strong>Business as Usual</strong>, in which India acts deliberately on nothing, the dependency
        <em> deepens</em> to around 71 per cent as cloud migration and the incumbents&apos; AI advantage compound. Under
        an <strong>AI Leapfrog</strong>, in which India uses the build-cost collapse and its own advantages to assemble a
        sovereign AI-native stack, it falls to around 38 per cent. The same country, over the same decade, reaches either
        outcome depending on choices made before the window closes — and a Strategic Software Crisis, in which a
        geopolitical shock forces sovereignty by emergency at far higher cost, waits as the warning against delay.
      </p>

      <h2 id="the-opportunity">The sovereign opportunity</h2>
      <p>
        Against that exposure sits an opportunity the report sizes at roughly <strong>USD 51 billion</strong> — the
        central estimate of the sovereign-software market India could capture by 2035, within a total addressable
        enterprise-software-and-cloud market reaching around USD 169 billion. Of India&apos;s current foreign-software
        spending, an estimated <strong>USD 4.6–10.2 billion a year</strong> (central ~USD 7.4 billion) is realistically
        replaceable. And the report sizes the public cost of acting: a modelled <strong>₹68,000 crore (~USD 8 billion)
        Sovereign Software Mission over five years</strong> — cheaper than a single year of the foreign-IP outflow it
        would reduce, and paying for itself within about a year of operation. India has already proved it can build
        sovereign software at billion-user scale: Aadhaar, UPI and the MOSIP identity platform now exported abroad are
        the existence proof. The opportunity is not the creation of a capability from nothing; it is the extension of a
        proven one from India&apos;s citizen rails to its enterprise core.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        This online edition gives you the argument and the headline numbers. The complete ~170-page flagship edition
        gives you the proof a decision-maker needs: the full EDI, SSS and DIEM methodologies with every input, weight and
        sensitivity table; the sector-by-sector map of where SAP runs India, with the PSU deployments documented and
        labelled by source strength; the quantified strategic-risk simulations including the Russia-2022 withdrawal
        modelled against India; the cybersecurity and software-supply-chain exposure; the Indian-SaaS and open-source
        landscape in depth, including whether Zoho can become India&apos;s SAP; the AI-native enterprise-stack thesis; the
        sovereign-software TAM, import-replacement and Sovereign Software Mission cost models in full; the five DIEM
        scenarios with their causal chains and leading indicators; the four-actor strategic roadmap with moves sequenced
        around the 2027 deadline; and eight data appendices, including a top-vendor database. Twenty-two figures, twenty-one
        data tables, eight appendices.
      </p>
    </>
  );
}
