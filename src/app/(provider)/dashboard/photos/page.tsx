"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const statistics = [
  {
    title: "Profile Views",
    value: "601",
    trend: "+32.7%",
    trendType: "increase",
    label: "Since last week",
  },
  {
    title: "Photo Clicks",
    value: "823",
    trend: "-20.7%",
    trendType: "decrease",
    label: "Since last week",
  },
  {
    title: "Search Appearances",
    value: "329",
    trend: "+32.3%",
    trendType: "increase",
    label: "Since last week",
  },
];

const photoStatus = [
  { title: "Approved", value: "20" },
  { title: "Plan Limit", value: "24" },
  { title: "Pending", value: "4" },
  { title: "Processing", value: "2" },
];

export default function PhotosPage() {
  return (
    <div className="w-full flex justify-center items-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8">
      <div className="max-w-[1200px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-input-bg rounded-2xl p-2">
            {statistics.map((stat, idx) => (
              <div
                key={idx}
                className="bg-primary-bg rounded-2xl p-4 md:p-6 min-w-0"
              >
                <p className="text-text-gray-opacity text-sm mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl md:text-4xl font-semibold text-primary-text mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      stat.trendType === "increase"
                        ? "bg-[#00C85314]"
                        : "bg-[#C429293D]"
                    }`}
                  >
                    {stat.trendType === "increase" ? (
                      <Image
                        src="/svg/arrow-icon.svg"
                        alt="Increase"
                        width={12}
                        height={12}
                        className="h-3 w-3"
                      />
                    ) : (
                      <Image
                        src="/svg/arrow-icon2.svg"
                        alt="Decrease"
                        width={12}
                        height={12}
                        className="h-3 w-3"
                      />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trendType === "increase"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary-text">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-primary-text">
                Photos
              </h1>
              <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full sm:w-auto">
                Manage Photos
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-input-bg rounded-2xl p-2">
              {photoStatus.map((status, idx) => (
                <div
                  key={idx}
                  className="bg-primary-bg rounded-2xl p-4 flex flex-col gap-4 min-w-0"
                >
                  <p className="text-text-gray-opacity md:text-base text-sm">
                    {status.title}
                  </p>
                  <p className="text-2xl md:text-[32px] font-semibold text-primary-text">
                    {status.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
