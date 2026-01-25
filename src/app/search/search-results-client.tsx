"use client";

import {
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Circle,
  Menu,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { ProfileCard } from "@/components/profile-card";
import type { Profile } from "@/types/types";

import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type SearchParamsState = {
  countrySlug?: string;
  citySlug?: string;
  gender?: string;
  minRate?: number;
  maxRate?: number;
  catersTo?: string | string[];
  availableNow?: boolean;
};

type SearchResultsClientProps = {
  initialParams: SearchParamsState;
};

const genderOptions = ["All", "Female", "Male", "Trans", "Non-Binary"];

export function SearchResultsClient({
  initialParams,
}: SearchResultsClientProps) {
  const router = useRouter();
  const [params, setParams] = useState<SearchParamsState>(initialParams);
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
  }, [initialParams]);

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
  };

  const showEmptyState = enabled && !loading && finalProfiles.length === 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="mb-2 flex flex-col gap-1 md:gap-2">
            <h1 className="text-2xl font-bold text-primary-text md:text-4xl">
              {params.citySlug
                ? `Find Independent Escorts in ${formatSlug(params.citySlug)}`
                : params.countrySlug
                  ? `Find Independent Escorts in ${formatSlug(params.countrySlug)}`
                  : "Find Independent Escorts"}
            </h1>
            <p className="text-xs font-normal text-text-white md:text-sm">
              {params.citySlug
                ? `Discover all the adult entertainers in ${formatSlug(params.citySlug)}. From Escorts, BDSM, Kink, Video, Massage and much more.`
                : params.countrySlug
                  ? `Discover all the adult entertainers in ${formatSlug(params.countrySlug)}. From Escorts, BDSM, Kink, Video, Massage and much more.`
                  : "Discover adult entertainers worldwide. From Escorts, BDSM, Kink, Video, Massage and much more."}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-[24px] bg-primary-bg p-3 shadow-sm md:p-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6 items-end"
            >
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
                      className="flex-1 bg-transparent text-sm text-primary-text placeholder:text-text-gray-opacity focus:outline-none min-w-0"
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

              <div className="flex items-end z-0">
                <button
                  type="submit"
                  className="w-full rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-primary-text hover:bg-primary/90 transition-colors"
                >
                  Apply filters
                </button>
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <BaseCardSkeleton key={index} />
              ))
            : finalProfiles.map((profile) => (
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
      </div>
    </section>
  );
}
