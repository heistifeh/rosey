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
import { createServiceRoleClient, SERVICE_ROLE_KEY } from "@/server/supabase-client";
import { dedupeProfilesByIdentity, type HomepageProfile } from "@/lib/profile-identity";

export const metadata: Metadata = buildPageMetadata({
  title: "Rosey | Independent Escorts Near You – Local Escort Directory",
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

export const revalidate = 30;

// Fetch enough to fill both sections (12 cards each) after deduplication.
const TOTAL_FETCH = 300;

export default async function Home() {
  let availableNowProfiles: HomepageProfile[] = [];
  let recentlyActiveProfiles: HomepageProfile[] = [];

  if (SERVICE_ROLE_KEY) {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("profiles")
      .select(
        "id,user_id,working_name,username,city,country,tagline,is_fully_verified,contact_email,contact_phone,source_url,created_at,images(public_url,is_primary)"
      )
      .is("user_id", null)
      .order("created_at", { ascending: false })
      .limit(TOTAL_FETCH);

    const deduped = dedupeProfilesByIdentity(
      (data ?? []) as HomepageProfile[]
    );

    // Split at midpoint so both sections always have profiles
    // regardless of total DB count.
    const mid = Math.ceil(deduped.length / 2);
    availableNowProfiles = deduped.slice(0, mid);
    recentlyActiveProfiles = deduped.slice(mid);
  }

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#homepage`,
        url: SITE_URL,
        name: "Rosey | Independent Escorts Near You – Local Escort Directory",
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
      <AvailableNowSection profiles={availableNowProfiles} />
      <RecentlyActiveSection profiles={recentlyActiveProfiles} />
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
