"use client";

import Link from "next/link";
import { BadgeCheck, ShieldAlert, Upload, Zap } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProfile } from "@/hooks/use-profile";
import { useWallet } from "@/hooks/use-wallet";
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";

const VERIFICATION_FEE_USD = 500;
const VERIFICATION_FEE_CREDITS = 500;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [isPayingVerification, setIsPayingVerification] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { wallet, refetch: refetchWallet } = useWallet();
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
          label: "Verified",
          value: profile.is_fully_verified ? "Yes" : "No",
        },
      ]
    : [];

  const isVerified = Boolean(profile?.is_fully_verified);
  const availableCredits = wallet?.balance_credits ?? 0;

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
          toast.error("Insufficient credits. Please fund your wallet to continue.");
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
        <div className="mb-8 rounded-2xl border border-dark-border bg-input-bg overflow-hidden">
          <div className="grid grid-cols-3 text-center text-xs font-semibold uppercase tracking-wide border-b border-dark-border">
            <div className="py-3 px-4 text-left text-text-gray-opacity">Feature</div>
            <div className="py-3 px-4 border-l border-dark-border text-text-gray-opacity">No Badge</div>
            <div className="py-3 px-4 border-l border-dark-border text-primary">Verified</div>
          </div>
          {[
            { label: "Post and list ads freely", noBadge: true, verified: true },
            { label: "Visible verification badge", noBadge: false, verified: true },
            { label: "Priority in search results", noBadge: false, verified: true },
            { label: "Buyer trust signal on every ad", noBadge: false, verified: true },
            { label: "Identity confirmed by rosey.link", noBadge: false, verified: true },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-center border-b border-dark-border last:border-b-0 text-sm">
              <div className="py-3 px-4 text-left text-primary-text">{row.label}</div>
              <div className="py-3 px-4 border-l border-dark-border text-text-gray-opacity">
                {row.noBadge ? <span className="text-emerald-400 font-semibold">✓ Yes</span> : <span className="text-text-gray-opacity">—</span>}
              </div>
              <div className="py-3 px-4 border-l border-dark-border">
                {row.verified ? <span className="text-emerald-400 font-semibold">✓ Yes</span> : <span className="text-text-gray-opacity">—</span>}
              </div>
            </div>
          ))}
          <div className="p-4 bg-primary-bg border-t border-dark-border flex items-start gap-3">
            <BadgeCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary-text">You can post without verifying</p>
              <p className="text-xs text-text-gray-opacity mt-0.5">Verification is optional but recommended. Verified profiles build more trust and get better visibility in search results.</p>
            </div>
          </div>
        </div>

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
                Optional — Builds Trust
              </span>
            </div>
            <h2 className="text-lg font-semibold text-primary-text md:text-xl mb-1">
              Get Our Verification Badge to Build More Trust
            </h2>
            <p className="text-sm text-text-gray-opacity mb-6 max-w-2xl">
              You can post ads right now without being verified. Adding a verification badge builds client trust and significantly increases ad conversions. Choose the path that works best for you.
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
