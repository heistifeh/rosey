"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import type { Profile } from "@/types/types";

export type CityPageClientProps = {
  params?: {
    countrySlug: string;
    citySlug: string;
  };
};

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

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full flex-col gap-4 px-4 md:px-[60px] md:gap-10">
        <div className="flex flex-col gap-2">
          {invalidParams ? (
            <h1 className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
              Invalid city or country
            </h1>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                Escorts in {cityName}, {countryName}
              </h1>
              <p className="text-sm md:text-base text-text-gray-opacity">
                Browse verified escorts in {cityName}, {countryName}.
              </p>
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
                    className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-3 shadow-sm transition-opacity hover:opacity-90 md:p-4"
                  >
                    <div className="relative h-[200px] w-full overflow-hidden rounded-[16px]">
                      <Image
                        src={
                          profile.images?.[0]?.public_url || "/images/girl1.png"
                        }
                        alt={profile.working_name ?? "Profile"}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        priority={index < 4}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 pt-3 md:gap-[22px] md:pt-[22px]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-normal text-primary-text md:text-lg lg:text-[24px]">
                            {profile.working_name ?? "Provider"}
                          </p>
                          {isSponsored && (
                            <span className="rounded-full border border-primary bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Sponsored
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
                          {profile.base_currency}
                          {profile.base_hourly_rate}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        <span className="text-xs font-normal text-text-gray-opacity md:text-sm lg:text-[16px]">
                          {[profile.city, profile.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
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
    </section>
  );
}
