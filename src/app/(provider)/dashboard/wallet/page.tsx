"use client";

import { EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

const transactions = [
  {
    id: 1,
    amount: "+500",
    type: "credits",
    time: "2 hours ago",
    isPositive: true,
  },
  {
    id: 2,
    amount: "-500",
    type: "credits",
    time: "1 day ago",
    isPositive: false,
  },
  {
    id: 3,
    amount: "+500",
    type: "credits",
    time: "3 days ago",
    isPositive: true,
  },
  {
    id: 4,
    amount: "-500",
    type: "credits",
    time: "7 days ago",
    isPositive: false,
  },
  {
    id: 5,
    amount: "+500",
    type: "credits",
    time: "Sep, 11 2025",
    isPositive: true,
  },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

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
              {showBalance ? (
                <div className="flex items-end justify-center ">
                  <p className="text-4xl md:text-5xl font-semibold text-primary-text mb-4">
                    2500
                  </p>
                  <p className="text-text-gray-opacity text-sm md:text-base mb-4">
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
              <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full md:w-auto px-[50px] py-[13px]">
                Buy Credits
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
              Recent Activity
            </h2>

            <div className="flex flex-col gap-3 md:gap-4 bg-input-bg p-2 rounded-3xl">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-primary-bg rounded-2xl px-4  py-2 flex items-center gap-2"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 ${
                      transaction.isPositive
                        ? "bg-emerald-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {transaction.isPositive ? (
                      <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base md:text-lg font-medium text-[#FCFCFD]">
                      {transaction.amount}
                      {transaction.type}
                    </p>
                  </div>
                  <p className="text-text-gray-opacity text-sm md:text-base">
                    {transaction.time}
                  </p>
                </div>
              ))}
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
    </div>
  );
}
