import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  typescript: {
    // Ensures TypeScript errors fail the build
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Home-directory pnpm-lock.yaml was being inferred as the workspace root,
  // so Next loaded WASM SWC instead of @next/swc-darwin-arm64.
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
