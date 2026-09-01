import type { Metadata } from 'next';
import { companyDossierMetadata, renderCompanyDossierPage } from '../../../../_companyDossierPage';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { companies, companyBySlug, platformsForCompany, componentsForCompany } from '../../data';
import { getThinRecordBySlug } from "@/lib/thinRegistry";
import { ThinEntityPage } from "@/app/_thinEntityPage";
import { RelatedReportsLinks, ENTITY_TO_REPORTS } from '../../../report-links';
import { listStaticParamsForBase } from '../../../../../lib/loadDossier';

export function generateStaticParams() { const dossierSlugs = listStaticParamsForBase("/research/drones-uas/company/");
  const thinSlugs = [
    { slug: "aadhaar-tech-solutions-mfr-086" },
    { slug: "aeriosense-mfr-060" },
    { slug: "aarav-unmanned-systems-mfr-040" },
    { slug: "aebird-aerospace-mfr-036" },
    { slug: "aero360-mfr-027" },
    { slug: "aerogramme-mfr-062" },
    { slug: "aero-positioning-mfr-064" },
    { slug: "anduril-industries-mfr-108" },
    { slug: "airbound-mfr-096" },
    { slug: "aerochief-aerospace-mfr-045" },
    { slug: "asteria-aerospace-ltd-mfr-016" },
    { slug: "alpha-design-technologies-pvt-ltd-mfr-018" },
    { slug: "bangalore-aeroverse-pvt-ltd-mfr-035" },
    { slug: "apollyon-dynamics-mfr-101" },
    { slug: "baykar-technologies-mfr-052" },
    { slug: "atsuya-technologies-mfr-059" },
    { slug: "avighna-aerospace-mfr-042" },
    { slug: "athergrid-energy-mfr-076" },
    { slug: "aviation-industry-corp-of-china-avic-mfr-055" },
    { slug: "bharat-dynamics-limited-bdl-mfr-012" },
    { slug: "bharat-heavy-electricals-ltd-bhel-mfr-044" },
    { slug: "bharat-electronics-limited-bel-mfr-010" },
    { slug: "botlab-dynamics-mfr-100" },
    { slug: "bharat-forge-mfr-013" },
    { slug: "cognida-ai-mfr-063" },
    { slug: "carbon-based-uav-solutions-mfr-065" },
    { slug: "controp-precision-technologies-mfr-069" },
    { slug: "cyient-ltd-mfr-022" },
    { slug: "china-aerospace-science-technology-corp-casc-mfr-054" },
    { slug: "curphy-aero-systems-mfr-043" },
    { slug: "diamond-aircraft-industries-mfr-074" },
    { slug: "dji-mfr-051" },
    { slug: "brp-rotax-mfr-066" },
    { slug: "drdo-aerial-delivery-research-development-establishm-mfr-008" },
    { slug: "detect-technologies-mfr-047" },
    { slug: "dcm-shriram-industries-mfr-025" },
    { slug: "dhaksha-unmanned-systems-mfr-097" },
    { slug: "dlr-systems-mfr-085" },
    { slug: "bonv-aero-mfr-041" },
    { slug: "drdo-research-centre-imarat-rci-mfr-033" },
    { slug: "drdo-defence-electronics-research-laboratory-dlrl-mfr-032" },
    { slug: "droneacharya-aerial-innovations-mfr-038" },
    { slug: "dreamfly-innovations-mfr-104" },
    { slug: "drdo-centre-for-airborne-systems-cabs-mfr-031" },
    { slug: "drona-aviation-mfr-058" },
    { slug: "drone-federation-of-india-dfi-mfr-090" },
    { slug: "dronetech-lab-mfr-061" },
    { slug: "arcanumspace-mfr-103" },
    { slug: "endureair-systems-mfr-095" },
    { slug: "droneverse-aviation-mfr-102" },
    { slug: "flyeaa-robotics-mfr-088" },
    { slug: "general-atomics-aeronautical-systems-ga-asi-mfr-002" },
    { slug: "data-patterns-india-ltd-mfr-094" },
    { slug: "general-aeronautics-pvt-ltd-mfr-024" },
    { slug: "garuda-aerospace-pvt-ltd-mfr-015" },
    { slug: "ig-defence-mfr-099" },
    { slug: "hindustan-aeronautics-limited-hal-mfr-009" },
    { slug: "iotrek-robotics-mfr-048" },
    { slug: "honeywell-aerospace-mfr-067" },
    { slug: "ethereal-aviation-mfr-087" },
    { slug: "indrones-solutions-mfr-057" },
    { slug: "infosys-mfr-080" },
    { slug: "elbit-systems-mfr-003" },
    { slug: "ig-drones-mfr-037" },
    { slug: "kawa-uav-hoverit-mfr-098" },
    { slug: "kalyani-strategic-systems-mfr-084" },
    { slug: "l3harris-wescam-mfr-068" },
    { slug: "larsen-toubro-l-t-mfr-082" },
    { slug: "marut-drones-mfr-039" },
    { slug: "log9-materials-mfr-077" },
    { slug: "paras-defence-and-space-technologies-ltd-mfr-093" },
    { slug: "mahindra-defence-systems-mfr-083" },
    { slug: "nvidia-mfr-075" },
    { slug: "newspace-research-technologies-mfr-023" },
    { slug: "npo-saturn-mfr-073" },
    { slug: "nibe-ltd-mfr-092" },
    { slug: "pratt-whitney-mfr-072" },
    { slug: "newspace-india-limited-nsil-mfr-034" },
    { slug: "elta-systems-mfr-070" },
    { slug: "q-alpha-aerospace-qalpha-mfr-105" },
    { slug: "raytheon-mfr-071" },
    { slug: "raphe-mphibr-mfr-049" },
    { slug: "quantum-systems-mfr-107" },
    { slug: "skydio-mfr-106" },
    { slug: "raphe-mphibr-logistics-mfr-089" },
    { slug: "skylark-drones-mfr-026" },
    { slug: "skye-air-mobility-mfr-029" },
    { slug: "schiebel-elektronische-ger-te-gmbh-mfr-005" },
    { slug: "vem-technologies-pvt-ltd-mfr-019" },
    { slug: "solar-industries-india-ltd-mfr-021" },
    { slug: "vestel-defence-mfr-053" },
    { slug: "wb-electronics-sa-mfr-006" },
    { slug: "pixoastro-technologies-mfr-046" },
    { slug: "tata-consultancy-services-tcs-mfr-079" },
    { slug: "vedarth-trailers-mfr-050" },
    { slug: "tata-advanced-systems-ltd-tasl-mfr-011" },
    { slug: "the-eplane-company-mfr-030" },
    { slug: "zen-technologies-ltd-mfr-091" },
    { slug: "techeagle-ventures-mfr-028" },
    { slug: "shenyang-aircraft-corp-sac-mfr-056" },
    { slug: "sunmobility-mfr-078" },
    { slug: "edall-systems-pvt-ltd-mfr-020" },
    { slug: "wipro-mfr-081" }
  ];
  const seen = new Set(dossierSlugs.map(s => s.slug));
  for (const s of thinSlugs) { if (!seen.has(s.slug)) dossierSlugs.push(s); }
  return dossierSlugs; }
// dynamicParams removed — thin fallback guarantees 200 for hub-linked slugs

const COMPANY_SEO: Record<string, { title: string; description: string }> = {
  'drdo-centre-for-airborne-systems-cabs-mfr-031': {
    title: 'DRDO CABS: Airborne Systems R&D, UAV Programs & Suppliers',
    description: "Inside DRDO's Centre for Airborne Systems (CABS): Nishant, Lakshya and Imperial Eagle programs, supplier ecosystem and technology transfer.",
  },
  'drdo-research-centre-imarat-rci-mfr-033': {
    title: 'DRDO RCI: Missiles, Loitering Munitions & Guidance Systems',
    description: "Inside DRDO's Research Centre Imarat (RCI): missile and loitering munition programs, supplier ecosystem and testing infrastructure.",
  },
  'drdo-defence-electronics-research-laboratory-dlrl-mfr-032': {
    title: 'DRDO DLRL: Electronic Warfare, Radar & Avionics R&D',
    description: "DRDO's Defence Electronics Research Laboratory (DLRL): EW systems, radar and avionics for Tejas, BrahMos and UAVs. Supplier mapping.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dossierMetadata = companyDossierMetadata(slug, 'drones-uas');
  if (dossierMetadata) return dossierMetadata;
  const c = companyBySlug(slug);
  if (!c) return { title: 'Company — UAS Atlas' };
  const ov = COMPANY_SEO[slug];
  return {
    title: ov?.title || `${c.name} — India UAS Atlas${c.country ? ` (${c.country})` : ''}`,
    description: ov?.description || `${c.name}: ${[c.type, c.country, c.hq].filter(Boolean).join(' · ')}. ${c.products || 'Drone platforms, components and profile in India\'s UAS ecosystem.'}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/drones-uas/company/${c.slug}/` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossierPage = renderCompanyDossierPage(slug, 'drones-uas');
  if (dossierPage) return dossierPage;
  const c = companyBySlug(slug);
  const thin = getThinRecordBySlug(slug);
  if (thin) return <ThinEntityPage record={thin} />;
  if (!c) return <><AtlasNav /><section className="wrap"><p>Company not found.</p></section></>;
  const plats = platformsForCompany(c.name);
  const comps = componentsForCompany(c.name);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: c.name, foundingDate: c.founded || undefined,
    address: c.hq || undefined, url: c.web ? (c.web.startsWith('http') ? c.web : `https://${c.web}`) : undefined,
    description: c.products || `${c.name} — India UAS ecosystem`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <AtlasNav />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/research/">The Atlas</Link><span className="sep">/</span>
            <Link href="/research/drones-uas/">Unmanned Systems</Link><span className="sep">/</span><span>{c.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{[c.type, c.country].filter(Boolean).join(' · ')}</div>
          <h1>{c.name}</h1>
          {c.products && <p className="lede">{c.products}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.8 }}>
          {c.hq && <div>Headquarters: {c.hq}</div>}
          {c.founded && <div>Founded: {c.founded}</div>}
          {c.parent && c.parent !== 'Independent' && <div>Parent: {c.parent}</div>}
          {c.indig && <div>Indigenous content: <span style={{ color: 'var(--brass)' }}>{c.indig}</span></div>}
          {c.dgca && c.dgca.toLowerCase().startsWith('y') && <div>DGCA-certified</div>}
          {c.web && <div>Website: <a href={c.web.startsWith('http') ? c.web : `https://${c.web}`} target="_blank" rel="noreferrer" style={{ color: 'var(--link, #6cb0ff)' }}>{c.web} ↗</a></div>}
        </div>

        {plats.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Platforms · {plats.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {plats.map((p) => (
                <li key={p.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <Link href={`/research/drones-uas/platform/${p.slug}/`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{p.name}</Link>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{p.category}</span>
                  {p.status && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> · {p.status}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {comps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Components supplied · {comps.length}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {comps.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{x.name}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{x.type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div><Link href="/research/drones-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the UAS Atlas</Link></div>
        {ENTITY_TO_REPORTS[slug]?.length ? <RelatedReportsLinks slugs={ENTITY_TO_REPORTS[slug]} /> : null}
      </section>
    </>
  );
}




