"use client";

import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { ProfileCard } from "@/components/profile-card";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import type { Profile } from "@/types/types";

type Props = {
  ethnicity: string;
  label: string;
};

export function EthnicityPageClient({ ethnicity, label }: Props) {
  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["ethnicity-profiles", ethnicity],
    queryFn: () =>
      apiBuilder.profiles.searchProfiles({ ethnicity: label }),
  });

  return (
    <section className="relative z-10 w-full bg-input-bg pb-12 md:pb-16">
      <Header />
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-8 md:px-[60px] md:gap-10 md:pt-12">
        <div className="rounded-[20px] border border-dark-border bg-primary-bg/70 p-4 md:rounded-[24px] md:p-6">
          <h1 className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
            {label} Escorts
          </h1>
          <p className="mt-1 text-sm text-text-gray-opacity md:text-base">
            Browse verified independent {label.toLowerCase()} escort profiles worldwide.
          </p>
          {!isLoading && (
            <p className="mt-3 text-xs text-text-gray-opacity md:text-sm">
              {profiles.length} profile{profiles.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <BaseCardSkeleton key={i} />
              ))
            : profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}

          {!isLoading && profiles.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No {label.toLowerCase()} escorts found yet.
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </section>
  );
}
