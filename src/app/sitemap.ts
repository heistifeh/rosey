import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { absoluteUrl } from "@/lib/seo";
import { canonicalizeCountrySlug } from "@/lib/location-slugs";

type SitemapProfileRow = {
  username?: string | null;
  country_slug?: string | null;
  state_slug?: string | null;
  city_slug?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

const DEFAULT_SUPABASE_URL = "https://axhkwqaxbnsguxzrfsfj.supabase.co";
const trimTrailingSlash = (value?: string) => value?.replace(/\/$/, "");
const baseFromAuth = (value?: string) => value?.replace(/\/auth\/v1\/?$/, "");
const SUPABASE_URL =
  trimTrailingSlash(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  trimTrailingSlash(baseFromAuth(process.env.NEXT_PUBLIC_BASE_URL)) ||
  DEFAULT_SUPABASE_URL;
const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;

const PUBLIC_STATIC_ROUTES = [
  "/",
  "/locations",
  "/blog",
  "/advertisement",
  "/faq",
  "/help-support",
  "/escort-terms",
  "/report-trafficking",
  "/terms",
  "/privacy-policy",
  "/legal-notices",
];

const toDate = (value?: string | null, fallback?: Date) => {
  if (!value) {
    return fallback ?? new Date();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? (fallback ?? new Date()) : parsed;
};

const getSupabaseHeaders = (): HeadersInit | null => {
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    Accept: "application/json",
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  };
};

const fetchApprovedProfileRows = async (): Promise<SitemapProfileRow[]> => {
  const headers = getSupabaseHeaders();
  if (!headers) {
    return [];
  }

  const batchSize = 1000;
  const rows: SitemapProfileRow[] = [];

  for (let offset = 0; offset < 50_000; offset += batchSize) {
    const params = new URLSearchParams({
      select: "username,country_slug,state_slug,city_slug,updated_at,created_at",
      approval_status: "eq.approved",
      onboarding_completed: "eq.true",
      username: "not.is.null",
      limit: String(batchSize),
      offset: String(offset),
      order: "updated_at.desc.nullslast,created_at.desc.nullslast",
    });

    try {
      const response = await fetch(`${SUPABASE_REST_URL}/profiles?${params.toString()}`, {
        headers,
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        break;
      }

      const batch = (await response.json()) as SitemapProfileRow[];
      if (!Array.isArray(batch) || batch.length === 0) {
        break;
      }

      rows.push(...batch);

      if (batch.length < batchSize) {
        break;
      }
    } catch {
      break;
    }
  }

  return rows;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  let locationEntries: MetadataRoute.Sitemap = [];
  let profileEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await client.fetch<Post[]>(postsQuery);
    blogEntries = posts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post._updatedAt || post.publishedAt || post._createdAt || now),
        changeFrequency: "weekly",
        priority: 0.75,
      }));
  } catch {
    blogEntries = [];
  }

  try {
    const profileRows = await fetchApprovedProfileRows();
    const seenUsernames = new Set<string>();
    const locationLatest = new Map<string, Date>();

    for (const row of profileRows) {
      const username = row.username?.trim();
      if (username && !seenUsernames.has(username)) {
        seenUsernames.add(username);
        profileEntries.push({
          url: absoluteUrl(`/profile/${encodeURIComponent(username)}`),
          lastModified: toDate(row.updated_at || row.created_at, now),
          changeFrequency: "weekly",
          priority: 0.65,
        });
      }

      const countrySlug = canonicalizeCountrySlug(row.country_slug);
      const citySlug = row.city_slug?.trim();
      const stateSlug = row.state_slug?.trim() || undefined;

      if (!countrySlug || !citySlug) {
        continue;
      }

      const path = stateSlug
        ? `/escorts/${countrySlug}/${stateSlug}/${citySlug}`
        : `/escorts/${countrySlug}/${citySlug}`;
      const entryDate = toDate(row.updated_at || row.created_at, now);
      const existingDate = locationLatest.get(path);

      if (!existingDate || entryDate > existingDate) {
        locationLatest.set(path, entryDate);
      }
    }

    locationEntries = Array.from(locationLatest.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, lastModified]) => ({
        url: absoluteUrl(path),
        lastModified,
        changeFrequency: "daily",
        priority: 0.85,
      }));
  } catch {
    locationEntries = [];
    profileEntries = [];
  }

  return [...staticEntries, ...locationEntries, ...profileEntries, ...blogEntries];
}
