/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Export configuration for static hosting
  output: 'standalone',
  
  // Disable static optimization for pages that use router hooks during SSR
  experimental: {
    esmExternals: 'loose'
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      }
    ],
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  
  // Environment variables validation
  env: {
    CUSTOM_BUILD_ENV: process.env.NODE_ENV,
  }
}

module.exports = nextConfig