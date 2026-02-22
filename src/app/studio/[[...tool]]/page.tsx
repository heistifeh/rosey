/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import type { Metadata } from "next";
import { NextStudio } from 'next-sanity/studio'
import { viewport as studioViewport } from "next-sanity/studio";
import config from '../../../../sanity.config'
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = 'force-static'

export const viewport = studioViewport;
export const metadata: Metadata = buildPageMetadata({
  title: "Studio | Rosey",
  description: "Internal content studio for Rosey editorial management.",
  path: "/studio",
  noIndex: true,
});

export default function StudioPage() {
  return <NextStudio config={config} />
}
