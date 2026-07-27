import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → deploys to Cloudflare Pages exactly like the current site.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
