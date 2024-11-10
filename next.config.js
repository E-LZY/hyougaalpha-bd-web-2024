/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Changed from 'out' to 'export'
  reactStrictMode: true,

  // WebAssembly configuration
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };
    return config;
  },

  // Images configuration
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Static export configurations
  trailingSlash: true,

  // Disable powered by header
  poweredByHeader: false,

  // Remove distDir configuration as it conflicts with static export
  // distDir: '.next', // Remove this line

  // Enable compression
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Dev specific configs
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // Strict mode for better development
  typescript: {
    ignoreBuildErrors: false,
  },

  // Environment configuration
  env: {
    customKey: 'customValue',
  },

  // Enable SWC minification
  swcMinify: true,

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
