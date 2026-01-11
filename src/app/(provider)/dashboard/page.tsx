"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ChecklistItem {
  id: string;
  text: string;
  status: "verified" | "not-verified";
}

export default function DashboardPage() {
  // const userId = useAuthStore((state) => state.user?.id);

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", userId],
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    queryFn: () => apiBuilder.profiles.getProfileByUserId(userId!),
  });
  useCurrentUser();

  useEffect(() => {
    console.log("Provider dashboard current user:", user);
    if (profile) {
      console.log("Provider dashboard user profile:", profile);
    }
  }, [user, profile]);

  const links = [
    "Getting Verified on Rosey",
    "Profile photo guidelines",
    "Promoting yourself",
    "Code of Conduct",
    "Advertising Policy",
  ];

  const checklistItems: ChecklistItem[] = [
    {
      id: "1",
      text: "A verification photo that meets our requirements",
      status: "verified",
    },
    {
      id: "2",
      text: "Valid age-verification ID",
      status: "verified",
    },
    {
      id: "3",
      text: "At least 3 approved photos",
      status: "not-verified",
    },
    {
      id: "4",
      text: "All required profile fields filled out as per our policies.",
      status: "not-verified",
    },
  ];

  return (
    <div className=" flex items-center justify-center mx-auto ">
      <div className="mb-8 md:pt-10">
        <h1 className="text-2xl  font-semibold text-primary-text mb-[33px] text-center">
          Welcome to Rosey
        </h1>
        <p className="text-base text-text-gray-opacity mb-6 max-w-3xl">
          Before we publish your profile, our team needs to verify a few things.
          Use these links to get started:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-10">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-input-bg flex items-center justify-center shrink-0">
                <span className="text-primary-text text-sm font-medium">
                  {index + 1}.
                </span>
              </div>
              <Link
                href="#"
                className="text-primary hover:text-primary/80 text-sm md:text-base font-medium transition-colors underline"
              >
                {link}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm md:text-base text-text-gray-opacity mb-6 max-w-3xl">
          Once you've completed the tasks below, you can submit your profile for
          review and publication. Please ensure you have:
        </p>

        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-input-bg flex items-center justify-center shrink-0">
                  <span className="text-primary-text text-sm font-medium">
                    {item.id}.
                  </span>
                </div>
                <p className="text-primary-text text-sm md:text-base">
                  {item.text}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {item.status === "verified" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-400 text-sm md:text-base font-medium">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-primary" />
                    <span className="text-primary text-sm md:text-base font-medium">
                      Not Verified
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
