import Link from "next/link";
import { Country } from "country-state-city";
import { getServerTranslator } from "@/lib/i18n/server";
import { slugifyLocation } from "@/lib/google-places";
import { SearchCountryShortcuts } from "./search-country-shortcuts";

const ETHNICITY_OPTIONS = [
  "Asian",
  "Black",
  "White",
  "Hispanic",
  "Latino",
  "Middle Eastern",
  "Native American",
  "Mixed",
];

const HOMEPAGE_COUNTRY_ISO_CODES = [
  "US",
  "CA",
  "MX",
  "GB",
  "FR",
  "DE",
  "NL",
  "ES",
  "IT",
  "IE",
  "CH",
  "DK",
  "NO",
  "SE",
  "FI",
  "PL",
  "AE",
  "HK",
  "TH",
  "KR",
  "PH",
  "JP",
  "SG",
  "AU",
  "NZ",
];

const COUNTRY_SHORTCUTS = (() => {
  const preferredOrder = new Map(
    HOMEPAGE_COUNTRY_ISO_CODES.map((isoCode, index) => [isoCode, index]),
  );

  return Country.getAllCountries()
    .filter((country) => preferredOrder.has(country.isoCode))
    .map((country) => ({
      isoCode: country.isoCode,
      label: country.name,
      slug: slugifyLocation(country.name),
    }))
    .sort(
      (a, b) =>
        (preferredOrder.get(a.isoCode) ?? Number.MAX_SAFE_INTEGER) -
        (preferredOrder.get(b.isoCode) ?? Number.MAX_SAFE_INTEGER),
    )
    .map(({ label, slug }) => ({ label, slug }));
})();

export async function SearchShortcutsSection() {
  const { t } = await getServerTranslator();

  return (
    <section className="w-full bg-input-bg px-4 py-10 md:px-[60px] md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[24px] border border-dark-border bg-primary-bg/70 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
            {t("searchShortcuts.title")}
          </h2>
          <p className="text-sm text-text-gray-opacity">
            {t("searchShortcuts.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-gray-opacity">
            {t("searchShortcuts.ethnicity")}
          </p>
          <div className="flex flex-wrap gap-2">
            {ETHNICITY_OPTIONS.map((ethnicity) => (
              <Link
                key={ethnicity}
                href={`/search?ethnicity=${encodeURIComponent(ethnicity)}`}
                className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs text-primary-text transition-colors hover:border-primary hover:text-primary md:text-sm"
              >
                {ethnicity}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-gray-opacity">
            {t("searchShortcuts.country")}
          </p>
          <SearchCountryShortcuts
            countries={COUNTRY_SHORTCUTS}
            viewAllLabel={t("searchShortcuts.viewAllCountries")}
            showMoreLabel={t("searchShortcuts.showMoreCountries")}
            showLessLabel={t("searchShortcuts.showFewerCountries")}
          />
        </div>
      </div>
    </section>
  );
}
