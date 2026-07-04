'use client';

import { useEffect, useRef } from 'react';

/**
 * Free, ad-free comments via giscus (backed by your GitHub repo's Discussions).
 *
 * SETUP (one-time, all free):
 *   1. Make the GitHub repo hosting this site PUBLIC and enable the
 *      "Discussions" feature (repo Settings → General → Features).
 *   2. Install the giscus app on the repo: https://github.com/apps/giscus
 *   3. Go to https://giscus.app, enter the repo, pick a Discussion category
 *      (e.g. "General" or a new "Comments" category), and it will show you the
 *      four values below. Paste them in and redeploy.
 *
 * Until all four are filled in, this component renders nothing — so it is safe
 * to ship before configuring.
 */
const GISCUS = {
  repo: 'YOUR_GITHUB_USER/YOUR_REPO', // e.g. 'techadyant/labs'
  repoId: 'YOUR_REPO_ID',
  category: 'Comments',
  categoryId: 'YOUR_CATEGORY_ID',
};

const configured =
  !GISCUS.repo.includes('YOUR_') &&
  !GISCUS.repoId.includes('YOUR_') &&
  !GISCUS.categoryId.includes('YOUR_');

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!configured || !host || host.childElementCount > 0) return;

    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-repo', GISCUS.repo);
    s.setAttribute('data-repo-id', GISCUS.repoId);
    s.setAttribute('data-category', GISCUS.category);
    s.setAttribute('data-category-id', GISCUS.categoryId);
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-strict', '1');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', 'dark');
    s.setAttribute('data-lang', 'en');
    s.setAttribute('loading', 'lazy');
    host.appendChild(s);
  }, []);

  if (!configured) return null;

  return (
    <section className="wrap-narrow" style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="section-head-ed">
        <div>
          <div className="ed-kicker">Discussion</div>
          <h2>Join the conversation</h2>
        </div>
      </div>
      <div ref={ref} className="giscus" />
    </section>
  );
}
