"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
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
  const imageUrl = primaryImage?.public_url || "/placeholder.png";
  const isVerified = Boolean(profile.is_fully_verified);
  const locationLabel = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");

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
        {isVerified && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-200 backdrop-blur-sm">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>Verified</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1.5 pt-2 md:gap-3 md:pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-normal text-primary-text md:text-lg truncate">
              {profile.working_name ?? "Provider"}
            </p>
            {isVerified && (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                aria-label="Verified profile"
                title="Verified profile"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          {isSponsored && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary/80">
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
