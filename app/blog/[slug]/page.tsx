/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readFileSync } from 'fs';
import path from 'path';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { POSTS, getPost } from '../posts';
import { PainPointWidget } from '../../components/PainPointWidget';

// ── Static params for export ────────────────────────────────────────────────
export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// ── Per-page metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const mdxPath = path.join(
    process.cwd(),
    'contents',
    'blog',
    `${slug}.mdx`
  );

  let source: string;
  try {
    source = readFileSync(mdxPath, 'utf-8');
  } catch {
    notFound();
  }

  // Strip frontmatter (--- ... ---) before compiling
  const content = source!.replace(/^---[\s\S]+?---\n/, '');

  // Compile MDX with the project's own React runtime (avoids duplicate-React error)
  const { default: MDXContent } = await evaluate(content, {
    ...(runtime as any),
  });

  return (
    <>
      {/* ── Post header ── */}
      <header
        style={{
          paddingTop: '120px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)',
        }}
      >
        <div className="wrap-narrow">
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              marginBottom: '24px',
            }}
          >
            ← All posts
          </Link>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {post!.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains, monospace)',
                  letterSpacing: '0.1em',
                  color: 'var(--primary-bright)',
                  background: 'rgba(99,102,241,0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '0 0 20px',
              letterSpacing: '-0.03em',
            }}
          >
            {post!.title}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              color: 'var(--text-dim)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-jetbrains, monospace)',
            }}
          >
            <span>
              {new Date(post!.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>·</span>
            <span>{post!.readingTime}</span>
          </div>
        </div>
      </header>

      {/* ── Post body ── */}
      <article style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <div className="wrap-narrow">
          <div className="prose prose-invert">
            <MDXContent components={{ PainPointWidget }} />
          </div>
        </div>
      </article>

      {/* ── Post footer ── */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="wrap-narrow" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Want to build something with AI? Let&apos;s talk.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" data-open-modal="contact">
              Book an intake call
            </button>
            <Link href="/blog" className="btn-ghost">
              ← More posts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
