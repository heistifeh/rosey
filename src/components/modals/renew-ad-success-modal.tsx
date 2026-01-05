"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RenewAdSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RenewAdSuccessModal({
  isOpen,
  onClose,
}: RenewAdSuccessModalProps) {
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
        className="relative z-50 w-full max-w-sm rounded-[20px] bg-dark-surface px-8 pb-8 pt-10 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#12B76A3D]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#32D583]">
            <Check className="h-6 w-6 text-[#0B5F3B]" />
          </div>
        </div>
        <p className="text-sm font-semibold text-primary-text">
          Your Ad Is Live Again
        </p>
        <Button
          type="button"
          onClick={onClose}
          className="mt-6 w-full"
          size="sm"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
