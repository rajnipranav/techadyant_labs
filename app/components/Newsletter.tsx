'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Static-first: no backend wired. Replace with provider endpoint later.
    setSent(true);
  }

  return (
    <div className="newsletter" id="subscribe">
      <div className="nl-kicker">The Dispatch</div>
      <h2>Receive strategic signals and research updates</h2>
      <p>
        New reports, signals and briefings on India’s industrial systems — delivered
        when they publish. Considered, infrequent, and free of sponsored coverage.
      </p>

      {sent ? (
        <p className="nl-fine" role="status" style={{ fontSize: '15px', color: 'var(--signal-live)' }}>
          ✓ You’re on the list. We’ll be in touch when the next edition publishes.
        </p>
      ) : (
        <form className="nl-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.org"
            aria-label="Email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      )}

      <p className="nl-fine">No spam. Unsubscribe anytime. We never share reader data.</p>
    </div>
  );
}
