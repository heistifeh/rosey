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
      {
        protocol: "https",
        hostname: "pub-7036c096d6f946e78a509a42a702bd0b.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
