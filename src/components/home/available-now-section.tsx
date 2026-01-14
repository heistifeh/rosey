"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { BaseCardSkeleton } from "@/components/skeletons/base-card-skeleton";
import { AvailableNowItem } from "@/types/types";

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
  setFilters: React.Dispatch<
    React.SetStateAction<{
      gender: string;
      priceRange?: string;
      location?: {
        city: string;
        country: string;
        city_slug: string;
        country_slug: string;
      };
    }>
  >;
}

type NormalizedAvailableNowItem = {
  adId: string;
  profileId: string;
  username: string | null;
  workingName: string;
  baseCurrency: string | null;
  baseHourlyRate: number | null;
  locationLabel: string;
  imageUrl: string;
};

export function AvailableNowSection(_props: AvailableNowSectionProps) {
  const { data: ads, isLoading } = useQuery<AvailableNowItem[]>({
    queryKey: ["available-now"],
    queryFn: async () => (await apiBuilder.ads.getAvailableNow()) ?? [],
  });

  const normalized = (ads ?? [])
    .map((ad): NormalizedAvailableNowItem | null => {
      const profile = ad.profile;
      if (!profile?.id) {
        return null;
      }

      const images = profile.images ?? [];
      const primary = images.find((img) => img.is_primary) ?? images[0];
      const imageUrl = primary?.public_url || "/images/girl1.png";
      const locationLabel = [profile.city, profile.country]
        .filter(Boolean)
        .join(", ");

      return {
        adId: ad.id,
        profileId: profile.id,
        username: profile.username,
        workingName: profile.working_name ?? "Provider",
        baseCurrency: profile.base_currency,
        baseHourlyRate: profile.base_hourly_rate,
        locationLabel,
        imageUrl,
      };
    })
    .filter(
      (item): item is NormalizedAvailableNowItem => item !== null
    );

  return (
    <section className="relative z-10 w-full bg-input-bg  pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full px-0 md:px-[60px] flex-col gap-4 md:gap-10">
        {/* Header row */}

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
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <BaseCardSkeleton key={i} />
              ))
            : normalized.map((item, index) => (
                <Link
                  key={item.adId}
                  href={`/profile/${item.username || item.profileId}`}
                  className={`flex h-full flex-col overflow-hidden p-3 md:p-4 rounded-[24px] border bg-primary-bg shadow-sm border-[#26262a] min-w-[280px] sm:min-w-0 cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  <div className="relative h-[200px] w-full overflow-hidden rounded-[16px]">
                    <Image
                      src={item.imageUrl}
                      alt={item.workingName}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority={index < 4}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 md:gap-[22px] pt-3 md:pt-[22px]">
                    <div className="flex  justify-between gap-2 items-center">
                      <p className="text-base md:text-lg lg:text-[24px] font-normal text-primary-text">
                        {item.workingName}
                      </p>
                      <p className="text-xl md:text-2xl lg:text-[36px] font-semibold text-primary-text">
                        {item.baseCurrency}
                        {item.baseHourlyRate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        <span className="text-xs md:text-sm lg:text-[16px] font-normal text-text-gray-opacity">
                          {item.locationLabel}
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
              ))}
          {!isLoading && normalized.length === 0 && (
            <div className="col-span-full py-10 text-center text-text-gray-opacity">
              No providers are currently marked as Available Now.
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
