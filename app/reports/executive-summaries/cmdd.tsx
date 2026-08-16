import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'india-critical-manufacturing-dependencies';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/India-Critical-Manufacturing-Dependencies-2026-Free-Edition.pdf';

const FIG = '/reports/executive-summaries/india-critical-manufacturing-dependencies/';

const keyNumbers = [
  { val: '$506B', label: 'Strategic import surface — ~75% of the $672B annual merchandise bill', src: 'UN Comtrade + DGCI&S — Verified' },
  { val: '312', label: 'Localisable opportunity surfaces across 12 mega-sectors', src: 'CMDD Database — Edition I' },
  { val: '$480B', label: 'Localisation capex envelope, FY2026–35 (8.6% of $5.6T imports)', src: 'Techadyant Model — Ch 10' },
  { val: '2.9%', label: 'India’s share of global manufacturing value added ($470B)', src: 'UNIDO / World Bank — Verified' },
  { val: '88 / 18', label: 'PLI utilisation — mobile manufacturing vs semiconductors', src: 'MeitY / MoC disclosures FY2024' },
  { val: '10', label: 'Proprietary indices, incl. CMDI, LPI, IAI', src: 'CMDD Framework — Ch 3' },
];

const findings = [
  {
    h: 'Chokepoints before volume',
    claim: <>India imports <Num>$4.8B/yr</Num> of 7nm-and-below logic chips, every one from TSMC, Samsung or SMIC. A Taiwan-Strait event could <Num>collapse Indian electronics, auto, telecom and defence within 90 days</Num>. A $400M single-source import outranks a $4B commodity.</>,
    src: 'Imperative 1 — Verified',
  },
  {
    h: 'The stack, not the assembly',
    claim: <>A phone assembled in India captures <Num>6–8%</Num> of factory-gate value; the rest accrues to components, IP and equipment abroad. The next decade must descend the stack: assembly → components → materials → machinery → test infrastructure.</>,
    src: 'Imperative 2 — Verified',
  },
  {
    h: 'Twelve executable zones',
    claim: <>Capital concentrates on <Num>12 opportunity zones</Num> with capex from <Num>$200M</Num> (mobile assembly) to <Num>~$11B</Num> (a 28nm logic fab — Tata–PSMC, Dholera), where latent capability and demand-side scale overlap.</>,
    src: 'Imperative 3 — Ch 7',
  },
  {
    h: 'Capability, not incentives',
    claim: <>PLI utilisation runs <Num>88% in mobile</Num> but <Num>18% in semiconductors</Num> — despite the ₹76,000 cr (~$10B) semicon PLI, the largest single outlay. A subsidy cannot operate a fab without photoresist, lithography, engineers and IP.</>,
    src: 'Imperative 5 — MeitY FY2024',
  },
  {
    h: 'The cluster gap',
    claim: <>India’s strongest clusters (Bengaluru, Chennai, Pune, Hyderabad) score <Num>below 80</Num> on the Ecosystem Density Index; global frontiers (Hsinchu, Shenzhen, Stuttgart, Suwon) score <Num>above 90</Num>. The deficit is Tier-2/3 suppliers and test infrastructure.</>,
    src: 'Imperative 4 — Ch 5',
  },
  {
    h: 'Cost-parity discipline',
    claim: <>Two rules govern every target: <Num>cost-parity</Num> (a localised product that never reaches competitive cost is a permanent subsidy) and a <Num>subsidy-exit condition</Num>. Otherwise dependency simply relocates onto the exchequer.</>,
    src: 'Two Disciplines — Exec Summary',
  },
];

const faqs = [
  {
    q: 'What is the Critical Manufacturing Dependency Index?',
    a: 'The CMDI is a 0–100 score of how strategically import-dependent India is for a product, weighting import value, supply risk, strategic importance, industrial multiplier and substitutability. It ranks by strategic danger rather than import value, so single-source chokepoints surface above large commodities.',
  },
  {
    q: 'How many products does the report cover?',
    a: 'The report identifies, scores and decomposes 312 strategic opportunity surfaces across twelve mega-sectors, drawn from roughly $506 billion of strategic imports within India’s $672 billion annual merchandise import bill.',
  },
  {
    q: 'What are India’s deepest manufacturing dependencies?',
    a: 'The deepest combine high import value, concentrated foreign supply and near-zero domestic capability: EUV photoresist, leading-edge logic chips (7nm and below), combat aero-engines, and DRAM and NAND memory. Every one is effectively single-source.',
  },
  {
    q: 'How much capital would localisation require?',
    a: 'Roughly $480 billion of largely private, phased capital over 2026–2035, concentrated on twelve executable opportunity zones — set against about $5.6 trillion of strategic imports over the same period if current trajectories continue.',
  },
  {
    q: 'What are the twelve opportunity zones?',
    a: 'Semiconductors and display (Dholera, Hosur), Li-ion cells (Chennai–Hosur–Sri City), solar wafers and cells (Mundra, Visakhapatnam), defence aerospace (Bengaluru, Hyderabad), medical devices (Ahmedabad, Hyderabad), specialty chemicals (Ankleshwar–Vadodara, Vapi), CNC machine tools (Bengaluru, Coimbatore), green hydrogen electrolysers (Mundra, Paradip), wind gearboxes (Chennai, Mundra), telecom/5G (Sri City, Manesar), EV power electronics (Pune, Sanand), and pharma APIs (Hyderabad, Vizag).',
  },
  {
    q: 'Does the report address the subsidy trap?',
    a: 'Yes — it is treated as the most serious objection. Every target carries a cost-parity and subsidy-exit condition: the test is not whether India can make a thing, but whether it can make it at a cost a downstream buyer would choose unsubsidised within a defined horizon.',
  },
];

function Num({ children }: { children: React.ReactNode }) {
  return <span className={styles.findingNum}>{children}</span>;
}

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Techadyant Labs',
        url: 'https://labs.techadyant.com',
        logo: 'https://labs.techadyant.com/assets/logo.png',
      },
      {
        '@type': 'Report',
        headline: 'India’s Critical Manufacturing Dependencies, 2026–2035',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-01',
        dateModified: '2026-08-01',
        description:
          'Strategic industrial intelligence on India’s $506B strategic import surface: 312 localisable opportunity surfaces across twelve mega-sectors, CMDI-scored, with a $480B localisation envelope.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: 'India’s Critical Manufacturing Dependencies (Full Report)',
        description:
          '132-page strategic intelligence report with the CMDD database and full appendices (Report + Data tier).',
        offers: {
          '@type': 'Offer',
          price: '6999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://labs.techadyant.com' + REPORT_URL,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://labs.techadyant.com' },
          { '@type': 'ListItem', position: 2, name: 'Reports', item: 'https://labs.techadyant.com/reports/' },
          { '@type': 'ListItem', position: 3, name: 'India’s Critical Manufacturing Dependencies', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const topTen = [
  ['Li-ion cell manufacturing (50+ GWh)', 'EV & Battery', 82, 85, 88, '$8B'],
  ['Solar wafer & cell (top-3 global)', 'Renewable Energy', 78, 78, 82, '$6B'],
  ['CNC 5-axis machine tools (Tier-2)', 'Industrial Machinery', 75, 70, 88, '$3B'],
  ['Specialty steel (40 critical grades)', 'Specialty Materials', 72, 80, 70, '$5B'],
  ['EV power electronics (inverters, OBC)', 'EV & Battery', 78, 72, 90, '$4B'],
  ['Pharma API backward integration (50+)', 'Specialty Chemicals', 70, 80, 70, '$3B'],
  ['Green hydrogen electrolysers (1 GW+)', 'Renewable Energy', 68, 82, 80, '$5B'],
  ['Medical device assembly (MRI, CT, implants)', 'Medical Devices', 70, 75, 78, '$3B'],
  ['Wind turbine gearbox & generator', 'Renewable Energy', 65, 78, 72, '$2B'],
  ['Compound semiconductors (SiC, GaN)', 'Semiconductors', 85, 62, 80, '$12B'],
];

const chokepoints = [
  ['EUV photoresist', 'Single-source: JSR / Tokyo Ohka / Shin-Etsu (Japan)', 'Near-zero', 'Extreme'],
  ['Leading-edge logic ≤7nm', '$4.8B/yr; TSMC / Samsung / SMIC only', 'None at scale', 'Extreme'],
  ['Combat aero-engines', 'Concentrated OEM supply; multi-year lead times', 'Fleet under development', 'High'],
  ['DRAM & NAND memory', '3 suppliers; ~90%+ Korea/China capacity', 'None at scale', 'High'],
];

const watch = [
  { date: 'FY26–27', text: <><strong>CMDD Edition I baseline</strong> — first annual read of the 312-surface register; watch which zones clear feasibility and which stall on water, power and land constraints.</> },
  { date: 'FY2030', text: <>Localisation unlocks a <strong>$215B export potential</strong>; mobile, pharma, autos and EV components are the highest-potential categories.</> },
  { date: '2032', text: <>With execution, India can become the <strong>third-largest manufacturing economy</strong>.</> },
  { date: '2035', text: <>Without action, the annual strategic import bill <strong>exceeds $1.2 trillion (~18% of projected GDP)</strong> — a perpetual structural deficit driven by intermediates and capital goods.</> },
];

export function CmddSummary() {
  return (
    <div className={styles.sumWrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Link href={REPORT_URL} className={styles.backLink}>
        ← Back to the full report
      </Link>

      <header className={styles.hero}>
        <div className={styles.kicker}>Industrial Intelligence · Strategic Import Dependencies · Edition I</div>
        <h1 className={styles.h1}>India&rsquo;s Critical Manufacturing Dependencies, 2026&ndash;2035</h1>
        <p className={styles.subtitle}>
          The $506 billion strategic import surface, decomposed into 312 localisable opportunity
          surfaces — and the ~$480 billion, largely private envelope to close it.
        </p>
        <div className={styles.metaRow}>
          <span>Published <b>01 Aug 2026</b></span>
          <span>Domain <b>Industrial Intelligence</b></span>
          <span>Reading time <b>~6 min</b></span>
          <span>Last reviewed <b>01 Aug 2026</b></span>
          <span>Author <b>Techadyant Labs · Research</b></span>
        </div>
      </header>

      <section className={styles.section} id="thesis">
        <h2>The Thesis</h2>
        <p className={styles.lead}>
          India does not have an import problem; it has an <strong>industrial-capability problem
          disguised as one</strong>. Every import line is a fingerprint of capability that does not yet
          exist at scale, quality or competitive cost — an opportunity surface, not an accounting
          entry. The Critical Manufacturing Dependency Index ranks the <Num>$506B</Num> strategic
          surface by danger, not value: localise the single-source chokepoints first, descend the
          industrial stack, and concentrate capital on <Num>12 executable zones</Num> within a{' '}
          <Num>$480B</Num> FY2026–35 envelope — 8.6% of the <Num>$5.6T</Num> import bill it displaces.
        </p>
      </section>

      <section className={styles.section} id="key-numbers">
        <h2>Key Numbers</h2>
        <div className={styles.statsGrid}>
          {keyNumbers.map((s) => (
            <div className={styles.statCard} key={s.label}>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSrc}>{s.src}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="findings">
        <h2>Key Findings</h2>
        <div className={styles.findingsGrid}>
          {findings.map((f) => (
            <div className={styles.findingCard} key={f.h}>
              <h3>{f.h}</h3>
              <p className={styles.findingClaim}>{f.claim}</p>
              <span className={styles.findingSrc}>[{f.src}]</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="framework">
        <h2>The Framework</h2>
        <div className={styles.frameworkBox}>
          <p>
            The <strong>Critical Manufacturing Dependency Framework</strong> scores every strategically
            important imported product on ten proprietary indices — CMDI, LPI, IAI, SCI, TRI, EPI,
            SRI, IMI, NSRI and ICGI — each fully documented with formula, weightages and a worked
            example. Every product decomposes through a <strong>five-level taxonomy</strong> (finished
            product → subsystems → components → materials → machinery/test), because each layer is
            a distinct industrial opportunity. Every figure carries one of three confidence markers:{' '}
            <strong>Verified Fact</strong> (two+ independent primary sources), <strong>Reasoned
            Estimate</strong>, or <strong>Strategic Inference</strong> (documented, labelled). No invented
            data; no false precision.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-cmdi.svg'} alt="CMDI scoring chain: five factors to localisation priority" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 — The CMDI chain: import value, supply risk, strategic importance, industrial
            multiplier and substitutability score 0–100, ranking by strategic danger — not import value.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-top10.svg'} alt="Top-10 opportunity surfaces by CMDI score" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 — Top-10 opportunity surfaces by CMDI. Compound semiconductors (85) and Li-ion
            cells (82) rank highest on strategic danger; capex runs $2–12B each.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-mva.svg'} alt="Manufacturing value added: India vs Korea, US, China" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 — India&rsquo;s MVA: $470B (2.9% of global) — less than Italy&rsquo;s, marginally behind
            South Korea&rsquo;s $530B, a fifth of the US, a sixteenth of China.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-pli.svg'} alt="PLI utilisation: 88% mobile vs 18% semiconductors" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 — PLI utilisation: 88% in mobile manufacturing vs 18% in semiconductors — the gap
            is capability, not incentive size.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-envelope.svg'} alt="480 billion capex envelope vs 5.6 trillion imports" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 — The envelope: ~$480B capex displaces ~$5.6T of strategic imports over
            FY2026–35 — 8.6%, economically rational before multipliers.
          </figcaption>
        </figure>
      </section>

      <section className={`${styles.section} ${styles.impl}`} id="implications">
        <h2>What It Means</h2>
        <p>
          <strong>For policymakers:</strong> shift from incentive deployment to capability building.
          The ₹76,000 cr semiconductor PLI cannot operate a 28nm fab without photoresist, lithography,
          process engineers and IP — the register, cluster maps and technology roadmaps in this
          report are the prerequisite. Attach a subsidy-exit condition to every scheme.
        </p>
        <p>
          <strong>For industry:</strong> value capture is downstream of assembly. Descent of the stack
          — components, specialty materials, machinery, test infrastructure — is where the industrial
          multiplier lives; the twelve zones name the clusters and the products.
        </p>
        <p>
          <strong>For investors:</strong> the ~$480B envelope is overwhelmingly private and phased
          (~$48B/yr, under 10% of the annual bill it displaces). ROI multiples are highest in specialty
          chemicals, pharma APIs and EV power electronics; semiconductors and display carry the lowest
          direct multiple but the highest strategic and multiplier benefit.
        </p>
      </section>

      <section className={styles.section} id="tables">
        <h2>The Numbers, Tabulated</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Top ten opportunity surfaces with CMDI, LPI, IAI and capex</caption>
            <thead>
              <tr><th>#</th><th>Opportunity surface</th><th>Sector</th><th>CMDI</th><th>LPI</th><th>IAI</th><th>Capex</th></tr>
            </thead>
            <tbody>
              {topTen.map((r, i) => (
                <tr key={r[0]}>
                  <td>{i + 1}</td>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Deepest dependency chokepoints</caption>
            <thead>
              <tr><th>Chokepoint</th><th>Supply concentration</th><th>Domestic capability</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {chokepoints.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} id="watch">
        <h2>What to Watch</h2>
        <ul className={styles.watchList}>
          {watch.map((w) => (
            <li key={w.date}>
              <span className={styles.watchDate}>{w.date}</span>
              <div className={styles.watchText}>{w.text}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.section} ${styles.faq}`} id="faq">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div className={styles.faqAnswer}><p>{f.a}</p></div>
          </details>
        ))}
      </section>

      <section className={`${styles.section} ${styles.sources}`} id="sources">
        <h2>Sources &amp; Methodology</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
          Derived from <em>India&rsquo;s Critical Manufacturing Dependencies</em> Edition I (2026).
          Confidence markers: Verified Fact / Reasoned Estimate / Strategic Inference. Primary sources:
        </p>
        <ol>
          <li>UN Comtrade + DGCI&amp;S trade data, FY2024 [Verified]</li>
          <li>Ministry of Commerce; Ministry of Electronics &amp; IT disclosures on PLI utilisation, FY2024</li>
          <li>Company annual reports and regulatory filings (fab, cell, machinery projects)</li>
          <li>Techadyant Labs proprietary models — CMDI, LPI, IAI and seven companion indices [CMDD Database]</li>
        </ol>
        <p style={{ marginTop: 18 }}>
          <Link href="/research/methodology/" style={{ color: 'var(--gold)' }}>
            Read the full methodology and scoring rubrics →
          </Link>
        </p>
      </section>

      <div className={styles.conversionGrid}>
        <div className={styles.buyCard}>
          <h3>Get the Full Report</h3>
          <div className={styles.price}>₹6,999</div>
          <p>
            132-page PDF · 13 chapters · 46 tables · 30 figures · full CMDD database and
            appendices (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report — ₹6,999</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack — ₹11,999</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>16 pages — the thesis, the framework and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="16-page condensed edition (PDF)" />
          </div>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/reports/">All reports</Link>
        <Link href="/signals/">Related signals</Link>
        <Link href="/briefings/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/research/military-aerospace/">Military Aerospace</Link>
      </div>
    </div>
  );
}
