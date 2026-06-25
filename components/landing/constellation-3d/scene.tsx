"use client";

/* eslint-disable react-hooks/immutability --
   This is an R3F scene: useFrame callbacks mutate geometry buffers, material
   opacity and object transforms every frame. That imperative per-frame mutation
   IS the library's core pattern (it's how three.js renders without re-creating
   GPU buffers); the immutability rule does not apply inside the render loop. */

/**
 * The real 3D constellation scene. Same narrative beats as the SVG (driven by
 * the SHARED constellation-data): scattered ambient field near the top →
 * connections drawing through the middle → resolved cluster framing the logo at
 * the end. Expressed with depth, a camera that flies forward on scroll, and
 * bloom-lit glowing stars.
 *
 * Dark-mode only (light serves the SVG). No lights in the scene — every element
 * is additive/emissive so bloom does the glow.
 */

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PointMaterial, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { STARS, EDGES, starToWorld } from "../constellation-data";
import {
  COLORS,
  REVEAL_BAND,
  STAR_SIZE,
  STAR_TWINKLE,
  AMBIENT_LAYERS,
  makeAmbient,
  type Tier,
} from "./palette";
import { useScrollProgress } from "./use-scroll";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
type PRef = React.MutableRefObject<number>;

/* Deterministic per-narrative-star twinkle phase/speed (module-level → stable). */
const NARR_TW = STARS.map((_, i) => ({
  speed: STAR_TWINKLE.speed * (0.7 + ((i * 37) % 11) / 11),
  phase: (i * 1.7) % (Math.PI * 2),
}));

/* Camera flies forward (z 28 → 17) as the page scrolls, easing toward the
   resolved constellation. Scroll is damped so motion is smooth, never jerky. */
function CameraRig({ pRef }: { pRef: PRef }) {
  const camera = useThree((s) => s.camera);
  const sp = React.useRef(0);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05); // clamp after tab-inactive to avoid jumps
    sp.current = THREE.MathUtils.damp(sp.current, pRef.current, 3.2, d);
    const p = sp.current;
    const e = p * p * (3 - 2 * p); // smoothstep
    const z = 28 + (17 - 28) * e;
    const sway = Math.sin(p * Math.PI);
    camera.position.set(sway * 1.1, Math.sin(p * Math.PI * 0.7) * 0.7, z);
    camera.lookAt(sway * 0.5, 0.3, 3.5);
  });
  return null;
}

/* The 22 named stars as 3D diamonds (octahedra). Fade + scale in on scroll by
   the same `rev` thresholds as the SVG. */
function NarrativeStars({ pRef }: { pRef: PRef }) {
  const refs = React.useRef<THREE.Mesh[]>([]);
  const geo = React.useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  React.useEffect(() => () => geo.dispose(), [geo]);
  const worlds = React.useMemo(() => STARS.map(starToWorld), []);

  useFrame((state) => {
    const p = pRef.current;
    const clock = state.clock.elapsedTime;
    for (let i = 0; i < STARS.length; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const s = STARS[i];
      const t = clamp01((p - s.rev) / REVEAL_BAND);
      // Small, varied diamonds: glow stars larger, plus per-star r variation.
      const size =
        (s.glow ? STAR_SIZE.glow : STAR_SIZE.base) + (s.r - 1.4) * STAR_SIZE.perR;
      m.scale.setScalar((0.5 + 0.5 * t) * size);
      m.visible = t > 0.002;
      // Reveal × subtle twinkle (opacity shimmer); positions stay anchored so
      // the connecting lines never detach.
      const tw = 1 - STAR_TWINKLE.amp * 0.5 * (1 - Math.sin(clock * NARR_TW[i].speed + NARR_TW[i].phase));
      (m.material as THREE.MeshBasicMaterial).opacity = t * tw;
    }
  });

  return (
    <group>
      {STARS.map((s, i) => {
        const [x, y, z] = worlds[i];
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
            position={[x, y, z]}
            geometry={geo}
          >
            <meshBasicMaterial
              color={s.glow ? COLORS.starBright : COLORS.star}
              transparent
              opacity={0}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* Connections as one additive line-segment buffer. Each edge "draws" by
   interpolating its endpoint from start→end and brightening as scroll passes
   the edge threshold — the 3D echo of the SVG stroke-dashoffset draw. */
function Connections({ pRef }: { pRef: PRef }) {
  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(EDGES.length * 6), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(EDGES.length * 6), 3));
    return g;
  }, []);
  React.useEffect(() => () => geo.dispose(), [geo]);
  const worlds = React.useMemo(() => STARS.map(starToWorld), []);

  useFrame(() => {
    const p = pRef.current;
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < EDGES.length; i++) {
      const [a, b, th] = EDGES[i];
      const t = clamp01((p - th) / REVEAL_BAND);
      const A = worlds[a];
      const B = worlds[b];
      const o = i * 6;
      pos[o] = A[0]; pos[o + 1] = A[1]; pos[o + 2] = A[2];
      pos[o + 3] = A[0] + (B[0] - A[0]) * t;
      pos[o + 4] = A[1] + (B[1] - A[1]) * t;
      pos[o + 5] = A[2] + (B[2] - A[2]) * t;
      const br = t * 0.6; // brightness encodes draw-in (additive on dark bg)
      col[o] = COLORS.line.r * br; col[o + 1] = COLORS.line.g * br; col[o + 2] = COLORS.line.b * br;
      col[o + 3] = col[o]; col[o + 4] = col[o + 1]; col[o + 5] = col[o + 2];
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial
        vertexColors
        transparent
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* The volumetric glow field the camera flies through, as 3 depth layers so
   point sizes vary (far/tiny/faint → near/larger/brighter). drei <PointMaterial>
   renders ROUND soft points (not square) without a hand-rolled texture. Each
   layer twinkles (opacity shimmer) at its own phase, and the whole field drifts
   ultra-slowly — gentle life without the camera. */
function AmbientField({ count }: { count: number }) {
  // Object3D[] (not Points[]) so the <points> ref's inferred geometry generic
  // assigns cleanly; we only touch `.position`, which lives on Object3D.
  const layers = React.useRef<THREE.Object3D[]>([]);
  const mats = React.useRef<THREE.PointsMaterial[]>([]);

  const geos = React.useMemo(
    () =>
      AMBIENT_LAYERS.map((L) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute(
          "position",
          new THREE.BufferAttribute(makeAmbient(Math.round(count * L.frac), L.seed), 3)
        );
        return g;
      }),
    [count]
  );
  React.useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < AMBIENT_LAYERS.length; i++) {
      const L = AMBIENT_LAYERS[i];
      // Per-layer translational drift on a slow elliptical path (x: sin, y: a
      // slightly different frequency → never a straight back-and-forth).
      const pts = layers.current[i];
      if (pts) {
        pts.position.x = L.dx * Math.sin(t * L.dSpeed + L.dPhase);
        pts.position.y = L.dy * Math.cos(t * L.dSpeed * 0.82 + L.dPhase);
      }
      // Per-layer twinkle (opacity shimmer).
      const m = mats.current[i];
      if (m) m.opacity = L.opacity * (1 - L.twAmp * 0.5 * (1 - Math.sin(t * L.twSpeed + L.phase)));
    }
  });

  return (
    <group>
      {AMBIENT_LAYERS.map((L, i) => (
        <points
          key={i}
          ref={(el) => {
            if (el) layers.current[i] = el;
          }}
          geometry={geos[i]}
          frustumCulled={false}
        >
          <PointMaterial
            ref={(el) => {
              if (el) mats.current[i] = el as unknown as THREE.PointsMaterial;
            }}
            transparent
            color={COLORS.star}
            size={L.size}
            sizeAttenuation
            depthWrite={false}
            opacity={L.opacity}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      ))}
    </group>
  );
}

export function Scene({ tier }: { tier: Tier }) {
  const pRef = useScrollProgress();
  // Drop bloom (the most expensive effect) if the frame rate declines, rather
  // than letting the scene stutter.
  const [degraded, setDegraded] = React.useState(false);

  return (
    <>
      <CameraRig pRef={pRef} />
      <AmbientField count={tier.ambient} />
      <Connections pRef={pRef} />
      <NarrativeStars pRef={pRef} />

      <AdaptiveDpr pixelated />
      <PerformanceMonitor onDecline={() => setDegraded(true)} />

      {!degraded && (
        <EffectComposer>
          <Bloom
            intensity={tier.bloom}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.85}
            mipmapBlur
            radius={0.55}
          />
        </EffectComposer>
      )}
    </>
  );
}
