import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { absoluteUrl } from "@/lib/seo";

const PUBLIC_STATIC_ROUTES = [
  "/",
  "/locations",
  "/blog",
  "/faq",
  "/help-support",
  "/escort-terms",
  "/report-trafficking",
  "/terms",
  "/privacy-policy",
  "/legal-notices",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];

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

  return [...staticEntries, ...blogEntries];
}
