"use client";

import { MapPin, Star, Clock, Heart, Share2, Venus } from "lucide-react";
import Image from "next/image";
import { Circle } from "lucide-react";

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
  return (
    <div className="mb-6 mt-[30px] bg-primary-bg">
      <div className="relative rounded-3xl overflow-hidden ">
        <div className="relative h-[400px] overflow-hidden">
          <Image
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
        <div className="relative w-24 h-24 md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-4 border-transparent mb-10 mt-[-150px]">
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 300px"
          />
        </div>
        <article className=" flex gap-2 items-center justify-center mb-4">
          <h1 className="text-2xl md:text-4xl font-semibold text-primary-text ">
            {profile.name}
          </h1>
          <div className="flex items-center gap-1 py-2 px-3 bg-input-bg rounded-full">
            <Circle className="h-2 w-2 fill-current text-emerald-400" />
            <span className=" text-primary-text font-normal text-base">
              {profile.status}
            </span>
          </div>
        </article>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-gray-opacity mb-10">
          {/* <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-current text-emerald-400" />
            <span>{profile.status}</span>
          </div> */}
          <div className="flex items-center gap-1 text-primary-text font-normal text-base">
            <MapPin className="h-4 w-4" />
            <span className=" text-primary-text font-normal text-base">
              {profile.location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Venus className="h-4 w-4  text-primary-text" />
            <span className="text-primary-text font-normal text-base">
              {profile.gender}
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary-text">
            <Clock className="h-4 w-4" />
            <span className=" text-primary-text font-normal text-base">
              Last active {profile.lastActive}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-6 mb-4 justify-between">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`text-base font-medium transition-colors relative pb-2 ${
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
        <div className="flex items-center gap-2 ml-2">
          <button className="p-2 rounded-full bg-primary-bg text-text-gray-opacity hover:bg-input-bg transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-full bg-primary-bg text-text-gray-opacity hover:bg-input-bg transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
