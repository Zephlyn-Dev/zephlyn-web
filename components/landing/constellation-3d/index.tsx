"use client";

/**
 * Zephlyn — Constellation 3D (WebGL progressive enhancement)
 *
 * The R3F <Canvas> host. Loaded ONLY via next/dynamic({ ssr: false }) from
 * constellation-layer.tsx, so three.js never runs during server render. The
 * scene shares constellation-data with the SVG, so a fallback at any moment is
 * visually consistent.
 *
 * Cost controls here: pixel-ratio cap + adaptive tier (palette.ts), and the
 * render loop is paused (`frameloop="never"`) whenever the tab is hidden.
 */

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";
import { pickTier } from "./palette";

export function Constellation3D({
  onContextLost,
}: {
  /** Called on a lost WebGL context so the parent can swap to the SVG. */
  onContextLost?: () => void;
}) {
  const tier = React.useMemo(() => pickTier(), []);
  const [active, setActive] = React.useState(true);

  // Pause the render loop when the tab is hidden (no wasted GPU/battery).
  React.useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="constellation-layer" aria-hidden>
      <Canvas
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, tier.dprMax]}
        camera={{ position: [0, 0, 28], fov: 55 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onContextLost?.();
            },
            { once: true }
          );
        }}
      >
        <Scene tier={tier} />
      </Canvas>
    </div>
  );
}
