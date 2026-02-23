import type { Metadata } from "next";
import ProfilePageClient from "./profile-page-client";
import {
  CORE_SEO_KEYWORDS,
  SITE_URL,
  absoluteUrl,
  buildPageMetadata,
} from "@/lib/seo";

type ProfileRouteProps = {
  params: Promise<{ id: string }>;
};

type ProfileSeoData = {
  username?: string;
  working_name?: string;
  tagline?: string;
  about?: string;
  city?: string;
  state?: string;
  country?: string;
  city_slug?: string;
  state_slug?: string;
  country_slug?: string;
  approval_status?: string;
  onboarding_completed?: boolean;
  images?: { public_url?: string; is_primary?: boolean }[];
};

const DEFAULT_SUPABASE_URL = "https://axhkwqaxbnsguxzrfsfj.supabase.co";

const trimTrailingSlash = (value?: string) => value?.replace(/\/$/, "");
const baseFromAuth = (value?: string) => value?.replace(/\/auth\/v1\/?$/, "");

const SUPABASE_URL =
  trimTrailingSlash(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  trimTrailingSlash(baseFromAuth(process.env.NEXT_PUBLIC_BASE_URL)) ||
  DEFAULT_SUPABASE_URL;

const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;

const normalizeUsername = (raw: string) => {
  let value = raw;
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep raw value if decoding fails.
  }
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
};

const fetchProfileSeoData = async (
  username: string,
): Promise<ProfileSeoData | null> => {
  if (!username) return null;

  const params = new URLSearchParams({
    select:
      "username,working_name,tagline,about,city,state,country,city_slug,state_slug,country_slug,approval_status,onboarding_completed,images(public_url,is_primary)",
    username: `eq.${username}`,
    approval_status: "eq.approved",
    onboarding_completed: "eq.true",
    limit: "1",
  });

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  try {
    const response = await fetch(`${SUPABASE_REST_URL}/profiles?${params}`, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProfileSeoData[];
    return data?.[0] ?? null;
  } catch {
    return null;
  }
};

const primaryImageUrl = (images?: { public_url?: string; is_primary?: boolean }[]) => {
  if (!images || images.length === 0) return undefined;
  return (
    images.find((image) => image.is_primary)?.public_url ||
    images[0]?.public_url ||
    undefined
  );
};

export async function generateMetadata({
  params,
}: ProfileRouteProps): Promise<Metadata> {
  const { id } = await params;
  const normalizedUsername = normalizeUsername(id);
  const profile = await fetchProfileSeoData(normalizedUsername);

  if (!profile) {
    return buildPageMetadata({
      title: "Profile Not Found | Rosey",
      description: "The profile you are looking for is unavailable or does not exist.",
      path: `/profile/${normalizedUsername || id}`,
      noIndex: true,
    });
  }

  const displayName = profile.working_name || profile.username || "Provider";
  const canonicalUsername = profile.username || normalizedUsername;
  const location = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");
  const title = location
    ? `${displayName} in ${location} | Rosey`
    : `${displayName} | Rosey`;
  const description =
    profile.tagline ||
    profile.about ||
    (location
      ? `View ${displayName}'s profile in ${location}, including availability, rates, and contact details.`
      : `View ${displayName}'s profile, rates, and availability on Rosey.`);

  return buildPageMetadata({
    title,
    description,
    path: `/profile/${canonicalUsername}`,
    imagePath: primaryImageUrl(profile.images) || "/placeholder.png",
    keywords: [
      ...CORE_SEO_KEYWORDS,
      displayName,
      location,
      "provider profile",
      "escort profile",
    ].filter(Boolean),
  });
}

export default async function ProfilePage({ params }: ProfileRouteProps) {
  const { id } = await params;
  const normalizedUsername = normalizeUsername(id);
  const profile = await fetchProfileSeoData(normalizedUsername);
  const displayName = profile?.working_name || profile?.username || "Provider";
  const profileUsername = profile?.username || normalizedUsername || id;
  const profileUrl = absoluteUrl(`/profile/${encodeURIComponent(profileUsername)}`);
  const profileImage = primaryImageUrl(profile?.images) || absoluteUrl("/placeholder.png");
  const locationLabel = [profile?.city, profile?.state, profile?.country]
    .filter(Boolean)
    .join(", ");
  const locationPagePath =
    profile?.country_slug && profile?.city_slug
      ? `/escorts/${profile.country_slug}${
          profile.state_slug ? `/${profile.state_slug}` : ""
        }/${profile.city_slug}`
      : undefined;
  const profileJsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfilePage",
            "@id": `${profileUrl}#webpage`,
            url: profileUrl,
            name: `${displayName} | Rosey`,
            isPartOf: {
              "@id": `${SITE_URL}/#website`,
            },
            mainEntity: {
              "@id": `${profileUrl}#person`,
            },
            breadcrumb: {
              "@id": `${profileUrl}#breadcrumb`,
            },
          },
          {
            "@type": "Person",
            "@id": `${profileUrl}#person`,
            name: displayName,
            description: profile.tagline || profile.about || undefined,
            image: [profileImage],
            url: profileUrl,
            homeLocation: locationLabel
              ? {
                  "@type": "Place",
                  name: locationLabel,
                }
              : undefined,
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${profileUrl}#breadcrumb`,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
              ...(locationPagePath
                ? [
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "City Listings",
                      item: absoluteUrl(locationPagePath),
                    },
                  ]
                : []),
              {
                "@type": "ListItem",
                position: locationPagePath ? 3 : 2,
                name: displayName,
                item: profileUrl,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      <ProfilePageClient params={Promise.resolve({ id })} />
      {profileJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
        />
      ) : null}
    </>
  );
}
