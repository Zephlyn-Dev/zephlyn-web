import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
};

export default config;
