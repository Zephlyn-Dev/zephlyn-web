"use client";

/**
 * Zephlyn — Constellation 3D (WebGL progressive enhancement)
 *
 * The R3F <Canvas> host. Loaded ONLY via next/dynamic({ ssr: false }) from
 * constellation-layer.tsx, so three.js never runs during server render. The
 * scene shares constellation-data with the SVG, so a fallback at any moment is
 * visually consistent.
 *
 * Cost controls here: pixel-ratio cap + adaptive tier (palette.ts), antialias
 * off on the low (mobile) tier, and the render loop is paused
 * (`frameloop="never"`) whenever the tab is hidden.
 */

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";
import { pickTier, SCENE_THEME, CAMERA } from "./palette";

export function Constellation3D({
  onFail,
}: {
  /** Called on lost WebGL context or a sustained performance decline, so the
   *  parent can swap to the SVG. */
  onFail?: () => void;
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
          antialias: tier.aa,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, tier.dprMax]}
        camera={{ position: [0, 0.4, CAMERA.z], fov: CAMERA.fov }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onFail?.();
            },
            { once: true }
          );
        }}
      >
        <Scene tier={tier} theme={SCENE_THEME} onFail={onFail} />
      </Canvas>
    </div>
  );
}
