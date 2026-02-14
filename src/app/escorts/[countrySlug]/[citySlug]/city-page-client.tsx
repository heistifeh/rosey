"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { City, Country, State } from "country-state-city";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { FooterSection } from "@/components/home/footer-section";
import { Header } from "@/components/layout/header";
import type { Profile } from "@/types/types";
import { slugifyLocation } from "@/lib/google-places";

export type CityPageClientProps = {
  params?: {
    countrySlug: string;
    citySlug: string;
  };
};

const FALLBACK_CITIES_BY_COUNTRY: Record<string, string[]> = {
  nigeria: ["lagos", "abuja", "port-harcourt", "ibadan", "kano"],
  us: ["new-york", "los-angeles", "miami", "chicago", "las-vegas", "houston"],
  "united-kingdom": ["london", "manchester", "birmingham", "liverpool"],
  france: ["paris", "marseille", "lyon"],
  canada: ["toronto", "vancouver", "montreal", "calgary"],
  germany: ["berlin", "munich", "hamburg", "frankfurt"],
  spain: ["madrid", "barcelona", "valencia", "sevilla"],
  "united-arab-emirates": ["dubai", "abu-dhabi", "sharjah"],
  mexico: ["mexico-city", "guadalajara", "monterrey"],
  australia: ["sydney", "melbourne", "brisbane"],
  japan: ["tokyo", "osaka", "yokohama"],
  brazil: ["rio-de-janeiro", "sao-paulo", "brasilia"],
  netherlands: ["amsterdam", "rotterdam", "the-hague"],
  kenya: ["nairobi", "mombasa", "kisumu"],
  "south-africa": ["cape-town", "johannesburg", "durban"],
  thailand: ["bangkok", "chiang-mai", "phuket"],
};

const US_CITY_STATE_PREFERENCE: Record<string, string> = {
  miami: "Florida",
  "new-york": "New York",
  "los-angeles": "California",
  chicago: "Illinois",
  houston: "Texas",
  "san-francisco": "California",
  "san-diego": "California",
  "las-vegas": "Nevada",
  dallas: "Texas",
  atlanta: "Georgia",
};

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
    const countryNameSlug = slugifyLocation(country.name);
    return (
      countryNameSlug === normalized ||
      country.isoCode.toLowerCase() === normalized ||
      country.isoCode.toLowerCase() === countrySlug.toLowerCase()
    );
  });
  return matched?.isoCode ?? null;
};

const getCitiesForState = (countryIsoCode: string, stateName: string) => {
  const targetStateSlug = slugifyLocation(stateName);
  const state = State.getStatesOfCountry(countryIsoCode).find(
    (item) =>
      slugifyLocation(item.name) === targetStateSlug ||
      item.isoCode.toLowerCase() === targetStateSlug
  );
  if (!state) return [];

  const uniqueCities = new Map<string, string>();
  City.getCitiesOfState(countryIsoCode, state.isoCode).forEach((city) => {
    const citySlug = slugifyLocation(city.name);
    if (!citySlug || uniqueCities.has(citySlug)) return;
    uniqueCities.set(citySlug, city.name);
  });

  return Array.from(uniqueCities.entries()).map(([citySlug, cityName]) => ({
    citySlug,
    cityName,
  }));
};

const getStateNameByCitySlug = (countryIsoCode: string, citySlug?: string) => {
  if (!citySlug) return null;
  const normalizedCitySlug = slugifyLocation(citySlug);
  const states = State.getStatesOfCountry(countryIsoCode);
  const matches: string[] = [];

  for (const state of states) {
    const cities = City.getCitiesOfState(countryIsoCode, state.isoCode);
    const hasMatch = cities.some(
      (city) => slugifyLocation(city.name) === normalizedCitySlug
    );
    if (hasMatch) {
      matches.push(state.name);
    }
  }

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  if (countryIsoCode === "US") {
    const preferred = US_CITY_STATE_PREFERENCE[normalizedCitySlug];
    if (preferred && matches.includes(preferred)) {
      return preferred;
    }
  }

  return matches[0];
};

const getCitiesForCountry = (countryIsoCode: string) => {
  const uniqueCities = new Map<string, string>();
  City.getCitiesOfCountry(countryIsoCode).forEach((city) => {
    const citySlug = slugifyLocation(city.name);
    if (!citySlug || uniqueCities.has(citySlug)) return;
    uniqueCities.set(citySlug, city.name);
  });

  return Array.from(uniqueCities.entries()).map(([citySlug, cityName]) => ({
    citySlug,
    cityName,
  }));
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededShuffle = <T,>(items: T[], seedKey: string) => {
  const result = [...items];
  let seed = hashString(seedKey);
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function CityPageClient({ params }: CityPageClientProps) {
  console.log("CityPageClient params:", params);
  const { countrySlug, citySlug } = params || {};

  const invalidParams = !citySlug || !countrySlug;
  const cityName = citySlug ? citySlug.replace(/-/g, " ") : "";
  const countryName = countrySlug ? countrySlug.replace(/-/g, " ") : "";

  const {
    data: organicProfiles = [],
    isLoading: loadingOrganic,
  } = useQuery<Profile[]>({
    queryKey: ["city-organic", countrySlug, citySlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.profiles.getCityProfiles({
          citySlug: citySlug!,
          countrySlug: countrySlug!,
        }),
    enabled: !invalidParams,
  });

  const {
    data: sponsoredProfiles = [],
    isLoading: loadingSponsored,
  } = useQuery<Profile[]>({
    queryKey: ["city-sponsored", countrySlug, citySlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.ads.getSponsoredProfilesForCity({
          citySlug: citySlug!,
          countrySlug: countrySlug!,
        }),
    enabled: !invalidParams,
  });

  const sponsoredIds = new Set(sponsoredProfiles.map((profile) => profile.id));
  const organicWithoutSponsored = organicProfiles.filter(
    (profile) => !sponsoredIds.has(profile.id)
  );
  const finalProfiles = [...sponsoredProfiles, ...organicWithoutSponsored];
  const isLoading = loadingOrganic || loadingSponsored;

  const relatedCities = useMemo(() => {
    if (invalidParams) return [];

    const seen = new Set<string>();
    const locations: { label: string; href: string }[] = [];
    const mergedProfiles = [...sponsoredProfiles, ...organicProfiles];
    const randomSeedBase = `${countrySlug || ""}:${citySlug || ""}`;

    const buildHref = (city?: string, country?: string) => {
      const search = new URLSearchParams();
      if (country) search.set("country", country);
      if (city) search.set("city", city);
      return `/search${search.toString() ? `?${search.toString()}` : ""}`;
    };

    const addLocation = (citySlugValue: string, countrySlugValue: string, cityName?: string) => {
      if (!citySlugValue || !countrySlugValue) return;
      if (citySlugValue === citySlug && countrySlugValue === countrySlug) return;

      const key = `${citySlugValue}-${countrySlugValue}`;
      if (seen.has(key)) return;
      seen.add(key);

      locations.push({
        label: `${cityName || formatSlug(citySlugValue)}, ${formatSlug(countrySlugValue)}`,
        href: buildHref(citySlugValue, countrySlugValue),
      });
    };

    mergedProfiles.forEach((profile) => {
      const cSlug = profile.city_slug;
      const coSlug = profile.country_slug;
      if (!cSlug || !coSlug) return;
      addLocation(cSlug, coSlug);
    });

    const normalizedCountry = normalizeCountryKey(countrySlug);
    const inferredCountrySlug =
      countrySlug ||
      mergedProfiles.find((profile) => profile.country_slug)?.country_slug ||
      normalizedCountry;

    let targetStateName: string | null = null;

    if (locations.length < 16 && inferredCountrySlug) {
      const countryIsoCode = getCountryIsoCode(inferredCountrySlug);
      if (countryIsoCode) {
        const selectedStateFromProfiles =
          mergedProfiles.find(
            (profile) =>
              profile.city_slug === citySlug &&
              profile.country_slug === countrySlug &&
              profile.state
          )?.state ?? null;
        const selectedStateFromCitySlug = getStateNameByCitySlug(
          countryIsoCode,
          citySlug
        );
        targetStateName =
          selectedStateFromProfiles || selectedStateFromCitySlug;

        if (targetStateName) {
          seededShuffle(
            getCitiesForState(countryIsoCode, targetStateName),
            `${randomSeedBase}:state:${targetStateName}`
          ).forEach(
            (item) => {
              if (locations.length >= 16) return;
              addLocation(item.citySlug, inferredCountrySlug, item.cityName);
            }
          );
        }

        if (locations.length < 16 && !targetStateName) {
          seededShuffle(
            getCitiesForCountry(countryIsoCode),
            `${randomSeedBase}:country:${countryIsoCode}`
          ).forEach((item) => {
            if (locations.length >= 16) return;
            addLocation(item.citySlug, inferredCountrySlug, item.cityName);
          });
        }
      }
    }

    if (locations.length < 16 && !targetStateName) {
      const inferredCountry =
        normalizeCountryKey(inferredCountrySlug) ||
        normalizeCountryKey(
          organicProfiles[0]?.country_slug ||
          sponsoredProfiles[0]?.country_slug,
        );

      const fallbackCities = inferredCountry
        ? FALLBACK_CITIES_BY_COUNTRY[inferredCountry] ?? []
        : [];
      fallbackCities.forEach((city) => {
        if (locations.length >= 16) return;
        const fallbackCountrySlug = inferredCountrySlug || inferredCountry;
        if (!fallbackCountrySlug) return;
        addLocation(city, fallbackCountrySlug);
      });
    }

    return locations.slice(0, 16);
  }, [countrySlug, citySlug, invalidParams, organicProfiles, sponsoredProfiles]);

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 md:pb-16">
      <Header />
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-8 md:px-[60px] md:gap-10 md:pt-12">
        <div className="flex flex-col gap-2">
          {invalidParams ? (
            <h1 className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
              Invalid city or country
            </h1>
          ) : (
            <>
              <div className="rounded-[20px] border border-dark-border bg-primary-bg/70 p-4 md:rounded-[24px] md:p-6">
                <div className="mb-2 text-xs text-text-gray-opacity md:text-sm">
                  <Link href="/" className="hover:text-primary-text transition-colors">
                    Home
                  </Link>{" "}
                  /{" "}
                  <Link
                    href={`/search?country=${encodeURIComponent(countrySlug ?? "")}`}
                    className="hover:text-primary-text transition-colors"
                  >
                    {formatSlug(countrySlug ?? "")}
                  </Link>{" "}
                  /{" "}
                  <span className="text-primary-text">{formatSlug(citySlug ?? "")}</span>
                </div>
                <h1 className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
                  {formatSlug(citySlug ?? "")} escorts
                </h1>
                <p className="mt-1 text-sm text-text-gray-opacity md:text-base">
                  Browse verified independent escorts in {cityName}, {countryName}.
                </p>
                <p className="mt-3 text-xs text-text-gray-opacity md:text-sm">
                  {finalProfiles.length} profile{finalProfiles.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <BaseCardSkeleton key={index} />
            ))
            : finalProfiles.map((profile, index) => {
              const isSponsored = sponsoredIds.has(profile.id);
              return (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.username || profile.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-2 shadow-sm transition-opacity hover:opacity-90 md:p-3"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[14px] md:aspect-[4/5] md:rounded-[16px]">
                    <SafeImage
                      src={
                        profile.images?.[0]?.public_url || "/images/girl1.png"
                      }
                      alt={profile.working_name ?? "Profile"}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority={index < 4}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-1.5 pt-2 md:gap-3 md:pt-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal text-primary-text md:text-lg">
                        {profile.working_name ?? "Provider"}
                      </p>
                      {isSponsored && (
                        <span className="rounded-full border border-primary bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Sponsored
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

          {!isLoading && finalProfiles.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No escorts found in this city yet.
            </div>
          )}
        </div>

      </div>
      <FooterSection
        relatedLocations={relatedCities}
        relatedHeading="Related cities"
        relatedDescription="Explore other cities and find more providers nearby."
      />
    </section>
  );
}
