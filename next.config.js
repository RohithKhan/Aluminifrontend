/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Disable streaming SSR for static export
    serverActions: false,
  },
  // Increase timeout for build process
  staticPageGenerationTimeout: 120,
  // Add webpack configuration to optimize development experience
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize development performance
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;