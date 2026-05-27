import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
