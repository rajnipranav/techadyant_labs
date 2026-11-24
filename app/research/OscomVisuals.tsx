import { INDIA_OUTLINE } from '../corridors/data';

// ── OSCOM feature visuals ────────────────────────────────────────────────────
// Two self-contained SVG figures used on the IREL OSCOM player page and the
// OSCOM explainer. No client hooks (safe in server components). Colours use the
// site's CSS custom properties so both figures adapt to light/dark; accents are
// the Critical Minerals corridor copper (#C77D4A) plus the brand teal/crimson.
// Nothing here asserts an unverified number — the "magnet gap" is framed as the
// downstream step India is building out, consistent with the site's own
// "Closing the Magnet Gap" report and IREL's published product scope.

const COPPER = '#C77D4A';
const TEAL = '#2BC5B4';
const CRIMSON = '#C8443B';

const TEXT = 'var(--text, #E8E8F0)';
const MUTED = 'var(--text-muted, #9898A8)';
const DIM = 'var(--text-dim, #6F6F85)';
const SURFACE = 'var(--surface, #161629)';
const SURFACE2 = 'var(--surface-2, #1C1C34)';
const BORDER = 'var(--border, rgba(255,255,255,0.08))';

const FONT = "var(--font-inter, 'Inter'), system-ui, Arial, sans-serif";
const MONO = "var(--font-jetbrains, 'JetBrains Mono'), ui-monospace, monospace";

/** India locator: the canonical outline with a single glowing marker at OSCOM. */
export function OscomLocatorMap({ className }: { className?: string }) {
  // OSCOM sits on the Odisha coast near Gopalpur/Chhatrapur; [284,345] in the
  // canonical 0 0 550 563.58 outline space (cross-checked against Visakhapatnam
  // at [258,374] on the same corridor dataset).
  const ox = 284;
  const oy = 345;
  return (
    <figure
      className={className}
      style={{
        margin: 0,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        background: SURFACE,
        padding: 16,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="34 6 448 548"
        role="img"
        aria-label="Map of India showing OSCOM on the Odisha coast"
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 460 }}
      >
        <path d={INDIA_OUTLINE} fill="rgba(99,102,241,0.06)" stroke="#6366F1" strokeWidth={1.4} strokeOpacity={0.4} strokeLinejoin="round" />
        <path d={INDIA_OUTLINE} fill="none" stroke="#818CF8" strokeWidth={0.6} strokeOpacity={0.85} strokeLinejoin="round" />

        {/* Bay of Bengal */}
        <text x={372} y={432} textAnchor="middle" fontFamily={FONT} fontStyle="italic" fontSize={12} letterSpacing={1} fill={DIM}>Bay of Bengal</text>

        {/* Bhubaneswar reference */}
        <circle cx={298} cy={327} r={2} fill={MUTED} />
        <text x={303} y={324} fontFamily={MONO} fontSize={9} fill={DIM}>Bhubaneswar</text>

        {/* OSCOM marker */}
        <circle cx={ox} cy={oy} r={15} fill={COPPER} opacity={0.12} />
        <circle cx={ox} cy={oy} r={11} fill="none" stroke={COPPER} strokeWidth={1} strokeOpacity={0.5} />
        <circle cx={ox} cy={oy} r={6} fill="none" stroke={COPPER} strokeWidth={1.4} />
        <circle cx={ox} cy={oy} r={3.4} fill={COPPER} />
        <line x1={293} y1={oy} x2={332} y2={oy} stroke={COPPER} strokeWidth={0.8} strokeOpacity={0.8} />
        <text x={336} y={343} fontFamily={FONT} fontWeight={700} fontSize={15} fill={TEXT}>OSCOM</text>
        <text x={336} y={359} fontFamily={MONO} fontSize={10.5} fill={MUTED}>Chhatrapur · Odisha coast</text>
      </svg>
      <figcaption style={{ marginTop: 10, fontFamily: FONT, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
        OSCOM lies on the Bay of Bengal coast at Chhatrapur, Ganjam district, Odisha — about 150&nbsp;km south of Bhubaneswar.
      </figcaption>
    </figure>
  );
}

type NodeSpec = { x: number; l1: string; l2?: string; sub?: string; accent: 'neutral' | 'copper' | 'teal' };

const NODES: NodeSpec[] = [
  { x: 32, l1: 'Beach heavy-', l2: 'mineral sand', accent: 'neutral' },
  { x: 238, l1: 'Mineral', l2: 'separation', accent: 'neutral' },
  { x: 444, l1: 'Monazite', sub: 'LRE + thorium', accent: 'copper' },
  { x: 650, l1: 'Rare Earth', l2: 'Extraction Plant', sub: 'OSCOM · REEP', accent: 'copper' },
  { x: 856, l1: 'Mixed rare-', l2: 'earth chloride', sub: 'intermediate', accent: 'teal' },
];

const CHIPS: { x: number; w: number; label: string; hot?: boolean }[] = [
  { x: 32, w: 72, label: 'Ilmenite' },
  { x: 114, w: 60, label: 'Rutile' },
  { x: 184, w: 62, label: 'Zircon' },
  { x: 256, w: 86, label: 'Sillimanite' },
  { x: 352, w: 62, label: 'Garnet' },
  { x: 424, w: 104, label: 'Monazite →', hot: true },
];

/** Value-chain figure: where OSCOM sits, and the downstream magnet gap. */
export function OscomValueChain({ className }: { className?: string }) {
  const accentStroke = (a: NodeSpec['accent']) => (a === 'copper' ? COPPER : a === 'teal' ? TEAL : BORDER);
  const accentFill = (a: NodeSpec['accent']) =>
    a === 'copper' ? 'rgba(199,125,74,0.12)' : a === 'teal' ? 'rgba(43,197,180,0.10)' : SURFACE2;
  const subColour = (a: NodeSpec['accent']) => (a === 'copper' ? COPPER : a === 'teal' ? TEAL : MUTED);

  return (
    <figure
      className={className}
      style={{
        margin: 0,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        background: SURFACE,
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 1040 560"
        role="img"
        aria-label="India's rare-earth value chain and where OSCOM sits within it"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <defs>
          <marker id="oscom-ar" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COPPER} />
          </marker>
          <marker id="oscom-arC" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={CRIMSON} />
          </marker>
        </defs>

        {/* Title */}
        <text x={32} y={40} fontFamily={MONO} fontSize={11} letterSpacing={2} fill={COPPER}>INDIA&#39;S RARE-EARTH CHAIN</text>
        <text x={32} y={70} fontFamily={FONT} fontWeight={700} fontSize={22} fill={TEXT}>Where OSCOM sits in India&#39;s rare-earth chain</text>
        <text x={32} y={94} fontFamily={FONT} fontSize={13} fill={MUTED}>Beach sand to mixed chloride is domestic; the magnet end is the step India is still building.</text>

        {/* Pipeline arrows */}
        {[[182, 232], [388, 438], [594, 644], [800, 850]].map(([x1, x2], i) => (
          <line key={i} x1={x1} y1={158} x2={x2} y2={158} stroke={COPPER} strokeWidth={2} markerEnd="url(#oscom-ar)" />
        ))}

        {/* Pipeline nodes */}
        {NODES.map((n, i) => {
          const cx = n.x + 75;
          return (
            <g key={i}>
              <rect x={n.x} y={120} width={150} height={76} rx={12} fill={accentFill(n.accent)} stroke={accentStroke(n.accent)} strokeWidth={1.4} />
              {n.l2 ? (
                <>
                  <text x={cx} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill={TEXT}>{n.l1}</text>
                  <text x={cx} y={168} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill={TEXT}>{n.l2}</text>
                </>
              ) : (
                <text x={cx} y={156} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={15} fill={TEXT}>{n.l1}</text>
              )}
              {n.sub && (
                <text x={cx} y={n.l2 ? 185 : 176} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={subColour(n.accent)}>{n.sub}</text>
              )}
            </g>
          );
        })}

        {/* Separation → marketable minerals */}
        <line x1={313} y1={196} x2={313} y2={240} stroke={MUTED} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 3" />
        <text x={32} y={232} fontFamily={MONO} fontSize={11} letterSpacing={0.5} fill={MUTED}>SEPARATION YIELDS SIX MARKETABLE HEAVY MINERALS</text>
        {CHIPS.map((c, i) => {
          const cx = c.x + c.w / 2;
          return (
            <g key={i}>
              <rect x={c.x} y={244} width={c.w} height={26} rx={13} fill={c.hot ? 'rgba(199,125,74,0.14)' : SURFACE2} stroke={c.hot ? COPPER : BORDER} strokeWidth={1} />
              <text x={cx} y={261} textAnchor="middle" fontFamily={FONT} fontSize={12} fontWeight={c.hot ? 600 : 400} fill={c.hot ? COPPER : MUTED}>{c.label}</text>
            </g>
          );
        })}
        {/* monazite chip feeds the strategic node */}
        <line x1={476} y1={244} x2={519} y2={196} stroke={COPPER} strokeWidth={1} strokeOpacity={0.7} strokeDasharray="3 3" />

        {/* The magnet gap */}
        <line x1={931} y1={196} x2={852} y2={298} stroke={CRIMSON} strokeWidth={1.6} strokeDasharray="6 4" markerEnd="url(#oscom-arC)" />
        <rect x={606} y={300} width={402} height={176} rx={12} fill="rgba(200,68,59,0.08)" stroke={CRIMSON} strokeWidth={1.4} strokeDasharray="6 4" />
        <text x={626} y={332} fontFamily={MONO} fontSize={11} letterSpacing={1.5} fill={CRIMSON}>THE MAGNET GAP</text>
        <text x={626} y={358} fontFamily={FONT} fontSize={13} fill={TEXT}>Separate mixed chloride into individual oxides,</text>
        <text x={626} y={378} fontFamily={FONT} fontSize={13} fill={TEXT}>reduce to NdPr metal, sinter into NdFeB magnets —</text>
        <text x={626} y={398} fontFamily={FONT} fontSize={13} fill={TEXT}>the high-value steps beyond OSCOM&#39;s output.</text>
        <text x={626} y={430} fontFamily={FONT} fontStyle="italic" fontSize={12} fill={MUTED}>India is building this under its 2025–26 magnet</text>
        <text x={626} y={448} fontFamily={FONT} fontStyle="italic" fontSize={12} fill={MUTED}>programme; today these steps are largely imported.</text>

        {/* Legend */}
        <circle cx={40} cy={500} r={6} fill={COPPER} />
        <text x={54} y={504} fontFamily={FONT} fontSize={12} fill={MUTED}>Within OSCOM / domestic</text>
        <circle cx={40} cy={522} r={6} fill={TEAL} />
        <text x={54} y={526} fontFamily={FONT} fontSize={12} fill={MUTED}>Intermediate output (mixed chloride)</text>
        <line x1={32} y1={544} x2={48} y2={544} stroke={CRIMSON} strokeWidth={2} strokeDasharray="4 3" />
        <text x={54} y={548} fontFamily={FONT} fontSize={12} fill={MUTED}>Building in India / today imported</text>

        {/* Source */}
        <text x={606} y={506} fontFamily={FONT} fontSize={10.5} fill={DIM}>Source: IREL; Techadyant Labs — &#39;Closing the Magnet Gap, 2026–2035&#39;.</text>
        <text x={606} y={522} fontFamily={FONT} fontSize={10.5} fill={DIM}>Techadyant Labs analysis.</text>
      </svg>
    </figure>
  );
}
