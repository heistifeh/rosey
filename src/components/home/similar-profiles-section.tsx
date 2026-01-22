import Image from "next/image";
import Link from "next/link";
import { MapPin, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/types";

interface SimilarProfilesSectionProps {
  profiles: Profile[];
  isLoading?: boolean;
}

export function SimilarProfilesSection({
  profiles,
  isLoading = false,
}: SimilarProfilesSectionProps) {
  const displayProfiles = profiles.slice(0, 6);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-primary-text mb-4">
        Similar Profiles
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`similar-skel-${idx}`}
              className="h-[240px] w-full rounded-xl bg-input-bg animate-pulse"
            />
          ))}
        </div>
      ) : displayProfiles.length === 0 ? (
        <p className="text-sm text-text-gray-opacity">
          No similar profiles found right now.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {displayProfiles.map((profile) => {
            const images = profile.images ?? [];
            const primaryImage =
              images.find((img) => img.is_primary) ?? images[0];
            const imageUrl = primaryImage?.public_url || "/images/girl1.png";
            const locationLabel = [profile.city, profile.country]
              .filter(Boolean)
              .join(", ");
            const priceLabel =
              profile.base_currency && profile.base_hourly_rate
                ? `${profile.base_currency}${profile.base_hourly_rate}`
                : "—";

            return (
              <Link
                key={profile.id}
                href={`/profile/${profile.username || profile.id}`}
                className="flex min-w-0 flex-col rounded-xl border border-dark-border bg-primary-bg overflow-hidden transition-opacity hover:opacity-90"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={imageUrl}
                    alt={profile.working_name ?? "Profile"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                    <p className="text-sm font-semibold text-primary-text leading-snug min-w-0">
                      {profile.working_name ?? "Provider"}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-primary-text whitespace-nowrap">
                      {priceLabel}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 text-text-gray-opacity" />
                      <span className="text-xs text-text-gray-opacity truncate">
                        {locationLabel || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Circle className="h-2 w-2 fill-current text-emerald-400" />
                      <span className="text-xs text-primary-text">Active</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Button className="bg-primary text-primary-text px-6 py-3 rounded-full hover:bg-primary/90 text-sm">
          Load More Similar Profiles
        </Button>
      </div>
    </section>
  );
}
