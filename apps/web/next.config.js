/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@docshot/shared', '@docshot/database'],
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