"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, MapPin, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import type { Profile } from "@/types/types";
import { SafeImage } from "@/components/ui/safe-image";

export function RecentlyActiveSection() {
  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["recently-active-profiles"],
    queryFn: () =>
      apiBuilder.profiles.getProfiles({
        applyDefaults: false,
      }),
  });

  const normalizedProfiles = useMemo(() => {
    return profiles.map((profile) => {
      const images = profile.images ?? [];
      const primaryImage =
        images.find((img) => img.is_primary) ?? images[0];
      const imageUrl = primaryImage?.public_url || "/images/girl1.png";
      const location = [profile.city, profile.country].filter(Boolean).join(", ");
      const price =
        profile.base_currency && profile.base_hourly_rate
          ? `${profile.base_currency}${profile.base_hourly_rate}`
          : "—";

      return {
        id: profile.id,
        name: profile.working_name ?? "Provider",
        price,
        location,
        status: "Available",
        image: imageUrl,
        username: profile.username,
      };
    });
  }, [profiles]);

  const itemsToRender = normalizedProfiles;

  return (
    <section className="relative z-10 w-full bg-primary-bg px-4 pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        <div className=" flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-text lg:text-[36px]">
            Recently Active
          </h2>

          <Link href="/search" className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text cursor-pointer hover:bg-primary/90 transition-colors">
            See All
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0 scrollbar-hide px-[15px]">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`recent-skel-${index}`}
                className="flex h-full min-w-[280px] sm:min-w-0 flex-col overflow-hidden rounded-[24px] bg-input-bg shadow-sm animate-pulse"
              >
                <div className="aspect-3/4 w-full bg-primary-bg/40" />
                <div className="p-3 space-y-3">
                  <div className="h-4 w-1/2 bg-primary-bg/40 rounded" />
                  <div className="h-3 w-1/3 bg-primary-bg/40 rounded" />
                </div>
              </div>
            ))
            : itemsToRender.map((profile, index) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.username || profile.id}`}
                className={`flex h-full flex-col overflow-hidden p-3 md:p-4 rounded-[24px]  bg-input-bg shadow-sm min-w-[280px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="relative aspect-3/4 w-full overflow-hidden rounded-[16px]">
                  <SafeImage
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={index < 4}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 md:gap-[20px] pt-3 md:pt-[22px]">
                  <div className="flex  justify-between gap-2 items-center">
                    <p className="text-base md:text-lg lg:text-[24px] font-normal text-primary-text">
                      {profile.name}
                    </p>
                    <p className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                      {profile.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      <span className="text-xs md:text-sm lg:text-[16px] font-normal text-text-gray-opacity">
                        {profile.location || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 rounded-[200px] px-2 py-1 md:px-3 md:py-2">
                      <Circle className="h-1.5 w-1.5 md:h-2 md:w-2 fill-current text-emerald-400" />
                      <span className="text-xs md:text-sm lg:text-[16px] font-normal text-primary-text">
                        {profile.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
