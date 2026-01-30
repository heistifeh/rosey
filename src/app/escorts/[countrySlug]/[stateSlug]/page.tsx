import type { Metadata } from "next";
import { StatePageClient } from "../../_components/state-page-client";

type StatePageParams = {
  countrySlug: string;
  stateSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<StatePageParams>;
}): Promise<Metadata> {
  const { stateSlug, countrySlug } = await params;
  const stateName = stateSlug.replace(/-/g, " ");
  const countryName = countrySlug.replace(/-/g, " ");

  return {
    title: `Escorts in ${stateName}, ${countryName} | Rosey`,
    description: `Browse verified escorts in ${stateName}, ${countryName} on Rosey. View profiles, rates, and availability.`,
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<StatePageParams>;
}) {
  const resolvedParams = await params;
  return <StatePageClient params={resolvedParams} />;
}
