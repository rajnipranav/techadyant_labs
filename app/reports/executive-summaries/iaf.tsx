import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'iaf-autonomous-air-power';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/IAF_Autonomous_Air_Power_Roadmap_2026-2035_Free.pdf';

const FIG = '/reports/executive-summaries/iaf-autonomous-air-power/';

const COVER = 'https://library.techadyant.com/covers/IAF_Autonomous_Air_Power_Roadmap_2026-2035.jpg';
const COVER_CAP = 'Edition cover · 142 pages · Edition 1';

const keyNumbers = [
  { val: '34 / 88', label: "India's Air Autonomy Readiness Index vs the USAF benchmark (PLAAF 72, RAF 71, RAAF 66)", src: 'AARI Model - Ch 1' },
  { val: '-56', label: 'AI Software Stack gap vs USAF (35 vs 91) - the largest single-dimension deficit', src: 'AARI Model - Ch 1' },
  { val: '4 × 20/25', label: 'Critical-risk dependencies: semiconductors, AI compute, jet engines, carbon fibre', src: 'SDM - Ch 10' },
  { val: '1.5:1 → ~750:1', label: 'Cost-exchange ratio, 1990 to 2035 (swarm vs exquisite SAM)', src: 'Techadyant Model - Ch 2' },
  { val: '26%', label: 'Fighter-squadron shortfall - 31 active vs 42 sanctioned', src: 'Parl. Standing Committee 47th Report (2023)' },
  { val: '9 / 33', label: 'Tracked autonomous-air programmes at IOC risk; typical DRDO slip 18-24 months', src: 'Programme Tracker - App P' },
];

const findings = [
  {
    h: 'A decade behind - in software',
    claim: <>India scores <Num>34/100</Num> on the Air Autonomy Readiness Index - less than half the USAF&rsquo;s <Num>88</Num>. The deficit is concentrated in the <Num>AI software stack</Num> (35 vs USAF 91, a <Num>-56</Num> gap), not in aircraft. India is roughly a decade behind leading autonomous-air powers.</>,
    src: 'AARI Model - Verified',
  },
  {
    h: 'The cost-exchange flip',
    claim: <>The defender-to-attacker cost ratio has moved from <Num>1.5:1</Num> (1990) to <Num>~90:1</Num> (Bayraktar vs Pantsir) and a projected <Num>~750:1</Num> by 2035 - nearly three orders of magnitude. An exquisite-heavy air-defence architecture (S-400, MR-SAM, Akash) is <Num>structurally unaffordable</Num> against sustained autonomous mass.</>,
    src: 'Model - Ch 2 / Engagement data',
  },
  {
    h: '2030 is the date that decides the decade',
    claim: <>The report assesses <Num>CATS Warrior IOC 2030</Num> as the single most consequential programme date: a slip to 2032 cascades the force-structure crossover past 2035. Three subsystems decide it - a <Num>Kaveri-class small turbofan</Num>, the Ghatak&rsquo;s internal EW suite, and a reliable tactical data link.</>,
    src: 'Projection - Ch 1',
  },
  {
    h: 'Four dependencies that cannot close before 2030',
    claim: <>Semiconductors (&#8804;28nm), AI compute (H100/H200-class), jet engines (UCAV/AMCA-class) and carbon fibre (PAN precursor) each score <Num>20/25</Num> on the Strategic Dependency Matrix. <Num>None is fully mitigable before 2030</Num>; partial mitigation is the realistic horizon for all eight vectors.</>,
    src: 'SDM - Ch 10',
  },
  {
    h: 'No roadmap, measurable cost',
    claim: <>The IAF has <Num>no published autonomous-air doctrine</Num> - the Army published its Land Warfare Doctrine in 2021. Of <Num>33</Num> programmes tracked, <Num>9 are at IOC risk</Num>, and the typical DRDO aerospace programme slips 18-24 months. Vendors, startups and academia cannot align investment to a stated requirement.</>,
    src: 'Programme Tracker - App P',
  },
  {
    h: 'Capital mismatch',
    claim: <>Autonomous platforms receive <Num>&lt;2%</Num> of the IAF capital budget (FY2024-25); the report recommends <Num>8% by 2030</Num>. Without the shift, the crossover - when unmanned squadron-equivalents exceed manned adds - <Num>slips past 2035</Num>.</>,
    src: 'Projection - Ch 3 / Ch 12',
  },
];

const faqs = [
  {
    q: 'How ready is India for autonomous air power?',
    a: "India scores 34/100 on the Air Autonomy Readiness Index vs USAF 88, PLAAF 72, RAF 71 and RAAF 66. The largest absolute gaps are AI Software Stack (-56 vs USAF) and Platform Maturity (-54). The report models AARI 58-62 by 2035 under intervention scenarios and 42-46 under no intervention.",
  },
  {
    q: "What are India's most critical strategic dependencies in autonomous air?",
    a: 'Four vectors score 20/25 (Critical) on the Strategic Dependency Matrix: semiconductors (advanced node up to 28nm), AI compute (H100/H200-class GPUs), jet engines (UCAV/AMCA-class) and carbon fibre (PAN precursor). A further four - IR detector arrays, IMU/INS, AESA T/R modules and rare-earth magnets - score 16/25 (High). None of the four critical vectors is fully mitigable before 2030.',
  },
  {
    q: 'What is the cost-exchange ratio and why does it matter?',
    a: 'The ratio of defender cost to attacker cost has moved from ~1.5:1 (1990) to ~12:1 for fifth-generation fighters, ~90:1 for cheap drones (Bayraktar vs Pantsir) and a projected ~750:1 for autonomous swarms vs exquisite SAMs by 2035 - nearly three orders of magnitude. It implies an exquisite-heavy air-defence architecture (S-400, Patriot, MR-SAM, Akash) faces acute affordability pressure against sustained autonomous mass.',
  },
  {
    q: 'Why is CATS Warrior IOC 2030 the pivotal programme date?',
    a: 'The report assesses the CATS Warrior IOC of 2030 as the single most consequential programme date in the IAF decade: a slip to 2032 cascades the force-structure crossover past 2035. Three subsystems determine whether 2030 holds: an indigenous small turbofan (Kaveri-class restart), the Ghatak internal electronic-warfare suite, and a reliable tactical data link for MUM-T.',
  },
  {
    q: 'How much capital is at stake?',
    a: 'Autonomous platforms receive under 2% of the IAF capital budget in FY2024-25; the report recommends 8% by 2030. Recommendation R2 proposes a $5B / 10-year Autonomous Aerospace Fund, with public capital co-invested alongside private VC, to fund the 75 IOSM-identified opportunities; priority P7 sets a $2B exports ambition by 2032.',
  },
  {
    q: 'What should happen in the next 12 months?',
    a: 'Six Wave-1 critical-path recommendations determine whether the 2030 trajectory holds: publish an unclassified Autonomous Air Power Doctrine (R1, within 12 months), add an Autonomous Systems fast-track to DAP 2020 cutting the procurement cycle from 36 to 18 months (R3), establish a Joint Aerospace Command by 2029 (R4), and mandate 50% indigenous content in UCAV procurements from 2030 (R5).',
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
        headline: 'IAF Autonomous Air Power Roadmap, 2026-2035',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-14',
        dateModified: '2026-08-14',
        description:
          'Strategic intelligence on Indian Air Force autonomous air power: AARI 34/100 vs USAF 88, four 20/25 critical dependencies, cost-exchange flipping to ~750:1, and the 2026-2035 roadmap to close the gap.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: 'IAF Autonomous Air Power Roadmap 2026-2035 (Full Report)',
        description:
          '142-page strategic intelligence report with the autonomous-air data workbook and full appendices (Report + Data tier).',
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
          { '@type': 'ListItem', position: 3, name: 'IAF Autonomous Air Power Roadmap 2026-2035', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const benchmark = [
  ['India', '34', 'Gap concentrated in AI software (-56 vs USAF); 2035 target 58-62'],
  ['RAAF (Australia)', '66', ''],
  ['RAF (UK)', '71', ''],
  ['PLAAF (China)', '72', 'AI-swarm 2027 target declared; WZ-7 deployed to Tibet'],
  ['USAF (US)', '88', 'Benchmark; CCA programmes in flight test'],
];

const dependencies = [
  ['Semiconductors (≤28nm)', '20/25', 'Critical', 'Advanced-node logic; no domestic foundry at scale'],
  ['AI Compute (H100/H200-class)', '20/25', 'Critical', 'Export-controlled GPUs; sovereign clusters early-stage'],
  ['Jet Engines (UCAV/AMCA-class)', '20/25', 'Critical', 'No indigenous small turbofan for CATS Warrior / Ghatak'],
  ['Carbon Fibre (PAN precursor)', '20/25', 'Critical', 'Precursor chemistry and high-tow fibre gaps'],
  ['IR Detector Arrays (MCT/InSb)', '16/25', 'High', 'Focal-plane arrays for ISR and seekers'],
  ['IMU/INS (FOG/RLG grade)', '16/25', 'High', 'GPS-denied navigation depends on indigenous inertial grade'],
  ['AESA T/R Modules (GaAs/GaN)', '16/25', 'High', 'Radar front-end; GaN wafer supply concentrated'],
  ['Rare-Earth Magnets (NdFeB)', '16/25', 'High', 'High-temperature magnets for actuation and motors'],
];

const watch = [
  { date: '2026-27', text: <><strong>The binding window</strong> - six Wave-1 critical-path recommendations determine whether the 2030 trajectory holds; delay past 2027 makes base-case slippage the most likely outcome.</> },
  { date: '2027', text: <>PLAAF <strong>AI-swarm 2027 target</strong> declared; WZ-7 deployed to Tibet; Ghatak UCAV moves from wind-tunnel to flight-test milestones.</> },
  { date: '2030', text: <><strong>CATS Warrior IOC</strong> - the single most consequential programme date; a slip to 2032 pushes the force-structure crossover past 2035.</> },
  { date: '2032', text: <>Projected <strong>force-structure crossover</strong>: unmanned squadron-equivalents exceed manned adds (under intervention).</> },
  { date: '2035', text: <>AARI <strong>58-62</strong> under intervention vs <strong>42-46</strong> under none - the 15-point gap is the strategic value at stake in 2026-27 choices.</> },
];

export function IafSummary() {
  return (
    <div className={styles.sumWrap}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Link href={REPORT_URL} className={styles.backLink}>
        {'←'} Back to the full report
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.kicker}>Defence &amp; Dual-Use · Strategic Intelligence · Edition 1</div>
            <h1 className={styles.h1}>IAF Autonomous Air Power, 2026&ndash;2035</h1>
            <p className={styles.subtitle}>
              India&rsquo;s Air Autonomy Readiness Index is 34/100 &mdash; less than half the USAF&rsquo;s
              88 &mdash; and the deficit is software, not aircraft. The industrial substrate and
              roadmap to close it by 2035.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>14 Aug 2026</b></span>
              <span>Domain <b>Defence &amp; Dual-Use</b></span>
              <span>Reading time <b>~6 min</b></span>
              <span>Last reviewed <b>14 Aug 2026</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="IAF Autonomous Air Power Roadmap 2026-2035 report cover" loading="eager" />
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
          India enters 2026&ndash;2035 roughly <strong>a decade behind</strong> leading autonomous-air
          powers, and the deficit is concentrated in the <strong>AI software stack</strong>, not
          aircraft. The IAF&rsquo;s 31-squadron force faces a maturing PLAAF autonomous-air threat, a
          cost-exchange ratio that has flipped <Num>three orders of magnitude</Num> against exquisite
          air defence, and four critical dependencies &mdash; semiconductors, AI compute, jet engines,
          carbon fibre &mdash; that <strong>cannot close before 2030</strong>. The decade&rsquo;s
          defining task is the industrial substrate beneath autonomous air power: hold the
          intervention path and the report models AARI <Num>58&ndash;62</Num> by 2035.
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
            Six proprietary frameworks structure the assessment. The <strong>Autonomous Air Power
            Stack</strong> (7 layers, Mission to Outlook) is the analytical spine; the <strong>Air
            Autonomy Readiness Index</strong> (0&ndash;100, six equally weighted dimensions) scores
            countries; the <strong>Combat Autonomy Maturity Model</strong> places programmes on a
            7-level scale (L0 Manual to L6 Cognitive) &mdash; India today sits at <strong>CAMM 2.1</strong>,
            with a 2030 target of 3.5&ndash;4.0 and 2035 of 4.0&ndash;4.5. The <strong>Strategic
            Dependency Matrix</strong> scores eight vectors on a 0&ndash;25 risk scale; the{' '}
            <strong>Industrial Opportunity Surface Matrix</strong> ranks 75 opportunities across eight
            clusters. Every quantitative claim carries an evidence tag: <strong>Public</strong>,{' '}
            <strong>Estimate</strong>, <strong>Model</strong>, <strong>Scenario</strong> or{' '}
            <strong>Projection</strong>.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-aari.svg'} alt="Air Autonomy Readiness Index: India 34 vs USAF 88, PLAAF 72, RAF 71, RAAF 66" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - AARI composite: India 34 vs RAAF 66, RAF 71, PLAAF 72, USAF 88. The shaded band
            marks the 2035 intervention target (58-62).
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-costexchange.svg'} alt="Cost-exchange ratio: 1.5 to 1 in 1990 to 750 to 1 by 2035, log scale" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - Cost-exchange, log scale: 1.5:1 (1990) to ~12:1 (fifth-gen) to ~90:1 (Bayraktar
            vs Pantsir), ~200:1 (Shahed vs S-300) and a projected ~750:1 by 2035.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-dims.svg'} alt="India AARI six dimensions: Doctrine 32, Platform 28, Industrial 41, AI Software 35, Test 38, Ops 30" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - India&rsquo;s six AARI dimensions. AI Software Stack (35) is the largest
            deficit: 35 vs USAF 91 (-56).
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-sdm.svg'} alt="Strategic Dependency Matrix: four critical vectors at 20 of 25, four high at 16 of 25" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - Strategic Dependency Matrix: four critical vectors (20/25) - semiconductors,
            AI compute, jet engines, carbon fibre - and four high (16/25). None fully mitigable
            before 2030.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-capital.svg'} alt="Capital allocation to autonomous platforms: under 2 percent today to 8 percent by 2030" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - Capital allocation: &lt;2% of IAF capital budget (FY2024-25) to autonomous
            platforms; 8% by 2030 recommended, or the force-structure crossover slips past 2035.
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
          <strong>For policymakers:</strong> the 15-AARI-point gap between intervention and
          no-intervention scenarios quantifies the strategic-autonomy value at stake in 2026-27
          choices. Publish the doctrine (R1), add an Autonomous Systems fast-track to DAP 2020 (R3),
          and stand up a Joint Aerospace Command by 2029 (R4).
        </p>
        <p>
          <strong>For industry:</strong> the IOSM ranks 75 opportunity surfaces; the top quartile is
          concentrated in AI Software (10 of 25), Avionics (5) and Sensors/EW (4). Propulsion and
          materials score high on strategic importance but low on SME opportunity - capital
          intensity dictates prime-led execution.
        </p>
        <p>
          <strong>For investors:</strong> the AARI scorecard is the year-over-year tracking metric for
          Indian autonomous-air readiness. The proposed $5B Autonomous Aerospace Fund co-invests
          public capital alongside private VC; startups that address IOSM top-25 surfaces find both
          capital and demand, with a $2B exports ambition by 2032.
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
            <caption className="sr-only">Air Autonomy Readiness Index composite scores and notes</caption>
            <thead>
              <tr><th>Country</th><th>AARI</th><th>Note</th></tr>
            </thead>
            <tbody>
              {benchmark.map((r) => (
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
            <caption className="sr-only">Strategic Dependency Matrix vectors with risk scores</caption>
            <thead>
              <tr><th>Dependency vector</th><th>Risk /25</th><th>Band</th><th>Note</th></tr>
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
          Risk Score = Criticality × India Exposure × (6 − Substitutability) ÷ 5, on a
          0-25 scale. None of the four critical vectors is fully mitigable before 2030.
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
          Derived from <em>IAF Autonomous Air Power Roadmap 2026&ndash;2035</em> Edition 1 (2026).
          Evidence tags: Public / Estimate / Model / Scenario / Projection. Primary sources:
        </p>
        <ol>
          <li>IISS Military Balance; Parliament Standing Committee on Defence, 47th Report (2023) [Verified]</li>
          <li>CSIS and RUSI analyses; US DoD China Military Power Report [Verified]</li>
          <li>USAF CCA programme documents; Boeing F-47 announcement (March 2025) [Verified]</li>
          <li>Ukraine, Red Sea and Israel-Lebanon engagement data (Techadyant Labs analysis) [Model]</li>
          <li>Techadyant Labs proprietary frameworks - AARI, CAMM, SDM, IOSM, AAPS, ADIE [Estimate]</li>
        </ol>
        <p style={{ marginTop: 18 }}>
          <Link href="/research/methodology/" style={{ color: 'var(--gold)' }}>
            Read the full methodology and scoring rubrics {'→'}
          </Link>
        </p>
      </section>

      <div className={styles.conversionGrid}>
        <div className={styles.buyCard}>
          <h3>Get the Full Report</h3>
          <div className={styles.price}>₹5,900</div>
          <p>
            142-page PDF · 12 chapters · 6 proprietary frameworks · programme tracker
            and full appendices (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report - ₹5,900</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack - ₹8,900</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>29 pages - the thesis, the frameworks and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="29-page condensed edition (PDF)" />
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
