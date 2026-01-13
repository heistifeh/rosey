"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar } from "lucide-react";
import { apiBuilder } from "@/api/builder";
import { useMyAds } from "@/hooks/use-my-ads";
import { useAdStats } from "@/hooks/use-ad-stats";

type AdCityTarget = {
  country_slug: string;
  state_slug: string | null;
  city_slug: string;
};

const statusBadge = (status?: string) => {
  switch (status) {
    case "active":
      return { bg: "bg-[#12B76A3D]", text: "text-[#32D583]", label: "Active" };
    case "paused":
      return {
        bg: "bg-[#F4F4F5]",
        text: "text-text-gray-opacity",
        label: "Paused",
      };
    case "expired":
      return { bg: "bg-[#FFE6E6]", text: "text-[#C42929]", label: "Expired" };
    default:
      return { bg: "bg-[#F4F4F5]", text: "text-text-gray-opacity", label: "Draft" };
  }
};

const formatLineChartDay = (day: string) => {
  const parsed = new Date(day);
  if (Number.isNaN(parsed.getTime())) {
    return day;
  }
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function AdManagementPage() {
  const { ads, isLoading: adsLoading, error: adsError } = useMyAds();
  const [selectedAdId, setSelectedAdId] = useState<string | undefined>();
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (ads.length === 0) {
      setSelectedAdId(undefined);
      return;
    }
    if (!selectedAdId || !ads.find((ad) => ad.id === selectedAdId)) {
      setSelectedAdId(ads[0].id);
    }
  }, [ads, selectedAdId]);

  const selectedAd = ads.find((ad) => ad.id === selectedAdId) ?? ads[0];

  const {
    points,
    totalImpressions,
    totalClicks,
    isLoading: statsLoading,
    error: statsError,
  } = useAdStats({ adId: selectedAdId, days: 7 });

  const chartPoints = useMemo(
    () =>
      [...points]
        .sort(
          (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
        )
        .map((point) => ({
          day: formatLineChartDay(point.day),
          views: point.impressions,
        })),
    [points]
  );

  const selectedAdTargets: AdCityTarget[] = selectedAd?.ad_city_targets ?? [];
  const coverageCount = selectedAdTargets.length;
  const coverageLabel =
    coverageCount > 1
      ? `${coverageCount} locations`
      : coverageCount === 1
      ? "1 location"
      : "No locations added";

  const expiresInDays = selectedAd?.end_at
    ? Math.max(
        0,
        Math.ceil(
          (new Date(selectedAd.end_at).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const expiresLabel =
    expiresInDays === null
      ? "No end date"
      : expiresInDays === 0
      ? "Ends today"
      : `${expiresInDays} day${expiresInDays === 1 ? "" : "s"} left`;

  const badge = selectedAd ? statusBadge(selectedAd.status) : null;

  const handlePause = useCallback(async () => {
    if (!selectedAd) return;
    await apiBuilder.ads.updateAdStatus(selectedAd.id, "paused");
    queryClient.invalidateQueries({ queryKey: ["ads"] });
  }, [queryClient, selectedAd]);

  const handleRenew = useCallback(async () => {
    if (!selectedAd) return;
    await apiBuilder.ads.updateAdStatus(selectedAd.id, "active");
    queryClient.invalidateQueries({ queryKey: ["ads"] });
  }, [queryClient, selectedAd]);

  const statsErrorMessage = adsError || statsError;

  const toggleExpandedAdCities = useCallback(
    (adId: string) => {
      setExpandedAdId((prev) => (prev === adId ? null : adId));
    },
    [setExpandedAdId]
  );

  const formatCityLabel = useCallback((target: AdCityTarget) => {
    const parts = [];
    if (target.city_slug) {
      parts.push(target.city_slug.replace(/-/g, " "));
    }
    if (target.state_slug) {
      parts.push(target.state_slug.replace(/-/g, " "));
    }
    if (target.country_slug) {
      parts.push(target.country_slug.replace(/-/g, " "));
    }
    return parts.join(", ");
  }, []);

  if (!adsLoading && ads.length === 0) {
    return (
      <div className="w-full flex justify-center px-4 md:px-[180px] pt-8 bg-primary-bg">
        <div className="max-w-[840px] mx-auto bg-input-bg rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-primary-text mb-4">
            You don’t have any ads yet.
          </h1>
          <p className="text-sm text-text-gray-opacity mb-6">
            Create your first ad to reach more clients and grow your booking
            pipeline.
          </p>
          <Link href="/dashboard/place-ad">
            <Button className="bg-primary hover:bg-primary/90 text-primary-text px-10">
              Create new ad
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const summaryStats = [
    {
      title: "Total Ad Views",
      value: adsLoading || statsLoading ? null : totalImpressions,
      suffix: "",
    },
    {
      title: "Profile Views from Ad",
      value: adsLoading || statsLoading ? null : 0,
      suffix: "",
    },
    {
      title: "Clicks",
      value: adsLoading || statsLoading ? null : totalClicks,
      suffix: "",
    },
  ];

  return (
    <div className="w-full flex justify-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8 bg-primary-bg">
      <div className="max-w-[1200px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-[70px]">
          {statsErrorMessage && (
            <div className="bg-rose-400/10 text-rose-400 rounded-2xl p-4 text-sm">
              Unable to load ad data. Please try again.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-input-bg rounded-2xl p-2">
            {summaryStats.map((stat) => (
              <div
                key={stat.title}
                className="bg-primary-bg rounded-2xl p-4 md:p-6 min-w-0"
              >
                <p className="text-text-gray-opacity text-sm mb-2">
                  {stat.title}
                </p>
                {stat.value !== null && stat.value !== undefined ? (
                  <p className="text-3xl md:text-4xl font-semibold text-primary-text mb-2">
                    {stat.value.toLocaleString?.()
                      ? stat.value.toLocaleString()
                      : stat.value}
                    {stat.suffix && ` ${stat.suffix}`}
                  </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
                    Ads
                  </h2>
                  <p className="text-sm text-text-gray-opacity">
                    Select an ad to manage its budget and coverage.
                  </p>
                </div>
                <Select
                  value={selectedAdId}
                  onValueChange={(value) => setSelectedAdId(value)}
                  disabled={adsLoading}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Choose your ad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ads.map((ad) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.title || "Untitled Ad"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-input-bg rounded-2xl p-6 flex flex-col gap-6 h-[400px]">
                {!selectedAd ? (
                  <p className="text-sm text-text-gray-opacity">
                    Loading ad details...
                  </p>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-text-gray-opacity">Status</p>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${badge?.bg ?? ""
                            } ${badge?.text ?? ""}`}
                        >
                          {badge?.label ?? "Draft"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-gray-opacity">
                          Budget
                        </p>
                        <p className="text-base font-semibold text-primary-text">
                          {selectedAd.budget_credits?.toLocaleString() ?? "—"}{" "}
                          credits
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm text-text-gray-opacity">
                          Location Coverage
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium w-fit border border-[#F63D68]">
                        {coverageLabel}
                      </span>
                    </div>
                    {selectedAdTargets.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpandedAdCities(selectedAd.id)}
                          className="text-sm font-semibold text-primary underline"
                        >
                          {selectedAdTargets.length} cities selected
                        </button>
                        {expandedAdId === selectedAd.id && (
                          <div className="rounded-2xl border border-dark-border bg-[rgba(255,255,255,0.04)] p-3 max-h-40 overflow-y-auto">
                            <ul className="space-y-1 text-sm text-primary-text">
                              {selectedAdTargets.map((target) => (
                                <li
                                  key={`${target.country_slug}-${target.state_slug ?? "none"}-${target.city_slug}`}
                                >
                                  {formatCityLabel(target)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-text-gray-opacity">
                          Ad expires in
                        </span>
                      </div>
                      <p className="text-base font-semibold text-primary-text">
                        {expiresLabel}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="default"
                        className="bg-secondary/60 text-primary-text"
                        disabled={selectedAd.status === "paused"}
                        onClick={handlePause}
                      >
                        Pause Ad
                      </Button>
                      <Button
                        variant="default"
                        className="bg-primary text-primary-text"
                        onClick={handleRenew}
                      >
                        Renew Ad
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-primary-text">
                    Ad Views
                  </h2>
                  <p className="text-sm text-text-gray-opacity">
                    Last 7 days
                  </p>
                </div>
              </div>
              <div className="bg-input-bg rounded-2xl p-6 min-h-[400px]">
                {statsLoading ? (
                  <div className="h-[320px] rounded-2xl bg-slate-900/50 animate-pulse" />
                ) : chartPoints.length === 0 ? (
                  <p className="text-sm text-text-gray-opacity text-center py-6">
                    No stats available for this ad.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={chartPoints}>
                      <CartesianGrid stroke="#1A1A1E" opacity={0.2} />
                      <XAxis dataKey="day" stroke="#A1A1B3" />
                      <YAxis
                        stroke="#A1A1B3"
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0D0D0F",
                          borderColor: "#282828",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#F63D68"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
