import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumb, datasetLd, SITE } from '../../research/seo';
import { products, sectorsRanked, productsInSector, DEP_TIER_COLOR, TIER_COLOR, usd } from '../data';

export const metadata: Metadata = {
  title: `India's ${products.length} Critical Import Dependencies — Product Explorer`,
  description: `Browse ${products.length} strategic products India imports, scored on the Critical Manufacturing Dependency Index — by sector, with source country, dependency tier and localisation verdict. Free from Techadyant Labs.`,
  alternates: { canonical: `${SITE}/dependencies/products/` },
};

export default function ProductsIndex() {
  return (
    <>
      <JsonLd data={[
        breadcrumb([{ name: 'Home', path: '/' }, { name: 'Dependencies', path: '/dependencies/' }, { name: 'Products', path: '/dependencies/products/' }]),
        datasetLd({ name: 'India Critical Import Dependencies — product list', description: `${products.length} strategic imported products scored on the CMDI and ten proprietary indices.`, path: '/dependencies/products/', keywords: ['India imports', 'critical products', 'import dependency', 'HS codes India'] }),
      ]} />
      <header className="ed-page-head">
        <div className="wrap inner">
          <div className="ed-breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/dependencies/">Dependencies</Link><span className="sep">/</span><span>Products</span>
          </div>
          <h1>Product Explorer — {products.length} strategic dependencies</h1>
          <p className="lede">Every tracked product India imports, scored on the Critical Manufacturing Dependency Index and grouped by sector. Click any product for its full scorecard, sources, makers and localisation verdict.</p>
        </div>
      </header>
      <section className="wrap">
        {sectorsRanked.map((s) => {
          const ps = productsInSector(s.sector_id).sort((a, b) => b.cmdi - a.cmdi);
          if (!ps.length) return null;
          return (
            <div key={s.sector_id} className="dep-pe-sector">
              <div className="dep-pe-head"><h2><Link href={`/dependencies/sectors/${s.sector_id}/`}>{s.name}</Link></h2><span>{ps.length} products · {usd(s.total_import_usd_bn)} · index {s.sector_dependency_index}</span></div>
              <table className="dep-table">
                <thead><tr><th>Product</th><th>CMDI</th><th>Source</th><th>Import</th><th>Verdict</th></tr></thead>
                <tbody>
                  {ps.map((p) => (
                    <tr key={p.product_id}>
                      <td><Link href={`/dependencies/products/${p.product_id}/`}>{p.name}</Link></td>
                      <td><span style={{ color: DEP_TIER_COLOR[p.dependency_tier] || '#8593A6', fontWeight: 700 }}>{p.cmdi}</span></td>
                      <td>{p.top_source_country}</td>
                      <td>{usd(p.import_usd_bn)}</td>
                      <td><span className="dep-vtag" style={{ background: `${(TIER_COLOR[p.localisation_verdict] || '#8593A6')}22`, color: TIER_COLOR[p.localisation_verdict] || '#8593A6' }}>{p.localisation_verdict}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>
    </>
  );
}
