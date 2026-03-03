"use client";

import Link from "next/link";
import { BadgeCheck, ShieldAlert, Upload, Zap } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";
import { useWallet } from "@/hooks/use-wallet";
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";


const VERIFICATION_FEE_USD = 500;
const VERIFICATION_FEE_CREDITS = 500;

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPayingVerification, setIsPayingVerification] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { wallet, refetch: refetchWallet, isLoading: walletLoading } = useWallet();
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
  const availableCredits = wallet?.balance_credits ?? 0;
  const hasEnoughCreditsForVerification = availableCredits >= VERIFICATION_FEE_CREDITS;

  const routeToBuyCredits = () => {
    router.push("/dashboard/wallet?verification=1");
  };

  const handlePayForVerification = async () => {
    if (isPayingVerification) return;

    setIsPayingVerification(true);
    try {
      const response = await fetch("/api/verification/pay", {
        method: "POST",
        credentials: "same-origin",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            error?: string;
            alreadyPaid?: boolean;
            required?: number;
            available?: number;
          }
        | null;

      if (!response.ok || !payload?.ok) {
        if (payload?.error === "NOT_ENOUGH_CREDITS") {
          routeToBuyCredits();
          return;
        }

        if (payload?.error === "ALREADY_VERIFIED") {
          toast("Your profile is already verified.");
          return;
        }

        toast.error(payload?.error || "Unable to process verification payment.");
        return;
      }

      if (payload.alreadyPaid) {
        toast.success("Verification fee already paid.");
      } else {
        toast.success("Verification fee paid successfully.");
      }
      refetchWallet();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error("Verification payment failed", error);
      toast.error("Unable to process verification payment.");
    } finally {
      setIsPayingVerification(false);
    }
  };

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
          <section className="mb-8 rounded-2xl border border-primary/40 bg-[#1b1216] p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Verification Pending
              </span>
            </div>
            <h2 className="text-lg font-semibold text-primary-text md:text-xl mb-1">
              Get Verified to Publish Your Profile
            </h2>
            <p className="text-sm text-text-gray-opacity mb-6 max-w-2xl">
              Verified profiles build trust and stand out in listings. Choose the
              path that works best for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free path */}
              <div className="flex flex-col gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    ✓ Free — Recommended
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary-text mb-1">
                    Standard Verification
                  </h3>
                  <p className="text-xs text-text-gray-opacity mb-3">
                    Submit the required documents and we'll review within 24–72 hours.
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-text-gray-opacity">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      Verification photo (selfie meeting our guidelines)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      Valid government-issued ID (passport, license, or national ID)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      At least 3 approved profile photos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      All required profile fields completed
                    </li>
                  </ul>
                </div>
                <Link
                  href="/verify-identity"
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-[200px] bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <Upload className="h-4 w-4" />
                  Upload Documents to Verify for Free
                </Link>
              </div>

              {/* Paid fast-track */}
              <div className="flex flex-col gap-4 rounded-xl border border-dark-border bg-primary-bg p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    ⚡ Fast-Track — ${VERIFICATION_FEE_USD} one-time
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary-text mb-1">
                    Paid Verification (No ID Required)
                  </h3>
                  <p className="text-xs text-text-gray-opacity mb-3">
                    Can't submit a government ID? This option skips the ID requirement
                    using enhanced profile review and priority processing.
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-text-gray-opacity">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      No ID submission required
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      Same-day or next-day approval
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      One-time payment via your Wallet
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={handlePayForVerification}
                  disabled={isPayingVerification}
                  className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-[200px] border border-primary/50 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Zap className="h-4 w-4" />
                  {isPayingVerification
                    ? "Processing..."
                    : `Pay $${VERIFICATION_FEE_USD} for Fast-Track (No ID Needed)`}
                </button>
              </div>
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
