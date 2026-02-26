import type { Metadata } from "next";
import { SearchResultsClient } from "./search-results-client";
import {
  CORE_SEO_KEYWORDS,
  buildPageMetadata,
  humanizeLocationSlug,
} from "@/lib/seo";

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

const buildLocationLabel = (countrySlug?: string, stateSlug?: string, citySlug?: string) =>
  [
    humanizeLocationSlug(citySlug),
    humanizeLocationSlug(stateSlug),
    humanizeLocationSlug(countrySlug),
  ]
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

  const escortDescriptors: string[] = [];
  if (ethnicity) escortDescriptors.push(`${ethnicity} escorts`);
  if (gender && gender !== "All") escortDescriptors.push(`${gender.toLowerCase()} escorts`);
  const locationSuffix = locationLabel ? ` in ${locationLabel}` : "";

  const title = locationLabel
    ? `Search Escorts in ${locationLabel} | Rosey`
    : ethnicity
      ? `Search ${ethnicity} Escorts | Rosey`
      : "Search Escorts | Rosey";

  const description = escortDescriptors.length || locationSuffix
    ? `Find ${
        escortDescriptors.length > 0 ? escortDescriptors.join(" and ") : "escorts"
      }${locationSuffix} on Rosey with flexible filters for rate, availability, and preferences.`
    : "Browse escort profiles on Rosey using filters for city, rates, availability, gender, and preferences.";

  const metadata = buildPageMetadata({
    title,
    description,
    path: "/search",
    noIndex: true,
    keywords: [
      ...CORE_SEO_KEYWORDS,
      "escort search",
      "escort search filters",
      "city escort search",
    ],
  });

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
        noimageindex: true,
        "max-snippet": 0,
      },
    },
  };
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
