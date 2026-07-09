"use client";

/**
 * Zephlyn — Constellation layer (renderer selector + fallback)
 *
 * The page renders THIS, not a specific renderer. It guarantees the SVG
 * constellation as the baseline and mounts the 3D enhancement only when the
 * device is capable, the theme allows it, and nothing has failed. Any failure
 * — init throw, lost WebGL context — silently swaps back to the SVG with no
 * visible broken canvas.
 *
 * If the entire constellation-3d/ folder were deleted, the dynamic import would
 * reject, the boundary would catch, and the SVG would render. The page never
 * depends on WebGL being present.
 */

import * as React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import { canRender3D } from "@/lib/webgl";
import { Constellation } from "./constellation";

/**
 * Light-mode escape hatch (brief §Themes). Bloom on a near-white background is
 * prone to looking washed out; the SVG is already a first-class renderer
 * sharing the same data, so light mode serves SVG by default. Flip to `true`
 * to attempt themed 3D in light mode — it's a config flip, not a rebuild.
 */
const ENABLE_LIGHT_3D = false;

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
  const { resolvedTheme } = useTheme();
  const [allow3D, setAllow3D] = React.useState(false);
  // Once 3D has failed this session, stay on SVG — don't thrash retrying.
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const evaluate = () => {
      const themeOk = ENABLE_LIGHT_3D || resolvedTheme === "dark";
      setAllow3D(themeOk && canRender3D());
    };
    evaluate();
    // Re-evaluate when the viewport crosses the mobile breakpoint (rotate/resize).
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [resolvedTheme]);

  if (allow3D && !failed) {
    return (
      <ThreeDBoundary fallback={<Constellation />} onError={() => setFailed(true)}>
        <Constellation3D onContextLost={() => setFailed(true)} />
      </ThreeDBoundary>
    );
  }

  return <Constellation />;
}
