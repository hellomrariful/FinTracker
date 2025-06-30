/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com', 'avatars.githubusercontent.com', 'media.licdn.com', 'images.unsplash.com']
  },
  trailingSlash: true,
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;