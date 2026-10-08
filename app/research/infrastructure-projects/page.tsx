import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../AtlasNav';
import { JsonLd, breadcrumb, SITE } from '../seo';
import { expand, getIndustrialNode, inrCr, monthYear, projects, sectorLabel } from '../industrial/data';
import { programmesForProject } from '../programmes/data';
import { LINK_LABEL } from '../programmes/types';
import '../industrial/industrial.css';

const URL = `${SITE}/research/infrastructure-projects/`;
const TITLE = 'India Infrastructure Projects and Their Industrial Consequences';
const DESC = 'Tracker of infrastructure projects that change connectivity for India’s industrial nodes — status, cost, programme, sources, and what each project means for industry.';

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  keywords: ['India infrastructure projects', 'India logistics infrastructure', 'Western Dedicated Freight Corridor', 'Dholera expressway', 'Noida International Airport cargo'],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Techadyant Labs' },
};

const ORDER = ['operational', 'partially_operational', 'trial', 'under_construction', 'approved', 'announced', 'unknown'];

export default function InfrastructureProjectsPage() {
  const rows = [...projects].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));
  const verified = monthYear(projects.map((p) => p.last_verified).sort().at(-1)!);
  const crumb = breadcrumb([{ name: 'Home', path: '/' }, { name: 'The Atlas', path: '/research/' }, { name: 'Infrastructure Projects', path: '/research/infrastructure-projects/' }]);
  return (
    <>
      <AtlasNav />
      <JsonLd data={crumb} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><Link href="/research/">Atlas</Link><span className="sep">/</span><span>Infrastructure Projects</span></div>
          <div className="ed-kicker">Project → industrial consequence</div>
          <h1>Infrastructure projects that move industrial nodes</h1>
          <p className="lede">Not a list of government projects. Each entry is here because it changes connectivity for an industrial node the Atlas tracks — and the last column says what that means for industry.</p>
          <div className="node-head-meta"><span className="node-status-detail">Phase 1 pilot · {projects.length} projects · Data verified: {verified}</span></div>
        </div>
      </header>

      <section className="wrap">
        <div className="ii-table-wrap">
          <table className="ii-table ii-table-wide">
            <thead>
              <tr><th>Project</th><th>Sector</th><th>State</th><th>Status</th><th>Cost</th><th>Agency</th><th>Nodes affected · programme</th><th>Industrial consequence <span className="ii-ev ii-ev-analysis">Analysis</span></th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} id={p.id.slice(5)}>
                  <td><b>{p.name}</b><div className="ii-src-meta">{p.project_type}</div></td>
                  <td>{p.sector.replace(/_/g, ' ')}</td>
                  <td>{p.states.join(', ')}</td>
                  <td>{p.status.replace(/_/g, ' ')}<div className="ii-src-meta">{p.status_note}{p.approval_date ? ` Approved ${p.approval_date}.` : ''}{p.expected_completion ? ` Completion: ${p.expected_completion}.` : ''}</div></td>
                  <td>{inrCr(p.estimated_cost_cr)}{p.cost_note && <div className="ii-src-meta">{p.cost_note}</div>}{p.itla_appraisal_tier && <div className="ii-src-meta">≥ ₹500 cr — ITLA appraisal tier</div>}</td>
                  <td>{p.implementing_agency ?? <span className="ii-missing">not recorded</span>}</td>
                  <td>{p.affected_node_ids.map((id) => { const n = getIndustrialNode(id); return n ? <div key={id}><Link href={`/research/industrial-nodes/${n.slug}/`}>{n.short_name}</Link></div> : null; })}{!p.affected_node_ids.length && <div className="ii-missing">none directly</div>}{programmesForProject(p).map((x) => <div key={x.ref.id} className="ii-src-meta">{LINK_LABEL[x.type]} {x.ref.href ? <Link href={x.ref.href}>{x.ref.name}</Link> : x.ref.name}</div>)}<div className="ii-src-meta">{p.affected_sectors.map(sectorLabel).join(' · ')}</div></td>
                  <td>{p.strategic_significance}<div className="ii-src-meta">Sources: {expand(p.provenance).map((s, i) => <a key={s.source_id} href={s.source_url} target="_blank" rel="noopener noreferrer">{i > 0 ? ', ' : ''}{s.source_name.slice(0, 48)}{s.source_name.length > 48 ? '…' : ''}</a>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ii-fine">Filters by state, sector, status and corridor will be added once the tracker extends beyond the semiconductor pilot. Projects of ₹500 crore or more funded by the Government of India fall in the technical-appraisal tier of the new Integrated Transport &amp; Logistics Authority.</p>
        <p className="node-foot ii-foot" style={{ borderTop: 'none' }}><Link href="/research/industrial-nodes/" className="see-all">← Industrial nodes</Link></p>
      </section>
    </>
  );
}
