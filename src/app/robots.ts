import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*", "/profile/*", "/escorts/*", "/locations"],
        disallow: [
          "/dashboard",
          "/manage-pictures",
          "/login",
          "/create-account",
          "/setup-account",
          "/verify-identity",
          "/general-information",
          "/upload-pictures",
          "/rates",
          "/profile-setup",
          "/scan-qr",
          "/take-photo",
          "/capture-photo",
          "/upload-id",
          "/enable-2fa",
          "/confirm-code",
          "/enter-otp",
          "/forgot-password",
          "/reset-password",
          "/search",
          "/auth",
          "/auth/*",
          "/studio",
          "/studio/*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
