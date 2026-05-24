"use client";

/**
 * Cinematic scroll-driven scene (React Three Fiber). Theme-aware:
 * passes SceneTheme presets down to every scene component so the
 * cinematic adapts to light/dark instead of being locked dark.
 */

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  useScrollProgress,
  smoothstep,
  clamp,
} from "./use-scroll-progress";
import { STAGE_RANGES, SCENE_CONSTELLATIONS, UI_SCENES } from "./scene-config";
import { sampleCameraPath } from "./camera-path";
import { StarField as ConstellationStarField } from "./constellation/star-field";
import { STARS } from "./constellation/stars";
import { LINES } from "./constellation/lines";
import { SCENE_THEMES, type SceneMode, type SceneTheme } from "./scene-theme";
import {
  EchoMark3D,
  WaveTunnel,
  StarField,
  SignalCube,
  ConnectionBeam,
  GridFloor,
} from "./scene-parts";
import { Globe } from "./globe";

type Props = {
  proxyRef: React.RefObject<HTMLElement | null>;
  mode: SceneMode;
};

const INNER_DIST = 3.6;
const OUTER_DIST = 6.4;
const DIAG = OUTER_DIST * Math.SQRT1_2;
const SATELLITE_TARGETS: Array<[number, number, number]> = [
  [INNER_DIST, 0, 0],
  [-INNER_DIST, 0, 0],
  [0, 0, INNER_DIST],
  [0, 0, -INNER_DIST],
  [DIAG, 0, DIAG],
  [-DIAG, 0, DIAG],
  [-DIAG, 0, -DIAG],
  [DIAG, 0, -DIAG],
];

function SceneInner({
  progressRef,
  theme,
}: {
  progressRef: React.RefObject<number>;
  theme: SceneTheme;
}) {
  const { camera } = useThree();
  const persp = camera as THREE.PerspectiveCamera;

  const stageA = React.useRef<THREE.Group>(null);
  const stageB = React.useRef<THREE.Group>(null);
  const stageD = React.useRef<THREE.Group>(null);

  const echoMark = React.useRef<THREE.Group>(null);
  const echoWaveMaterialRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const globeGroup = React.useRef<THREE.Group>(null);
  const globeInnerWire = React.useRef<THREE.LineSegments>(null);
  const globeGlowMaterial = React.useRef<THREE.LineBasicMaterial | null>(null);
  const tunnelFrames = React.useRef<THREE.Group[]>([]);
  const starsRef = React.useRef<THREE.Points>(null);

  // Block network refs
  const centerCube = React.useRef<THREE.Group>(null);
  const centerCubeTop = React.useRef<THREE.Mesh>(null);
  const satellites = React.useRef<THREE.Group[]>([]);
  const beams = React.useRef<THREE.Mesh[]>([]);

  const baseOpacities = React.useRef(new Map<string, number>());

  // Reset captured opacities when theme changes — JSX values are different now.
  React.useEffect(() => {
    baseOpacities.current.clear();
  }, [theme]);

  const visitMaterial = React.useCallback(
    (mat: THREE.Material | null | undefined, factor: number) => {
      if (!mat) return;
      const m = mat as THREE.Material & { opacity?: number };
      if (!baseOpacities.current.has(mat.uuid)) {
        baseOpacities.current.set(mat.uuid, m.opacity ?? 1);
      }
      const base = baseOpacities.current.get(mat.uuid)!;
      m.opacity = base * factor;
      m.transparent = true;
    },
    []
  );

  const fadeSubtree = React.useCallback(
    (g: THREE.Group | null, factor: number) => {
      if (!g) return;
      g.visible = factor > 0.001;
      if (!g.visible) return;
      g.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = (obj as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach((mm) => visitMaterial(mm, factor));
          else visitMaterial(m as THREE.Material, factor);
        } else if ((obj as THREE.LineSegments).isLineSegments) {
          visitMaterial((obj as THREE.LineSegments).material as THREE.Material, factor);
        } else if ((obj as THREE.Points).isPoints) {
          visitMaterial((obj as THREE.Points).material as THREE.Material, factor);
        }
      });
    },
    [visitMaterial]
  );

  const multiplyOpacity = React.useCallback(
    (g: THREE.Object3D | null, extra: number) => {
      if (!g) return;
      g.traverse((obj) => {
        const apply = (mat: THREE.Material | null | undefined) => {
          if (!mat) return;
          const m = mat as THREE.Material & { opacity: number };
          m.opacity *= extra;
        };
        if ((obj as THREE.Mesh).isMesh) {
          const m = (obj as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach(apply);
          else apply(m as THREE.Material);
        } else if ((obj as THREE.LineSegments).isLineSegments) {
          apply((obj as THREE.LineSegments).material as THREE.Material);
        }
      });
    },
    []
  );

  const _v1 = React.useMemo(() => new THREE.Vector3(), []);
  const _v2 = React.useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const p = progressRef.current ?? 0;
    const t = clock.elapsedTime;

    const cam = sampleCameraPath(p);
    persp.position.copy(cam.pos);
    persp.lookAt(cam.look);
    if (Math.abs(persp.fov - cam.fov) > 0.01) {
      persp.fov = cam.fov;
      persp.updateProjectionMatrix();
    }

    const oA = 1 - smoothstep(STAGE_RANGES.A.out[0], STAGE_RANGES.A.out[1], p);
    // Globe fades for blocks. Does NOT return — network takes over.
    const oB =
      smoothstep(STAGE_RANGES.B.in[0], STAGE_RANGES.B.in[1], p) *
      (1 - smoothstep(STAGE_RANGES.B.out[0], STAGE_RANGES.B.out[1], p));
    const oD =
      smoothstep(STAGE_RANGES.D.in[0], STAGE_RANGES.D.in[1], p) *
      (1 - smoothstep(STAGE_RANGES.D.out[0], STAGE_RANGES.D.out[1], p));

    fadeSubtree(stageA.current, oA);
    fadeSubtree(stageB.current, oB);
    fadeSubtree(stageD.current, oD);

    if (oA > 0.01 && echoMark.current) {
      // Slower, gentler micro-motion for buttery feel
      echoMark.current.rotation.y = Math.sin(t * 0.22) * 0.18;
      echoMark.current.rotation.x = -0.08 + Math.cos(t * 0.16) * 0.04;
      if (echoWaveMaterialRef.current && theme.mode === "dark") {
        const scrollBoost = smoothstep(0.0, 0.10, p) * 0.8;
        const breath = (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.4;
        echoWaveMaterialRef.current.emissiveIntensity =
          theme.echo.waveEmissiveIntensity + scrollBoost + breath;
      }
      if (starsRef.current) {
        starsRef.current.rotation.y = t * 0.035;
        starsRef.current.rotation.x = Math.sin(t * 0.07) * 0.04;
      }
    }

    if (oB > 0.01) {
      const camZ = persp.position.z;
      const count = tunnelFrames.current.length;
      for (let i = 0; i < count; i++) {
        const frame = tunnelFrames.current[i];
        if (!frame) continue;
        const fz = frame.position.z;
        const dz = camZ - fz;
        let proximity: number;
        if (dz < 0) proximity = 1 - smoothstep(0, 15, -dz);
        else proximity = smoothstep(55, 8, dz);
        multiplyOpacity(frame, proximity);
      }
      if (globeGroup.current) {
        // Whole globe — slow, calm axis rotation. No bob — the orbit camera
        // does the cinematic motion. The globe's job is to feel STABLE so
        // the orbit reads as us moving around something solid.
        globeGroup.current.position.y = 0;
        globeGroup.current.rotation.y = t * 0.045;
        globeGroup.current.rotation.x = 0;
      }
      // Inner wireframe — rotates a touch faster than the parent so the
      // edges shimmer/flow without inducing motion sickness.
      if (globeInnerWire.current) {
        globeInnerWire.current.rotation.y = t * 0.09;
        globeInnerWire.current.rotation.x = t * 0.02;
      }
      // Outer glow wireframe — slow breathing pulse (~6s period)
      if (globeGlowMaterial.current) {
        const breath = 0.5 + Math.sin(t * 1.05) * 0.5; // 0..1
        const base = theme.mode === "dark" ? 0.18 : 0.15;
        globeGlowMaterial.current.opacity = base + breath * 0.14;
      }
    }

    // —— Stage D: block network spreads + beams pulse ——
    // One block at center → opens up to 4 inner satellites (0.57-0.64)
    //                    → then 4 outer satellites (0.61-0.68)
    if (oD > 0.01) {
      const innerEase = smoothstep(0.57, 0.64, p);
      const outerEase = smoothstep(0.61, 0.68, p);

      if (centerCube.current) {
        centerCube.current.position.y = -0.4 + Math.sin(t * 1.4) * 0.05;
        centerCube.current.rotation.y = t * 0.15;
      }
      if (centerCubeTop.current && theme.mode === "dark") {
        const mat = centerCubeTop.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.45 + Math.sin(t * 3) * 0.15;
      }

      for (let i = 0; i < satellites.current.length; i++) {
        const s = satellites.current[i];
        const beam = beams.current[i];
        if (!s) continue;
        const isInner = i < 4;
        const ease = isInner ? innerEase : outerEase;
        const [tx, , tz] = SATELLITE_TARGETS[i];

        s.position.x = tx * ease;
        s.position.z = tz * ease;
        s.position.y = -0.4 + Math.sin(t * 1.4 + i * 0.4) * 0.06 * ease;
        const scl = 0.15 + 0.85 * ease;
        s.scale.setScalar(scl);
        s.rotation.y = -t * 0.12 + i * (Math.PI / 4);

        if (beam) {
          if (ease > 0.12) {
            _v1.set(0, -0.1, 0);
            _v2.set(s.position.x, -0.1, s.position.z);
            const len = _v1.distanceTo(_v2);
            beam.visible = true;
            const mid = _v1.clone().add(_v2).multiplyScalar(0.5);
            beam.position.copy(mid);
            beam.lookAt(_v2);
            beam.scale.y = len;
            const bp = 0.5 + Math.sin(t * 3 + i) * 0.4;
            const mat = beam.material as THREE.MeshStandardMaterial;
            const baseOp = baseOpacities.current.get(mat.uuid) ?? theme.beam.opacity;
            mat.opacity = baseOp * oD * clamp(0.6 + bp * 0.4, 0, 1) * ease;
            if (theme.mode === "dark") {
              mat.emissiveIntensity = 0.35 + bp * 0.4;
            }
          } else {
            beam.visible = false;
          }
        }
      }
    } else {
      for (const b of beams.current) if (b) b.visible = false;
    }
  });

  return (
    <>
      <ambientLight color={theme.ambient.color} intensity={theme.ambient.intensity} />
      <pointLight
        color={theme.lights.key.color}
        intensity={theme.lights.key.intensity}
        distance={60}
        decay={1.6}
        position={theme.lights.key.pos}
      />
      <pointLight
        color={theme.lights.rim.color}
        intensity={theme.lights.rim.intensity}
        distance={40}
        decay={1.8}
        position={theme.lights.rim.pos}
      />

      <group ref={stageA}>
        <EchoMark3D theme={theme} markRef={echoMark} waveMaterialRef={echoWaveMaterialRef} />
        <StarField theme={theme} pointsRef={starsRef} count={420} radius={30} position={[0, 0, -8]} />
      </group>

      <group ref={stageB}>
        <WaveTunnel theme={theme} framesRef={tunnelFrames} count={28} spacing={2.9} />
        {/* Globe lowered to y=-1.8 so the top hemisphere frames in viewport */}
        <Globe
          theme={theme}
          groupRef={globeGroup}
          innerWireRef={globeInnerWire}
          glowMaterialRef={globeGlowMaterial}
          position={[0, -1.8, -86]}
        />
        {/* Space vibe — stars surrounding the globe */}
        <StarField theme={theme} count={420} radius={22} position={[0, -0.5, -86]} />
      </group>

      {/* —— Stage D: Block network at z=-130 (How it works scene) —— */}
      <group ref={stageD} position={[0, 0, -130]}>
        <GridFloor theme={theme} />
        <SignalCube
          theme={theme}
          ref={centerCube}
          topRef={centerCubeTop}
          scale={1.0}
          position={[0, -0.4, 0]}
          role="center"
        />
        {SATELLITE_TARGETS.map((_, i) => (
          <SignalCube
            key={`sat-${i}`}
            theme={theme}
            ref={(el: THREE.Group | null) => {
              if (el) satellites.current[i] = el;
            }}
            scale={1.0}
            position={[0, -0.4, 0]}
            role={i < 4 ? "innerSat" : "outerSat"}
          />
        ))}
        {SATELLITE_TARGETS.map((_, i) => (
          <ConnectionBeam
            key={`beam-${i}`}
            theme={theme}
            meshRef={(el) => {
              if (el) beams.current[i] = el;
            }}
          />
        ))}
      </group>
    </>
  );
}

/* -------------------------------------------------------------- *
 * Dev-flag toggle — `NEXT_PUBLIC_CONSTELLATION_PREVIEW=1` swaps the
 * legacy 7-scene cinematic for the new constellation StarField.
 * Defaults to legacy so prod ship-state is unchanged. The flag is
 * baked at build time (Next reads NEXT_PUBLIC_ vars at compile);
 * to preview locally:
 *   NEXT_PUBLIC_CONSTELLATION_PREVIEW=1 npm run dev
 * -------------------------------------------------------------- */
const CONSTELLATION_PREVIEW =
  process.env.NEXT_PUBLIC_CONSTELLATION_PREVIEW === "1";

export function CinematicScene(props: Props) {
  return CONSTELLATION_PREVIEW ? (
    <ConstellationCinematic {...props} />
  ) : (
    <LegacyCinematic {...props} />
  );
}

/* -------------------------------------------------------------- *
 * Constellation preview — picks current scene from scroll progress
 * and feeds the resolved active stars + lines into the StarField.
 * Empty registries in the foundation pass mean this renders just
 * the background field + camera path; per-scene briefs populate
 * the registries and SCENE_CONSTELLATIONS to bring it to life.
 * -------------------------------------------------------------- */

function ConstellationCinematic({ proxyRef, mode }: Props) {
  const { progressRef } = useScrollProgress(proxyRef);
  const [sceneIdx, setSceneIdx] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const p = progressRef.current ?? 0;
      let idx = 0;
      for (let i = 0; i < UI_SCENES.length; i++) {
        if (p >= UI_SCENES[i][0] && p < UI_SCENES[i][1]) {
          idx = i;
          break;
        }
        if (i === UI_SCENES.length - 1 && p >= UI_SCENES[i][0]) idx = i;
      }
      if (idx !== last) {
        last = idx;
        setSceneIdx(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  const cfg = SCENE_CONSTELLATIONS[sceneIdx] ?? {
    activeStars: [],
    activeLines: [],
  };
  const activeStars = cfg.activeStars
    .map((id) => STARS[id])
    .filter(Boolean);
  const activeLines = cfg.activeLines
    .map((id) => LINES[id])
    .filter(Boolean);

  return (
    <ConstellationStarField
      proxyRef={proxyRef}
      theme={mode}
      activeStars={activeStars}
      activeLines={activeLines}
    />
  );
}

/* -------------------------------------------------------------- *
 * Legacy 7-scene cinematic — unchanged. Kept verbatim during the
 * transition so the production page stays exactly as it is until
 * the constellation rebuild ships scene-by-scene.
 * -------------------------------------------------------------- */

function LegacyCinematic({ proxyRef, mode }: Props) {
  const { progressRef } = useScrollProgress(proxyRef);
  const theme = SCENE_THEMES[mode];
  return (
    <Canvas
      key={mode}
      camera={{ position: [0, 0.2, 8], fov: 55, near: 0.1, far: 400 }}
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
        background: theme.canvasBg,
      }}
      aria-hidden
    >
      <color attach="background" args={[theme.canvasBg]} />
      <fog attach="fog" args={[theme.fog.color, theme.fog.near, theme.fog.far]} />
      <SceneInner progressRef={progressRef} theme={theme} />
      {theme.bloom.enabled && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={theme.bloom.intensity}
            luminanceThreshold={theme.bloom.threshold}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
