"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { City, Country, State } from "country-state-city";
import { slugifyLocation } from "@/lib/google-places";

type CountryMeta = {
  name: string;
  isoCode: string;
  countrySlug: string;
  timezoneZoneName?: string;
};

type StateWithCities = {
  name: string;
  stateSlug: string | null;
  cities: {
    name: string;
    citySlug: string;
  }[];
};

type ContinentSection =
  | "North America"
  | "Asia"
  | "Australia + NZ"
  | "Europe"
  | "South America"
  | "Africa"
  | "Other";

const CONTINENT_ORDER: ContinentSection[] = [
  "North America",
  "Asia",
  "Australia + NZ",
  "Europe",
  "South America",
  "Africa",
  "Other",
];

const SOUTH_AMERICA_ISO_CODES = new Set([
  "AR",
  "BO",
  "BR",
  "CL",
  "CO",
  "EC",
  "GY",
  "PE",
  "PY",
  "SR",
  "UY",
  "VE",
]);

const NORTH_AMERICA_ISO_CODES = new Set([
  "AG",
  "BB",
  "BS",
  "BZ",
  "CA",
  "CR",
  "CU",
  "DM",
  "DO",
  "GD",
  "GL",
  "GT",
  "HN",
  "HT",
  "JM",
  "KN",
  "LC",
  "MX",
  "NI",
  "PA",
  "SV",
  "TT",
  "US",
  "VC",
]);

const PRIORITY_COUNTRIES = new Set(["US", "CA"]);

const DEFAULT_STATE_PREVIEW_COUNT = 6;
const DEFAULT_CITY_PREVIEW_COUNT = 4;

const countryStateCache = new Map<string, StateWithCities[]>();

const getContinentSection = (country: CountryMeta): ContinentSection => {
  if (NORTH_AMERICA_ISO_CODES.has(country.isoCode)) {
    return "North America";
  }

  if (SOUTH_AMERICA_ISO_CODES.has(country.isoCode)) {
    return "South America";
  }

  const timezone = country.timezoneZoneName?.toLowerCase() ?? "";

  if (timezone.startsWith("europe/")) {
    return "Europe";
  }
  if (timezone.startsWith("asia/")) {
    return "Asia";
  }
  if (
    timezone.startsWith("australia/") ||
    timezone.startsWith("pacific/") ||
    timezone.includes("auckland")
  ) {
    return "Australia + NZ";
  }
  if (timezone.startsWith("africa/")) {
    return "Africa";
  }
  if (timezone.startsWith("america/")) {
    return "South America";
  }

  return "Other";
};

const formatCountryCount = (count: number) =>
  `${count} countr${count === 1 ? "y" : "ies"}`;

const formatStateCount = (count: number) =>
  `${count} state${count === 1 ? "" : "s"}`;

const getCitiesForCountry = (country: CountryMeta) => {
  const cacheKey = country.isoCode;
  const cached = countryStateCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const normalizeCities = (rawCities: { name: string }[]) => {
    const unique = new Map<string, string>();

    rawCities.forEach((city) => {
      const cityName = city.name?.trim();
      if (!cityName) return;
      const citySlug = slugifyLocation(cityName);
      if (!citySlug || unique.has(citySlug)) return;
      unique.set(citySlug, cityName);
    });

    return Array.from(unique.entries())
      .map(([citySlug, name]) => ({ citySlug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const states = State.getStatesOfCountry(country.isoCode) ?? [];
  const stateEntries = states
    .map((state) => ({
      name: state.name,
      stateSlug: slugifyLocation(state.name),
      cities: normalizeCities(
        (City.getCitiesOfState(country.isoCode, state.isoCode) ?? []) as {
          name: string;
        }[],
      ),
    }))
    .filter((entry) => entry.cities.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (stateEntries.length > 0) {
    countryStateCache.set(cacheKey, stateEntries);
    return stateEntries;
  }

  const fallbackCities = normalizeCities(
    (City.getCitiesOfCountry(country.isoCode) ?? []) as { name: string }[],
  );

  const fallbackEntries =
    fallbackCities.length > 0
      ? [
          {
            name: "Major Cities",
            stateSlug: null,
            cities: fallbackCities,
          },
        ]
      : [];

  countryStateCache.set(cacheKey, fallbackEntries);
  return fallbackEntries;
};

const toCountryQueryHref = (countrySlug: string) =>
  `/search?country=${encodeURIComponent(countrySlug)}`;

const toCityQueryHref = (
  countrySlug: string,
  citySlug: string,
  stateSlug?: string | null,
) => {
  const params = new URLSearchParams();
  params.set("country", countrySlug);
  if (stateSlug) {
    params.set("state", stateSlug);
  }
  params.set("city", citySlug);
  return `/search?${params.toString()}`;
};

const toSectionAnchor = (section: ContinentSection) => `#${slugifyLocation(section)}`;
const toCountryAnchorId = (countrySlug: string) => `country-${countrySlug}`;
const toCountryAnchorHref = (countrySlug: string) => `#${toCountryAnchorId(countrySlug)}`;

export function LocationDirectory() {
  const [countryQuery, setCountryQuery] = useState("");
  const [expandedCountries, setExpandedCountries] = useState<
    Record<string, boolean>
  >({
    "united-states": true,
    canada: true,
  });
  const [showAllStatesByCountry, setShowAllStatesByCountry] = useState<
    Record<string, boolean>
  >({});
  const [showAllCitiesByState, setShowAllCitiesByState] = useState<
    Record<string, boolean>
  >({});

  const countries = useMemo<CountryMeta[]>(() => {
    const rawCountries = Country.getAllCountries() as Array<{
      name: string;
      isoCode: string;
      timezones?: Array<{ zoneName?: string }>;
    }>;

    return rawCountries
      .map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
        countrySlug: slugifyLocation(country.name),
        timezoneZoneName: country.timezones?.[0]?.zoneName,
      }))
      .sort((a, b) => {
        const aPriority = PRIORITY_COUNTRIES.has(a.isoCode) ? 0 : 1;
        const bPriority = PRIORITY_COUNTRIES.has(b.isoCode) ? 0 : 1;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return a.name.localeCompare(b.name);
      });
  }, []);

  const countriesByContinent = useMemo(() => {
    const grouped: Record<ContinentSection, CountryMeta[]> = {
      "North America": [],
      Asia: [],
      "Australia + NZ": [],
      Europe: [],
      "South America": [],
      Africa: [],
      Other: [],
    };

    countries.forEach((country) => {
      const section = getContinentSection(country);
      grouped[section].push(country);
    });

    CONTINENT_ORDER.forEach((section) => {
      grouped[section].sort((a, b) => {
        const aPriority = PRIORITY_COUNTRIES.has(a.isoCode) ? 0 : 1;
        const bPriority = PRIORITY_COUNTRIES.has(b.isoCode) ? 0 : 1;
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return grouped;
  }, [countries]);

  const normalizedCountryQuery = countryQuery.trim().toLowerCase();

  const filteredCountriesByContinent = useMemo(() => {
    if (!normalizedCountryQuery) {
      return countriesByContinent;
    }

    const filtered: Record<ContinentSection, CountryMeta[]> = {
      "North America": [],
      Asia: [],
      "Australia + NZ": [],
      Europe: [],
      "South America": [],
      Africa: [],
      Other: [],
    };

    CONTINENT_ORDER.forEach((section) => {
      filtered[section] = countriesByContinent[section].filter((country) =>
        country.name.toLowerCase().includes(normalizedCountryQuery),
      );
    });

    return filtered;
  }, [countriesByContinent, normalizedCountryQuery]);

  const countryMatches = useMemo(() => {
    if (!normalizedCountryQuery) {
      return [] as CountryMeta[];
    }

    return CONTINENT_ORDER.flatMap(
      (section) => filteredCountriesByContinent[section],
    );
  }, [filteredCountriesByContinent, normalizedCountryQuery]);

  const availableSections = useMemo(
    () =>
      CONTINENT_ORDER.filter(
        (section) => (filteredCountriesByContinent[section]?.length ?? 0) > 0,
      ),
    [filteredCountriesByContinent],
  );

  return (
    <section className="relative z-10 w-full overflow-hidden bg-input-bg pb-14 pt-8 md:pb-20 md:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-4 md:px-[60px]">
        <header className="rounded-[28px] border border-dark-border bg-primary-bg/70 p-5 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            Escort Location Directory
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-primary-text md:text-4xl">
            Browse Escort Cities by Country
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-text-gray-opacity md:text-base">
            United States and Canada are prioritized, and every country in our
            escort directory is listed. Open any country to explore states and
            city previews, then expand a state when you want to see every city
            where we support escort listings.
          </p>
          <div className="mt-5 space-y-3">
            <div className="flex flex-col gap-2 md:max-w-[460px]">
              <label
                htmlFor="location-country-search"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-text-gray-opacity"
              >
                Search Country
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-dark-border bg-input-bg p-2">
                <input
                  id="location-country-search"
                  type="text"
                  value={countryQuery}
                  onChange={(event) => setCountryQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || countryMatches.length === 0) {
                      return;
                    }

                    event.preventDefault();
                    const topMatch = countryMatches[0];
                    setExpandedCountries((prev) => ({
                      ...prev,
                      [topMatch.countrySlug]: true,
                    }));
                    document
                      .getElementById(toCountryAnchorId(topMatch.countrySlug))
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  placeholder="Type a country and press Enter to jump"
                  className="h-9 w-full rounded-lg bg-primary-bg px-3 text-sm text-primary-text placeholder:text-text-gray-opacity focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {countryQuery && (
                  <button
                    type="button"
                    onClick={() => setCountryQuery("")}
                    className="rounded-full border border-dark-border bg-primary-bg px-2.5 py-1 text-xs font-semibold text-text-gray-opacity transition-colors hover:text-primary-text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {normalizedCountryQuery && (
              <div className="flex flex-wrap items-center gap-2">
                {countryMatches.length > 0 ? (
                  countryMatches.slice(0, 8).map((country) => (
                    <Link
                      key={`country-match-${country.isoCode}`}
                      href={toCountryAnchorHref(country.countrySlug)}
                      onClick={() =>
                        setExpandedCountries((prev) => ({
                          ...prev,
                          [country.countrySlug]: true,
                        }))
                      }
                      className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/20"
                    >
                      {country.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-text-gray-opacity md:text-sm">
                    No countries found for "{countryQuery.trim()}".
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-dark-border bg-input-bg px-3 py-1 text-xs font-medium text-text-gray-opacity md:text-sm">
              Jump to
            </span>
            {availableSections.map((section) => (
              <Link
                key={section}
                href={toSectionAnchor(section)}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/20 md:text-sm"
              >
                {section}
              </Link>
            ))}
          </div>
        </header>

        {availableSections.length === 0 ? (
          <div className="rounded-2xl border border-dark-border bg-primary-bg/70 p-5 text-sm text-text-gray-opacity md:p-6">
            No countries match your search. Try a different name.
          </div>
        ) : (
          availableSections.map((section) => {
            const sectionCountries = filteredCountriesByContinent[section];

            return (
              <section
                key={section}
                id={slugifyLocation(section)}
                className="scroll-mt-28"
              >
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-dark-border pb-3">
                  <h2 className="text-xl font-semibold text-primary-text md:text-3xl">
                    {section}
                  </h2>
                  <span className="text-xs text-text-gray-opacity md:text-sm">
                    {formatCountryCount(sectionCountries.length)}
                  </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {sectionCountries.map((country) => {
                    const isCountryExpanded = Boolean(
                      expandedCountries[country.countrySlug],
                    );
                    const stateEntries = isCountryExpanded
                      ? getCitiesForCountry(country)
                      : [];
                    const showAllStates = Boolean(
                      showAllStatesByCountry[country.countrySlug],
                    );
                    const statesToRender = showAllStates
                      ? stateEntries
                      : stateEntries.slice(0, DEFAULT_STATE_PREVIEW_COUNT);

                    return (
                      <article
                        key={country.isoCode}
                        id={toCountryAnchorId(country.countrySlug)}
                        className="rounded-2xl border border-dark-border bg-primary-bg/80 p-4 md:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-primary-text md:text-2xl">
                              {country.name}
                            </h3>
                            {isCountryExpanded && (
                              <p className="mt-1 text-xs text-text-gray-opacity md:text-sm">
                                {formatStateCount(stateEntries.length)}
                              </p>
                            )}
                          </div>
                          <Link
                            href={toCountryQueryHref(country.countrySlug)}
                            className="text-xs font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80 md:text-sm"
                          >
                            View all in {country.name}
                          </Link>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCountries((prev) => ({
                                ...prev,
                                [country.countrySlug]: !isCountryExpanded,
                              }))
                            }
                            className="rounded-full border border-dark-border bg-input-bg px-3 py-1 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 hover:bg-primary/10"
                          >
                            {isCountryExpanded ? "Hide states" : "Show states"}
                          </button>
                          {isCountryExpanded &&
                            stateEntries.length > DEFAULT_STATE_PREVIEW_COUNT && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowAllStatesByCountry((prev) => ({
                                    ...prev,
                                    [country.countrySlug]: !showAllStates,
                                  }))
                                }
                                className="rounded-full border border-dark-border bg-input-bg px-3 py-1 text-xs font-medium text-text-gray-opacity transition-colors hover:text-primary-text"
                              >
                                {showAllStates ? "Show fewer states" : "Show all states"}
                              </button>
                            )}
                        </div>

                        {isCountryExpanded && (
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {statesToRender.length === 0 ? (
                              <div className="md:col-span-2 rounded-xl border border-dark-border bg-input-bg p-3 text-sm text-text-gray-opacity">
                                No city data is currently available for {country.name}.
                              </div>
                            ) : (
                              statesToRender.map((state) => {
                                const stateKey = `${country.countrySlug}/${state.stateSlug ?? "major-cities"}`;
                                const showAllCities = Boolean(
                                  showAllCitiesByState[stateKey],
                                );
                                const citiesToRender = showAllCities
                                  ? state.cities
                                  : state.cities.slice(0, DEFAULT_CITY_PREVIEW_COUNT);

                                return (
                                  <div
                                    key={stateKey}
                                    className="rounded-xl border border-dark-border bg-input-bg p-3"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="text-sm font-semibold text-primary-text md:text-base">
                                        {state.name}
                                      </h4>
                                      {state.cities.length > DEFAULT_CITY_PREVIEW_COUNT && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setShowAllCitiesByState((prev) => ({
                                              ...prev,
                                              [stateKey]: !showAllCities,
                                            }))
                                          }
                                          className="text-[11px] font-semibold text-primary underline underline-offset-2"
                                        >
                                          {showAllCities ? "Show less" : "Show all"}
                                        </button>
                                      )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {citiesToRender.map((city) => (
                                        <Link
                                          key={`${stateKey}/${city.citySlug}`}
                                          href={toCityQueryHref(
                                            country.countrySlug,
                                            city.citySlug,
                                            state.stateSlug,
                                          )}
                                          className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs text-primary-text transition-colors hover:border-primary/45 hover:bg-primary/20"
                                        >
                                          {city.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </section>
  );
}
