/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  
  // SEO-friendly redirects
  async redirects() {
    return [
      {
        source: '/course/:slug',
        destination: '/courses/:slug',
        permanent: true,
      },
      {
        source: '/ai-courses',
        destination: '/courses?category=Artificial Intelligence',
        permanent: true,
      },
      {
        source: '/machine-learning-courses',
        destination: '/courses?category=Machine Learning',
        permanent: true,
      },
      {
        source: '/data-science-courses',
        destination: '/courses?category=Data Science',
        permanent: true,
      }
    ]
  },
  
  // Environment variables validation
  env: {
    CUSTOM_BUILD_ENV: process.env.NODE_ENV,
  }
}

module.exports = nextConfig