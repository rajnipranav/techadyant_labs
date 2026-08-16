import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'indian-navy-autonomous-maritime';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Indian_Navy_Autonomous_Maritime_Free.pdf';

const FIG = '/reports/executive-summaries/indian-navy-autonomous-maritime/';

const COVER = 'https://library.techadyant.com/covers/Indian_Navy_Autonomous_Maritime.jpg';
const COVER_CAP = 'Edition cover · 153 pages · Edition 1';

const keyNumbers = [
  { val: '2.6 / 4.5', label: 'Autonomous naval readiness vs US benchmark (0-5; 2035 target 4.3)', src: 'Strategic Posture Map - Ch 1' },
  { val: '9 / 10', label: 'Semiconductor dependency on US/Taiwan; 0/10 domestic at advanced nodes', src: 'Dependency Matrix - Ch 10' },
  { val: '₹1.2 lakh cr', label: 'Cumulative 2026-2035 autonomous maritime market', src: 'Techadyant Model - Ch 11/12' },
  { val: '80+ / 25+ / 180+', label: 'USVs / UUVs incl. XLUUVs / naval UAVs by 2035 (Autonomous Power)', src: '2035 Scenario - Ch 12' },
  { val: '12-18k', label: 'Engineer and technician deficit by 2030 under business-as-usual', src: 'Workforce - Ch 8' },
  { val: '58 / 9', label: 'Ranked opportunity surfaces; 9 Strategic Anchors = 60% of public investment', src: 'Opportunity Matrix - Ch 11' },
];

const findings = [
  {
    h: 'Platforms are downstream of ecosystems',
    claim: <>India scores <Num>3.8</Num> in platform design and <Num>4.0</Num> in marine engineering - but <Num>2.4</Num> in autonomy software, <Num>2.0</Num> in manned-unmanned teaming and <Num>2.2</Num> in test and certification. More USVs, UUVs and XLUUVs without proportionate substrate investment yield <Num>diminishing returns</Num>.</>,
    src: 'Posture Map - Ch 1',
  },
  {
    h: 'The semiconductor wall',
    claim: <>India&rsquo;s dependency on US/Taiwan for marine-grade FPGAs, RF integrated circuits and AI-edge NPUs is <Num>9/10</Num>, with <Num>0/10</Num> domestic capability at advanced nodes. The SCL 28nm fab is <Num>existential</Num>; the C-DAC NPU programme must triple in budget.</>,
    src: 'Dependency Matrix - Ch 10',
  },
  {
    h: 'A ₹1.2 lakh crore market, anchored',
    claim: <>Cumulative 2026-2035 market of <Num>~₹1.2 lakh crore</Num>; <Num>₹15,000+ crore</Num> annual revenue by 2035, of which <Num>₹5,000+ crore</Num> is export. Nine Strategic Anchors - XLUUV hull and energy, autonomy middleware, marine lithium cells, AIP, sonar transducers, quantum INS, MUM-T mission system, navigation-grade IMU, battery management IC - absorb <Num>~60% of public investment</Num>.</>,
    src: 'Ch 11 / Ch 12',
  },
  {
    h: 'MUM-T is the leverage',
    claim: <>Without manned-unmanned teaming, India will have <Num>platforms without force multiplication</Num>. MUM-T scores 2.0 vs the US benchmark of 4.2. The report recommends a <Num>MUM-T Mission System programme office by 2027</Num>, with sovereign IP non-negotiable.</>,
    src: 'Ch 6 / Ch 1',
  },
  {
    h: 'The default is not Autonomous Power',
    claim: <>Four 2035 scenarios: <Num>Autonomous Power 30%</Num> (recommended), <Num>Indigenous but Inefficient 35%</Num> (default), Incremental Importer 20%, Drift and Dependency 15%. Shifting trajectory requires <Num>DGQA reform, fab acceleration and iDEX budget tripling</Num>.</>,
    src: 'Ch 12',
  },
  {
    h: '2026-2028 is non-recoverable',
    claim: <>The foundation window: Autonomous Warfare Inspectorate (2026), MUM-T doctrine (2026), DRDO middleware consortium with sovereign IP (2026-27), <Num>₹2,000 cr Quantum INS</Num> at RRI/IISc (2026-27). Substrate build-out takes <Num>5-7 years</Num>; delay past 2028 forecloses the recommended trajectory.</>,
    src: 'Ch 1 / Ch 12',
  },
];

const faqs = [
  {
    q: 'How ready is the Indian Navy for autonomous operations?',
    a: "India scores 2.6/5 on the Techadyant Strategic Posture Map - a 'developing' posture - against a US Navy benchmark of 4.5 and an Indian 2035 target of 4.3. The gap is ~1.9 points, requiring ~6.4% compound annual improvement per dimension across eight dimensions. The weakest dimensions are autonomy software (2.4), MUM-T (2.0) and test and certification (2.2).",
  },
  {
    q: 'What are the three binding constraints?',
    a: 'Semiconductor access (9/10 dependency on US/Taiwan, 0/10 domestic at advanced nodes - marine-grade FPGAs, RF ICs, AI-edge NPUs); test-and-certification throughput (DGQA/CemILAC are platform-centric and lack the software-iteration cadence autonomous systems need); and skilled workforce (a 12,000-18,000 engineer and technician deficit by 2030 under business-as-usual).',
  },
  {
    q: 'What is the market opportunity?',
    a: 'A cumulative ~₹1.2 lakh crore autonomous maritime market over 2026-2035 under the Autonomous Power scenario - 80+ USVs, 25+ UUVs including XLUUVs, and 180+ naval UAVs by 2035 - with ₹15,000+ crore in annual revenue by 2035, of which ₹5,000+ crore is export. The Maritime Opportunity Surface Matrix ranks 58 industrial opportunity surfaces.',
  },
  {
    q: 'What are the nine Strategic Anchors?',
    a: 'XLUUV hull and energy, autonomy middleware, marine lithium cells, AIP for UUVs, sonar transducers, quantum INS, MUM-T mission system, navigation-grade IMU, and battery management IC. Each has a weighted score above 7.5 and strategic importance above 8.0; the nine should collectively absorb approximately 60% of public investment in the sector over 2026-2030.',
  },
  {
    q: 'Why is 2026-2028 the critical window?',
    a: 'The industrial substrate takes 5-7 years to build, and the foundation period is non-recoverable. Key decisions in the window: stand up an Autonomous Warfare Inspectorate, publish a MUM-T doctrine, anchor a DRDO-led autonomy middleware consortium with sovereign IP, triple the iDEX budget, launch SCL 28nm fab construction, create a DGQA fast-track certification path, establish five Centres of Excellence, and anchor a ₹2,000 cr Quantum INS programme at RRI/IISc.',
  },
  {
    q: 'What happens without intervention?',
    a: "The default trajectory is 'Indigenous but Inefficient' (35% probability): strong indigenisation intent but slow scale-up, cost overruns and limited export traction, leaving India dependent on imports for its most advanced autonomous systems through 2035 - while the PLAN's USV/UUV capability gap (2-3 points in 2026) continues to widen.",
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
        headline: "The Indian Navy's Autonomous Maritime Transformation, 2026-2035",
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-02',
        dateModified: '2026-08-02',
        description:
          'Strategic intelligence on the Indian Navy autonomous transformation: readiness 2.6/5 vs US 4.5, a ~Rs 1.2 lakh crore market, and three binding substrate constraints - semiconductors, certification, workforce.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: "The Indian Navy's Autonomous Maritime Transformation 2026-2035 (Full Report)",
        description:
          '153-page strategic intelligence report with the autonomous maritime data workbook and full appendices (Report + Data tier).',
        offers: {
          '@type': 'Offer',
          price: '5900',
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
          { '@type': 'ListItem', position: 3, name: "The Indian Navy's Autonomous Maritime Transformation 2026-2035", item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const scenarios = [
  ['Autonomous Power (recommended)', '30%', 'Aggressive indigenous scale-up: 80+ USVs, 25+ UUVs incl. XLUUVs, 180+ naval UAVs; ₹15,000+ cr annual revenue by 2035'],
  ['Indigenous but Inefficient (default)', '35%', 'Strong indigenisation intent, slow scale-up, cost overruns, limited export traction'],
  ['Incremental Importer', '20%', 'Continued imports, reduced autonomy ambition'],
  ['Drift and Dependency', '15%', 'Slow pace, persistent imports, lost regional edge'],
];

const dependencies = [
  ['Semiconductors', '8-10', 'US / Taiwan', 'Marine-grade FPGAs, RF ICs, AI-edge NPUs; 9/10 dependency, 0/10 domestic at advanced nodes'],
  ['AI compute', '8-10', 'US', 'Training and edge inference capacity for fleet AI'],
  ['Marine sensors', '8-10', 'France / Israel', 'Sonar transducers (France); sensors, EW and autonomy IP (Israel)'],
  ['Rare-earth magnets (NdFeB)', 'Material', 'China', 'Marine propulsion and sonar transducers'],
  ['Scandium (advanced alloys)', 'Material', 'China', 'Lightweight alloys for hull and structures'],
];

const watch = [
  { date: '2026', text: <><strong>Foundation decisions due</strong> - Autonomous Warfare Inspectorate, unclassified MUM-T doctrine, DGQA fast-track certification path for autonomous systems.</> },
  { date: '2026-27', text: <>SCL <strong>28nm fab construction</strong> launch; DRDO autonomy middleware consortium with <strong>sovereign IP clause</strong>; <strong>₹2,000 cr Quantum INS</strong> anchored at RRI/IISc; five Centres of Excellence (IITB, IITM, IISc, IITD, INSE); iDEX budget tripled.</> },
  { date: '2027-28', text: <>L&amp;T / Cochin Shipyard <strong>XLUUV hull programme</strong> fast-track; DRDO NMRL <strong>AIP fuel cell scale-up to 200 kW</strong>; Indian Naval Autonomous Export Strategy (₹5,000 cr target by 2035).</> },
  { date: '2028', text: <>End of the <strong>foundation window</strong> - beyond this, the Autonomous Power trajectory consolidates out of reach and the default scenario firms up.</> },
  { date: '2035', text: <>Autonomous Power outcome: <strong>80+ USVs, 25+ UUVs, 180+ naval UAVs</strong>; ₹15,000+ cr annual revenue, ₹5,000+ cr export; or the 35%-probability <strong>Indigenous but Inefficient</strong> default.</> },
];

export function NavySummary() {
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
            <div className={styles.kicker}>Defence &amp; Dual-Use · Strategic Intelligence · Edition 1</div>
            <h1 className={styles.h1}>The Indian Navy&rsquo;s Autonomous Maritime Transformation, 2026&ndash;2035</h1>
            <p className={styles.subtitle}>
              Platforms are downstream of ecosystems. The ~₹1.2 lakh crore autonomous
              maritime market beneath USVs, UUVs, XLUUVs and naval UAVs &mdash; and the
              three substrate constraints that set its pace.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>02 Aug 2026</b></span>
              <span>Domain <b>Defence &amp; Dual-Use</b></span>
              <span>Reading time <b>~6 min</b></span>
              <span>Last reviewed <b>02 Aug 2026</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="The Indian Navy's Autonomous Maritime Transformation 2026-2035 report cover" loading="eager" />
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
          The Indian Navy&rsquo;s autonomous transformation is <strong>technically feasible,
          industrially achievable and strategically necessary</strong> &mdash; but its pace is set by the{' '}
          <strong>industrial substrate</strong>, not by platform decisions. Three constraints bind:
          semiconductor access (<Num>9/10</Num> dependency), test-and-certification throughput, and a{' '}
          <Num>12,000&ndash;18,000</Num>-engineer workforce deficit by 2030. Address them and the Navy
          fields <Num>80+ USVs, 25+ UUVs and 180+ naval UAVs</Num> by 2035 under the recommended
          &lsquo;Autonomous Power&rsquo; scenario, with industry capturing <Num>~₹1.2 lakh crore</Num>{' '}
          cumulatively. Address them late, and the default &mdash; &lsquo;Indigenous but Inefficient&rsquo;
          at 35% probability &mdash; consolidates.
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
            Six proprietary frameworks structure the assessment: the <strong>Naval Autonomy
            Readiness Framework</strong> (0&ndash;5 across eight dimensions), the <strong>Autonomous
            Maritime Stack</strong> (seven-layer reference architecture with TRL assessment), the{' '}
            <strong>Naval Industrial Readiness Index</strong> (comparator benchmarking), the{' '}
            <strong>Maritime Opportunity Surface Matrix</strong> (58 ranked surfaces across five
            scoring dimensions), the <strong>Naval Technology Dependency Matrix</strong> (supplier
            countries with severity scores), and the <strong>Industrial Multiplier Framework</strong>.
            Analysis is separated into three epistemic categories: <strong>established fact</strong>,{' '}
            <strong>analytical inference</strong>, and <strong>speculative assessment</strong> (future
            states, signalled with probability language). No claim of access to classified material;
            all analysis is open-source.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-posture.svg'} alt="Naval autonomy readiness: India 2.6 vs US 4.5, with software, MUM-T and certification dimensions" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - Strategic Posture Map: India 2.6 vs US benchmark 4.5 (2035 target 4.3).
            Autonomy software (2.4), MUM-T (2.0) and certification (2.2) are the binding dimensions.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-market.svg'} alt="Autonomous naval market: Rs 1.2 lakh crore cumulative, Rs 15000 crore annual by 2035" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - The market: ~₹1.2 lakh crore cumulative (2026-2035); ₹15,000+ crore annual by
            2035, of which ₹5,000+ crore is export.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-constraints.svg'} alt="Three binding constraints: semiconductor access, certification throughput, workforce deficit" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - The three binding substrate constraints that set the pace of transformation,
            not platform decisions.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-scenarios.svg'} alt="Four 2035 scenarios with probabilities" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - 2035 scenarios: Autonomous Power 30% (recommended), Indigenous but Inefficient
            35% (default), Incremental Importer 20%, Drift and Dependency 15%.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-anchors.svg'} alt="Nine strategic anchors receiving 60 percent of public investment" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - Nine Strategic Anchors absorb ~60% of public investment (2026-2030); 22
            High-Value surfaces carry the rest.
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
          <strong>For policymakers:</strong> reallocate programme budgets from platform acquisition
          to substrate investment. DGQA fast-track certification, SCL 28nm fab acceleration and a
          tripled iDEX budget shifted from breadth to depth are the highest-leverage interventions
          in the 2026-2028 window.
        </p>
        <p>
          <strong>For industry:</strong> the 58-surface matrix names the products and the anchors;
          nine Strategic Anchors receive ~60% of public investment and demand sovereign IP. Export
          orientation must precede scale &mdash; the Israeli startup-led model, benchmarked against
          MAFAT, is more relevant than the US programme-led model.
        </p>
        <p>
          <strong>For investors:</strong> a cumulative ~₹1.2 lakh crore market with ₹15,000+ crore
          annual revenue and ₹5,000+ crore export by 2035 under the recommended scenario. Anchor
          investment with sovereign-backed patient capital and export credit lines; the Industrial
          Multiplier Framework estimates downstream ecosystem value of each anchor programme.
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
            <caption className="sr-only">2035 scenarios with probability and description</caption>
            <thead>
              <tr><th>Scenario</th><th>Probability</th><th>Description</th></tr>
            </thead>
            <tbody>
              {scenarios.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Strategic dependency domains with severity and supplier concentration</caption>
            <thead>
              <tr><th>Dependency</th><th>Severity</th><th>Supplier concentration</th><th>Note</th></tr>
            </thead>
            <tbody>
              {dependencies.map((r) => (
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
        <p className={styles.tableNote}>
          Dependency severity on the Naval Technology Dependency Matrix: 8-10 critical. Mitigation
          pathways exist for each but require 7-10 year horizon investment.
        </p>
      </section>

      <section className={styles.section} id="watch">
        <div className={styles.secTitleRow}>
          <span className={styles.secNum}>07</span>
          <h2>What to Watch</h2>
          <span className={styles.secRule} aria-hidden="true" />
        </div>
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
          Derived from <em>The Indian Navy&rsquo;s Autonomous Maritime Transformation 2026&ndash;2035</em>{' '}
          Edition 1 (2026). Epistemic categories: established fact / analytical inference / speculative
          assessment. Primary sources:
        </p>
        <ol>
          <li>MoD Annual Reports; DRDO Annual Reports; Parliament Standing Committee on Defence; DDP disclosures; Indian Maritime Doctrine and MCPP [Verified]</li>
          <li>Positive Indigenisation Lists 1.0-4.0; Defence Acquisition Council approvals; Integrated HQ (Navy) statements [Verified]</li>
          <li>Industrial disclosures - BEL, MDL, CSL, L&amp;T, TASL, Adani Defence &amp; Aerospace [Verified]</li>
          <li>Comparator navies: US Navy (LUSV, MUSV, Orca XLUUV, MQ-25 Stingray), Royal Navy NavyX/RNUAS; IISS Military Balance; US DoD China Military Power Report [Verified]</li>
          <li>Anonymised industry interviews, Q4 2025-Q2 2026; Techadyant proprietary frameworks [Estimate]</li>
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
          <div className={styles.price}>₹5,900</div>
          <p>
            153-page PDF · 12 chapters · 6 proprietary frameworks · 58-surface opportunity matrix
            and full appendices (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report - ₹5,900</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack - ₹10,900</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>15 pages - the thesis, the frameworks and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="15-page condensed edition (PDF)" />
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
