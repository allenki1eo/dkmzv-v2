import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ebenezer/api',
    '@ebenezer/db',
    '@ebenezer/shared',
    '@ebenezer/tokens',
  ],
  typedRoutes: true,
};

export default nextConfig;
