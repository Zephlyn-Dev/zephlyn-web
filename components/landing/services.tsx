import { Section, Container } from "@/components/ui/container";
import { SERVICES } from "@/components/landing/content";

function Sparkle() {
  return (
    <span
      aria-hidden
      className="mt-[3px] shrink-0 text-[0.85em] leading-none text-primary"
    >
      ✦
    </span>
  );
}

export function Services() {
  return (
    <Section id="services" className="relative">
      <Container className="max-w-[1140px]">
        <div className="max-w-[40ch] text-scrim">
          <p className="eyebrow">{SERVICES.eyebrow}</p>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            {SERVICES.headline}
          </h2>
        </div>
        <p className="type-body-lg mt-5 max-w-[62ch] text-muted-foreground">
          {SERVICES.lead}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.cards.map((c) => (
            <div
              key={c.title}
              className="landing-card landing-card-hover flex flex-col p-7"
            >
              <span className="type-code text-purple-700 dark:text-purple-400">
                {c.no}
              </span>
              <h3 className="type-h4 mt-4 text-foreground">{c.title}</h3>
              <p className="type-body mt-3 text-muted-foreground">{c.body}</p>

              <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <Sparkle />
                    <span className="type-body-sm text-foreground/90">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
