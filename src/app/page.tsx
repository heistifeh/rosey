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
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Rosey | Find Independent Companions",
  description:
    "Browse verified companion profiles, discover available providers by city, and connect discreetly on Rosey.",
  path: "/",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "find companions",
    "escort profiles by city",
    "available now escorts",
  ],
});

export default function Home() {
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
    </section>
  );
}
