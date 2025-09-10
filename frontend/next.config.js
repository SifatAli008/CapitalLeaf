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
  // Vercel optimization - removed standalone for better compatibility
};

module.exports = nextConfig;
