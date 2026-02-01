import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Silence Next.js 16 warning for custom webpack with Turbopack default
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
