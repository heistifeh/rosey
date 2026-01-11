"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Circle } from "lucide-react";

const tabs = ["Female", "Male", "Trans", "Non-Binary"];

const profiles = [
  {
    id: 10,
    name: "Natalie Fox",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl10.png",
  },
  {
    id: 11,
    name: "Cherie Starr",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl11.png",
  },
  {
    id: 12,
    name: "Luna Deville",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl12.png",
  },
  {
    id: 13,
    name: "Jessy Hollywood",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl13.png",
  },
  {
    id: 14,
    name: "Ella Taylor",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl14.png",
  },
  {
    id: 15,
    name: "Eva Damsel",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Unavailable",
    image: "/images/girl15.png",
  },
  {
    id: 16,
    name: "Mia Mars",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl16.png",
  },
  {
    id: 17,
    name: "Kathrina Dove",
    price: "$250",
    location: "Michigan, Detroit",
    status: "Available",
    image: "/images/girl17.png",
  },
  {
    id: 18,
    name: "Daisy Presley",
    price: "$150",
    location: "Michigan, Detroit",
    status: "Available Now",
    image: "/images/girl18.png",
  },
];

export function RecentlyActiveSection() {
  const [activeTab, setActiveTab] = useState("Female");

  return (
    <section className="relative z-10 w-full bg-primary-bg px-4 pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        <div className=" flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-text lg:text-[36px]">
            Recently Active
          </h2>

          <button className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text cursor-pointer">
            See All
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0 scrollbar-hide px-[15px]">
          {profiles.map((profile, index) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className={`flex h-full flex-col overflow-hidden p-3 md:p-4 rounded-[24px]  bg-input-bg shadow-sm min-w-[280px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-[16px]">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority={index < 4}
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3 md:gap-[20px] pt-3 md:pt-[22px]">
                <div className="flex  justify-between gap-2 items-center">
                  <p className="text-base md:text-lg lg:text-[24px] font-normal text-primary-text">
                    {profile.name}
                  </p>
                  <p className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                    {profile.price}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    <span className="text-xs md:text-sm lg:text-[16px] font-normal text-text-gray-opacity">
                      {profile.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 rounded-[200px] px-2 py-1 md:px-3 md:py-2">
                    <Circle
                      className={`h-1.5 w-1.5 md:h-2 md:w-2 fill-current ${
                        profile.status === "Unavailable"
                          ? "text-red-500"
                          : "text-emerald-400"
                      }`}
                    />
                    <span className="text-xs md:text-sm lg:text-[16px] font-normal text-primary-text">
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
