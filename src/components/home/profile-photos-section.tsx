"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProfilePhotosSectionProps {
  photos: string[];
  name: string;
}

export function ProfilePhotosSection({
  photos,
  name,
}: ProfilePhotosSectionProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const item = container.querySelector<HTMLElement>("[data-carousel-item]");
    if (!item) return;
    const styles = window.getComputedStyle(container);
    const gap =
      parseFloat(styles.columnGap || styles.gap || styles.rowGap || "0") || 0;
    const itemWidth = item.getBoundingClientRect().width + gap;

    container.scrollTo({
      left: itemWidth * index,
      behavior: "smooth",
    });
  };

  const goToNextPhoto = () => {
    const nextIndex = (currentPhotoIndex + 1) % photos.length;
    setCurrentPhotoIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const goToPreviousPhoto = () => {
    const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    setCurrentPhotoIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Photos</h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide pb-2 snap-x snap-mandatory"
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              data-carousel-item
              className="relative h-32 w-32 shrink-0 snap-start overflow-hidden rounded-xl"
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
