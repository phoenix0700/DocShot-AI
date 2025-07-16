/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@docshot/shared', '@docshot/database'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/docshot-screenshots/**',
      },
    ],
  },
};

module.exports = nextConfig;