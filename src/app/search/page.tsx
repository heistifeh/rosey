import { SearchResultsClient } from "./search-results-client";

type SearchPageProps = {
  searchParams: Promise<{
    country?: string | string[];
    city?: string | string[];
    gender?: string | string[];
    min?: string | string[];
    max?: string | string[];
    catersTo?: string | string[];
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const countrySlug = toSingleValue(params?.country);
  const citySlug = toSingleValue(params?.city);
  const genderValue = toSingleValue(params?.gender);

  return (
    <SearchResultsClient
      initialParams={{
        countrySlug: countrySlug || undefined,
        citySlug: citySlug || undefined,
        gender: genderValue && genderValue !== "All" ? genderValue : undefined,
        minRate: parseNumberParam(toSingleValue(params?.min)),
        maxRate: parseNumberParam(toSingleValue(params?.max)),
        catersTo: parseCatersToParam(params?.catersTo),
      }}
    />
  );
}
