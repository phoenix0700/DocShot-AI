/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@docshot/ui'],
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
