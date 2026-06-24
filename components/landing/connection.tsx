import { Section, Container } from "@/components/ui/container";
import { CONNECTION } from "@/components/landing/content";

/* Five scattered nodes — no connections. */
function ScatteredDiagram() {
  const pts = [
    [30, 36], [108, 22], [150, 78], [56, 92], [120, 116],
  ];
  return (
    <svg viewBox="0 0 180 140" className="h-auto w-full" role="img" aria-label="Scattered, unconnected tasks">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="var(--muted-foreground)" opacity={0.55} />
      ))}
    </svg>
  );
}

/* Same nodes, connected through a central hub. */
function ConnectedDiagram() {
  const pts = [
    [30, 36], [108, 22], [150, 78], [56, 92], [120, 116],
  ];
  const hub: [number, number] = [90, 70];
  return (
    <svg viewBox="0 0 180 140" className="h-auto w-full" role="img" aria-label="Tasks connected into one flow">
      <g stroke="var(--primary)" strokeWidth={1.6} strokeLinecap="round">
        {pts.map(([x, y], i) => (
          <line key={i} x1={hub[0]} y1={hub[1]} x2={x} y2={y} opacity={0.5} />
        ))}
      </g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="var(--primary)" opacity={0.85} />
      ))}
      <circle cx={hub[0]} cy={hub[1]} r={9} fill="var(--primary)" />
      <circle cx={hub[0]} cy={hub[1]} r={15} fill="none" stroke="var(--primary)" strokeWidth={1.2} opacity={0.4} />
    </svg>
  );
}

export function Connection() {
  return (
    <Section id="how" className="relative">
      <Container className="max-w-[1080px]">
        <div className="max-w-[42ch] text-scrim">
          <p className="eyebrow">{CONNECTION.eyebrow}</p>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            {CONNECTION.headline}
          </h2>
        </div>
        <p className="type-body-lg mt-5 max-w-[62ch] text-muted-foreground">
          {CONNECTION.lead}
        </p>

        {/* Today — scattered  →  With Zephlyn — connected */}
        <div className="landing-card mt-12 grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-[1fr_auto_1fr] md:gap-4 md:p-8">
          <figure className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[240px]">
              <ScatteredDiagram />
            </div>
            <figcaption className="type-caption text-muted-foreground">
              Today — scattered
            </figcaption>
          </figure>

          <div
            aria-hidden
            className="flex items-center justify-center text-muted-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-6 rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>

          <figure className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[240px]">
              <ConnectedDiagram />
            </div>
            <figcaption className="type-caption font-semibold text-purple-700 dark:text-purple-400">
              With Zephlyn — connected
            </figcaption>
          </figure>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CONNECTION.steps.map((s) => (
            <li key={s.title} className="landing-card p-7">
              <span className="type-overline text-purple-700 dark:text-purple-400">
                {s.no}
              </span>
              <h3 className="type-h4 mt-3 text-foreground">{s.title}</h3>
              <p className="type-body mt-3 text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
