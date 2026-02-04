"use client";

import { EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import {
  WalletBalanceSkeleton,
  WalletTransactionsListSkeleton,
} from "@/components/skeletons/wallet-skeletons";
import { BuyCreditsModal } from "@/components/wallet/BuyCreditsModal";
import { toast } from "react-hot-toast";

const typeLabelMap: Record<string, string> = {
  topup: "Top up",
  ad_spend: "Ad spend",
  referral_bonus: "Referral bonus",
};

const formatRelativeTime = (value: string) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const diff = Date.now() - date.getTime();
  const units = [
    { label: "year", ms: 1000 * 60 * 60 * 24 * 365 },
    { label: "month", ms: 1000 * 60 * 60 * 24 * 30 },
    { label: "day", ms: 1000 * 60 * 60 * 24 },
    { label: "hour", ms: 1000 * 60 * 60 },
    { label: "minute", ms: 1000 * 60 },
    { label: "second", ms: 1000 },
  ];
  for (const unit of units) {
    if (diff >= unit.ms) {
      const count = Math.floor(diff / unit.ms);
      return `${count} ${unit.label}${count === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
};

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const { wallet, activity, isLoading, error, refetch } = useWallet();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasRechecked, setHasRechecked] = useState(false);

  useEffect(() => {
    if (hasRechecked) return;
    const topupFlag = searchParams.get("topup");
    const invoiceId = searchParams.get("invoiceId");
    if (topupFlag !== "return" || !invoiceId) return;

    const runRecheck = async () => {
      try {
        const response = await fetch(
          `/api/wallet/topup/recheck?invoiceId=${encodeURIComponent(invoiceId)}`
        );
        const data = (await response.json()) as {
          ok?: boolean;
          settled?: boolean;
          status?: string;
          error?: string;
        };

        if (!response.ok || data.error) {
          toast.error(data.error || "Unable to verify payment.");
        } else if (data.settled) {
          toast.success("Payment confirmed, credits added.");
          refetch();
        } else {
          toast("Payment still processing.");
        }
      } catch (err) {
        console.error("Topup recheck failed", err);
        toast.error("Unable to verify payment.");
      } finally {
        setHasRechecked(true);
        router.replace("/dashboard/wallet");
      }
    };

    runRecheck();
  }, [
    hasRechecked,
    refetch,
    router,
    searchParams,
  ]);

  useEffect(() => {
    if (!activity?.length) return;
    const hasPending = activity.some((item) => item.status === "pending");
    if (!hasPending) return;

    const interval = window.setInterval(() => {
      refetch();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activity, refetch]);

  return (
    <div className="w-full flex justify-center items-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8 bg-primary-bg">
      <div className="max-w-[1200px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-10">
          <div
            className="bg-primary-bg border-5 border-input-bg rounded-2xl p-6 relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/wallet-bg.png')" }}
          >
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-[#F63D683D] flex items-center justify-center hover:bg-[#F63D683D]/80 transition-colors"
            >
              <EyeOff className="h-5 w-5 text-text-gray-opacity hover:text-primary-text transition-colors" />
            </button>
            <div className="text-center">
              <p className="text-sm md:text-base mb-2 text-primary-text font-semibold">
                Total Balance
              </p>
              {isLoading ? (
                <WalletBalanceSkeleton />
              ) : showBalance ? (
                <div className="flex items-end justify-center gap-2 mb-4">
                  <p className="text-4xl md:text-5xl font-semibold text-primary-text">
                    {wallet?.balance_credits?.toLocaleString() ?? "0"}
                  </p>
                  <p className="text-text-gray-opacity text-sm md:text-base">
                    Credits
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-4xl md:text-5xl font-semibold text-primary-text mb-2">
                    ••••
                  </p>
                  <p className="text-text-gray-opacity text-sm md:text-base mb-6">
                    Credits
                  </p>
                </>
              )}
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-text w-full md:w-auto px-[50px] py-[13px]"
                onClick={() => setIsBuyOpen(true)}
              >
                Buy Credits
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
              Recent Activity
            </h2>

            {error && (
              <p className="text-sm text-rose-400">Unable to load wallet.</p>
            )}

            <div className="flex flex-col gap-3 md:gap-4 bg-input-bg p-2 rounded-3xl">
              {isLoading ? (
                <WalletTransactionsListSkeleton />
              ) : activity.length === 0 ? (
                <p className="text-sm text-text-gray-opacity text-center py-6">
                  No activity yet.
                </p>
              ) : (
                activity.map((item) => {
                  const isPending = item.status === "pending";
                  const isCredit = item.direction === "credit";
                  const label = isPending
                    ? "Top up (pending)"
                    : typeLabelMap[item.type] ||
                      item.type?.replace(/_/g, " ") ||
                      "Transaction";
                  const formattedAmount = item.amount.toLocaleString();
                  const amountText = `${isCredit ? "+" : "-"}${formattedAmount}`;
                  return (
                    <div
                      key={`${item.source}-${item.id}`}
                      className="bg-primary-bg rounded-2xl px-4 py-2 flex items-center gap-3"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 ${
                          isCredit
                            ? "bg-emerald-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-medium text-[#FCFCFD]">
                          {amountText} {label}
                        </p>
                        {isPending && (
                          <p className="text-xs text-text-gray-opacity">
                            Waiting for confirmation
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isPending && (
                          <span className="text-[10px] uppercase tracking-wide text-amber-300 bg-amber-300/10 border border-amber-300/30 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                        <p className="text-text-gray-opacity text-sm md:text-base">
                          {formatRelativeTime(item.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-center pt-4 w-full">
              <Link href="/dashboard/wallet/transactions" className="w-full">
                <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full px-8">
                  See all transactions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BuyCreditsModal open={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
    </div>
  );
}
