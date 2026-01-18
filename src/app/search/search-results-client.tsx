"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { ProfileCard } from "@/components/profile-card";
import type { Profile } from "@/types/types";

type SearchParamsState = {
  countrySlug?: string;
  citySlug?: string;
  gender?: string;
  minRate?: number;
  maxRate?: number;
  catersTo?: string | string[];
};

type SearchResultsClientProps = {
  initialParams: SearchParamsState;
};

const genderOptions = ["All", "Female", "Male", "Trans", "Non-Binary"];

export function SearchResultsClient({ initialParams }: SearchResultsClientProps) {
  const router = useRouter();
  const [params, setParams] = useState<SearchParamsState>(initialParams);
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
  });

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
    });
  }, [initialParams]);

  const enabled = useMemo(
    () => Boolean(params.countrySlug && params.citySlug),
    [params.citySlug, params.countrySlug]
  );

  const {
    data: organicProfiles = [],
    isLoading: loadingOrganic,
    isFetching: fetchingOrganic,
  } = useQuery<Profile[]>({
    queryKey: ["searchProfiles", params],
    queryFn: () => {
      if (!params.countrySlug || !params.citySlug) {
        return Promise.resolve([]);
      }

      return apiBuilder.profiles.searchProfiles({
        countrySlug: params.countrySlug,
        citySlug: params.citySlug,
        gender: params.gender,
        minRate: params.minRate,
        maxRate: params.maxRate,
        catersTo: params.catersTo,
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
    [sponsoredProfiles]
  );
  const organicWithoutSponsored = useMemo(
    () => organicProfiles.filter((profile) => !sponsoredIds.has(profile.id)),
    [organicProfiles, sponsoredIds]
  );
  const finalProfiles = useMemo(
    () => [...sponsoredProfiles, ...organicWithoutSponsored],
    [organicWithoutSponsored, sponsoredProfiles]
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

    const queryString = query.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const showEmptyState = enabled && !loading && finalProfiles.length === 0;

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 md:px-[60px]">
        <div className="flex flex-col gap-3 rounded-[24px] bg-primary-bg p-4 shadow-sm md:p-6">
          <h1 className="text-xl font-semibold text-primary-text md:text-2xl">
            Search with filters
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6"
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm text-text-gray-opacity">Country slug</span>
              <input
                type="text"
                value={formState.countrySlug}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    countrySlug: event.target.value,
                  }))
                }
                className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity focus:border-primary focus:outline-none"
                placeholder="e.g. united-states"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-text-gray-opacity">City slug</span>
              <input
                type="text"
                value={formState.citySlug}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    citySlug: event.target.value,
                  }))
                }
                className="w-full rounded-[12px] border border-dark-border bg-input-bg px-3 py-2 text-sm text-primary-text placeholder:text-text-gray-opacity focus:border-primary focus:outline-none"
                placeholder="e.g. chicago"
              />
            </label>

            <label className="flex flex-col gap-1">
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

            <label className="flex flex-col gap-1">
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

            <label className="flex flex-col gap-1">
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

            <label className="flex flex-col gap-1">
              <span className="text-sm text-text-gray-opacity">Caters to</span>
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

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-primary-text hover:bg-primary/90 transition-colors"
              >
                Apply filters
              </button>
            </div>
          </form>
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

          {!enabled && !loading && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              Enter a country and city to search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
