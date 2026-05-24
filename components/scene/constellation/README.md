# Constellation cinematic — foundation

## The metaphor

Home service businesses are scattered stars. Zephlyn connects them into navigable constellations. One visual system across all seven scenes — what changes per scene is _which_ stars exist and _which_ lines connect them, not the visual language itself.

Mood reference: Stellarium app aesthetic. Astronomy-app quiet. Stars are small and sparse. Lines draw deliberately, like a hand tracing them.

## Primitive structure

```
StarField           (R3F Canvas + camera + composition)
├── BackgroundField (~120 ambient stars — never change between scenes)
├── Star            (single labeled point — per active-stars list)
└── ConstellationLine (drawn connection between two active stars)
```

Three files, three responsibilities:

- **`star-field.tsx`** — the Canvas. Owns the camera rig, gradient background, and the active-set lookup. Theme-aware via CSS vars in `globals.css` §1 / §2.
- **`star.tsx`** — billboarded twin-plane (core + halo), optional HTML label via drei `<Html>`, randomized twinkle.
- **`constellation-line.tsx`** — drei `<Line>` (Line2-backed, consistent screen-space thickness). Draw-on by lerping the end vertex from start → actual end across 400–800ms.

## How to add a scene's stars and lines

1. **Define stars** in `stars.ts`:

   ```ts
   export const STARS: Record<string, StarDefinition> = {
     "hvac-shop-a": {
       id: "hvac-shop-a",
       position: [-12, 2, -40],
       size: 4,
       label: "HVAC",
     },
     // ...
   };
   ```

2. **Define lines** in `lines.ts`:

   ```ts
   export const LINES: Record<string, LineDefinition> = {
     "hvac-to-router": {
       id: "hvac-to-router",
       fromStarId: "hvac-shop-a",
       toStarId: "router-1",
       delay: 200,
     },
   };
   ```

3. **Wire them into a scene** by editing `scene-config.ts`:

   ```ts
   export const SCENE_CONSTELLATIONS: SceneConstellation[] = [
     // Scene 0 — Signal
     {
       activeStars: ["hvac-shop-a", "router-1"],
       activeLines: ["hvac-to-router"],
     },
     // ...
   ];
   ```

The `<ConstellationCinematic>` host picks the current scene from scroll progress and feeds the resolved active set into the StarField. Lines whose endpoints aren't in the active stars silently skip rendering — over-declaring is safe.

## Performance budget

| Layer            | Cap per scene  | Implementation note                   |
| ---------------- | -------------- | ------------------------------------- |
| Background stars | 120 (fixed)    | Single Points instance, one draw call |
| Active stars     | ~30            | Individual meshes (labels + hit-test) |
| Constellation lines | ~25 simultaneously | drei `<Line>` (Line2 instances)  |

If you need more than ~30 active stars in a single scene, switch them to instanced rendering rather than scaling up. The 120 ambient stars are the budget ceiling for unlabeled background detail — they're tuned to read as "a sky" without dominating GPU time.

## Theme reactivity

Stars + background read CSS variables (`--constellation-star`, `--constellation-bg-from`, `--constellation-bg-to`) declared in both `:root` and `.dark` blocks of `app/globals.css`. The line color stays brand purple in both themes — the visual through-line.

When `ThemeProvider` flips the `class="dark"` on `<html>`, the variables resolve to the dark palette and the primitives re-read them on next render. Theme prop on `StarField` is `useTheme().resolvedTheme`.

## Reduced motion

`prefers-reduced-motion: reduce` is handled at three layers:

1. The router (`landing-experience.tsx`) sends reduced-motion users to `StaticLanding`, so the cinematic doesn't mount at all.
2. If somehow the cinematic does run with reduced-motion active, `StarField` accepts a `reducedMotion` prop that locks the camera at the last keyframe, freezes star twinkle, and renders lines instantly.
3. Camera scroll smoothing in `use-scroll-progress.ts` snaps directly to the target when reduced-motion is on.

## Dev preview

The new system ships dark — production still renders the legacy 7-scene cinematic. To preview the constellation locally:

```bash
NEXT_PUBLIC_CONSTELLATION_PREVIEW=1 npm run dev
```

Populate `STARS` and `LINES` registries plus `SCENE_CONSTELLATIONS[0]` to see something on screen during the SIGNAL scene.

## What lives outside this folder

- **`../camera-path.ts`** — shared `sampleCameraPath()` helper. Used by both the legacy Canvas and the StarField so they stay frame-aligned during the transition.
- **`../scene-config.ts`** — `SCENE_CONSTELLATIONS`, `UI_SCENES`, `CAMERA_PATH`.
- **`../cinematic-scene.tsx`** — the dev-flag toggle that picks between `LegacyCinematic` and `ConstellationCinematic`.
