"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTwoFactorStatus } from "@/hooks/use-account";
import { useProfile } from "@/hooks/use-profile";
import {
  ProfileHeaderSkeleton,
  ProfileSectionSkeleton,
} from "@/components/skeletons/profile-skeletons";

const securityList = [
  {
    name: "2-Step Login",
    status: "Enabled",
    description: "Your account is extra secure",
    icon: "/svg/info-icon1.svg",
  },
  {
    name: "Password Safety",
    status: "No breaches found",
    description: "Learn how we check passwords",
    icon: "/svg/info-icon2.svg",
  },
];

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  useCurrentUser();
  const { enabled: twoFactorEnabled, isLoading: twoFactorLoading } =
    useTwoFactorStatus();
  const homeLocation = (() => {
    const locations = Array.isArray(profile?.home_locations)
      ? profile?.home_locations.filter(Boolean)
      : null;
    if (locations?.length) {
      return locations.join(", ");
    }
    if (profile && profile.city) {
      return `${profile.city}${profile.state ? `, ${profile.state}` : ""}${
        profile.country ? `, ${profile.country}` : ""
      }`;
    }
    return null;
  })();

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center mx-auto px-4 md:px-[180px] pt-8">
        <div className="w-full max-w-6xl space-y-6">
          <ProfileHeaderSkeleton />
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileSectionSkeleton />
            <ProfileSectionSkeleton />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center mx-auto px-4 md:px-[180px] pt-8">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col gap-4 md:gap-6">
          <section className="bg-input-bg p-2 md:p-2 rounded-2xl flex flex-col md:flex-row gap-2 flex-1 w-full">
            {securityList.map((item, idx) => {
              const isTwoFactor = item.name === "2-Step Login";
              const statusLabel = isTwoFactor
                ? twoFactorLoading
                  ? "Loading..."
                  : twoFactorEnabled
                    ? "Enabled"
                    : "Disabled"
                : item.status;
              const statusClasses = isTwoFactor
                ? twoFactorEnabled
                  ? "bg-[#12B76A3D] text-[#32D583]"
                  : "bg-[#272729] text-text-gray-opacity"
                : "bg-[#12B76A3D] text-[#32D583]";
              const description = isTwoFactor
                ? twoFactorEnabled
                  ? "Your account is extra secure"
                  : "Add an extra layer of security to your account."
                : item.description;
              return (
                <div key={idx} className="p-2 bg-primary-bg rounded-lg flex-1">
                  <div className="flex p-3 md:p-4 justify-between flex-col rounded-lg bg-input-bg gap-6 md:gap-10">
                    <section className="flex items-center justify-between">
                      <p className="text-lg md:text-2xl font-semibold text-white">
                        {item.name}
                      </p>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="shrink-0"
                      />
                    </section>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${statusClasses}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm md:text-base font-normal text-primary-text pb-2 pt-3 md:pt-4 px-3">
                    {description}
                  </p>
                  {isTwoFactor && (
                    <div className="flex justify-end px-3 pb-2">
                      <Link
                        href="/dashboard/security/2fa"
                        className="text-primary text-xs md:text-sm font-semibold underline"
                      >
                        Manage 2-Step Login
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <section className="flex flex-col gap-8 md:gap-12 p-4 md:p-6 bg-input-bg rounded-2xl flex-1">
              <div className="bg-primary/10 border border-primary/40 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-semibold text-primary-text">
                    Profile Details
                  </h3>
                  <p className="text-xs md:text-sm text-text-gray-opacity">
                    Update your bio, rates, photos, and preferences.
                  </p>
                </div>
                <Link href="/general-information?edit=true" className="w-full md:w-auto">
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto py-[10px] px-5 flex items-center justify-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                  Membership Plan
                </h3>
                <Button className="bg-primary hover:bg-primary/90 text-primary-text w-full md:w-[169px] py-[10px]">
                  Manage
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                  Home Location
                </h3>
                <p className="text-sm md:text-base text-primary-text">
                  {profileLoading || !profile
                    ? "Loading..."
                    : homeLocation || "Not set"}
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
