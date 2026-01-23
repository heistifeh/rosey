"use client";

import {
  Bell,
  User,
  Camera,
  BarChart3,
  Wallet,
  X,
  Menu,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import dynamic from "next/dynamic";

import { useProfile } from "@/hooks/use-profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LocationFilter } from "@/components/location-filter";
import { useProfileImages } from "@/hooks/use-profile-images";
const NotificationBell = dynamic(
  () =>
    import("@/components/dashboard/notification-bell").then(
      (mod) => mod.NotificationBell,
    ),
  {
    ssr: false,
  },
);
export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(true);
  const [mounted, setMounted] = useState(false);
  useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: profileImages = [] } = useProfileImages(profile?.id);
  const profileType =
    typeof profile?.profile_type === "string" ? profile.profile_type : "";
  const isEscort = profileType.toLowerCase() === "escort";

  useEffect(() => {
    if (profileLoading) return;

    if (!profile) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (!isEscort) {
      router.replace("/");
    }
  }, [profileLoading, profile, isEscort, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Bell },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Manage Pictures", href: "/manage-pictures", icon: Camera },
    {
      label: "Ad Management",
      href: "/dashboard/ad-management",
      icon: BarChart3,
    },
    { label: "Place Ad", href: "/dashboard/place-ad", icon: Plus },
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  ];

  if (profileLoading || !profile || !isEscort) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <p className="text-primary-text text-sm">Checking your access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <header className="bg-input-bg border-b border-dark-border sticky top-0 z-10">
        <div className="px-4 md:px-8 lg:px-15  py-[20px] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <button className="text-primary-text hover:text-primary transition-colors">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] bg-input-bg p-0 border-r border-dark-border"
                >
                  <SheetHeader className="p-6 border-b border-dark-border">
                    <SheetTitle className="text-left">
                      <span className="text-primary text-3xl font-normal petemoss">
                        Rosey
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname?.startsWith(item.href);
                      return (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-primary text-primary-text"
                                : "text-text-gray-opacity hover:bg-primary-bg"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/" className="inline-flex items-center">
                <span className="text-primary text-3xl md:text-[32px] font-normal petemoss">
                  Rosey
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-10 h-full">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname?.startsWith(item.href);
                return (
                  <div
                    key={item.href}
                    className="relative h-full flex items-center"
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-[#8E8E93] hover:text-primary-text"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                    {isActive && (
                      <span className="absolute bottom-[-40px] left-0 right-0 h-0.5 bg-primary"></span>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden lg:flex lg:flex-col lg:w-[280px] gap-2">
                <LocationFilter />
              </div>

              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-primary-bg rounded-full">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        profileImages.find((img) => img.is_primary)
                          ?.public_url ||
                        profileImages[0]?.public_url ||
                        "/images/girl1.png"
                      }
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-primary-text font-normal text-base">
                    {profile ? `${profile.working_name}` : "Loading..."}
                  </p>
                </div>
                <div className="md:hidden relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={
                      profileImages.find((img) => img.is_primary)?.public_url ||
                      profileImages[0]?.public_url ||
                      "/images/girl1.png"
                    }
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showNotification &&
        pathname !== "/dashboard/profile" &&
        pathname !== "/dashboard/photos" &&
        pathname !== "/manage-pictures" &&
        pathname !== "/dashboard/wallet" &&
        pathname !== "/dashboard/wallet/transactions" &&
        pathname !== "/dashboard/ad-management" &&
        pathname !== "/dashboard/place-ad" && (
          <div className="flex justify-center px-4 md:px-8 lg:px-12  pt-10">
            <div className="bg-[#552833] border border-primary rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between max-w-4xl w-full">
              <p className="text-primary-text text-sm md:text-base">
                Your Photos have been submitted for review
              </p>
              <button
                onClick={() => setShowNotification(false)}
                className="h-6 w-6 rounded-full bg-primary-bg flex items-center justify-center hover:bg-input-bg transition-colors shrink-0 ml-4"
              >
                <X className="h-4 w-4 text-primary-text" />
              </button>
            </div>
          </div>
        )}

      <main className="px-4 md:px-8 lg:px-12 py-6 md:py-8 overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
