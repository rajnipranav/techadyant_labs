import type { TocItem } from '../../components/ReportReader';

export const toc: TocItem[] = [
  { id: 'overview', label: 'Project overview' },
  { id: 'framework', label: 'Assessment framework' },
  { id: 'dependencies', label: 'Dependency surfaces' },
  { id: 'financing', label: 'Financing pathways' },
  { id: 'milestones', label: 'Implementation milestones' },
  { id: 'conclusion', label: 'Conclusion' },
];

export function ReportContent() {
  return (
    <>
      <p className="reader-lead">
        Kalpasar is not a single dam. It is a multi-billion-dollar platform proposal that would dam the Gulf of
        Khambhat, create a freshwater reservoir, generate hydro and tidal power, and connect Gujarat with
        Maharashtra across a 30 km causeway. The project has been discussed for decades without a binding
        financial close, environmental clearance or land-assembly order. This report assesses why.
      </p>

      <h2 id="overview">Project overview</h2>
      <p>
        The proposed dam would stretch across the Gulf of Khambhat, separating the Arabian Sea from a proposed
        1,600 sq km reservoir. Original cost estimates ranged from ₹55,000 crore to over ₹1.5 lakh crore,
        with construction timelines of 10 to 15 years. The project remains unsanctioned, with feasibility,
        environmental impact and funding still unresolved.
      </p>
      <p>
        The strategic interest lies in what Kalpasar would actually deliver: freshwater storage, peaking power,
        tidal energy, a road-rail link, and coastal land-reclamation. Each of these benefits depends on separate
        engineering, financing and governance systems that have not been integrated into a single accountable
        programme.
      </p>

      <h2 id="framework">Assessment framework</h2>
      <p>
        This report applies a platform-infrastructure lens: large infrastructure projects succeed when dependency
        surfaces are mapped before capital is committed. A dependency surface includes engineering inputs,
        long-lead equipment, land and water rights, inter-state agreements, environmental clearances, and the
        financing instruments that convert political intent into contractor behaviour.
      </p>
      <p>
        Kalpasar fails this test. It has repeated feasibility revisions, multiple cost estimates with no baseline
        audit, and no publicly available dependency map. The result is a project that is easy to announce and
        difficult to cancel, but not yet ready to build.
      </p>

      <h2 id="dependencies">Dependency surfaces</h2>
      <p>
        The main technical dependencies are dam engineering, marine works, power evacuation, water-rights
        allocation, and coastal-zone clearance. Each dependency has multiple state and central agencies involved,
        with no single entity holding end-to-end accountability. The Gulf of Khambhat also has one of the highest
        tidal ranges in India, which affects both construction sequencing and long-term structural integrity.
      </p>
      <p>
        Financing dependencies are equally unresolved. The project has moved from central budget to public-private
        partnership models, then back to central-state sharing, without a final financial structure. International
        lenders typically require environmental clearance, feasibility audit and partial risk guarantees before
        committing large-ticket infrastructure finance. None of those conditions are fully satisfied.
      </p>

      <h2 id="financing">Financing pathways</h2>
      <p>
        If Kalpasar were to proceed, financing would likely require a blend of Centre funding, state equity,
        external multilateral support and long-tenor debt. The current fiscal and regulatory environment makes
        large greenfield infrastructure more viable when packaged as a revenue-generating asset rather than a
        public-works project. That means power tariffs, water pricing and toll revenue would all need political
        consensus before contractors would bid.
      </p>
      <p>
        The report reviews three financing scenarios: base-case public funding, blended PPP with output-based
        grants, and a phased-build model that would allow partial commissioning while keeping later phases
        contingent on revenue performance.
      </p>

      <h2 id="milestones">Implementation milestones</h2>
      <p>
        A credible implementation roadmap for Kalpasar would require: a completed detailed project report with
        independent peer review; environmental and coastal-zone clearances; inter-state agreement on water
        allocation and cost sharing; land-acquisition and resettlement framework; procurement of long-lead
        marine equipment; and a financing close with committed multilateral or commercial lenders.
      </p>
      <p>
        None of these milestones is scheduled. The report maps each milestone, its typical lead time, the
        agencies that must approve it, and the risks that would arise if sequencing is ignored.
      </p>

      <h2 id="conclusion">Conclusion</h2>
      <p>
        Kalpasar remains a strategic idea in search of an implementation system. The underlying logic — coastal
        water security, renewable peaking power, and a new national corridor — is defensible. But ideas without
        dependency discipline remain proposals, not projects.
      </p>
      <p>
        The report’s recommendation is a structured pre-project phase: dependency mapping, independent DPR
        audit, environmental baseline, and a transparent financing framework. Until those conditions are met,
        the project is likely to remain in discussion rather than execution.
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
          The companion <strong>data workbook</strong> ships the underlying data tables, source data and
          project-economics worksheets behind this assessment.
        </p>
        <a
          href="https://library.techadyant.com/free%20reports/Kalpasar_Economic_Impact_Workbook.xlsx"
          download
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, textDecoration: 'none' }}
        >
          &darr; Download the data workbook (Excel)
        </a>
      </div>
    </>
  );
}
