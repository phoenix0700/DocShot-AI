/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@docshot/shared', '@docshot/database'],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;