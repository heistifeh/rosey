"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { FooterSection } from "@/components/home/footer-section";
import { Header } from "@/components/layout/header";
import { ProfileCard } from "@/components/profile-card";
import { EthnicityLocationSeoContent } from "@/components/seo/ethnicity-location-seo-content";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  ethnicitySlug: string;
  ethnicityLabel: string;
  countrySlug: string;
  citySlug?: string;
  stateSlug?: string;
  initialPage?: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILES_PER_PAGE = 20;

// ─── Formatting ───────────────────────────────────────────────────────────────

const formatSlug = (slug?: string) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const buildLocationLine = (...parts: Array<string | undefined>) =>
  parts
    .filter((p): p is string => Boolean(p))
    .map(formatSlug)
    .join(", ");

// ─── Component ────────────────────────────────────────────────────────────────

export function EthnicityLocationPageClient({
  ethnicitySlug,
  ethnicityLabel,
  countrySlug,
  citySlug,
  stateSlug,
  initialPage = 1,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1,
  );

  const locationLine = buildLocationLine(citySlug, stateSlug, countrySlug);

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["ethnicity-location-profiles", ethnicityLabel, countrySlug, stateSlug, citySlug],
    queryFn: () =>
      apiBuilder.profiles.searchProfiles({
        ethnicity: ethnicityLabel,
        countrySlug,
        citySlug,
        stateSlug,
      }),
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(profiles.length / PROFILES_PER_PAGE)),
    [profiles.length],
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedProfiles = useMemo(() => {
    const start = (safeCurrentPage - 1) * PROFILES_PER_PAGE;
    return profiles.slice(start, start + PROFILES_PER_PAGE);
  }, [profiles, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(
      Number.isFinite(initialPage) && initialPage > 0
        ? Math.floor(initialPage)
        : 1,
    );
  }, [initialPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === safeCurrentPage) return;
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nextQuery = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) {
      nextQuery.set("page", String(nextPage));
    } else {
      nextQuery.delete("page");
    }
    const qs = nextQuery.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // Related links: same ethnicity in other major locations
  const relatedLocations = useMemo(() => {
    const cities = [
      { label: "London, United Kingdom", countrySlug: "united-kingdom", citySlug: "london" },
      { label: "Miami, United States", countrySlug: "united-states", citySlug: "miami" },
      { label: "Dubai, United Arab Emirates", countrySlug: "united-arab-emirates", citySlug: "dubai" },
      { label: "Toronto, Canada", countrySlug: "canada", citySlug: "toronto" },
      { label: "Sydney, Australia", countrySlug: "australia", citySlug: "sydney" },
      { label: "Lagos, Nigeria", countrySlug: "nigeria", citySlug: "lagos" },
      { label: "Paris, France", countrySlug: "france", citySlug: "paris" },
      { label: "Bangkok, Thailand", countrySlug: "thailand", citySlug: "bangkok" },
      { label: "Amsterdam, Netherlands", countrySlug: "netherlands", citySlug: "amsterdam" },
      { label: "Nairobi, Kenya", countrySlug: "kenya", citySlug: "nairobi" },
    ].filter(
      (c) =>
        !(c.countrySlug === countrySlug && c.citySlug === citySlug),
    );

    return cities.map((c) => ({
      label: c.label,
      href: `/escorts/ethnicity/${ethnicitySlug}/${c.countrySlug}/${c.citySlug}`,
    }));
  }, [ethnicitySlug, countrySlug, citySlug]);

  // Breadcrumb segments
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: `${ethnicityLabel} Escorts`, href: `/escorts/ethnicity/${ethnicitySlug}` },
    {
      label: formatSlug(countrySlug),
      href: `/escorts/ethnicity/${ethnicitySlug}/${countrySlug}`,
    },
    ...(stateSlug && !citySlug
      ? [
          {
            label: formatSlug(stateSlug),
            href: `/escorts/ethnicity/${ethnicitySlug}/${countrySlug}/${stateSlug}`,
          },
        ]
      : []),
    ...(citySlug
      ? [
          {
            label: formatSlug(citySlug),
            href: pathname,
          },
        ]
      : []),
  ];

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 md:pb-16">
      <Header />
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-8 md:px-[60px] md:gap-10 md:pt-12">

        {/* Header card */}
        <div className="rounded-[20px] border border-dark-border bg-primary-bg/70 p-4 md:rounded-[24px] md:p-6">
          {/* Breadcrumbs */}
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-text-gray-opacity">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {idx > 0 && <span>/</span>}
                {idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-primary-text transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary-text">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
            {ethnicityLabel} Escorts in {locationLine} – Verified Independent Listings
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-gray-opacity md:text-base">
            Browse verified independent {ethnicityLabel.toLowerCase()} escort profiles in{" "}
            {locationLine} — filtered by ethnicity and location so every result is relevant to your search.
          </p>
          {!isLoading && (
            <p className="mt-3 text-xs text-text-gray-opacity md:text-sm">
              {profiles.length} profile{profiles.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Profile grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <BaseCardSkeleton key={i} />)
            : pagedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}

          {!isLoading && profiles.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No {ethnicityLabel.toLowerCase()} escorts found in {locationLine} yet.
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
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
              .filter(
                (page) =>
                  Math.abs(page - safeCurrentPage) <= 1 ||
                  page === 1 ||
                  page === totalPages,
              )
              .map((page, idx, pages) => {
                const prev = pages[idx - 1];
                const showGap = prev && page - prev > 1;
                return (
                  <div key={`page-wrap-${page}`} className="flex items-center gap-2">
                    {showGap && (
                      <span className="text-xs text-text-gray-opacity">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "rounded-[10px] border px-3 py-2 text-xs",
                        page === safeCurrentPage
                          ? "border-primary bg-primary text-primary-text"
                          : "border-dark-border bg-primary-bg text-primary-text",
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

        {/* ── SEO content + FAQ ── */}
        <EthnicityLocationSeoContent
          label={ethnicityLabel}
          ethnicitySlug={ethnicitySlug}
          countrySlug={countrySlug}
          countryName={formatSlug(countrySlug)}
          stateSlug={stateSlug}
          stateName={stateSlug ? formatSlug(stateSlug) : undefined}
          citySlug={citySlug}
          cityName={citySlug ? formatSlug(citySlug) : undefined}
        />

      </div>

      <FooterSection
        relatedLocations={relatedLocations}
        relatedHeading={`${ethnicityLabel} escorts in other cities`}
        relatedDescription={`Explore ${ethnicityLabel.toLowerCase()} escort profiles in cities worldwide.`}
      />
    </section>
  );
}
