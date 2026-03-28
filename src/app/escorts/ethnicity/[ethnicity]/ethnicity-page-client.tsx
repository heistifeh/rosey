"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { apiBuilder } from "@/api/builder";
import { ProfileCard } from "@/components/profile-card";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { EthnicitySeoContent } from "@/components/seo/ethnicity-seo-content";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/types";

type Props = {
  ethnicity: string;
  label: string;
};

const PROFILES_PER_PAGE = 20;

export function EthnicityPageClient({ ethnicity, label }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["ethnicity-profiles", ethnicity],
    queryFn: () => apiBuilder.profiles.searchProfiles({ ethnicity: label }),
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
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const query = new URLSearchParams();
    if (nextPage > 1) query.set("page", String(nextPage));
    const qs = query.toString();
    router.push(`/escorts/ethnicity/${ethnicity}${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 md:pb-16">
      <Header />
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-8 md:px-[60px] md:gap-10 md:pt-12">

        {/* ── Header card ── */}
        <div className="rounded-[20px] border border-dark-border bg-primary-bg/70 p-4 md:rounded-[24px] md:p-6">
          <h1 className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
            {label} Escorts Near You – Verified {label} Escort Directory
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-gray-opacity md:text-base">
            Looking for {label.toLowerCase()} escorts near you or browsing verified{" "}
            {label.toLowerCase()} call girl listings with updated profiles? Browse
            independent {label.toLowerCase()} escorts worldwide — filtered by location,
            availability, and recent activity.
          </p>
          {!isLoading && (
            <p className="mt-3 text-xs text-text-gray-opacity md:text-sm">
              {profiles.length} profile{profiles.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* ── Profile grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <BaseCardSkeleton key={i} />)
            : pagedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}

          {!isLoading && profiles.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No {label.toLowerCase()} escorts found yet.
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
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
        <EthnicitySeoContent label={label} ethnicitySlug={ethnicity} />

      </div>
      <FooterSection />
    </section>
  );
}
