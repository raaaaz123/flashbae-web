/** Questions as open-and-close cards; pass the same list to `faqSchema` so the structured data matches the page. */
export default function Faq({ items, title = "Questions, answered", intro, id = "faq" }:
  { items: { q: string; a: string }[]; title?: string; intro?: React.ReactNode; id?: string }) {
  return (
    <section className="section section-faq" id={id} aria-labelledby={`${id}-title`}>
      <div className="section-head">
        <h2 id={`${id}-title`}>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      <div className="faq">
        {items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
