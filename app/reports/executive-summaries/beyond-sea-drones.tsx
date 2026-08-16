import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'beyond-sea-drones-india-autonomous-maritime-systems';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Techadyant_BeyondSeaDrones_Report%20_Free.pdf';

const FIG = '/reports/executive-summaries/beyond-sea-drones/';

const COVER = 'https://library.techadyant.com/covers/beyond_sea-drones-indian-navy.jpg';
const COVER_CAP = 'Edition cover · 136 pages · v2.0 (2026)';

const keyNumbers = [
  { val: '₹55,000 cr', label: '2035 market, Accelerated scenario (from ₹2,200 cr in 2026)', src: 'Techadyant Model — IN-003' },
  { val: '4.5 / 10', label: 'Maritime Autonomy Readiness Index — rank 9 of 12', src: 'Readiness Index — IN-014' },
  { val: '15%', label: 'AI compute silicon indigenous — the narrowest layer', src: 'Dependency Index — IN-061' },
  { val: '₹14,600 cr', label: 'Phase I (2026–30) total capital requirement', src: 'Recommendations — Ch 26' },
  { val: '238', label: 'Recommended platforms and builds by 2035', src: 'Force Structure — IN-018' },
  { val: '125', label: 'Tiered, evidence-labelled sources cited', src: 'Evidence Register — App K' },
];

const findings = [
  {
    h: 'Market trajectory',
    claim: <>The sector grows from a <Num>₹2,200 crore</Num> baseline in 2026 to <Num>₹55,000 crore</Num> by 2035 under the Accelerated scenario (<Num>55% CAGR</Num>), driven by attach economics in sensors, AI and software rather than hull volume.</>,
    src: 'Techadyant Model — IN-003; Ch 2',
  },
  {
    h: 'Readiness gap',
    claim: <>India ranks <Num>9th of 12</Num> with a composite <Num>4.5/10</Num>, trailing leaders in exports (<Num>3.0</Num>) and policy (<Num>4.0</Num>) while anchoring on sensors (<Num>6.0</Num>) via NPOL/BEL sonar.</>,
    src: 'Readiness Index — IN-014, IN-022; Ch 8',
  },
  {
    h: 'Subsystem dependency',
    claim: <>AI compute silicon is <Num>15%</Num> indigenous, battery cells <Num>35%</Num>, strategic-grade INS <Num>40%</Num> — a “hollow platform” risk, with China concentrating <Num>60–80%</Num> of supply in critical classes.</>,
    src: 'Dependency Index — IN-022–IN-061; Ch 20',
  },
  {
    h: 'ASW economics',
    claim: <>Autonomous architectures close ~<Num>50%</Num> of the widening ASW coverage gap (index <Num>100→175</Num> by 2035) at ~<Num>20%</Num> of equivalent manned cost.</>,
    src: 'ASW Analysis — IN-007, IN-014; Ch 5',
  },
  {
    h: 'Export window',
    claim: <>A <Num>$8–10 billion</Num> export TAM exists across ASEAN, Gulf and East African forces (2028–2034); <Num>6–10%</Num> capture equals <Num>₹6,500 crore/yr</Num> by 2035.</>,
    src: 'Export Thesis — IN-087; Ch 1',
  },
  {
    h: 'Value capture',
    claim: <>Value capture is highest in AI/software (<Num>75%</Num>), MRO (<Num>75%</Num>) and sensors (<Num>70%</Num>); lowest in edge compute (<Num>15%</Num>) — the semiconductor-dependent layer.</>,
    src: 'Value Capture Map — IN-003; Ch 13',
  },
];

const faqs = [
  {
    q: 'How big is India’s autonomous maritime systems market by 2035?',
    a: '₹11,500 crore (Constrained), ₹35,000 crore (Baseline) or ₹55,000 crore (Accelerated) by 2035, from a ₹2,200 crore 2026 baseline. The Accelerated case assumes a 2026–27 anchor-programme decision; the report sizes the ₹20,000 crore gap recoverable through early decisions.',
  },
  {
    q: 'Where does India stand in maritime autonomy today?',
    a: 'Rank 9/12 on the Maritime Autonomy Readiness Index with a composite 4.5/10. Fourteen active programmes and eight iDEX awards exist, but the subsystem base is 15–70% indigenous and there is no certification authority. The gap is industrial, not technological.',
  },
  {
    q: 'What are India’s critical gaps in USV/UUV subsystems?',
    a: 'AI silicon (~15% indigenous), battery cells (~35%), certification, and a 36–60 month procurement cycle versus 12–24 months for the US. The Dependency Index scores 40+ subsystems for sovereignty to separate strategic chokepoints from manageable ones.',
  },
  {
    q: 'What is the biggest autonomous maritime opportunity for India?',
    a: 'One hundred opportunities scored on the 9-dimension Opportunity Priority Index (OPI); 24 “Star” opportunities score 80+, led by an 11-metre ASW USV at 88. Twenty-five hidden opportunity surfaces sit in the supporting ecosystem — subsystems, test ranges, certification — not platforms.',
  },
  {
    q: 'Why is this report different from other market studies?',
    a: 'Every major claim is a numbered, verification-labelled citation [IN-XXX] against 125 sources across six source tiers. Fact, estimate, inference and forecast are visibly separated, and the full dataset ships in a 17-sheet Excel workbook mirroring appendices D–K.',
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
        headline: 'Beyond Sea Drones: India’s Maritime Autonomy, 2026–2035',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-15',
        dateModified: '2026-08-15',
        description:
          'Strategic intelligence on India’s autonomous maritime systems ecosystem: subsystem dependencies, market forecasts and an industrial roadmap, with 125 evidence-labelled sources.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: 'Beyond Sea Drones (Full Report)',
        description:
          '136-page strategic intelligence report with a 17-sheet Excel data workbook (Report + Data tier).',
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
          { '@type': 'ListItem', position: 3, name: 'Beyond Sea Drones', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

export function BeyondSeaDronesSummary() {
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
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.kicker}>Defence &amp; Dual-Use · Strategic Intelligence · v2.0 (2026)</div>
            <h1 className={styles.h1}>Beyond Sea Drones: India&rsquo;s Maritime Autonomy, 2026&ndash;2035</h1>
            <p className={styles.subtitle}>
              The subsystem, software and supply-chain map of the ₹55,000 crore opportunity — scored
              across 12 nations, 100 opportunities and 125 tiered sources.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>15 Aug 2026</b></span>
              <span>Domain <b>Defence &amp; Dual-Use</b></span>
              <span>Reading time <b>~6 min</b></span>
              <span>Last reviewed <b>15 Aug 2026</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="Beyond Sea Drones report cover" loading="eager" />
            <figcaption className={styles.coverCap}>{COVER_CAP}</figcaption>
          </figure>
        </div>
      </header>

      <section className={styles.section} id="thesis">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>01</span>
          <h2>The Thesis</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p className={styles.lead}>
          Techadyant Labs&rsquo; 2026 assessment finds India&rsquo;s autonomous maritime sector faces a
          structural &ldquo;subsystem gap&rdquo;: while hull fabrication is domestic, critical components like AI
          compute (<Num>15%</Num> indigenous) and battery cells (<Num>35%</Num>) remain import-dependent. The
          report forecasts a <Num>₹55,000 crore</Num> market by 2035, contingent on a{' '}
          <Num>~₹14,600 crore</Num> Phase I (2026–30) capital requirement. India ranks{' '}
          <Num>9th of 12</Num> nations on the Maritime Autonomy Readiness Index, with specific
          vulnerabilities in edge compute and energy storage threatening strategic sovereignty.
        </p>
      </section>

      <section className={styles.section} id="key-numbers">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>02</span>
          <h2>Key Numbers</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
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
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>03</span>
          <h2>Key Findings</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
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
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>04</span>
          <h2>The Framework</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.frameworkBox}>
          <p>
            The <strong>Maritime Autonomy Readiness Index</strong> scores 12 nations across nine weighted
            dimensions (platforms 15%, sensors 15%, AI 15%, communications 10%, propulsion 10%, energy
            10%, industrial base 15%, exports 10%, policy 10%) on a 0–10 scale. The{' '}
            <strong>Dependency Capture Framework</strong> maps the &ldquo;hollow platform&rdquo; risk: a hull may be
            Indian, but if the brains (silicon) and energy (cells) are imported, strategic sovereignty is
            compromised. Every number carries a FACT / ESTIMATE / INFERENCE / FORECAST symbol traceable
            to the 125-citation register.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig1.svg'} alt="Techadyant Strategic Chain: maritime threat to 2035 industrial outcome" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 — Techadyant Strategic Chain: maritime threat → MDA gap → demand → programmes → ecosystem → subsystems → 2035 outcome
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig6.svg'} alt="Revenue bridge from 2,200 to 55,000 crore by 2035" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 6 — Revenue Bridge: attach economics (sensors + AI + energy + MRO = ₹25,600 cr) outweigh the platform step; exports add ₹11,250 cr
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig17.svg'} alt="Readiness by dimension: India versus United States and China" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 17 — Per-Country Readiness Scorecard: India&rsquo;s narrowest gaps are sensors (6.0 vs 9.0) and AI; widest are exports (3.0) and policy (4.0)
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig37.svg'} alt="India Maritime Autonomy Dependency Index composite risk ranking" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 37 — India Maritime Autonomy Dependency Index: PMN-PT is 0% indigenous; AI silicon carries risk 9.5 with ~10-year substitution
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig9.svg'} alt="Three scenarios: 11,500, 35,000 and 55,000 crore by 2035" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 9 — Three Scenarios: the Baseline–Accelerated gap is recoverable through 2026–27 policy and capital decisions
          </figcaption>
        </figure>
      </section>

      <section className={`${styles.section} ${styles.impl}`} id="implications">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>05</span>
          <h2>What It Means</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p>
          <strong>For policymakers:</strong> the <Num>~₹14,600 crore</Num> Phase I requirement is not new
          money but a reallocation (~3% of MoD capital) that unlocks a 3–5x private-capital
          multiplier. Without the 2026 policy notification, the Karwar deep-water range (2027) and the
          Autonomous Systems Certification Authority (ASCA, 2027), the ecosystem remains fragmented.
        </p>
        <p>
          <strong>For industry:</strong> the value is in the stack, not the hull. Sensors (<Num>70%</Num>{' '}
          capture) and AI (<Num>75%</Num>) are the profit pools; edge compute (<Num>15%</Num>) is the
          vulnerability. Shipyards must pivot to primes integrating high-value subsystems, per the South
          Korea model.
        </p>
        <p>
          <strong>For investors:</strong> the Series B+ valley of death requires mandated sovereign
          co-investment (25–50%). Target IRRs: 14–18% sovereign-aligned, 25–35% growth VC,
          20–25% PE. The exit is strategic acquisition by DPSUs or global primes, not IPO.
        </p>
      </section>

      <section className={styles.section} id="tables">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>06</span>
          <h2>The Numbers, Tabulated</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Scenario comparison</caption>
            <thead>
              <tr><th>Scenario (prob.)</th><th>2035 market</th><th>CAGR</th><th>Startups</th><th>FTEs</th><th>Indigenisation</th><th>Rank</th></tr>
            </thead>
            <tbody>
              <tr><td>Constrained (25%)</td><td>₹11,500 cr</td><td>18%</td><td>50</td><td>12,000</td><td>45%</td><td>8–9</td></tr>
              <tr><td>Baseline (50%)</td><td>₹35,000 cr</td><td>42%</td><td colSpan={4}>Intermediate — real programmes, no ecosystem</td></tr>
              <tr><td>Accelerated (25%)</td><td>₹55,000 cr</td><td>55%</td><td>140+</td><td>38,000</td><td>78%</td><td>6</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Critical dependency classes</caption>
            <thead>
              <tr><th>Critical subsystem</th><th>Indigenous</th><th>China concentration</th><th>Composite risk</th></tr>
            </thead>
            <tbody>
              <tr><td>AI compute silicon</td><td>15%</td><td>80%</td><td>9.5</td></tr>
              <tr><td>Battery cells</td><td>35%</td><td>75%</td><td>9.0</td></tr>
              <tr><td>Encryption chips</td><td>45%</td><td>75%</td><td>8.5</td></tr>
              <tr><td>Strategic-grade INS</td><td>40%</td><td>30%</td><td>8.0</td></tr>
              <tr><td>Pressure-hull materials</td><td>35%</td><td>55%</td><td>7.5</td></tr>
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Top opportunities by OPI</caption>
            <thead>
              <tr><th>#</th><th>Opportunity</th><th>Domain</th><th>TRL</th><th>2035 market</th><th>OPI</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>11m ASW USV</td><td>Platform-surface</td><td>6</td><td>$420M</td><td>88</td></tr>
              <tr><td>2</td><td>LFP battery module</td><td>Energy</td><td>8</td><td>$480M</td><td>86</td></tr>
              <tr><td>3</td><td>Man-portable AUV</td><td>Platform-subsurface</td><td>6</td><td>$220M</td><td>84</td></tr>
              <tr><td>4</td><td>Maritime Perception AI</td><td>AI/Software</td><td>6</td><td>$320M</td><td>84</td></tr>
              <tr><td>5</td><td>Stabilised EO/IR payload</td><td>Sensor</td><td>8</td><td>$320M</td><td>84</td></tr>
              <tr><td>6</td><td>Battery management system</td><td>Energy</td><td>8</td><td>$220M</td><td>84</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} id="watch">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>07</span>
          <h2>What to Watch</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <ul className={styles.watchList}>
          <li><span className={styles.watchDate}>2026</span><div className={styles.watchText}>Notification of the <strong>Autonomous Maritime Industrial Policy</strong> and launch of the <Num>₹2,000 cr/yr</Num> Anchor Programme (2026–28), scaling to ₹4,200 cr/yr by 2030.</div></li>
          <li><span className={styles.watchDate}>2027</span><div className={styles.watchText}><strong>Karwar deep-water test range</strong> operational and the <strong>Autonomous Systems Certification Authority (ASCA)</strong> established.</div></li>
          <li><span className={styles.watchDate}>2028</span><div className={styles.watchText}><strong>MGR Mark II fleet</strong> (12 units) in service and indigenous PZT sonar transducers qualified at scale.</div></li>
          <li><span className={styles.watchDate}>2032</span><div className={styles.watchText}>First <strong>export order</strong> to an Indo-Pacific partner — validating the $8–10B TAM before the window closes in 2034.</div></li>
        </ul>
      </section>

      <section className={`${styles.section} ${styles.faq}`} id="faq">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>08</span>
          <h2>Frequently Asked Questions</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div className={styles.faqAnswer}><p>{f.a}</p></div>
          </details>
        ))}
      </section>

      <section className={`${styles.section} ${styles.sources}`} id="sources">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>09</span>
          <h2>Sources &amp; Methodology</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>
          Derived from <em>Beyond Sea Drones</em> v2.0 (2026). Evidence labels: [V] verified · [V1]
          single-source · [U] unverified · [modelled]. Primary sources:
        </p>
        <ol>
          <li>Ministry of Defence, <em>Annual Report 2024–25</em> [IN-056, IN-057]</li>
          <li>Indian Navy, <em>Maritime Perspective &amp; Capability Plan 2030</em> [IN-018]</li>
          <li>DRDO <em>Yearbook 2024</em>; NPOL/NSTL technical publications [IN-016, IN-020, IN-022]</li>
          <li>US Department of the Navy, <em>CNO Navigation Plan 2024</em>; UK MASS Regulatory Framework [IN-093, IN-048]</li>
          <li>Techadyant Labs proprietary models — Market sizing, Readiness Index, Dependency Index [IN-003, IN-014]</li>
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
            136-page PDF · ~3h read · 51 exhibits · 125 tiered citations · 17-sheet Excel
            workbook (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report — ₹6,999</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack — ₹9,999</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>27 pages — the thesis, the framework and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="27-page condensed edition (PDF)" />
          </div>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/signals/">Related signals</Link>
        <Link href="/briefings/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/reports/">All reports</Link>
        <Link href="/research/military-aerospace/">Military Aerospace</Link>
      </div>
    </div>
  );
}
