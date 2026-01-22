import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axhkwqaxbnsguxzrfsfj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "media-v2.tryst.a4cdn.org",
      },
    ],
  },
};

export default nextConfig;
