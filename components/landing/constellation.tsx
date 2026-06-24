"use client";

/**
 * Zephlyn — Constellation (SVG, diamond stars + motion)
 *
 * The signature background visual: one continuous constellation spanning the
 * whole page. It is a fixed background *layer* (z-0); all content sits above
 * it (see `.constellation-layer` / `.landing-card` in globals.css §6.95).
 *
 * Shape
 * - Stars are four-point diamond / sparkle glyphs (a unit `<path>` scaled per
 *   star), not circles. Positioning, depth, size and opacity logic is unchanged
 *   — only the glyph changed.
 *
 * Motion (all SVG + CSS + lightweight rAF JS — no WebGL / 3D)
 * - Twinkle (ambient): per-star opacity pulse, randomized duration + phase, via
 *   CSS so it costs nothing on the main thread. Low amplitude.
 * - Drift (ambient): each depth layer floats a few px over a long cycle, via CSS
 *   on the layer group. Desktop only — the calm "release valve".
 * - Lines draw on scroll: connections draw via stroke-dashoffset (the core build).
 * - Stars fade + scale in on scroll as their section enters.
 * - Parallax: nearer depth layers shift more than farther ones on scroll.
 * - Hover-near glow (fine-pointer desktop only): stars near the cursor brighten
 *   via a CSS filter. Does nothing on touch (listener never attaches).
 *
 * Reduced motion → everything above is disabled; falls back to the static,
 * fully-resolved diamond constellation. Mobile keeps twinkle + the scroll build
 * but drops drift, parallax and hover to stay smooth.
 *
 * Tuning: see the TUNING constants below (JS) and the `--twinkle-floor` /
 * `--drift-amp` CSS vars in globals.css §6.96. Lower drift first to calm it.
 */

import * as React from "react";
import { useTheme } from "@/components/theme-provider";

/* ----------------------------------------------------------------------------
 * Tunables — adjust these to make the motion calmer or livelier.
 * (Opacity-floor and global drift amplitude live as CSS vars in globals.css.)
 * -------------------------------------------------------------------------- */
const TWINKLE = { minDur: 3.4, maxDur: 6.8 }; // seconds; wider/longer = calmer
const STAR_SCALE_FROM = 0.55; // scroll scale-in start (1 = no scale-in)
const PARALLAX_NARR = 30; // px the narrative layer counter-shifts over the page
const HOVER_RADIUS = 95; // viewBox units; cursor proximity for hover glow
const REVEAL_BAND = 0.05; // scroll fraction over which a star/line resolves

// Per-depth-layer ambient drift (indexes match LAYERS). dx/dy in viewBox units.
const DRIFT = [
  { dx: 5, dy: -4, dur: 30 }, // far  — least
  { dx: -7, dy: 5, dur: 26 }, // mid
  { dx: 9, dy: 6, dur: 34 }, // near — most
];

/* Unit four-point sparkle, centred at (0,0), slightly elongated vertically.
   Scaled by each star's radius so the footprint matches the old circles. */
const SPARK_PATH =
  "M0,-1.15 L0.18,-0.18 L0.9,0 L0.18,0.18 L0,1.15 L-0.18,0.18 L-0.9,0 L-0.18,-0.18 Z";

/* ----------------------------------------------------------------------------
 * Curated narrative constellation. Coordinates live in a 0..1000 viewBox.
 * `rev` = scroll fraction at which the star resolves (negative => visible from
 * the very top). `glow` stars get a soft halo.
 * -------------------------------------------------------------------------- */
type Star = { x: number; y: number; r: number; op: number; rev: number; glow: boolean };

const STARS: Star[] = [
  { x: 140, y: 160, r: 2.4, op: 0.95, rev: -0.2, glow: true },
  { x: 300, y: 120, r: 1.5, op: 0.6, rev: 0.05, glow: false },
  { x: 470, y: 210, r: 2.0, op: 0.9, rev: -0.2, glow: true },
  { x: 250, y: 300, r: 1.4, op: 0.55, rev: 0.07, glow: false },
  { x: 120, y: 420, r: 1.8, op: 0.8, rev: 0.09, glow: false },
  { x: 380, y: 440, r: 2.6, op: 0.95, rev: -0.2, glow: true },
  { x: 560, y: 360, r: 1.5, op: 0.6, rev: 0.1, glow: false },
  { x: 700, y: 180, r: 2.2, op: 0.9, rev: -0.2, glow: true },
  { x: 840, y: 260, r: 1.5, op: 0.6, rev: 0.12, glow: false },
  { x: 660, y: 470, r: 2.0, op: 0.9, rev: -0.2, glow: true },
  { x: 820, y: 460, r: 1.4, op: 0.55, rev: 0.14, glow: false },
  { x: 200, y: 580, r: 1.7, op: 0.7, rev: 0.12, glow: false },
  { x: 420, y: 620, r: 2.3, op: 0.9, rev: -0.2, glow: true },
  { x: 600, y: 640, r: 1.6, op: 0.65, rev: 0.16, glow: false },
  { x: 770, y: 620, r: 2.0, op: 0.85, rev: 0.1, glow: false },
  { x: 300, y: 760, r: 1.5, op: 0.6, rev: 0.18, glow: false },
  { x: 500, y: 800, r: 2.4, op: 0.95, rev: -0.2, glow: true },
  { x: 690, y: 800, r: 1.6, op: 0.65, rev: 0.2, glow: false },
  { x: 880, y: 720, r: 1.7, op: 0.7, rev: 0.16, glow: false },
  { x: 150, y: 720, r: 1.4, op: 0.55, rev: 0.18, glow: false },
  { x: 470, y: 520, r: 1.6, op: 0.65, rev: 0.12, glow: false },
  { x: 920, y: 520, r: 1.5, op: 0.55, rev: 0.16, glow: false },
];

/* [from, to, threshold] — the connecting line draws when scroll passes `th`. */
const EDGES: Array<[number, number, number]> = [
  [0, 1, 0.14], [1, 2, 0.18], [2, 6, 0.26], [6, 5, 0.3], [5, 3, 0.22], [3, 0, 0.16],
  [3, 4, 0.2], [4, 11, 0.34], [2, 7, 0.24], [7, 8, 0.3], [8, 10, 0.42], [6, 9, 0.32],
  [9, 10, 0.46], [9, 20, 0.38], [20, 5, 0.36], [20, 13, 0.5], [13, 12, 0.48],
  [12, 11, 0.46], [11, 19, 0.56], [12, 15, 0.58], [15, 16, 0.64], [16, 13, 0.6],
  [16, 17, 0.68], [17, 14, 0.66], [14, 18, 0.72], [18, 21, 0.78], [14, 21, 0.74],
  [13, 17, 0.7], [20, 6, 0.42], [9, 14, 0.62], [16, 19, 0.84], [21, 10, 0.88],
  [0, 4, 0.92],
];

const LINE_BASE_OP = 0.55;

/* Three ambient depth layers (far → near). */
type Layer = { frac: number; rMin: number; rMax: number; opMin: number; opMax: number; par: number };
const LAYERS: Layer[] = [
  { frac: 0.46, rMin: 0.3, rMax: 0.8, opMin: 0.05, opMax: 0.16, par: 8 },
  { frac: 0.34, rMin: 0.6, rMax: 1.2, opMin: 0.15, opMax: 0.32, par: -24 },
  { frac: 0.2, rMin: 1.1, rMax: 2.3, opMin: 0.44, opMax: 0.88, par: 52 },
];

/* Deterministic PRNG so SSR and client render identical fields (no hydration
   mismatch) and a count change re-uses the same positions. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ambient = {
  x: number; y: number; r: number; op: number; layer: number;
  twDur: number; twDelay: number;
};

function buildAmbient(count: number): Ambient[] {
  const rand = mulberry32(0x5eed);
  const out: Ambient[] = [];
  LAYERS.forEach((L, li) => {
    const n = Math.round(count * L.frac);
    for (let i = 0; i < n; i++) {
      out.push({
        x: rand() * 1000,
        y: rand() * 1000,
        r: L.rMin + rand() * (L.rMax - L.rMin),
        op: L.opMin + rand() * (L.opMax - L.opMin),
        layer: li,
        twDur: TWINKLE.minDur + rand() * (TWINKLE.maxDur - TWINKLE.minDur),
        twDelay: -rand() * TWINKLE.maxDur,
      });
    }
  });
  return out;
}

/* Per-narrative-star twinkle params — deterministic (module-level) so SSR and
   client match. */
const STAR_TW = (() => {
  const rand = mulberry32(0xc0ffee);
  return STARS.map(() => ({
    dur: TWINKLE.minDur + rand() * (TWINKLE.maxDur - TWINKLE.minDur),
    delay: -rand() * TWINKLE.maxDur,
  }));
})();

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type CSSVars = React.CSSProperties & Record<string, string | number>;

export function Constellation() {
  const { resolvedTheme } = useTheme();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [ambientCount, setAmbientCount] = React.useState(60);

  // Build the ambient field once per count. Default (60) matches SSR.
  const ambient = React.useMemo(() => buildAmbient(ambientCount), [ambientCount]);

  // Detect mobile after mount to thin the field (kept off the SSR path).
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setAmbientCount(mq.matches ? 30 : 60);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Scroll + hover wiring. Re-runs on theme change (line multiplier) and when
  // the ambient field rebuilds (so freshly-mounted nodes get wired up).
  React.useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lineMul = resolvedTheme === "dark" ? 1 : 0.3;

    const nstars = Array.from(svg.querySelectorAll<SVGGElement>("[data-nstar]"));
    const halos = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-halo]"));
    const lines = Array.from(svg.querySelectorAll<SVGLineElement>("[data-th]"));
    const narrative = svg.querySelector<SVGGElement>("[data-narrative]");
    const parGroups = Array.from(svg.querySelectorAll<SVGGElement>("[data-par]"));

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const mobile = window.matchMedia?.("(max-width: 767px)").matches ?? false;
    const doParallax = !mobile;

    // Reduced motion → static, fully-resolved constellation. No listeners.
    if (reduced) {
      nstars.forEach((g) => {
        g.style.opacity = (Number(g.dataset.op) || 1).toString();
        g.setAttribute("transform", `translate(${g.dataset.x} ${g.dataset.y}) scale(1)`);
      });
      halos.forEach((c) => (c.style.opacity = "0.14"));
      lines.forEach((el) => {
        el.style.strokeDashoffset = "0";
        el.style.opacity = (LINE_BASE_OP * lineMul).toFixed(3);
      });
      return;
    }

    const apply = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp01(window.scrollY / max) : 0;

      nstars.forEach((g) => {
        const rev = Number(g.dataset.rev);
        const op = Number(g.dataset.op) || 1;
        const t = clamp01((p - rev) / REVEAL_BAND);
        const sc = STAR_SCALE_FROM + (1 - STAR_SCALE_FROM) * t;
        g.style.opacity = (op * t).toFixed(3);
        g.setAttribute(
          "transform",
          `translate(${g.dataset.x} ${g.dataset.y}) scale(${sc.toFixed(3)})`
        );
      });

      halos.forEach((c) => {
        const t = clamp01((p - Number(c.dataset.rev)) / REVEAL_BAND);
        c.style.opacity = (0.14 * t).toFixed(3);
      });

      lines.forEach((el) => {
        const t = clamp01((p - Number(el.dataset.th)) / REVEAL_BAND);
        el.style.strokeDashoffset = (1 - t).toFixed(3);
        el.style.opacity = (LINE_BASE_OP * t * lineMul).toFixed(3);
      });

      if (doParallax) {
        if (narrative) narrative.style.transform = `translateY(${(-p * PARALLAX_NARR).toFixed(1)}px)`;
        parGroups.forEach((g) => {
          g.style.transform = `translateY(${(p * Number(g.dataset.par)).toFixed(1)}px)`;
        });
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    apply(); // correct initial state before first paint
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Hover-near glow — fine-pointer desktops only; never attaches on touch.
    const fine =
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;
    let hraf = 0;
    let onMove: ((e: MouseEvent) => void) | null = null;
    if (fine) {
      let mx = 0;
      let my = 0;
      const r2 = HOVER_RADIUS * HOVER_RADIUS;
      const updateHover = () => {
        hraf = 0;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const pt = new DOMPoint(mx, my).matrixTransform(ctm.inverse());
        nstars.forEach((g) => {
          const dx = Number(g.dataset.x) - pt.x;
          const dy = Number(g.dataset.y) - pt.y;
          const path = g.firstElementChild as SVGPathElement | null;
          path?.classList.toggle("is-near", dx * dx + dy * dy < r2);
        });
      };
      onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        if (!hraf) hraf = window.requestAnimationFrame(updateHover);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      if (hraf) cancelAnimationFrame(hraf);
    };
  }, [resolvedTheme, ambient]);

  return (
    <div className="constellation-layer" aria-hidden>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        {/* Ambient depth layers (far → near): parallax on the outer group,
            slow drift on the inner group, twinkle on each diamond. */}
        {LAYERS.map((L, li) => (
          <g key={`amb-${li}`} data-par={L.par}>
            <g
              className={`amb-drift amb-drift-${li}`}
              style={
                {
                  "--drift-dx": DRIFT[li].dx,
                  "--drift-dy": DRIFT[li].dy,
                  "--drift-dur": `${DRIFT[li].dur}s`,
                } as CSSVars
              }
            >
              {ambient
                .filter((a) => a.layer === li)
                .map((a, i) => (
                  <path
                    key={i}
                    className="zeph-spark twinkle"
                    d={SPARK_PATH}
                    transform={`translate(${a.x} ${a.y}) scale(${a.r})`}
                    fill="var(--constellation-star)"
                    style={
                      {
                        "--star-op": a.op,
                        "--tw-dur": `${a.twDur}s`,
                        "--tw-delay": `${a.twDelay}s`,
                      } as CSSVars
                    }
                  />
                ))}
            </g>
          </g>
        ))}

        {/* Curated narrative layer — halos, then lines, then diamonds on top. */}
        <g data-narrative>
          <g>
            {STARS.map((s, i) =>
              s.glow ? (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={s.r * 3.4}
                  fill="var(--constellation-star-glow)"
                  data-halo
                  data-rev={s.rev}
                  style={{ opacity: 0, filter: "blur(2px)" }}
                />
              ) : null
            )}
          </g>

          <g>
            {EDGES.map(([a, b, th], i) => (
              <line
                key={i}
                x1={STARS[a].x}
                y1={STARS[a].y}
                x2={STARS[b].x}
                y2={STARS[b].y}
                stroke="var(--constellation-line)"
                strokeWidth={1.1}
                strokeLinecap="round"
                pathLength={1}
                data-th={th}
                style={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
              />
            ))}
          </g>

          {STARS.map((s, i) => (
            <g
              key={i}
              data-nstar
              data-rev={s.rev}
              data-op={s.op}
              data-x={s.x}
              data-y={s.y}
              transform={`translate(${s.x} ${s.y}) scale(${STAR_SCALE_FROM})`}
              style={{ opacity: 0 }}
            >
              <path
                className="zeph-spark twinkle"
                d={SPARK_PATH}
                transform={`scale(${s.r})`}
                fill="var(--constellation-star)"
                style={
                  {
                    "--star-op": 1,
                    "--tw-dur": `${STAR_TW[i].dur}s`,
                    "--tw-delay": `${STAR_TW[i].delay}s`,
                  } as CSSVars
                }
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
