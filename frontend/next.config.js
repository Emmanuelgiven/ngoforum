/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove basePath to serve from root
  // output: 'export', // Disabled for development - enable for static build
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api',
  },
}

module.exports = nextConfig
