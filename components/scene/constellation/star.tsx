"use client";

/**
 * Star — a single point in the constellation system.
 *
 * Visual approach: two billboarded planes, both textured with a soft
 * radial gradient generated once at module load. The inner plane is
 * the "core" (full size, full opacity); the outer is the halo (2.5×
 * size, 30% opacity). Color is theme-driven via the CSS variables
 * declared in globals.css §2 — Light mode: deep navy stars on warm
 * paper; dark mode: warm-white stars on near-black.
 *
 * Labels are HTML overlays via drei's <Html> — they sit beside the
 * star, not inside the texture, so they always render at type-overline
 * weight regardless of camera distance.
 *
 * Twinkle: opacity oscillates 0.85 → 1.0 on a slow sine wave with a
 * random period per instance so the field doesn't pulse in sync.
 * Reduced motion: twinkle is disabled — opacity locked at 1.
 */

import * as React from "react";
import * as THREE from "three";
import { Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ConstellationTheme, StarDefinition } from "./types";

/* -------------------------------------------------------------- *
 * Shared radial-gradient texture — generated once, reused across
 * every star. Soft white core with smooth alpha fall-off; the
 * material's `color` prop tints it per theme.
 * -------------------------------------------------------------- */
let _starTexture: THREE.CanvasTexture | null = null;
function getStarTexture(): THREE.CanvasTexture {
  if (_starTexture) return _starTexture;
  if (typeof document === "undefined") {
    // SSR fallback — return a 1px transparent texture. The real
    // texture is generated when the component mounts on the client.
    const t = new THREE.DataTexture(
      new Uint8Array([255, 255, 255, 0]),
      1,
      1,
      THREE.RGBAFormat
    );
    t.needsUpdate = true;
    return t as unknown as THREE.CanvasTexture;
  }
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0.0, "rgba(255,255,255,1.0)");
  g.addColorStop(0.25, "rgba(255,255,255,0.85)");
  g.addColorStop(0.55, "rgba(255,255,255,0.18)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  _starTexture = tex;
  return tex;
}

/* -------------------------------------------------------------- *
 * CSS-variable color readout. The constellation primitives consume
 * `--constellation-star` directly so theme changes propagate via the
 * existing ThemeProvider class-flip without prop-drilling colors.
 * -------------------------------------------------------------- */
function readCssColor(varName: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return new THREE.Color(raw || fallback);
}

type StarProps = StarDefinition & {
  theme: ConstellationTheme;
  /** Disable twinkle (reduced motion). */
  reducedMotion?: boolean;
};

export function Star({
  position,
  size = 4,
  label,
  glow = 0.3,
  theme,
  reducedMotion = false,
}: StarProps) {
  const coreMatRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const haloMatRef = React.useRef<THREE.MeshBasicMaterial>(null);

  // Theme color resolves on every theme change. CSS-var-driven so the
  // constellation reads light/dark from the same source as the rest of
  // the site.
  const starColor = React.useMemo(
    () =>
      readCssColor(
        "--constellation-star",
        theme === "dark" ? "#F8F4E8" : "#1E1B4B"
      ),
    [theme]
  );

  // Twinkle phase + period are randomized per instance so the field
  // doesn't ripple in lockstep.
  const phase = React.useMemo(() => Math.random() * Math.PI * 2, []);
  const period = React.useMemo(() => 5 + Math.random() * 7, []); // 5–12s

  const texture = React.useMemo(() => getStarTexture(), []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    // Sine wave 0–1, mapped to 0.85–1.0 opacity range.
    const twinkle = 0.925 + 0.075 * Math.sin((t / period) * Math.PI * 2 + phase);
    if (coreMatRef.current) coreMatRef.current.opacity = twinkle;
    if (haloMatRef.current) haloMatRef.current.opacity = glow * twinkle;
  });

  const haloScale = size * 2.5;

  return (
    <group position={position}>
      <Billboard>
        {/* Halo — soft, larger, lower opacity. Behind the core. */}
        <mesh renderOrder={0}>
          <planeGeometry args={[haloScale, haloScale]} />
          <meshBasicMaterial
            ref={haloMatRef}
            map={texture}
            color={starColor}
            transparent
            depthWrite={false}
            opacity={glow}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Core — crisp, full opacity. */}
        <mesh renderOrder={1}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial
            ref={coreMatRef}
            map={texture}
            color={starColor}
            transparent
            depthWrite={false}
            opacity={1}
          />
        </mesh>
      </Billboard>
      {label && (
        <Html
          // Position label to the right of the star with a small offset.
          // `distanceFactor` keeps the label legible regardless of zoom.
          position={[size * 0.9, 0, 0]}
          center={false}
          distanceFactor={30}
          // pointer-events: none so the label doesn't steal scroll/click.
          style={{ pointerEvents: "none" }}
        >
          <span
            className="type-overline whitespace-nowrap"
            style={{
              color: `var(--constellation-star)`,
              // Slight halo so the label stays readable against the
              // gradient background in both themes.
              textShadow:
                "0 0 8px var(--constellation-bg-from), 0 0 2px var(--constellation-bg-from)",
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}
