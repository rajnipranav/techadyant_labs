import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXEC_SUMMARIES, EXEC_SUMMARY_SLUGS } from '../../executive-summaries/registry';
import { BeyondSeaDronesSummary } from '../../executive-summaries/beyond-sea-drones';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return EXEC_SUMMARY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = EXEC_SUMMARIES[slug];
  if (!meta) return {};
  const url = `https://labs.techadyant.com/reports/${slug}/executive-summary/`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: 'article',
      siteName: 'Techadyant Labs',
      images: meta.ogImage ? [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
  };
}

export default async function ExecutiveSummaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = EXEC_SUMMARIES[slug];
  if (!meta) return notFound();

  // Only the shipped summaries render here; add a branch per report below.
  if (slug === 'beyond-sea-drones-india-autonomous-maritime-systems') {
    return (
      <main>
        <BeyondSeaDronesSummary />
      </main>
    );
  }
  return notFound();
}
