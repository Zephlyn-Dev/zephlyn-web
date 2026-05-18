"use client";

/**
 * Reusable scene primitives — Echo mark, wave-frame tunnel, grid floor,
 * signal cube, connection beam, star field. All theme-aware via the
 * SceneTheme prop passed from cinematic-scene.
 */

import * as React from "react";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import type { SceneTheme } from "./scene-theme";

/* ============================================================
   ECHO MARK 3D
   ============================================================ */

type EchoMarkProps = {
  theme: SceneTheme;
  markRef?: React.Ref<THREE.Group>;
  waveMaterialRef?: React.RefObject<THREE.MeshStandardMaterial | null>;
};

export function EchoMark3D({ theme, markRef, waveMaterialRef }: EchoMarkProps) {
  const railTop = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.4, 1.8, 0),
        new THREE.Vector3(0, 1.8, 0),
        new THREE.Vector3(3.4, 1.8, 0),
      ]),
    []
  );
  const railBot = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.4, -1.8, 0),
        new THREE.Vector3(0, -1.8, 0),
        new THREE.Vector3(3.4, -1.8, 0),
      ]),
    []
  );
  // Refined wave: longer, smoother curve with envelope tapering for elegance
  const waveCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segCount = 120;
    for (let i = 0; i <= segCount; i++) {
      const t = i / segCount;
      const x = -3.6 + t * 7.2;
      const envelope = Math.sin(t * Math.PI); // 0 at edges, 1 at middle
      const u = t * Math.PI * 2;
      const y = Math.sin(u) * 1.0 * envelope;
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Ambient particle field around the mark — adds depth and "data" texture
  const particleGeom = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Concentrate around the wave area, scattered in x and y, shallow z
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const e = theme.echo;
  // Subtle visibility multiplier — the mark whispers, not screams.
  const SUBTLE = 0.35;
  return (
    <group ref={markRef}>
      {/* Rails — hairline, barely there */}
      <mesh>
        <tubeGeometry args={[railTop, 120, 0.010, 8, false]} />
        <meshStandardMaterial
          color={e.railColor}
          emissive={e.railEmissive}
          emissiveIntensity={e.railEmissiveIntensity * SUBTLE}
          transparent
          opacity={e.railOpacity * SUBTLE}
        />
      </mesh>
      <mesh>
        <tubeGeometry args={[railBot, 120, 0.010, 8, false]} />
        <meshStandardMaterial
          color={e.railColor}
          emissive={e.railEmissive}
          emissiveIntensity={e.railEmissiveIntensity * SUBTLE}
          transparent
          opacity={e.railOpacity * SUBTLE}
        />
      </mesh>

      {/* Wave — subtle, lower opacity + dimmer emission */}
      <mesh>
        <tubeGeometry args={[waveCurve, 220, 0.020, 10, false]} />
        <meshStandardMaterial
          ref={waveMaterialRef}
          color={e.waveColor}
          emissive={e.waveEmissive}
          emissiveIntensity={e.waveEmissiveIntensity * SUBTLE}
          transparent
          opacity={e.waveOpacity * 0.45}
        />
      </mesh>

      {/* Endpoint dots — small, semi-transparent */}
      {[
        [-3.4, 1.8],
        [3.4, 1.8],
        [-3.4, -1.8],
        [3.4, -1.8],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshStandardMaterial
            color={e.starColor}
            emissive={e.starEmissive}
            emissiveIntensity={
              theme.mode === "dark" ? e.starEmissiveIntensity * SUBTLE : 0
            }
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}

      {/* Ambient particle dust — very faint */}
      <points geometry={particleGeom}>
        <pointsMaterial
          color={e.waveColor}
          size={0.020}
          sizeAttenuation
          transparent
          opacity={theme.mode === "dark" ? 0.25 : 0.15}
          depthWrite={false}
          blending={
            theme.mode === "dark"
              ? THREE.AdditiveBlending
              : THREE.NormalBlending
          }
        />
      </points>
    </group>
  );
}

/* ============================================================
   WAVE TUNNEL
   ============================================================ */

type WaveTunnelProps = {
  theme: SceneTheme;
  framesRef: React.RefObject<THREE.Group[]>;
  count?: number;
  spacing?: number;
};

const SPHERE_R = 2.4;
const WAVE_LOBES = 3;
const WAVE_AMP = 0.7;

function buildWaveFrameCurve(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const segs = 96;
  for (let s = 0; s < segs; s++) {
    const u = (s / segs) * Math.PI * 2;
    const x = Math.cos(u) * SPHERE_R;
    const z = Math.sin(u) * SPHERE_R;
    const y = Math.sin(u * WAVE_LOBES) * WAVE_AMP;
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

export function WaveTunnel({
  theme,
  framesRef,
  count = 28,
  spacing = 2.9,
}: WaveTunnelProps) {
  const curve = useMemo(buildWaveFrameCurve, []);
  const t = theme.tunnel;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const tt = i / Math.max(1, count - 1);
        const color = new THREE.Color(t.waveStart).lerp(
          new THREE.Color(t.waveEnd),
          tt
        );
        return (
          <group
            key={i}
            ref={(el) => {
              if (el) framesRef.current[i] = el;
            }}
            position={[0, 0, -i * spacing]}
            rotation={[0, i * 0.32, 0]}
            userData={{ index: i, depth: tt }}
          >
            <mesh>
              <tubeGeometry args={[curve, 240, 0.013, 6, true]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={t.waveEmissiveIntensity}
                transparent
                opacity={t.waveOpacity}
              />
            </mesh>
            {[
              [SPHERE_R, 0, 0],
              [-SPHERE_R, 0, 0],
              [0, 0, SPHERE_R],
              [0, 0, -SPHERE_R],
            ].map((pos, j) => (
              <mesh key={j} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.038, 8, 8]} />
                <meshStandardMaterial
                  color={t.starColor}
                  emissive={t.starColor}
                  emissiveIntensity={t.starEmissiveIntensity}
                  transparent
                  opacity={1}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}

/* ============================================================
   GRID FLOOR
   ============================================================ */

const _gridTexCache = new Map<string, THREE.CanvasTexture>();

/**
 * Single 1024×1024 floor texture (NOT tiled). Transparent everywhere except
 * a dot grid under the blocks, fading to fully transparent at the edges so
 * the floor reads as a soft glow rather than a flat rectangle.
 */
function buildGridTexture(theme: SceneTheme): THREE.CanvasTexture {
  const key = theme.mode;
  const cached = _gridTexCache.get(key);
  if (cached) return cached;
  const SIZE = 1024;
  const c = document.createElement("canvas");
  c.width = SIZE;
  c.height = SIZE;
  const ctx = c.getContext("2d")!;
  // Transparent base — no fillRect, so the floor has no hard background.
  ctx.clearRect(0, 0, SIZE, SIZE);

  // Dot grid — visually lighter than line grid, reads as a held breath.
  const step = 32;
  const dotMajor = theme.gridFloor.lineColorMajor;
  const dotMinor = theme.gridFloor.lineColorMinor;
  for (let x = step; x < SIZE; x += step) {
    for (let y = step; y < SIZE; y += step) {
      // Distance from center for radial alpha falloff
      const dx = (x - SIZE / 2) / (SIZE / 2);
      const dy = (y - SIZE / 2) / (SIZE / 2);
      const d = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const fade = Math.max(0, 1 - Math.pow(d, 1.6));
      if (fade < 0.02) continue;
      ctx.globalAlpha = fade;
      // Every 4th dot is "major"
      const isMajor = x % (step * 4) === 0 && y % (step * 4) === 0;
      ctx.fillStyle = isMajor ? dotMajor : dotMinor;
      ctx.beginPath();
      ctx.arc(x, y, isMajor ? 1.6 : 1.0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _gridTexCache.set(key, tex);
  return tex;
}

export function GridFloor({ theme }: { theme: SceneTheme }) {
  const tex = useMemo(() => buildGridTexture(theme), [theme]);
  // Larger plane so the dot field surrounds blocks generously, but
  // alphaTest + transparent material lets the canvas show through cleanly.
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} renderOrder={-1}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={theme.gridFloor.opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ============================================================
   SIGNAL CUBE
   ============================================================ */

export type SignalCubeRole = "center" | "innerSat" | "outerSat";

type SignalCubeProps = {
  theme: SceneTheme;
  scale?: number;
  position?: [number, number, number];
  role?: SignalCubeRole;
  topRef?: React.Ref<THREE.Mesh>;
  lampRef?: React.Ref<THREE.PointLight>;
};

const _echoLogoTexCache = new Map<string, THREE.CanvasTexture>();
function buildEchoLogoTexture(theme: SceneTheme): THREE.CanvasTexture {
  // Clean Echo mark — no corner dots. Just rails + wave + center pulse.
  // Transparent background so the cube material shows through behind.
  const key = theme.mode;
  const cached = _echoLogoTexCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const ctx = c.getContext("2d")!;
  // Clear (transparent)
  ctx.clearRect(0, 0, 512, 512);

  // Subtle radial glow under the mark to give it presence
  const halo = ctx.createRadialGradient(256, 256, 30, 256, 256, 220);
  halo.addColorStop(0, "rgba(155,107,255,0.35)");
  halo.addColorStop(1, "rgba(155,107,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(256, 256, 220, 0, Math.PI * 2);
  ctx.fill();

  const fg = theme.mode === "light" ? "#3F1DA8" : "#FFFFFF";

  // Rails (faint)
  ctx.strokeStyle = fg;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(110, 192); ctx.lineTo(402, 192); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(110, 320); ctx.lineTo(402, 320); ctx.stroke();

  // Wave (main brand line)
  ctx.globalAlpha = 1;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(96, 256);
  ctx.bezierCurveTo(160, 192, 224, 320, 256, 256);
  ctx.bezierCurveTo(288, 192, 352, 320, 416, 256);
  ctx.stroke();

  // Central pulse dot
  ctx.fillStyle = theme.mode === "light" ? "#5B2BE0" : "#D4C2FF";
  ctx.beginPath();
  ctx.arc(256, 256, 9, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  _echoLogoTexCache.set(key, tex);
  return tex;
}

export const SignalCube = forwardRef<THREE.Group, SignalCubeProps>(
  function SignalCube(
    { theme, scale = 1, position = [0, 0, 0], role = "center", topRef, lampRef },
    ref
  ) {
    const sc = theme.signalCube;
    const logoTex = useMemo(() => buildEchoLogoTexture(theme), [theme]);
    const topInt =
      role === "center" ? sc.centerTopEmissiveIntensity
      : role === "innerSat" ? sc.innerSatTopEmissiveIntensity
      : sc.outerSatTopEmissiveIntensity;
    const lampInt =
      role === "center" ? sc.centerLampIntensity
      : role === "innerSat" ? sc.innerSatLampIntensity
      : sc.outerSatLampIntensity;
    const haloOp =
      role === "center" ? sc.centerHaloOpacity
      : role === "innerSat" ? sc.innerSatHaloOpacity
      : sc.outerSatHaloOpacity;

    // Slightly larger for the center cube to read as the "primary" node
    const W = (role === "center" ? 1.6 : 1.3) * scale;
    const H = 0.42 * scale;
    const haloColor = 0x9B6BFF;
    const glassColor = role === "center" ? 0xB69AFF : 0x9B6BFF;
    const baseColor = 0x1B0B3A; // very deep purple base (BRAND.p950)
    const edgeColor = 0x4F1DD0; // primary purple edge

    return (
      <group ref={ref} position={position}>
        {/* —— BASE: solid dark plinth, properly lit + reflective —— */}
        <mesh position={[0, -H * 0.55, 0]}>
          <boxGeometry args={[W, H * 0.4, W]} />
          <meshStandardMaterial
            color={baseColor}
            emissive={edgeColor}
            emissiveIntensity={0.15}
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>

        {/* —— GLASS BODY: physical material with transmission for true glass —— */}
        <mesh ref={topRef} position={[0, -H * 0.1, 0]}>
          <boxGeometry args={[W * 0.92, H * 0.8, W * 0.92]} />
          <meshPhysicalMaterial
            color={glassColor}
            emissive={glassColor}
            emissiveIntensity={topInt + 0.15}
            metalness={0.25}
            roughness={0.05}
            transmission={theme.mode === "dark" ? 0.55 : 0.7}
            thickness={1.2}
            ior={1.55}
            clearcoat={1}
            clearcoatRoughness={0.02}
            transparent
            opacity={theme.mode === "dark" ? 0.7 : 0.5}
            attenuationColor={glassColor}
            attenuationDistance={2}
          />
        </mesh>

        {/* —— LOGO FACE on top: Echo mark texture, emissive for glow —— */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, H * 0.31, 0]}
        >
          <planeGeometry args={[W * 0.72, W * 0.72]} />
          <meshStandardMaterial
            map={logoTex}
            emissiveMap={logoTex}
            emissive={theme.mode === "dark" ? "#FFFFFF" : "#7C3AED"}
            emissiveIntensity={theme.mode === "dark" ? 1.4 : 0.4}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* —— EDGE GLOW: thin emissive ring around the top face —— */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, H * 0.30, 0]}
        >
          <ringGeometry args={[W * 0.38, W * 0.40, 48]} />
          <meshBasicMaterial
            color={haloColor}
            transparent
            opacity={theme.mode === "dark" ? 0.7 : 0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* —— FLOOR HALO: soft additive glow under the cube —— */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -H * 0.78, 0]}
        >
          <circleGeometry args={[W * 1.4, 48]} />
          <meshBasicMaterial
            color={haloColor}
            transparent
            opacity={haloOp * 0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* —— INNER POINT LIGHT: lights the glass body from within —— */}
        <pointLight
          ref={lampRef}
          color={haloColor}
          intensity={lampInt * 0.8}
          distance={5}
          decay={1.6}
          position={[0, 0, 0]}
        />
      </group>
    );
  }
);

/* ============================================================
   CONNECTION BEAM
   ============================================================ */

type BeamProps = {
  theme: SceneTheme;
  meshRef: (el: THREE.Mesh | null) => void;
};

export function ConnectionBeam({ theme, meshRef }: BeamProps) {
  const b = theme.beam;
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
      <cylinderGeometry args={[0.035, 0.035, 1, 8, 1, true]} />
      <meshStandardMaterial
        color={b.color}
        emissive={b.emissive}
        emissiveIntensity={b.emissiveIntensity}
        transparent
        opacity={b.opacity}
      />
    </mesh>
  );
}

/* ============================================================
   STAR FIELD
   ============================================================ */

type StarsProps = {
  theme: SceneTheme;
  count?: number;
  radius?: number;
  position?: [number, number, number];
  pointsRef?: React.Ref<THREE.Points>;
};

export function StarField({
  theme,
  count = 420,
  radius = 30,
  position = [0, 0, 0],
  pointsRef,
}: StarsProps) {
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.55 + Math.random() * 0.45);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, radius]);

  return (
    <points ref={pointsRef} geometry={geom} position={position}>
      <pointsMaterial
        color={theme.stars.color}
        size={theme.stars.size}
        sizeAttenuation
        transparent
        opacity={theme.stars.opacity}
        depthWrite={false}
        blending={
          theme.mode === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending
        }
      />
    </points>
  );
}
