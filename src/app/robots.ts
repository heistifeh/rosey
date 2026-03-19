import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api",
          "/api/*",
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/manage-pictures",
          "/manage-pictures/*",
          "/setup-account",
          "/claim-profile",
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
          "/set-password",
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
