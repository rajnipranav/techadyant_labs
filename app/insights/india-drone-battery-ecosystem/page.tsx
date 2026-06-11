import type { Metadata } from 'next';
import Link from 'next/link';

const URL = 'https://labs.techadyant.com/insights/india-drone-battery-ecosystem/';
const TITLE = "Who Powers India's Drones? The Battery Dependency — and the Opportunity to Fix It";
const DESC = 'India imports ~80% of its drone-battery cells from China and captures barely 5–15% of pack value. An analysis of the dependency, the US$10.8bn opportunity, and the path to battery sovereignty.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  keywords: ['India drone batteries', 'drone battery supply chain', 'China battery dependency', 'high-C cells', 'BMS India', 'battery sovereignty', 'India drone battery market', 'Drone Battery Sovereignty Index'],
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Techadyant Labs', images: [{ url: '/covers/indias-drone-battery-ecosystem.jpg', alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/covers/indias-drone-battery-ecosystem.jpg'] },
};

const BRASS = '#C9A84C', TEAL = '#2BC5B4', CRIMSON = '#C8443B';

const FAQ: [string, string][] = [
  ['How dependent is India on China for drone batteries?', 'China controls roughly 78–84% of the lithium-ion cells and permanent magnets India’s drone fleet depends on, by customs value. There is no domestic aviation-grade high-C cell manufacturer and almost no buffer stock, so a single export halt could idle commercial and defence drone lines within weeks.'],
  ['How big is India’s drone battery market?', 'Techadyant Labs estimates the India-addressable drone-battery market at about US$10.8 billion by 2030, across defence, agriculture, logistics and mapping.'],
  ['How much of a drone battery’s value can India capture?', 'About 40%. The cell is roughly 60% of pack cost and ~100% imported, but the enclosure, thermal management, BMS firmware, analytics, integration and certification — the other ~40% — are capturable in India today, and carry the highest margins.'],
  ['What is the Drone Battery Sovereignty Index?', 'A 0–100 index scoring a country across the six battery value-chain layers. India scores 30 — last among major battery nations — but leads at the pack and software layers where margin concentrates.'],
  ['What should India do first to build battery sovereignty?', 'Capture the intelligent layer now — smart BMS, analytics, certification and recycling — which lifts value capture from ~5% to 35–40% without first solving cell manufacturing. Cell and material sovereignty are a parallel, longer-horizon national programme.'],
];

const articleLd = {
  '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESC,
  author: { '@type': 'Organization', name: 'Techadyant Labs' },
  publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
  datePublished: '2026-06-11', dateModified: '2026-06-11', mainEntityOfPage: URL,
  about: ['India drone batteries', 'battery sovereignty', 'drone supply chain'],
  image: 'https://labs.techadyant.com/covers/indias-drone-battery-ecosystem.jpg',
};
const faqLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function TeardownFigure() {
  const seg = [{ pct: 60, c: CRIMSON }, { pct: 15, c: BRASS }, { pct: 15, c: TEAL }, { pct: 10, c: TEAL }];
  let x = 60;
  return (
    <figure className="insight-fig">
      <svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pack value split: 60 percent imported cell, 40 percent capturable in India">
        {seg.map((s, i) => { const w = (s.pct / 100) * 640; const g = (<g key={i}><rect x={x} y={50} width={w} height={54} fill={s.c} /><text x={x + w / 2} y={82} fontSize={12} fontWeight={700} fill="#0F1828" textAnchor="middle">{s.pct}%</text></g>); x += w; return g; })}
        <text x={60} y={36} fontSize={13} fontWeight={600} fill="#E8E8F0">US$1,000 pack to OEM</text>
        <line x1={60} y1={118} x2={444} y2={118} stroke={CRIMSON} strokeWidth={3} /><text x={252} y={138} fontSize={12} fill={CRIMSON} textAnchor="middle" fontWeight={700}>60% imported cell</text>
        <line x1={444} y1={118} x2={700} y2={118} stroke={TEAL} strokeWidth={3} /><text x={572} y={138} fontSize={12} fill={TEAL} textAnchor="middle" fontWeight={700}>~40% capturable in India</text>
      </svg>
      <figcaption>The cell is ~60% of a drone pack and ~100% imported; the other ~40% is where India can compete.</figcaption>
    </figure>
  );
}
function DbsiFigure() {
  const rows = [['China', 85, BRASS], ['South Korea', 75, TEAL], ['Japan', 72, TEAL], ['United States', 68, TEAL], ['Taiwan', 60, TEAL], ['India', 30, CRIMSON]] as const;
  return (
    <figure className="insight-fig">
      <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Drone Battery Sovereignty Index by country, India 30 of 100">
        {rows.map((r, i) => { const y = 24 + i * 44; const w = ((r[1] as number) / 100) * 470; return (<g key={i}><text x={18} y={y + 20} fontSize={13} fontWeight={600} fill="#E8E8F0">{r[0]}</text><rect x={180} y={y} width={w} height={28} rx={3} fill={r[2] as string} /><text x={180 + w + 10} y={y + 21} fontSize={13} fontWeight={700} fill="#E8E8F0" fontFamily="monospace">{r[1]}</text></g>); })}
        <text x={180} y={290} fontSize={11} fill="#8A8AA0" fontFamily="monospace">DBSI 0–100 · Techadyant Labs model</text>
      </svg>
      <figcaption>India scores 30/100 on the Drone Battery Sovereignty Index — last among major battery nations.</figcaption>
    </figure>
  );
}

export default function InsightArticle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <article className="insight-article wrap-narrow">
        <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><Link href="/insights">Insights</Link><span className="sep">/</span><span>Drone batteries</span></div>
        <div className="ed-kicker">Analysis · Defence &amp; Dual-Use</div>
        <h1>{TITLE}</h1>
        <p className="insight-sub">India is building a world-class drone industry on an imported energy core. Here is the dependency, the opportunity, and the decision.</p>
        <div className="insight-byline">By Techadyant Labs · India-first strategic intelligence · June 2026 · ~12 min read</div>

        <p className="insight-lede">Of every &#8377;100 of value an Indian drone OEM earns, more than &#8377;50 leaves the country for a concentrated, overwhelmingly Chinese, battery supply chain. India scores just 30 out of 100 on the Drone Battery Sovereignty Index. Yet the path out is counter-intuitive: India does not need to win cell manufacturing first to start winning.</p>

        <div className="insight-stats">
          <div><b>~80%</b><span>of drone-battery cells &amp; magnets imported from China</span></div>
          <div><b>$10.8bn</b><span>India-addressable market by 2030 (modelled)</span></div>
          <div><b>5–15%</b><span>of pack value India captures today</span></div>
          <div><b>30/100</b><span>India&apos;s Sovereignty Index score</span></div>
        </div>

        <h2>Why does the battery decide India&apos;s drone race?</h2>
        <p>Drones are now decisive infrastructure, and their single point of failure is energy. A drone&apos;s airframe and software can be Indian; if its battery cannot be sourced, the platform does not fly. The binding requirement is not energy density alone but high-rate (high-C) discharge — delivering power instantly at 15–25C without thermal runaway. This is precisely the cell class India does not make, and the EV-focused PLI scheme does not reward.</p>

        <h2>Where does the value in a drone battery actually sit?</h2>
        <p>The cell is roughly 60% of a pack&apos;s cost and is essentially 100% imported. The remaining ~40% — enclosure, thermal management, high-current connectors, BMS firmware, analytics, integration and certification — is where India can compete today, and where the margins are highest.</p>
        <TeardownFigure />

        <h2>How dependent is India on China for drone batteries?</h2>
        <p>China controls roughly 78–84% of the lithium-ion cells and permanent magnets the Indian drone fleet depends on, by customs value. Concentration, not price, is the risk: a single administrative export halt could idle commercial and defence drone lines within weeks, because high-C cells have a 100–200 cycle life and almost no domestic buffer stock exists. The opacity is itself part of the finding — a drone motor and a washing-machine motor share an HS code, so customs data prove the dependence but not its end-use.</p>

        <h2>Why does India keep losing the component layer?</h2>
        <p>India has seen this before. In semiconductors it supplies world-class design talent yet fabricates almost no silicon; in solar it built module-assembly capacity while importing cells, wafers and polysilicon; in telecom it ran imported equipment for two decades. The through-line is structural: India wins the layer that rewards talent and integration and loses the layer that demands patient capital and demand aggregation. The drone battery is small enough to fix and strategic enough to matter — the right place to break the pattern.</p>

        <h2>What is the opportunity — and how big is it?</h2>
        <p>The India-addressable prize is about US$10.8 billion by 2030. The investable near-term pools are the intelligent and service layers — smart BMS and analytics (~&#8377;3,200 Cr), recycling (~&#8377;2,500 Cr), thermal systems (~&#8377;1,500 Cr) and certification (~&#8377;1,200 Cr) — defensible under Indian jurisdiction and reaching software-like margins. A 1 GWh cell plant, by contrast, is a patient &#8377;590–1,100 crore national bet.</p>

        <h2>How should India score its battery sovereignty? The DBSI</h2>
        <p>The Drone Battery Sovereignty Index scores a country 0–100 across the six value-chain layers. India&apos;s composite of 30 is built on strong packs and software — a far better starting position than 30 built on minerals alone.</p>
        <DbsiFigure />

        <h2>What should government, investors and founders do?</h2>
        <p>Sequence capital by readiness, not ambition. Phase 1 monetises the intelligent layer India already leads; Phase 2 builds the moat in recycling, thermal IP and a sodium-ion pilot; Phase 3 earns sovereignty in materials and cells. For government, the highest-leverage move is a domestic-value pass-through condition on defence offtake, paired with capex-weighted incentives for the high-power cell the PLI scheme ignores. The window is the next twenty-four months.</p>

        <section className="insight-faq">
          <h2>Frequently asked questions</h2>
          <dl>
            {FAQ.map(([q, a], i) => (<div key={i}><dt>{q}</dt><dd>{a}</dd></div>))}
          </dl>
        </section>

        <div className="insight-cta">
          <h3>Read the full strategic-intelligence report</h3>
          <p>The complete ~145-page report adds nine chapters, six proprietary frameworks, thirty-plus figures, a ten-chart CXO dashboard, six appendices, and a companion Excel data pack.</p>
          <Link className="btn-ed btn-ed-primary" href="/reports/indias-drone-battery-ecosystem">Read the full report <span className="arr">→</span></Link>
        </div>
      </article>
    </>
  );
}
