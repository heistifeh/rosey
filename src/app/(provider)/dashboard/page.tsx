"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { ProfileVerificationChecklist } from "@/components/profile/profile-verification-checklist";

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  useCurrentUser();
  if (profileLoading) {
    return (
      <div className="flex flex-col gap-6 md:gap-8 items-center justify-center mx-auto px-4 md:px-[180px] pt-8">
        <div className="w-full max-w-5xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <DashboardCardSkeleton key={index} />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <BaseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const links = [
    "Getting Verified on Rosey",
    "Profile photo guidelines",
    "Promoting yourself",
    "Code of Conduct",
    "Advertising Policy",
  ];

  return (
    <div className=" flex items-center justify-center mx-auto ">
      <div className="mb-8 md:pt-10 w-full max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary-text mb-[33px] text-center">
            Welcome to Rosey
          </h1>
          <Link
            href="/"
            className="rounded-full border border-[#E5E5EA] px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary-bg transition-colors"
          >
            Back to home
          </Link>
        </div>
        <p className="text-base text-text-gray-opacity mb-6 max-w-3xl">
          Before we publish your profile, our team needs to verify a few things.
          Use these links to get started:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-10">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-input-bg flex items-center justify-center shrink-0">
                <span className="text-primary-text text-sm font-medium">
                  {index + 1}.
                </span>
              </div>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 text-sm md:text-base font-medium transition-colors underline"
              >
                {link}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm md:text-base text-text-gray-opacity mb-6 max-w-3xl">
          Once you've completed the tasks below, you can submit your profile for
          review and publication. Please ensure you have:
        </p>

        <div className="space-y-4">
          {profile ? (
            <ProfileVerificationChecklist profile={profile} />
          ) : (
            <p className="text-sm text-text-gray-opacity">Loading checklist…</p>
          )}
        </div>
      </div>
    </div>
  );
}
