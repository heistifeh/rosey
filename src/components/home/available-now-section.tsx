"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  MoveRight,
  Circle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";

const tabs = ["Female", "Male", "Trans", "Non-Binary"];

interface AvailableNowSectionProps {
  filters: {
    gender: string;
    priceRange?: string;
    location?: {
      city: string;
      country: string;
      city_slug: string;
      country_slug: string;
    };
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    gender: string;
    priceRange?: string;
    location?: {
      city: string;
      country: string;
      city_slug: string;
      country_slug: string;
    };
  }>>;
}

export function AvailableNowSection({ filters, setFilters }: AvailableNowSectionProps) {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles", filters],
    queryFn: () => apiBuilder.profiles.getProfiles({
      gender: filters.gender,
      priceRange: filters.priceRange,
      citySlug: filters.location?.city_slug,
      countrySlug: filters.location?.country_slug
    }),
  });

  return (
    <section className="relative z-10 w-full bg-input-bg  pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        {/* Header row */}

        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-10 scrollbar-hide md:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilters((prev) => ({ ...prev, gender: tab }))}
              className={`flex-1 min-w-[80px] md:flex-none md:min-w-0 px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-sm font-medium rounded-full transition whitespace-nowrap cursor-pointer ${filters.gender === tab
                  ? "bg-primary text-primary-text"
                  : "bg-primary-bg text-primary-text hover:bg-[#2a2a2d]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className=" flex justify-between items-center px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-text lg:text-[36px]">
            Available Now
          </h2>

          <button className="ml-auto inline-flex items-center gap-1 md:gap-2 rounded-full bg-primary px-3 py-1.5 md:px-[42px] md:py-[13px] text-xs font-semibold text-primary-text cursor-pointer">
            See All
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0 scrollbar-hide px-[15px]">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-full flex-col overflow-hidden p-2.5 md:p-3 rounded-[20px] border bg-primary-bg shadow-sm border-[#26262a] min-w-[220px] sm:min-w-0 animate-pulse"
              >
                <div className="relative h-[200px] w-full overflow-hidden rounded-[16px] bg-[#2a2a2d]" />
                <div className="flex flex-1 flex-col justify-between gap-3 md:gap-[22px] pt-3 md:pt-[22px]">
                  <div className="h-6 w-3/4 bg-[#2a2a2d] rounded" />
                  <div className="h-4 w-1/2 bg-[#2a2a2d] rounded" />
                </div>
              </div>
            ))
          ) : (
            profiles?.map((profile: any, index: number) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.id}`}
                className="flex h-full flex-col overflow-hidden p-2.5 md:p-3 rounded-[20px] border bg-primary-bg shadow-sm border-[#26262a] min-w-[220px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="relative h-[200px] w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={profile.images?.[0]?.public_url || "/images/girl1.png"}
                    alt={profile.working_name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={index < 4}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 md:gap-[22px] pt-3 md:pt-[22px]">
                  <div className="flex  justify-between gap-2 items-center">
                    <p className="text-base md:text-lg lg:text-[24px] font-normal text-primary-text">
                      {profile.working_name}
                    </p>
                    <p className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                      {profile.base_currency}{profile.base_hourly_rate}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      <span className="text-xs md:text-sm lg:text-[16px] font-normal text-text-gray-opacity">
                        {profile.city}, {profile.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 bg-input-bg rounded-[200px] px-2 py-1 md:px-3 md:py-2">
                      <Circle
                        className={`h-1.5 w-1.5 md:h-2 md:w-2 fill-current text-emerald-400`}
                      />
                      <span className="text-xs md:text-sm lg:text-[16px] font-normal text-primary-text">
                        Available Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )))}
          {!isLoading && (!profiles || profiles.length === 0) && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No profiles found for {filters.gender}.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { FaXTwitter } from "react-icons/fa6";

// const testimonials = [
//   {
//     id: 1,
//     text: "I just have to say how much more I appreciate Rosey compared to other platforms. Everything feels so much more organized and intuitive, which makes navigating the site an absolute breeze. The clientele has been noticeably better, more respectful, and more genuine, which really elevates the whole experience. I also love how streamlined the entire process is—from setting up a profile to connecting with clients, everything is smooth and stress-free. And on top of all that, it's more affordable than similar sites, which makes it even easier to rely on long-term. Truly, I'm loving the platform more and more every day. ❤️❤️",
//     platform: "Via Twitter",
//     author: "@JaneDoe",
//   },
//   {
//     id: 2,
//     text: "Amazing platform! The verification process gives me peace of mind and the booking system is incredibly smooth. I've had nothing but positive experiences.",
//     platform: "Via Twitter",
//     author: "@Companion2024",
//   },
//   {
//     id: 3,
//     text: "Best escort platform I've used. Professional, secure, and the support team is always responsive. Highly recommend!",
//     platform: "Via Twitter",
//     author: "@EliteCompanion",
//   },
// ];

// export function TestimonialsSection() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goToNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//   };

//   const goToPrevious = () => {
//     setCurrentIndex(
//       (prev) => (prev - 1 + testimonials.length) % testimonials.length
//     );
//   };

//   const goToSlide = (index: number) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <section className="relative z-10 w-full bg-[#0a0a0b] px-4 py-16 md:py-24">
//       <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 md:gap-12">
//         {/* Header */}
//         <div className="flex flex-col items-center gap-4 text-center">
//           <h2 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
//             Testimonials From Satisfied Companions
//           </h2>
//           <p className="max-w-3xl text-sm text-gray-400 md:text-base">
//             We truly value the voices of those who use and appreciate Rosey. Here's a look at some of the experiences and kind words
//             people have shared about our platform.
//           </p>
//         </div>

//         {/* Testimonial Card */}
//         <div className="relative w-full max-w-3xl">
//           <div className="rounded-2xl bg-[#1a1a1c] p-8 md:p-12 shadow-xl border border-[#2a2a2d]">
//             <p className="text-base leading-relaxed text-gray-300 md:text-lg">
//               {testimonials[currentIndex].text}
//             </p>

//             <div className="mt-6 flex items-center gap-3">
//               <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
//                 {/* <FaXTwitter className="h-4 w-4" /> */}
//                 {testimonials[currentIndex].platform}
//               </button>
//               <span className="text-sm text-gray-500">
//                 {testimonials[currentIndex].author}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Controls */}
//         <div className="flex items-center gap-6">
//           {/* Previous Button */}
//           <button
//             onClick={goToPrevious}
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-transparent text-gray-400 transition hover:bg-gray-800 hover:text-white"
//             aria-label="Previous testimonial"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </button>

//           {/* Dots */}
//           <div className="flex items-center gap-2">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`h-2 w-2 rounded-full transition-all ${
//                   index === currentIndex
//                     ? "w-8 bg-primary"
//                     : "bg-gray-600 hover:bg-gray-500"
//                 }`}
//                 aria-label={`Go to testimonial ${index + 1}`}
//               />
//             ))}
//           </div>

//           {/* Next Button */}
//           <button
//             onClick={goToNext}
//             className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-transparent text-gray-400 transition hover:bg-gray-800 hover:text-white"
//             aria-label="Next testimonial"
//           >
//             <ChevronRight className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
