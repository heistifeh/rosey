"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";


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

  const profileDetails = profile
    ? [
        { label: "Name", value: profile.working_name || "Not set" },
        {
          label: "Location",
          value:
            [profile.city, profile.country].filter(Boolean).join(", ") ||
            "Not set",
        },
        {
          label: "Base rate",
          value:
            typeof profile.base_hourly_rate === "number"
              ? `${profile.base_currency || "$"}${profile.base_hourly_rate}/hr`
              : "Not set",
        },
        { label: "Gender", value: profile.gender || "Not set" },
        {
          label: "Ethnicity",
          value: profile.ethnicity_category || "Not set",
        },
        {
          label: "Approval status",
          value: profile.approval_status || "Pending",
        },
      ]
    : [];
  const isVerified = Boolean(profile?.is_fully_verified);


  return (
    <div className="flex justify-center mx-auto">
      <div className="mb-8 pt-4 md:pt-10 w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-primary-text sm:text-2xl">
            Welcome to Rosey
          </h1>
          <Link
            href="/"
            className="self-start rounded-full border border-[#E5E5EA] px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary-bg transition-colors sm:self-auto shrink-0"
          >
            Back to home
          </Link>
        </div>
        <p className="text-sm md:text-base text-text-gray-opacity mb-6 max-w-3xl">
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

        {profile && (
          <section className="mb-8 rounded-2xl border border-dark-border bg-primary-bg p-4 md:p-5">
            <h2 className="mb-4 text-base font-semibold text-primary-text md:text-lg">
              Profile Snapshot
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {profileDetails.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-dark-border bg-input-bg p-3"
                >
                  <p className="text-xs uppercase tracking-wide text-text-gray-opacity">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-primary-text">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}


        {profile && isVerified && (
          <section className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-primary-text md:text-lg">
                  Your profile is verified
                </h2>
                <p className="text-sm text-text-gray-opacity">
                  Your verified badge is now visible on profile cards and listings.
                </p>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
