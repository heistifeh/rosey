"use client";

import Link from "next/link";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { ProfileVerificationChecklist } from "@/components/profile/profile-verification-checklist";

const VERIFICATION_FEE_USD = 500;

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

        {profile && !isVerified && (
          <section className="mb-8 rounded-2xl border border-primary/40 bg-[#1b1216] p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldAlert className="h-4 w-4" />
                  Verification Pending
                </div>
                <h2 className="text-lg font-semibold text-primary-text md:text-xl">
                  Pay to get verified
                </h2>
                <p className="max-w-2xl text-sm text-text-gray-opacity md:text-base">
                  Verified profiles build more trust and stand out in listings. The
                  verification fee is{" "}
                  <span className="font-semibold text-primary-text">
                    ${VERIFICATION_FEE_USD}
                  </span>
                  .
                </p>
              </div>
              <Link
                href="/dashboard/wallet?verification=1"
                className="inline-flex w-full items-center justify-center rounded-[200px] bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 md:w-auto"
              >
                Pay ${VERIFICATION_FEE_USD} to Get Verified
              </Link>
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
