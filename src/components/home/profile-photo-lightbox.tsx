"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";

interface ProfilePhotoLightboxProps {
  photos: string[];
  name: string;
  activeIndex: number | null;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

export function ProfilePhotoLightbox({
  photos,
  name,
  activeIndex,
  onChangeIndex,
  onClose,
}: ProfilePhotoLightboxProps) {
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangeIndex(((activeIndex ?? 0) + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangeIndex(((activeIndex ?? 0) - 1 + photos.length) % photos.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isOpen, onChangeIndex, onClose, photos.length]);

  if (!isOpen || activeIndex === null || photos.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black"
        aria-label="Close preview"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
        }}
        className="absolute left-3 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black md:left-6"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        className="relative h-[75vh] w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <SafeImage
          src={photos[activeIndex]}
          alt={`${name} photo ${activeIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onChangeIndex((activeIndex + 1) % photos.length);
        }}
        className="absolute right-3 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black md:right-6"
        aria-label="Next photo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
        {activeIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
