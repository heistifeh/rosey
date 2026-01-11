import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axhkwqaxbnsguxzrfsfj.supabase.co",
      },
    ],
  },
};

export default nextConfig;
