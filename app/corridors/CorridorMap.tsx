'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { corridors, INDIA_OUTLINE, CLASS_COLOR, type Corridor } from './data';

function ribbon(p: [number, number][], w: number) {
  const L: [number, number][] = [], R: [number, number][] = [];
  for (let i = 0; i < p.length; i++) {
    let dx, dy;
    if (i === 0) { dx = p[1][0] - p[0][0]; dy = p[1][1] - p[0][1]; }
    else if (i === p.length - 1) { dx = p[i][0] - p[i - 1][0]; dy = p[i][1] - p[i - 1][1]; }
    else { dx = p[i + 1][0] - p[i - 1][0]; dy = p[i + 1][1] - p[i - 1][1]; }
    const n = Math.hypot(dx, dy) || 1, nx = (-dy / n) * w, ny = (dx / n) * w;
    L.push([p[i][0] + nx, p[i][1] + ny]); R.push([p[i][0] - nx, p[i][1] - ny]);
  }
  const f = (a: [number, number][]) => a.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L ');
  return `M ${f(L)} L ${f([...R].reverse())} Z`;
}
const line = (p: [number, number][]) => 'M ' + p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L ');

export function CorridorMap({ focus, navigate = true, field = true }: { focus?: string; navigate?: boolean; field?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; c: Corridor } | null>(null);
  const router = useRouter();
  const active = focus ?? hover;

  useEffect(() => {
    if (!field) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf = 0, t = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CORE = '#818CF8', FAB = '#F5B544', NODE = '#6366F1', LIVE = '#38e1c4';
    const nodes = [
      { bx: .50, by: .50, r: 5.5, hub: 1, label: 'INDUSTRIAL CORE', color: CORE, ax: .006, ay: .008, ph: 0 },
      { bx: .34, by: .34, r: 4.5, hub: 1, label: 'FABRICATION', color: FAB, ax: .012, ay: .010, ph: 1.1 },
      { bx: .68, by: .30, r: 4, hub: 1, label: 'POWER', color: NODE, ax: .010, ay: .013, ph: 2.3 },
      { bx: .72, by: .62, r: 4, hub: 1, label: 'LOGISTICS', color: NODE, ax: .011, ay: .009, ph: 3.4 },
      { bx: .30, by: .66, r: 4, hub: 1, label: 'WATER', color: LIVE, ax: .013, ay: .011, ph: 4.6 },
      { bx: .55, by: .74, r: 3.8, hub: 1, label: 'TALENT', color: NODE, ax: .012, ay: .012, ph: 5.2 },
      { bx: .20, by: .46, r: 3.6, hub: 1, label: 'CAPITAL', color: FAB, ax: .010, ay: .012, ph: .7 },
      { bx: .82, by: .46, r: 3.6, hub: 1, label: 'POLICY', color: NODE, ax: .011, ay: .010, ph: 2.9 },
      { bx: .43, by: .22, r: 2.2, hub: 0, label: '', color: NODE, ax: .014, ay: .012, ph: 1.7 },
      { bx: .60, by: .18, r: 2.0, hub: 0, label: '', color: NODE, ax: .013, ay: .014, ph: 2.5 },
      { bx: .16, by: .62, r: 2.0, hub: 0, label: '', color: NODE, ax: .015, ay: .011, ph: 3.1 },
      { bx: .40, by: .84, r: 2.2, hub: 0, label: '', color: NODE, ax: .012, ay: .013, ph: .4 },
      { bx: .70, by: .82, r: 2.0, hub: 0, label: '', color: NODE, ax: .013, ay: .012, ph: 4.0 },
      { bx: .86, by: .66, r: 1.9, hub: 0, label: '', color: NODE, ax: .014, ay: .012, ph: 5.5 },
      { bx: .88, by: .28, r: 1.9, hub: 0, label: '', color: NODE, ax: .013, ay: .013, ph: 1.3 },
      { bx: .12, by: .34, r: 1.9, hub: 0, label: '', color: NODE, ax: .014, ay: .011, ph: 3.8 },
    ];
    const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 8], [1, 15], [1, 6], [2, 9], [2, 14], [2, 7], [3, 12], [3, 13], [3, 7], [4, 10], [4, 11], [5, 11], [5, 12], [1, 2], [4, 5], [3, 2], [6, 4]];
    let particles: { x: number; y: number; r: number; o: number; s: number }[] = [];
    function initP(w: number, h: number) {
      const n = Math.min(150, Math.floor((w * h) / 11000));
      particles = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + .2, o: Math.random() * .5 + .12, s: Math.random() * .4 + .1 }));
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = canvas!.offsetWidth * dpr; canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); initP(canvas!.offsetWidth, canvas!.offsetHeight);
    }
    const onMove = (e: MouseEvent) => { const r = canvas!.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width; mouse.y = (e.clientY - r.top) / r.height; };
    const pos = (n: typeof nodes[0], w: number, h: number, px: number, py: number) => ({ x: (n.bx + Math.sin(t * .5 + n.ph) * n.ax) * w + px * (n.hub ? 14 : 8), y: (n.by + Math.cos(t * .45 + n.ph) * n.ay) * h + py * (n.hub ? 14 : 8) });
    function draw() {
      const w = canvas!.offsetWidth, h = canvas!.offsetHeight; t += reduce ? 0 : .006;
      ctx!.clearRect(0, 0, w, h);
      const bg = ctx!.createRadialGradient(w * .55, h * .4, 0, w * .55, h * .4, Math.max(w, h) * .85);
      bg.addColorStop(0, '#13132a'); bg.addColorStop(.55, '#0d0d1c'); bg.addColorStop(1, '#0a0a13');
      ctx!.fillStyle = bg; ctx!.fillRect(0, 0, w, h);
      ctx!.strokeStyle = 'rgba(129,140,248,0.04)'; ctx!.lineWidth = 1; const gap = 64;
      for (let gx = (w % gap) / 2; gx < w; gx += gap) { ctx!.beginPath(); ctx!.moveTo(gx, 0); ctx!.lineTo(gx, h); ctx!.stroke(); }
      for (let gy = (h % gap) / 2; gy < h; gy += gap) { ctx!.beginPath(); ctx!.moveTo(0, gy); ctx!.lineTo(w, gy); ctx!.stroke(); }
      const px = mouse.x - .5, py = mouse.y - .5;
      for (const p of particles) { ctx!.beginPath(); ctx!.arc(p.x + px * 10 * p.r, p.y + py * 10 * p.r, p.r, 0, 6.283); ctx!.fillStyle = `rgba(220,222,255,${p.o + .08 * Math.sin(t * p.s * 8 + p.x)})`; ctx!.fill(); }
      const pts = nodes.map((n) => pos(n, w, h, px, py));
      for (const [a, b] of edges) {
        const pa = pts[a], pb = pts[b];
        const gr = ctx!.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        gr.addColorStop(0, nodes[a].color + '55'); gr.addColorStop(1, nodes[b].color + '12');
        ctx!.strokeStyle = gr; ctx!.lineWidth = (nodes[a].hub && nodes[b].hub) ? 1.1 : .7;
        ctx!.beginPath(); ctx!.moveTo(pa.x, pa.y); ctx!.lineTo(pb.x, pb.y); ctx!.stroke();
        if (!reduce && nodes[a].hub && nodes[b].hub) {
          const pr = (Math.sin(t * .8 + a * 1.7 + b) + 1) / 2, mx = pa.x + (pb.x - pa.x) * pr, my = pa.y + (pb.y - pa.y) * pr;
          ctx!.beginPath(); ctx!.arc(mx, my, 1.6, 0, 6.283); ctx!.fillStyle = 'rgba(56,225,196,0.6)'; ctx!.fill();
        }
      }
      ctx!.font = "10px ui-monospace, 'JetBrains Mono', monospace";
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i], { x, y } = pts[i];
        const g = ctx!.createRadialGradient(x, y, 0, x, y, n.r * 5);
        g.addColorStop(0, n.color + (n.hub ? 'aa' : '66')); g.addColorStop(1, 'transparent');
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(x, y, n.r * 5, 0, 6.283); ctx!.fill();
        ctx!.beginPath(); ctx!.arc(x, y, n.r, 0, 6.283); ctx!.fillStyle = n.color; ctx!.fill();
        if (n.hub) {
          ctx!.beginPath(); ctx!.arc(x, y, n.r + 5 + Math.sin(t + n.ph) * 1.2, 0, 6.283); ctx!.strokeStyle = n.color + '44'; ctx!.lineWidth = 1; ctx!.stroke();
          if (n.label) { ctx!.fillStyle = 'rgba(232,232,240,0.6)'; ctx!.fillText(n.label, x + n.r + 9, y + 3); }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); window.addEventListener('resize', resize); canvas.addEventListener('mousemove', onMove); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', onMove); };
  }, [field]);

  function moveTip(e: React.MouseEvent, c: Corridor) {
    const w = wrapRef.current?.getBoundingClientRect(); if (!w) return;
    setTip({ x: e.clientX - w.left, y: e.clientY - w.top, c });
  }
  const go = (slug: string) => { if (navigate) router.push(`/corridors/${slug}/`); };

  return (
    <div className="cmap-wrap" ref={wrapRef}>
      {field && <canvas ref={canvasRef} className="cmap-canvas" aria-hidden="true" />}
      <svg className="cmap-svg" viewBox="34 6 448 548" role="img" aria-label="Map of India's eleven national industrial corridors">
        <defs><filter id="cmapGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6" /></filter></defs>
        <path d={INDIA_OUTLINE} fill="none" stroke="#6366F1" strokeWidth={1.6} strokeOpacity={0.4} strokeLinejoin="round" filter="url(#cmapGlow)" />
        <path d={INDIA_OUTLINE} fill="none" stroke="#818CF8" strokeWidth={0.6} strokeOpacity={0.85} strokeLinejoin="round" />
        {corridors.map((c) => {
          const col = CLASS_COLOR[c.cls]; const dim = !!active && active !== c.slug;
          return (
            <g key={c.slug}>
              <path className={`cmap-band${dim ? ' cmap-dim' : ''}`} d={ribbon(c.pts, 7)} fill={col}
                fillOpacity={active === c.slug ? 0.45 : (c.cls === 'planned' ? 0.12 : 0.2)} stroke={col} strokeOpacity={0.5} strokeWidth={0.6}
                strokeDasharray={c.cls === 'planned' ? '4 3' : undefined} strokeLinejoin="round"
                onMouseEnter={() => setHover(c.slug)} onMouseLeave={() => { setHover(null); setTip(null); }} onMouseMove={(e) => moveTip(e, c)} onClick={() => go(c.slug)} />
              <path className="cmap-center" d={line(c.pts)} fill="none" stroke={col} strokeWidth={1.1} strokeOpacity={dim ? 0.2 : 0.92} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {corridors.map((c) => {
          const col = CLASS_COLOR[c.cls]; const dim = !!active && active !== c.slug; const [px, py] = c.pin; const d = 0.4 + c.num * 0.18;
          return (
            <g key={c.slug} className={`cmap-mk${dim ? ' cmap-dim' : ''}`} transform={`translate(${px},${py})`}
              onMouseEnter={() => setHover(c.slug)} onMouseLeave={() => { setHover(null); setTip(null); }} onMouseMove={(e) => moveTip(e, c)} onClick={() => go(c.slug)}>
              <circle className="cmap-rp" cx={0} cy={0} r={4.8} fill="none" stroke={col} strokeWidth={1} style={{ animationDelay: `${d}s` }} />
              <circle className="cmap-rp" cx={0} cy={0} r={4.8} fill="none" stroke={col} strokeWidth={1} style={{ animationDelay: `${d + 1.45}s` }} />
              <circle className="cmap-dot" cx={0} cy={0} r={5} fill="#0a0a13" stroke={col} strokeWidth={1.4} />
              <text className="cmap-num" x={0} y={0.2} fill={col}>{c.num}</text>
            </g>
          );
        })}
      </svg>
      {tip && (
        <div className="cmap-tip" style={{ left: tip.x, top: tip.y, opacity: 1 }}>
          <b>{tip.c.name}</b><span>{tip.c.status.split('·')[0].trim()}</span>
          {navigate && <em className="cmap-tip-go">Open dossier →</em>}
        </div>
      )}
    </div>
  );
}
