"use client";

import * as React from "react";
import { BootScreen } from "@/components/marketing/boot-screen";
import { CinematicScene } from "@/components/scene/cinematic-scene";
import { SceneOverlay } from "@/components/scene/scene-overlay";
import { StaticLanding } from "@/components/static-landing";
import { useTheme } from "@/components/theme-provider";

/**
 * Returns true when we should serve the static (linear) layout instead of
 * the scroll-driven 3D cinematic. Two conditions trigger it:
 *   1. The user prefers reduced motion (accessibility)
 *   2. The viewport is under 768px (mobile — the cinematic relies on
 *      landscape framing and degrades catastrophically in portrait)
 *
 * Watches both for changes so a viewport resize or OS-level motion-pref
 * change flips the layout live.
 */
function useStaticLayout() {
  const [isStatic, setIsStatic] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 767px)"
    );
    setIsStatic(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsStatic(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isStatic;
}

export function LandingExperience() {
  const proxyRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const isStatic = useStaticLayout();

  if (isStatic) {
    return <StaticLanding />;
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
