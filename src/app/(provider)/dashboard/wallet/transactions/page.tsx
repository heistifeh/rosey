"use client";

import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";

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

export default function TransactionsPage() {
  const [currentMonth, setCurrentMonth] = useState("December 2025");
  const { transactions, isLoading, error } = useWallet();

  return (
    <div className="w-full flex justify-center items-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8 bg-primary-bg">
      <div className="max-w-[1200px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="bg-[#F63D683D] rounded-2xl p-4 flex items-center justify-between">
            <button className="p-2 hover:bg-primary/20 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-primary-text" />
            </button>
            <p className="text-primary-text font-medium text-base md:text-lg">
              {currentMonth}
            </p>
            <button className="p-2 hover:bg-primary/20 rounded-lg transition-colors">
              <ChevronRight className="h-5 w-5 text-primary-text" />
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-400">Unable to load wallet.</p>
          )}

          <div className="flex flex-col gap-3 md:gap-4 bg-input-bg p-2 rounded-3xl">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-primary-bg rounded-2xl px-4 py-2 flex items-center gap-3 animate-pulse"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-800/40" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-slate-800/40 rounded" />
                      <div className="h-3 w-24 bg-slate-800/30 rounded" />
                    </div>
                  </div>
                ))
              : transactions.length === 0
              ? (
                <p className="text-sm text-text-gray-opacity text-center py-6">
                  No transactions yet.
                </p>
              )
              : transactions.map((transaction) => {
                  const isCredit = transaction.direction === "credit";
                  const label =
                    typeLabelMap[transaction.type] ||
                    transaction.type?.replace(/_/g, " ") ||
                    "Transaction";
                  const amountNumber = Number(transaction.amount);
                  const formattedAmount = Number.isNaN(amountNumber)
                    ? String(transaction.amount)
                    : amountNumber.toLocaleString();
                  const amountText = `${isCredit ? "+" : "-"}${formattedAmount}`;
                  return (
                    <div
                      key={transaction.id}
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
                      </div>
                      <p className="text-text-gray-opacity text-sm md:text-base">
                        {formatRelativeTime(transaction.created_at)}
                      </p>
                    </div>
                  );
                })}
          </div>

          <div className="flex justify-center pt-4 w-full">
            <Link href="/dashboard/wallet" className="w-full">
              <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full px-8">
                Back to Previous Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
