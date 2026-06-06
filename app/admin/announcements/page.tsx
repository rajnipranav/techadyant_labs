'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox, Panel, Pill } from '../ui';
import { reports } from '../../reports/data';

interface Stats { by_source: { source: string; total: number; active: number }[]; }
interface Broadcast {
  id: string; subject: string; segment: string; report_slug: string | null; status: string;
  recipients: number; sent_count: number; sent_at: string | null; created_at: string; preview?: string; body_md?: string;
}
interface Draft { id: string | null; subject: string; body: string; segment: string; report_slug: string | null; }

const EMPTY: Draft = { id: null, subject: '', body: '', segment: 'all', report_slug: null };
const SITE = 'https://labs.techadyant.com';

export default function AnnouncementsPage() {
  const [list, setList] = useState<Broadcast[] | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [d, setD] = useState<Draft>(EMPTY);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const published = reports.filter((r) => r.status === 'published');

  function load() {
    api<Broadcast[]>('/broadcasts').then(setList).catch((e) => setErr(String(e.message || e)));
    api<Stats>('/subscribers/stats').then((s) => setSources(s.by_source.map((x) => x.source))).catch(() => {});
  }
  useEffect(load, []);

  function pickReport(slug: string) {
    if (!slug) { setD((p) => ({ ...p, report_slug: null })); return; }
    const r = published.find((x) => x.slug === slug);
    if (!r) return;
    setD((p) => ({
      ...p, report_slug: slug,
      subject: p.subject || `New report — ${r.title}`,
      body: p.body || `We've just published **${r.title}**.\n\n${r.subtitle || ''}\n\n${r.summary || ''}\n\nRead it here: [${r.title}](${SITE}/reports/${r.slug}/)\n\n— Techadyant Labs`,
    }));
  }

  async function save(): Promise<string | null> {
    const res = await api<Broadcast>('/broadcasts/save', { method: 'POST', body: JSON.stringify({ id: d.id, subject: d.subject, body: d.body, segment: d.segment, report_slug: d.report_slug }) });
    setD((p) => ({ ...p, id: res.id }));
    load();
    return res.id;
  }

  async function doSave() { setBusy(true); setMsg(null); try { await save(); setMsg('Draft saved.'); } catch (e) { setErr(String((e as Error).message)); } finally { setBusy(false); } }

  async function doTest() {
    setBusy(true); setMsg(null);
    try { const id = d.id || await save(); const r = await api<{ sent_to: string }>('/broadcasts/test', { method: 'POST', body: JSON.stringify({ id }) }); setMsg(`Test sent to ${r.sent_to}.`); }
    catch (e) { setErr(String((e as Error).message)); } finally { setBusy(false); }
  }

  async function doSend() {
    if (!confirm(`Send "${d.subject}" to segment "${d.segment}"? This cannot be undone.`)) return;
    setBusy(true); setMsg(null);
    try { const id = d.id || await save(); const r = await api<{ recipients: number; sent: number }>('/broadcasts/send', { method: 'POST', body: JSON.stringify({ id }) }); setMsg(`Sent to ${r.sent}/${r.recipients} recipients.`); setD(EMPTY); load(); }
    catch (e) { setErr(String((e as Error).message)); } finally { setBusy(false); }
  }

  async function edit(b: Broadcast) {
    if (b.status === 'sent') return;
    const full = await api<Broadcast>(`/broadcast?id=${b.id}`);
    setD({ id: full.id, subject: full.subject, body: full.body_md || '', segment: full.segment, report_slug: full.report_slug });
    setMsg(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const segOptions = ['all', ...sources.map((s) => `source:${s}`)];

  return (
    <>
      <h1 className="admin-h1">Announcements</h1>
      <p className="admin-sub">Compose and send an email to subscribers. Pick a report to auto-fill, choose a segment, send a test, then send.</p>
      {err && <ErrorBox error={err} />}
      {msg && <p className="admin-sub" style={{ color: 'var(--admin-teal, #1D9E75)' }}>{msg}</p>}

      <Panel title={d.id ? 'Edit draft' : 'New announcement'} action={d.id ? <button className="admin-btn" onClick={() => setD(EMPTY)}>New</button> : undefined}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label className="admin-sub">Auto-fill from a report
            <select className="admin-input" value={d.report_slug || ''} onChange={(e) => pickReport(e.target.value)}>
              <option value="">— none —</option>
              {published.map((r) => <option key={r.slug} value={r.slug}>{r.title}</option>)}
            </select>
          </label>
          <label className="admin-sub">Subject
            <input className="admin-input" value={d.subject} onChange={(e) => setD((p) => ({ ...p, subject: e.target.value }))} placeholder="Subject line" />
          </label>
          <label className="admin-sub">Body (Markdown: **bold**, [text](url), blank line = paragraph)
            <textarea className="admin-input" rows={10} value={d.body} onChange={(e) => setD((p) => ({ ...p, body: e.target.value }))} placeholder="Write your announcement…" />
          </label>
          <label className="admin-sub">Segment
            <select className="admin-input" value={d.segment} onChange={(e) => setD((p) => ({ ...p, segment: e.target.value }))}>
              {segOptions.map((s) => <option key={s} value={s}>{s === 'all' ? 'All active subscribers' : s}</option>)}
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="admin-btn" disabled={busy || !d.subject} onClick={doSave}>Save draft</button>
            <button className="admin-btn" disabled={busy || !d.subject} onClick={doTest}>Send test to me</button>
            <button className="admin-btn" disabled={busy || !d.subject || !d.body} onClick={doSend} style={{ borderColor: 'var(--admin-teal, #1D9E75)' }}>Send to segment →</button>
          </div>
        </div>
      </Panel>

      <Panel title="History">
        {!list ? <Loading /> : list.length === 0 ? <p className="admin-sub">No announcements yet.</p> : (
          <table className="admin-table">
            <thead><tr><th>Subject</th><th>Segment</th><th>Status</th><th>Sent</th><th>When</th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} style={{ cursor: b.status === 'draft' ? 'pointer' : 'default' }} onClick={() => edit(b)}>
                  <td>{b.subject}</td><td>{b.segment}</td>
                  <td><Pill tone={b.status === 'sent' ? 'teal' : 'brass'}>{b.status}</Pill></td>
                  <td>{b.status === 'sent' ? `${b.sent_count}/${b.recipients}` : '—'}</td>
                  <td style={{ color: 'var(--admin-muted)' }}>{new Date(b.sent_at || b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  );
}
