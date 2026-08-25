import Link from 'next/link';
import styles from './executive-summary.module.css';
import { ExecutiveSummaryGate } from '../../components/ExecutiveSummaryGate';

const SLUG = 'india-green-hydrogen';
const REPORT_URL = `/reports/${SLUG}/`;
const SUMMARY_URL = `/reports/${SLUG}/executive-summary/`;
const PDF_URL =
  'https://library.techadyant.com/free%20reports/Green_Hydrogen_Report_Freey.pdf';

const FIG = '/reports/executive-summaries/india-green-hydrogen/';

const COVER = 'https://library.techadyant.com/covers/Green_Hydrogen_Report.jpg';
const COVER_CAP = 'Edition cover · 133 pages · Volume I';

const keyNumbers = [
  { val: '₹19,744 cr', label: 'National Green Hydrogen Mission outlay (Jan 2023); SIGHT ₹17,490 cr - ₹4,440 cr manufacturing, ~₹13,050 cr production', src: 'MNRE / Gazette - Verified' },
  { val: '60% / <1 GW', label: "China's share of global electrolyser nameplate / India's effective output (3 GW nameplate, 14 GW announced)", src: 'Ch 6 / Ch 5 - Verified' },
  { val: '0 / 100%', label: 'Indian PGM production / import dependency; global iridium ~7 t/yr, South Africa + Russia >95%', src: 'Ch 4 - Verified' },
  { val: '10 / 19', label: 'Value-chain components at High/Critical risk; PTL, PFSA, iridium, AEM separators 80-100% imported', src: 'Ch 11 - Verified' },
  { val: '₹350 → ₹170', label: 'LCOH 2025 → 2030 target (₹/kg); grey parity ₹150 unlikely before 2032 without SIGHT', src: 'LCOH model - Ch 7' },
  { val: '55% / 25% / 20%', label: 'Muddle / Machine / Mirage scenario probabilities (3.5 / 5.5 / 1.2 MMT by 2030)', src: 'Scenario model - Ch 15' },
];

const findings = [
  {
    h: 'The machine is Chinese',
    claim: <>India&rsquo;s electrolyser base is <Num>~60% Chinese-manufactured</Num>. Operational nameplate is ~3 GW/yr with effective output <Num>under 1 GW</Num> against a 60 GW 2030 target - roughly a <Num>20x scale-up</Num>. The India-China installed gap widens from ~14 GW (2024) to ~109 GW (2030) in the base case.</>,
    src: 'Ch 5 / Ch 6 - Verified',
  },
  {
    h: 'Zero catalysts, 100% dependency',
    claim: <>PEM electrolysers need <Num>iridium and platinum</Num>; India produces <Num>zero of either</Num>. At a 1 GW base, PEM loading implies ~250 kg of iridium - <Num>3.5% of annual global supply</Num>; at 60 GW, the requirement <Num>exceeds annual global supply by 2x</Num>. Iridium traded above $8,000/oz by mid-2026.</>,
    src: 'Ch 4 - Verified',
  },
  {
    h: 'Three companies own the membrane',
    claim: <>The de-facto PEM membrane (Nafion, a PFSA ionomer) has IP concentrated in <Num>three Western firms</Num> - Chemours, 3M, Solvay; the alkaline separator (Zirfon) is Agfa&rsquo;s (Belgium). India imports <Num>100% of both</Num> and has no public programme to establish domestic PFSA production.</>,
    src: 'Ch 3 / Ch 4 - Verified',
  },
  {
    h: 'The deadlock is demand, not supply',
    claim: <>SIGHT Mode III demand aggregation - mandatory blending in refineries and fertilizer plants - is <Num>notified in principle but not operationalised</Num>. No mandates, no bankable contracts, no FIDs, no capacity. Mandates would cut WACC from <Num>11% to 8.5%</Num> and unlock <Num>₹2.5 lakh crore</Num> of project finance.</>,
    src: 'Ch 9 - Verified',
  },
  {
    h: 'LCOH is an electricity story',
    claim: <>Electricity is <Num>56% of LCOH</Num>; capex amortisation is 17%. Getting from ₹350 to ₹170/kg requires capex to fall from <Num>$700 to $250/kW</Num>, capacity factors to rise from <Num>50% to 70%</Num>, and power to fall from <Num>₹6 to ₹3.5/kWh</Num> - each itself a multi-billion-dollar programme.</>,
    src: 'LCOH model - Ch 7',
  },
  {
    h: 'The base case is Muddle, not Machine',
    claim: <>Base case (<Num>55%</Num>): <Num>3.5 MMT</Num> by 2030 - 30% below target - 35 GW, ₹195/kg, 55-65% import dependency. Machine (<Num>25%</Num>): 5.5 MMT, ₹140/kg, net exporter. Mirage (<Num>20%</Num>): 1.2 MMT, 85-95% dependency. <Num>Only Machine reaches the 5 MMT target on time</Num>.</>,
    src: 'Scenario model - Ch 15',
  },
];

const faqs = [
  {
    q: 'Why "mirage or machine"?',
    a: 'India has committed ₹19,744 crore and a 5 MMT target to green hydrogen - the molecule - while the machine that makes it, the electrolyser, is approximately 60% Chinese-manufactured and 100% dependent on imported platinum-group metals. The question is whether India builds the machine or remains an importer of it.',
  },
  {
    q: 'What exactly is imported?',
    a: 'Electrolyser stacks (~60% Chinese), iridium and platinum catalysts (India produces zero; global iridium supply ~7 t/yr, over 95% from South Africa and Russia), PFSA membranes (IP in Chemours, 3M, Solvay), Zirfon separators (Agfa, Belgium), and titanium sponge, zirconium, scandium, rare earths and graphite (0-3% Indian processing share). Ten of nineteen value-chain components are High or Critical risk.',
  },
  {
    q: 'Can India reach 5 MMT by 2030?',
    a: 'Only under the Machine scenario (25% probability): 5.5 MMT, 65 GW, ₹140/kg, 30-40% import dependency - contingent on all four supply-side interventions executing by 2027. The base case (Muddle, 55%) lands at 3.5 MMT - 30% below target - with 55-65% stack-import dependency. The downside (Mirage, 20%) is 1.2 MMT and 85-95% dependency.',
  },
  {
    q: 'What would fix it?',
    a: 'Four supply-side interventions: a Critical Materials Reserve under ANRF (~$250M for the PGM component, 12 months of consumption); three National Hydrogen Catalyst Centres at ₹4,000 crore over five years (cutting PGM loading from 2.5 to 0.5 mg/cm² by 2030 and delivering a PGM-free AEM catalyst by 2028); a 30% domestic value-addition mandate for SIGHT Mode I; and demand-side blending mandates (25%/50% refinery, 20%/40% fertilizer), which cut WACC from 11% to 8.5%.',
  },
  {
    q: 'Where is the investment opportunity?',
    a: 'The global electrolyser market grows from $4.2B (2024) to ~$35B (2030), a 42% CAGR - but stacks commoditise by 2030. Value capture sits in catalysts, membranes, AEM/SOEC deep-tech, midstream compression and storage, and long-life offtake contracts. Infrastructure capital should go to H2 pipeline and storage SPVs with regulated returns (IRR 11-13%).',
  },
  {
    q: 'What should startups attack?',
    a: 'PGM-free catalysts, AEM membranes and ionic compressors - the lowest-competition, highest-strategic-leverage segments. Avoid pure-play AWE/PEM stack assemblers (commoditised by Chinese imports by 2027) and hydrogen mobility pure-plays (battery-electric dominates light and medium duty through 2030).',
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
        headline: "The Hydrogen Mirage or Machine? India's Green Hydrogen Reality, 2026-2035",
        author: { '@type': 'Organization', name: 'Techadyant Labs' },
        publisher: { '@type': 'Organization', name: 'Techadyant Labs' },
        datePublished: '2026-08-08',
        dateModified: '2026-08-08',
        description:
          'Strategic intelligence on Indian green hydrogen: Rs 19,744 crore committed, but the electrolyser is ~60% Chinese-built and 100% PGM-dependent. Mirage, Muddle or Machine scenarios to 2030.',
        url: 'https://labs.techadyant.com' + SUMMARY_URL,
      },
      {
        '@type': 'Product',
        name: 'The Hydrogen Mirage or Machine? (Full Report)',
        description:
          '133-page strategic intelligence report with the 26-sheet companion workbook and full appendices (Report + Data tier).',
        offers: {
          '@type': 'Offer',
          price: '4900',
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
          { '@type': 'ListItem', position: 3, name: 'The Hydrogen Mirage or Machine?', item: 'https://labs.techadyant.com' + REPORT_URL },
          { '@type': 'ListItem', position: 4, name: 'Executive Summary', item: 'https://labs.techadyant.com' + SUMMARY_URL },
        ],
      },
    ],
  };
}

const scenarios = [
  ['Mirage', '20%', '1.2 MMT', '8 GW', '₹280/kg', '85-95% import dependency'],
  ['Muddle (base case)', '55%', '3.5 MMT', '35 GW', '₹195/kg', '55-65% stack-import dependency'],
  ['Machine', '25%', '5.5 MMT', '65 GW', '₹140/kg', '30-40% import dependency'],
];

const vulnerabilities = [
  ['Electrolyser manufacturing', '3 GW nameplate / <1 GW output vs 60 GW 2030 target; SIGHT Mode I partially subscribed; stack IP imported'],
  ['Catalysts', 'Zero Indian PGM production; PEM needs iridium (anode) and platinum (cathode); ~7 t/yr global iridium, >95% SA + Russia'],
  ['Membranes', 'PFSA (Nafion) IP in Chemours, 3M, Solvay; Zirfon separator (Agfa); 100% imported, no domestic programme'],
  ['Critical materials', 'Titanium sponge, zirconium, scandium, rare earths, graphite - 0-3% Indian processing share; monazite reserves unmined'],
  ['Capital cost', '2025 LCOH ₹350/kg (2.3x grey); target ₹170 needs capex $700→$250/kW, CF 50→70%, power ₹6→₹3.5/kWh'],
  ['Demand aggregation', 'SIGHT Mode III not operationalised; no bankable contracts, no FIDs; the binding constraint on the whole programme'],
];

const watch = [
  { date: '2026', text: <><strong>Green Hydrogen Mandate expected</strong> - 30% refinery + 20% fertilizer blending, unlocking ~$8B of bankable offtake; customs duty rationalisation (~8% capex reduction).</> },
  { date: '2027', text: <><strong>H2-DRI steel pilot</strong> expected (1.8 MMT demand pool by 2030); refinery blending at 25%; three National Hydrogen Catalyst Centres funded; 30% DVA mandate phased in.</> },
  { date: '2028', text: <><strong>PGM-free AEM catalyst</strong> delivery target; carbon-intensity certification aligned at ≤1.5 kgCO2e/kgH2; SOEC commercial deployment.</> },
  { date: '2030', text: <><strong>The 5 MMT / 60 GW verdict</strong> - Muddle base case lands at 3.5 MMT (30% below target); only Machine reaches 5.5 MMT with 65 GW.</> },
  { date: '2032', text: <>Grey-hydrogen parity without SIGHT; under Machine, <strong>5-8 MMT/yr export opportunity</strong> (USD 5-8B) to Japan, South Korea and the EU materialises.</> },
];

export function GhSummary() {
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
            <div className={styles.kicker}>Solar &amp; Clean-Energy Manufacturing · Strategic Intelligence · Volume I</div>
            <h1 className={styles.h1}>The Hydrogen Mirage or Machine?</h1>
            <p className={styles.subtitle}>
              India committed ₹19,744 crore to the molecule. But the machine that makes it is
              ~60% Chinese-built and 100% dependent on imported platinum-group metals - and
              ten of nineteen value-chain components sit at critical risk.
            </p>
            <div className={styles.metaRow}>
              <span>Published <b>08 Aug 2026</b></span>
              <span>Domain <b>Solar &amp; Clean-Energy</b></span>
              <span>Reading time <b>~6 min</b></span>
              <span>Last reviewed <b>08 Aug 2026</b></span>
              <span>Author <b>Techadyant Labs · Research</b></span>
            </div>
          </div>
          <figure className={styles.coverCard}>
            <img src={COVER} alt="The Hydrogen Mirage or Machine report cover" loading="eager" />
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
          India has built its green-hydrogen policy around the <strong>molecule</strong> - not the{' '}
          <strong>machine</strong> that makes it. The electrolyser is <Num>~60% Chinese-manufactured</Num>{' '}
          and <Num>100% dependent</Num> on imported platinum-group metals, and <Num>10 of 19</Num>{' '}
          value-chain components sit at High or Critical risk. The molecule can, in principle, be made
          without importing the machine. In current practice, it cannot. Closing this gap is the{' '}
          <strong>single largest determinant</strong> of whether the National Green Hydrogen Mission
          becomes an industrial-transformation programme or an import-substitution programme in
          reverse.
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
            The report&rsquo;s analytical core is the <strong>electrolyser value-chain dependency
            analysis</strong> - nineteen components scored on import dependency and strategic risk -
            cross-referenced with a <strong>strategic control points matrix</strong> (fourteen
            control points; nine sit in the &ldquo;Act Now&rdquo; quadrant where India&rsquo;s
            leverage is weak and value capture is critical) and a <strong>critical-materials
            dependency matrix</strong>. The <strong>LCOH model</strong> decomposes cost (electricity
            56%, capex amortisation 17%); the <strong>enterprise risk register</strong> scores sixteen
            risks on probability × impact; the <strong>scenario model</strong> projects Mirage,
            Muddle and Machine outcomes to 2030. Every forward claim carries a confidence rating
            (Appendix L) and every model a documented assumption set (Appendix M).
          </p>
        </div>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-machine.svg'} alt="Electrolyser manufacturing: India output under 1 GW, nameplate 3 GW, announced 14 GW, China 45 GW" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 1 - The machine: India effective output &lt;1 GW against 3 GW nameplate, 14 GW
            announced and China&rsquo;s ~45 GW. The gap widens to ~109 GW by 2030 in the base case.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-catalyst.svg'} alt="Iridium constraint: 7 tonnes annual global supply vs 250 kg India need at 1 GW and over 2x supply at 60 GW" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 2 - The iridium constraint: ~7 t/yr global supply; India&rsquo;s 60 GW ambition
            needs more than 2x annual global supply.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-lcoh.svg'} alt="LCOH from Rs 350 per kg in 2025 to Rs 170 target by 2030, grey parity Rs 150" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 3 - LCOH: ₹350/kg (2025) to the ₹170/kg 2030 target; grey parity at ₹150 is
            unreachable before 2032 without SIGHT.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-scenarios.svg'} alt="Three scenarios: Mirage 20 percent 1.2 MMT, Muddle 55 percent 3.5 MMT, Machine 25 percent 5.5 MMT" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 4 - 2030 scenarios: Muddle (base, 55%) 3.5 MMT; Machine (25%) 5.5 MMT; Mirage
            (20%) 1.2 MMT. Only Machine reaches the target on time.
          </figcaption>
        </figure>
        <figure className={styles.figure}>
          <img src={FIG + 'fig-dependency.svg'} alt="Electrolyser value chain import dependency: PFSA 100, catalysts 100, AEM separators 90, PTL 85, titanium 60" loading="lazy" />
          <figcaption className={styles.figcaption}>
            Figure 5 - Value-chain dependency: PFSA and catalysts 100% imported, AEM separators
            ~90%, porous transport layers 80-100% - ten of nineteen components at High or
            Critical risk.
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
          <strong>For the government:</strong> another ₹10,000 crore of incentives on the existing
          SIGHT architecture will not close the manufacturing or catalyst gap - re-orient the
          existing ₹17,490 crore toward the Critical Materials Reserve, catalyst R&amp;D and
          demand-side mandates.
        </p>
        <p>
          <strong>For Indian corporates:</strong> the electrolyser stack, not the project pipeline,
          is the strategic battleground. Reliance, Adani and Greenko commitments are largely
          project-pipeline; Ohmium, L&amp;T and Newtrace are stack-level. Pool stack R&amp;D through
          a Hydrogen Industrial Alliance - or accept that ~70% of electrolyser value accrues to
          foreign OEMs for the next decade.
        </p>
        <p>
          <strong>For investors:</strong> stacks commoditise by 2030; value sits in catalysts,
          membranes, AEM/SOEC deep-tech, midstream compression and storage, and bankable offtake.
          Infrastructure capital should target H2 pipeline and storage SPVs with regulated returns
          (IRR 11-13%); avoid pure-play stack assemblers and mobility pure-plays.
        </p>
        <p>
          <strong>For defence planners:</strong> treat green hydrogen as a strategic fuel
          dependency equivalent to crude oil - iridium is South-African-and-Russian, rare earths
          Chinese, PFSA American-and-European. Stockpile, dual-use mobility (rail, naval), and a
          sovereign-manufacturing requirement for defence-critical applications.
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
            <caption className="sr-only">2030 scenarios with production, capacity, LCOH and import dependency</caption>
            <thead>
              <tr><th>Scenario</th><th>Probability</th><th>2030 production</th><th>Installed</th><th>LCOH</th><th>Import dependency</th></tr>
            </thead>
            <tbody>
              {scenarios.map((r) => (
                <tr key={r[0]}>
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
            <caption className="sr-only">Six supply-side vulnerabilities</caption>
            <thead>
              <tr><th>Vulnerability</th><th>The gap</th></tr>
            </thead>
            <tbody>
              {vulnerabilities.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>
          Demand composition 2030: refining, ammonia and steel absorb 81% of hydrogen demand;
          mobility is 3%. Existing grey-hydrogen demand (6.5 MMT/yr) already exceeds the entire
          NGHM 2030 target.
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
          Derived from <em>The Hydrogen Mirage or Machine?</em> Volume I, Q1 2026 edition. Forward
          claims carry confidence ratings (Appendix L); model assumptions in Appendix M. Primary sources:
        </p>
        <ol>
          <li>MNRE notifications - National Green Hydrogen Mission (Jan 2023); SIGHT scheme documents and Gazette of India [Verified]</li>
          <li>IEA, IRENA, BloombergNEF, Hydrogen Council, World Bank, ADB comparative datasets [Verified]</li>
          <li>Company disclosures - Reliance, Adani, Greenko, NTPC, JSW, IOCL, BPCL (~USD 46B disclosed commitments) [Verified]</li>
          <li>Goldman Sachs Carbonomics (2024); Morgan Stanley Global Hydrogen Outlook (2025); WEF Global Risks Report 2025 [Verified]</li>
          <li>Industry and policy interviews - IOCL, BPCL, Reliance, Tata Steel, JSW, L&amp;T, Ohmium, Greenko, BHEL; MNRE, NITI Aayog, DST, BIS, PESO; IIT-M/B/K, IISc, CSIR-IICT, CSIR-CECRI, ARCI, TERI [Estimate]</li>
          <li>Techadyant Labs LCOH, scenario and dependency models [Model]</li>
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
          <div className={styles.price}>₹4,900</div>
          <p>
            133-page PDF · 18 chapters · 26-sheet companion workbook · full supplier, startup,
            policy and funding databases (Report + Data pack).
          </p>
          <Link href={REPORT_URL} className={styles.btnPrimary}>Buy Report - ₹4,900</Link>
          <Link href={REPORT_URL} className={styles.btnSecondary}>Report + Data pack - ₹7,900</Link>
        </div>
        <div className={styles.emailGate}>
          <h3>Free Condensed Edition</h3>
          <p>33 pages - the thesis, the frameworks and the headline findings, with figures.</p>
          <div style={{ marginTop: 14 }}>
            <ExecutiveSummaryGate slug={SLUG} pdfUrl={PDF_URL} pdfLabel="33-page condensed edition (PDF)" />
          </div>
        </div>
      </div>

      <div className={styles.related}>
        <Link href="/reports/">All reports</Link>
        <Link href="/signals/">Related signals</Link>
        <Link href="/newsletter/">Briefings</Link>
        <Link href="/research/">Research</Link>
        <Link href="/reports/theme/solar-clean-energy/">Solar &amp; Clean-Energy</Link>
      </div>
    </div>
  );
}
