/**
 * Camera-path sampler — shared by the legacy cinematic-scene Canvas and
 * the new constellation StarField Canvas.
 *
 * Both Canvases interpolate camera position / look-at / fov along the
 * same `CAMERA_PATH` keyframes from `scene-config.ts`, so the camera
 * stays in lockstep with scroll progress regardless of which renderer
 * is mounted. The "smootherstep" double-easing gives a buttery glide
 * between waypoints — zero second derivative at the keyframe boundary
 * eliminates the velocity pop that linear easing would produce.
 *
 * Allocation note: the scratch Vector3s are module-level so we don't
 * churn the GC on every frame. Only one Canvas is active at a time
 * (the constellation preview is dev-flag toggled, never side-by-side),
 * so the shared scratch state is safe — if that invariant ever breaks,
 * promote `_pos` and `_look` to function-local variables.
 */

import * as THREE from "three";
import { CAMERA_PATH } from "./scene-config";
import { lerp, smoothstep } from "./use-scroll-progress";

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

export type CameraSample = {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
};

export function sampleCameraPath(p: number): CameraSample {
  for (let i = 0; i < CAMERA_PATH.length - 1; i++) {
    const a = CAMERA_PATH[i];
    const b = CAMERA_PATH[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      const e = smoothstep(0, 1, smoothstep(0, 1, t));
      _pos.set(
        lerp(a.pos[0], b.pos[0], e),
        lerp(a.pos[1], b.pos[1], e),
        lerp(a.pos[2], b.pos[2], e)
      );
      _look.set(
        lerp(a.look[0], b.look[0], e),
        lerp(a.look[1], b.look[1], e),
        lerp(a.look[2], b.look[2], e)
      );
      return { pos: _pos, look: _look, fov: lerp(a.fov, b.fov, e) };
    }
  }
  const last = CAMERA_PATH[CAMERA_PATH.length - 1];
  _pos.set(...last.pos);
  _look.set(...last.look);
  return { pos: _pos, look: _look, fov: last.fov };
}
