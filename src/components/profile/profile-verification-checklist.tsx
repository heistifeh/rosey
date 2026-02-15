"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Profile } from "@/types/types";

interface ProfileVerificationChecklistProps {
  profile: Profile;
}

const checklist = [
  {
    id: "1",
    label: "A verification photo that meets our requirements",
    field: "verification_photo_verified" as const,
  },
  {
    id: "2",
    label: "Valid age-verification ID",
    field: "id_verified" as const,
  },
  {
    id: "3",
    label: "At least 3 approved photos",
    field: "min_photos_verified" as const,
  },
  {
    id: "4",
    label: "All required profile fields filled out",
    field: "profile_fields_verified" as const,
  },
];

export function ProfileVerificationChecklist({
  profile,
}: ProfileVerificationChecklistProps) {
  const imageCount = Array.isArray(profile?.images) ? profile.images.length : 0;

  return (
    <div className="flex flex-col gap-3">
      {checklist.map((item) => {
        let status: "verified" | "pending" | "not_verified" = "not_verified";

        if (item.field === "verification_photo_verified") {
          status = profile?.verification_photo_verified ? "verified" : "pending";
        } else if (item.field === "min_photos_verified") {
          if (imageCount === 0) {
            status = "pending";
          } else if (imageCount >= 3 || profile?.min_photos_verified) {
            status = "verified";
          } else {
            status = "not_verified";
          }
        } else if (item.field === "profile_fields_verified") {
          status =
            profile?.profile_fields_verified === false ? "not_verified" : "verified";
        } else {
          status = profile?.[item.field] ? "verified" : "not_verified";
        }

        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-dark-border bg-primary-bg px-4 py-3"
          >
            <div className="text-sm md:text-base text-primary-text">
              {item.label}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              {status === "verified" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Verified</span>
                </>
              ) : status === "pending" ? (
                <>
                  <Clock3 className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400">Pending</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span className="text-rose-400">Not Verified</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
