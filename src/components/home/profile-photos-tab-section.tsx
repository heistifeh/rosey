"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { ProfilePhotoLightbox } from "@/components/home/profile-photo-lightbox";

interface ProfilePhotosTabSectionProps {
  photos: string[];
  name: string;
}

export function ProfilePhotosTabSection({
  photos,
  name,
}: ProfilePhotosTabSectionProps) {
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(
    null
  );

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActivePreviewIndex(index)}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <SafeImage
              src={photo}
              alt={`${name} photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>
      <ProfilePhotoLightbox
        photos={photos}
        name={name}
        activeIndex={activePreviewIndex}
        onChangeIndex={setActivePreviewIndex}
        onClose={() => setActivePreviewIndex(null)}
      />
    </section>
  );
}
