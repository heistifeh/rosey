import Link from "next/link";

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

const COUNTRY_SHORTCUTS = [
  { label: "United States", slug: "united-states" },
  { label: "Canada", slug: "canada" },
];

export function SearchShortcutsSection() {
  return (
    <section className="w-full bg-input-bg px-4 py-10 md:px-[60px] md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[24px] border border-dark-border bg-primary-bg/70 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
            Explore By Ethnicity And Country
          </h2>
          <p className="text-sm text-text-gray-opacity">
            Jump straight to filtered results.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-gray-opacity">
            Ethnicity
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
            Country
          </p>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_SHORTCUTS.map((country) => (
              <Link
                key={country.slug}
                href={`/search?country=${country.slug}`}
                className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs text-primary-text transition-colors hover:border-primary hover:text-primary md:text-sm"
              >
                {country.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
