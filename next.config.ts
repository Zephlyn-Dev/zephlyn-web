import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19 + Next 16 View Transitions API. Lets us morph and slide
    // between routes natively in the browser — see
    // components/transitions/page-transition.tsx and globals.css §6.9.
    viewTransition: true,
  },
};

export default nextConfig;
