import type { Metadata } from "next";
import { CityPageClient } from "./city-page-client";

type CityPageParams = {
  countrySlug: string;
  citySlug: string;
};

type CityPageSearchParams = {
  state?: string | string[];
};

const toSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<CityPageParams>;
  searchParams: Promise<CityPageSearchParams>;
}): Promise<Metadata> {
  const { citySlug, countrySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const stateSlug = toSingleValue(resolvedSearchParams?.state);
  const cityName = citySlug.replace(/-/g, " ");
  const stateName = stateSlug ? stateSlug.replace(/-/g, " ") : "";
  const countryName = countrySlug.replace(/-/g, " ");
  const cityLine = [cityName, stateName, countryName].filter(Boolean).join(", ");

  return {
    title: `Escorts in ${cityLine} | Rosey`,
    description: `Browse verified escorts in ${cityLine} on Rosey. View profiles, rates, and availability.`,
  };
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<CityPageParams>;
  searchParams: Promise<CityPageSearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return (
    <CityPageClient
      params={{
        ...resolvedParams,
        stateSlug: toSingleValue(resolvedSearchParams?.state),
      }}
    />
  );
}
