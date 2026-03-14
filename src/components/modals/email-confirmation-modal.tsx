"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export function EmailConfirmationModal({
  isOpen,
  onClose,
  onVerify,
}: EmailConfirmationModalProps) {
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-50 w-full max-w-md rounded-3xl bg-dark-surface px-6 pb-6 pt-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-dark-border transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/svg/mail-box.svg"
            alt="Mailbox"
            width={120}
            height={120}
            className="w-[120px] h-[120px]"
            priority
          />

          <div className="flex flex-col text-center pb-6 gap-2">
            <p className="text-white text-base font-normal leading-relaxed">
              A confirmation email has been sent. Please open it and use the code to activate your account.
            </p>
            <p className="text-text-gray-opacity text-sm font-normal">
              Can't find it? Check your <span className="text-white font-medium">spam or junk</span> folder.
            </p>
          </div>

          <Button
            type="button"
            onClick={onVerify}
            className="w-full rounded-[200px] text-white font-semibold text-base"
            size="default"
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
