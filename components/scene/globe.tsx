"use client";

/**
 * Network globe — triangular icosahedron wireframe with bright vertex dots.
 * Matches the Adobe Stock reference (912096334) plus:
 *   - Inner wireframe that quietly rotates so the lines APPEAR to move
 *   - Outer additive-blended glow wireframe that pulses (breathing effect)
 *   - White vertex dots at every triangle junction
 *   - Extra bright "tip" dots highlighted on a subset of vertices
 *   - Background dust for depth
 */

import * as React from "react";
import { useMemo, forwardRef } from "react";
import * as THREE from "three";
import type { SceneTheme } from "./scene-theme";

type Props = {
  theme: SceneTheme;
  position?: [number, number, number];
  groupRef?: React.Ref<THREE.Group>;
  /** Inner rotating wireframe — assignable from useFrame for motion. */
  innerWireRef?: React.Ref<THREE.LineSegments>;
  /** Outer glow wireframe — material ref so opacity can pulse. */
  glowMaterialRef?: React.RefObject<THREE.LineBasicMaterial | null>;
};

const RADIUS = 2.2;
const DETAIL = 3; // ~1280 triangles, ~640 unique vertices

/**
 * Paint a per-vertex color gradient onto a buffer-geometry's position array.
 * The gradient runs along local X — vertices at x = -RADIUS are pure
 * `fromHex`, vertices at x = +RADIUS are pure `toHex`. As the globe rotates
 * around Y, the gradient sweeps like a planet's day/night terminator.
 */
function paintXGradient(
  geom: THREE.BufferGeometry,
  fromHex: number,
  toHex: number
) {
  const pos = geom.getAttribute("position") as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const from = new THREE.Color(fromHex);
  const to = new THREE.Color(toHex);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    // Normalize x into 0..1. Smoothstep so the seam isn't a hard half/half.
    const x = pos.getX(i);
    const tRaw = (x + RADIUS) / (RADIUS * 2);
    const t = THREE.MathUtils.smoothstep(tRaw, 0.15, 0.85);
    tmp.copy(from).lerp(to, t);
    colors[i * 3 + 0] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

export const Globe = forwardRef<THREE.Group, Props>(function Globe(
  { theme, position = [0, 0, 0], groupRef, innerWireRef, glowMaterialRef },
  ref
) {
  const isDark = theme.mode === "dark";
  const refToUse = groupRef ?? ref;

  // Gradient endpoints — white on one hemisphere, deep purple on the other.
  // Both modes use full white → full purple so the day/night terminator
  // reads clearly. Even on the lavender canvas, white lines pop because
  // they're brighter than the background (which is purple-tinted, not white).
  const WHITE_HEX = 0xFFFFFF;
  const PURPLE_HEX = isDark ? 0x8B5CF6 : 0x4F1DD0;

  // Triangular mesh geometry — wireframe will trace edges
  const icoGeom = useMemo(
    () => new THREE.IcosahedronGeometry(RADIUS, DETAIL),
    []
  );
  const wireGeom = useMemo(() => {
    const g = new THREE.WireframeGeometry(icoGeom);
    paintXGradient(g, WHITE_HEX, PURPLE_HEX);
    return g;
  }, [icoGeom, WHITE_HEX, PURPLE_HEX]);

  // Outer glow wireframe — slightly larger, additive-blended for halo
  const glowGeom = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(RADIUS * 1.02, DETAIL);
    const g = new THREE.WireframeGeometry(ico);
    paintXGradient(g, WHITE_HEX, PURPLE_HEX);
    return g;
  }, [WHITE_HEX, PURPLE_HEX]);

  // Unique vertex positions for dots
  const vertices = useMemo(() => {
    const pos = icoGeom.attributes.position;
    const seen = new Map<string, [number, number, number]>();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
      if (!seen.has(k)) seen.set(k, [x, y, z]);
    }
    return Array.from(seen.values());
  }, [icoGeom]);

  // All-dots buffer geometry
  const dotsGeom = useMemo(() => {
    const arr = new Float32Array(vertices.length * 3);
    vertices.forEach(([x, y, z], i) => {
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    paintXGradient(g, WHITE_HEX, PURPLE_HEX);
    return g;
  }, [vertices, WHITE_HEX, PURPLE_HEX]);

  // Highlighted "tip" dots — every 7th vertex is brighter/bigger
  const tipDotsGeom = useMemo(() => {
    const tips = vertices.filter((_, i) => i % 7 === 0);
    const arr = new Float32Array(tips.length * 3);
    tips.forEach(([x, y, z], i) => {
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    paintXGradient(g, WHITE_HEX, PURPLE_HEX);
    return g;
  }, [vertices, WHITE_HEX, PURPLE_HEX]);

  // Background dust around the globe
  const dustGeom = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.6 + Math.random() * 2.8;
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <group ref={refToUse} position={position}>
      {/* —— OUTER GLOW WIREFRAME: additive, pulses for breathing effect.
              Vertex colors carry the white→purple gradient. —— */}
      <lineSegments geometry={glowGeom}>
        <lineBasicMaterial
          ref={glowMaterialRef}
          vertexColors
          transparent
          opacity={isDark ? 0.22 : 0.2}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* —— INNER WIREFRAME: the crisp triangular mesh with the gradient.
              Rotates via cinematic-scene useFrame; the gradient rotates
              with it like a planet's day/night terminator. —— */}
      <lineSegments ref={innerWireRef} geometry={wireGeom}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.55 : 0.7}
          depthWrite={false}
        />
      </lineSegments>

      {/* —— VERTEX DOTS: small bright points at every triangle junction —— */}
      <points geometry={dotsGeom}>
        <pointsMaterial
          vertexColors
          size={isDark ? 0.05 : 0.045}
          sizeAttenuation
          transparent
          opacity={isDark ? 0.95 : 0.85}
          depthWrite={false}
        />
      </points>

      {/* —— TIP DOTS: bigger / brighter, ~1/7th of vertices —— */}
      <points geometry={tipDotsGeom}>
        <pointsMaterial
          vertexColors
          size={isDark ? 0.085 : 0.07}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* —— BACKGROUND DUST: depth particles —— */}
      <points geometry={dustGeom}>
        <pointsMaterial
          color={isDark ? 0xFFFFFF : 0x5B2BE0}
          size={isDark ? 0.028 : 0.022}
          sizeAttenuation
          transparent
          opacity={isDark ? 0.4 : 0.22}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  );
});
