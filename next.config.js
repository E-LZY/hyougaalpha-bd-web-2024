/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  distDir: 'dist', // Add this line
}

module.exports = nextConfig
