import type { MetadataRoute } from 'next';

// The project uses `output: 'export'` for Cloudflare Pages static deploy;
// route handlers must be marked static so they're generated at build time.
export const dynamic = 'force-static';

const SITE = 'https://labs.techadyant.com';

// Public surface every crawler may read; the JSON/transactional API is off-limits.
const DISALLOW = ['/api/'];  // only the JSON BFF; never block /_next/ assets (Google needs JS/CSS)

// AI answer-engine crawlers we explicitly welcome (GEO: we WANT to be cited in
// ChatGPT / Perplexity / Google AI Overviews / Claude answers).
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'Amazonbot',
  'Bytespider',
  'Meta-ExternalAgent',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
  'Google-CloudVertexBot',
  'Timpibot',
];

/** /robots.txt — welcome classic and AI crawlers to all public pages; block the
 *  transactional API; point at the dynamic sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
