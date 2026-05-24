"use client";

/**
 * StarField — the constellation cinematic Canvas.
 *
 * Single persistent R3F Canvas. Composes three layers, from back to front:
 *   1. Theme-aware gradient background (CSS, on the Canvas's outer element)
 *   2. ~120 ambient background stars (single Points instance — visual
 *      continuity that does NOT change between scenes)
 *   3. Active scene stars (individual <Star> instances — labeled, mountable)
 *   4. Active scene lines (individual <ConstellationLine> instances)
 *
 * Camera position interpolates along the existing `CAMERA_PATH` via the
 * shared `sampleCameraPath` helper, so the camera is in lockstep with
 * the legacy cinematic — same scroll proxy, same waypoints. When the
 * scene-specific briefs land they'll reshape the camera path; this
 * foundation just wires the plumbing.
 *
 * Reduced motion: the scroll-driven camera is replaced with a fixed
 * pose pulled from the LAST keyframe (mirroring the spec's "camera
 * stays at a fixed position per scene" requirement). Star twinkle and
 * line draw-on are individually disabled inside the primitives.
 */

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScrollProgress } from "../use-scroll-progress";
import { sampleCameraPath } from "../camera-path";
import { Star } from "./star";
import { ConstellationLine } from "./constellation-line";
import type {
  ConstellationTheme,
  LineDefinition,
  StarDefinition,
} from "./types";

/* -------------------------------------------------------------- *
 * Background field — ~120 stars at fixed positions in a wide box.
 * Single BufferGeometry + Points so the entire field is one draw
 * call. Positions and seeds are computed once on mount.
 * -------------------------------------------------------------- */

const BG_STAR_COUNT = 120;
const BG_BOX = { x: 220, y: 120, z: 200 };

function BackgroundField({ theme }: { theme: ConstellationTheme }) {
  const positions = React.useMemo(() => {
    const arr = new Float32Array(BG_STAR_COUNT * 3);
    // Deterministic-ish PRNG so the field is stable across renders and
    // doesn't reshuffle on every theme flip.
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < BG_STAR_COUNT; i++) {
      arr[i * 3 + 0] = (rnd() - 0.5) * BG_BOX.x;
      arr[i * 3 + 1] = (rnd() - 0.5) * BG_BOX.y;
      arr[i * 3 + 2] = -10 - rnd() * BG_BOX.z;
    }
    return arr;
  }, []);

  // Theme color resolved from CSS var so light/dark stay in sync with
  // the rest of the design system. Re-resolved when theme changes.
  const color = React.useMemo(() => {
    if (typeof window === "undefined")
      return new THREE.Color(theme === "dark" ? "#F8F4E8" : "#1E1B4B");
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--constellation-star")
      .trim();
    return new THREE.Color(v || (theme === "dark" ? "#F8F4E8" : "#1E1B4B"));
  }, [theme]);

  const geometryRef = React.useRef<THREE.BufferGeometry>(null);
  React.useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  return (
    <points renderOrder={-1}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={1.2}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------- *
 * Camera rig — reads scroll progress per frame and applies pose
 * from the shared sampleCameraPath. Mirrors the existing legacy
 * cinematic so both Canvases stay frame-aligned during the
 * transition period.
 * -------------------------------------------------------------- */

function CameraRig({
  progressRef,
  reducedMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();

  React.useEffect(() => {
    if (reducedMotion) {
      // Lock camera at the end of the path for a calm, settled framing.
      const sample = sampleCameraPath(1);
      camera.position.copy(sample.pos);
      camera.lookAt(sample.look);
      if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
        (camera as THREE.PerspectiveCamera).fov = sample.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }
  }, [camera, reducedMotion]);

  useFrame(() => {
    if (reducedMotion) return;
    const p = progressRef.current ?? 0;
    const sample = sampleCameraPath(p);
    camera.position.lerp(sample.pos, 0.18);
    camera.lookAt(sample.look);
    if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov += (sample.fov - cam.fov) * 0.18;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/* -------------------------------------------------------------- *
 * Resolve line endpoints from active-star ids. Lines whose
 * endpoints aren't present in the current active set silently
 * skip rendering — the scene config can over-declare without
 * causing runtime errors.
 * -------------------------------------------------------------- */

type ResolvedLine = {
  def: LineDefinition;
  from: [number, number, number];
  to: [number, number, number];
};

function resolveLines(
  lines: LineDefinition[],
  stars: StarDefinition[]
): ResolvedLine[] {
  const byId = new Map<string, StarDefinition>();
  for (const s of stars) byId.set(s.id, s);
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const from = byId.get(l.fromStarId);
    const to = byId.get(l.toStarId);
    if (!from || !to) continue;
    out.push({ def: l, from: from.position, to: to.position });
  }
  return out;
}

/* -------------------------------------------------------------- *
 * StarField — public component
 * -------------------------------------------------------------- */

type StarFieldProps = {
  /** Scroll proxy element — the camera reads scroll progress from it.
   *  Same pattern as the legacy cinematic so the two renderers stay
   *  swappable behind the dev flag. */
  proxyRef: React.RefObject<HTMLElement | null>;
  /** Stars that should be visible at the current scroll position. */
  activeStars: StarDefinition[];
  /** Lines whose endpoints are in `activeStars`. */
  activeLines: LineDefinition[];
  /** Resolved theme. `ConstellationTheme` mirrors the ThemeProvider
   *  output — pass the `resolvedTheme` from `useTheme()`. */
  theme: ConstellationTheme;
  /** When true, disable all motion (camera scroll, line draw, star
   *  twinkle). Wire this from the same media query the rest of the
   *  site uses. */
  reducedMotion?: boolean;
  className?: string;
};

export function StarField({
  proxyRef,
  activeStars,
  activeLines,
  theme,
  reducedMotion = false,
  className,
}: StarFieldProps) {
  const { progressRef } = useScrollProgress(proxyRef);
  const resolvedLines = React.useMemo(
    () => resolveLines(activeLines, activeStars),
    [activeLines, activeStars]
  );

  // Read gradient endpoints from CSS vars so light + dark themes
  // stay in lockstep with the rest of the design system.
  const [bg, setBg] = React.useState<string>("");
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const cs = getComputedStyle(document.documentElement);
    const from = cs.getPropertyValue("--constellation-bg-from").trim();
    const to = cs.getPropertyValue("--constellation-bg-to").trim();
    setBg(`radial-gradient(ellipse at center, ${from} 0%, ${to} 100%)`);
  }, [theme]);

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0.2, 8], fov: 55, near: 0.1, far: 600 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: bg,
      }}
      aria-hidden
    >
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <BackgroundField theme={theme} />
      {activeStars.map((s) => (
        <Star key={s.id} {...s} theme={theme} reducedMotion={reducedMotion} />
      ))}
      {resolvedLines.map(({ def, from, to }) => (
        <ConstellationLine
          key={def.id}
          id={def.id}
          from={from}
          to={to}
          delay={def.delay}
          duration={def.duration}
          reducedMotion={reducedMotion}
        />
      ))}
    </Canvas>
  );
}
