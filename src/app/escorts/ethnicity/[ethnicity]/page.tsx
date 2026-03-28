import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EthnicityPageClient } from "./ethnicity-page-client";
import { absoluteUrl } from "@/lib/seo";
import { ETHNICITY_META } from "@/lib/ethnicity-meta";

export function generateStaticParams() {
  return Object.keys(ETHNICITY_META).map((ethnicity) => ({ ethnicity }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ethnicity: string }>;
}): Promise<Metadata> {
  const { ethnicity } = await params;
  const meta = ETHNICITY_META[ethnicity];
  if (!meta) return {};

  const url = absoluteUrl(`/escorts/ethnicity/${ethnicity}`);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function EthnicityPage({
  params,
}: {
  params: Promise<{ ethnicity: string }>;
}) {
  const { ethnicity } = await params;
  const meta = ETHNICITY_META[ethnicity];
  if (!meta) notFound();

  return (
    <Suspense fallback={null}>
      <EthnicityPageClient ethnicity={ethnicity} label={meta.label} />
    </Suspense>
  );
}
