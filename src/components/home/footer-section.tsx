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
  { label: "All Escorts", href: "/" },
  { label: "Locations", href: "/" },
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
  { label: "Escorts in Lagos", href: "/escorts/nigeria/lagos" },
  { label: "Escorts in Miami", href: "/escorts/us/miami" },
];

type FooterSectionProps = {
  relatedLocations?: { label: string; href: string }[];
  relatedHeading?: string;
  relatedDescription?: string;
};

export function FooterSection({
  relatedLocations,
  relatedHeading,
  relatedDescription,
}: FooterSectionProps) {
  const hasRelated = Boolean(relatedLocations && relatedLocations.length > 0);
  const locationsToRender = hasRelated ? relatedLocations! : locationLinks;
  const chunkSize =
    locationsToRender.length > 0
      ? Math.ceil(locationsToRender.length / 4)
      : 0;
  const locationColumns =
    chunkSize > 0
      ? Array.from({ length: Math.ceil(locationsToRender.length / chunkSize) })
        .map((_, idx) =>
          locationsToRender.slice(idx * chunkSize, (idx + 1) * chunkSize),
        )
      : [];

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

            {/* Profile Filter */}
            <div className="flex items-center gap-2">
              <span className="text-text-gray text-sm md:text-base">
                Showing
              </span>
              <button className="bg-input-bg text-primary-text px-4 py-2 rounded-full text-sm md:text-base">
                Female Profiles
              </button>
              <Link
                href="#"
                className="text-primary text-sm md:text-base hover:underline"
              >
                Change
              </Link>
            </div>

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

        {/* Bottom Section - Location Links */}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            {locationColumns.map((column, idx) => (
              <div key={idx} className="flex flex-col gap-2 md:gap-3">
                {column.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-text-gray text-sm md:text-base hover:text-primary-text transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
