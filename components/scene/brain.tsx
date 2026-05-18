"use client";

/**
 * Anatomical brain — minimalist. Single deformed icosahedron + wireframe
 * + one orbital ring + small dust field. Cerebellum, stem, thalamus, halo
 * removed for a cleaner, more confident silhouette.
 */

import * as React from "react";
import { useMemo } from "react";
import * as THREE from "three";
import type { SceneTheme } from "./scene-theme";

type Props = {
  theme: SceneTheme;
  position?: [number, number, number];
  groupRef?: React.Ref<THREE.Group>;
};

function buildBrainGeometry(): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(1.0, 6);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    x *= 1.3; y *= 1.0; z *= 1.7;
    if (y < 0) {
      const t = -y / 1.0;
      y *= 1 - t * 0.35;
      y -= 0.12 * t;
    }
    if (z > 0.6) z *= 1 + (z - 0.6) * 0.10;
    if (z < -0.6) z *= 1 + (-z - 0.6) * 0.06;
    if (y < 0.2 && Math.abs(x) > 0.5) {
      const sideStrength = Math.min(1, (Math.abs(x) - 0.5) / 0.8);
      const lowStrength = Math.min(1, (0.2 - y) / 1.1);
      const bulge = sideStrength * lowStrength * 0.22;
      x *= 1 + bulge;
      y -= bulge * 0.15;
    }
    const fissureBand = Math.exp(-Math.abs(x) * 7.0);
    const onTop = Math.max(0, y);
    y -= fissureBand * onTop * 0.20;
    const sx = Math.abs(x);
    if (sx > 0.6 && sx < 1.4) {
      const along = (z * 0.6) + (y * 0.4);
      const dist = Math.abs(along - 0.05);
      const groove = Math.exp(-dist * 6.0) * 0.10;
      x *= 1 - groove;
    }
    const fold =
      Math.sin(x * 5.2 + y * 1.4) * Math.cos(z * 4.6) * 0.06 +
      Math.sin(z * 6.8 + x * 2.0) * 0.045 +
      Math.cos(y * 7.4 + z * 3.2 + x * 1.8) * 0.04;
    x += x * fold * 0.18;
    y += y * fold * 0.18;
    z += z * fold * 0.18;
    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function buildDustGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.8 + Math.random() * 1.0;
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.2;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

export function Brain({ theme, position = [0, 0, 0], groupRef }: Props) {
  const shellGeom = useMemo(buildBrainGeometry, []);
  const dustGeom = useMemo(() => buildDustGeometry(60), []);
  const b = theme.brain;

  // Bright glowing surface nodes — these are what give the brain its
  // "space vibe" look. Scattered across the deformed surface so the
  // wireframe doesn't read as a featureless sphere.
  const surfaceNodes = useMemo(() => {
    const items: Array<{ pos: [number, number, number]; size: number }> = [];
    for (let i = 0; i < 32; i++) {
      const t = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.12 + Math.random() * 0.18;
      // Match the brain's anatomical proportions so dots sit on the shell
      const x = r * Math.sin(phi) * Math.cos(t) * 1.3;
      const y = r * Math.sin(phi) * Math.sin(t);
      const z = r * Math.cos(phi) * 1.7;
      items.push({ pos: [x, y, z], size: 0.03 + Math.random() * 0.035 });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Shell */}
      <mesh geometry={shellGeom}>
        <meshStandardMaterial
          color={b.shellColor}
          emissive={b.shellEmissive}
          emissiveIntensity={b.shellEmissiveIntensity}
          metalness={0.15}
          roughness={0.5}
          transparent
          opacity={b.shellOpacity}
          depthWrite={false}
        />
      </mesh>
      <lineSegments>
        <wireframeGeometry args={[shellGeom]} />
        <lineBasicMaterial
          color={b.wireColor}
          transparent
          opacity={b.wireOpacity}
        />
      </lineSegments>

      {/* Single thicker orbital ring — more prominent volume */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.3, 0.025, 24, 256]} />
        <meshStandardMaterial
          color={b.ringColor1}
          emissive={b.ringColor1}
          emissiveIntensity={b.ringEmissiveIntensity1}
          transparent
          opacity={b.ringOpacity1}
        />
      </mesh>

      {/* Glowing surface nodes — bright star-like dots on the brain */}
      {surfaceNodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.size, 10, 10]} />
          <meshStandardMaterial
            color={b.nodeColor}
            emissive={b.nodeColor}
            emissiveIntensity={
              theme.mode === "dark"
                ? Math.max(1.4, b.nodeEmissiveIntensity)
                : 0
            }
            transparent
            opacity={1}
          />
        </mesh>
      ))}

      {/* Dust */}
      <points geometry={dustGeom}>
        <pointsMaterial
          color={b.dustColor}
          size={0.04}
          sizeAttenuation
          transparent
          opacity={b.dustOpacity}
          depthWrite={false}
          blending={
            theme.mode === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending
          }
        />
      </points>

      {/* Inner lamp */}
      {b.lampIntensity > 0 && (
        <pointLight
          color={b.lampColor}
          intensity={b.lampIntensity}
          distance={14}
          decay={1.6}
        />
      )}
    </group>
  );
}
