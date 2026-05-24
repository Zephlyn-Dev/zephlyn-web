# Zephlyn — Link preview / Open Graph metadata

**For:** Claude Code
**Scope:** `app/layout.tsx` (or wherever the root `metadata` export lives), `public/` directory for the image asset
**Goal:** Fix the link preview card that appears when `zephlyn.io` is shared in iMessage, Slack, WhatsApp, X, LinkedIn, etc. Currently the preview shows the page title and URL but no image — falling back to a generic browser icon. Add proper Open Graph and Twitter Card metadata, plus a 1200×630 OG image.

---

## Context

When someone pastes the site URL into a chat or social platform, the platform fetches the page's `<meta>` tags to build a preview card. The current preview shows:

- Title: `Less admin. Faster jobs. Cleaner handoffs.` ✓
- URL: `zephlyn.io` ✓
- Image: generic fallback (browser/compass icon) ✗

The fix is two parts: (1) add Open Graph + Twitter Card metadata via Next.js's `metadata` export, and (2) generate a 1200×630 PNG OG image and place it at `public/og-image.png`.

---

## 1. Metadata edits

This site is on Next 16 App Router (per `AGENTS.md`), so metadata is set via the `metadata` export in `app/layout.tsx` rather than raw `<meta>` tags.

**Locate the existing `metadata` export** in `app/layout.tsx`. It likely already has `title` and `description`. Extend it to include `openGraph` and `twitter` keys.

**Target shape:**

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://zephlyn.io"),
  title: {
    default: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    template: "%s · Zephlyn",
  },
  description:
    "Automation for home service shops drowning in admin work — so leads get answered, estimates move, and sold jobs reach ops cleanly.",
  openGraph: {
    title: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    description:
      "Automation for home service shops drowning in admin work — so leads get answered, estimates move, and sold jobs reach ops cleanly.",
    url: "https://zephlyn.io",
    siteName: "Zephlyn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    description: "Automation for home service shops drowning in admin work.",
    images: ["/og-image.png"],
  },
};
```

**Notes for the edit:**

- **`metadataBase`** — set this to `new URL("https://zephlyn.io")`. Without it, the `images` URL has to be absolute everywhere; with it, relative paths like `/og-image.png` resolve correctly. If the existing file already imports a URL or env var for the base, reuse it instead of hardcoding.
- **`title.template`** — `"%s · Zephlyn"` makes any subpage that sets its own `title` automatically render as `Page Name · Zephlyn`. The homepage uses `title.default`.
- **Preserve any existing keys** — if the current `metadata` export has other properties (icons, robots, manifest, etc.), keep them. Only add/edit `metadataBase`, `title`, `description`, `openGraph`, `twitter`.
- **Don't introduce a `viewport` export from `metadata`** — in App Router, viewport is its own export now. If the file currently has viewport settings inside `metadata`, leave them where they are; don't refactor.
- **Per AGENTS.md:** the marketing email is `social@zephlyn.io` and the marketing domain in the codebase is `zephlyn.ai`. **Use `zephlyn.io`** for OG metadata since that's the live domain (confirmed by the user's screenshot of the link preview). If the existing metadata already references `zephlyn.ai`, flag this to the user in the diff summary rather than silently changing it — there may be a domain-config reason for the discrepancy.

---

## 2. OG image asset

**Required:**

- **Path:** `public/og-image.png`
- **Dimensions:** exactly 1200 × 630 pixels (the OG standard 1.91:1 ratio)
- **Format:** PNG (not SVG — many platforms including iMessage, Slack, and LinkedIn don't render SVG previews reliably)
- **File size:** under 1 MB, ideally under 500 KB
- **Safe zone:** important content centered within the inner 1000 × 524 px area (some platforms crop edges, particularly on mobile)

**Design content:**
The image should match the existing brand. Use the same tokens that drive the site:

- Background: light surface matching the site's light theme (the `--background` semantic token or equivalent — pull from `globals.css` if needed)
- Wordmark: `Zephlyn` in the site's display font, positioned upper-left or centered
- Headline: `Less admin. Faster jobs. Cleaner handoffs.` — with `Cleaner handoffs.` in the brand purple (`--primary` or `--zeph-purple-700`), matching the hero's color treatment
- Optional accent: one of the ambient wave lines that appears on the hero, for visual continuity

**If you cannot generate a PNG directly in this environment:**

1. Create the image as an SVG first (so the user has a source file) at `public/og-image-source.svg`, sized 1200×630 with the design above
2. Add a `README.md` note to `public/` or a comment in `app/layout.tsx` telling the user the SVG needs to be exported to PNG before deploy
3. Recommended export tools: Figma (paste SVG → export PNG 1×), or `sharp` CLI (`npx sharp -i og-image-source.svg -o og-image.png resize 1200 630`)

**Preferred alternative:** if Next.js's `ImageResponse` API is available in this version (it is in 16), generate the OG image programmatically. Create `app/og-image/route.tsx` that returns an `ImageResponse` with the design content. This way the image is always in sync with the site's design tokens. But: programmatic OG is only worth doing if it works on the first try. If it errors, fall back to the static SVG → PNG path. Don't spend more than one attempt on the programmatic version.

---

## 3. Verify before claiming done

After making changes:

1. **Run `next build`** locally if possible — App Router metadata errors show up at build time, not runtime
2. **Visual check** — run `next dev`, visit `view-source:http://localhost:3000`, confirm the rendered HTML includes:
   - `<meta property="og:title" content="Zephlyn — Less admin. Faster jobs. Cleaner handoffs." />`
   - `<meta property="og:image" content="https://zephlyn.io/og-image.png" />` (absolute URL — this is what `metadataBase` does for you)
   - `<meta property="og:description" content="..." />`
   - `<meta name="twitter:card" content="summary_large_image" />`
   - `<meta name="twitter:image" content="..." />`
3. **File check** — confirm `public/og-image.png` exists and is a valid PNG (file command or just `file public/og-image.png` showing `PNG image data, 1200 x 630`)

---

## Things to NOT change

- Existing `<head>` content that isn't metadata-related
- Favicon, icon, or manifest setup unless they're explicitly broken
- The `viewport` export
- Any other page's metadata — this brief only touches the root layout
- Visual design tokens, fonts, components

---

## Post-deploy verification (for the user, not Claude Code)

After this change ships to production:

- **iMessage / Slack / WhatsApp:** paste `https://zephlyn.io` into a chat with yourself. Should show the new image. Note that previews are cached aggressively per-recipient — deleting and re-sending may be needed.
- **Facebook / LinkedIn:** [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug) → enter URL → click "Scrape Again" to force cache refresh.
- **X / Twitter:** post the URL in a draft tweet to preview.

---

## Order of operations

1. Edit `app/layout.tsx` to extend the `metadata` export
2. Create `public/og-image.png` (or `og-image-source.svg` + export note if PNG generation isn't possible)
3. Run `next build` to catch any metadata errors
4. Output a diff summary listing: files changed, image dimensions/size, any flags for the user (e.g. domain discrepancy if found)
5. Stop. Hand back for review and deploy.
