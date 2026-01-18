"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Profile } from "@/types/types";

interface ProfileCardProps {
  profile: Profile;
  isSponsored?: boolean;
}

export function ProfileCard({ profile, isSponsored = false }: ProfileCardProps) {
  const images = profile.images ?? [];
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];
  const imageUrl = primaryImage?.public_url || "/images/girl1.png";
  const locationLabel = [profile.city, profile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/profile/${profile.username || profile.id}`}
      className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-3 shadow-sm transition-opacity hover:opacity-90 md:p-4"
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-[16px]">
        <Image
          src={imageUrl}
          alt={profile.working_name ?? "Profile"}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 pt-3 md:gap-[22px] md:pt-[22px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-normal text-primary-text md:text-lg lg:text-[24px]">
              {profile.working_name ?? "Provider"}
            </p>
            {isSponsored && (
              <span className="rounded-full border border-primary bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Sponsored
              </span>
            )}
          </div>
          <p className="text-xl font-semibold text-primary-text md:text-2xl lg:text-[36px]">
            {profile.base_currency}
            {profile.base_hourly_rate}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="text-xs font-normal text-text-gray-opacity md:text-sm lg:text-[16px]">
            {locationLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
