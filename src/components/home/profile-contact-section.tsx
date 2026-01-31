"use client";

import { Mail, Phone, MapPin, ArrowRight as ArrowRightIcon, Eye, EyeOff } from "lucide-react";
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

        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-input-bg">
              <MapPin className="h-4 w-4 text-primary-text" />
            </div>
            <div>
              <p className="text-xs text-text-gray-opacity mb-1">Location</p>
              <p className="text-sm text-primary-text">{contact.location}</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
