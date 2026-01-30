"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { FooterSection } from "@/components/home/footer-section";
import type { Profile } from "@/types/types";

export type StatePageClientProps = {
  params?: {
    countrySlug: string;
    stateSlug: string;
  };
};

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function StatePageClient({ params }: StatePageClientProps) {
  const { countrySlug, stateSlug } = params || {};

  const invalidParams = !stateSlug || !countrySlug;
  const stateName = stateSlug ? stateSlug.replace(/-/g, " ") : "";
  const countryName = countrySlug ? countrySlug.replace(/-/g, " ") : "";

  const {
    data: organicProfiles = [],
    isLoading: loadingOrganic,
  } = useQuery<Profile[]>({
    queryKey: ["state-organic", countrySlug, stateSlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.profiles.getStateProfiles({
          stateSlug: stateSlug!,
          countrySlug: countrySlug!,
        }),
    enabled: !invalidParams,
  });

  const {
    data: sponsoredProfiles = [],
    isLoading: loadingSponsored,
  } = useQuery<Profile[]>({
    queryKey: ["state-sponsored", countrySlug, stateSlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.ads.getSponsoredProfilesForState({
          stateSlug: stateSlug!,
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

    [...sponsoredProfiles, ...organicProfiles].forEach((profile) => {
      const cSlug = profile.city_slug;
      const sSlug = profile.state_slug ?? stateSlug;
      const coSlug = profile.country_slug ?? countrySlug;
      if (!cSlug || !sSlug || !coSlug) return;

      const key = `${cSlug}-${sSlug}-${coSlug}`;
      if (seen.has(key)) return;
      seen.add(key);

      locations.push({
        label: `${formatSlug(cSlug)}, ${formatSlug(sSlug)}`,
        href: `/escorts/${coSlug}/${sSlug}/${cSlug}`,
      });
    });

    return locations.slice(0, 16);
  }, [countrySlug, invalidParams, organicProfiles, sponsoredProfiles, stateSlug]);

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full flex-col gap-4 px-4 md:px-[60px] md:gap-10">
        <div className="flex flex-col gap-2">
          {invalidParams ? (
            <h1 className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
              Invalid state or country
            </h1>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                Escorts in {stateName}, {countryName}
              </h1>
              <p className="text-sm md:text-base text-text-gray-opacity">
                Browse verified escorts in {stateName}, {countryName}.
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
                    <SafeImage
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
                  </div>
                </Link>
              );
            })}

          {!isLoading && finalProfiles.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No escorts found in this state yet.
            </div>
          )}
        </div>
      </div>
      <FooterSection
        relatedLocations={relatedCities}
        relatedHeading="Cities in this state"
        relatedDescription="Explore cities in this state and find more providers nearby."
      />
    </section>
  );
}
