"use client";

import {
  MapPin,
  Clock,
  Heart,
  Share2,
  Venus,
  MessageSquare,
} from "lucide-react";
import { Circle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ReviewModal } from "@/components/modals/review-modal";
import { SafeImage } from "@/components/ui/safe-image";

interface ProfileHeroSectionProps {
  profile: {
    name: string;
    image: string;
    status: string;
    location: string;
    gender: string;
    lastActive: string;
    price: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
}

export function ProfileHeroSection({
  profile,
  activeTab,
  onTabChange,
  tabs,
}: ProfileHeroSectionProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Added to favorites");
    } else {
      toast("Removed from favorites");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <div className="mb-6 mt-6 bg-primary-bg md:mt-[30px]">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative h-[220px] overflow-hidden sm:h-[280px] md:h-[400px]">
            <SafeImage
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover blur-sm opacity-50"
              sizes="100vw"
            />
          </div>
          {/* <div className="absolute top-4 right-6 text-right">
          <p className="text-xs text-text-gray-opacity mb-1">Rate:</p>
          <p className="text-2xl font-semibold text-primary-text">
            {profile.price}
          </p>
        </div> */}
        </div>

        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24 -mt-14 mb-6 rounded-full border-4 border-transparent overflow-hidden sm:h-28 sm:w-28 sm:-mt-16 md:h-[300px] md:w-[300px] md:mb-10 md:mt-[-150px]">
            <SafeImage
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 300px"
            />
          </div>
          <article className="flex flex-wrap items-center justify-center gap-2 mb-3 md:mb-4">
            <h1 className="text-2xl font-semibold text-primary-text md:text-4xl">
              {profile.name}
            </h1>
            <div className="flex items-center gap-1 rounded-full bg-input-bg px-3 py-1.5 text-sm md:py-2">
              <Circle className="h-2 w-2 fill-current text-emerald-400" />
              <span className="text-primary-text font-normal md:text-base">
                {profile.status}
              </span>
            </div>
          </article>
          <div className="mb-8 flex flex-col items-center justify-center gap-2 text-sm text-text-gray-opacity sm:flex-row sm:flex-wrap md:mb-10 md:gap-3">
            {/* <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-current text-emerald-400" />
            <span>{profile.status}</span>
          </div> */}
            <div className="flex items-center gap-1 text-primary-text font-normal text-sm md:text-base">
              <MapPin className="h-4 w-4" />
              <span className="text-primary-text font-normal">
                {profile.location}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Venus className="h-4 w-4  text-primary-text" />
              <span className="text-primary-text font-normal text-sm md:text-base">
                {profile.gender}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary-text">
              <Clock className="h-4 w-4" />
              <span className="text-primary-text font-normal text-sm md:text-base">
                Last active {profile.lastActive}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4 overflow-x-auto pb-2 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative shrink-0 pb-2 text-sm font-medium transition-colors md:text-base ${
                  activeTab === tab ? "text-primary" : "text-[#8E8E93]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 md:ml-2">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="p-2 rounded-full bg-primary-bg text-text-gray-opacity hover:bg-input-bg transition-colors"
              title="Write a review"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
            <button
              onClick={handleLike}
              className={`p-2 rounded-full bg-primary-bg hover:bg-input-bg transition-colors ${
                isLiked ? "text-red-500" : "text-text-gray-opacity"
              }`}
              title="Like profile"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-primary-bg text-text-gray-opacity hover:bg-input-bg transition-colors"
              title="Share profile"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        profileName={profile.name}
      />
    </>
  );
}
