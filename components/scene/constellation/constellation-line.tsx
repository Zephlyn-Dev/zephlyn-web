"use client";

/**
 * ConstellationLine — a single drawn connection between two stars.
 *
 * Renders a drei `<Line>` (Line2-backed, so width is consistent in
 * screen-space regardless of camera distance) and animates the draw-on
 * by lerping the *end* vertex from `from` → `to` over the line's
 * duration. The line literally grows along its own axis. Easing is
 * `ease-out` cubic — confident, decelerating into the destination.
 *
 * The parent (StarField) resolves star ids to world positions before
 * passing them in. This keeps the primitive dumb about the registry
 * and easy to test in isolation.
 *
 * Mount → draw-on. Unmount → handled by StarField via a brief fade.
 * Reduced motion: line renders instantly at full length, no draw.
 */

import * as React from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Vec3 } from "./types";

type LineImpl = {
  geometry: {
    setPositions(positions: number[] | Float32Array): void;
  };
  material: THREE.Material & { opacity: number };
};

type ConstellationLineProps = {
  id: string;
  from: Vec3;
  to: Vec3;
  /** Milliseconds before draw starts. Default 0. */
  delay?: number;
  /** Total draw duration in ms. Default randomized 400–800. */
  duration?: number;
  /** Skip the draw animation entirely (prefers-reduced-motion). */
  reducedMotion?: boolean;
};

// Ease-out cubic — fast start, smooth deceleration.
function easeOutCubic(t: number): number {
  const x = 1 - t;
  return 1 - x * x * x;
}

export function ConstellationLine({
  from,
  to,
  delay = 0,
  duration,
  reducedMotion = false,
}: ConstellationLineProps) {
  // One default duration per instance — randomized at first render
  // so a constellation of staggered lines feels organic rather than
  // metronomic.
  const dur = React.useMemo(
    () => duration ?? 400 + Math.random() * 400,
    [duration]
  );

  const lineRef = React.useRef<LineImpl | null>(null);
  const startTimeRef = React.useRef<number | null>(null);
  const fromVec = React.useMemo(() => new THREE.Vector3(...from), [from]);
  const toVec = React.useMemo(() => new THREE.Vector3(...to), [to]);
  const currentEnd = React.useMemo(() => new THREE.Vector3(), []);

  // Initial state: start and end both pinned to `from` (zero-length
  // line, invisible). The first frame seeds geometry; useFrame
  // updates the end vertex thereafter.
  const initialPoints = React.useMemo<Vec3[]>(
    () => (reducedMotion ? [from, to] : [from, from]),
    [from, to, reducedMotion]
  );

  useFrame((state) => {
    if (reducedMotion) return;
    const impl = lineRef.current;
    if (!impl) return;

    const now = state.clock.getElapsedTime() * 1000;
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }
    const elapsed = now - startTimeRef.current - delay;
    if (elapsed < 0) return; // still in delay window

    const t = Math.min(1, elapsed / dur);
    const eased = easeOutCubic(t);

    currentEnd.lerpVectors(fromVec, toVec, eased);
    impl.geometry.setPositions([
      fromVec.x, fromVec.y, fromVec.z,
      currentEnd.x, currentEnd.y, currentEnd.z,
    ]);
  });

  return (
    <Line
      ref={lineRef as unknown as React.Ref<never>}
      points={initialPoints}
      // Pulled from --constellation-line via the line shader. We pass
      // the resolved CSS var as a hex up-front; the StarField could
      // hot-swap on theme change if/when we make line color theme-aware,
      // but per spec the line stays brand purple in both themes so the
      // single CSS-var read is fine.
      color={typeof window !== "undefined"
        ? (getComputedStyle(document.documentElement)
            .getPropertyValue("--constellation-line").trim() || "#7C3AED")
        : "#7C3AED"}
      lineWidth={1.6}
      transparent
      opacity={0.8}
      depthWrite={false}
    />
  );
}
