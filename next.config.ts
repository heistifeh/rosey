import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /search?country=X&state=Y&city=Z → /escorts/X/Y/Z
      {
        source: "/search",
        has: [
          { type: "query", key: "country", value: "(?<country>.+)" },
          { type: "query", key: "state", value: "(?<state>.+)" },
          { type: "query", key: "city", value: "(?<city>.+)" },
        ],
        destination: "/escorts/:country/:state/:city",
        permanent: true,
      },
      // /search?country=X&city=Z (no state) → /escorts/X/Z
      {
        source: "/search",
        has: [
          { type: "query", key: "country", value: "(?<country>.+)" },
          { type: "query", key: "city", value: "(?<city>.+)" },
        ],
        missing: [{ type: "query", key: "state" }],
        destination: "/escorts/:country/:city",
        permanent: true,
      },
      // /search?country=X (no state, no city) → /escorts/X
      {
        source: "/search",
        has: [
          { type: "query", key: "country", value: "(?<country>.+)" },
        ],
        missing: [
          { type: "query", key: "state" },
          { type: "query", key: "city" },
        ],
        destination: "/escorts/:country",
        permanent: true,
      },
    ];
  },
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
