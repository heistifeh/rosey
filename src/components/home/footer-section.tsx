"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "All Escorts", href: "/search" },
  { label: "Locations", href: "/locations" },
  { label: "Sign Up", href: "/" },
  { label: "Login", href: "/" },
];

const resourcesLinks = [
  { label: "Blog", href: "/" },
  { label: "Escort Terms", href: "/" },
  { label: "FAQs", href: "/" },
];

const socialsLinks = [
  { label: "Twitter", href: "/" },
  { label: "Instagram", href: "/" },
  { label: "Tik Tok", href: "/" },
  { label: "Facebook", href: "/" },
  { label: "Reddit", href: "/" },
];

const supportLinks = [
  { label: "Help/Support", href: "/" },
  { label: "Terms & Conditions", href: "/" },
  { label: "Privacy & Policy", href: "/" },
  { label: "Legal Notices", href: "/" },
];

const locationLinks = [
  { label: "Escorts in Los Angeles", href: "/escorts/united-states/california/los-angeles" },
  { label: "Escorts in San Diego", href: "/escorts/united-states/california/san-diego" },
  { label: "Escorts in San Jose", href: "/escorts/united-states/california/san-jose" },
  { label: "Escorts in San Francisco", href: "/escorts/united-states/california/san-francisco" },
  { label: "Escorts in Sacramento", href: "/escorts/united-states/california/sacramento" },
  { label: "Escorts in Fresno", href: "/escorts/united-states/california/fresno" },
  { label: "Escorts in Oakland", href: "/escorts/united-states/california/oakland" },
  { label: "Escorts in Long Beach", href: "/escorts/united-states/california/long-beach" },
  { label: "Escorts in Anaheim", href: "/escorts/united-states/california/anaheim" },
  { label: "Escorts in Santa Ana", href: "/escorts/united-states/california/santa-ana" },
  { label: "Escorts in Riverside", href: "/escorts/united-states/california/riverside" },
  { label: "Escorts in Irvine", href: "/escorts/united-states/california/irvine" },
];

const toEscortLabel = (raw: string) => {
  const label = raw.trim();
  if (!label) return "Escorts";

  if (/escorts$/i.test(label)) {
    return label;
  }

  const allEscortsMatch = label.match(/^all\s+escorts\s+in\s+(.+)$/i);
  if (allEscortsMatch?.[1]) {
    return `${allEscortsMatch[1].trim()} escorts`;
  }

  const escortsInMatch = label.match(/^escorts\s+in\s+(.+)$/i);
  if (escortsInMatch?.[1]) {
    return `${escortsInMatch[1].trim()} escorts`;
  }

  if (label.includes(",")) {
    const parts = label
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]} escorts`;
    }
    if (parts.length === 1) {
      return `${parts[0]} escorts`;
    }
  }

  return `${label} escorts`;
};

type FooterSectionProps = {
  relatedLocations?: { label: string; href: string }[];
  relatedHeading?: string;
  relatedDescription?: string;
  hideLocationsSection?: boolean;
};

export function FooterSection({
  relatedLocations,
  relatedHeading,
  relatedDescription,
  hideLocationsSection = false,
}: FooterSectionProps) {
  const hasRelated = Boolean(relatedLocations && relatedLocations.length > 0);
  const locationsToRender = (hasRelated ? relatedLocations! : locationLinks).map(
    (item) => ({
      ...item,
      label: toEscortLabel(item.label),
    }),
  );

  return (
    <footer className="w-full bg-primary-bg">
      <div className="px-4 md:px-[60px] py-8 md:py-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 pb-8 md:pb-12">
          {/* Left Side - Branding and Controls */}
          <div className="flex flex-col gap-6">
            <h2 className="text-primary text-4xl md:text-5xl font-normal petemoss">
              Rosey
            </h2>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary-text" />
              <Select defaultValue="english">
                <SelectTrigger className="w-auto border-none bg-transparent text-primary-text p-0 h-auto focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
              {/* <ChevronDown className="h-4 w-4 text-primary-text" /> */}
            </div>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="flex flex-wrap gap-8 md:gap-12 lg:ml-auto">
            {/* Menu Column */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-primary-text font-semibold text-base md:text-lg">
                Menu
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {menuLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors font-normal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-primary-text font-semibold text-sm md:text-base">
                Resources
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {resourcesLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials Column */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-primary-text font-semibold text-sm md:text-base">
                Socials
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {socialsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-primary-text font-semibold text-sm md:text-base">
                Socials
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Horizontal Separator */}
        <div className="border-t border-dark-border my-8"></div>

        {!hideLocationsSection && (
          <div className="pt-4 md:pt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg font-semibold text-primary-text">
                {hasRelated ? relatedHeading || "Related cities" : "Locations"}
              </h3>
              <p className="text-sm text-text-gray-opacity">
                {hasRelated
                  ? relatedDescription ||
                    "Explore nearby cities to find more providers."
                  : "Browse popular locations on Rosey."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4 md:gap-x-8 md:gap-y-3">
              {locationsToRender.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
