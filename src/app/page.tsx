"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeroSection } from "@/components/home/hero-section";

import { RecentlyActiveSection } from "@/components/home/recently-active-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BookingGuideSection } from "@/components/home/booking-guide-section";
import { BlogSection } from "@/components/home/blog-section";
import { FAQSection } from "@/components/home/faq-section";
import { FooterSection } from "@/components/home/footer-section";
import { AvailableNowSection } from "@/components/home/available-now-section";

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<{
    gender: string;
    priceRange?: string;
    location?: {
      city: string;
      country: string;
      city_slug: string;
      country_slug: string;
    };
  }>({
    gender: "Female",
  });

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <section className=" flex flex-col ">
      <main className="relative  overflow-hidden bg-[#0f0f10]">
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
          <header className="flex px-4 pt-4 md:px-[60px] md:pt-[60px]">
            <div className="w-full md:hidden">
              <section className="flex w-full items-center justify-between rounded-[200px] bg-primary-text px-4 py-3">
                <Link href="/" className="inline-flex items-center">
                  <Image
                    src="/images/logo.svg"
                    alt="Discover Escort"
                    width={121}
                    height={35}
                    className="h-auto"
                    priority
                  />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a]"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </section>
              {isMobileMenuOpen && (
                <div className="mt-3 rounded-[24px] bg-primary-text p-4 shadow-lg">
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/blog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-[200px] bg-tag-bg px-4 py-2 text-sm font-medium text-primary-text"
                    >
                      Blog
                    </Link>
                    <div className="flex items-center gap-2 rounded-[200px] border border-[#E5E5EA] px-3 py-3">
                      <Search size={16} color={"#8E8E93"} />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-center rounded-[200px] bg-primary px-6 py-3">
                      <p className="text-primary-text text-sm font-semibold">
                        Login
                      </p>
                      <p className="text-primary-text text-sm font-semibold">
                        /
                      </p>
                      <p className="text-primary-text text-sm font-semibold">
                        Signup
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <section className="hidden w-full justify-between rounded-[200px] bg-primary-text p-4 md:flex">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/images/logo.svg"
                  alt="Discover Escort"
                  width={121}
                  height={35}
                  className="h-auto"
                  priority
                />
              </Link>

              <div className=" flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setActiveNav(link.label)}
                    className={`text-base font-medium transition-colors ${activeNav === link.label
                        ? "bg-primary rounded-[200px] py-2 px-[33px] text-primary-text"
                        : "text-[#8E8E93]"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <section className=" flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-[200px] px-3 py-3  border border-[#E5E5EA] w-[290px]">
                  <Search size={16} color={"#8E8E93"} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-32 bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                  />
                </div>
                <div className=" flex items-center  bg-primary rounded-[200px] px-[31px] py-[13px]">
                  <p className="text-primary-text text-base font-semibold">
                    Login
                  </p>
                  <p className="text-primary-text text-base font-semibold">/</p>
                  <p className="text-primary-text text-base font-semibold">
                    Signup
                  </p>
                </div>
              </section>
            </section>
          </header>

          <HeroSection filters={filters} setFilters={setFilters} />
          {/* <AvailableNowSection /> */}
        </div>
      </main>
      <AvailableNowSection filters={filters} setFilters={setFilters} />
      <RecentlyActiveSection />
      <TestimonialsSection />
      <BookingGuideSection />
      <BlogSection />
      <FAQSection />
      <FooterSection />
    </section>
  );
}
