"use client";

import { Shield, ShieldAlert, Info, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTwoFactorStatus } from "@/hooks/use-account";
import { useProfile } from "@/hooks/use-profile";
import { ProfileVerificationChecklist } from "@/components/profile/profile-verification-checklist";
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
  const approvalStatus = profile?.approval_status ?? "pending";
  const isApproved = approvalStatus === "approved";
  const availableDays = profile?.available_days ?? [];
  const availabilitySummary =
    availableDays.length > 0
      ? availableDays.join(", ")
      : "Availability not configured yet";

  const statusBadge = (() => {
    switch (approvalStatus) {
      case "approved":
        return {
          label: "Approved",
          wrapper: "bg-emerald-500/20 text-emerald-400",
          Icon: Shield,
        };
      case "rejected":
        return {
          label: "Rejected",
          wrapper: "bg-red-500/20 text-red-400",
          Icon: ShieldAlert,
        };
      default:
        return {
          label: "Pending",
          wrapper: "bg-orange-500/20 text-orange-400",
          Icon: Info,
        };
    }
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

              <div className="flex flex-col gap-4">
                <Link href="/general-information?edit=true">
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-[169px] py-[10px] flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </section>

            <section className="flex flex-col gap-4 md:gap-[22px] rounded-2xl p-4 md:p-6 bg-input-bg flex-1">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-primary-text mb-3 md:mb-4">
                  Availability
                </h3>
                {isApproved ? (
                  <div className="bg-primary-bg border border-dark-border rounded-lg p-3 md:p-4">
                    <p className="text-sm md:text-base text-primary-text">
                      Your availability is published for clients.
                    </p>
                    <p className="text-xs text-text-gray-opacity mt-1">
                      {availabilitySummary}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#F63D683D] border border-[#F63D68] rounded-lg p-3 md:p-4">
                    <p className="text-sm md:text-base text-[#FCFCFD]">
                      You can't set availability until your profile is approved
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-primary-text mb-3 md:mb-4">
                  Approval Status
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <statusBadge.Icon className="h-4 w-4" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${statusBadge.wrapper}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                  {profile?.verified_at && (
                    <p className="text-sm text-text-gray-opacity">
                      Verified on{" "}
                      {new Date(profile.verified_at).toLocaleDateString()}
                    </p>
                  )}
                  {profile?.verification_notes && (
                    <p className="text-sm text-text-gray-opacity">
                      {profile.verification_notes}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="bg-input-bg rounded-2xl p-4 md:p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-primary-text">
                Verification checklist
              </h3>
              <span className="text-xs text-text-gray-opacity">
                Updated by admins
              </span>
            </div>
            {profile && <ProfileVerificationChecklist profile={profile} />}
          </section>
        </div>
      </div>
    </div>
  );
}
