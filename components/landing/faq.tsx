import { Section, Container } from "@/components/ui/container";
import { FAQ } from "@/components/landing/content";

export function Faq() {
  return (
    <Section id="faq" className="relative">
      <Container className="max-w-[760px]">
        <div className="text-scrim text-center">
          <p className="eyebrow">{FAQ.eyebrow}</p>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            {FAQ.headline}
          </h2>
        </div>

        {/* Wrapped in a glass surface so the constellation never shows through
            the open/closed rows and reduces legibility. */}
        <div className="landing-card mt-10 px-6 py-2 md:px-8">
          {FAQ.items.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
