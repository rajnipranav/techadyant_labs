/**
 * GET /api/report-body?report=<slug>
 * Auth: Bearer <supabase token>  (paid reports)
 *
 * Returns the PREMIUM remainder of a report's on-page body as HTML — but only
 * after verifying the user owns it. The premium prose is NOT in the static
 * site bundle, so it cannot be read from page source without an entitlement.
 */
import { REPORTS, json, getUserFromRequest, hasEntitlement } from './_shared.js';

const BODIES = {
  'india-fab-ecosystem': `
    <h2 id="physical-preconditions"><span class="h2-no">04 — Preconditions</span>Water, power and land</h2>
    <p>Advanced manufacturing is, before it is anything else, a physical proposition. Fabrication consumes very large volumes of <strong>ultrapure water</strong>, and a meaningful share of input water is lost in the purification and use cycle. That places a semiconductor cluster in direct, structural relationship with the hydrology of its host region — surface allocation, groundwater stress, recycling capacity and monsoon variability all become industrial variables.</p>
    <p><strong>Power</strong> is the second precondition: not merely cheap power, but <em>firm, clean, uninterrupted</em> power, since process excursions from supply instability can destroy in-progress wafers worth far more than the energy saved. <strong>Land and the corridor</strong> form the third — the reason a Special Investment Region matters is that it bundles land, trunk infrastructure and single-window approvals into something a global operator can underwrite.</p>
    <p>The strategic insight is that these preconditions are <em>regional public goods</em>. Once built for one anchor tenant, they lower the entry cost for the next — which is how a single fab decision can seed a cluster. It is also why the infrastructure layer, not the chip line, may prove the more durable beneficiary.</p>

    <h2 id="the-packaging-layer"><span class="h2-no">05 — The back end</span>The packaging layer and where jobs land</h2>
    <p>If one layer deserves more attention than it receives, it is back-end packaging. Assembly, test and packaging is less capital-intensive than front-end fabrication, ramps faster, and is more labour-absorbing per dollar invested. For a country whose political economy needs <em>employment</em> as much as it needs technological prestige, the back end is arguably the more important story — and it is where the first meaningful wave of semiconductor jobs will land.</p>
    <p>Packaging is also where the technology frontier is quietly moving. As gains from shrinking transistors slow, <strong>advanced packaging</strong> — chiplets, 2.5D and 3D integration — has become a primary axis of performance improvement. A back-end-first entry is therefore not a consolation prize; it positions a cluster on a rising part of the value chain. The risk is input dependency: substrates, lead-frames and specialty consumables remain thin and largely imported.</p>

    <figure class="report-figure">
      <div class="fig-frame">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Indicative value-capture by layer">
          <g font-family="Inter, sans-serif">
            <g><text x="0" y="30" font-size="13" fill="#9898A8">Equipment &amp; tool vendors (imported)</text><rect x="360" y="14" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="14" width="350" height="18" rx="3" fill="#6366F1" opacity="0.75"/><text x="716" y="28" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">92</text></g>
            <g><text x="0" y="76" font-size="13" fill="#9898A8">Materials, substrates, specialty gases</text><rect x="360" y="60" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="60" width="296" height="18" rx="3" fill="#6366F1" opacity="0.75"/><text x="662" y="74" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">78</text></g>
            <g><text x="0" y="122" font-size="13" fill="#9898A8">Construction &amp; EPC contractors</text><rect x="360" y="106" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="106" width="243" height="18" rx="3" fill="#38e1c4" opacity="0.75"/><text x="609" y="120" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">64</text></g>
            <g><text x="0" y="168" font-size="13" fill="#9898A8">Packaging / OSAT operators &amp; labour</text><rect x="360" y="152" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="152" width="209" height="18" rx="3" fill="#F5B544" opacity="0.75"/><text x="575" y="166" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">55</text></g>
            <g><text x="0" y="214" font-size="13" fill="#9898A8">Power &amp; water utility providers</text><rect x="360" y="198" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="198" width="182" height="18" rx="3" fill="#38e1c4" opacity="0.75"/><text x="548" y="212" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">48</text></g>
            <g><text x="0" y="260" font-size="13" fill="#9898A8">Domestic design &amp; IP</text><rect x="360" y="244" width="380" height="18" rx="3" fill="#ffffff" opacity="0.04"/><rect x="360" y="244" width="99" height="18" rx="3" fill="#F5B544" opacity="0.75"/><text x="465" y="258" font-family="ui-monospace,monospace" font-size="11" fill="#E6D1A0">26</text></g>
          </g>
        </svg>
      </div>
      <figcaption><span class="fig-no">Fig. 2</span><span>Indicative, illustrative relative value-capture across cluster layers (0–100 scale, author’s framework — not measured data). The largest early flows accrue to imported tools and materials, not domestic design.</span></figcaption>
    </figure>

    <h2 id="who-captures-value"><span class="h2-no">06 — Beneficiaries</span>Who captures the value</h2>
    <p>Return to the title’s question. In the early phase, the largest value flows accrue to actors mostly outside the host economy: the global equipment vendors whose tools fill the cleanroom, and the materials suppliers who feed it (Fig. 2 illustrates the structural skew — it is a framework, not measured data). Inside the host economy, the clearest near-term beneficiaries are <strong>construction and EPC contractors</strong>, <strong>utility providers</strong>, and the <strong>operators and workforce of the packaging lines</strong>.</p>
    <blockquote class="report-quote"><p>The value a country captures from a fab is not set on the day it opens. It is set by how quickly the edges of the dependency graph move onshore.</p><cite>— Working thesis, Techadyant Labs</cite></blockquote>
    <p>Domestic <strong>design and IP</strong> — the highest-margin layer — capture builds slowest, because it depends on talent depth, anchor customers and time. The Design-Linked Incentive scheme is an attempt to seed it deliberately rather than waiting for it to emerge. Whether India ends up a manufacturing-service economy in chips, or climbs into design and IP, is the single most consequential open question — and it will be answered over a decade, not a news cycle.</p>

    <h2 id="the-talent-constraint"><span class="h2-no">07 — The human edge</span>The talent constraint</h2>
    <p>Capital can be committed in a board meeting; a fab can be built in two to three years. The capability to run it at competitive yield is a different kind of asset — accumulated, tacit, and held by process engineers, equipment specialists and yield-management teams who cannot be procured on the timeline of the tools. This is the asymmetry that ultimately sets the ramp curve.</p>
    <p>Every late-entrant manufacturing economy has met the same wall and answered it the same way: seed the early lines with experienced expatriate engineers while building domestic pipelines through universities, vendor training and on-the-job ramp. Both halves take years. The leading indicators worth tracking are unglamorous — returning-diaspora hiring, equipment-vendor training footprints, university-to-fab placement — but they predict sustained output far better than groundbreaking ceremonies.</p>

    <h2 id="second-order-effects"><span class="h2-no">08 — Spillovers</span>Second-order effects</h2>
    <p>The most interesting consequences of an industrial cluster are rarely the ones it was built for. A semiconductor anchor reorganises the economic geography around it: it pulls in component suppliers, draws skilled labour and the services that follow them, upgrades regional power and water infrastructure, and raises land values along the corridor. These spillovers can outlast and outweigh the direct output of the lines themselves.</p>
    <p>They also redistribute. Water and power committed to a cluster are water and power not available elsewhere; corridor land that appreciates for some is priced out for others. A serious analysis of who benefits has to hold both the <em>creation</em> and the <em>reallocation</em> in view.</p>

    <h2 id="what-to-watch"><span class="h2-no">09 — Outlook</span>What to watch</h2>
    <p>The honest verdict is that India has done the legible, fundable part — committing capital and policy — and now faces the harder, slower part: localising materials, securing water and firm power, and growing process talent. Progress will not show up in node announcements. It will show up at the edges of the dependency graph.</p>
    <ul>
      <li><strong>Materials localisation</strong> — substrate, gas and chemical supply agreements are the truest tell of ecosystem depth.</li>
      <li><strong>Packaging employment</strong> — a more reliable near-term metric than wafer-fab headcount.</li>
      <li><strong>Water and power resilience</strong> — the binding physical constraints, and the clearest source of second-order conflict.</li>
      <li><strong>Talent flows</strong> — returning-diaspora and vendor-training footprints over groundbreakings.</li>
      <li><strong>Design &amp; IP capture</strong> — the decadal question of whether India climbs the value chain or services it.</li>
    </ul>
    <p>Who really benefits from India’s fab ecosystem? In the near term: the toolmakers, the builders, the utilities and the packaging workforce. In the long term, the answer depends entirely on how fast the country moves the high-value edges of the system onshore — and that is a question of water, power and people far more than of nanometres.</p>

    <div class="report-citations">
      <h2 id="references">References &amp; sources</h2>
      <ol>
        <li>India Semiconductor Mission / Ministry of Electronics &amp; IT — programme structure and fiscal support. ism.gov.in; meity.gov.in.</li>
        <li>Tata Electronics &amp; Powerchip (PSMC), Dholera fab — public project announcements (mature / specialty nodes).</li>
        <li>Back-end / OSAT projects — Micron (Sanand), Tata Electronics (Assam), CG Power, Kaynes — public company and government announcements.</li>
        <li>Design-Linked Incentive (DLI) scheme — MeitY / India Semiconductor Mission documentation.</li>
      </ol>
      <p style="font-family:var(--font-inter,sans-serif);font-size:12.5px;color:var(--text-dim);margin-top:20px;line-height:1.5;">Note: independent analysis built on publicly reported information. Figures described as “announced” reflect public statements; Figure 2 is an explicit analytical framework, not measured data. Nothing here is investment, legal or policy advice.</p>
    </div>
  `,
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('report');

  const entry = slug && REPORTS[slug];
  const html = slug && BODIES[slug];
  if (!entry || !html) return json(404, { error: 'not_found' });

  if (entry.access === 'paid') {
    const user = await getUserFromRequest(request, env);
    if (!user) return json(401, { error: 'auth_required' });
    const ok = await hasEntitlement(env, user.id, slug);
    if (!ok) return json(402, { error: 'payment_required' });
  }

  return json(200, { html });
}
