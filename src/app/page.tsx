import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { RecentlyActiveSection } from "@/components/home/recently-active-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BookingGuideSection } from "@/components/home/booking-guide-section";
import { BlogSection } from "@/components/home/blog-section";
import { FAQSection } from "@/components/home/faq-section";
import { FooterSection } from "@/components/home/footer-section";
import { AvailableNowSection } from "@/components/home/available-now-section";
import { HeroShell } from "@/components/home/hero-shell";
import { SearchShortcutsSection } from "@/components/home/search-shortcuts-section";
import { AgeGateModal } from "@/components/home/age-gate-modal";
import {
  CORE_SEO_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Rosey | Find Independent Escorts",
  description:
    "Find verified independent escorts on Rosey.link. Browse local escort listings by city, rates, and real-time availability. Discreet profiles and direct contact options. 18+ only.",
  path: "/",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "find escorts",
    "escort profiles by city",
    "available now escorts",
  ],
});

export default function Home() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#homepage`,
        url: SITE_URL,
        name: "Rosey | Find Independent Escorts",
        description: metadata.description,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        breadcrumb: {
          "@id": `${SITE_URL}/#breadcrumb-home`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb-home`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#homepage-listings`,
        name: `Featured listings on ${SITE_NAME}`,
        url: SITE_URL,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
      },
    ],
  };

  return (
    <section className="flex flex-col">
      <AgeGateModal />
      <main className="relative overflow-hidden bg-[#0f0f10]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-b z-1" />
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.png"
              alt="Hero background"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        <div className="relative z-2 flex flex-col min-h-screen">
          <Header />
          <HeroShell />
        </div>
      </main>
      <AvailableNowSection />
      <RecentlyActiveSection />
      <TestimonialsSection />
      <BookingGuideSection />
      <SearchShortcutsSection />
      <BlogSection />
      <FAQSection />
      <FooterSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
    </section>
  );
}
