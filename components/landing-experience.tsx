"use client";

import * as React from "react";
import { BootScreen } from "@/components/marketing/boot-screen";
import { CinematicScene } from "@/components/scene/cinematic-scene";
import { SceneOverlay } from "@/components/scene/scene-overlay";
import { ReducedMotionLanding } from "@/components/reduced-motion-landing";
import { useTheme } from "@/components/theme-provider";

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

export function LandingExperience() {
  const proxyRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const reduceMotion = useReducedMotion();

  // Accessibility: skip the 360vh scroll-driven 3D cinematic when the user
  // has prefers-reduced-motion. Stack the same scene content as plain
  // sections so the narrative is still readable.
  if (reduceMotion) {
    return <ReducedMotionLanding />;
  }

  return (
    <>
      <BootScreen />
      <CinematicScene proxyRef={proxyRef} mode={mode} />
      <SceneOverlay proxyRef={proxyRef} />
      {/*
        Scroll proxy — total height controls how far the user has to scroll
        to traverse the entire cinematic. 360vh = ~2 wheel ticks per scene.
        Slow enough that 3D backgrounds don't feel overwhelming, tight
        enough that no one has to scroll three times to advance.
      */}
      <div
        ref={proxyRef}
        className="relative z-10 h-[360vh] pointer-events-none"
        aria-hidden
      />
    </>
  );
}
