"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Trash2,
  ArrowUp,
  ArrowDown,
  Megaphone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const kpiData = [
  {
    title: "Total Ad Views",
    value: "2328",
    trend: "+32.3%",
    trendType: "increase",
    label: "Since last week",
  },
  {
    title: "Profile Views from Ad",
    value: "1245",
    trend: "-20.7%",
    trendType: "decrease",
    label: "Since last week",
  },
  {
    title: "Clicks",
    value: "2328",
    trend: "+32.3%",
    trendType: "increase",
    label: "Since last week",
  },
];

const emptyKpiData = [
  {
    title: "Total Ad Views",
    value: null,
  },
  {
    title: "Profile Views from Ad",
    value: null,
  },
  {
    title: "Clicks",
    value: null,
  },
];

const chartData = [
  { day: "Mon", views: 1000 },
  { day: "Tue", views: 1500 },
  { day: "Wed", views: 1200 },
  { day: "Thu", views: 800 },
  { day: "Fri", views: 1800 },
  { day: "Sat", views: 1400 },
  { day: "Sun", views: 1800 },
];

export default function AdManagementPage() {
  const [hasAds, setHasAds] = useState(true);

  return (
    <div className="w-full flex justify-center items-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8 bg-primary-bg">
      <div className="max-w-[1200px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-input-bg rounded-2xl p-2">
            {(hasAds ? kpiData : emptyKpiData).map((stat, idx) => (
              <div
                key={idx}
                className="bg-primary-bg rounded-2xl p-4 md:p-6 min-w-0"
              >
                <p className="text-text-gray-opacity text-sm mb-2">
                  {stat.title}
                </p>
                {stat.value ? (
                  <>
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
                          <ArrowUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-red-400" />
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
                  </>
                ) : (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-8 h-8 bg-input-bg rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-text-gray-opacity rounded"></div>
                    </div>
                    <div className="h-4 bg-input-bg rounded flex-1"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-input-bg rounded-2xl p-6 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
                Ads
              </h2>

              {hasAds ? (
                <div className="bg-primary-bg rounded-2xl p-6 relative">
                  <button
                    onClick={() => setHasAds(false)}
                    className="absolute top-4 right-4 text-text-gray-opacity hover:text-primary-text transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                      <Megaphone className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#12B76A3D] text-[#32D583] rounded-full text-xs md:text-sm font-medium">
                          Active
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-text-gray-opacity" />
                          <span className="text-sm text-text-gray-opacity">
                            Location Coverage
                          </span>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                            3 States
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-text-gray-opacity" />
                          <span className="text-sm text-text-gray-opacity">
                            Ad Expires in
                          </span>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                            90 Days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full">
                      Pause Ad
                    </Button>
                    <Button className="bg-input-bg hover:bg-input-bg/80 text-primary-text w-full border border-dark-border">
                      Renew Ad
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-primary-bg rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                  <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Megaphone className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-semibold text-primary-text mb-2">
                      You haven't created any ads yet.
                    </p>
                    <p className="text-sm md:text-base text-text-gray-opacity">
                      Create your first ad to start getting views and profile
                      clicks.
                    </p>
                  </div>
                  <Button
                    onClick={() => setHasAds(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-text px-8 py-6 text-base"
                  >
                    Create Ad
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-input-bg rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
                  Ad Views
                </h2>
                <Select defaultValue="7days">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Last 7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasAds ? (
                <div className="bg-primary-bg rounded-2xl p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3a3a3a"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        stroke="#8E8E93"
                        tick={{ fill: "#8E8E93", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#8E8E93"
                        tick={{ fill: "#8E8E93", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 2500]}
                        ticks={[500, 1000, 1500, 2000, 2500]}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#f63d68"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-primary-bg rounded-2xl p-6 h-[400px] flex items-center justify-center">
                  <p className="text-text-gray-opacity text-center">
                    Your ad performance will appear here once you create an ad.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
