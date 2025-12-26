"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfilePhotosSectionProps {
  photos: string[];
  name: string;
}

export function ProfilePhotosSection({
  photos,
  name,
}: ProfilePhotosSectionProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + photos.length) % photos.length
    );
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Photos</h2>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden"
                      >
                        <Image
                          src={photo}
                          alt={`${name} photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
          ))}
        </div>
        <button
          onClick={goToPreviousPhoto}
          className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-bg/80 text-primary-text hover:bg-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={goToNextPhoto}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-bg/80 text-primary-text hover:bg-primary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

