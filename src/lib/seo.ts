import type { Metadata } from "next";

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

export const SITE_NAME = "Rosey";
export const SITE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://rosey.link",
);
export const SITE_TWITTER_HANDLE = "@rosey_link";
export const DEFAULT_OG_IMAGE_PATH = "/images/hero-bg.png";
export const DEFAULT_DESCRIPTION =
  "Discover independent adult companions with detailed profiles, real-time availability, and location-based search on Rosey.";

export const CORE_SEO_KEYWORDS = [
  "independent companions",
  "escort directory",
  "adult companions",
  "city escort listings",
  "verified profiles",
  "available now companions",
  "discreet bookings",
];

export const absoluteUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
};

const resolveImageUrl = (path?: string) => {
  if (!path) return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path);
};

const normalizeMetaDescription = (value: string) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 170) {
    return normalized;
  }

  const sliced = normalized.slice(0, 167);
  const lastSpace = sliced.lastIndexOf(" ");
  const safe = lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced;
  return `${safe.trimEnd()}...`;
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  imagePath?: string;
  type?: "website" | "article";
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  imagePath,
  type = "website",
}: PageMetadataOptions): Metadata => {
  const canonical = absoluteUrl(path);
  const image = resolveImageUrl(imagePath);
  const safeDescription = normalizeMetaDescription(description);

  return {
    title,
    description: safeDescription,
    keywords: keywords && keywords.length > 0 ? keywords : CORE_SEO_KEYWORDS,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: safeDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDescription,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            nosnippet: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
};
