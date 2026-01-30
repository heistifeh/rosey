"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { SafeImage } from "@/components/ui/safe-image";
import { FooterSection } from "@/components/home/footer-section";
import type { Profile } from "@/types/types";

export type CityPageClientProps = {
  params?: {
    countrySlug: string;
    stateSlug?: string;
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

const formatSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildSearchHref = (city?: string, country?: string) => {
  const search = new URLSearchParams();
  if (country) search.set("country", country);
  if (city) search.set("city", city);
  return `/search${search.toString() ? `?${search.toString()}` : ""}`;
};

const buildEscortsHref = (city?: string, state?: string, country?: string) => {
  if (country && state && city) {
    return `/escorts/${country}/${state}/${city}`;
  }
  if (country && state) {
    return `/escorts/${country}/${state}`;
  }
  return buildSearchHref(city, country);
};

export function CityPageClient({ params }: CityPageClientProps) {
  const { countrySlug, stateSlug, citySlug } = params || {};

  const invalidParams = !citySlug || !countrySlug;
  const cityName = citySlug ? citySlug.replace(/-/g, " ") : "";
  const stateName = stateSlug ? stateSlug.replace(/-/g, " ") : "";
  const countryName = countrySlug ? countrySlug.replace(/-/g, " ") : "";

  const {
    data: organicProfiles = [],
    isLoading: loadingOrganic,
  } = useQuery<Profile[]>({
    queryKey: ["city-organic", countrySlug, stateSlug, citySlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.profiles.getCityProfiles({
          citySlug: citySlug!,
          stateSlug,
          countrySlug: countrySlug!,
        }),
    enabled: !invalidParams,
  });

  const {
    data: sponsoredProfiles = [],
    isLoading: loadingSponsored,
  } = useQuery<Profile[]>({
    queryKey: ["city-sponsored", countrySlug, stateSlug, citySlug],
    queryFn: () =>
      invalidParams
        ? Promise.resolve([])
        : apiBuilder.ads.getSponsoredProfilesForCity({
          citySlug: citySlug!,
          stateSlug,
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
      const sSlug = profile.state_slug;
      const coSlug = profile.country_slug;
      if (!cSlug || !coSlug) return;
      if (cSlug === citySlug && coSlug === countrySlug) return;

      const key = `${cSlug}-${sSlug ?? "none"}-${coSlug}`;
      if (seen.has(key)) return;
      seen.add(key);

      const labelState = sSlug ? `${formatSlug(cSlug)}, ${formatSlug(sSlug)}` : `${formatSlug(cSlug)}, ${formatSlug(coSlug)}`;
      locations.push({
        label: labelState,
        href: sSlug
          ? buildEscortsHref(cSlug, sSlug, coSlug)
          : buildSearchHref(cSlug, coSlug),
      });
    });

    const normalizedCountry = normalizeCountryKey(countrySlug);

    if (locations.length === 0 && normalizedCountry) {
      locations.push({
        label: `All escorts in ${formatSlug(countrySlug)}`,
        href: buildSearchHref(undefined, countrySlug),
      });
    }

    if (locations.length < 16) {
      const inferredCountry =
        normalizedCountry ||
        normalizeCountryKey(
          organicProfiles[0]?.country_slug ||
          sponsoredProfiles[0]?.country_slug,
        );

      const fallbackCities =
        (inferredCountry && FALLBACK_CITIES_BY_COUNTRY[inferredCountry]) ?? [];
      fallbackCities.forEach((city) => {
        if (locations.length >= 16) return;
        const key = `${city}-${inferredCountry}`;
        if (seen.has(key)) return;
        seen.add(key);
        locations.push({
          label: `${formatSlug(city)}, ${formatSlug(
            inferredCountry || countrySlug || "",
          )}`,
          href: buildSearchHref(city, inferredCountry),
        });
      });
    }

    return locations.slice(0, 16);
  }, [countrySlug, citySlug, invalidParams, organicProfiles, sponsoredProfiles]);

  const headingLocation = stateSlug
    ? `${cityName}, ${stateName}`
    : `${cityName}, ${countryName}`;
  const descriptionLocation = stateSlug
    ? `${cityName}, ${stateName}, ${countryName}`
    : `${cityName}, ${countryName}`;

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
                Escorts in {headingLocation}
              </h1>
              <p className="text-sm md:text-base text-text-gray-opacity">
                Browse verified escorts in {descriptionLocation}.
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
