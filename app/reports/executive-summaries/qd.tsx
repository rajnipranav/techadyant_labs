import Link from 'next/link';
import styles from './executive-summary.module.css';

const SLUG = 'q-day-india';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Techadyant_Labs_QDay_Report.pdf';

const FIG = '/reports/executive-summaries/q-day-india/';

const COVER = 'https://library.techadyant.com/covers/Techadyant_Labs_QDay_Report.jpg';
const COVER_CAP = 'Free edition cover · 152 pages · Strategic Risk 2026';

const keyNumbers = [
  { val: '~4 years', label: 'to the CNSA 2.0 preferential deadline (2030); final deadline 2033 - then Quad interop makes it de facto binding on India', src: 'Ch 2 / Ch 4 - Verified' },
  { val: '92% / <8%', label: 'foreign-sourced HSM installed base / domestic share; Thales alone ~34%', src: 'Ch 3 - Verified' },
  { val: '87%', label: 'of national HND-vulnerable traffic sits in four sectors: defence C2, BFSI, telecom backbone, government digital', src: 'Exposure model - Ch 1' },
  { val: '1.4B / 134B', label: 'Aadhaar identities / UPI transactions (2025) - both protected by quantum-vulnerable RSA and ECC', src: 'Ch 3 - Verified' },
  { val: '₹15,500 cr', label: 'projected domestic PQC market by 2033; unlocked by ₹8,500-11,000 cr of cumulative investment', src: 'Market model - Ch 13' },
  { val: '10-18%', label: 'probability of a cryptographically relevant quantum computer by 2029; modal Q-Day estimate 2031-2035', src: 'Expert survey - Ch 1' },
];

const findings = [
  {
    h: 'The harvest is already happening',
    claim: <>Harvest-now-decrypt-later is <Num>present tense</Num>, not a future risk: adversaries are capturing encrypted Indian government, defence and banking traffic today. A CRQC arriving in 2033 <Num>retroactively compromises</Num> data harvested in 2026. Biometric templates, defence C2 transcripts and sovereign records carry <Num>decade-scale confidentiality horizons</Num>.</>,
    src: 'Ch 1 / Ch 3 - Verified',
  },
  {
    h: 'The trust infrastructure is 92% imported',
    claim: <>India&rsquo;s HSM installed base is <Num>92% foreign-sourced</Num> - Thales ~34%, Entrust and Utimaco the rest. Crypto libraries and entropy sources are imported too. A single-vendor displacement event during the migration window would halt BFSI and government HSM refresh for <Num>12-18 months</Num>.</>,
    src: 'Ch 3 / Ch 10 - Verified',
  },
  {
    h: 'Four sectors carry 87% of the exposure',
    claim: <>Defence C2 networks, banking and capital markets, the telecom backbone and government digital infrastructure account for an estimated <Num>87% of national HND-vulnerable traffic</Num>. Healthcare and power face high-band exposure (<Num>70-78%</Num>) through long-life records and SCADA systems.</>,
    src: 'Exposure model - Ch 1',
  },
  {
    h: 'No mandate, no roadmap, no industry',
    claim: <>As of January 2026 India is the <Num>only Quad member without a published national PQC roadmap</Num>. Domestic industry employs <Num>under 1,500</Num> crypto engineers; startups hold <Num>under ₹150 crore</Num> of cumulative funding; the IT Act, DPDP Act, CERT-In directions and RBI guidelines <Num>nowhere reference PQC</Num>.</>,
    src: 'Ch 3 / Ch 8 / Ch 9 - Verified',
  },
  {
    h: 'Defence interop is a 2030 binding requirement',
    claim: <>CNSA 2.0 interoperability with US INDOPACOM systems is a <Num>2030 binding requirement</Num> for joint-operational infrastructure. The Tactical Communication System, Air Defence Grid and Naval ACOTS networks carry multi-decade-confidentiality traffic and must adopt <Num>PQC-agile architectures by 2028</Num>.</>,
    src: 'Ch 4 - Verified',
  },
  {
    h: 'The base case is Drift - until policy fires',
    claim: <>Without aggressive 2026 policy action, the Drift pathway dominates through 2028: compliance without sovereignty, foreign-controlled stack, HND exposure through the 2030s. With the recommended mandate set, <Num>Sovereign-Leap rises from 10% to 65%</Num> probability and becomes modal by 2031.</>,
    src: 'Scenario model - Ch 14',
  },
];

const faqs = [
  {
    q: 'What is Q-Day and when is it?',
    a: 'Q-Day is the date a cryptographically relevant quantum computer becomes operational - one large enough to run Shor’s algorithm and break RSA-2048 and ECC-P256 in operationally relevant time. The modal expert estimate is 2031-2035, squarely inside the CNSA 2.0 compliance window; a CRQC by 2029 is non-trivially probable (10-18%).',
  },
  {
    q: 'What is harvest-now-decrypt-later?',
    a: 'An adversary intercepts and stores encrypted traffic today, then decrypts it once a CRQC becomes available. Because long-life data - biometric templates, defence command-and-control transcripts, sovereign bond documentation - has a confidentiality horizon measured in decades, HND makes PQC migration urgent before Q-Day, not after it. A CRQC in 2033 retroactively compromises traffic harvested in 2026.',
  },
  {
    q: 'What does India actually need to migrate?',
    a: 'Everything on RSA, ECDSA and ECDH: Aadhaar (1.4 billion identities), UPI (134 billion transactions in 2025), GSTN, RTGS, the e-Rupee CBDC, defence C2 networks and the telecom backbone. Beneath the applications, the trust infrastructure itself - HSMs (92% foreign), crypto libraries and entropy sources - is imported and must be replaced with PQC-capable, preferably sovereign, components.',
  },
  {
    q: 'What are the hard deadlines?',
    a: 'CNSA 2.0: 2025 software/firmware signing, 2030 preferential, 2033 final. SWIFT has run a PQC migration programme since 2024. Quad interoperability makes 2033 a de facto deadline for any Indian defence, intelligence or financial-messaging system touching US, UK, Australian or Japanese infrastructure. The report recommends Indian phases aligned to these: 2027 new systems, 2030 critical infrastructure, 2033 all regulated systems.',
  },
  {
    q: 'What would Sovereign-Leap cost and return?',
    a: 'Roughly ₹8,500-11,000 crore of cumulative investment through 2033 across government, regulated industry and private capital - against a domestic PQC market estimated at ₹15,500 crore by 2033 (about US$1.8B, with a 53% sovereign-fit capture yielding a ~US$950 million domestic opportunity). The strategic return is measured in sovereignty, not P&L: ownership of the cryptographic stack that protects Indian defence, financial and identity infrastructure through the post-quantum century.',
  },
  {
    q: 'What should an organisation do now?',
    a: 'Four actions in 2026: build a cryptographic inventory (algorithms, keys, HSMs, vendors); classify long-life data by confidentiality horizon; mandate crypto-agility for all new systems so primitives can be swapped without re-architecting; and plan HSM refresh with PQC-capable paths. Boards should treat 2030 as the operational compliance year and 2033 as absolute.',
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
        headline: 'Q-Day India: Post-Quantum Readiness, 2026-2033',
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-02',
        dateModified: '2026-08-02',
        description:
          'Free strategic report. India has roughly four years before CNSA 2.0, SWIFT and Quad interoperability force a national post-quantum migration. 87% of HND-vulnerable traffic sits in four sectors.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
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
          { '@type': 'ListItem', position: 3, name: 'Q-Day India', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const scenarios = [
  ['Sovereign-Leap', '10%', '65%', 'Domestic PQC stack, 35% domestic HSM, third pole of global capability by 2033'],
  ['Catch-Up', '40%', '25%', 'PQC adopted broadly, but on foreign technology - compliance without sovereignty'],
  ['Drift', '50%', '10%', 'CNSA 2.0 window missed; HND exposure through the 2030s; forced migration crisis mid-decade'],
];

const pillars = [
  ['National PQC Mandate', 'MeitY notification with RBI, MoD, TRAI and MoP directions', '2026; phased 2027 / 2030 / 2033'],
  ['Sovereign PQC Stack', 'CDAC + DRDO with startups and IT incumbents - production KEM, signature, HSM, key orchestration', 'Production by 2028'],
  ['Domestic HSM build-out', 'PLI + strategic-preferential procurement; domestic share 8% to 35%', 'By 2030'],
  ['Crypto-agility retrofit', 'Aadhaar, UPI, CBDC, GSTN, defence C2, telecom backbone, SCADA', '2027-2031'],
  ['Talent and standards', 'Double PQC-trained crypto engineers every two years (15,000 by 2033); NIST, IETF, ISO JTC1 SC27, TSDSI representation', 'Continuous to 2033'],
];

const watch = [
  { date: '2026', text: <><strong>National PQC Mandate expected</strong> - unlocks an estimated ₹8,500-11,000 cr of compliance-driven private-sector investment through 2033.</> },
  { date: '2027', text: <><strong>New systems PQC-only</strong>; BFSI HSM replacement cycle begins (₹3,200-4,100 cr through 2033); Aadhaar and UPI crypto-agility retrofit funded (₹2,800-3,500 cr).</> },
  { date: '2028', text: <><strong>Sovereign stack production</strong> (CDAC/DRDO); a PQC-native e-Rupee makes India the first major economy with a quantum-safe sovereign digital currency; defence systems PQC-agile.</> },
  { date: '2029', text: <><strong>Quad PQC interoperability formalises</strong> into a treaty-grade arrangement with India as designated third pole; CRQC by this year is 10-18% probable.</> },
  { date: '2030', text: <><strong>CNSA 2.0 preferential deadline</strong>; defence interop binding; domestic HSM share at the 35% target.</> },
  { date: '2033', text: <><strong>The verdict</strong>: Sovereign-Leap (₹15,500 cr market, 15,000 engineers, third pole) or Drift (foreign-controlled stack, secrets in foreign HSMs).</> },
];

export function QdSummary() {
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
            <div className={styles.kicker}>Strategic Technology · Strategic Risk · 2026 Free Edition</div>
            <h1 className={styles.h1}>Q-Day India</h1>
            <p className={styles.subtitle}>
              India has roughly four years before exogenous deadlines - CNSA 2.0 (2030-2033),
              SWIFT&rsquo;s migration programme, Quad interoperability - force a national
              post-quantum migration. A country that cannot guarantee the confidentiality of its own
              strategic communications has ceded a core function of statehood.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>02 Aug 2026</b></span>
              <span>Domain <b>Strategic Technology</b></span>
              <span>Reading time <b>~7 min</b></span>
              <span>Edition <b>Free - 152 pages</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="Q-Day India report cover" loading="eager" />
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
          India is a <strong>cryptographic superpower on borrowed infrastructure</strong>. Aadhaar
          authenticates <Num>1.4 billion</Num> residents, UPI processed <Num>134 billion</Num>{' '}
          transactions in 2025, and GSTN, RTGS, the e-Rupee and defence C2 networks all rest on RSA
          and elliptic-curve cryptography that a sufficiently large quantum computer breaks. Beneath
          them, the trust infrastructure itself is imported: <Num>92%</Num> of HSMs, the crypto
          libraries, the entropy sources. The migration to post-quantum cryptography is therefore
          not an IT project - it is a <strong>sovereignty event</strong>, and India is the only Quad
          member without a published national roadmap for it.
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
            The report&rsquo;s analytical core is a <strong>layered national cryptographic stack
            map</strong> - applications, protocols, libraries, HSMs and entropy sources - scored for
            HND exposure and sovereignty. A <strong>sectoral exposure model</strong> quantifies
            vulnerable traffic (87% in four sectors); a <strong>market-sizing cascade</strong>{' '}
            (TAM → SAM → SOM) sizes the domestic opportunity; a <strong>scenario model</strong>{' '}
            projects Sovereign-Leap, Catch-Up and Drift probabilities to 2033; and a{' '}
            <strong>five-pillar implementation roadmap</strong> sequences the 2026-2033 migration
            against CNSA 2.0, SWIFT and Quad deadlines. Every claim carries a confidence rating and
            every model a documented assumption set in the methodology section.
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-window.svg'} alt="PQC deadline stack timeline 2026 to 2033 with Q-Day modal window 2031 to 2035" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - The deadline stack: exogenous deadlines (2027-2033) converge before the modal
            Q-Day window (2031-2035) opens.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-exposure.svg'} alt="HND exposure: four sectors carry 87 percent of national vulnerable traffic, healthcare and power 70 to 78 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - HND exposure: 87% of national vulnerable traffic in four sectors; healthcare
            and power at 70-78% via long-life records and SCADA.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-market.svg'} alt="India PQC market 2033: BFSI 3200-4100, Aadhaar UPI 2800-3500, middleware 2500-3500, services 3000, HSM 1200-1800 crore" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - The 2033 market: ~₹15,500 cr total, with the BFSI migration and the
            Aadhaar/UPI retrofit as the two largest programmes.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-scenarios.svg'} alt="Scenario probability trajectories 2026 to 2033: Drift 50 to 10, Catch-Up 40 to 25, Sovereign-Leap 10 to 65 percent" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - Trajectories: with the recommended policy set notified in 2026,
            Sovereign-Leap rises from 10% to 65% and becomes modal by 2031.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-hsm.svg'} alt="India HSM installed base: 92 percent foreign today, 35 percent domestic target by 2030" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - The HSM build-out: from 92% foreign (Thales ~34%) to a 35% domestic share by
            2030 under PLI and strategic-preferential procurement.
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
          <strong>For the Government of India:</strong> the absence of a national PQC mandate is the
          single largest strategic gap in the country&rsquo;s cybersecurity posture. A mandate
          notified in 2026 unlocks an estimated ₹8,500-11,000 crore of compliance-driven
          private-sector investment through 2033.
        </p>
        <p>
          <strong>For the Reserve Bank of India:</strong> BFSI faces the highest absolute migration
          cost (₹3,200-4,100 crore over 2027-2033) but has the clearest regulatory template. The
          CBDC track is the leapfrog: a PQC-native e-Rupee by 2028 makes India the first major
          economy with a quantum-safe sovereign digital currency.
        </p>
        <p>
          <strong>For the Ministry of Defence:</strong> CNSA 2.0 interoperability with US, UK,
          Australian and Japanese systems is a 2030 binding requirement. TCS, the Air Defence Grid
          and Naval ACOTS networks must adopt PQC-agile architectures by 2028, with
          sovereign-preferential procurement for crypto hardware.
        </p>
        <p>
          <strong>For boards and CISOs:</strong> PQC migration is a capital-expenditure programme
          with a hard external deadline, not an R&amp;D line item. Treat 2030 as the operational
          compliance year and 2033 as absolute; the cost-of-delay premium is an estimated
          ₹3,500-4,000 crore for the BFSI sector alone.
        </p>
        <p>
          <strong>For investors:</strong> the Indian PQC market sits at the inflection point Indian
          cybersecurity occupied in 2015. Capital deployed in 2026-2028 - in HSMs, crypto-agility
          middleware and integration services - compounds at venture-grade returns through 2033.
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
            <caption className="sr-only">2033 scenarios with 2026 and 2033 probabilities and outcomes</caption>
            <thead>
              <tr><th>Scenario</th><th>2026 probability</th><th>2033 (with policy)</th><th>Outcome</th></tr>
            </thead>
            <tbody>
              {scenarios.map((r) => (
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
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Five pillars of the Sovereign-Leap pathway</caption>
            <thead>
              <tr><th>Pillar</th><th>Action</th><th>Deadline</th></tr>
            </thead>
            <tbody>
              {pillars.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Migration cost centres: BFSI ₹3,200-4,100 cr; Aadhaar + UPI retrofit ₹2,800-3,500 cr;
          crypto-agility middleware ₹2,500-3,500 cr cumulative; integration services ~₹3,000 cr by
          2033. Domestic PQC industry employs fewer than 1,500 crypto engineers today; Sovereign-Leap
          needs ~7,500 by 2030 and 15,000 by 2033.
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
          Derived from the <em>Q-Day India</em> free edition, Strategic Risk 2026. Forward claims
          carry confidence ratings; model assumptions are documented in the Methodology section.
          Primary sources:
        </p>
        <ol>
          <li>NIST FIPS 203 (Kyber), 204 (Dilithium), 205 (SPHINCS+) - August 2024 [Verified]</li>
          <li>NSA CNSA 2.0 deadlines (2025 / 2030 / 2033); NCSC, ASD and NISC parallel roadmaps [Verified]</li>
          <li>SWIFT PQC migration programme (since 2024); RBI cyber-security framework; CERT-In directions (April 2022); DPDP Act 2023; MeitY NQM documents [Verified]</li>
          <li>Expert consensus surveys - ETSI, Global Risk Institute, NIST PQC forum; peer-reviewed quantum-roadmap literature 2024-2025 [Estimate]</li>
          <li>Industry disclosures - Thales, Entrust, Utimaco, PQShield, ISARA, Crypto4A; QNu Labs, BosonQ Psi, DataGrid; TCS, Infosys, Wipro, HCL [Verified]</li>
          <li>Techadyant Labs exposure, market-sizing, scenario and roadmap models [Model]</li>
        </ol>
        <p style={{ marginTop: 18 }}>
          <Link href="/research/methodology/" style={{ color: 'var(--gold)' }}>
            Read the full methodology and scoring rubrics →
          </Link>
        </p>
      </section>

      <div className={styles.conversionGrid}>
        <div className={styles.buyCard}>
          <h3>Q-Day India - Free Edition</h3>
          <div className={styles.price}>Free · 152 pages</div>
          <p>
            The complete strategic-risk report - 17 chapters, 40 figures, sector deep-dives on
            defence, BFSI, telecom and government, plus the startup, policy, funding and supplier
            directories.
          </p>
          <a href={PDF_URL} className={styles.btnPrimary} download>
            Download the full report (PDF)
          </a>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Open the report page</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>What&rsquo;s inside</h3>
          <p>
            The Q-Day threat from theoretical to operational · global migration mandates and
            2026-2033 deadlines · India&rsquo;s cryptographic posture · four sectoral deep-dives ·
            the PQC ecosystem · policy and regulatory framework · supply-chain vulnerabilities ·
            the sovereign-security opportunity · the 2026-2033 implementation roadmap.
          </p>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/reports/">All reports</Link>
        <Link href="/signals/">Related signals</Link>
        <Link href="/briefings/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/research/strategic-technology/">Strategic Technology</Link>
      </div>
    </div>
  );
}
