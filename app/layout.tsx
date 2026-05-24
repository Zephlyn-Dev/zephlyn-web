import type { Metadata, Viewport } from "next";
import { ThemeProvider, themeBootScript } from "@/components/theme-provider";
import { GsapProvider } from "@/components/gsap-provider";
import "./globals.css";

/**
 * Zephlyn — Root layout
 *
 * Notes for future maintainers:
 * - Satoshi is loaded via Fontshare in <head> below. If you migrate to a
 *   self-hosted/Next-font setup, update `--zeph-font-display` in tokens.css.
 * - The theme boot script runs BEFORE React hydrates, preventing a flash.
 * - All metadata lives here so individual pages only need to override what
 *   actually differs (title template handles per-page titles).
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://zephlyn.io"),
  title: {
    default: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    template: "%s · Zephlyn",
  },
  description:
    "Automation for home service shops drowning in admin work — so leads get answered, estimates move, and sold jobs reach ops cleanly.",
  applicationName: "Zephlyn",
  keywords: [
    "automation",
    "workflow automation",
    "home service",
    "HVAC",
    "field service",
    "ops",
    "Zephlyn",
  ],
  authors: [{ name: "Zephlyn" }],
  creator: "Zephlyn",
  publisher: "Zephlyn",
  openGraph: {
    type: "website",
    siteName: "Zephlyn",
    title: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    description:
      "Automation for home service shops drowning in admin work — so leads get answered, estimates move, and sold jobs reach ops cleanly.",
    url: "https://zephlyn.io",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zephlyn — Less admin. Faster jobs. Cleaner handoffs.",
    description:
      "Automation for home service shops drowning in admin work.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/brand/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/favicon/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAFE" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A0517" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Satoshi via Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap"
          rel="stylesheet"
        />
        {/* JetBrains Mono for code/UI metadata */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Theme boot — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <GsapProvider>{children}</GsapProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
