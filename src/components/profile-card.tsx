"use client";

import Link from "next/link";
import type { Profile } from "@/types/types";
import { SafeImage } from "@/components/ui/safe-image";
import { TaglineReveal } from "@/components/home/tagline-reveal";

interface ProfileCardProps {
  profile: Profile;
  isSponsored?: boolean;
}

export function ProfileCard({ profile, isSponsored = false }: ProfileCardProps) {
  const images = profile.images ?? [];
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];
  const imageUrl = primaryImage?.public_url || "/images/girl1.png";
  const locationLabel = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <Link
      href={`/profile/${profile.username || profile.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#26262a] bg-primary-bg p-2 shadow-sm transition-opacity hover:opacity-90 md:p-3"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[14px] md:aspect-[4/5] md:rounded-[16px]">
        <SafeImage
          src={imageUrl}
          alt={profile.working_name ?? "Profile"}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1.5 pt-2 md:gap-3 md:pt-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-normal text-primary-text md:text-lg">
            {profile.working_name ?? "Provider"}
          </p>
          {isSponsored && (
            <span className="rounded-full border border-primary bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Sponsored
            </span>
          )}
        </div>

        <p className="text-xs text-text-gray-opacity md:text-sm">
          {locationLabel || "Location not set"}
        </p>

        <TaglineReveal tagline={profile.tagline} />

      </div>
    </Link>
  );
}
