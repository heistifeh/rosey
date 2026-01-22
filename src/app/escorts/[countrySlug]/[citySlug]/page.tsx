import type { Metadata } from "next";
import { CityPageClient } from "./city-page-client";

type CityPageParams = {
  countrySlug: string;
  citySlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<CityPageParams>;
}): Promise<Metadata> {
  const { citySlug, countrySlug } = await params;
  const cityName = citySlug.replace(/-/g, " ");
  const countryName = countrySlug.replace(/-/g, " ");

  return {
    title: `Escorts in ${cityName}, ${countryName} | Rosey`,
    description: `Browse verified escorts in ${cityName}, ${countryName} on Rosey. View profiles, rates, and availability.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<CityPageParams>;
}) {
  const resolvedParams = await params;
  return <CityPageClient params={resolvedParams} />;
}
