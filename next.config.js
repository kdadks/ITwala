/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Export configuration for static hosting
  output: 'standalone',
  
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