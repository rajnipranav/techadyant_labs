import type { TocItem } from '../../components/ReportReader';

export const toc: TocItem[] = [
  { id: 'decision', label: 'The decision India faces' },
  { id: 'threat', label: 'Why migration starts before Q-Day' },
  { id: 'actions', label: 'Five actions for 2026' },
  { id: 'sectors', label: 'Where to begin' },
  { id: 'sources', label: 'Sources and limits' },
];

export function ReportContent() {
  return (
    <>
      <p className="reader-lead">
        Q-Day is the point at which a cryptographically relevant quantum computer can break the public-key cryptography
        used across today&apos;s digital systems. It is not a date on a calendar. It is a migration problem that must be
        managed before the hardware arrives.
      </p>

      <h2 id="decision">The decision India faces</h2>
      <p>
        India&apos;s exposure is not confined to a single sector or a future quantum-computing market. Public-key cryptography
        sits in identity, payments, telecom networks, government services, enterprise systems and long-lived records.
        The strategic task is to identify where confidentiality must survive for years, build crypto-agility into the
        systems being procured now, and migrate in a sequence that preserves interoperability and public trust.
      </p>
      <p>
        The report&apos;s conclusion is deliberately practical: India should treat post-quantum cryptography (PQC) as a
        national infrastructure transition, not as a standalone research programme. The objective is not immediate
        self-sufficiency in every algorithm or component. It is the capacity to inventory, test, integrate, procure and
        govern the systems on which the country depends.
      </p>

      <h2 id="threat">Why migration starts before Q-Day</h2>
      <p>
        Some data is valuable long after it is created. An adversary can collect encrypted material today and attempt to
        decrypt it when quantum capability improves. This harvest-now, decrypt-later risk means that organisations cannot
        wait for a definitive Q-Day forecast. They need an inventory of cryptographic dependencies, a way to replace
        algorithms without rebuilding entire systems, and a risk-based migration plan.
      </p>
      <p>
        The technical standards are moving, but implementation remains an institutional challenge. Algorithms must be
        tested in real systems, combined with existing protocols during transition, and supported by hardware, key
        management, identity and operational processes. The relevant question for leaders is therefore: which systems
        cannot safely wait for the next replacement cycle?
      </p>

      <h2 id="actions">Five actions for 2026</h2>
      <ol>
        <li><strong>Inventory cryptography.</strong> Identify public-key algorithms, certificates, hardware security modules, vendors, protocols and data-retention obligations.</li>
        <li><strong>Prioritise long-life data.</strong> Start with information whose confidentiality must survive the longest, alongside nationally critical services.</li>
        <li><strong>Build crypto-agility.</strong> Require systems to support controlled algorithm and key-management replacement, rather than treating PQC as a one-off upgrade.</li>
        <li><strong>Test before mandating.</strong> Establish shared test, assurance and interoperability capability for government, financial-sector, telecom and defence use cases.</li>
        <li><strong>Use procurement to build capability.</strong> Make migration requirements, assurance and supportability visible in procurement—while avoiding vendor lock-in.</li>
      </ol>

      <h2 id="sectors">Where to begin</h2>
      <p>
        The first wave should focus on systems with high consequence, long migration cycles or long-lived data: government
        identity and public digital infrastructure; BFSI payment and settlement systems; telecommunications and network
        management; and defence and critical-infrastructure environments. Each sector needs a different migration plan,
        but all depend on the same foundations: trusted standards, a complete inventory, tested implementation and
        accountable ownership.
      </p>

      <h2 id="sources">Sources and limits</h2>
      <p>
        This free report synthesises public standards, government and regulatory material, research literature and
        industry evidence. Timing scenarios, market estimates, risk scores and investment recommendations are Techadyant
        Labs analytical judgements, not predictions. The report should be read alongside the latest primary-source
        guidance from standards bodies and relevant Indian regulators, which may change after publication.
      </p>
      <p>
        Download the full report for the sectoral analysis, implementation roadmap, figures, tables, methodology and
        references. The companion workbook contains the underlying data tables supplied with this edition.
      </p>

      <div
        style={{
          margin: '1.9rem 0 0.5rem',
          padding: '1.15rem 1.3rem',
          border: '1px solid var(--border, #2a3a4d)',
          borderRadius: 10,
          background: 'rgba(56, 225, 196, 0.06)',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--brass-cream, #C9A84C)',
            marginBottom: '0.45rem',
          }}
        >
          Free bonus &middot; included
        </div>
        <p style={{ margin: '0 0 0.85rem' }}>
          The companion <strong>data workbook</strong> ships the underlying data tables, figure data and source data
          behind this report &mdash; free, no signup required.
        </p>
        <a
          href="https://library.techadyant.com/free%20reports/Techadyant_Labs_QDay_Report.xlsx"
          download
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, textDecoration: 'none' }}
        >
          &darr; Download the data workbook (Excel)
        </a>
      </div>
    </>
  );
}
