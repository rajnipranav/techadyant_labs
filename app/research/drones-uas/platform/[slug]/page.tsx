import type { Metadata } from 'next';
import Link from 'next/link';
import { AtlasNav } from '../../../AtlasNav';
import { platforms, platformBySlug, procForPlatform, componentsForPlatform, companySlug, REPORTS, categoryReport, crossAtlas } from '../../data';
import { listStaticParamsForBase } from '../../../../../lib/loadDossier';
import { getThinRecordBySlug } from "@/lib/thinRegistry";
import { ThinEntityPage } from '@/app/_thinEntityPage';

export function generateStaticParams() { const dossierSlugs = listStaticParamsForBase("/research/drones-uas/platform/");
  const thinSlugs = [
    { slug: "adani-drishti-10-drn-0006" },
    { slug: "aarav-inspecto-x-drn-0057" },
    { slug: "adani-bel-sm-1-joint-drn-0059" },
    { slug: "adani-akshi-7-drn-0143" },
    { slug: "aarav-inspecto-pro-drn-0092" },
    { slug: "aebird-skywatch-drn-0115" },
    { slug: "aerochief-skyhawk-drn-0091" },
    { slug: "alpha-design-uav-avionics-suite-drn-0064" },
    { slug: "aero360-skyinspect-drn-0114" },
    { slug: "aerovironment-rq-11b-raven-drn-0040" },
    { slug: "apollyon-ahuti-drn-0135" },
    { slug: "aero360-industrial-uav-drn-0047" },
    { slug: "aebird-inspecto-drn-0054" },
    { slug: "aerovironment-wasp-ae-drn-0039" },
    { slug: "airbound-trt-drn-0139" },
    { slug: "arcanumspace-arc-odin-drn-0145" },
    { slug: "av-switchblade-300-drn-0017" },
    { slug: "asteria-wyvern-drn-0034" },
    { slug: "avighna-aerospace-avi-1-drn-0078" },
    { slug: "av-switchblade-600-drn-0102" },
    { slug: "bangalore-aeroverse-subscale-uav-drn-0050" },
    { slug: "blm-alpha-industries-alpha-2-early-indigenous-drn-0070" },
    { slug: "bonv-aero-aero-x-drn-0076" },
    { slug: "bharat-dynamics-bdlm-01-drn-0101" },
    { slug: "bhel-cargomark-1-drn-0130" },
    { slug: "botlab-atri-drn-0144" },
    { slug: "bhel-dronemark-1-drn-0080" },
    { slug: "asteria-a-200-apollo-drn-0033" },
    { slug: "chinese-ch-4-drn-0088" },
    { slug: "baykar-bayraktar-tb2-drn-0069" },
    { slug: "detect-technologies-detect-1-drn-0110" },
    { slug: "bel-counter-uas-system-drn-0042" },
    { slug: "bonv-aero-cloudx-drn-0077" },
    { slug: "curphy-aero-r-1-drn-0079" },
    { slug: "cyient-uav-avionics-software-platform-drn-0060" },
    { slug: "chinese-gj-11-sharp-sword-drn-0090" },
    { slug: "dcm-shriram-hexacopter-drn-0058" },
    { slug: "dji-inspire-2-drn-0074" },
    { slug: "chinese-wing-loong-ii-drn-0089" },
    { slug: "dji-matrice-350-rtk-drn-0124" },
    { slug: "dhaksha-dh-agrigator-e10-drn-0140" },
    { slug: "drdo-abhyas-drn-0020" },
    { slug: "dji-phantom-4-rtk-drn-0073" },
    { slug: "dji-agras-t40-drn-0075" },
    { slug: "drdo-als-50-drn-0067" },
    { slug: "dji-mavic-3-drn-0071" },
    { slug: "dji-mavic-3-thermal-drn-0127" },
    { slug: "dji-mini-4-pro-drn-0126" },
    { slug: "drdo-black-kite-drn-0027" },
    { slug: "dji-air-3-drn-0125" },
    { slug: "drdo-alfa-m-drn-0085" },
    { slug: "drdo-cats-warrior-drn-0082" },
    { slug: "drdo-imperial-eagle-mk-ii-drn-0118" },
    { slug: "drdo-cats-skyway-drn-0084" },
    { slug: "drdo-ghatak-drn-0008" },
    { slug: "drdo-cats-hunter-drn-0083" },
    { slug: "drdo-fleet-master-drn-0081" },
    { slug: "drdo-airborne-sigint-pod-uav-concept-drn-0043" },
    { slug: "drdo-imperial-eagle-drn-0026" },
    { slug: "drdo-sling-drn-0028" },
    { slug: "drdo-sling-mk-ii-drn-0120" },
    { slug: "drdo-panchi-drn-0012" },
    { slug: "drdo-rustom-i-drn-0010" },
    { slug: "drdo-nishant-drn-0011" },
    { slug: "drdo-swift-drn-0009" },
    { slug: "drdo-netra-original-v1-drn-0049" },
    { slug: "dji-matrice-300-rtk-drn-0072" },
    { slug: "drdo-ulka-drn-0061" },
    { slug: "drdo-uxv-1-drn-0116" },
    { slug: "droneacharya-surveyor-x-drn-0112" },
    { slug: "drdo-tapas-bh-rustom-ii-drn-0007" },
    { slug: "drdo-uxv-2-drn-0117" },
    { slug: "elbit-hermes-900-drn-0005" },
    { slug: "endureair-sabal-200-drn-0136" },
    { slug: "edall-engine-test-bench-drn-0066" },
    { slug: "eplane-e100-drn-0108" },
    { slug: "endureair-vahak-6-drn-0137" },
    { slug: "ga-asi-avenger-predator-c-drn-0068" },
    { slug: "drdo-lakshya-drn-0019" },
    { slug: "droneacharya-multirotor-x-drn-0056" },
    { slug: "garuda-gs-2000-drn-0095" },
    { slug: "garuda-gs-1000-drn-0032" },
    { slug: "garuda-drona-1-drn-0029" },
    { slug: "drdo-imperial-eagle-mk-iii-drn-0119" },
    { slug: "garuda-avi-drone-drn-0096" },
    { slug: "garuda-agri-drone-drn-0031" },
    { slug: "general-aeronautics-ga-3-drn-0035" },
    { slug: "hal-lakshya-production-drn-0051" },
    { slug: "hal-iai-heron-tp-planned-drn-0052" },
    { slug: "hal-lakshya-mk-ii-drn-0121" },
    { slug: "hal-lakshya-2-pta-drn-0122" },
    { slug: "hal-pt-2-drn-0062" },
    { slug: "garuda-kv-1-guardian-drn-0030" },
    { slug: "general-atomics-avenger-predator-c-drn-0123" },
    { slug: "iai-rotem-l-drn-0104" },
    { slug: "iai-searcher-mk-ii-drn-0003" },
    { slug: "ideaforge-netra-v2-drn-0023" },
    { slug: "iai-searcher-mk-iii-drn-0053" },
    { slug: "ga-asi-mq-9b-seaguardian-drn-0004" },
    { slug: "dji-agras-t10-drn-0128" },
    { slug: "ideaforge-q6-drn-0025" },
    { slug: "iai-heron-tp-drn-0002" },
    { slug: "iai-green-dragon-drn-0103" },
    { slug: "ideaforge-netra-v4-pro-drn-0024" },
    { slug: "ideaforge-q4-inspire-drn-0099" },
    { slug: "ideaforge-netra-v4-mini-drn-0100" },
    { slug: "ideaforge-switch-drn-0021" },
    { slug: "ideaforge-netra-v4-pro-plus-drn-0097" },
    { slug: "ideaforge-ryn-1-rynan-drn-0129" },
    { slug: "ideaforge-switch-v2-drn-0142" },
    { slug: "ideaforge-zolt-drn-0141" },
    { slug: "ideaforge-switch-mini-drn-0022" },
    { slug: "iai-harpy-drn-0014" },
    { slug: "ig-defence-kal-drn-0134" },
    { slug: "kalyani-bharat-forge-uav-structure-kit-drn-0063" },
    { slug: "marut-drones-ag-365-s-drn-0093" },
    { slug: "marut-drones-ag-365-v-drn-0094" },
    { slug: "kawa-divyastra-mk3-drn-0132" },
    { slug: "marut-ag-365-drn-0046" },
    { slug: "ig-drones-survey-drone-drn-0055" },
    { slug: "ideaforge-switch-uav-3-0-drn-0098" },
    { slug: "iai-heron-drn-0001" },
    { slug: "newspace-sheshnaag-150-drn-0133" },
    { slug: "nibe-vayuastra-drn-0131" },
    { slug: "ig-drones-inspector-x-drn-0113" },
    { slug: "newspace-alfa-s-drn-0044" },
    { slug: "pixoastro-honey-b-drn-0109" },
    { slug: "newspace-mehermuktami-hale-drn-0045" },
    { slug: "iai-harop-drn-0013" },
    { slug: "q-alpha-rhh-150-drn-0146" },
    { slug: "skye-air-skyship-2-drn-0107" },
    { slug: "skye-air-skyship-drn-0037" },
    { slug: "techeagle-vertiplane-x-3-drn-0105" },
    { slug: "techeagle-vertiplane-x-4-drn-0036" },
    { slug: "solar-industries-nagastra-1-drn-0015" },
    { slug: "techeagle-vertiplane-x-5-drn-0106" },
    { slug: "solar-industries-nagastra-2-drn-0016" },
    { slug: "skylark-drones-surveyor-pro-drn-0111" },
    { slug: "wb-group-warmate-drn-0018" },
    { slug: "schiebel-camcopter-s-100-drn-0041" },
    { slug: "the-eplane-company-e200-drn-0038" },
    { slug: "skylark-skylark-3-drn-0048" },
    { slug: "turkish-vestel-karayel-drn-0087" },
    { slug: "turkish-bayraktar-akinci-drn-0086" },
    { slug: "vem-tech-gcs-100-drn-0065" },
    { slug: "endureair-sabal-20-drn-0138" }
  ];
  const seen = new Set(dossierSlugs.map(s => s.slug));
  for (const s of thinSlugs) { if (!seen.has(s.slug)) dossierSlugs.push(s); }
  return dossierSlugs; }
// dynamicParams removed — thin fallback guarantees 200 for hub-linked slugs

const num = (v: number | null, u: string) => (v == null ? null : `${v.toLocaleString('en-IN')}${u}`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) {
    const thin = getThinRecordBySlug(slug);
    if (thin) {
      return {
        title: `${thin.name} — India UAS Atlas`,
        description: thin.summary,
        alternates: { canonical: `https://labs.techadyant.com${thin.path}` },
        robots: { index: false, follow: true },
      };
    }
    return { title: 'Platform — UAS Atlas' };
  }
  const bits = [p.category, p.origin, p.mfr].filter(Boolean).join(' · ');
  return {
    title: `${p.name} — India UAS Atlas${p.category ? ` (${p.category})` : ''}`,
    description: `${p.name}${p.variant ? ` (${p.variant})` : ''}: ${bits}. ${p.desc || `Specifications, operator, procurement history and components in India's drone ecosystem.`}`.slice(0, 250),
    alternates: { canonical: `https://labs.techadyant.com/research/drones-uas/platform/${p.slug}/` },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = platformBySlug(slug);
  if (!p) {
    const thin = getThinRecordBySlug(slug);
    if (thin) return <ThinEntityPage record={thin} />;
    return <><AtlasNav /><section className="wrap"><p>Platform not found.</p></section></>;
  }
  const proc = procForPlatform(p.name);
  const comps = componentsForPlatform(p.id);
  const rep = REPORTS[categoryReport(p.category)];
  const cslug = companySlug(p.mfr);
  const specs = [num(p.mtow, ' kg MTOW'), num(p.payload, ' kg payload'), num(p.endurance, ' hr endurance'), num(p.range, ' km range'), num(p.ceiling, ' m ceiling'), num(p.speed, ' km/h'), p.power].filter(Boolean) as string[];
  const totalProc = proc.reduce((s, x) => s + (x.inr_cr || 0), 0);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Thing', name: p.name, category: p.category,
    description: p.desc || `${p.name} unmanned aerial system`, manufacturer: { '@type': 'Organization', name: p.mfr },
    countryOfOrigin: p.origin, url: `https://labs.techadyant.com/research/drones-uas/platform/${p.slug}/`,
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
            <Link href="/research/drones-uas/">Unmanned Systems</Link><span className="sep">/</span><span>{p.name}</span>
          </div>
          <div className="ed-kicker" style={{ color: 'var(--brass, #C9A84C)' }}>{p.category} · {p.origin}{p.status ? ` · ${p.status}` : ''}</div>
          <h1>{p.name}{p.variant ? <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.6em' }}> {p.variant}</span> : null}</h1>
          {p.desc && <p className="lede">{p.desc}</p>}
        </div>
      </header>
      <section className="wrap" style={{ display: 'grid', gap: 26 }}>
        <div>
          <div className="ed-kicker" style={{ marginBottom: 10 }}>Specifications</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {specs.map((s) => <span key={s} style={{ fontSize: 12.5, fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--text-dim)', border: '1px solid var(--border, rgba(255,255,255,.14))', borderRadius: 6, padding: '4px 10px' }}>{s}</span>)}
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            {p.mfr && <div>Maker: {cslug ? <Link href={`/research/drones-uas/company/${cslug}/`} style={{ color: 'var(--link, #6cb0ff)' }}>{p.mfr}</Link> : p.mfr}</div>}
            {p.operator && <div>Primary operator: {p.operator}</div>}
            {p.inservice != null && <div>In service: {p.inservice}</div>}
            {p.indig != null && <div>Indigenous content: <span style={{ color: 'var(--brass)' }}>{p.indig}%</span></div>}
            {p.roles && <div>Mission roles: {p.roles}</div>}
            {p.sensors && <div>Sensors: {p.sensors}</div>}
            {p.payloads && <div>Payloads: {p.payloads}</div>}
          </div>
        </div>

        {proc.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Procurement history · {proc.length} contracts · ₹{Math.round(totalProc).toLocaleString('en-IN')} cr</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {proc.map((x) => (
                <li key={x.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{x.agency}{x.qty ? ` · ${x.qty} units` : ''}{x.date ? ` · ${x.date.slice(0, 4)}` : ''}</span>
                  <span style={{ fontSize: 13, color: 'var(--brass)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{x.inr_cr != null ? `₹${Math.round(x.inr_cr).toLocaleString('en-IN')} cr` : '—'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comps.length > 0 && (
          <div>
            <div className="ed-kicker" style={{ marginBottom: 10 }}>Components & supply chain</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {comps.map((c) => {
                const x = crossAtlas(`${c.type} ${c.name}`);
                return (
                  <li key={c.id} style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{c.name}</span>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--brass)', marginLeft: 8 }}>{c.type}</span>
                    <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 2 }}>{c.supplier || c.mfr}</div>
                    {x.length > 0 && <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>{x.map((l) => <Link key={l.label} href={l.href} style={{ fontSize: 11, color: 'var(--link, #6cb0ff)' }}>→ {l.label} in the Atlas</Link>)}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div style={{ border: '1px solid var(--border, rgba(255,255,255,.12))', borderRadius: 10, padding: '16px 18px', background: 'var(--bg-2, rgba(255,255,255,.02))' }}>
          <div className="ed-kicker" style={{ marginBottom: 8 }}>Go deeper</div>
          <Link href={`/reports/${rep.slug}/`} style={{ color: 'var(--brass)' }}>Read: {rep.title} →</Link>
          <div style={{ marginTop: 8 }}><Link href="/research/drones-uas/" style={{ color: 'var(--text-dim)', fontSize: 13 }}>← Back to the UAS Atlas</Link></div>
        </div>
      </section>
    </>
  );
}
