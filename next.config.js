/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,

  // WebAssembly configuration
  webpack: (config) => {
    // Enable both asyncWebAssembly and layers experiments
    config.experiments = {
      asyncWebAssembly: true,
      layers: true  // Add this line to enable layers
    };
    return config;
  },

  // Images configuration
  images: {
    unoptimized: true,
    domains: ['*'], 
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

  // Customize the build directory
  distDir: '.next',

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
