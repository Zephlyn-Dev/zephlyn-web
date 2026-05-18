"use client";

/**
 * Scroll-guide hairline. A thin vertical thread pinned to the left
 * edge of the viewport that draws downward as the reader moves through
 * the marketing sections. The path is mostly straight but has three
 * motifs baked in — a small right-side swirl, a gentle S-wave, and a
 * left-side swirl — so the line has visual rhythm instead of being a
 * dead ruler.
 *
 * Section behaviour: the line starts drawing at the SampleWorkflowPicker
 * (#sample-workflow) and finishes at the final CTA (#get-started). Each
 * intermediate section places a small marker on the path; markers
 * brighten once the reader scrolls past them, so the line reads as a
 * journey through the page's stops.
 *
 * A glowing purple "head" rides the leading edge of the drawn portion.
 *
 * Hidden under lg, hidden during the cinematic intro, and disabled
 * under prefers-reduced-motion.
 */

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const W = 56;

// Section anchors the line walks through, in scroll order. The line
// starts at the first id and ends at the last.
const SECTION_IDS = [
  "sample-workflow",
  "pillars",
  "why",
  "compare",
  "roi",
  "pricing",
  "faq",
  "get-started",
] as const;

function buildPath(h: number): string {
  const cx = W / 2;
  const y = (f: number) => +(h * f).toFixed(2);
  return [
    `M ${cx} 0`,
    `L ${cx} ${y(0.14)}`,
    // swirl right — small loop using cubic that returns to centerline
    `C ${cx + 24} ${y(0.155)}, ${cx + 24} ${y(0.215)}, ${cx} ${y(0.23)}`,
    `L ${cx} ${y(0.38)}`,
    // S-wave (two opposing quadratics)
    `Q ${cx - 20} ${y(0.43)}, ${cx} ${y(0.48)}`,
    `Q ${cx + 20} ${y(0.53)}, ${cx} ${y(0.58)}`,
    `L ${cx} ${y(0.72)}`,
    // swirl left
    `C ${cx - 24} ${y(0.735)}, ${cx - 24} ${y(0.795)}, ${cx} ${y(0.81)}`,
    `L ${cx} ${y(1)}`,
  ].join(" ");
}

type Marker = { id: string; x: number; y: number; frac: number };

export function ScrollGuideLine() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const headRef = React.useRef<SVGGElement>(null);
  const markerRefs = React.useRef<Array<SVGGElement | null>>([]);
  const markerState = React.useRef<boolean[]>([]);
  const [vh, setVh] = React.useState(0);
  const [markers, setMarkers] = React.useState<Marker[]>([]);

  React.useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Compute marker positions once the path is in the DOM. Deferred to
  // give the DOM time to lay out so getBoundingClientRect numbers reflect
  // the actual section positions, not pre-hydration estimates.
  React.useEffect(() => {
    if (!vh) return;
    let cancelled = false;

    const compute = () => {
      if (cancelled) return;
      const path = pathRef.current;
      if (!path) return;
      const startEl = document.getElementById(SECTION_IDS[0]);
      const endEl = document.getElementById(SECTION_IDS[SECTION_IDS.length - 1]);
      if (!startEl || !endEl) return;

      const startY = startEl.getBoundingClientRect().top + window.scrollY;
      const endY = endEl.getBoundingClientRect().bottom + window.scrollY;
      const range = endY - startY;
      if (range <= 0) return;

      const length = path.getTotalLength();
      const computed: Marker[] = [];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const y = el.getBoundingClientRect().top + window.scrollY;
        const frac = Math.max(0, Math.min(1, (y - startY) / range));
        const pt = path.getPointAtLength(length * frac);
        computed.push({ id, x: pt.x, y: pt.y, frac });
      }
      if (!cancelled) {
        markerState.current = computed.map(() => false);
        setMarkers(computed);
      }
    };

    // Defer a frame so all sections (and any RevealOnScroll wrappers)
    // have settled their final layout heights.
    const t = window.setTimeout(compute, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [vh]);

  useGSAP(
    () => {
      if (!vh) return;
      const path = pathRef.current;
      const head = headRef.current;
      const wrap = wrapRef.current;
      if (!path || !head || !wrap) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        gsap.set(wrap, { autoAlpha: 0 });
        return;
      }

      const startSel = `#${SECTION_IDS[0]}`;
      const endSel = `#${SECTION_IDS[SECTION_IDS.length - 1]}`;
      if (!document.querySelector(startSel) || !document.querySelector(endSel)) {
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(wrap, { autoAlpha: 0 });

      // Fade in as the workflow section approaches the viewport.
      const fade = ScrollTrigger.create({
        trigger: startSel,
        start: "top 92%",
        onEnter: () =>
          gsap.to(wrap, {
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
          }),
        onLeaveBack: () =>
          gsap.to(wrap, {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
          }),
      });

      // Scrub the draw across the marketing sections.
      const draw = ScrollTrigger.create({
        trigger: startSel,
        endTrigger: endSel,
        start: "top 70%",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate(self) {
          const p = Math.max(0, Math.min(1, self.progress));
          path.style.strokeDashoffset = String(length * (1 - p));
          const pt = path.getPointAtLength(length * p);
          head.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);

          // Light up markers as the head passes them. Only animate
          // on state changes to keep the scroll callback cheap.
          for (let i = 0; i < markers.length; i++) {
            const active = p >= markers[i].frac;
            if (markerState.current[i] !== active) {
              markerState.current[i] = active;
              const el = markerRefs.current[i];
              if (el) {
                gsap.to(el, {
                  scale: active ? 1.25 : 1,
                  opacity: active ? 1 : 0.5,
                  duration: 0.35,
                  ease: "power2.out",
                  transformOrigin: "center center",
                });
              }
            }
          }
        },
      });

      return () => {
        fade.kill();
        draw.kill();
      };
    },
    { dependencies: [vh, markers.length] }
  );

  if (!vh) return null;

  const d = buildPath(vh);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-3 xl:left-5 top-0 hidden lg:block z-30"
      style={{ width: W, height: "100vh", opacity: 0 }}
    >
      <svg
        width={W}
        height={vh}
        viewBox={`0 0 ${W} ${vh}`}
        fill="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="zeph-guide-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="8%" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop offset="92%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <filter
            id="zeph-guide-glow"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* Faint dashed track — preview of the path ahead */}
        <path
          d={d}
          className="text-foreground/15"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 5"
        />

        {/* Drawn-by-scroll active stroke */}
        <path
          ref={pathRef}
          d={d}
          stroke="url(#zeph-guide-grad)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* Section markers — small concentric dots that brighten as the
            head passes them. Rendered behind the head so the head's
            glow can wash over them on contact. */}
        {markers.map((m, i) => (
          <g
            key={m.id}
            ref={(el) => {
              markerRefs.current[i] = el;
            }}
            transform={`translate(${m.x}, ${m.y})`}
            style={{ opacity: 0.5 }}
          >
            <circle r="3" fill="var(--primary)" fillOpacity="0.18" />
            <circle r="1.4" fill="var(--primary)" />
          </g>
        ))}

        {/* Head — soft halo + crisp core, transformed along the path */}
        <g ref={headRef} transform={`translate(${W / 2}, 0)`}>
          <circle
            r="7"
            fill="var(--primary)"
            fillOpacity="0.22"
            filter="url(#zeph-guide-glow)"
          />
          <circle r="2.4" fill="var(--primary)" />
        </g>
      </svg>
    </div>
  );
}
