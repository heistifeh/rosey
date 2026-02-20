import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { City, Country, State } from "country-state-city";
import { CityPageClient } from "./city-page-client";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

type CityPageParams = {
  countrySlug: string;
  locationSegments?: string[];
};

type CityPageSearchParams = {
  state?: string | string[];
  [key: string]: string | string[] | undefined;
};

const toSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const slugifyValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^[-]+|[-]+$/g, "")
    .toLowerCase();

const normalizeCountryKey = (slug?: string) => {
  if (!slug) return undefined;
  const key = slug.toLowerCase();
  const aliases: Record<string, string> = {
    usa: "us",
    "u.s.": "us",
    "u.s.a": "us",
    "united-states": "us",
    "united-states-of-america": "us",
    uk: "united-kingdom",
    "u.k.": "united-kingdom",
    uae: "united-arab-emirates",
    "u.a.e.": "united-arab-emirates",
  };
  return aliases[key] ?? key;
};

const getCountryIsoCode = (countrySlug?: string) => {
  if (!countrySlug) return null;
  const normalized = normalizeCountryKey(countrySlug);
  const countries = Country.getAllCountries();
  const matched = countries.find((country) => {
    const countryNameSlug = slugifyValue(country.name);
    return (
      countryNameSlug === normalized ||
      country.isoCode.toLowerCase() === normalized ||
      country.isoCode.toLowerCase() === countrySlug.toLowerCase()
    );
  });
  return matched?.isoCode ?? null;
};

const US_CITY_STATE_PREFERENCE: Record<string, string> = {
  miami: "florida",
  "new-york": "new-york",
  "los-angeles": "california",
  chicago: "illinois",
  houston: "texas",
  "san-francisco": "california",
  "san-diego": "california",
  "las-vegas": "nevada",
  dallas: "texas",
  atlanta: "georgia",
};

const inferStateSlugFromCity = (countrySlug: string, citySlug?: string) => {
  if (!citySlug) return undefined;

  const countryIsoCode = getCountryIsoCode(countrySlug);
  if (!countryIsoCode) return undefined;

  const normalizedCitySlug = slugifyValue(citySlug);
  const states = State.getStatesOfCountry(countryIsoCode);
  const matches: string[] = [];

  for (const state of states) {
    const hasMatch = (City.getCitiesOfState(countryIsoCode, state.isoCode) ?? []).some(
      (city) => slugifyValue(city.name) === normalizedCitySlug,
    );
    if (hasMatch) {
      const stateSlug = slugifyValue(state.name);
      if (!matches.includes(stateSlug)) {
        matches.push(stateSlug);
      }
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1 && countryIsoCode === "US") {
    const preferred = US_CITY_STATE_PREFERENCE[normalizedCitySlug];
    if (preferred && matches.includes(preferred)) {
      return preferred;
    }
  }

  return undefined;
};

const buildEscortsPath = (
  countrySlug: string,
  citySlug?: string,
  stateSlug?: string,
) => {
  if (!citySlug) {
    return `/escorts/${countrySlug}`;
  }

  if (stateSlug) {
    return `/escorts/${countrySlug}/${stateSlug}/${citySlug}`;
  }

  return `/escorts/${countrySlug}/${citySlug}`;
};

const toLocationParams = (
  params: CityPageParams,
  stateFromQuery?: string,
) => {
  const segments = params.locationSegments ?? [];

  if (segments.length === 1) {
    const [citySlug] = segments;
    return {
      countrySlug: params.countrySlug,
      citySlug,
      stateSlug: stateFromQuery,
      valid: Boolean(citySlug),
    };
  }

  if (segments.length === 2) {
    const [stateSlug, citySlug] = segments;
    return {
      countrySlug: params.countrySlug,
      citySlug,
      stateSlug,
      valid: Boolean(stateSlug && citySlug),
    };
  }

  return {
    countrySlug: params.countrySlug,
    citySlug: undefined,
    stateSlug: undefined,
    valid: false,
  };
};

const humanizeSlug = (value: string) => value.replace(/-/g, " ");

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<CityPageParams>;
  searchParams: Promise<CityPageSearchParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const parsed = toLocationParams(
    resolvedParams,
    toSingleValue(resolvedSearchParams?.state),
  );
  const preferredStateSlug =
    parsed.stateSlug ?? inferStateSlugFromCity(parsed.countrySlug, parsed.citySlug);
  const canonicalPath = buildEscortsPath(
    parsed.countrySlug,
    parsed.citySlug,
    preferredStateSlug,
  );

  if (!parsed.valid || !parsed.citySlug) {
    return buildPageMetadata({
      title: "Escorts by Location | Rosey",
      description:
        "Browse verified companion profiles on Rosey by country, state, and city.",
      path: buildEscortsPath(parsed.countrySlug),
      noIndex: true,
      keywords: [...CORE_SEO_KEYWORDS, "escorts by location", "city escorts"],
    });
  }

  const cityLine = [
    humanizeSlug(parsed.citySlug),
    parsed.stateSlug ? humanizeSlug(parsed.stateSlug) : null,
    humanizeSlug(parsed.countrySlug),
  ]
    .filter(Boolean)
    .join(", ");

  return buildPageMetadata({
    title: `Escorts in ${cityLine} | Rosey`,
    description: `Browse verified escorts in ${cityLine} on Rosey. Compare profiles, rates, and real-time availability.`,
    path: canonicalPath,
    keywords: [
      ...CORE_SEO_KEYWORDS,
      `${humanizeSlug(parsed.citySlug)} escorts`,
      parsed.stateSlug ? `${humanizeSlug(parsed.stateSlug)} escorts` : "",
      `${humanizeSlug(parsed.countrySlug)} escorts`,
    ].filter(Boolean),
  });
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
  const parsed = toLocationParams(
    resolvedParams,
    toSingleValue(resolvedSearchParams?.state),
  );
  const preferredStateSlug =
    parsed.stateSlug ?? inferStateSlugFromCity(parsed.countrySlug, parsed.citySlug);

  if (parsed.citySlug && !resolvedParams.locationSegments?.[1] && preferredStateSlug) {
    const query = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (key === "state") return;
      const single = toSingleValue(value);
      if (single) {
        query.set(key, single);
      }
    });

    const destination = buildEscortsPath(
      parsed.countrySlug,
      parsed.citySlug,
      preferredStateSlug,
    );
    const queryString = query.toString();
    permanentRedirect(queryString ? `${destination}?${queryString}` : destination);
  }

  return (
    <CityPageClient
      params={{
        countrySlug: parsed.countrySlug,
        citySlug: parsed.citySlug,
        stateSlug: parsed.stateSlug,
      }}
    />
  );
}
