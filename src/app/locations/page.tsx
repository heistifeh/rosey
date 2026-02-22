import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { LocationDirectory } from "@/components/location/location-directory";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

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
  return (
    <section className="flex min-h-screen flex-col bg-[#0f0f10]">
      <div className="relative">
        <Header />
      </div>
      <main className="flex-1">
        <LocationDirectory />
      </main>
      <FooterSection hideLocationsSection />
    </section>
  );
}
