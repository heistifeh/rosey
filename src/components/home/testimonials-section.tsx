// "use client";

// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { FaXTwitter } from "react-icons/fa6";

// const testimonials = [
//   {
//     id: 1,
//     text: "I just have to say how much more I appreciate Discover Escort compared to other platforms. Everything feels so much more organized and intuitive, which makes navigating the site an absolute breeze. The clientele has been noticeably better, more respectful, and more genuine, which really elevates the whole experience. I also love how streamlined the entire process is—from setting up a profile to connecting with clients, everything is smooth and stress-free. And on top of all that, it's more affordable than similar sites, which makes it even easier to rely on long-term. Truly, I'm loving the platform more and more every day. ❤️❤️",
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
//     <section className="relative z-10 w-full bg-input-bg px-4 py-16 md:py-24">
//       <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:gap-10">
//         {/* Header */}
//         <div className="flex flex-col items-center gap-4 text-center">
//           <h2 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
//             Testimonials From Satisfied Companions
//           </h2>
//           <p className="max-w-3xl text-sm text-gray-400 md:text-base leading-relaxed pb-4">
//             We truly value the voices of those who use and appreciate Discover
//             Escort. Here's a look at some of the experiences and kind words
//             people have shared about our platform.
//           </p>
//         </div>

//         {/* Testimonial Card - Stacked cards effect */}
//         <div className="relative w-full flex justify-center px-4 md:px-8">
//           {/* Shadow/Glow layer behind */}
//           <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
//             <div className="max-w-[800px] w-full h-[280px] bg-linear-to-b from-gray-700/10 to-transparent rounded-[32px] blur-3xl"></div>
//           </div>

//           {/* Stacked cards behind - creating the deck effect */}
//           <div className="hidden md:flex absolute inset-0 justify-center items-center">
//             {/* Card 8 - furthest back */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform:
//                   "translateY(-14px) translateX(-16px) rotate(-4.5deg)",
//                 zIndex: 1,
//               }}
//             ></div>

//             {/* Card 7 */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform: "translateY(-12px) translateX(-14px) rotate(-4deg)",
//                 zIndex: 2,
//               }}
//             ></div>

//             {/* Card 6 */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform:
//                   "translateY(-10px) translateX(-12px) rotate(-3.5deg)",
//                 zIndex: 3,
//               }}
//             ></div>

//             {/* Card 5 */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform: "translateY(-8px) translateX(-10px) rotate(-3deg)",
//                 zIndex: 4,
//               }}
//             ></div>

//             {/* Card 4 */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform: "translateY(-6px) translateX(-8px) rotate(-2deg)",
//                 zIndex: 5,
//               }}
//             ></div>

//             {/* Card 3 */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform: "translateY(-4px) translateX(-6px) rotate(-1.5deg)",
//                 zIndex: 6,
//               }}
//             ></div>

//             {/* Card 2 - middle */}
//             <div
//               className="absolute max-w-[800px] w-full h-[268px] rounded-[32px] bg-[#1e1e1e] shadow-sm"
//               style={{
//                 transform: "translateY(-2px) translateX(-4px) rotate(-1deg)",
//                 zIndex: 7,
//               }}
//             ></div>
//           </div>

//           {/* Main visible card - front (top) */}
//           <div
//             className="relative max-w-[800px] w-full h-[268px] rounded-[24px] bg-primary-bg p-4 md:p-6 lg:p-6 shadow-2xl flex flex-col justify-between"
//             style={{ zIndex: 8 }}
//           >
//             <p className="relative z-10 text-[15px] md:text-[16px] leading-[1.7] text-gray-300 flex-1 overflow-y-auto">
//               {testimonials[currentIndex].text}
//             </p>

//             <div className="relative z-10 mt-6 flex items-center gap-3">
//               <button className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#ff2d76] to-[#ff4d8f] px-5 py-2 text-sm font-medium text-white shadow-lg">
//                 {/* <FaXTwitter className="h-4 w-4" /> */}
//                 Via Twitter
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Controls */}
//         <div className="flex items-center gap-4">
//           {/* Previous Button */}
//           <button
//             onClick={goToPrevious}
//             className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-600/50 bg-transparent text-gray-400 transition hover:border-gray-500 hover:bg-gray-800/50 hover:text-white"
//             aria-label="Previous testimonial"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>

//           {/* Dots */}
//           <div className="flex items-center gap-2.5">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`h-2 rounded-full transition-all ${
//                   index === currentIndex
//                     ? "w-8 bg-primary"
//                     : "w-2 bg-gray-500 hover:bg-gray-400"
//                 }`}
//                 aria-label={`Go to testimonial ${index + 1}`}
//               />
//             ))}
//           </div>

//           {/* Next Button */}
//           <button
//             onClick={goToNext}
//             className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-600/50 bg-transparent text-gray-400 transition hover:border-gray-500 hover:bg-gray-800/50 hover:text-white"
//             aria-label="Next testimonial"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "I just have to say how much more I appreciate Discover Escort compared to other platforms. Everything feels so much more organized and intuitive, which makes navigating the site an absolute breeze. The clientele has been noticeably better, more respectful, and more genuine, which really elevates the whole experience. I also love how streamlined the entire process is—from setting up a profile to connecting with clients, everything is smooth and stress-free. And on top of all that, it's more affordable than similar sites, which makes it even easier to rely on long-term. Truly, I'm loving the platform more and more every day.❤️❤️",
    source: " Via Twitter",
  },
  {
    id: 2,
    text: "Discover Escort has completely transformed how I connect with clients. The platform is user-friendly, secure, and the support team is always responsive. I've seen a significant increase in quality bookings since joining.",
    source: " Via Twitter",
  },
  {
    id: 3,
    text: "As someone who's been in this industry for years, I can confidently say Discover Escort is the best platform I've used. The features are intuitive, the community is respectful, and the overall experience is unmatched.",
    source: "Via Twitter",
  },
  {
    id: 4,
    text: "The verification process on Discover Escort gives me peace of mind. I know I'm connecting with genuine clients, and the platform's design makes everything so easy to manage.",
    source: " Via Twitter",
  },
  {
    id: 5,
    text: "I love how Discover Escort prioritizes safety and professionalism. The platform feels secure, and I've had nothing but positive experiences with the clients I've met through it.",
    source: " Via Twitter",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative z-10 w-full bg-input-bg px-4 pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="flex flex-col items-center gap-2 md:gap-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold text-primary-text">
            Testimonials From Satisfied Companions
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-primary-text/80">
            We truly value the voices of those who use and appreciate Discover
            Escort. Here's a look at some of the experiences and kind words
            people have shared about our platform.
          </p>
        </div>

        <div className="relative w-full mt-4 md:mt-10  ">
          <div className="relative overflow-visible">
            <div className="relative flex items-center justify-center ">
              <div
                className="relative w-full max-w-[800px] h-[268px] rounded-[24px] bg-primary-bg p-4 md:p-6 lg:p-6 shadow-lg flex flex-col"
                style={{ zIndex: 8 }}
              >
                <p className="text-sm md:text-base text-text-gray-opacity leading-relaxed flex-1 overflow-y-auto mb-4 scrollbar-hide ">
                  {testimonials[currentIndex].text}
                </p>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary/90 transition shrink-0 w-fit">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {testimonials[currentIndex].source}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
            <button
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400/50 bg-[#1a1a1a] text-primary-text hover:bg-[#2a2a2d] transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a]">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-[#2a2a2d] hover:bg-[#3a3a3a]"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400/50 bg-[#1a1a1a] text-primary-text hover:bg-[#2a2a2d] transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
