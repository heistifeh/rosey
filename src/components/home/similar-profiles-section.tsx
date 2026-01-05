import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimilarProfile {
  id: number;
  name: string;
  price: string;
  location: string;
  status: string;
  image: string;
}

interface SimilarProfilesSectionProps {
  profiles: SimilarProfile[];
}

export function SimilarProfilesSection({
  profiles,
}: SimilarProfilesSectionProps) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-primary-text mb-4">
        Similar Profile
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {profiles.slice(0, 6).map((profile) => (
          <Link
            key={profile.id}
            href={`/profile/${profile.id}`}
            className="flex min-w-0 flex-col rounded-xl border border-dark-border bg-primary-bg overflow-hidden transition-opacity hover:opacity-90"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                <p className="text-sm font-semibold text-primary-text leading-snug min-w-0">
                  {profile.name}
                </p>
                <p className="text-sm sm:text-base font-semibold text-primary-text whitespace-nowrap">
                  {profile.price}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3 w-3 text-text-gray-opacity" />
                  <span className="text-xs text-text-gray-opacity truncate">
                    {profile.location}
                  </span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Circle className="h-2 w-2 fill-current text-emerald-400" />
                  <span className="text-xs text-primary-text">
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button className="bg-primary text-primary-text px-6 py-3 rounded-full hover:bg-primary/90 text-sm">
          Load More Similar Profiles
        </Button>
      </div>
    </section>
  );
}
