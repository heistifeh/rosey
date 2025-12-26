"use client";

import { ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const allTransactions = [
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
    time: "Dec, 11 2025.",
    isPositive: true,
  },
  {
    id: 6,
    amount: "-500",
    type: "credits",
    time: "Dec, 9 2025.",
    isPositive: false,
  },
  {
    id: 7,
    amount: "+500",
    type: "credits",
    time: "Dec, 8 2025.",
    isPositive: true,
  },
  {
    id: 8,
    amount: "-500",
    type: "credits",
    time: "Dec, 2 2025.",
    isPositive: false,
  },
];

export default function TransactionsPage() {
  const [currentMonth, setCurrentMonth] = useState("December 2025");

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

          <div className="flex flex-col gap-3 md:gap-4 bg-input-bg p-2 rounded-3xl">
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-primary-bg rounded-2xl px-4 py-2 flex items-center gap-2"
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

