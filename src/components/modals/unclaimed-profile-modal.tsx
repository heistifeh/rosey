"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnclaimedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  email?: string;
}

export function UnclaimedProfileModal({
  isOpen,
  onClose,
  onClaim,
  email,
}: UnclaimedProfileModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="relative z-50 w-full max-w-md rounded-[24px] bg-dark-surface px-6 py-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-dark-border transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold text-primary-text">
              Existing Profile Found
            </h2>
            <p className="text-sm text-text-gray">
              We found an unclaimed profile linked to{" "}
              <span className="text-primary-text font-medium">
                {email || "this contact"}
              </span>
              . Claim it to manage your listing.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              className="w-full rounded-[200px] text-white font-semibold text-base"
              onClick={onClaim}
            >
              Claim Existing Profile
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-[200px]"
              onClick={onClose}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
