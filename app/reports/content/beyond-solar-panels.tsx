import type { TocItem } from '../../components/ReportReader';

/**
 * Online reading version of "Beyond Solar Panels — Indian Industrial Intelligence".
 * Carries the thesis (value and vulnerability sit upstream of the panel), the
 * capability-inversion across the manufacturing stack, China's structural dominance,
 * the opportunity surfaces and the roadmap to solar-manufacturing sovereignty. The
 * full ~144-page edition (13 chapters, 53 tables, 22 figures, appendices A-G) is the
 * paid PDF; a companion data workbook is the data tier.
 *
 * Registered in app/reports/[slug]/page.tsx as { solarToc as toc, SolarContent as ReportContent }.
 */
export const toc: TocItem[] = [
  { id: 'the-thesis', label: 'The value is above the panel' },
  { id: 'the-inversion', label: 'Capability inverts up the stack' },
  { id: 'china', label: "China's structural dominance" },
  { id: 'opportunities', label: 'Where India can build' },
  { id: 'roadmap', label: 'A roadmap to sovereignty' },
  { id: 'in-the-full-report', label: 'What the full report adds' },
];

const AMBER = '#E8A33D';
const TEAL = '#2BC5B4';
const SLATE = '#8C9AAE';
const CRIMSON = '#C8443B';

/* Figure 1 - capability inverts up the manufacturing stack (India strength per layer, 0-5) */
function InversionFigure() {
  const rows = [
    { n: 'Modules / assembly', v: 4.2, c: TEAL, note: 'downstream — India strong' },
    { n: 'Cells', v: 2.4, c: AMBER },
    { n: 'Wafers / ingots', v: 1.3, c: AMBER },
    { n: 'Polysilicon', v: 1.1, c: CRIMSON },
    { n: 'Specialty materials & glass', v: 1.6, c: AMBER },
    { n: 'Manufacturing equipment', v: 0.9, c: CRIMSON, note: 'upstream — India weak' },
  ];
  const W = 360;
  return (
    <figure className="report-figure" id="fig-inversion">
      <div className="fig-frame">
        <svg viewBox="0 0 720 268" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="India manufacturing capability by layer of the solar stack, 0-5">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">Capability inverts up the stack — India strength by layer (0–5)</text>
          {rows.map((r, i) => {
            const y = 40 + i * 36;
            const w = Math.round((r.v / 5) * W);
            return (
              <g key={r.n}>
                <text x="16" y={y + 14} fill="#0B1D33" fontSize="12" fontWeight="600">{r.n}</text>
                <rect x="290" y={y} width={w} height="17" rx="3" fill={r.c} />
                <text x={290 + w + 6} y={y + 14} fill="#0B1D33" fontSize="11.5" fontWeight="700">{r.v.toFixed(1)}</text>
                {r.note && <text x="662" y={y + 14} fill={SLATE} fontSize="10.5" textAnchor="end">{r.note}</text>}
              </g>
            );
          })}
          <text x="16" y="262" fill={SLATE} fontSize="10.5">Illustrative Techadyant Labs assessment. The panel is the visible layer; value and vulnerability sit above it.</text>
        </svg>
      </div>
      <figcaption>India is strongest in module assembly and weakest in the upstream layers where value and strategic vulnerability concentrate.</figcaption>
    </figure>
  );
}

/* Figure 2 - China's share of solar supply-chain capacity (IEA 2026) */
function ChinaFigure() {
  const rows = [
    { n: 'PV wafers', v: 95 },
    { n: 'Polysilicon', v: 88 },
    { n: 'Cells', v: 85 },
    { n: 'Supply-chain (overall)', v: 85 },
  ];
  return (
    <figure className="report-figure" id="fig-china">
      <div className="fig-frame">
        <svg viewBox="0 0 720 210" width="100%" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="China share of solar supply-chain production capacity by layer, IEA 2026">
          <text x="16" y="22" fill="#0B1D33" fontSize="15" fontWeight="700">China's share of solar production capacity (IEA 2026)</text>
          {rows.map((r, i) => {
            const y = 42 + i * 38;
            const w = Math.round((r.v / 100) * 470);
            return (
              <g key={r.n}>
                <text x="16" y={y + 15} fill="#0B1D33" fontSize="12.5" fontWeight="600">{r.n}</text>
                <rect x="230" y={y} width={w} height="20" rx="3" fill={CRIMSON} opacity={0.88} />
                <text x={230 + w + 8} y={y + 15} fill="#0B1D33" fontSize="12.5" fontWeight="700">~{r.v}%</text>
              </g>
            );
          })}
          <text x="16" y="200" fill={SLATE} fontSize="10.5">Source: IEA 2026 (capacity, not output). Wafers ~95%, overall supply chain ~85%.</text>
        </svg>
      </div>
      <figcaption>China's dominance is structural and deepest in the upstream layers India most needs to build.</figcaption>
    </figure>
  );
}

export function ReportContent() {
  return (
    <>
      <h2 id="the-thesis">The value is above the panel</h2>
      <p>
        India has built one of the world&apos;s largest solar-deployment machines &mdash; 162.15 GW of installed solar
        capacity by 30 June 2026, against a national objective of 280 GW of solar within 500 GW of non-fossil capacity by
        2030. But deployment has advanced faster than manufacturing depth. The solar module is the visible, final-assembly
        layer of a much larger industrial system: beneath every module lie polysilicon production, ingot pulling, wafer
        slicing, cells, specialty chemicals, industrial gases, solar glass and the manufacturing equipment that makes all of
        it. This report reframes the question away from &ldquo;how many gigawatts of modules&rdquo; toward the industrial
        stack beneath the panel &mdash; where the value, and the vulnerability, actually sit.
      </p>

      <h2 id="the-inversion">Capability inverts up the stack</h2>
      <p>
        India&apos;s manufacturing base is strongest exactly where value is thinnest. Module-assembly capacity has scaled
        rapidly &mdash; around 172 GW of ALMM-listed capacity &mdash; but that is an approval-and-listing measure, not proof
        of equivalent operational output or domestic value addition. Move up the stack and capability falls away: cells,
        wafers, polysilicon, specialty materials and production equipment remain materially weaker. The report treats
        listed capacity, operational capacity and value addition as distinct, and shows how the arithmetic of the inversion
        is scenario-dependent &mdash; the component-share and value-leakage figures are Techadyant&apos;s illustrative 2026
        model for a specified module configuration, not universal industry constants.
      </p>
      <InversionFigure />

      <h2 id="china">China&apos;s structural dominance</h2>
      <p>
        The reason the upstream layers are hard is that they are already owned. The IEA&apos;s 2026 estimates place China at
        roughly 85% of solar supply-chain production capacity and about 95% of PV wafer capacity. That dominance is
        structural, not incidental &mdash; the product of two decades of coordinated capacity build-out, and deepest in
        precisely the polysilicon, wafer and equipment layers India most needs to localise. The report distinguishes
        capacity from output and dates every company-level figure, so the dependence is measured, not asserted.
      </p>
      <ChinaFigure />

      <h2 id="opportunities">Where India can build</h2>
      <p>
        The opportunity is not to replicate China layer-for-layer but to build defensible depth where India has cross-over
        advantages and where a supply shock would hurt most. The report ranks industrial opportunity surfaces across the
        stack &mdash; upstream materials (polysilicon, wafers, specialty chemicals, industrial gases, solar glass), cells,
        and manufacturing equipment &mdash; with localisation economics, state-level clusters and an investment-intelligence
        playbook. Each surface is assessed for strategic value, localisation potential and the policy and capital it needs,
        so a builder or investor can see which layers are open now and which require the ecosystem to mature first.
      </p>

      <h2 id="roadmap">A roadmap to sovereignty</h2>
      <p>
        Solar-manufacturing sovereignty is a sequencing problem, not a slogan. The report sets out a phased roadmap that
        pairs the demand pull (deployment targets, ALMM, the PLI tranches &mdash; Tranche I ₹4,500 crore / 8,737 MW and
        Tranche II ₹19,500 crore / 39,600 MW &mdash; and the 2025 duty structure) with the supply-side build-out of cells,
        wafers, polysilicon, materials and equipment. It closes with a boardroom playbook and strategic recommendations for
        manufacturers, investors, state governments and policymakers.
      </p>

      <h2 id="in-the-full-report">What the full report adds</h2>
      <p>
        The full ~144-page edition carries all thirteen chapters: the anatomy of the solar manufacturing stack; the hidden
        material and equipment foundations; China&apos;s solar machine; India&apos;s ecosystem; localisation economics; the
        industrial opportunity surfaces; state-level opportunity mapping; future technologies and transitions; supply-chain
        resilience and risk scenarios; the roadmap to sovereignty; and an investment-intelligence and boardroom playbook.
        Fifty-three tables, twenty-two figures and seven appendices (global polysilicon and wafer producers, the India
        manufacturing database, the equipment landscape, glass/gas/chemical ecosystems and state profiles), plus a companion
        data workbook available with the data tier.
      </p>
    </>
  );
}
