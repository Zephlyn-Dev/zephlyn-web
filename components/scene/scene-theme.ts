"use client";

/**
 * Theme-aware presets for the cinematic scene.
 * Light mode: subtle wireframe illustration on lavender bg, no emissive,
 *             no bloom — reads like an architectural drawing.
 * Dark mode:  glowing emissive volumes on ink bg, bloom on — reads like
 *             a cinematic space.
 */

import { BRAND } from "./scene-config";

export type SceneMode = "light" | "dark";

export type SceneTheme = {
  mode: SceneMode;
  canvasBg: string;
  fog: { color: number; near: number; far: number };
  bloom: { enabled: boolean; intensity: number; threshold: number };
  ambient: { color: number; intensity: number };
  lights: {
    key: { color: number; intensity: number; pos: [number, number, number] };
    rim: { color: number; intensity: number; pos: [number, number, number] };
  };
  echo: {
    railColor: number;
    railEmissive: number;
    railEmissiveIntensity: number;
    railOpacity: number;
    waveColor: number;
    waveEmissive: number;
    waveEmissiveIntensity: number;
    waveOpacity: number;
    starColor: number;
    starEmissive: number;
    starEmissiveIntensity: number;
  };
  tunnel: {
    waveStart: number;
    waveEnd: number;
    waveEmissiveIntensity: number;
    waveOpacity: number;
    starColor: number;
    starEmissiveIntensity: number;
  };
  brain: {
    shellColor: number;
    shellEmissive: number;
    shellEmissiveIntensity: number;
    shellOpacity: number;
    wireColor: number;
    wireOpacity: number;
    cerebellumShellColor: number;
    cerebellumShellEmissive: number;
    cerebellumShellEmissiveIntensity: number;
    cerebellumShellOpacity: number;
    cerebellumWireColor: number;
    cerebellumWireOpacity: number;
    stemColor: number;
    stemEmissive: number;
    stemEmissiveIntensity: number;
    stemOpacity: number;
    thalamusColor: number;
    thalamusOpacity: number;
    nodeColor: number;
    nodeEmissiveIntensity: number;
    ringColor1: number;
    ringEmissiveIntensity1: number;
    ringOpacity1: number;
    ringColor2: number;
    ringEmissiveIntensity2: number;
    ringOpacity2: number;
    haloColor: number;
    haloOpacity: number;
    dustColor: number;
    dustOpacity: number;
    lampColor: number;
    lampIntensity: number;
  };
  signalCube: {
    baseColor: number;
    baseEmissive: number;
    baseEmissiveIntensity: number;
    centerTopEmissiveIntensity: number;
    innerSatTopEmissiveIntensity: number;
    outerSatTopEmissiveIntensity: number;
    centerLampIntensity: number;
    innerSatLampIntensity: number;
    outerSatLampIntensity: number;
    centerHaloOpacity: number;
    innerSatHaloOpacity: number;
    outerSatHaloOpacity: number;
  };
  beam: {
    color: number;
    emissive: number;
    emissiveIntensity: number;
    opacity: number;
  };
  stars: {
    color: number;
    opacity: number;
    size: number;
  };
  gridFloor: {
    bg: string;
    lineColorMajor: string;
    lineColorMinor: string;
    opacity: number;
  };
};

export const SCENE_THEMES: Record<SceneMode, SceneTheme> = {
  dark: {
    mode: "dark",
    canvasBg: "#0A0517",
    fog: { color: BRAND.ink, near: 0, far: 120 },
    bloom: { enabled: true, intensity: 0.85, threshold: 0.18 },
    ambient: { color: 0x1a0f3a, intensity: 0.6 },
    lights: {
      key: { color: BRAND.p500, intensity: 2.5, pos: [4, 6, 8] },
      rim: { color: BRAND.p300, intensity: 1.4, pos: [-6, -2, -4] },
    },
    echo: {
      railColor: BRAND.p400,
      railEmissive: BRAND.p400,
      railEmissiveIntensity: 0.5,
      railOpacity: 0.55,
      waveColor: BRAND.p300,
      waveEmissive: BRAND.p300,
      waveEmissiveIntensity: 1.4,
      waveOpacity: 1,
      starColor: BRAND.p300,
      starEmissive: BRAND.p300,
      starEmissiveIntensity: 1.4,
    },
    tunnel: {
      waveStart: BRAND.p600,
      waveEnd: BRAND.p800,
      waveEmissiveIntensity: 0.7,
      waveOpacity: 0.85,
      starColor: BRAND.p400,
      starEmissiveIntensity: 1.0,
    },
    brain: {
      shellColor: BRAND.p400,
      shellEmissive: BRAND.p500,
      shellEmissiveIntensity: 0.55,
      shellOpacity: 0.45,
      wireColor: BRAND.p100,
      wireOpacity: 0.9,
      cerebellumShellColor: BRAND.p600,
      cerebellumShellEmissive: BRAND.p500,
      cerebellumShellEmissiveIntensity: 0.55,
      cerebellumShellOpacity: 0.55,
      cerebellumWireColor: BRAND.p100,
      cerebellumWireOpacity: 0.75,
      stemColor: BRAND.p700,
      stemEmissive: BRAND.p500,
      stemEmissiveIntensity: 0.5,
      stemOpacity: 0.6,
      thalamusColor: BRAND.p200,
      thalamusOpacity: 0.22,
      nodeColor: BRAND.p100,
      nodeEmissiveIntensity: 2.4,
      ringColor1: BRAND.p400,
      ringEmissiveIntensity1: 1.6,
      ringOpacity1: 0.92,
      ringColor2: BRAND.p300,
      ringEmissiveIntensity2: 0.9,
      ringOpacity2: 0.6,
      haloColor: BRAND.p500,
      haloOpacity: 0.08,
      dustColor: BRAND.p200,
      dustOpacity: 0.65,
      lampColor: BRAND.p300,
      lampIntensity: 6,
    },
    signalCube: {
      baseColor: BRAND.p950,
      baseEmissive: BRAND.p800,
      baseEmissiveIntensity: 0.18,
      centerTopEmissiveIntensity: 0.45,
      innerSatTopEmissiveIntensity: 0.22,
      outerSatTopEmissiveIntensity: 0.15,
      centerLampIntensity: 1.0,
      innerSatLampIntensity: 0.4,
      outerSatLampIntensity: 0.28,
      centerHaloOpacity: 0.18,
      innerSatHaloOpacity: 0.08,
      outerSatHaloOpacity: 0.05,
    },
    beam: {
      color: BRAND.p300,
      emissive: BRAND.p300,
      emissiveIntensity: 0.45,
      opacity: 0.4,
    },
    stars: { color: BRAND.p300, opacity: 0.7, size: 0.05 },
    gridFloor: {
      bg: "transparent",
      lineColorMajor: "rgba(180,140,255,0.55)",
      lineColorMinor: "rgba(180,140,255,0.22)",
      opacity: 1,
    },
  },
  light: {
    mode: "light",
    canvasBg: "#F8F6FC",
    fog: { color: 0xF8F6FC, near: 0, far: 140 },
    bloom: { enabled: false, intensity: 0, threshold: 1.0 },
    // Bright ambient so anything not emissive still reads on light bg
    ambient: { color: 0xFFFFFF, intensity: 1.4 },
    lights: {
      key: { color: 0xFFFFFF, intensity: 0.4, pos: [4, 6, 8] },
      rim: { color: BRAND.p300, intensity: 0.2, pos: [-6, -2, -4] },
    },
    echo: {
      // Light mode: dark purple lines, no emissive, no glow
      railColor: BRAND.p400,
      railEmissive: 0x000000,
      railEmissiveIntensity: 0,
      railOpacity: 0.35,
      waveColor: BRAND.p600,
      waveEmissive: 0x000000,
      waveEmissiveIntensity: 0,
      waveOpacity: 0.85,
      starColor: BRAND.p600,
      starEmissive: 0x000000,
      starEmissiveIntensity: 0,
    },
    tunnel: {
      waveStart: BRAND.p400,
      waveEnd: BRAND.p200,
      waveEmissiveIntensity: 0,
      waveOpacity: 0.5,
      starColor: BRAND.p500,
      starEmissiveIntensity: 0,
    },
    brain: {
      // Subtle wireframe illustration — light purple lines on lavender
      shellColor: BRAND.p200,
      shellEmissive: 0x000000,
      shellEmissiveIntensity: 0,
      shellOpacity: 0.08,
      wireColor: BRAND.p400,
      wireOpacity: 0.45,
      cerebellumShellColor: BRAND.p300,
      cerebellumShellEmissive: 0x000000,
      cerebellumShellEmissiveIntensity: 0,
      cerebellumShellOpacity: 0.1,
      cerebellumWireColor: BRAND.p500,
      cerebellumWireOpacity: 0.4,
      stemColor: BRAND.p500,
      stemEmissive: 0x000000,
      stemEmissiveIntensity: 0,
      stemOpacity: 0.4,
      thalamusColor: BRAND.p400,
      thalamusOpacity: 0.06,
      nodeColor: BRAND.p600,
      nodeEmissiveIntensity: 0,
      ringColor1: BRAND.p400,
      ringEmissiveIntensity1: 0,
      ringOpacity1: 0.45,
      ringColor2: BRAND.p500,
      ringEmissiveIntensity2: 0,
      ringOpacity2: 0.3,
      haloColor: BRAND.p200,
      haloOpacity: 0.04,
      dustColor: BRAND.p500,
      dustOpacity: 0.35,
      lampColor: 0xFFFFFF,
      lampIntensity: 0,
    },
    signalCube: {
      baseColor: BRAND.p300,
      baseEmissive: 0x000000,
      baseEmissiveIntensity: 0,
      centerTopEmissiveIntensity: 0,
      innerSatTopEmissiveIntensity: 0,
      outerSatTopEmissiveIntensity: 0,
      centerLampIntensity: 0,
      innerSatLampIntensity: 0,
      outerSatLampIntensity: 0,
      centerHaloOpacity: 0.08,
      innerSatHaloOpacity: 0.05,
      outerSatHaloOpacity: 0.03,
    },
    beam: {
      color: BRAND.p400,
      emissive: 0x000000,
      emissiveIntensity: 0,
      opacity: 0.35,
    },
    stars: { color: BRAND.p400, opacity: 0.35, size: 0.04 },
    gridFloor: {
      bg: "transparent",
      lineColorMajor: "rgba(91, 43, 224, 0.55)",
      lineColorMinor: "rgba(91, 43, 224, 0.25)",
      opacity: 0.85,
    },
  },
};
