import type { Metadata } from "next";
import { Country } from "country-state-city";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { LocationDirectory } from "@/components/location/location-directory";
import { slugifyLocation } from "@/lib/google-places";
import { CORE_SEO_KEYWORDS, SITE_URL, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Locations Directory | Rosey",
  description:
    "Explore Rosey locations by country, state, and city to find companion profiles in your preferred area.",
  path: "/locations",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "escort locations",
    "city directory",
    "country and state listings",
  ],
});

export default function LocationsPage() {
  const priorityCountryCodes = new Set(["US", "CA"]);
  const topCountries = (Country.getAllCountries() as Array<{ name: string; isoCode: string }>)
    .sort((a, b) => {
      const aPriority = priorityCountryCodes.has(a.isoCode) ? 0 : 1;
      const bPriority = priorityCountryCodes.has(b.isoCode) ? 0 : 1;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, 24);

  const locationsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/locations#webpage`,
        url: `${SITE_URL}/locations`,
        name: "Locations Directory | Rosey",
        description:
          "Explore Rosey locations by country, state, and city to find companion profiles in your preferred area.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        breadcrumb: {
          "@id": `${SITE_URL}/locations#breadcrumb`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/locations#country-list`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/locations#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Locations",
            item: `${SITE_URL}/locations`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/locations#country-list`,
        name: "Rosey location directory countries",
        numberOfItems: topCountries.length,
        itemListElement: topCountries.map((country, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: country.name,
          url: `${SITE_URL}/escorts/${slugifyLocation(country.name)}`,
        })),
      },
    ],
  };

  return (
    <section className="flex min-h-screen flex-col bg-[#0f0f10]">
      <div className="relative">
        <Header />
      </div>
      <main className="flex-1">
        <LocationDirectory />
      </main>
      <FooterSection hideLocationsSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }}
      />
    </section>
  );
}
