'use client';

import React, { useState } from 'react';

/** Lead-capture strip — mirrors DronesTrack / AerospaceTrack pattern. */
export function SpaceTrack() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Hook to existing newsletter / engage endpoint when wiring live
    setDone(true);
  }

  return (
    <div
      style={{
        marginTop: 32,
        padding: '28px 24px',
        background: 'var(--bg-2, #1a1a1a)',
        border: '1px solid var(--border, #333)',
        borderRadius: 10,
        maxWidth: 560,
      }}
    >
      <div className="ed-kicker" style={{ marginBottom: 6 }}>
        Track this ecosystem
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>
        Get an email when the Space Atlas and our space research are updated.
      </h3>
      {done ? (
        <p style={{ margin: 0, color: 'var(--brass, #C9A84C)' }}>
          Thanks — you&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '10px 12px',
              background: 'var(--bg, #111)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              background: 'var(--brass, #C9A84C)',
              color: '#111',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Track Space
          </button>
        </form>
      )}
      <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--text-dim)' }}>
        Building launch vehicles, satellites, propulsion or ground systems in India?{' '}
        <a href="mailto:research@techadyant.com" style={{ color: 'var(--brass)' }}>
          Tell us
        </a>{' '}
        and we&apos;ll add you to the Atlas.
      </p>
    </div>
  );
}
