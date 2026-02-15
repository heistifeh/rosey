"use client";

import {
  MapPin,
  Search,
  SlidersHorizontal,
  Menu,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { City, Country, State } from "country-state-city";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { ProfileCard } from "@/components/profile-card";
import type { Profile } from "@/types/types";
import { FooterSection } from "@/components/home/footer-section";
import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";
import { cn } from "@/lib/utils";
import { slugifyLocation } from "@/lib/google-places";

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type SearchParamsState = {
  countrySlug?: string;
  citySlug?: string;
  ethnicity?: string;
  gender?: string;
  minRate?: number;
  maxRate?: number;
  catersTo?: string | string[];
  availableNow?: boolean;
};

type SearchResultsClientProps = {
  initialParams: SearchParamsState;
  initialPage?: number;
};

const genderOptions = ["All", "Female", "Male", "Trans", "Non-Binary"];
const PROFILES_PER_PAGE = 20;

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

const getStateNameFromSlug = (countryIsoCode: string, stateSlug?: string) => {
  if (!stateSlug) return null;
  const normalizedStateSlug = slugifyLocation(stateSlug);
  const state = State.getStatesOfCountry(countryIsoCode).find(
    (item) =>
      slugifyLocation(item.name) === normalizedStateSlug ||
      item.isoCode.toLowerCase() === normalizedStateSlug
  );
  return state?.name ?? null;
};

const getStateNameByCitySlug = (countryIsoCode: string, citySlug?: string) => {
  if (!citySlug) return null;
  const normalizedCitySlug = slugifyLocation(citySlug);
  const states = State.getStatesOfCountry(countryIsoCode);
  const matches: string[] = [];

  for (const state of states) {
    const cities = City.getCitiesOfState(countryIsoCode, state.isoCode) ?? [];
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

const getCitiesForState = (countryIsoCode: string, stateName: string) => {
  const targetStateSlug = slugifyLocation(stateName);
  const state = State.getStatesOfCountry(countryIsoCode).find(
    (item) =>
      slugifyLocation(item.name) === targetStateSlug ||
      item.isoCode.toLowerCase() === targetStateSlug
  );
  if (!state) return [];

  const uniqueCities = new Map<string, string>();
  (City.getCitiesOfState(countryIsoCode, state.isoCode) ?? []).forEach((city) => {
    const citySlug = slugifyLocation(city.name);
    if (!citySlug || uniqueCities.has(citySlug)) return;
    uniqueCities.set(citySlug, city.name);
  });

  return Array.from(uniqueCities.entries()).map(([citySlug, cityName]) => ({
    citySlug,
    cityName,
  }));
};

const getCitiesForCountry = (countryIsoCode: string) => {
  const uniqueCities = new Map<string, string>();
  (City.getCitiesOfCountry(countryIsoCode) ?? []).forEach((city) => {
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

export function SearchResultsClient({
  initialParams,
  initialPage = 1,
}: SearchResultsClientProps) {
  const router = useRouter();
  const [params, setParams] = useState<SearchParamsState>(initialParams);
  const [currentPage, setCurrentPage] = useState(
    Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    query,
    setQuery,
    results,
    isLoading: locationLoading,
  } = useLocationAutocomplete(
    initialParams.citySlug
      ? formatSlug(initialParams.citySlug)
      : initialParams.countrySlug
        ? formatSlug(initialParams.countrySlug)
        : "",
  );

  const [formState, setFormState] = useState({
    countrySlug: initialParams.countrySlug ?? "",
    citySlug: initialParams.citySlug ?? "",
    gender: initialParams.gender ?? "All",
    minRate: initialParams.minRate?.toString() ?? "",
    maxRate: initialParams.maxRate?.toString() ?? "",
    catersTo:
      (Array.isArray(initialParams.catersTo)
        ? initialParams.catersTo.join(",")
        : initialParams.catersTo) ?? "",
    availableNow: initialParams.availableNow ?? false,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setParams(initialParams);
    setCurrentPage(
      Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1
    );
    setFormState({
      countrySlug: initialParams.countrySlug ?? "",
      citySlug: initialParams.citySlug ?? "",
      gender: initialParams.gender ?? "All",
      minRate: initialParams.minRate?.toString() ?? "",
      maxRate: initialParams.maxRate?.toString() ?? "",
      catersTo:
        (Array.isArray(initialParams.catersTo)
          ? initialParams.catersTo.join(",")
          : initialParams.catersTo) ?? "",
      availableNow: initialParams.availableNow ?? false,
    });
  }, [initialParams, initialPage]);

  const enabled = true;

  const {
    data: organicProfiles = [],
    isLoading: loadingOrganic,
    isFetching: fetchingOrganic,
  } = useQuery<Profile[]>({
    queryKey: ["searchProfiles", params],
    queryFn: () => {
      // if (!params.countrySlug || !params.citySlug) {
      //   return Promise.resolve([]);
      // }

      return apiBuilder.profiles.searchProfiles({
        countrySlug: params.countrySlug,
        citySlug: params.citySlug,
        ethnicity: params.ethnicity,
        gender: params.gender,
        minRate: params.minRate,
        maxRate: params.maxRate,
        catersTo: params.catersTo,
        availableNow: params.availableNow,
      });
    },
    enabled,
  });

  const {
    data: sponsoredProfiles = [],
    isLoading: loadingSponsored,
    isFetching: fetchingSponsored,
  } = useQuery<Profile[]>({
    queryKey: ["searchSponsoredProfiles", params.countrySlug, params.citySlug],
    queryFn: () => {
      if (!params.countrySlug || !params.citySlug) {
        return Promise.resolve([]);
      }
      return apiBuilder.ads.getSponsoredProfilesForCity({
        citySlug: params.citySlug,
        countrySlug: params.countrySlug,
      });
    },
    enabled,
  });

  const sponsoredIds = useMemo(
    () => new Set(sponsoredProfiles.map((profile) => profile.id)),
    [sponsoredProfiles],
  );
  const organicWithoutSponsored = useMemo(
    () => organicProfiles.filter((profile) => !sponsoredIds.has(profile.id)),
    [organicProfiles, sponsoredIds],
  );
  const finalProfiles = useMemo(
    () => [...sponsoredProfiles, ...organicWithoutSponsored],
    [organicWithoutSponsored, sponsoredProfiles],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(finalProfiles.length / PROFILES_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProfiles = useMemo(() => {
    const start = (safeCurrentPage - 1) * PROFILES_PER_PAGE;
    return finalProfiles.slice(start, start + PROFILES_PER_PAGE);
  }, [finalProfiles, safeCurrentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const loading =
    loadingOrganic || fetchingOrganic || loadingSponsored || fetchingSponsored;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const countrySlug = formState.countrySlug.trim();
    const citySlug = formState.citySlug.trim();
    const gender = formState.gender === "All" ? undefined : formState.gender;

    const parsedMin = formState.minRate ? Number(formState.minRate) : undefined;
    const minRate =
      typeof parsedMin === "number" && !Number.isNaN(parsedMin)
        ? parsedMin
        : undefined;

    const parsedMax = formState.maxRate ? Number(formState.maxRate) : undefined;
    const maxRate =
      typeof parsedMax === "number" && !Number.isNaN(parsedMax)
        ? parsedMax
        : undefined;

    const catersToParts = formState.catersTo
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    let catersTo: string | string[] | undefined;
    if (catersToParts.length === 1) {
      catersTo = catersToParts[0];
    } else if (catersToParts.length > 1) {
      catersTo = catersToParts;
    }

    const nextParams: SearchParamsState = {
      countrySlug: countrySlug || undefined,
      citySlug: citySlug || undefined,
      ethnicity: params.ethnicity,
      gender,
      minRate,
      maxRate,
      catersTo,
      availableNow: formState.availableNow,
    };

    setParams(nextParams);

    const query = new URLSearchParams();
    if (nextParams.countrySlug) query.set("country", nextParams.countrySlug);
    if (nextParams.citySlug) query.set("city", nextParams.citySlug);
    if (nextParams.ethnicity) query.set("ethnicity", nextParams.ethnicity);
    if (nextParams.gender) query.set("gender", nextParams.gender);
    if (typeof minRate === "number") query.set("min", String(minRate));
    if (typeof maxRate === "number") query.set("max", String(maxRate));
    if (nextParams.catersTo) {
      const catersValue = Array.isArray(nextParams.catersTo)
        ? nextParams.catersTo.join(",")
        : nextParams.catersTo;
      if (catersValue) {
        query.set("catersTo", catersValue);
      }
    }
    if (nextParams.availableNow) query.set("availableNow", "true");

    const queryString = query.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
    setCurrentPage(1);
    setShowMoreFilters(false);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);

    const query = new URLSearchParams();
    if (params.countrySlug) query.set("country", params.countrySlug);
    if (params.citySlug) query.set("city", params.citySlug);
    if (params.ethnicity) query.set("ethnicity", params.ethnicity);
    if (params.gender && params.gender !== "All") query.set("gender", params.gender);
    if (typeof params.minRate === "number") query.set("min", String(params.minRate));
    if (typeof params.maxRate === "number") query.set("max", String(params.maxRate));
    if (params.catersTo) {
      const catersValue = Array.isArray(params.catersTo)
        ? params.catersTo.join(",")
        : params.catersTo;
      if (catersValue) query.set("catersTo", catersValue);
    }
    if (params.availableNow) query.set("availableNow", "true");
    if (nextPage > 1) query.set("page", String(nextPage));

    const queryString = query.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const showEmptyState = enabled && !loading && finalProfiles.length === 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const relatedCities = useMemo(() => {
    const seen = new Set<string>();
    const locations: { label: string; href: string }[] = [];
    const genderQuery =
      params.gender && params.gender !== "All" ? params.gender : undefined;
    const mergedProfiles = [...sponsoredProfiles, ...organicProfiles];
    const randomSeedBase = `${params.countrySlug || ""}:${params.citySlug || ""}:${params.ethnicity || ""}:${params.gender || ""}`;

    const buildHref = (citySlug?: string, countrySlug?: string) => {
      const search = new URLSearchParams();
      if (countrySlug) search.set("country", countrySlug);
      if (citySlug) search.set("city", citySlug);
      if (params.ethnicity) search.set("ethnicity", params.ethnicity);
      if (genderQuery) search.set("gender", genderQuery);
      return `/search${search.toString() ? `?${search.toString()}` : ""}`;
    };

    const addLocation = (citySlug: string, countrySlug: string, cityName?: string) => {
      if (!citySlug || !countrySlug) return;
      if (params.citySlug && citySlug === params.citySlug) return;

      const key = `${citySlug}-${countrySlug}`;
      if (seen.has(key)) return;
      seen.add(key);

      locations.push({
        label: `${cityName || formatSlug(citySlug)}, ${formatSlug(countrySlug)}`,
        href: buildHref(citySlug, countrySlug),
      });
    };

    mergedProfiles.forEach((profile) => {
      const citySlug = profile.city_slug;
      const countrySlug = profile.country_slug;
      if (!citySlug || !countrySlug) return;
      addLocation(citySlug, countrySlug);
    });

    const normalizedCountry = normalizeCountryKey(params.countrySlug);
    const inferredCountrySlug =
      params.countrySlug ||
      mergedProfiles.find((profile) => profile.country_slug)?.country_slug ||
      normalizedCountry;

    let targetStateName: string | null = null;

    if (locations.length < 16 && inferredCountrySlug) {
      const countryIsoCode = getCountryIsoCode(inferredCountrySlug);
      if (countryIsoCode) {
        const selectedStateFromProfileRaw = params.citySlug
          ? mergedProfiles.find(
              (profile) =>
                profile.city_slug === params.citySlug &&
                (!params.countrySlug || profile.country_slug === params.countrySlug) &&
                profile.state
            )?.state ?? null
          : null;
        const selectedStateFromProfiles =
          typeof selectedStateFromProfileRaw === "string"
            ? selectedStateFromProfileRaw
            : null;
        const selectedStateFromSlug = params.citySlug
          ? getStateNameFromSlug(countryIsoCode, params.citySlug)
          : null;
        const selectedStateFromCitySlug = params.citySlug
          ? getStateNameByCitySlug(countryIsoCode, params.citySlug)
          : null;
        targetStateName =
          selectedStateFromProfiles ||
          selectedStateFromSlug ||
          selectedStateFromCitySlug;

        if (targetStateName) {
          seededShuffle(
            getCitiesForState(countryIsoCode, targetStateName),
            `${randomSeedBase}:state:${targetStateName}`
          ).forEach((item) => {
            if (locations.length >= 16) return;
            addLocation(item.citySlug, inferredCountrySlug, item.cityName);
          });
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
          organicProfiles[0]?.country_slug || sponsoredProfiles[0]?.country_slug
        );

      const fallbackCities = inferredCountry
        ? FALLBACK_CITIES_BY_COUNTRY[inferredCountry] ?? []
        : [];
      fallbackCities.forEach((citySlug) => {
        if (locations.length >= 16) return;
        const fallbackCountrySlug = inferredCountrySlug || inferredCountry;
        if (!fallbackCountrySlug) return;
        addLocation(citySlug, fallbackCountrySlug);
      });
    }

    return locations.slice(0, 16);
  }, [organicProfiles, params.citySlug, params.ethnicity, params.gender, params.countrySlug, sponsoredProfiles]);

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 pt-0 md:pb-16">
      {/* Header / Navigation */}
      <header className="flex px-4 py-4 md:px-[60px] md:py-6 bg-[#0f0f10]">
        <div className="w-full md:hidden">
          <section className="flex w-full items-center justify-between rounded-[200px] bg-primary-text px-4 py-3">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Rosey"
                width={47}
                height={25}
                priority
              />
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a]"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </section>
          {isMobileMenuOpen && (
            <div className="mt-3 rounded-[24px] bg-primary-text p-4 shadow-lg z-50 relative">
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-[#8E8E93]"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="rounded-[200px] bg-tag-bg px-4 py-2 text-sm font-medium text-primary-text"
                >
                  Blog
                </Link>
              </div>
            </div>
          )}
        </div>

        <section className="hidden w-full items-center justify-between md:flex">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Rosey"
              width={121}
              height={35}
              className="h-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-base font-medium text-[#8E8E93] hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-base font-medium text-[#8E8E93] hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>
        </section>
      </header>

      <div className="mx-auto flex w-full flex-col gap-6 px-4 md:px-[60px] pt-10">
        <div className="flex flex-col gap-6 ">
          <div className="mb-2 flex flex-col gap-1 md:gap-2 text-center">
            <h1 className="text-2xl font-bold text-primary-text md:text-4xl">
              {params.citySlug
                ? `Find independent escorts in ${formatSlug(params.citySlug)}`
                : params.countrySlug
                  ? `Find independent escorts in ${formatSlug(params.countrySlug)}`
                  : "Find independent escorts"}
            </h1>
            <p className="text-xs font-normal text-white md:text-sm">
              {params.citySlug
                ? "Fast, real, and unforgettable. Explore escorts, BDSM, kink, video, massage, and more."
                : params.countrySlug
                  ? "Fast, real, and unforgettable. Explore escorts, BDSM, kink, video, massage, and more."
                  : "Fast, real, and unforgettable. Explore escorts, BDSM, kink, video, massage, and more."}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-[24px] bg-primary-bg p-3 shadow-sm md:p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="relative flex flex-col gap-1 z-50">
                <span className="text-sm text-text-gray-opacity">Location</span>
                <div className="relative" ref={wrapperRef}>
                  <div className="relative flex items-center rounded-[12px] bg-input-bg px-3 py-2 border border-dark-border focus-within:border-primary transition-colors">
                    <Search className="mr-2 h-4 w-4 text-text-gray-opacity" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="City or country"
                      className="flex-1 bg-transparent text-base md:text-sm text-primary-text placeholder:text-text-gray-opacity focus:outline-none min-w-0"
                    />
                    {locationLoading && (
                      <div className="ml-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {showSuggestions && results.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-[12px] border border-dark-border bg-primary-bg shadow-xl z-50 max-h-[300px] overflow-y-auto">
                      {results.map((result) => (
                        <button
                          key={result.placeId}
                          type="button"
                          onClick={() => {
                            setFormState((prev) => ({
                              ...prev,
                              citySlug: result.city_slug,
                              countrySlug: result.country_slug,
                            }));
                            setQuery(result.fullLabel);
                            setShowSuggestions(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-input-bg"
                        >
                          <MapPin className="h-3 w-3 min-w-[12px] text-text-gray-opacity" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-primary-text truncate">
                              {result.city}, {result.country}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  aria-expanded={showMoreFilters}
                  aria-controls="search-advanced-filters"
                  onClick={() => setShowMoreFilters((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm font-medium text-primary-text"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showMoreFilters ? "Hide filters" : "More filters"}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-primary-text hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>

              <div
                id="search-advanced-filters"
                className={cn(
                  "gap-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:items-end",
                  showMoreFilters ? "grid grid-cols-1" : "hidden",
                )}
              >
                <label className="flex flex-col gap-1 z-10">
                  <span className="text-sm text-text-gray-opacity">Gender</span>
                  <select
                    value={formState.gender}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        gender: event.target.value,
                      }))
                    }
                    className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text focus:border-primary focus:outline-none"
                  >
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 z-10">
                  <span className="text-sm text-text-gray-opacity">Min rate</span>
                  <input
                    type="number"
                    min={0}
                    value={formState.minRate}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        minRate: event.target.value,
                      }))
                    }
                    className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity focus:border-primary focus:outline-none"
                    placeholder="e.g. 100"
                  />
                </label>

                <label className="flex flex-col gap-1 z-10">
                  <span className="text-sm text-text-gray-opacity">Max rate</span>
                  <input
                    type="number"
                    min={0}
                    value={formState.maxRate}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        maxRate: event.target.value,
                      }))
                    }
                    className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity focus:border-primary focus:outline-none"
                    placeholder="e.g. 300"
                  />
                </label>

                <label className="flex flex-col gap-1 z-10">
                  <span className="text-sm text-text-gray-opacity">
                    Caters to
                  </span>
                  <input
                    type="text"
                    value={formState.catersTo}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        catersTo: event.target.value,
                      }))
                    }
                    className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity focus:border-primary focus:outline-none"
                    placeholder="e.g. Male,Couples"
                  />
                </label>

                <div className="hidden items-end z-0 md:flex">
                  <button
                    type="submit"
                    className="w-full rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-primary-text hover:bg-primary/90 transition-colors"
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4 border-b border-dark-border pb-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-bold text-primary-text">
              {params.citySlug
                ? `${formatSlug(params.citySlug)} escorts`
                : params.countrySlug
                  ? `${formatSlug(params.countrySlug)} escorts`
                  : "All Profiles"}
            </h2>
            <span className="text-sm text-text-gray-opacity">
              Listing {finalProfiles.length} profile
              {finalProfiles.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
              <BaseCardSkeleton key={index} />
            ))
            : paginatedProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isSponsored={sponsoredIds.has(profile.id)}
              />
            ))}

          {showEmptyState && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No results
            </div>
          )}
        </div>
        {!loading && totalPages > 1 && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              className="rounded-[10px] border border-dark-border bg-primary-bg px-3 py-2 text-xs text-primary-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1)
              .filter((page) =>
                Math.abs(page - safeCurrentPage) <= 1 ||
                page === 1 ||
                page === totalPages
              )
              .map((page, idx, pages) => {
                const prev = pages[idx - 1];
                const showGap = prev && page - prev > 1;
                return (
                  <div key={`page-wrap-${page}`} className="flex items-center gap-2">
                    {showGap && <span className="text-xs text-text-gray-opacity">…</span>}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "rounded-[10px] border px-3 py-2 text-xs",
                        page === safeCurrentPage
                          ? "border-primary bg-primary text-primary-text"
                          : "border-dark-border bg-primary-bg text-primary-text"
                      )}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="rounded-[10px] border border-dark-border bg-primary-bg px-3 py-2 text-xs text-primary-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
      <FooterSection
        relatedLocations={relatedCities}
        relatedHeading="Related cities"
        relatedDescription="Explore other nearby cities to find more providers."
      />
    </section>
  );
}
