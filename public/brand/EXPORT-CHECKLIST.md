# Asset export checklist

These PNG/ICO files aren't checked in yet — only the source SVGs are.
Export them when you ship to production. Recommended pipeline: a one-off
script using `sharp` (`pnpm add -D sharp`) reading the SVG sources.

## Required PNG/ICO rasters

| File                                  | Source SVG                              | Size       |
| ------------------------------------- | --------------------------------------- | ---------- |
| `favicon/favicon.ico`                 | `favicon/favicon.svg`                   | 32 + 16 multi-res |
| `favicon/apple-touch-icon.png`        | `favicon/favicon.svg`                   | 180×180    |
| `favicon/icon-192.png`                | `favicon/favicon.svg`                   | 192×192    |
| `favicon/icon-512.png`                | `favicon/favicon.svg`                   | 512×512    |
| `social/og-image.png`                 | `social/og-image.svg`                   | 1200×630   |
| `social/twitter-image.png`            | `social/og-image.svg` (crop)            | 1200×675   |
| `social/social-avatar.png`            | `social/social-avatar.svg`              | 1024×1024  |
| `logo/zephlyn-logo-primary@2x.png`    | `logo/zephlyn-logo-primary.svg`         | 2000×480   |
| `logo/zephlyn-logo-dark@2x.png`       | `logo/zephlyn-logo-dark.svg`            | 2000×480   |
| `logo/zephlyn-logo-light@2x.png`      | `logo/zephlyn-logo-light.svg`           | 2000×480   |
| `logo/zephlyn-logo-stacked@2x.png`    | `logo/zephlyn-logo-stacked.svg`         | 1200×1200  |

## Quick export script

Save as `scripts/export-brand.mjs`:

```js
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = "public/brand";
const jobs = [
  { from: "favicon/favicon.svg",        to: "favicon/apple-touch-icon.png",  w: 180 },
  { from: "favicon/favicon.svg",        to: "favicon/icon-192.png",          w: 192 },
  { from: "favicon/favicon.svg",        to: "favicon/icon-512.png",          w: 512 },
  { from: "social/og-image.svg",        to: "social/og-image.png",           w: 1200, h: 630 },
  { from: "social/social-avatar.svg",   to: "social/social-avatar.png",      w: 1024 },
  { from: "logo/zephlyn-logo-primary.svg",  to: "logo/zephlyn-logo-primary@2x.png",  w: 2000 },
  { from: "logo/zephlyn-logo-dark.svg",     to: "logo/zephlyn-logo-dark@2x.png",     w: 2000 },
  { from: "logo/zephlyn-logo-light.svg",    to: "logo/zephlyn-logo-light@2x.png",    w: 2000 },
  { from: "logo/zephlyn-logo-stacked.svg",  to: "logo/zephlyn-logo-stacked@2x.png",  w: 1200, h: 1200 },
];

for (const j of jobs) {
  const buf = await fs.readFile(path.join(root, j.from));
  const out = sharp(buf, { density: 384 });
  if (j.h) out.resize(j.w, j.h, { fit: "contain", background: { r:0, g:0, b:0, alpha:0 } });
  else     out.resize(j.w);
  await fs.mkdir(path.dirname(path.join(root, j.to)), { recursive: true });
  await out.png().toFile(path.join(root, j.to));
  console.log("✓", j.to);
}
```

Run with: `node scripts/export-brand.mjs`

For `favicon.ico` (multi-res) use `to-ico`:

```js
import toIco from "to-ico";
const buf16 = await sharp("public/brand/favicon/favicon.svg", { density: 96 }).resize(16).png().toBuffer();
const buf32 = await sharp("public/brand/favicon/favicon.svg", { density: 192 }).resize(32).png().toBuffer();
await fs.writeFile("public/brand/favicon/favicon.ico", await toIco([buf16, buf32]));
```
