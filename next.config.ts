import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:  [
      {
        protocol: 'http', // Allow images from HTTP sources
        hostname: '**', // Matches any hostname
      },
      {
        protocol: 'https', // Allow images from HTTPS sources
        hostname: '**', // Matches any hostname
      },
    ],
  },
};

export default nextConfig;
