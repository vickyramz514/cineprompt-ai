import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ensures TypeScript errors fail the build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allows production builds to successfully complete even if project has ESLint errors
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
