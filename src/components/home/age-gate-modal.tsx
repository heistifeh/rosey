"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

const AGE_GATE_KEY = "rosey_age_verified";

export function AgeGateModal() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const hasVerified = window.localStorage.getItem(AGE_GATE_KEY) === "true";
      if (!hasVerified) {
        setIsOpen(true);
      }
    } catch {
      // localStorage unavailable — show the gate
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
    try {
      window.localStorage.setItem(AGE_GATE_KEY, "true");
    } catch {
      // localStorage unavailable — proceed anyway
    }
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-dark-border bg-primary-bg p-6 shadow-2xl md:p-7">
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          {t("ageGate.title")}
        </h2>
        <p className="mt-3 text-sm text-text-gray-opacity md:text-base">
          {t("ageGate.descriptionLine1")}
        </p>
        <p className="mt-2 text-sm text-text-gray-opacity md:text-base">
          {t("ageGate.descriptionLine2")}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/90"
          >
            {t("ageGate.confirm")}
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="rounded-full border border-dark-border bg-input-bg px-5 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:border-primary/40"
          >
            {t("ageGate.exit")}
          </button>
        </div>
      </div>
    </div>
  );
}
