import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../AtlasNav';
import { JsonLd, breadcrumb, SITE } from '../../seo';

export const metadata: Metadata = {
  title: 'Sagarmala Intelligence Database — Data Dictionary & Methodology',
  description: 'How the Techadyant Sagarmala database is built: entity and relationship definitions, source hierarchy, evidence standards, coverage tiers, update procedure and known limitations.',
  alternates: { canonical: `${SITE}/research/programmes/methodology/` },
};

const SECTIONS: [string, string][] = [
  ['what', 'What this database is'], ['model', 'Entity model'], ['ids', 'Identifiers'], ['prov', 'Evidence & provenance'],
  ['sources', 'Source hierarchy'], ['stats', 'Statistical standards'], ['tiers', 'Coverage tiers'],
  ['ops', 'Opportunity classification'], ['update', 'Update procedure'], ['limits', 'Known limitations'],
];

export default function SagarmalaMethodologyPage() {
  return (
    <>
      <AtlasNav />
      <JsonLd data={[breadcrumb([
        { name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' },
        { name: 'Programmes', path: '/research/programmes/' }, { name: 'Sagarmala methodology', path: '/research/programmes/methodology/' },
      ])]} />
      <main className="wrap pi-body" style={{ maxWidth: 860 }}>
        <div className="pi-eyebrow" style={{ paddingTop: 120 }}>Sagarmala Intelligence Database</div>
        <h1 style={{ fontFamily: 'var(--font-source-serif, Georgia), serif', fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, margin: '0 0 10px' }}>Data dictionary &amp; methodology</h1>
        <p className="pi-sub" style={{ marginBottom: 26 }}>How Techadyant builds, verifies and maintains the maritime, port and industrial intelligence layer behind the <Link href="/research/programmes/sagarmala/">Sagarmala programme page</Link>.</p>

        <nav className="pi-toc" aria-label="On this page" style={{ position: 'static', marginBottom: 10 }}>
          <ul>{SECTIONS.map(([id, l]) => <li key={id}><a href={`#${id}`}>{l}</a></li>)}</ul>
        </nav>

        <h2 id="what">{SECTIONS[0][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          The Sagarmala Intelligence Database is a static, version-controlled dataset in <code>data/sagarmala-intelligence/</code> — eleven JSON files covering the programme dossier, the five-pillar project inventory, a national port registry, port performance time series, connectivity records, Coastal Economic Zones, coastal community initiatives, the maritime company ecosystem, policy evolution, opportunity intelligence and a coverage manifest. It reuses the Atlas&rsquo;s shared source registry (<code>data/industrial-intelligence/sources.json</code>) and its provenance model rather than duplicating them, and it validates at build time (<code>scripts/validate-sagarmala.mjs</code>) — the deploy fails on any broken reference, malformed date, vocabulary violation or dishonest coverage count.
        </p>

        <h2 id="model">{SECTIONS[1][1]}</h2>
        <div className="pi-table-wrap"><table className="pi-table">
          <thead><tr><th>Entity</th><th>File · id prefix</th><th>Definition</th></tr></thead>
          <tbody>
            <tr><td>Programme dossier</td><td>dossier.json · <code>sginst:</code> <code>sgstat:</code> <code>sgvis:</code></td><td>Identity, approval, National Perspective Plan, pillars, institutions, funding mechanics, dated statistics, Sagarmala 2.0 status, vision links, timeline.</td></tr>
            <tr><td>Infrastructure project</td><td>pillar-projects.json · <code>sgpr:</code></td><td>Flagship project with pillar, location, cost (or an explicit null with cost_note), status, agency, milestones, contractors, consequences.</td></tr>
            <tr><td>Port / maritime asset</td><td>ports.json · <code>sgport:</code></td><td>Major port, dock system, major port under construction or non-major port, with authority, coordinates (with source grade), throughput by financial year and documented Sagarmala project links.</td></tr>
            <tr><td>Performance series</td><td>port-performance.json · <code>sgs:</code></td><td>Annual time series (cargo, containers, capacity, turnaround, detention, IWT, coastal) where every point carries period, value and source; incompatible definitions are separate series.</td></tr>
            <tr><td>Connectivity record</td><td>connectivity.json · <code>sgx:</code></td><td>A documented port-to-network connection (road, rail, waterway, Ro-Pax) with directness, status, cost and agency. Proximity is never connectivity.</td></tr>
            <tr><td>Coastal Economic Zone</td><td>industrialisation.json · <code>sgcez:</code></td><td>One of the 14 NPP zones with linkage ports, intended sectors and verified &ldquo;proposed&rdquo; status.</td></tr>
            <tr><td>Community initiative</td><td>community.json · <code>sgcc:</code></td><td>Coastal community programme line (fishing harbours, skilling, tourism, Ro-Pax) with reported outputs kept distinct from outcomes.</td></tr>
            <tr><td>Company</td><td>companies.json · <code>sgco:</code></td><td>Company with evidenced relationships (operates / acquired / concession / contract / supply / fleet) to ports, terminals, projects or yards.</td></tr>
            <tr><td>Policy</td><td>policies.json · <code>sgpol:</code></td><td>Policy or programme-evolution record with announcement date, approval date, status (proposed / announced / approved / operational), objectives and funding.</td></tr>
            <tr><td>Opportunity</td><td>opportunities.json · <code>sgo:</code></td><td>Techadyant opportunity intelligence record: sourced trigger, labelled reasoning, customers, dependencies, constraints, confidence, evidence still needed.</td></tr>
            <tr><td>Coverage manifest</td><td>coverage.json</td><td>Tier status, record counts (cross-checked against the files by the validator), pillar and state coverage, verification distribution, discrepancy register, known gaps.</td></tr>
          </tbody>
        </table></div>
        <p className="pi-sg-note">Relationships are typed on the records themselves: projects reference ports (<code>port_id</code>), ports reference projects (<code>sagarmala_project_ids</code>), opportunities reference projects, ports, companies and policies, and companies reference ports and projects. The validator enforces every one of these edges both ways.</p>

        <h2 id="ids">{SECTIONS[2][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>Identifiers are stable and namespaced (<code>sgpr:</code>, <code>sgport:</code>, <code>sgco:</code>, <code>sgo:</code>, <code>sgpol:</code>, <code>sgcez:</code>, <code>sgcc:</code>, <code>sgx:</code>, <code>sgs:</code>, <code>sginst:</code>, <code>sgstat:</code>, <code>sgvis:</code>, <code>sgdisc:</code>). The layer does not duplicate shared Atlas entities: ports that the Atlas already registers live in <code>data/industrial-intelligence/infrastructure-nodes.json</code> (Mumbai Port was completed and JNPA&rsquo;s coordinates upgraded there), and the programme record itself remains the single dossier in <code>data/programme-intelligence/programmes.json</code>.</p>

        <h2 id="prov">{SECTIONS[3][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>Every claim carries an evidence class — <b>fact</b> (sourced), <b>derived</b> (computed from sourced inputs, method stated) or <b>analysis</b> (Techadyant judgement, hedged language). Facts require provenance; analysis may cite context. Provenance references point at the shared source registry; the programme page renders one numbered source list for the intel layer and the database together, so every bracketed citation resolves. Unknown values are explicit <code>null</code>s with notes — never guesses. Analytical text avoids unhedged &ldquo;will&rdquo;; the validator warns when it finds one.</p>

        <h2 id="sources">{SECTIONS[4][1]}</h2>
        <div className="pi-table-wrap"><table className="pi-table">
          <thead><tr><th>Tier</th><th>Classes</th><th>Used for</th></tr></thead>
          <tbody>
            <tr><td>Tier 1 — primary</td><td>PIB, MoPSW (shipmin.gov.in statistics and division pages), parliament answers (sansad.in), Union Budget documents, PMO speeches, IWAI, port authorities, project SPVs</td><td>Project status, portfolio statistics, port capacity and throughput, expenditure, approvals, contracts.</td></tr>
            <tr><td>Tier 2 — authoritative supporting</td><td>Company sites and disclosure-derived records (Adani, DP World, PSA, APM/Maersk, JSW, SCI, GRSE, L&amp;T, ZPMC), Kerala Maritime Board</td><td>Operator relationships, fleets, order books, acquisitions.</td></tr>
            <tr><td>Tier 3 — secondary discovery</td><td>Reputable trade press and reference works (Maritime Gateway, Loadstar, Financial Express, SCC Times quoting PIB, Wikipedia mirrors of WAF-blocked ministry pages)</td><td>Discovery and corroboration, always flagged; never the sole basis for a critical claim.</td></tr>
          </tbody>
        </table></div>
        <p className="pi-sg-note">Where sagarmala.gov.in blocks automated capture, the affected facts are held via the best available mirror and the limitation is stated on the record. Snippet-level findings without a captured URL are excluded or recorded as research leads — never silently promoted to facts.</p>

        <h2 id="stats">{SECTIONS[5][1]}</h2>
        <ul className="pi-sg-notes">
          <li>Programme portfolio (845 projects) and scheme-funded projects (128) are two scopes; they are never summed or mixed in one table row.</li>
          <li>Financial years are never mixed with calendar years inside one series; FY2025-26 advance estimates are labelled against final figures, and both are retained when official publications disagree.</li>
          <li>Port-level throughput and terminal-level figures are kept in different records; a port&rsquo;s total never includes terminal subtotals.</li>
          <li>Planned capacity, commissioned capacity and actual throughput are three different fields on a project or port record.</li>
          <li>Ministry-reported beneficiary and employment figures are recorded as reported values with dates — not as verified outcomes.</li>
          <li>The IWT FY26 218 MMT claim is retained but flagged (no NW-wise FY26 publication to cross-check the jump from 145.84 MT).</li>
        </ul>

        <h2 id="tiers">{SECTIONS[6][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>Coverage is graded, not claimed: Tier A (programme foundation) is complete; Tier B (national maritime infrastructure) is a defensible core — all 12 major ports, the two under-construction major ports, the largest non-major ports, portfolio statistics and the cargo time series FY2014-15 to FY2025-26; Tiers C and D are seeded (14 CEZs, 24 companies, 9 documented connectivity records, 10 opportunity records). The coverage manifest&rsquo;s record counts are enforced against the data files by the build validator, so the manifest cannot drift from the records.</p>

        <h2 id="ops">{SECTIONS[7][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>Opportunity intelligence is classified as <b>documented demand</b> (a contract, order or award already evidences the demand), <b>emerging</b> (sourced trigger, reasoned effect), <b>hypothesis</b> (analytical construction on sourced foundations — e.g. the CEZ surface, whose trigger evidence documents an absence) or <b>research lead</b> (direction needing more evidence). No market size, revenue forecast, investment return or cargo volume is invented; quantification is limited to what cited sources state.</p>

        <h2 id="update">{SECTIONS[8][1]}</h2>
        <p style={{ maxWidth: 720, color: 'var(--text-muted)', lineHeight: 1.6 }}>Update triggers: PIB Sagarmala/MoPSW releases, the monthly TRW cargo reports and annual Basic Port Statistics, parliament sessions, the February Union Budget, and Vadhavan/Vizhinjam phase milestones. Procedure: add or update the record with new provenance; append new sources to the shared registry; keep the older observation with its date rather than overwriting; run <code>npm run validate:sagarmala</code>; align coverage.json counts; bump <code>last_verified</code>. Records older than 120 days are flagged stale by the validator.</p>

        <h2 id="limits">{SECTIONS[9][1]}</h2>
        <ul className="pi-sg-notes">
          <li>The full 845-project portfolio is not itemised — the ministry publishes no machine-readable list and sagarmala.gov.in is WAF-blocked for capture.</li>
          <li>Terminal-level inventories for all major ports are not yet captured.</li>
          <li>A few 2026 trade-press findings without captured URLs (Kamarajar&rsquo;s second container terminal tender, SCI privatisation status) are excluded from the database and recorded as gaps.</li>
          <li>Vessel-turnaround series differ by definition across official sources; they are kept as separate labelled series, never merged.</li>
        </ul>

        <p className="pi-caveat" style={{ marginTop: 30 }}>Downloadable extracts (CSV): <a href="/downloads/sagarmala/sagarmala-projects.csv">projects</a> · <a href="/downloads/sagarmala/sagarmala-ports.csv">ports</a> · <a href="/downloads/sagarmala/sagarmala-performance.csv">performance</a> · <a href="/downloads/sagarmala/sagarmala-companies.csv">companies</a> · <a href="/downloads/sagarmala/sagarmala-sources.csv">sources</a>. Architecture notes: <code>docs/sagarmala-intelligence-integration.md</code>.</p>
      </main>
    </>
  );
}
