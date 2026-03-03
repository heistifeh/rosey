"use client";

import { Menu, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useI18n } from "@/lib/i18n/provider";
import { apiBuilder } from "@/api/builder";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useCurrentUser();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();
  const { t } = useI18n();
  const normalizedRole = (user?.role ?? "").toLowerCase();
  const shouldCheckEscortProfile = Boolean(user?.id) && normalizedRole !== "escort";
  const { data: myProfileFallback } = useQuery({
    queryKey: ["header-my-profile-fallback", user?.id],
    queryFn: async () => {
      try {
        return await apiBuilder.profiles.getMyProfile();
      } catch {
        return null;
      }
    },
    enabled: shouldCheckEscortProfile,
    retry: false,
    staleTime: 60_000,
  });
  const isEscortFromProfile =
    typeof myProfileFallback?.profile_type === "string" &&
    myProfileFallback.profile_type.toLowerCase() === "escort";
  const isEscort = normalizedRole === "escort" || isEscortFromProfile;

  const isHomeActive = pathname === "/";
  const isBlogActive = pathname.startsWith("/blog");
  const isAdvertiseActive = pathname.startsWith("/advertisement");

  const handleAuthAction = async () => {
    if (user) {
      clearUser();
      setIsMobileMenuOpen(false);
      await apiBuilder.auth.signOut();
      router.push("/");
      return;
    }
    router.push("/login");
  };

  return (
    <header className="relative z-50 flex px-4 pt-4 md:px-[60px] md:pt-[60px]">
      <div className="w-full md:hidden">
        <section className="flex w-full items-center justify-between rounded-[200px] bg-primary-text px-4 py-3">
          <Link href="/" className="inline-flex items-center">
            <span className="petemoss text-3xl font-normal text-primary md:hidden">
              Rosey
            </span>
            <Image
              src="/images/logo.svg"
              alt="Rosey"
              width={47}
              height={25}
              className="hidden md:block"
              priority
            />
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1a1a1a]"
            aria-label={t("header.toggleMenu")}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </section>
        {isMobileMenuOpen && (
          <div className="absolute left-4 right-4 z-50 mt-3 rounded-[24px] bg-primary-text p-4 shadow-lg">
            <div className="flex flex-col gap-3">
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-[200px] bg-tag-bg px-4 py-2 text-sm font-medium text-primary-text"
              >
                {t("common.blog")}
              </Link>
              <Link
                href="/advertisement"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-[200px] bg-tag-bg px-4 py-2 text-sm font-medium text-primary-text"
              >
                {t("common.advertise")}
              </Link>
              <div className="flex items-center gap-2 rounded-[200px] border border-[#E5E5EA] px-3 py-3">
                <Search size={16} color="#8E8E93" />
                <input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
                />
              </div>
              <div className="flex cursor-pointer items-center justify-center gap-3">
                {isEscort && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-[200px] bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-text"
                  >
                    {t("common.dashboard")}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleAuthAction}
                  className="w-full cursor-pointer rounded-[200px] bg-primary px-6 py-3 text-sm font-semibold text-primary-text"
                >
                  {user ? t("common.signOut") : t("common.loginSignup")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="hidden w-full items-center justify-between gap-2 rounded-[200px] bg-primary-text p-3 md:flex md:p-4 lg:gap-4">
        <Link href="/" className="inline-flex flex-shrink-0 items-center">
          <span className="petemoss text-2xl font-normal text-primary lg:text-3xl xl:text-[32px]">
            Rosey
          </span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-10">
          <Link
            href="/"
            className={`whitespace-nowrap text-sm font-medium transition-colors lg:text-base ${
              isHomeActive
                ? "rounded-[200px] bg-primary px-4 py-2 text-primary-text lg:px-[33px]"
                : "text-[#8E8E93] hover:text-primary-text"
            }`}
          >
            {t("common.home")}
          </Link>
          <Link
            href="/blog"
            className={`whitespace-nowrap text-sm font-medium transition-colors lg:text-base ${
              isBlogActive
                ? "rounded-[200px] bg-primary px-4 py-2 text-primary-text lg:px-[33px]"
                : "text-[#8E8E93] hover:text-primary-text"
            }`}
          >
            {t("common.blog")}
          </Link>
          <Link
            href="/advertisement"
            className={`whitespace-nowrap text-sm font-medium transition-colors lg:text-base ${
              isAdvertiseActive
                ? "rounded-[200px] bg-primary px-4 py-2 text-primary-text lg:px-[33px]"
                : "text-[#8E8E93] hover:text-primary-text"
            }`}
          >
            {t("common.advertise")}
          </Link>
        </div>

        <section className="flex flex-shrink-0 items-center gap-2">
          <div className="hidden min-w-[180px] items-center gap-2 rounded-[200px] border border-[#E5E5EA] px-3 py-3 lg:flex xl:min-w-[240px]">
            <Search size={16} color="#8E8E93" className="flex-shrink-0" />
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-[#8E8E93] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {isEscort && (
              <Link
                href="/dashboard"
                className="cursor-pointer whitespace-nowrap rounded-[200px] border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 lg:px-6 lg:py-3 lg:text-base"
              >
                {t("common.dashboard")}
              </Link>
            )}
            <button
              type="button"
              onClick={handleAuthAction}
              className="cursor-pointer whitespace-nowrap rounded-[200px] bg-primary px-4 py-2 text-sm font-semibold text-primary-text lg:px-6 lg:py-3 lg:text-base xl:px-[31px]"
            >
              {user ? t("common.signOut") : t("common.loginSignup")}
            </button>
          </div>
        </section>
      </section>
    </header>
  );
}
