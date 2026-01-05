"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface RenewAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RenewAdModal({
  isOpen,
  onClose,
  onConfirm,
}: RenewAdModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-50 w-full max-w-md rounded-[28px] bg-dark-surface px-8 pb-8 pt-10 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tag-bg">
          <Image
            src="/images/renew-img.png"
            alt="Renew ad"
            width={64}
            height={64}
            className="h-12 w-12"
            priority
          />
        </div>
        <h3 className="text-xl font-semibold text-primary-text">Renew Ad</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-gray-opacity">
          This will renew your ad and make it visible again. Your ad will be
          active immediately.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-primary-bg text-white hover:bg-dark-border"
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} className="w-full">
            Renew Ad
          </Button>
        </div>
      </div>
    </div>
  );
}
