"use client";

import { useEffect, useState } from "react";

const AGE_GATE_KEY = "rosey_age_verified";

export function AgeGateModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasVerified = window.localStorage.getItem(AGE_GATE_KEY) === "true";
    if (!hasVerified) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [isOpen, mounted]);

  const handleConfirm = () => {
    window.localStorage.setItem(AGE_GATE_KEY, "true");
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-dark-border bg-primary-bg p-6 shadow-2xl md:p-7">
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Adults Only (18+)
        </h2>
        <p className="mt-3 text-sm text-text-gray-opacity md:text-base">
          This website contains adult content and is intended only for users who
          are 18 years or older.
        </p>
        <p className="mt-2 text-sm text-text-gray-opacity md:text-base">
          By continuing, you confirm that you are at least 18 years old.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/90"
          >
            Yes, I am 18+
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="rounded-full border border-dark-border bg-input-bg px-5 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:border-primary/40"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
