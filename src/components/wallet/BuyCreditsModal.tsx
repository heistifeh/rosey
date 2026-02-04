"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CreditPackage = {
  id: string;
  label: string;
  credits: number;
  priceLabel: string;
};

const PACKAGES: CreditPackage[] = [
  // priceLabel is display-only, server is the source of truth.
  { id: "starter", label: "Starter", credits: 500, priceLabel: "€1" },
  { id: "popular", label: "Popular", credits: 1200, priceLabel: "€2" },
  { id: "pro", label: "Pro", credits: 3500, priceLabel: "€3" },
];

type BuyCreditsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const [selectedId, setSelectedId] = useState<string>(PACKAGES[0]?.id ?? "starter");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"selecting" | "invoiceReady">("selecting");
  const [invoice, setInvoice] = useState<{
    checkoutUrl: string;
    expiresAt: string;
    invoiceId: string;
    storeId: string;
  } | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const selectedPackage = useMemo(
    () => PACKAGES.find((pkg) => pkg.id === selectedId) ?? PACKAGES[0],
    [selectedId]
  );

  useEffect(() => {
    if (!open) {
      setStatus("selecting");
      setInvoice(null);
      setRemainingSeconds(0);
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!invoice) {
      return;
    }

    const updateRemaining = () => {
      const remainingMs =
        new Date(invoice.expiresAt).getTime() - Date.now();
      const nextSeconds = Math.max(0, Math.floor(remainingMs / 1000));
      setRemainingSeconds(nextSeconds);
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, [invoice]);

  const handleContinue = async () => {
    if (!selectedPackage || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/wallet/topup/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId: selectedPackage.id }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        alert(errorPayload?.error || "Unable to create invoice.");
        return;
      }

      const data = (await response.json()) as {
        checkoutUrl?: string;
        expiresAt?: string;
        invoiceId?: string;
        storeId?: string;
      };
      if (!data.checkoutUrl || !data.expiresAt || !data.invoiceId || !data.storeId) {
        alert("Missing checkout URL.");
        return;
      }

      setInvoice({
        checkoutUrl: data.checkoutUrl,
        expiresAt: data.expiresAt,
        invoiceId: data.invoiceId,
        storeId: data.storeId,
      });
      setStatus("invoiceReady");
    } catch (error) {
      console.error("Failed to create invoice", error);
      alert("Unable to create invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetInvoice = () => {
    setStatus("selecting");
    setInvoice(null);
    setRemainingSeconds(0);
  };

  const handleGoToPayment = () => {
    if (!invoice?.checkoutUrl || remainingSeconds <= 0) return;
    window.location.href = invoice.checkoutUrl;
  };

  const formatRemaining = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-50 w-full max-w-lg rounded-3xl bg-primary-bg p-6 text-left shadow-xl border border-dark-border"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-input-bg text-primary-text flex items-center justify-center hover:bg-dark-border transition-colors"
          aria-label="Close"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-primary-text">Buy Credits</h2>
          <p className="text-sm text-text-gray-opacity mt-2">
            Choose a package, then pay with BTC or Lightning.
          </p>
        </div>

        {status === "selecting" ? (
          <>
            <div className="flex flex-col gap-3">
              {PACKAGES.map((pkg) => {
                const isSelected = pkg.id === selectedId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-dark-border bg-input-bg hover:border-primary/60"
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-primary-text">
                          {pkg.label}
                        </p>
                        <p className="text-sm text-text-gray-opacity">
                          {pkg.credits.toLocaleString()} credits
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary-text">
                          {pkg.priceLabel}
                        </p>
                        <div
                          className={`mt-2 h-4 w-4 rounded-full border-2 ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-text-gray-opacity"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating invoice..." : "Continue to payment"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-input-bg p-4 border border-dark-border">
              <p className="text-sm text-text-gray-opacity">Invoice countdown</p>
              <p className="text-3xl font-semibold text-primary-text mt-2">
                {formatRemaining(remainingSeconds)}
              </p>
              <p className="text-sm text-text-gray-opacity mt-2">
                {selectedPackage?.credits.toLocaleString()} credits, {selectedPackage?.priceLabel}
              </p>
              {remainingSeconds <= 0 && (
                <p className="text-sm text-rose-400 mt-3">
                  Invoice expired. Create a new one.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {remainingSeconds > 0 ? (
                <Button
                  type="button"
                  onClick={handleGoToPayment}
                  className="w-full"
                >
                  Go to payment
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleResetInvoice}
                  className="w-full"
                >
                  Create new invoice
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
