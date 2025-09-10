/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Disable source maps in development to avoid extension conflicts
  productionBrowserSourceMaps: false,
  // Configure webpack to handle extension conflicts
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable source maps in development to prevent extension conflicts
      config.devtool = false;
    }
    return config;
  },
  // ESLint configuration for build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration for build
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
