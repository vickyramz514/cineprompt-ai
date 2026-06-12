import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Monorepo: avoid Next picking ~/pnpm-lock.yaml as workspace root
  outputFileTracingRoot: path.join(process.cwd(), ".."),
};

export default nextConfig;
