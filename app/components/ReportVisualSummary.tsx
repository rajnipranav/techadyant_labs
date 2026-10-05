'use client';

import { useState } from 'react';

export interface VisualStat { value: string; label: string }
export interface VisualInsight { heading: string; text: string }

interface Props {
  title: string;
  asOf: string;
  /** 3-6 headline numbers; the first 4 are drawn into the downloadable PNG. */
  stats: VisualStat[];
  /** 3-4 insight boxes; the first 3 headings are drawn into the PNG. */
  insights: VisualInsight[];
  /** Shown in the PNG footer and linked under the card. */
  sourceUrl?: string;
  /** Download filename (without extension). */
  pngName?: string;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word-wrap into <= `max`-char lines, capped at `maxLines` (last line gets an ellipsis if clipped). */
function wrap(text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
    if (lines.length === maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines) {
    const used = lines.join(' ').length;
    if (used < text.length) lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S{0,3}$/, '') + '…';
  }
  return lines;
}

/**
 * Reusable one-page visual summary for report pages: a row of headline numbers,
 * a set of insight boxes, and a branded 1200×630 PNG download. The PNG is drawn
 * entirely client-side (same approach as the corridor SnapshotButton) — nothing
 * is uploaded. Feed it numbers/insights the report already states; it invents
 * nothing.
 */
export default function ReportVisualSummary({ title, asOf, stats, insights, sourceUrl, pngName }: Props) {
  const [err, setErr] = useState('');

  const buildSvg = () => {
    const s = stats.slice(0, 4);
    const cols = s.length <= 2 ? s.length : s.length === 3 ? 3 : 2;
    const rows = Math.ceil(s.length / cols);
    const gx = 60, gy = 250, gw = 1080, cellW = Math.floor(gw / cols), cellH = 120;
    const statSvg = s.map((st, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const x = gx + c * cellW, y = gy + r * (cellH + 14);
      const labelLines = wrap(st.label, Math.floor(cellW / 9), 2);
      const lbl = labelLines
        .map((ln, k) => `<text x="${x}" y="${y + 74 + k * 24}" font-size="19" fill="#9898A8">${esc(ln)}</text>`)
        .join('');
      return `<text x="${x}" y="${y + 44}" font-size="40" font-weight="700" fill="#F5B544">${esc(st.value)}</text>${lbl}`;
    }).join('');

    const insY = gy + rows * (cellH + 14) + 24;
    const ins = insights.slice(0, 3).map((it, i) => {
      const y = insY + i * 52;
      const head = wrap(it.heading, 92, 1)[0] || '';
      return `<rect x="60" y="${y - 20}" width="10" height="34" fill="#38E1C4"/><text x="86" y="${y + 4}" font-size="24" fill="#E8E8F0">${esc(head)}</text>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Inter,Arial,sans-serif">
<rect width="1200" height="630" fill="#0B0B14"/><rect x="0" y="0" width="1200" height="6" fill="#F5B544"/>
<text x="60" y="80" font-size="20" letter-spacing="4" fill="#9898A8">TECHADYANT LABS · EXECUTIVE SUMMARY</text>
<text x="60" y="150" font-size="42" font-weight="700" fill="#E8E8F0">${esc(wrap(title, 52, 1)[0] || title)}</text>
${statSvg}${ins}
<text x="60" y="590" font-size="19" fill="#6F6F85">Data as of ${esc(asOf)}${sourceUrl ? ' · ' + esc(sourceUrl) : ''}</text>
<text x="1140" y="590" font-size="19" text-anchor="end" fill="#F5B544">Techadyant Labs</text></svg>`;
  };

  const download = () => {
    setErr('');
    try {
      const url = URL.createObjectURL(new Blob([buildSvg()], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
        c.getContext('2d')!.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        c.toBlob((b) => {
          if (!b) { setErr('Could not render the image.'); return; }
          const a = document.createElement('a');
          a.href = URL.createObjectURL(b);
          a.download = `${pngName || 'techadyant-summary'}.png`;
          a.click();
        }, 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); setErr('Could not render the image.'); };
      img.src = url;
    } catch { setErr('Could not render the image.'); }
  };

  const border = '1px solid var(--border, rgba(255,255,255,.14))';
  return (
    <div style={{ border, borderRadius: 14, padding: '22px 22px 24px', background: 'var(--surface, rgba(255,255,255,.02))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-dim, #9aa3b2)' }}>
          At a glance
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted, #6f6f85)' }}>Data as of {asOf}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 20 }}>
        {stats.map((st) => (
          <div key={st.label} style={{ borderLeft: '3px solid var(--accent, #F5B544)', paddingLeft: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text, #E8E8F0)', lineHeight: 1.15 }}>{st.value}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim, #9aa3b2)', marginTop: 4, lineHeight: 1.45 }}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 18 }}>
        {insights.slice(0, 4).map((it) => (
          <div key={it.heading} style={{ border, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text, #E8E8F0)', marginBottom: 6 }}>{it.heading}</div>
            <p style={{ fontSize: 13, color: 'var(--text-dim, #9aa3b2)', margin: 0, lineHeight: 1.5 }}>{it.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn-ed btn-ed-ghost" onClick={download}>Download summary card (PNG) ↓</button>
        {err && <span className="viz-note" role="alert" style={{ color: 'var(--accent, #F5B544)', fontSize: 13 }}>{err}</span>}
      </div>
    </div>
  );
}
