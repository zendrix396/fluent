import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "slelguoygbfzlpylpxfs.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.scoutos.com",
      },
    ],
  },
};

export default nextConfig;
