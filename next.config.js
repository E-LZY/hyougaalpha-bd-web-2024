/** @type {import('next/dist').NextConfig} */
const nextConfig = {
  output: 'export',  // This tells Next.js to export static files
  images: {
    unoptimized: true,  // Required for static export
  },
}

module.exports = nextConfig
