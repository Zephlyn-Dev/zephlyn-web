/**
 * Zephlyn — Tailwind v3 config (alternative)
 *
 * Use this only if your project is on Tailwind v3.
 * For Tailwind v4 (recommended), use `src/styles/globals.css` instead —
 * its `@theme` block handles all of this CSS-first.
 *
 * Drop into project root as `tailwind.config.ts` and import
 * `src/styles/tokens.css` + a v3-compatible `globals.css` (semantic vars only).
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "var(--zeph-page-padding-x)",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Semantic — components consume these
        background:            "var(--background)",
        foreground:            "var(--foreground)",
        card: {
          DEFAULT:             "var(--card)",
          foreground:          "var(--card-foreground)",
        },
        popover: {
          DEFAULT:             "var(--popover)",
          foreground:          "var(--popover-foreground)",
        },
        primary: {
          DEFAULT:             "var(--primary)",
          foreground:          "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:             "var(--secondary)",
          foreground:          "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:             "var(--muted)",
          foreground:          "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:             "var(--accent)",
          foreground:          "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT:             "var(--destructive)",
          foreground:          "var(--destructive-foreground)",
        },
        success: {
          DEFAULT:             "var(--success)",
          foreground:          "var(--success-foreground)",
        },
        warning: {
          DEFAULT:             "var(--warning)",
          foreground:          "var(--warning-foreground)",
        },
        info: {
          DEFAULT:             "var(--info)",
          foreground:          "var(--info-foreground)",
        },
        border:                "var(--border)",
        input:                 "var(--input)",
        ring:                  "var(--ring)",

        // Primitive purple ramp — for charts, illustrations, edge cases.
        // Prefer semantic tokens above for normal UI.
        purple: {
          50:  "var(--zeph-purple-50)",
          100: "var(--zeph-purple-100)",
          200: "var(--zeph-purple-200)",
          300: "var(--zeph-purple-300)",
          400: "var(--zeph-purple-400)",
          500: "var(--zeph-purple-500)",
          600: "var(--zeph-purple-600)",
          700: "var(--zeph-purple-700)",
          800: "var(--zeph-purple-800)",
          900: "var(--zeph-purple-900)",
          950: "var(--zeph-purple-950)",
        },
      },
      borderRadius: {
        sm:   "var(--zeph-radius-sm)",
        md:   "var(--zeph-radius-md)",
        lg:   "var(--zeph-radius-lg)",
        xl:   "var(--zeph-radius-xl)",
        "2xl":"var(--zeph-radius-2xl)",
      },
      boxShadow: {
        sm:    "var(--zeph-shadow-sm)",
        md:    "var(--zeph-shadow-md)",
        lg:    "var(--zeph-shadow-lg)",
        xl:    "var(--zeph-shadow-xl)",
        focus: "var(--zeph-shadow-focus)",
      },
      fontFamily: {
        display: ["var(--zeph-font-display)"],
        sans:    ["var(--zeph-font-body)"],
        mono:    ["var(--zeph-font-mono)"],
      },
      transitionTimingFunction: {
        zeph: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        DEFAULT: "200ms",
        slow: "320ms",
      },
    },
  },
  plugins: [],
};

export default config;
