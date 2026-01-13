"use client";

import { BaseCardSkeleton } from "./base-card-skeleton";

export function WalletBalanceSkeleton() {
  return (
    <BaseCardSkeleton className="p-6 min-w-full rounded-[24px]">
      <div className="h-5 w-32 rounded bg-[#2c2c2f] mb-2" />
      <div className="h-16 w-3/4 rounded bg-[#2c2c2f] mb-3" />
      <div className="h-3 w-24 rounded bg-[#2c2c2f]" />
    </BaseCardSkeleton>
  );
}

export function WalletTransactionRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 bg-transparent">
      <BaseCardSkeleton className="flex-row items-center gap-3 p-4 min-w-full">
        <div className="h-10 w-10 rounded-full bg-[#2c2c2f]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-[#2c2c2f]" />
          <div className="h-3 w-1/3 rounded bg-[#2c2c2f]" />
        </div>
        <div className="h-4 w-16 rounded bg-[#2c2c2f]" />
      </BaseCardSkeleton>
    </div>
  );
}

export function WalletTransactionsListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <WalletTransactionRowSkeleton key={index} />
      ))}
    </div>
  );
}
