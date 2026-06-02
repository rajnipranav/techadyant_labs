'use client';

import { useEffect, useState } from 'react';
import { StatCard, Panel, Pill, Loading, ErrorBox } from '../ui';
import { api } from '../api';

/* ──────────────────────────────────────────────────────────────────────────
   Promotion tracker — LIVE from the SID (sid.report_promotions via
   /api/admin/promotion → public.sid_promotion()). Per report, each channel's
   status + UTM-attributed clicks / downloads / sign-ups / inquiries, editable
   inline (POST /api/admin/promotion/update → public.sid_promotion_update()).
   Seed planned rows per report with the campaign-kit generator.
   See: labs_techadyant/Promotion-Platform-Playbook.md
   ────────────────────────────────────────────────────────────────────────── */

type Status = 'planned' | 'active' | 'done' | 'skipped';
interface Ch { channel: string; status: Status; clicks: number; downloads: number; signups: number; inquiries: number; utm_url: string; note: string }
interface Rep { slug: string; title: string; access: string; channels: Ch[]; clicks: number; downloads: number; signups: number; inquiries: number; posted: number; total: number; launched_on: string | null }
interface ChanTotal { channel: string; reports_count: number; posted: number; clicks: number; downloads: number; signups: number; inquiries: number }
interface Board { reports: Rep[]; channels: ChanTotal[]; kpis: { reports_promoted: number; total_clicks: number; total_downloads: number; total_signups: number; total_inquiries: number; best_channel: string } }

const CH_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn', x: 'X / Twitter', newsletter: 'Newsletter', whatsapp: 'WhatsApp',
  telegram: 'Telegram', substack: 'Substack / Medium', outreach: 'Outreach',
};
const chLabel = (c: string) => CH_LABEL[c] || c;
const STATUSES: Status[] = ['planned', 'active', 'done', 'skipped'];
const STATUS_TONE: Record<Status, 'neutral' | 'teal' | 'brass' | 'crimson'> = { planned: 'neutral', active: 'teal', done: 'brass', skipped: 'crimson' };

const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

export default function AdminPromotion() {
  const [board, setBoard] = useState<Board | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState('');
  const [savedAt, setSavedAt] = useState('');

  const load = () => api<Board>('/promotion').then(setBoard).catch((e) => setErr(String(e.message || e)));
  useEffect(() => { load(); }, []);

  function edit(slug: string, channel: string, patch: Partial<Ch>) {
    setBoard((b) => {
      if (!b) return b;
      return {
        ...b,
        reports: b.reports.map((r) => r.slug !== slug ? r : {
          ...r, channels: r.channels.map((c) => c.channel !== channel ? c : { ...c, ...patch }),
        }),
      };
    });
  }

  async function save(slug: string, c: Ch) {
    const key = slug + '|' + c.channel;
    setSaving(key);
    try {
      await api('/promotion/update', { method: 'POST', body: JSON.stringify({
        slug, channel: c.channel, status: c.status, clicks: c.clicks, downloads: c.downloads, signups: c.signups, inquiries: c.inquiries,
      }) });
      await load();
      setSavedAt(key);
      setTimeout(() => setSavedAt(''), 1800);
    } catch (e) { setErr(String((e as Error).message || e)); }
    setSaving('');
  }

  if (err) return (<><h1 className="admin-h1">Promotion tracker</h1><ErrorBox error={err} /></>);
  if (!board) return (<><h1 className="admin-h1">Promotion tracker</h1><Loading label="Loading promotion board…" /></>);

  const k = board.kpis;
  const numStyle: React.CSSProperties = { width: 58, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 6, color: 'inherit', padding: '3px 6px', fontFamily: 'var(--admin-mono)', fontSize: 12.5 };

  return (
    <>
      <h1 className="admin-h1">Promotion tracker</h1>
      <p className="admin-sub">
        Per-report, per-channel reach &amp; conversion · UTM-attributed · <Pill tone="teal">live from SID</Pill>
        {' '}· seed channels with the campaign-kit generator
      </p>

      <div className="admin-grid-kpi">
        <StatCard label="Reports promoted" value={k.reports_promoted} />
        <StatCard label="Total sign-ups" value={k.total_signups} />
        <StatCard label="Total downloads" value={k.total_downloads} />
        <StatCard label="Inquiries" value={k.total_inquiries} />
        <StatCard label="Best channel (by sign-ups)" value={chLabel(k.best_channel)} />
      </div>

      <Panel title="Channel performance — which channel actually works">
        <table className="admin-table" style={{ width: '100%' }}>
          <thead><tr><th>Channel</th><th>Reports</th><th>Posted</th><th>Clicks</th><th>Downloads</th><th>Sign-ups</th><th>Inquiries</th></tr></thead>
          <tbody>
            {board.channels.map((c) => (
              <tr key={c.channel}>
                <td style={{ fontWeight: 600 }}>{chLabel(c.channel)}</td>
                <td>{c.reports_count}</td>
                <td>{c.posted}</td>
                <td style={{ fontFamily: 'var(--admin-mono)' }}>{c.clicks}</td>
                <td style={{ fontFamily: 'var(--admin-mono)' }}>{c.downloads}</td>
                <td style={{ fontFamily: 'var(--admin-mono)', color: 'var(--admin-brassb)' }}>{c.signups}</td>
                <td style={{ fontFamily: 'var(--admin-mono)' }}>{c.inquiries}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--admin-muted)', margin: '10px 0 0' }}>
          Review weekly. Kill channels that don&apos;t move sign-ups; double down on those that do.
        </p>
      </Panel>

      {board.reports.map((r) => (
        <Panel key={r.slug} title={`${r.title} · ${r.access === 'free' ? 'Risk · free' : 'Opportunity · paid'}${r.launched_on ? ' · launched ' + r.launched_on : ''}`}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead><tr>
              <th style={{ width: '17%' }}>Channel</th><th>Status</th><th>Clicks</th><th>Downloads</th><th>Sign-ups</th><th>Inquiries</th><th>UTM link</th><th></th>
            </tr></thead>
            <tbody>
              {r.channels.map((c) => {
                const key = r.slug + '|' + c.channel;
                return (
                  <tr key={c.channel}>
                    <td style={{ fontWeight: 600 }} title={c.note}>{chLabel(c.channel)}</td>
                    <td>
                      <select value={c.status} onChange={(e) => edit(r.slug, c.channel, { status: e.target.value as Status })}
                        style={{ background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 6, color: 'inherit', padding: '3px 6px', fontSize: 12.5 }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><input style={numStyle} type="number" min={0} value={c.clicks} onChange={(e) => edit(r.slug, c.channel, { clicks: num(e.target.value) })} /></td>
                    <td><input style={numStyle} type="number" min={0} value={c.downloads} onChange={(e) => edit(r.slug, c.channel, { downloads: num(e.target.value) })} /></td>
                    <td><input style={numStyle} type="number" min={0} value={c.signups} onChange={(e) => edit(r.slug, c.channel, { signups: num(e.target.value) })} /></td>
                    <td><input style={numStyle} type="number" min={0} value={c.inquiries} onChange={(e) => edit(r.slug, c.channel, { inquiries: num(e.target.value) })} /></td>
                    <td>
                      {c.utm_url
                        ? <button onClick={() => navigator.clipboard?.writeText(c.utm_url)} title={c.utm_url}
                            style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: 6, color: 'var(--admin-muted)', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}>copy</button>
                        : <span style={{ color: 'var(--admin-muted)', fontSize: 11 }}>—</span>}
                    </td>
                    <td>
                      <button onClick={() => save(r.slug, c)} disabled={saving === key}
                        style={{ background: savedAt === key ? 'rgba(56,225,196,0.18)' : 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 6, color: 'inherit', fontSize: 12, padding: '3px 12px', cursor: 'pointer' }}>
                        {saving === key ? '…' : savedAt === key ? 'Saved' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, color: 'var(--admin-muted)' }}>
            <span>Posted {r.posted}/{r.total}</span>
            <span>·</span><span>{r.downloads} downloads</span>
            <span>·</span><span style={{ color: 'var(--admin-brassb)' }}>{r.signups} sign-ups</span>
            <span>·</span><span>{r.inquiries} inquiries</span>
            {r.channels.map((c) => (
              <Pill key={c.channel} tone={STATUS_TONE[c.status]}>{chLabel(c.channel)}</Pill>
            ))}
          </div>
        </Panel>
      ))}

      {board.reports.length === 0 && (
        <Panel title="No campaigns yet">
          <p style={{ fontSize: 13, color: 'var(--admin-muted)', margin: 0 }}>
            Run the campaign-kit generator for a report to seed its channels here, then track status and attribution as you post.
          </p>
        </Panel>
      )}
    </>
  );
}
