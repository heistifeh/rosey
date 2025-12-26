"use client";

import { Search } from "lucide-react";
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
          <header className=" flex px-[60px] pt-[60px]">
            <section className=" flex justify-between bg-primary-text rounded-[200px]  p-4 w-full">
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
                    className={`text-base font-medium transition-colors ${
                      activeNav === link.label
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

          <HeroSection />
          {/* <AvailableNowSection /> */}
        </div>
      </main>
      <AvailableNowSection />
      <RecentlyActiveSection />
      <TestimonialsSection />
      <BookingGuideSection />
      <BlogSection />
      <FAQSection />
      <FooterSection />
    </section>
  );
}
