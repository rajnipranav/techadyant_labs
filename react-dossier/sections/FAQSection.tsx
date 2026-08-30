// ============================================================================
// FAQ — question/answer list
// ============================================================================

import type { FAQEntry, Source } from "../types";

interface Props {
  data: FAQEntry[];
  sources: Source[];
}

export function FAQSection({ data, sources }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <section className="ed-section ed-faq" aria-labelledby="faq-h">
      <h2 id="faq-h" className="ed-section-h">
        FAQ
      </h2>
      <div className="ed-faq-list">
        {data.map((entry, idx) => {
          const faqSrcs = (entry.sources || [])
            .map((id) => sources.find((s) => s.id === id))
            .filter((s): s is Source => Boolean(s));
          return (
            <div key={idx} className="ed-faq-item">
              <h3 className="ed-faq-q">{entry.question}</h3>
              <p className="ed-faq-a">{entry.answer}</p>
              {faqSrcs.length > 0 ? (
                <p className="ed-cite-line">
                  Sources:{" "}
                  {faqSrcs.map((s, i) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="ed-cite"
                    >
                      [{i + 1}]
                    </a>
                  ))}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
