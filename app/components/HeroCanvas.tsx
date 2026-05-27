'use client';

import { useEffect, useRef } from 'react';

/**
 * SystemsField — a strategic / industrial dependency topology.
 *
 * Reinterprets the original constellation canvas as an intelligence "systems map":
 * named industrial sub-systems (fabrication, power, water, logistics, talent,
 * capital, policy …) connected by dependency edges, drifting slowly over an
 * ambient field. Calm, atmospheric, semantically aligned with the publication.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let t = 0;
    const mouse = { x: 0.5, y: 0.5, has: false };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    interface Node {
      bx: number; by: number;
      label?: string;
      r: number;
      hub?: boolean;
      color: string;
      ax: number; ay: number;
      ph: number;
    }

    const C_CORE = '#818CF8';
    const C_FAB = '#F5B544';
    const C_NODE = '#6366F1';
    const C_LIVE = '#38e1c4';

    const nodes: Node[] = [
      { bx: 0.50, by: 0.50, label: 'INDUSTRIAL CORE', r: 5.5, hub: true, color: C_CORE, ax: 0.006, ay: 0.008, ph: 0 },
      { bx: 0.34, by: 0.34, label: 'FABRICATION', r: 4.5, hub: true, color: C_FAB, ax: 0.012, ay: 0.010, ph: 1.1 },
      { bx: 0.68, by: 0.30, label: 'POWER', r: 4, hub: true, color: C_NODE, ax: 0.010, ay: 0.013, ph: 2.3 },
      { bx: 0.72, by: 0.62, label: 'LOGISTICS', r: 4, hub: true, color: C_NODE, ax: 0.011, ay: 0.009, ph: 3.4 },
      { bx: 0.30, by: 0.66, label: 'WATER', r: 4, hub: true, color: C_LIVE, ax: 0.013, ay: 0.011, ph: 4.6 },
      { bx: 0.55, by: 0.74, label: 'TALENT', r: 3.8, hub: true, color: C_NODE, ax: 0.012, ay: 0.012, ph: 5.2 },
      { bx: 0.20, by: 0.46, label: 'CAPITAL', r: 3.6, hub: true, color: C_FAB, ax: 0.010, ay: 0.012, ph: 0.7 },
      { bx: 0.82, by: 0.46, label: 'POLICY', r: 3.6, hub: true, color: C_NODE, ax: 0.011, ay: 0.010, ph: 2.9 },
      { bx: 0.43, by: 0.22, r: 2.2, color: C_NODE, ax: 0.014, ay: 0.012, ph: 1.7 },
      { bx: 0.60, by: 0.18, r: 2.0, color: C_NODE, ax: 0.013, ay: 0.014, ph: 2.5 },
      { bx: 0.16, by: 0.62, r: 2.0, color: C_NODE, ax: 0.015, ay: 0.011, ph: 3.1 },
      { bx: 0.40, by: 0.84, r: 2.2, color: C_NODE, ax: 0.012, ay: 0.013, ph: 0.4 },
      { bx: 0.70, by: 0.82, r: 2.0, color: C_NODE, ax: 0.013, ay: 0.012, ph: 4.0 },
      { bx: 0.86, by: 0.66, r: 1.9, color: C_NODE, ax: 0.014, ay: 0.012, ph: 5.5 },
      { bx: 0.88, by: 0.28, r: 1.9, color: C_NODE, ax: 0.013, ay: 0.013, ph: 1.3 },
      { bx: 0.12, by: 0.34, r: 1.9, color: C_NODE, ax: 0.014, ay: 0.011, ph: 3.8 },
    ];

    const edges: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
      [1, 8], [1, 15], [1, 6], [2, 9], [2, 14], [2, 7],
      [3, 12], [3, 13], [3, 7], [4, 10], [4, 11], [5, 11], [5, 12],
      [1, 2], [4, 5], [3, 2], [6, 4],
    ];

    interface P { x: number; y: number; r: number; o: number; s: number }
    let particles: P[] = [];
    function initParticles(w: number, h: number) {
      const count = Math.min(150, Math.floor((w * h) / 11000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2, o: Math.random() * 0.5 + 0.12,
        s: Math.random() * 0.4 + 0.1,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(canvas!.offsetWidth, canvas!.offsetHeight);
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
      mouse.has = true;
    }

    function pos(n: Node, w: number, h: number, px: number, py: number) {
      const x = (n.bx + Math.sin(t * 0.5 + n.ph) * n.ax) * w + px * (n.hub ? 14 : 8);
      const y = (n.by + Math.cos(t * 0.45 + n.ph) * n.ay) * h + py * (n.hub ? 14 : 8);
      return { x, y };
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      t += reduce ? 0 : 0.006;

      ctx!.clearRect(0, 0, w, h);

      const bg = ctx!.createRadialGradient(w * 0.62, h * 0.4, 0, w * 0.62, h * 0.4, Math.max(w, h) * 0.85);
      bg.addColorStop(0, '#13132a');
      bg.addColorStop(0.55, '#0d0d1c');
      bg.addColorStop(1, '#0a0a13');
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, w, h);

      ctx!.strokeStyle = 'rgba(129,140,248,0.04)';
      ctx!.lineWidth = 1;
      const gap = 64;
      for (let gx = (w % gap) / 2; gx < w; gx += gap) {
        ctx!.beginPath(); ctx!.moveTo(gx, 0); ctx!.lineTo(gx, h); ctx!.stroke();
      }
      for (let gy = (h % gap) / 2; gy < h; gy += gap) {
        ctx!.beginPath(); ctx!.moveTo(0, gy); ctx!.lineTo(w, gy); ctx!.stroke();
      }

      const px = (mouse.x - 0.5);
      const py = (mouse.y - 0.5);

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x + px * 10 * p.r, p.y + py * 10 * p.r, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(220,222,255,${p.o + 0.08 * Math.sin(t * p.s * 8 + p.x)})`;
        ctx!.fill();
      }

      const pts = nodes.map((n) => pos(n, w, h, px, py));

      for (const [a, b] of edges) {
        const pa = pts[a], pb = pts[b];
        const grad = ctx!.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        grad.addColorStop(0, nodes[a].color + '55');
        grad.addColorStop(1, nodes[b].color + '12');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = (nodes[a].hub && nodes[b].hub) ? 1.1 : 0.7;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();

        if (!reduce && nodes[a].hub && nodes[b].hub) {
          const prog = (Math.sin(t * 0.8 + a * 1.7 + b) + 1) / 2;
          const mx = pa.x + (pb.x - pa.x) * prog;
          const my = pa.y + (pb.y - pa.y) * prog;
          ctx!.beginPath();
          ctx!.arc(mx, my, 1.6, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(56,225,196,0.6)';
          ctx!.fill();
        }
      }

      ctx!.font = "10px ui-monospace, 'JetBrains Mono', monospace";
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const { x, y } = pts[i];

        const g = ctx!.createRadialGradient(x, y, 0, x, y, n.r * 5);
        g.addColorStop(0, n.color + (n.hub ? 'aa' : '66'));
        g.addColorStop(1, 'transparent');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, n.r * 5, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = n.color;
        ctx!.fill();

        if (n.hub) {
          ctx!.beginPath();
          ctx!.arc(x, y, n.r + 5 + Math.sin(t + n.ph) * 1.2, 0, Math.PI * 2);
          ctx!.strokeStyle = n.color + '44';
          ctx!.lineWidth = 1;
          ctx!.stroke();

          if (n.label) {
            ctx!.fillStyle = 'rgba(232,232,240,0.6)';
            ctx!.fillText(n.label, x + n.r + 9, y + 3);
          }
        }
      }

      ctx!.fillStyle = 'rgba(245,181,68,0.35)';
      ctx!.font = "10px ui-monospace, 'JetBrains Mono', monospace";
      ctx!.fillText('SYSTEMS MAP · INDIA · INDUSTRIAL LAYER', 22, h - 20);
      ctx!.fillStyle = 'rgba(129,140,248,0.32)';
      ctx!.fillText(`DEPENDENCY NODES ${nodes.length} · EDGES ${edges.length}`, 22, 30);

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouse);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="systems-canvas"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
