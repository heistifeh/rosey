"use client";

import { Shield, ShieldAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/use-current-user";
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
  const homeLocation =
    profile?.home_locations?.filter(Boolean).join(", ") ||
    (profile && profile.city
      ? `${profile.city}${profile.state ? `, ${profile.state}` : ""}${
          profile.country ? `, ${profile.country}` : ""
        }`
      : null);

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
            {securityList.map((item, idx) => (
              <div key={idx} className="p-2 bg-primary-bg rounded-lg flex-1">
                <div className="flex p-3 md:p-4 justify-between flex-col rounded-lg bg-input-bg gap-6 md:gap-10">
                  <section className="flex items-center justify-between">
                    <p className="text-lg md:text-2xl font-semibold">
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
                    <span className="px-3 py-1 bg-[#12B76A3D] text-[#32D583] rounded-full text-xs md:text-sm font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm md:text-base font-normal text-primary-text pb-2 pt-3 md:pt-4 px-3">
                  {item.description}
                </p>
              </div>
            ))}
          </section>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <section className="flex flex-col gap-8 md:gap-12 p-4 md:p-6 bg-input-bg rounded-2xl flex-1">
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

            <section className="flex flex-col gap-4 md:gap-[22px] rounded-2xl p-4 md:p-6 bg-input-bg flex-1">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-primary-text mb-3 md:mb-4">
                  Availability
                </h3>
                <div className="bg-[#F63D683D] border border-[#F63D68] rounded-lg p-3 md:p-4">
                  <p className="text-sm md:text-base text-[#FCFCFD]">
                    You can't set availability until your profile is approved
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-primary-text mb-3 md:mb-4">
                  Approval Status
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs md:text-sm font-medium">
                    Pending
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
