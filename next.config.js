/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com', 'avatars.githubusercontent.com', 'media.licdn.com', 'images.unsplash.com']
  },
  // Remove trailingSlash requirement to fix API routing issues
  trailingSlash: false,
};

module.exports = nextConfig;