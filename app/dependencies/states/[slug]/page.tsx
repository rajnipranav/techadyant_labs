import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd, breadcrumb, faqLd, SITE } from '../../../research/seo';
import { states, stateBySlug, sectorBySlug, factoriesInState, companyName, inr } from '../../data';

export function generateStaticParams() {
  return states.map((s) => ({ slug: s.state_id }));
}

const DIMS: [string, string][] = [
  ['output', 'Output'], ['employment', 'Employment'], ['export', 'Exports'], ['infra', 'Infrastructure'],
  ['power', 'Power'], ['land', 'Land'], ['logistics', 'Logistics'], ['labour', 'Labour'],
  ['talent', 'Talent'], ['ecosystem', 'Ecosystem'], ['policy', 'Policy'], ['pipeline', 'Pipeline'], ['future', 'Future-readiness'],
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = stateBySlug(slug);
  if (!s) return { title: 'State' };
  return {
    title: `${s.name} Manufacturing Scorecard — Capability & Dependency Reduction`,
    description: `${s.name}'s manufacturing capability index is ${s.mci_composite}/100. ${s.narrative}`.slice(0, 250),
    alternates: { canonical: `${SITE}/dependencies/states/${s.state_id}/` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = stateBySlug(slug);
  if (!s) notFound();
  const facs = factoriesInState(s.state_id);
  const leadSectors = (s.lead_sectors || []).map((id) => sectorBySlug(id)).filter(Boolean);
  const faqs = [
    { q: `How strong is ${s.name}'s manufacturing capability?`, a: `${s.name} scores ${s.mci_composite}/100 on the Manufacturing Capability Index. ${s.narrative}` },
  ];

  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Dependencies', path: '/dependencies/' }, { name: 'States', path: '/dependencies/' }, { name: s.name, path: `/dependencies/states/${s.state_id}/` }]),
        faqLd(faqs),
        { '@context': 'https://schema.org', '@type': 'Place', name: s.name, address: { '@type': 'PostalAddress', addressRegion: s.name, addressCountry: 'IN' }, description: s.narrative },
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/dependencies/">Dependencies</Link><span className="sep">/</span><span>{s.name}</span>
          </div>
          <h1>{s.name} — Manufacturing Scorecard</h1>
          <p className="lede">{s.narrative}</p>
        </div>
      </header>
      <section className="wrap">
        <div className="dep-kpis">
          <div className="dep-kpi"><b>{s.mci_composite}</b><span>Capability index</span></div>
          <div className="dep-kpi"><b>{s.dependency_reduction_score}</b><span>Dependency-reduction score</span></div>
          <div className="dep-kpi"><b>{s.new_factories_12mo}</b><span>New factories (12mo)</span></div>
          <div className="dep-kpi"><b>{inr(s.pli_investment_inr_cr)}</b><span>PLI investment</span></div>
        </div>
      </section>
      <section className="wrap">
        <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>Capability</div><h2>Thirteen dimensions</h2></div></div>
        <div className="dep-dim-grid">
          {DIMS.map(([k, label]) => {
            const v = s.sub_dimensions[k] ?? 0;
            return (
              <div key={k} className="dep-dim"><div className="dep-dim-bar"><i style={{ width: `${v}%`, background: v >= 75 ? '#0F8E78' : v >= 55 ? '#5A7886' : '#B5891E' }} /></div><div className="dep-dim-l"><span>{label}</span><b>{v}</b></div></div>
            );
          })}
        </div>
      </section>
      {leadSectors.length > 0 && (
        <section className="wrap" style={{ background: 'var(--bg-2)' }}>
          <h3 style={{ marginTop: 0 }}>Lead sectors</h3>
          <p className="dep-chips">{leadSectors.map((sec) => sec && <Link key={sec.sector_id} href={`/dependencies/sectors/${sec.sector_id}/`} className="dep-chip dep-chip-link">{sec.name}</Link>)}</p>
        </section>
      )}
      {facs.length > 0 && (
        <section className="wrap">
          <div className="section-head-ed"><div><div className="ed-kicker" style={{ color: '#C9A84C' }}>On the ground</div><h2>Manufacturing projects</h2></div></div>
          <ul className="dep-proj">
            {facs.map((f) => <li key={f.factory_id}><span className="dep-proj-name">{f.name}</span><span className="dep-proj-meta">{companyName(f.company_id)} · {f.status.replace(/_/g, ' ')}{f.investment_inr_cr ? ` · ${inr(f.investment_inr_cr)}` : ''}</span></li>)}
          </ul>
        </section>
      )}
      <section className="wrap"><p className="note-fine">Confidence: {s.confidence === 'V' ? 'Verified' : s.confidence === 'R' ? 'Reasoned estimate' : 'Strategic inference'}. Part of Techadyant Labs&apos; Critical Manufacturing Dependencies (Edition I).</p></section>
    </>
  );
}
