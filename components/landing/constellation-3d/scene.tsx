"use client";

/* eslint-disable react-hooks/immutability --
   This is an R3F scene: useFrame callbacks mutate geometry buffers, material
   opacity and object transforms every frame. That imperative per-frame mutation
   IS the library's core pattern (it's how three.js renders without re-creating
   GPU buffers); the immutability rule does not apply inside the render loop. */

/**
 * The 3D space-flight scene. Same narrative beats as the SVG (driven by the
 * SHARED constellation-data shapes), expressed as forward travel:
 *
 * - The camera sits near the origin; a wrapping ambient starfield streams past
 *   it continuously (faster while you scroll — SPEED in palette.ts).
 * - The "corridor" group (plexus field + authored shapes) advances with scroll
 *   position, so you fly toward each constellation as its section arrives:
 *   the scattered cluster first, then the hub, then the Z finale which frames
 *   up exactly as the page bottoms out.
 * - Plexus links draw in just ahead of the camera and densify down the page —
 *   the deeper you travel, the more the stars connect.
 *
 * Dark-only (additive/emissive + bloom — see SCENE_THEME in palette.ts). Fog
 * matched to the page background provides depth fade-in and hides starfield
 * wrap pops.
 */

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PointMaterial, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { SHAPES, shapeStarWorld, makePlexus } from "../constellation-data";
import {
  CAMERA,
  TRAVEL,
  WRAP,
  SPEED,
  REVEAL_BAND,
  STAR_SIZE,
  STAR_TWINKLE,
  PLEXUS,
  AMBIENT_LAYERS,
  makeAmbient,
  type SceneTheme,
  type Tier,
} from "./palette";
import { useScrollProgress } from "./use-scroll";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth01 = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/* Shared per-frame motion state, written once by MotionDriver (mounted first)
   and read by everything else the same frame. */
type Motion = {
  /** damped scroll progress 0..1 */
  p: number;
  /** damped scroll-velocity speed boost (world units/s) */
  boost: number;
  /** accumulated forward travel of the ambient field (world units) */
  travel: number;
};
type MotionRef = React.MutableRefObject<Motion>;
type PRef = React.MutableRefObject<number>;

/* Flatten the authored shapes once (module-level → stable). */
const FLAT_STARS = SHAPES.flatMap((sh) =>
  sh.stars.map((s, i) => ({ ...s, world: shapeStarWorld(sh, i) }))
);
const FLAT_EDGES = SHAPES.flatMap((sh) =>
  sh.edges.map(([a, b, th]) => ({
    A: shapeStarWorld(sh, a),
    B: shapeStarWorld(sh, b),
    th,
  }))
);

/* Deterministic per-narrative-star twinkle phase/speed. */
const NARR_TW = FLAT_STARS.map((_, i) => ({
  speed: STAR_TWINKLE.speed * (0.7 + ((i * 37) % 11) / 11),
  phase: (i * 1.7) % (Math.PI * 2),
}));

function MotionDriver({ pRef, motion }: { pRef: PRef; motion: MotionRef }) {
  useFrame((_, dt) => {
    const m = motion.current;
    const d = Math.min(dt, 0.05); // clamp after tab-inactive to avoid jumps
    const prev = m.p;
    m.p = THREE.MathUtils.damp(m.p, pRef.current, 3.2, d);
    // Scroll velocity (in world-travel units/s) → damped forward speed boost.
    const v = d > 0 ? (Math.abs(m.p - prev) / d) * TRAVEL : 0;
    m.boost = THREE.MathUtils.damp(
      m.boost,
      Math.min(v * SPEED.gain, SPEED.cap),
      SPEED.smooth,
      d
    );
    m.travel += (SPEED.idle + m.boost) * d;
  });
  return null;
}

/* Camera stays near the origin (the world flies past); scroll adds a gentle
   sway/bob so the flight path never feels like a rail. */
function CameraRig({ motion }: { motion: MotionRef }) {
  const camera = useThree((s) => s.camera);
  useFrame(() => {
    const p = motion.current.p;
    const sway = Math.sin(p * Math.PI) * 0.9;
    camera.position.set(sway, 0.35 + Math.sin(p * Math.PI * 0.7) * 0.45, CAMERA.z);
    camera.lookAt(sway * 0.35, 0.15, -22);
  });
  return null;
}

/* The wrapping starfield the camera flies through — 3 depth layers of points
   whose z recycles over WRAP.length as travel accumulates. Fog swallows each
   respawn at the far end; stars exit past the camera at the near end. */
function StarStream({
  tier,
  theme,
  motion,
}: {
  tier: Tier;
  theme: SceneTheme;
  motion: MotionRef;
}) {
  const groups = React.useRef<THREE.Object3D[]>([]);
  const mats = React.useRef<THREE.PointsMaterial[]>([]);

  const layers = React.useMemo(
    () =>
      AMBIENT_LAYERS.map((L) => {
        const positions = makeAmbient(Math.round(tier.ambient * L.frac), L.seed);
        const zBase = new Float32Array(positions.length / 3);
        for (let i = 0; i < zBase.length; i++) zBase[i] = positions[i * 3 + 2];
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return { geo, zBase };
      }),
    [tier.ambient]
  );
  React.useEffect(() => () => layers.forEach((l) => l.geo.dispose()), [layers]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const travel = motion.current.travel;
    for (let li = 0; li < AMBIENT_LAYERS.length; li++) {
      const L = AMBIENT_LAYERS[li];
      const { geo, zBase } = layers[li];
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < zBase.length; i++) {
        // Base z ∈ [0, length); effective z INCREASES with travel — stars
        // stream from the fogged far end (+z direction) toward and just past
        // the camera, then wrap back to the far end where fog hides respawns.
        pos[i * 3 + 2] =
          WRAP.ahead - WRAP.length + ((zBase[i] + travel) % WRAP.length);
      }
      geo.attributes.position.needsUpdate = true;

      // Lateral drift + twinkle — idle life independent of the flight.
      const g = groups.current[li];
      if (g) {
        g.position.x = L.dx * Math.sin(t * L.dSpeed + L.dPhase);
        g.position.y = L.dy * Math.cos(t * L.dSpeed * 0.82 + L.dPhase);
      }
      const m = mats.current[li];
      if (m)
        m.opacity =
          L.opacity * (1 - L.twAmp * 0.5 * (1 - Math.sin(t * L.twSpeed + L.phase)));
    }
  });

  return (
    <group>
      {AMBIENT_LAYERS.map((L, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groups.current[i] = el;
          }}
        >
          <points geometry={layers[i].geo} frustumCulled={false}>
            <PointMaterial
              ref={(el) => {
                if (el) mats.current[i] = el as unknown as THREE.PointsMaterial;
              }}
              transparent
              color={theme.star}
              size={L.size}
              sizeAttenuation
              depthWrite={false}
              opacity={L.opacity}
              blending={theme.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
              toneMapped={false}
            />
          </points>
        </group>
      ))}
    </group>
  );
}

/* Plexus: loose stars threaded through the corridor whose nearby pairs link up
   as the camera approaches. Positions are static in corridor space (the parent
   group does the travelling); only the RGBA color buffer animates. */
function Plexus({
  tier,
  theme,
  motion,
}: {
  tier: Tier;
  theme: SceneTheme;
  motion: MotionRef;
}) {
  const data = React.useMemo(() => makePlexus(tier.plexus), [tier.plexus]);

  const starGeo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    return g;
  }, [data]);

  const lineGeo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(data.edges.length * 6), 3)
    );
    // RGBA vertex colors → per-edge alpha works in BOTH blending modes.
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(data.edges.length * 8), 4)
    );
    return g;
  }, [data]);
  React.useEffect(
    () => () => {
      starGeo.dispose();
      lineGeo.dispose();
    },
    [starGeo, lineGeo]
  );

  const lineCol = React.useMemo(() => new THREE.Color(theme.line), [theme.line]);

  useFrame(() => {
    const p = motion.current.p;
    // Links densify down the page: sparse at the top, woven by the end.
    const density =
      PLEXUS.densifyFloor +
      (1 - PLEXUS.densifyFloor) *
        smooth01((p - PLEXUS.densifyFrom) / (PLEXUS.densifyTo - PLEXUS.densifyFrom));

    const pos = lineGeo.attributes.position.array as Float32Array;
    const col = lineGeo.attributes.color.array as Float32Array;
    const P = data.positions;
    for (let i = 0; i < data.edges.length; i++) {
      const [a, b, rev] = data.edges[i];
      const t = clamp01((p - rev) / PLEXUS.band);
      const draw = Math.min(1, t * 1.6); // endpoint grows A → B
      const o = i * 6;
      pos[o] = P[a * 3];
      pos[o + 1] = P[a * 3 + 1];
      pos[o + 2] = P[a * 3 + 2];
      pos[o + 3] = P[a * 3] + (P[b * 3] - P[a * 3]) * draw;
      pos[o + 4] = P[a * 3 + 1] + (P[b * 3 + 1] - P[a * 3 + 1]) * draw;
      pos[o + 5] = P[a * 3 + 2] + (P[b * 3 + 2] - P[a * 3 + 2]) * draw;
      const alpha = t * density * PLEXUS.lineAlpha * theme.lineMul;
      const c = i * 8;
      col[c] = lineCol.r; col[c + 1] = lineCol.g; col[c + 2] = lineCol.b; col[c + 3] = alpha;
      col[c + 4] = lineCol.r; col[c + 5] = lineCol.g; col[c + 6] = lineCol.b; col[c + 7] = alpha;
    }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      <points geometry={starGeo} frustumCulled={false}>
        <PointMaterial
          transparent
          color={theme.star}
          size={PLEXUS.starSize}
          sizeAttenuation
          depthWrite={false}
          opacity={PLEXUS.starOpacity}
          blending={theme.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          toneMapped={false}
        />
      </points>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          toneMapped={false}
          blending={theme.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* The authored constellation stars as 3D diamonds (octahedra), fading/scaling
   in on their `rev` thresholds — same beats as the SVG. */
function ShapeStars({ theme, motion }: { theme: SceneTheme; motion: MotionRef }) {
  const refs = React.useRef<THREE.Mesh[]>([]);
  const geo = React.useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  React.useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state) => {
    const p = motion.current.p;
    const clock = state.clock.elapsedTime;
    for (let i = 0; i < FLAT_STARS.length; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const s = FLAT_STARS[i];
      const t = clamp01((p - s.rev) / REVEAL_BAND);
      const size =
        (s.glow ? STAR_SIZE.glow : STAR_SIZE.base) + (s.r - 1.4) * STAR_SIZE.perR;
      m.scale.setScalar((0.5 + 0.5 * t) * size);
      m.visible = t > 0.002;
      const tw =
        1 -
        STAR_TWINKLE.amp * 0.5 * (1 - Math.sin(clock * NARR_TW[i].speed + NARR_TW[i].phase));
      (m.material as THREE.MeshBasicMaterial).opacity = t * tw;
    }
  });

  return (
    <group>
      {FLAT_STARS.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={s.world}
          geometry={geo}
        >
          <meshBasicMaterial
            color={s.glow ? theme.starBright : theme.star}
            transparent
            opacity={0}
            toneMapped={false}
            blending={theme.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Authored connections: each edge draws by interpolating its endpoint from
   start → end past its threshold, with RGBA vertex alpha for the fade. */
function ShapeEdges({ theme, motion }: { theme: SceneTheme; motion: MotionRef }) {
  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FLAT_EDGES.length * 6), 3)
    );
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(FLAT_EDGES.length * 8), 4)
    );
    return g;
  }, []);
  React.useEffect(() => () => geo.dispose(), [geo]);
  const lineCol = React.useMemo(() => new THREE.Color(theme.line), [theme.line]);

  useFrame(() => {
    const p = motion.current.p;
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < FLAT_EDGES.length; i++) {
      const { A, B, th } = FLAT_EDGES[i];
      const t = clamp01((p - th) / REVEAL_BAND);
      const o = i * 6;
      pos[o] = A[0]; pos[o + 1] = A[1]; pos[o + 2] = A[2];
      pos[o + 3] = A[0] + (B[0] - A[0]) * t;
      pos[o + 4] = A[1] + (B[1] - A[1]) * t;
      pos[o + 5] = A[2] + (B[2] - A[2]) * t;
      const alpha = t * 0.65 * theme.lineMul;
      const c = i * 8;
      col[c] = lineCol.r; col[c + 1] = lineCol.g; col[c + 2] = lineCol.b; col[c + 3] = alpha;
      col[c + 4] = lineCol.r; col[c + 5] = lineCol.g; col[c + 6] = lineCol.b; col[c + 7] = alpha;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <lineBasicMaterial
        vertexColors
        transparent
        toneMapped={false}
        blending={theme.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* The corridor: everything scroll-anchored (plexus + shapes) advances toward
   the camera with damped scroll position — fully reversible travel. */
function Corridor({
  tier,
  theme,
  motion,
}: {
  tier: Tier;
  theme: SceneTheme;
  motion: MotionRef;
}) {
  const group = React.useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.position.z = motion.current.p * TRAVEL;
  });
  return (
    <group ref={group}>
      <Plexus tier={tier} theme={theme} motion={motion} />
      <ShapeEdges theme={theme} motion={motion} />
      <ShapeStars theme={theme} motion={motion} />
    </group>
  );
}

export function Scene({
  tier,
  theme,
  onFail,
}: {
  tier: Tier;
  theme: SceneTheme;
  onFail?: () => void;
}) {
  const pRef = useScrollProgress();
  const motion = React.useRef<Motion>({ p: 0, boost: 0, travel: 0 });

  // Performance escape hatch: first sustained decline drops bloom (the most
  // expensive pass); a decline with no bloom left to shed falls back to SVG.
  const [noBloom, setNoBloom] = React.useState(false);
  const bloomOn = !noBloom && theme.bloom > 0 && tier.bloom > 0;
  const bloomOnRef = React.useRef(bloomOn);
  React.useEffect(() => {
    bloomOnRef.current = bloomOn;
  }, [bloomOn]);
  const handleDecline = React.useCallback(() => {
    if (bloomOnRef.current) setNoBloom(true);
    else onFail?.();
  }, [onFail]);

  // Lazy-import EffectComposer only when bloom is actually used, so the light
  // theme / low tier never pays for postprocessing.
  return (
    <>
      <fog attach="fog" args={[theme.fog, theme.fogNear, theme.fogFar]} />

      <MotionDriver pRef={pRef} motion={motion} />
      <CameraRig motion={motion} />
      <StarStream tier={tier} theme={theme} motion={motion} />
      <Corridor tier={tier} theme={theme} motion={motion} />

      <AdaptiveDpr pixelated />
      <PerformanceMonitor onDecline={handleDecline} />

      {bloomOn && <BloomPass intensity={tier.bloom * theme.bloom} />}
    </>
  );
}

/* Isolated so the postprocessing chunk only mounts when bloom is on. */
const LazyComposer = React.lazy(() =>
  import("@react-three/postprocessing").then((m) => ({
    default: ({ intensity }: { intensity: number }) => (
      <m.EffectComposer>
        <m.Bloom
          intensity={intensity}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.55}
        />
      </m.EffectComposer>
    ),
  }))
);

function BloomPass({ intensity }: { intensity: number }) {
  return (
    <React.Suspense fallback={null}>
      <LazyComposer intensity={intensity} />
    </React.Suspense>
  );
}
