/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'dist', // Add this line
}

module.exports = nextConfig
