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
import { useI18n } from "@/lib/i18n/provider";
import { isSupportedLocale, type Locale } from "@/lib/i18n/config";

type LocalizedLink = {
  labelKey: string;
  href: string;
};

const languageOptions: Array<{ value: Locale; labelKey: string }> = [
  { value: "en", labelKey: "common.english" },
  { value: "es", labelKey: "common.spanish" },
  { value: "fr", labelKey: "common.french" },
];

const menuLinks: LocalizedLink[] = [
  { labelKey: "common.home", href: "/" },
  { labelKey: "common.allEscorts", href: "/search" },
  { labelKey: "common.locations", href: "/locations" },
  { labelKey: "common.signUp", href: "/" },
  { labelKey: "common.login", href: "/" },
];

const resourcesLinks: LocalizedLink[] = [
  { labelKey: "common.blog", href: "/blog" },
  { labelKey: "footer.resourceEscortTerms", href: "/" },
  { labelKey: "footer.resourceFaqs", href: "/" },
];

const socialsLinks = [
  { label: "Twitter", href: "/" },
  { label: "Instagram", href: "/" },
  { label: "Tik Tok", href: "/" },
  { label: "Facebook", href: "/" },
  { label: "Reddit", href: "/" },
];

const supportLinks: LocalizedLink[] = [
  { labelKey: "footer.supportHelp", href: "/" },
  { labelKey: "footer.supportTerms", href: "/" },
  { labelKey: "footer.supportPrivacy", href: "/" },
  { labelKey: "footer.supportLegal", href: "/" },
];

const locationLinks = [
  {
    label: "Escorts in Los Angeles",
    href: "/escorts/united-states/california/los-angeles",
  },
  {
    label: "Escorts in San Diego",
    href: "/escorts/united-states/california/san-diego",
  },
  {
    label: "Escorts in San Jose",
    href: "/escorts/united-states/california/san-jose",
  },
  {
    label: "Escorts in San Francisco",
    href: "/escorts/united-states/california/san-francisco",
  },
  {
    label: "Escorts in Sacramento",
    href: "/escorts/united-states/california/sacramento",
  },
  {
    label: "Escorts in Fresno",
    href: "/escorts/united-states/california/fresno",
  },
  {
    label: "Escorts in Oakland",
    href: "/escorts/united-states/california/oakland",
  },
  {
    label: "Escorts in Long Beach",
    href: "/escorts/united-states/california/long-beach",
  },
  {
    label: "Escorts in Anaheim",
    href: "/escorts/united-states/california/anaheim",
  },
  {
    label: "Escorts in Santa Ana",
    href: "/escorts/united-states/california/santa-ana",
  },
  {
    label: "Escorts in Riverside",
    href: "/escorts/united-states/california/riverside",
  },
  {
    label: "Escorts in Irvine",
    href: "/escorts/united-states/california/irvine",
  },
];

const toEscortLabel = (raw: string, escortsWord: string) => {
  const label = raw.trim();
  if (!label) return escortsWord;

  if (/escorts$/i.test(label)) {
    return label.replace(/escorts$/i, escortsWord);
  }

  const allEscortsMatch = label.match(/^all\s+escorts\s+in\s+(.+)$/i);
  if (allEscortsMatch?.[1]) {
    return `${allEscortsMatch[1].trim()} ${escortsWord}`;
  }

  const escortsInMatch = label.match(/^escorts\s+in\s+(.+)$/i);
  if (escortsInMatch?.[1]) {
    return `${escortsInMatch[1].trim()} ${escortsWord}`;
  }

  if (label.includes(",")) {
    const parts = label
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]} ${escortsWord}`;
    }
    if (parts.length === 1) {
      return `${parts[0]} ${escortsWord}`;
    }
  }

  return `${label} ${escortsWord}`;
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
  const { locale, setLocale, t } = useI18n();
  const selectedLocale: Locale = isSupportedLocale(locale) ? locale : "en";
  const escortsWord = t("common.escorts");

  const hasRelated = Boolean(relatedLocations && relatedLocations.length > 0);
  const locationsToRender = (hasRelated ? relatedLocations! : locationLinks).map(
    (item) => ({
      ...item,
      label: toEscortLabel(item.label, escortsWord),
    }),
  );

  const handleLocaleChange = (nextLocale: string) => {
    if (!isSupportedLocale(nextLocale)) return;
    setLocale(nextLocale);
  };

  return (
    <footer className="w-full bg-primary-bg">
      <div className="px-4 py-8 md:px-[60px] md:py-12">
        <div className="flex flex-col gap-8 pb-8 md:gap-12 md:pb-12 lg:flex-row">
          <div className="flex flex-col gap-6">
            <h2 className="petemoss text-4xl font-normal text-primary md:text-5xl">
              Rosey
            </h2>

            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary-text" />
              <Select value={selectedLocale} onValueChange={handleLocaleChange}>
                <SelectTrigger className="h-auto w-auto border-none bg-transparent p-0 text-primary-text focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 md:gap-12 lg:ml-auto">
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-base font-semibold text-primary-text md:text-lg">
                {t("footer.menuTitle")}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {menuLinks.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-sm font-normal text-text-gray transition-colors hover:text-primary-text md:text-base"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-sm font-semibold text-primary-text md:text-base">
                {t("footer.resourcesTitle")}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {resourcesLinks.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-gray transition-colors hover:text-primary-text md:text-base"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-sm font-semibold text-primary-text md:text-base">
                {t("footer.socialsTitle")}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {socialsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-gray transition-colors hover:text-primary-text md:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-sm font-semibold text-primary-text md:text-base">
                {t("footer.supportTitle")}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {supportLinks.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-gray transition-colors hover:text-primary-text md:text-base"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-dark-border" />

        {!hideLocationsSection && (
          <div className="flex flex-col gap-4 pt-4 md:pt-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-primary-text md:text-lg">
                {hasRelated
                  ? relatedHeading || t("footer.relatedCitiesTitle")
                  : t("footer.locationsTitle")}
              </h3>
              <p className="text-sm text-text-gray-opacity">
                {hasRelated
                  ? relatedDescription || t("footer.relatedCitiesDescription")
                  : t("footer.locationsDescription")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4 md:gap-x-8 md:gap-y-3">
              {locationsToRender.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="text-sm text-text-gray transition-colors hover:text-primary-text md:text-base"
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
