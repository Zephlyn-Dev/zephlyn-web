# Zephlyn — Design System Foundation

A drop-in Next.js 15 + Tailwind v4 + TypeScript design system for the
Zephlyn brand. Everything in this folder is **production-ready**.

> **Read [`docs/brand-system.md`](./docs/brand-system.md) first.** It is the
> single source of truth for tokens, components, and developer rules.

## What's inside

```
zephlyn-design-system/
├─ app/
│  ├─ tokens.css            ← primitive design tokens (raw brand values)
│  ├─ globals.css           ← Tailwind v4 setup + semantic tokens (light + dark)
│  ├─ layout.tsx            ← root layout with metadata, fonts, theme provider
│  ├─ page.tsx              ← demo landing page using only the system
│  ├─ icon.svg              ← Next.js favicon convention (SVG)
│  └─ apple-icon.svg        ← Apple touch icon (SVG)
├─ components/
│  ├─ brand/
│  │  └─ logo.tsx           ← <ZephlynLogo>, <ZephlynMark>, <ZephlynWordmark>
│  ├─ ui/
│  │  ├─ button.tsx         ← <Button> · 6 variants · 4 sizes · loading state
│  │  ├─ card.tsx           ← <Card> family (Header, Title, Description, …)
│  │  ├─ input.tsx          ← <Input> + <Label>
│  │  ├─ badge.tsx          ← <Badge> · 7 variants
│  │  ├─ alert.tsx          ← <Alert> family · 5 variants · ARIA-aware
│  │  └─ container.tsx      ← <Container>, <Section>
│  ├─ theme-provider.tsx    ← Light / Dark / System with no-flash boot
│  └─ theme-toggle.tsx      ← 3-state segmented control
├─ lib/
│  └─ cn.ts                 ← className helper (clsx + tailwind-merge)
├─ public/
│  ├─ brand/
│  │  ├─ logo/              ← 4× horizontal & stacked lockups (SVG)
│  │  ├─ icons/             ← 4× mark variants + 3× wordmark variants
│  │  ├─ favicon/           ← favicon.svg + variants
│  │  ├─ social/            ← og-image.svg, social-avatar.svg
│  │  ├─ watermark/         ← subtle in-document watermark
│  │  └─ EXPORT-CHECKLIST.md← list of PNG/ICO rasters still to export
│  └─ manifest.webmanifest  ← PWA manifest
├─ docs/
│  └─ brand-system.md       ← full design system documentation
├─ tailwind.config.ts       ← v3 alternative (v4 users ignore — use globals.css)
├─ postcss.config.mjs       ← Tailwind v4 PostCSS plugin
├─ tsconfig.json            ← @ alias mapped to repo root
├─ next.config.ts
└─ package.json
```

## Quick start (new repo)

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000> — you'll see the demo landing page with
the light/dark toggle in the nav. Toggle it to verify both modes work end-to-end.

## Adopting into an existing repo

1. **Copy `app/tokens.css` and `app/globals.css`** into your project's `app/` directory.
   Replace any existing `globals.css` (back it up first).
2. **Copy `public/brand/`** wholesale.
3. **Copy `components/brand/`, `components/ui/`, `components/theme-*`, `lib/cn.ts`.**
4. **Add deps:** `pnpm add clsx tailwind-merge` and (if not already) `pnpm add -D tailwindcss@^4 @tailwindcss/postcss`.
5. **Wrap `<body>` in `<ThemeProvider>`** and add the inline boot script per `app/layout.tsx`.
6. **Import the fonts** in `<head>` per the same file (Satoshi + JetBrains Mono).
7. **Run the cleanup pass** described in `docs/brand-system.md §12`.

## Rules (the short version)

- Components consume **semantic** tokens only — never raw `--zeph-*` primitives.
- Never write a hex code in TSX.
- Never use arbitrary Tailwind values for color (`bg-[#…]`) or font-size (`text-[19px]`).
- Every focusable element must show a focus ring in both modes.
- Light + dark are both first-class — verify every screen in both.

The long version lives in `docs/brand-system.md`.

## What's intentionally NOT here

We ship the floor, not the ceiling:

- No `<Select>`, `<Modal>`, `<Tooltip>`, `<Toast>`, or `<Table>` until a real
  screen needs them. When that happens, wrap Radix Primitives or TanStack Table
  and add a typed component to `components/ui/*`.
- No `class-variance-authority` dependency — variants live as plain `Record<>`
  maps. If a component grows past 4 variants × 3 sizes, swap in `cva`.
- No theming abstractions beyond light / dark / system. If you need
  multi-tenant theming later, override `--primary` + friends per tenant via a
  scoped `class` on a wrapper.

## Verifying the brand

The exploration canvas (`Zephlyn Echo.html` in the parent project) shows every
mark variation, palette option, and typography candidate — keep it as a
reference when designing new surfaces.
