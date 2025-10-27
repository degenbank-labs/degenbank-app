import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.degenbank.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
