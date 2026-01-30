import type { Metadata } from "next";
import { CityPageClient } from "../../../_components/city-page-client";

type CityPageParams = {
  countrySlug: string;
  stateSlug: string;
  citySlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<CityPageParams>;
}): Promise<Metadata> {
  const { citySlug, stateSlug, countrySlug } = await params;
  const cityName = citySlug.replace(/-/g, " ");
  const stateName = stateSlug.replace(/-/g, " ");
  const countryName = countrySlug.replace(/-/g, " ");

  return {
    title: `Escorts in ${cityName}, ${stateName}, ${countryName} | Rosey`,
    description: `Browse verified escorts in ${cityName}, ${stateName}, ${countryName} on Rosey. View profiles, rates, and availability.`,
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
