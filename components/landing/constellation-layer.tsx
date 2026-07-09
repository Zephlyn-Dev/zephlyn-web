"use client";

/**
 * Zephlyn — Constellation layer (renderer selector + fallback)
 *
 * The page renders THIS, not a specific renderer. It guarantees the SVG
 * constellation as the baseline and mounts the 3D enhancement only when the
 * device is capable and nothing has failed. Any failure — init throw, lost
 * WebGL context, sustained performance decline — silently swaps back to the
 * SVG with no visible broken canvas.
 *
 * The site is dark-only, so the 3D scene has a single (dark) palette. Mobile
 * gets the lightweight low tier (palette.ts); reduced-motion, low-power and
 * no-WebGL devices get the SVG.
 *
 * If the entire constellation-3d/ folder were deleted, the dynamic import would
 * reject, the boundary would catch, and the SVG would render. The page never
 * depends on WebGL being present.
 */

import * as React from "react";
import dynamic from "next/dynamic";
import { canRender3D } from "@/lib/webgl";
import { Constellation } from "./constellation";

// Client-only: three.js never loads during SSR. While the chunk loads, the SVG
// shows, so the swap is seamless. If the import rejects, the boundary catches.
const Constellation3D = dynamic(
  () => import("./constellation-3d").then((m) => m.Constellation3D),
  { ssr: false, loading: () => <Constellation /> }
);

class ThreeDBoundary extends React.Component<
  { fallback: React.ReactNode; onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function ConstellationLayer() {
  const [allow3D, setAllow3D] = React.useState(false);
  // Once 3D has failed this session, stay on SVG — don't thrash retrying.
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const evaluate = () => setAllow3D(canRender3D());
    evaluate();
    // Re-evaluate on resize (viewport class can change on rotate / window move).
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  if (allow3D && !failed) {
    return (
      <ThreeDBoundary fallback={<Constellation />} onError={() => setFailed(true)}>
        <Constellation3D onFail={() => setFailed(true)} />
      </ThreeDBoundary>
    );
  }

  return <Constellation />;
}
