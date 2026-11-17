// Shared helpers for search-snippet text.

/**
 * Trim a meta description to what Google actually displays (~155–160 chars),
 * cutting at a word boundary and closing with an ellipsis instead of stopping
 * mid-word. Over-long descriptions are not penalised, but the cut-off point is
 * then chosen by Google and usually lands mid-sentence.
 */
export function clampMeta(text: string, max = 158): string {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:—–-]+$/, '') + '…';
}
