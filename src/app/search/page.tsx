import type { Metadata } from "next";
import { SearchResultsClient } from "./search-results-client";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

type SearchPageProps = {
  searchParams: Promise<{
    country?: string | string[];
    city?: string | string[];
    state?: string | string[];
    ethnicity?: string | string[];
    gender?: string | string[];
    min?: string | string[];
    max?: string | string[];
    catersTo?: string | string[];
    availableNow?: string | string[];
    page?: string | string[];
  }>;
};

const toSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : (value ?? undefined);

const parseNumberParam = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseCatersToParam = (value?: string | string[]) => {
  const raw = toSingleValue(value);
  if (!raw) return undefined;

  const parts = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return parts;
};

const humanizeSlug = (value?: string) =>
  value
    ? value
        .split("-")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ")
    : undefined;

const buildLocationLabel = (countrySlug?: string, stateSlug?: string, citySlug?: string) =>
  [humanizeSlug(citySlug), humanizeSlug(stateSlug), humanizeSlug(countrySlug)]
    .filter(Boolean)
    .join(", ");

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const countrySlug = toSingleValue(params?.country);
  const stateSlug = toSingleValue(params?.state);
  const citySlug = toSingleValue(params?.city);
  const ethnicity = toSingleValue(params?.ethnicity);
  const gender = toSingleValue(params?.gender);
  const locationLabel = buildLocationLabel(countrySlug, stateSlug, citySlug);

  const filters: string[] = [];
  if (ethnicity) filters.push(`${ethnicity} profiles`);
  if (gender && gender !== "All") filters.push(`${gender.toLowerCase()} companions`);
  if (locationLabel) filters.push(`in ${locationLabel}`);

  const title = locationLabel
    ? `Search Companions in ${locationLabel} | Rosey`
    : ethnicity
      ? `Search ${ethnicity} Companions | Rosey`
      : "Search Companions | Rosey";

  const description = filters.length
    ? `Find ${filters.join(" ")} on Rosey with flexible filters for rate, availability, and preferences.`
    : "Browse companion profiles on Rosey using filters for city, rates, availability, gender, and preferences.";

  return buildPageMetadata({
    title,
    description,
    path: "/search",
    noIndex: true,
    keywords: [
      ...CORE_SEO_KEYWORDS,
      "companion search",
      "escort search filters",
      "city companion search",
    ],
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const countrySlug = toSingleValue(params?.country);
  const citySlug = toSingleValue(params?.city);
  const stateSlug = toSingleValue(params?.state);
  const ethnicityValue = toSingleValue(params?.ethnicity);
  const genderValue = toSingleValue(params?.gender);
  const availableNowValue = toSingleValue(params?.availableNow) === "true";
  const parsedPage = parseNumberParam(toSingleValue(params?.page));
  const initialPage =
    typeof parsedPage === "number" && parsedPage >= 1
      ? Math.floor(parsedPage)
      : 1;

  return (
    <SearchResultsClient
      initialParams={{
        countrySlug: countrySlug || undefined,
        citySlug: citySlug || undefined,
        stateSlug: stateSlug || undefined,
        ethnicity: ethnicityValue || undefined,
        gender: genderValue && genderValue !== "All" ? genderValue : undefined,
        minRate: parseNumberParam(toSingleValue(params?.min)),
        maxRate: parseNumberParam(toSingleValue(params?.max)),
        catersTo: parseCatersToParam(params?.catersTo),
        availableNow: availableNowValue,
      }}
      initialPage={initialPage}
    />
  );
}
