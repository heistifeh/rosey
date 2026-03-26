"use client";

import { Mail, Phone, MapPin, ArrowRight as ArrowRightIcon, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Instagram } from "lucide-react";
import { EmailProviderButton } from "@/components/email-provider-button";
import { TextProviderButton } from "@/components/text-provider-button";
import { useState } from "react";

interface ProfileContactSectionProps {
  contact: {
    email: string;
    phone: string;
    instagram?: string;
    location: string;
  };
}


const maskText = (text: string | undefined, visibleStart: number = 3, visibleEnd: number = 3): string => {
  if (!text || text === "N/A" || text === "undefined") return text || "";


  if (text.includes("@")) {
    const [localPart, domain] = text.split("@");
    if (!domain) return text;

    const maskedLocal = localPart.length > visibleStart
      ? localPart.slice(0, visibleStart) + "***" + localPart.slice(-Math.min(visibleEnd, localPart.length - visibleStart))
      : localPart;

    const domainParts = domain.split(".");
    if (domainParts.length < 2) {

      const maskedDomain = domain.length > 3 ? domain.slice(0, 3) + "***" : domain;
      return `${maskedLocal}@${maskedDomain}`;
    }

    const [domainName, ...tldParts] = domainParts;
    const tld = tldParts.join(".");
    const maskedDomain = domainName.length > 3
      ? domainName.slice(0, 3) + "***"
      : domainName;
    return `${maskedLocal}@${maskedDomain}.${tld}`;
  }


  if (text.length <= visibleStart + visibleEnd) {
    return text;
  }

  const start = text.slice(0, visibleStart);
  const end = text.slice(-visibleEnd);
  const middle = "*".repeat(Math.min(6, text.length - visibleStart - visibleEnd));

  return `${start}${middle}${end}`;
};

export function ProfileContactSection({
  contact,
}: ProfileContactSectionProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Contact</h2>
      <div className="space-y-3">

        {/* Tip: mention Rosey.link */}
        <div className="flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-primary-text">
            <span className="font-semibold text-primary">Pro tip:</span> Tell this provider you found them on{" "}
            <span className="font-semibold">Rosey.link</span> — providers respond faster to clients who come through the platform.
          </p>
        </div>

        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-input-bg">
              <Mail className="h-4 w-4 text-primary-text" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-gray-opacity mb-1">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-primary-text">
                  {showEmail ? contact.email : maskText(contact.email)}
                </p>
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="text-text-gray-opacity hover:text-primary transition-colors"
                  aria-label={showEmail ? "Hide email" : "Show email"}
                >
                  {showEmail ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <EmailProviderButton providerEmail={contact.email} />
        </div>

        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-input-bg">
              <Phone className="h-4 w-4 text-primary-text" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-gray-opacity mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-primary-text">
                  {showPhone ? contact.phone : maskText(contact.phone)}
                </p>
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="text-text-gray-opacity hover:text-primary transition-colors"
                  aria-label={showPhone ? "Hide phone" : "Show phone"}
                >
                  {showPhone ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <TextProviderButton providerPhone={contact.phone} />
        </div>

        {/* Trust warning below phone */}
        <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-3.5 py-3">
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
            ⚠️ Don&apos;t delete the default message
          </p>
          <p className="text-xs leading-relaxed text-primary-text">
            Escorts on Rosey.link are trained to trust clients who mention the platform. If you remove{" "}
            <span className="font-semibold">&quot;Hi, I found you on Rosey.link&quot;</span> from your first message, providers are less likely to respond — or may ignore you entirely.
          </p>
        </div>

        {contact.instagram && contact.instagram !== "N/A" && contact.instagram !== "undefined" && (
          <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-full bg-input-bg">
                <Instagram className="h-4 w-4 text-primary-text" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-gray-opacity mb-1">Instagram</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-primary-text">
                    {showInstagram ? contact.instagram : maskText(contact.instagram)}
                  </p>
                  <button
                    onClick={() => setShowInstagram(!showInstagram)}
                    className="text-text-gray-opacity hover:text-primary transition-colors"
                    aria-label={showInstagram ? "Hide Instagram" : "Show Instagram"}
                  >
                    {showInstagram ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
