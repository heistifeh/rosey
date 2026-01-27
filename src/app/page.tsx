"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-current-user";

import { RecentlyActiveSection } from "@/components/home/recently-active-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BookingGuideSection } from "@/components/home/booking-guide-section";
import { BlogSection } from "@/components/home/blog-section";
import { FAQSection } from "@/components/home/faq-section";
import { FooterSection } from "@/components/home/footer-section";
import { AvailableNowSection } from "@/components/home/available-now-section";

interface Filters {
  gender: string;
  priceRange: string;
  location?: {
    city: string;
    country: string;
    city_slug: string;
    country_slug: string;
  };
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    gender: "All",
    priceRange: "",
  });

  useCurrentUser();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  //  useEffect(() => {
  //   const load = async () => {
  //     const user = await apiBuilder.auth.getCurrentUser();
  //     if (!user) {
  //       // not logged in → redirect or show login
  //       return;
  //     }

  //     console.log("Current user id:", user);
  //     // use user.id to fetch /rest/v1/profiles?user_id=eq.${user.id}
  //   };

  //   load();
  // }, []);

  const handleAuthAction = () => {
    if (user) {
      clearUser();
      router.push("/");
      return;
    }

    router.push("/login");
  };

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
          <Header />

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
