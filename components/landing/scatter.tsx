import { Section, Container } from "@/components/ui/container";
import { SCATTER } from "@/components/landing/content";

export function Scatter() {
  return (
    <Section id="problem" className="relative">
      <Container className="max-w-[1080px]">
        <div className="max-w-[40ch] text-scrim">
          <p className="eyebrow">{SCATTER.eyebrow}</p>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            {SCATTER.headline}
          </h2>
        </div>
        <p className="type-body-lg mt-5 max-w-[60ch] text-muted-foreground">
          {SCATTER.lead}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SCATTER.cards.map((c) => (
            <div key={c.title} className="landing-card landing-card-hover p-6 md:p-7">
              <h3 className="type-h4 text-foreground">{c.title}</h3>
              <p className="type-body mt-2.5 text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
