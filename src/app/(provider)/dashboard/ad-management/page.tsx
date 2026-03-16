"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { DashboardCardSkeleton } from "@/components/skeletons/dashboard-card-skeleton";

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
    if (!selectedAdId || !ads.find((ad: { id: string }) => ad.id === selectedAdId)) {
      setSelectedAdId(ads[0].id);
    }
  }, [ads, selectedAdId]);

  const selectedAd =
    ads.find((ad: { id: string }) => ad.id === selectedAdId) ?? ads[0];

  const selectedAdTargets: AdCityTarget[] = selectedAd?.ad_city_targets ?? [];
  const coverageCount = selectedAdTargets.length;
  const coverageLabel =
    coverageCount > 1
      ? `${coverageCount} locations`
      : coverageCount === 1
      ? "1 location"
      : "No locations added";

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const expiresLabel = (() => {
    if (!selectedAd?.end_at) return "No end date";
    const msLeft = new Date(selectedAd.end_at).getTime() - now;
    if (msLeft <= 0) return "Expired";
    const totalMinutes = Math.floor(msLeft / 60_000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    if (days === 0 && hours === 0) return "Ends in less than an hour";
    if (days === 0) return `${hours}h left`;
    if (hours === 0) return `${days}d left`;
    return `${days}d ${hours}h left`;
  })();

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
            You don't have any ads yet.
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

  return (
    <div className="w-full flex justify-center md:-mx-8 lg:-mx-12 px-4 md:px-[180px] pt-8 bg-primary-bg">
      <div className="max-w-[840px] mx-auto w-full min-w-0">
        <div className="flex flex-col gap-6">
          {adsError && (
            <div className="bg-rose-400/10 text-rose-400 rounded-2xl p-4 text-sm">
              Unable to load ad data. Please try again.
            </div>
          )}

          {adsLoading ? (
            <DashboardCardSkeleton />
          ) : (
            <div className="flex flex-col gap-4">
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
                    {ads.map((ad: { id: string; title?: string }) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.title || "Untitled Ad"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-input-bg rounded-2xl p-6 flex flex-col gap-6">
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
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${badge?.bg ?? ""} ${badge?.text ?? ""}`}
                        >
                          {badge?.label ?? "Draft"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-gray-opacity">Budget</p>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
