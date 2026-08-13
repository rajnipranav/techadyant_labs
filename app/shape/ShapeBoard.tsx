'use client';

import { useRef, useState } from 'react';
import { FeedbackForm, type ShapeType } from '../components/FeedbackForm';

const PATHWAYS: { v: ShapeType; k: string; d: string }[] = [
  { v: 'research_suggestion', k: 'Suggest research', d: 'A topic you think we should investigate.' },
  { v: 'research_question', k: 'Ask a research question', d: 'The question you’re trying to answer.' },
  { v: 'feature_request', k: 'Suggest a feature', d: 'What would make Techadyant more useful.' },
  { v: 'atlas_contribution', k: 'Improve the Atlas', d: 'A company, technology, facility or dataset we’re missing.' },
  { v: 'site_gap', k: 'Report an error / give feedback', d: 'Something inaccurate, incomplete or unclear.' },
];

export default function ShapeBoard() {
  const [type, setType] = useState<ShapeType>('research_suggestion');
  const formRef = useRef<HTMLDivElement>(null);

  function pick(v: ShapeType) {
    setType(v);
    // Let the remount happen, then bring the form into view.
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 34 }}>
        {PATHWAYS.map((p) => (
          <button key={p.v} type="button" onClick={() => pick(p.v)}
            style={{
              textAlign: 'left', cursor: 'pointer',
              border: `1px solid ${type === p.v ? 'var(--accent, #C9A84C)' : 'var(--border)'}`,
              background: type === p.v ? 'var(--accent, #C9A84C)11' : 'var(--surface)',
              borderRadius: 12, padding: '16px 16px 14px', color: 'inherit', font: 'inherit',
            }}>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{p.k} <span className="arr" style={{ color: 'var(--accent, #C9A84C)' }}>→</span></div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{p.d}</div>
          </button>
        ))}
      </div>

      <div ref={formRef}>
        {/* key forces a fresh form (and default type) when a pathway is chosen. */}
        <FeedbackForm key={type} defaultType={type} source="shape" />
      </div>
    </>
  );
}
