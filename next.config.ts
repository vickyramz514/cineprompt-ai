import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ensures TypeScript errors fail the build
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
