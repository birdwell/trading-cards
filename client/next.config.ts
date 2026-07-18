import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow importing shared helpers from the monorepo root
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
