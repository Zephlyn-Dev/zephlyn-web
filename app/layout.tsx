import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { GsapProvider } from "@/components/gsap-provider";
import { cn } from "@/lib/cn";
import "./globals.css";

/**
 * Zephlyn — Root layout
 *
 * Notes for future maintainers:
 * - Plus Jakarta Sans (display + body) and JetBrains Mono (overlines / code)
 *   are self-hosted and optimized via next/font/google — no raw <link> to
 *   Google Fonts, so there's no render-blocking request and no layout shift.
 *   Their CSS variables are wired into `--zeph-font-*` in tokens.css.
 * - The site is DARK-ONLY by design (the space-flight background is a dark
 *   aesthetic): `dark` is hardcoded on <html>, there is no theme toggle or
 *   provider. Light-mode tokens still exist in globals.css but are unreachable.
 * - All metadata lives here so individual pages only need to override what
 *   actually differs (title template handles per-page titles).
 */

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jb-mono",
  display: "swap",
});

const SITE_TITLE = "Zephlyn: Your business, finally running itself.";
const SITE_DESCRIPTION =
  "For small businesses still running on memory, sticky notes, and missed calls. Zephlyn connects your scattered tools and tasks into one flow that runs without you.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zephlyn.io"),
  title: {
    default: SITE_TITLE,
    template: "%s · Zephlyn",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Zephlyn",
  keywords: [
    "automation",
    "productized automation",
    "small business automation",
    "workflow automation",
    "booking automation",
    "Zephlyn",
  ],
  authors: [{ name: "Zephlyn" }],
  creator: "Zephlyn",
  publisher: "Zephlyn",
  openGraph: {
    type: "website",
    siteName: "Zephlyn",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://zephlyn.io",
    locale: "en_US",
    images: [
      {
        // NOTE: og-image.png still renders the old "Less admin / Faster jobs"
        // tagline — regenerate from public/og-image-source.svg to match.
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zephlyn: Your business, finally running itself.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
  themeColor: "#0A0517",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(jakarta.variable, jetbrainsMono.variable, "dark")}
    >
      <body className="bg-background text-foreground antialiased">
        <GsapProvider>{children}</GsapProvider>
      </body>
    </html>
  );
}
