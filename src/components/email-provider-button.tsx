"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MESSAGE = "Hi beautiful, I got your contact from rosey.link";

interface EmailProviderButtonProps {
  providerEmail: string;
  providerName?: string;
  className?: string;
}

const sanitizeEmail = (value: string) => value.trim();

export function EmailProviderButton({
  providerEmail,
  providerName,
  className,
}: EmailProviderButtonProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent ?? "";
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  const sanitizedEmail = useMemo(
    () => sanitizeEmail(providerEmail),
    [providerEmail]
  );
  const encodedMessage = useMemo(() => encodeURIComponent(MESSAGE), []);
  const href = useMemo(
    () => `mailto:${sanitizedEmail}?subject=&body=${encodedMessage}`,
    [encodedMessage, sanitizedEmail]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!sanitizedEmail) return;
    if (!href.startsWith(`mailto:${sanitizedEmail}`)) {
      console.warn("EmailProviderButton: unexpected mailto href", href);
    }
  }, [href, sanitizedEmail]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(MESSAGE);
      toast.success("Copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!sanitizedEmail) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <a
        href={href}
        className={cn(buttonVariants({ size: "sm" }), "h-9 px-4 text-xs")}
      >
        Contact escort
      </a>
      {isMobile === false && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-text-gray-opacity hover:text-primary-text transition-colors"
          >
            Copy message
          </button>
          {copied && (
            <span className="text-[10px] text-emerald-400">Copied</span>
          )}
        </div>
      )}
    </div>
  );
}
