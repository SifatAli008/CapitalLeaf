import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  env: {
    NODE_ENV: 'production'
  }
};

export default nextConfig;
