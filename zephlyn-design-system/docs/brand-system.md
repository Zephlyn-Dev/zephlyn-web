# Zephlyn — Brand & Design System

> **Single source of truth.** If a value isn't here, it doesn't ship.
> If a value contradicts code, the code is wrong — open a PR to update one or both.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind v4 (CSS-first config) · TypeScript

---

## Table of contents

1. [Brand overview](#1-brand-overview)
2. [Token architecture](#2-token-architecture)
3. [Color — primitives](#3-color--primitives)
4. [Color — semantic (light + dark)](#4-color--semantic-light--dark)
5. [Typography](#5-typography)
6. [Spacing, radius, shadows, motion](#6-spacing-radius-shadows-motion)
7. [Components](#7-components)
8. [Logo usage](#8-logo-usage)
9. [Asset checklist](#9-asset-checklist)
10. [Accessibility](#10-accessibility)
11. [Developer rules — do / don't](#11-developer-rules--do--dont)
12. [Migration & cleanup](#12-migration--cleanup)

---

## 1. Brand overview

**Zephlyn** is an AI automation platform for service businesses. The brand voice
is *quietly capable* — premium without being precious, technical without being cold.

- **Adjectives we earn:** clean · premium · futuristic · calm · confident · intelligent
- **Adjectives we avoid:** cheesy · generic AI · "wow look at me" · crypto · gimmicky
- **Visual DNA:** the *Echo* mark — a soft signal passing between two rails, with a single bright pulse in the middle. Listen. Decide. Act.

---

## 2. Token architecture

Three-tier system. **Components only ever consume the semantic layer.**

```
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│  PRIMITIVE     │ →  │  SEMANTIC      │ →  │  COMPONENTS    │
│  tokens.css    │    │  globals.css   │    │  *.tsx         │
│  raw brand     │    │  usage-based   │    │  never touch   │
│  --zeph-…      │    │  --primary, …  │    │  primitives    │
└────────────────┘    └────────────────┘    └────────────────┘
```

**Why this matters:** swapping to a new palette later (or adding a sub-brand)
means changing semantic mappings in `globals.css` — components stay untouched.

---

## 3. Color — primitives

Defined in `app/tokens.css`. **Do not reference these directly in components.**
They exist to back the semantic layer and a few rare cases (charts, illustrations).

### Purple scale — Royal Violet

| Token              | Hex       |
| ------------------ | --------- |
| `--zeph-purple-50` | `#F6F2FF` |
| `--zeph-purple-100`| `#EDE6FF` |
| `--zeph-purple-200`| `#D4C2FF` |
| `--zeph-purple-300`| `#B69AFF` |
| `--zeph-purple-400`| `#9B6BFF` |
| `--zeph-purple-500`| `#7C3AED` |
| `--zeph-purple-600`| `#5B2BE0` |
| `--zeph-purple-700`| `#4F1DD0` ★ primary |
| `--zeph-purple-800`| `#3F1DA8` |
| `--zeph-purple-900`| `#2C1271` |
| `--zeph-purple-950`| `#1B0B3A` |

### Neutrals — warm-tinted purple-gray

| Token             | Hex       |
| ----------------- | --------- |
| `--zeph-paper`    | `#FBFAFE` |
| `--zeph-ink`      | `#0A0517` |
| `--zeph-gray-50`  | `#F6F4F9` |
| `--zeph-gray-100` | `#EDEAF2` |
| `--zeph-gray-200` | `#DAD5E2` |
| `--zeph-gray-300` | `#BCB4C9` |
| `--zeph-gray-400` | `#948BA8` |
| `--zeph-gray-500` | `#6E6588` |
| `--zeph-gray-600` | `#524A67` |
| `--zeph-gray-700` | `#3D374D` |
| `--zeph-gray-800` | `#292435` |
| `--zeph-gray-900` | `#161220` |
| `--zeph-gray-950` | `#0A0817` |

### Status colors

| Token                | Hex       | Use                |
| -------------------- | --------- | ------------------ |
| `--zeph-success-500` | `#16A34A` | success in light   |
| `--zeph-success-300` | `#4ADE80` | success in dark    |
| `--zeph-warning-500` | `#D97706` | warning in light   |
| `--zeph-warning-300` | `#FBBF24` | warning in dark    |
| `--zeph-danger-500`  | `#DC2626` | destructive light  |
| `--zeph-danger-300`  | `#F87171` | destructive dark   |
| `--zeph-info-500`    | `#7C3AED` | info (same as p500)|
| `--zeph-info-300`    | `#B69AFF` | info in dark       |

---

## 4. Color — semantic (light + dark)

Defined in `app/globals.css`. **These are what components consume.**

### Light mode

| Token                       | Maps to            | Contrast vs bg |
| --------------------------- | ------------------ | -------------- |
| `--background`              | `paper #FBFAFE`    | —              |
| `--foreground`              | `ink #0A0517`      | 18.7:1 · AAA   |
| `--card`                    | `#FFFFFF`          | —              |
| `--card-foreground`         | `ink`              | 18.9:1 · AAA   |
| `--popover` / `-foreground` | `#FFFFFF` / `ink`  | 18.9:1 · AAA   |
| `--primary`                 | `purple-700`       | 8.9:1 · AAA    |
| `--primary-foreground`      | `white`            | 8.9:1 on primary · AAA |
| `--secondary`               | `purple-50`        | —              |
| `--secondary-foreground`    | `purple-800`       | 9.2:1 · AAA    |
| `--accent`                  | `purple-100`       | —              |
| `--accent-foreground`       | `purple-800`       | 8.5:1 · AAA    |
| `--muted`                   | `gray-100`         | —              |
| `--muted-foreground`        | `gray-600`         | 7.3:1 · AAA    |
| `--border` / `--input`      | `gray-200`         | 1.4:1 · decorative |
| `--ring`                    | `purple-500`       | 4.6:1 · AA     |
| `--destructive`             | `danger-500`       | 4.8:1 · AA     |
| `--success`                 | `success-500`      | 4.5:1 · AA     |
| `--warning`                 | `warning-500`      | 4.5:1 · AA     |

### Dark mode

| Token                       | Maps to            | Contrast vs bg |
| --------------------------- | ------------------ | -------------- |
| `--background`              | `ink`              | —              |
| `--foreground`              | `paper`            | 18.7:1 · AAA   |
| `--card`                    | `gray-900`         | —              |
| `--card-foreground`         | `paper`            | 16.8:1 · AAA   |
| `--primary`                 | `purple-500`       | 6.2:1 · AA     |
| `--primary-foreground`      | `white`            | 6.2:1 on primary · AA |
| `--secondary`               | `gray-800`         | —              |
| `--muted`                   | `gray-800`         | —              |
| `--muted-foreground`        | `gray-400`         | 5.4:1 · AA     |
| `--border` / `--input`      | `gray-800`         | 1.6:1 · decorative |
| `--ring`                    | `purple-400`       | 7.1:1 · AAA    |

All ratios verified against WCAG 2.1 SC 1.4.3 (text 4.5:1) and SC 1.4.11 (UI 3:1).

---

## 5. Typography

**Display font:** `Satoshi` (Fontshare). Fallback chain ends at system sans.
**Body font:** same. We use one family at multiple weights — never mix two sans.
**Mono font:** `JetBrains Mono` (Google). For code, UI metadata, and overlines.

Type roles ship as utility classes in `globals.css`. Pair them with Tailwind tokens
(`text-foreground`, `text-muted-foreground`, etc.) for color.

| Class          | Size · line · weight     | Use                            |
| -------------- | ------------------------ | ------------------------------ |
| `type-display` | 48–72 · 1.02 · 800       | Marketing hero only            |
| `type-h1`      | 36–56 · 1.05 · 700       | Page H1                        |
| `type-h2`      | 28–40 · 1.10 · 700       | Section H2                     |
| `type-h3`      | 28      · 1.20 · 700     | Sub-section                    |
| `type-h4`      | 22      · 1.25 · 600     | Card titles                    |
| `type-body-lg` | 18      · 1.55 · 400     | Hero supporting copy           |
| `type-body`    | 16      · 1.55 · 400     | Default paragraph              |
| `type-body-sm` | 14      · 1.50 · 400     | Dense UI / table cells         |
| `type-caption` | 12      · 1.40 · 500     | Footnotes, helper text         |
| `type-label`   | 13      · 1.40 · 600     | Form labels                    |
| `type-button`  | 14      · 1.25 · 600     | Button text                    |
| `type-nav`     | 14      · 1.25 · 500     | Nav links                      |
| `type-code`    | 13      · 1.55 · 400 mono| Code, API examples             |
| `type-overline`| 11 · 1.30 · 500 mono UPPER · 0.16em tracking | Eyebrow labels |

**Rule:** never invent a new font-size inline. If you need a size that isn't on
this scale, you're solving the wrong problem — pick the nearest role.

---

## 6. Spacing, radius, shadows, motion

### Spacing
Tailwind's standard 4-px scale. Use Tailwind utilities (`p-4`, `gap-6`, etc.).
Never use arbitrary spacing like `mt-[19px]` — round to the scale.

| Step | Token              | px  |
| ---- | ------------------ | --- |
| 1    | `--zeph-space-1`   | 4   |
| 2    | `--zeph-space-2`   | 8   |
| 3    | `--zeph-space-3`   | 12  |
| 4    | `--zeph-space-4`   | 16  |
| 6    | `--zeph-space-6`   | 24  |
| 8    | `--zeph-space-8`   | 32  |
| 12   | `--zeph-space-12`  | 48  |
| 16   | `--zeph-space-16`  | 64  |
| 20   | `--zeph-space-20`  | 80  |

### Radius

| Tailwind / Class | Token                  | px   | Use                          |
| ---------------- | ---------------------- | ---- | ---------------------------- |
| `rounded-sm`     | `--zeph-radius-sm`     | 6    | inputs, chips                |
| `rounded-md`     | `--zeph-radius-md`     | 10   | buttons, cards default       |
| `rounded-lg`     | `--zeph-radius-lg`     | 14   | feature cards                |
| `rounded-xl`     | `--zeph-radius-xl`     | 20   | hero blocks, modals          |
| `rounded-2xl`    | `--zeph-radius-2xl`    | 28   | marketing surfaces           |
| `rounded-full`   | `--zeph-radius-full`   | ∞    | pills, avatars, status dots  |

### Shadows

| Tailwind / Class | Use                                    |
| ---------------- | -------------------------------------- |
| `shadow-sm`      | resting cards, default elevation       |
| `shadow-md`      | dropdowns, hovered cards               |
| `shadow-lg`      | modals, popovers, large overlays       |
| `shadow-xl`      | hero callouts (use sparingly)          |
| `shadow-focus`   | focus rings — automatic on focusable elements |

### Motion

- `--zeph-dur-fast` (120ms) — hover/active state changes
- `--zeph-dur` (200ms) — most transitions
- `--zeph-dur-slow` (320ms) — page-level reveals
- Easing: `--zeph-ease` (`cubic-bezier(0.22, 1, 0.36, 1)`) for everything

Respects `prefers-reduced-motion` (cuts to ~0ms).

### Layout

- `--container-7xl` = **1280px** — page max width
- `--zeph-page-padding-x` — responsive horizontal padding (`clamp(1rem, 4vw, 2.5rem)`)
- `--zeph-navbar-h` — **64px** sticky nav height
- `--zeph-section-py` — responsive vertical rhythm between sections

---

## 7. Components

All components live in `components/ui/*` and consume only semantic tokens.

### Button (`<Button>`)

```tsx
<Button>Get started</Button>                        // primary, default
<Button variant="secondary">Learn more</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon"><Icon/></Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Read the docs →</Button>
<Button loading>Saving…</Button>
```

**Variants:** `primary` · `secondary` · `outline` · `ghost` · `destructive` · `link`
**Sizes:** `sm` (32px) · `md` (40px, default) · `lg` (48px) · `icon` (40×40)
**Built-in states:** hover · active (scale 0.98) · focus-visible (3px ring) · disabled · loading

### Card (`<Card>` family)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Workflow</CardTitle>
    <CardDescription>Listens for new tickets, fires automations.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>Run</Button></CardFooter>
</Card>
```

### Input + Label

```tsx
<div className="space-y-1.5">
  <Label htmlFor="email">Work email</Label>
  <Input id="email" type="email" placeholder="you@company.com" />
</div>
```

Use `aria-invalid="true"` to surface a destructive border on validation failure.

### Badge

```tsx
<Badge>New</Badge>
<Badge variant="success">Live</Badge>
<Badge variant="warning">Beta</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="outline">Draft</Badge>
```

### Alert

```tsx
<Alert variant="success">
  <AlertTitle>Workflow saved</AlertTitle>
  <AlertDescription>Run it from the dashboard.</AlertDescription>
</Alert>
```

**Roles:** `destructive` and `warning` render `role="alert"` (announced immediately).
Others use `role="status"` (announced politely).

### Layout — Container & Section

```tsx
<Section density="loose">
  <Container>
    <h1 className="type-display">Hero</h1>
  </Container>
</Section>
```

### Brand — Logo, Mark, Wordmark

```tsx
<ZephlynLogo size={32} />                  // mark + wordmark (default)
<ZephlynLogo size={26} stacked />          // mark above wordmark
<ZephlynLogo size={26} iconOnly />         // mark only
<ZephlynMark size={48} />                  // primitive mark
<ZephlynWordmark size={32} />              // primitive wordmark
```

The mark uses `currentColor` for its lines/dots — set `text-primary`,
`text-foreground`, or `text-purple-200` on the wrapper to recolor it.
The center pulse is `var(--primary)` by default; override with `accent="…"` or `mono`.

### Components we do NOT ship in this foundation (open issue when needed):

- Select / Combobox — wait until a real form needs it; use Radix Select then
- Modal / Dialog — wait until a real flow needs it; use Radix Dialog then
- Tooltip — wait until a real flow needs it; use Radix Tooltip then
- Table — when needed, ship a typed `<DataTable>` wrapper around TanStack Table
- Toast — when needed, ship a `sonner` wrapper

We prefer **adding components when a real screen demands them** over shipping
unused chrome. That keeps the surface small and the bundle lean.

---

## 8. Logo usage

### Primary lockup — when in doubt

`zephlyn-logo-primary.svg` — purple gradient mark on a light background.

### Choose by surface

| Surface           | File                            | Notes                            |
| ----------------- | ------------------------------- | -------------------------------- |
| Light background  | `zephlyn-logo-light.svg`        | Primary gradient mark + ink text |
| Dark background   | `zephlyn-logo-dark.svg`         | Paper mark + paper text          |
| Square / stacked  | `zephlyn-logo-stacked.svg`      | Social, profile pictures         |
| Mark only         | `zephlyn-icon-*.svg`            | Tight slots, favicons            |
| Wordmark only     | `zephlyn-wordmark-*.svg`        | Footer rows, when icon is duplicated |

### Clear space
Minimum padding around the mark = **2× the small dot radius** (i.e., ~13% of mark height).

### Minimum sizes

- Mark only: **16px** (favicons compensate stroke weight internally)
- Lockup: **20px wordmark height** = ~24px mark size

### Do
- Use the mark in `var(--primary)` for the pulse, currentColor for everything else
- Stack only when the slot is genuinely square (social avatars, app icons)
- Keep the lockup horizontal anywhere there's room

### Don't
- Recolor the mark to non-brand colors
- Apply outer drop-shadows
- Skew, rotate, or distort
- Place on a similar-hue purple background without a contrast plate
- Use the icon and the wordmark side-by-side as two separate elements — use `<ZephlynLogo>`

---

## 9. Asset checklist

### Already shipped (in `public/brand/`)

```
logo/
  zephlyn-logo-primary.svg     ✓ horizontal lockup, light bg
  zephlyn-logo-light.svg       ✓ same as primary
  zephlyn-logo-dark.svg        ✓ horizontal lockup, dark bg
  zephlyn-logo-stacked.svg     ✓ mark above wordmark
icons/
  zephlyn-icon.svg             ✓ mark only, gradient
  zephlyn-icon-purple.svg      ✓ mark only, solid purple
  zephlyn-icon-white.svg       ✓ mark only, paper
  zephlyn-icon-mono.svg        ✓ mark only, ink (print/emboss)
  zephlyn-wordmark.svg         ✓ wordmark, ink
  zephlyn-wordmark-purple.svg  ✓ wordmark, purple-700
  zephlyn-wordmark-white.svg   ✓ wordmark, paper
favicon/
  favicon.svg                  ✓ rounded gradient tile (heavier stroke)
  icon-light.svg               ✓ unfilled variant for light browser chrome
social/
  og-image.svg                 ✓ 1200×630
  social-avatar.svg            ✓ 1:1 square
watermark/
  zephlyn-watermark.svg        ✓ subtle in-document watermark
```

### Still to export — PNG/ICO rasters

These need a designer or an automated SVG→PNG step. The SVGs above are the source of truth:

```
favicon/
  favicon.ico            ← 32×32 + 16×16 multi-res ICO
  apple-touch-icon.png   ← 180×180 PNG
  icon-192.png           ← 192×192 PNG (PWA)
  icon-512.png           ← 512×512 PNG (PWA, maskable)
social/
  og-image.png           ← 1200×630 PNG (rasterized og-image.svg)
  twitter-image.png      ← 1200×675 PNG (same comp, slight crop)
  social-avatar.png      ← 1024×1024 PNG
logo/
  zephlyn-logo-*.png     ← 4× PNG variants @ 2× (~2000px wide)
```

**Recommended pipeline:** add a `pnpm export:brand` script using `sharp` or
`resvg-js` that reads each SVG and emits PNGs at the required sizes. Commit
the PNGs so designers and ops people can grab them without running code.

---

## 10. Accessibility

WCAG 2.1 AA is the floor; AAA where it doesn't cost us anything.

- **Text contrast** ≥ 4.5:1 (AA) — most semantic pairs in this system clear AAA
- **Large text & UI** ≥ 3:1 (SC 1.4.3 / 1.4.11)
- **Focus** — every focusable element gets a 3px `--ring` outline via `shadow-focus`. Never remove this.
- **Hover ≠ Focus** — hover state changes background; focus adds the ring. They can coexist.
- **Disabled** — opacity 50% + `pointer-events-none`. Never the only signal — pair with `aria-disabled` or `disabled`.
- **Don't rely on color alone** — pair status badges with an icon or a word ("Live", "Failed").
- **Forms** — every input needs a `<Label htmlFor>` (visible by default).
- **Motion** — global `prefers-reduced-motion` cut to ~0ms.
- **Keyboard** — every interactive element reachable by Tab. No keyboard traps.

---

## 11. Developer rules — do / don't

### ✅ DO

```tsx
<Button>Get started</Button>
<p className="text-muted-foreground type-body-sm">Helper text</p>
<div className="bg-card border border-border rounded-lg p-6">…</div>
<span className="text-primary">Highlight</span>
```

### ❌ DON'T

```tsx
// Hardcoded brand colors:
<button className="bg-[#7c3aed] text-white">…</button>

// Arbitrary font sizes:
<p style={{ fontSize: "17px" }}>…</p>

// Inventing variants on the fly:
<Card className="!bg-purple-500">…</Card>

// Bypassing the Logo primitive:
<img src="/brand/logo/zephlyn-logo-primary.svg" />
```

### Sanity checklist before merging a PR

- [ ] No raw hex codes in TSX (`grep -r "#[0-9A-Fa-f]\{6\}" app components`)
- [ ] No `bg-[...]` / `text-[...]` arbitrary color utilities
- [ ] No `font-size: \d+px` inline styles
- [ ] Every focusable element shows a visible focus ring in both modes
- [ ] Dark mode rendered and screenshotted

---

## 12. Migration & cleanup

When importing this foundation into the existing landing page (or any new repo):

1. **Drop in `app/tokens.css` and `app/globals.css`.** Delete any old brand CSS.
2. **Move existing brand assets** into `public/brand/*` to match the structure above.
3. **Replace hardcoded colors** — search-and-replace common offenders:

   | Old                                | New                          |
   | ---------------------------------- | ---------------------------- |
   | `bg-[#7c3aed]` / `bg-[#5b2be0]`    | `bg-primary`                 |
   | `text-[#ffffff]` on purple bg      | `text-primary-foreground`    |
   | `bg-white` (top-level surface)     | `bg-background`              |
   | `text-gray-500` / `text-zinc-500`  | `text-muted-foreground`      |
   | `border-gray-200`                  | `border-border`              |
   | `bg-gray-50` (inputs)              | `bg-background` or `bg-card` |

4. **Replace one-off buttons** with `<Button>`. Keep the migration honest — if a
   button doesn't fit a variant, propose a new variant in a PR rather than
   forking inline styles.
5. **Adopt `<ZephlynLogo>`** everywhere a logo currently renders. Delete any
   inline `<svg>` or `<img>` of the mark.
6. **Run the contrast audit** on any custom color combinations introduced by
   marketing pages. Tooling: Chrome DevTools accessibility pane.
7. **Don't break the app.** Land cleanup PRs incrementally, one surface at a time.
