"use client";

/**
 * HTML overlay that floats over the cinematic canvas.
 * - 7 scene panels (text for scenes 0/2/4/6 · detailed 2D dashboards for 1/3/5)
 * - Right-side scene-navigator rail (7 buttons)
 * - Bottom progress bar with play button + mono label
 * - Scroll hint
 *
 * Hides itself once the user scrolls past the cinematic proxy.
 */

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useScrollProgress,
  clamp,
} from "./use-scroll-progress";
import { UI_SCENES, SCENE_LABELS } from "./scene-config";
import { cn } from "@/lib/cn";
import { ProblemScene } from "@/components/marketing/problem-scene";
import { WorkflowScene } from "@/components/marketing/workflow-scene";
import { ToolsScene } from "@/components/marketing/tools-scene";
import { LiveTicker } from "@/components/marketing/live-ticker";
import { PilotBar } from "@/components/marketing/pilot-bar";

type Props = {
  proxyRef: React.RefObject<HTMLElement | null>;
};

export function SceneOverlay({ proxyRef }: Props) {
  const { progressRef } = useScrollProgress(proxyRef);
  const [sceneIdx, setSceneIdx] = React.useState(0);
  const [inCinematic, setInCinematic] = React.useState(true);

  // Bottom progress bar — mutated via DOM, NOT via React state. Each
  // setState during the cinematic was forcing React reconciliation on
  // the whole overlay tree (7 scene panels) at 60fps, which competed
  // with the WebGL canvas for main-thread time and was a primary cause
  // of the hero-loading choppiness.
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // Cache the cinematic bounds — re-measure only on resize, not on every
  // scroll. Reading offsetTop/offsetHeight on every scroll caused layout
  // thrashing during the cinematic.
  const boundsRef = React.useRef<{ top: number; max: number }>({
    top: 0,
    max: 0,
  });

  React.useEffect(() => {
    let raf = 0;
    let lastIdx = -1;
    const tick = () => {
      const p = progressRef.current ?? 0;

      // Scene index — only setState when it actually changes (typically
      // ~6 times across the whole 360vh scroll, not 60 times per second).
      let idx = 0;
      for (let i = 0; i < UI_SCENES.length; i++) {
        if (p >= UI_SCENES[i][0] && p < UI_SCENES[i][1]) {
          idx = i;
          break;
        }
        if (i === UI_SCENES.length - 1 && p >= UI_SCENES[i][0]) idx = i;
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setSceneIdx(idx);
      }

      // Bottom progress bar — direct DOM mutation. No React involved.
      const bar = progressBarRef.current;
      if (bar) {
        const clamped = clamp(p, 0, 1);
        bar.style.width = `${(clamped * 100).toFixed(2)}%`;
        bar.style.opacity = clamped < 0.005 ? "0" : "1";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  React.useEffect(() => {
    const measure = () => {
      const el = proxyRef.current;
      if (!el) return;
      boundsRef.current = {
        top: el.offsetTop,
        max: Math.max(0, el.offsetHeight - window.innerHeight),
      };
    };
    measure();

    let inFlag = true;
    const check = () => {
      const sy = window.scrollY;
      const { top, max } = boundsRef.current;
      const next = sy >= top - 50 && sy <= top + max + 50;
      if (next !== inFlag) {
        inFlag = next;
        setInCinematic(next);
      }
    };
    const onResize = () => {
      measure();
      check();
    };

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", onResize);
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", onResize);
    };
  }, [proxyRef]);

  // Keyboard: Escape skips past the cinematic to the post-journey content
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = proxyRef.current;
      if (!el) return;
      const target = el.offsetTop + el.offsetHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proxyRef]);

  const jumpToScene = React.useCallback(
    (idx: number) => {
      const el = proxyRef.current;
      if (!el) return;
      const [a, b] = UI_SCENES[idx];
      const mid = (a + b) / 2;
      const top = el.offsetTop;
      const max = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + mid * max, behavior: "smooth" });
    },
    [proxyRef]
  );

  return (
    <>
      {/* ——— ARIA live region announces scene changes to screen readers ——— */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Scene {sceneIdx + 1} of {SCENE_LABELS.length}: {SCENE_LABELS[sceneIdx]}
      </div>

      {/* ——— Persistent scene counter — top-left, helps orientation ——— */}
      <div
        className={cn(
          "fixed top-20 left-5 md:left-10 z-30",
          "flex items-center gap-4",
          "type-overline font-mono",
          "transition-opacity duration-400",
          inCinematic ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <span className="text-muted-foreground/80 tabular-nums pointer-events-none">
          {String(sceneIdx + 1).padStart(2, "0")} /{" "}
          {String(SCENE_LABELS.length).padStart(2, "0")}
          <span className="ml-2 text-foreground/90">{SCENE_LABELS[sceneIdx]}</span>
        </span>
        {/* Skip cinematic — visible link for mouse + keyboard users */}
        <button
          type="button"
          onClick={() => {
            const el = proxyRef.current;
            if (!el) return;
            window.scrollTo({
              top: el.offsetTop + el.offsetHeight,
              behavior: "smooth",
            });
          }}
          className={cn(
            "type-overline text-muted-foreground/65 hover:text-foreground",
            "transition-colors pointer-events-auto",
            "focus-visible:outline-none focus-visible:text-foreground"
          )}
          aria-label="Skip cinematic and go to main content"
        >
          Skip ↓
        </button>
      </div>

      {/* ——— Right rail — minimal dots only ——— */}
      <aside
        className={cn(
          "fixed right-8 top-1/2 -translate-y-1/2 z-30",
          "hidden flex-col gap-4",
          "[@media(min-width:900px)]:flex",
          "transition-opacity duration-400",
          inCinematic ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Scene navigator"
      >
        {SCENE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => jumpToScene(i)}
            aria-label={`Go to scene ${i + 1}: ${label}`}
            aria-current={sceneIdx === i || undefined}
            className="group relative grid place-items-center size-3 focus-visible:outline-none"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300 ease-out",
                sceneIdx === i
                  ? "size-2 bg-primary"
                  : "size-1.5 bg-foreground/50 group-hover:bg-foreground/85 group-focus-visible:bg-foreground/85"
              )}
            />
            {/* Label PERSISTENTLY visible (dimmer when inactive) so users
                don't have to hover to know which scene each dot represents. */}
            <span
              className={cn(
                "absolute right-full mr-3 whitespace-nowrap type-overline transition-all duration-200",
                sceneIdx === i
                  ? "opacity-100 translate-x-0 text-foreground"
                  : "opacity-55 -translate-x-0 text-foreground/70 group-hover:opacity-100 group-focus-visible:opacity-100"
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </aside>

      {/* ——— Scene panels (text for 0/2/4/6 · dashboards for 1/3/5) ——— */}
      <div
        className={cn(
          "fixed inset-0 z-20 pointer-events-none transition-opacity duration-500",
          inCinematic ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Scene 0 — 3D Hero */}
        <TextPanel active={sceneIdx === 0} layout="center">
          <Eyebrow>Automation for home service businesses</Eyebrow>
          <Headline>
            Less admin. <Grad>Faster jobs. Cleaner handoffs.</Grad>
          </Headline>
          <Sub>
            We build automation systems for HVAC, roofing, plumbing,
            electrical, restoration, and solar — so leads get answered,
            estimates move, and sold work hits ops without anyone retyping
            anything.
          </Sub>
          <div className="mt-10 flex flex-wrap items-center gap-3 pointer-events-auto justify-center">
            <Link
              href="/sample-audit"
              transitionTypes={["nav-forward"]}
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-transparent text-foreground border border-border hover:bg-muted hover:border-purple-300 dark:hover:border-purple-700 transition-[background,color,box-shadow,transform] duration-150 ease-out"
            >
              See a sample audit
            </Link>
            <a
              href="#get-started"
              className="type-button inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap select-none h-12 px-6 text-[15px] bg-primary text-primary-foreground hover:bg-purple-800 active:bg-purple-900 active:scale-[0.98] transition-[background,color,box-shadow,transform] duration-150 ease-out"
            >
              Book the 30-min audit — lunch&apos;s on us
            </a>
          </div>
          <p className="mt-3 text-[11px] tracking-[0.04em] text-muted-foreground/80">
            If we can&apos;t find 3 workflows worth fixing in 30 minutes,
            we&apos;ll send you a $25 DoorDash credit. No catch.
          </p>
          <LiveTicker className="mt-7" />
          <PilotBar className="mt-10" />
        </TextPanel>

        {/* Scene 1 — 2D Problem dashboard */}
        <DashboardPanel active={sceneIdx === 1}>
          <ProblemScene />
        </DashboardPanel>

        {/* Scene 2 — 3D Outcome (globe arrives + slow orbit). Text sits LEFT
            because the camera orbit places the globe on the right side of
            the viewport for most of the scene. */}
        <TextPanel active={sceneIdx === 2} layout="left">
          <Eyebrow>The outcome</Eyebrow>
          <Headline>
            Every channel watched. <Grad>Every job moves.</Grad>
          </Headline>
          <Sub>
            Lead intake, scheduling, estimates, and ops handoffs running
            quietly in the background — on the tools you already use.
          </Sub>
        </TextPanel>

        {/* Scene 3 — 2D Workflow dashboard */}
        <DashboardPanel active={sceneIdx === 3}>
          <WorkflowScene />
        </DashboardPanel>

        {/* Scene 4 — 3D Network (blocks spread) */}
        <TextPanel active={sceneIdx === 4} layout="center">
          <Eyebrow>How it works</Eyebrow>
          <Headline>
            Built once. <Grad>Reused across your shop.</Grad>
          </Headline>
          <Sub>
            We start as a productized service with recurring support — and
            as patterns repeat across your workflows, they get cleaner,
            faster, and cheaper to extend.
          </Sub>
        </TextPanel>

        {/* Scene 5 — 2D Tools dashboard */}
        <DashboardPanel active={sceneIdx === 5}>
          <ToolsScene />
        </DashboardPanel>

        {/* Scene 6 — 3D Audit finale */}
        <TextPanel active={sceneIdx === 6} layout="center">
          <Eyebrow>Get audit</Eyebrow>
          <Headline>
            Book the <Grad>free workflow audit.</Grad>
          </Headline>
          <Sub>
            30 minutes, screen-share. We&apos;ll map the three workflows
            we&apos;d build first — costed and ranked by ROI. If none of them
            are worth fixing, lunch&apos;s on us.
          </Sub>
          <div className="mt-10 pointer-events-auto">
            <Button size="lg" type="button">
              Book the 30-min audit — lunch&apos;s on us
            </Button>
          </div>
        </TextPanel>
      </div>

      {/* ——— Slim bottom progress bar — full-width hairline only ———
           Width + opacity mutated directly by the RAF in this component
           via progressBarRef. Avoids React state per scroll tick. */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 h-[2px]",
          "transition-opacity duration-400",
          !inCinematic && "opacity-0"
        )}
      >
        <div
          ref={progressBarRef}
          className="h-full bg-primary"
          style={{
            width: "0%",
            opacity: 0,
            transition: "opacity 200ms ease-out",
          }}
        />
      </div>
    </>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

/** Shared easing — same curve as 3D camera so 2D + 3D feel synchronized. */
const PANEL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Shared transition — opacity + transform + filter for a soft settle. */
const PANEL_TRANSITION =
  "opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1), " +
  "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), " +
  "filter 900ms cubic-bezier(0.22, 1, 0.36, 1)";

function TextPanel({
  active,
  layout = "center",
  children,
}: {
  active: boolean;
  layout?: "center" | "left" | "right" | "top";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col",
        "px-6",
        layout === "center" && "items-center text-center justify-center",
        layout === "top" && "items-center text-center justify-start pt-[14vh]",
        layout === "left" &&
          "items-start text-left justify-center pl-6 md:pl-[8vw] lg:pl-[14vw]",
        layout === "right" &&
          "items-end text-right justify-center pr-6 md:pr-[8vw] lg:pr-[14vw]",
        !active && "pointer-events-none"
      )}
      style={{
        transition: PANEL_TRANSITION,
        transitionTimingFunction: PANEL_EASE,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)",
        filter: active ? "blur(0px)" : "blur(6px)",
      }}
    >
      {/* Constrain content width on side layouts so it stays off the 3D scene */}
      <div
        className={cn(
          layout === "left" || layout === "right"
            ? "w-full max-w-[min(40rem,42vw)]"
            : "w-full max-w-[64rem]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Dashboard panel — wraps detailed 2D scenes. Always centers, allows
 *  vertical overflow within the viewport by enabling pointer-events for
 *  the inner container only when active. */
function DashboardPanel({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center px-4 md:px-8 py-4",
        active ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{
        transition: PANEL_TRANSITION,
        transitionTimingFunction: PANEL_EASE,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)",
        filter: active ? "blur(0px)" : "blur(6px)",
      }}
    >
      {/* No max-height / no inner scroll — dashboard sizes to fit viewport */}
      <div className="w-full">{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-overline text-primary mb-6 inline-flex items-center gap-2">
      <span className="size-1 rounded-full bg-primary" />
      {children}
    </p>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold leading-[1.0] tracking-[-0.045em] text-foreground max-w-[20ch] text-[clamp(2.5rem,7vw,5.5rem)]">
      {children}
    </h2>
  );
}

function Grad({ children }: { children: React.ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground leading-[1.55] max-w-[60ch] mt-6 text-[clamp(1rem,1.4vw,1.25rem)]">
      {children}
    </p>
  );
}
