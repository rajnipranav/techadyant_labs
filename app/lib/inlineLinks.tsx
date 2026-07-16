import React from 'react';

/**
 * Renders inline markdown-style links [label](href) inside plain body text as
 * anchor elements. Used by the signal and briefing body renderers so CMS body
 * blocks can carry clickable cross-links (e.g. to a report) without HTML.
 * Internal links (href starting with "/") open in the same tab; external links
 * open in a new tab. All other text is returned unchanged.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function inlineLinks(text?: string): React.ReactNode {
  if (!text || text.indexOf('[') === -1) return text ?? null;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const label = m[1];
    const href = m[2];
    const internal = href.startsWith('/');
    nodes.push(
      <a
        key={nodes.length}
        href={href}
        {...(internal ? {} : { target: '_blank', rel: 'noreferrer' })}
        style={{ color: 'var(--accent, #C9A84C)', textDecoration: 'underline' }}
      >
        {label}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
