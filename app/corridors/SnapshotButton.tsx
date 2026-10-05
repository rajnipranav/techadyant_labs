'use client';

import { useState } from 'react';

interface Seg { label: string; value: number; color: string }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Builds a branded 1200×630 status card as SVG and downloads it as PNG (drawn client-side; nothing leaves the browser). */
export default function SnapshotButton({ title, segments, corridors, nodes, asOf }: { title: string; segments: Seg[]; corridors: number; nodes: number; asOf: string }) {
  const [err, setErr] = useState('');
  const build = () => {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let x = 60;
    const bars = segments.filter((s) => s.value > 0).map((s) => {
      const w = Math.round((s.value / total) * 1080); const r = `<rect x="${x}" y="300" width="${w}" height="34" fill="${s.color}"/>`; x += w; return r;
    }).join('');
    const legend = segments.map((s, i) =>
      `<rect x="${60 + i * 270}" y="372" width="14" height="14" fill="${s.color}"/><text x="${82 + i * 270}" y="385" font-size="22" fill="#E8E8F0">${esc(s.label)}</text><text x="${82 + i * 270}" y="420" font-size="34" font-weight="700" fill="#F5B544">${s.value}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Inter,Arial,sans-serif">
<rect width="1200" height="630" fill="#0B0B14"/><rect x="0" y="0" width="1200" height="6" fill="#F5B544"/>
<text x="60" y="90" font-size="20" letter-spacing="4" fill="#9898A8">TECHADYANT LABS · CORRIDOR STATUS</text>
<text x="60" y="170" font-size="46" font-weight="700" fill="#E8E8F0">${esc(title)}</text>
<text x="60" y="225" font-size="26" fill="#9898A8">${corridors} national corridors · ${nodes} deep-researched nodes</text>
<text x="60" y="280" font-size="20" fill="#6F6F85">Nodes by development stage</text>
${bars}${legend}
<text x="60" y="580" font-size="20" fill="#6F6F85">Data as of ${esc(asOf)} · labs.techadyant.com/corridors</text>
<text x="1140" y="580" font-size="20" text-anchor="end" fill="#F5B544">Techadyant Labs</text></svg>`;
  };
  const download = () => {
    setErr('');
    try {
      const url = URL.createObjectURL(new Blob([build()], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
        c.getContext('2d')!.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        c.toBlob((b) => {
          if (!b) { setErr('Could not render the image.'); return; }
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'techadyant-corridor-status.png'; a.click();
        }, 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); setErr('Could not render the image.'); };
      img.src = url;
    } catch { setErr('Could not render the image.'); }
  };
  return (
    <div>
      <button type="button" className="btn-ed btn-ed-ghost" onClick={download}>Download status card (PNG) ↓</button>
      {err && <p className="viz-note" role="alert">{err}</p>}
    </div>
  );
}
