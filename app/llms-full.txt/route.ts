import type { MetadataRoute } from 'next';
import sitemap from '../sitemap';

// The project uses `output: 'export'` for Cloudflare Pages static deploy;
// route handlers must be marked static so they're generated at build time.
export const dynamic = 'force-static';

const SITE = 'https://labs.techadyant.com';

/** /llms-full.txt — full machine-readable URL index of the site (GEO companion to
 *  /llms.txt). Reuses the exact route list from /sitemap.xml so the two never
 *  drift. Grouped by first path segment for easy agent consumption. */
export async function GET(): Promise<Response> {
  const routes: MetadataRoute.Sitemap = await sitemap();
  const urls = routes.map((r) => r.url).sort();

  const groups = new Map<string, string[]>();
  for (const u of urls) {
    const path = u.replace(SITE, '').replace(/\/$/, '');
    const seg = path.split('/')[1] || 'top-level';
    if (!groups.has(seg)) groups.set(seg, []);
    groups.get(seg)!.push(u);
  }

  const out: string[] = [
    '# Techadyant Labs — full URL index',
    '',
    '> Every publicly indexable page on labs.techadyant.com, grouped by section.',
    '> This is the exhaustive companion to /llms.txt (curated summaries).',
    '> Content language: English (en-IN).',
    '',
    '## Citation',
    '',
    "Techadyant Labs (2026). labs.techadyant.com — strategic intelligence on India's industrial systems. https://labs.techadyant.com/llms.txt",
    '',
  ];

  for (const [seg, list] of [...groups.entries()].sort()) {
    out.push(`## ${seg}`);
    out.push('');
    for (const u of list) out.push(`- ${u}`);
    out.push('');
  }
  out.push('## Contact');
  out.push('');
  out.push('- research@techadyant.com');
  out.push('');
  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
