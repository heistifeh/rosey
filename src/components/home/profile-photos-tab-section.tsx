"use client";

import { SafeImage } from "@/components/ui/safe-image";

interface ProfilePhotosTabSectionProps {
  photos: string[];
  name: string;
}

export function ProfilePhotosTabSection({
  photos,
  name,
}: ProfilePhotosTabSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <SafeImage
              src={photo}
              alt={`${name} photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
