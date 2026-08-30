// ============================================================================
// Open questions — gaps in evidence
// ============================================================================

interface Props {
  data: string[];
}

export function OpenQuestionsSection({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <section
      className="ed-section ed-open-questions"
      aria-labelledby="open-q-h"
    >
      <h2 id="open-q-h" className="ed-section-h">
        Open Questions
      </h2>
      <ul className="ed-open-q-list">
        {data.map((q, i) => (
          <li key={i} className="ed-open-q-item">
            {q}
          </li>
        ))}
      </ul>
    </section>
  );
}
