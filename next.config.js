/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Use in-memory caching for development to avoid file system issues
    if (dev && !isServer) {
      config.cache = {
        type: 'memory'
      }
    }
    return config
  },
};

module.exports = nextConfig;