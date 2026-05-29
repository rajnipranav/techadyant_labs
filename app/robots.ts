import type { MetadataRoute } from 'next';

const SITE = 'https://labs.techadyant.com';

/** /robots.txt — allow all crawlers to all public pages, explicitly disallow
 *  the JSON/transactional API surface. Point at the dynamic sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // download, subscribe, unsubscribe, checkout, etc.
          '/account',       // gated user-only routes
          '/_next/',        // build artefacts
          '/previews/',     // preview PDFs are linked from report pages; no need to index the bare file
        ],
      },
      // Aggressive crawlers — be explicit, no blanket blocks.
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
