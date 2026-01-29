"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MESSAGE = "Hi beautiful, I got your contact from rosey.link";

interface TextProviderButtonProps {
  providerPhone: string;
  providerName?: string;
  className?: string;
}

const sanitizePhone = (value: string) => value.trim();

export function TextProviderButton({
  providerPhone,
  providerName,
  className,
}: TextProviderButtonProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent ?? "";
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  const sanitizedPhone = useMemo(() => sanitizePhone(providerPhone), [providerPhone]);
  const encodedMessage = useMemo(() => encodeURIComponent(MESSAGE), []);
  const href = useMemo(
    () => `sms:${sanitizedPhone}?&body=${encodedMessage}`,
    [encodedMessage, sanitizedPhone]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!sanitizedPhone) return;
    if (!href.startsWith(`sms:${sanitizedPhone}`)) {
      console.warn("TextProviderButton: unexpected sms href", href);
    }
  }, [href, sanitizedPhone]);

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

  if (!sanitizedPhone) {
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
