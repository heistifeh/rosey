"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const points = [
  {
    id: 1,
    title: "Identity Screening",
    description:
      "Many workers will require their clients to submit themselves to some level of screening. This process will vary from sex work to sex work and will often involve some form of identification.",
    icon: "/images/screen.png",
  },
  {
    id: 2,
    title: "Payment",
    description:
      "While many workers prefer cash payments, others may opt for different methods of receiving payments or deposits, including cryptocurrency.",
    icon: "/images/money.png",
    highlighted: true,
  },
  {
    id: 3,
    title: "Timing & Availability.",
    description:
      "Sex workers, are not available around the clock and may not be free at the exact moment you want their services. Please respect their posted availability and allow a reasonable amount of time for them to respond.",
    icon: "/images/clock.png",
  },
];

export function BookingGuideSection() {
  return (
    <section className="flex flex-col gap-6 md:gap-10 bg-input-bg items-center pt-4 md:pt-10 px-4 md:px-[60px] pb-10">
      <div className="flex flex-col gap-3 md:gap-6 items-center text-center">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-text">
          Three key points before booking
        </p>
        <p className="text-xs md:text-sm font-normal text-text-gray">
          Simple essentials to make the booking process smoother
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {points.map((items, idx) => (
          <section
            key={idx}
            className="flex flex-col bg-primary-bg md:rounded-3xl rounded-[16px]pt-3 md:pt-4 pt-3 rounded-2xl"
          >
            <div className="flex flex-col gap-3 md:gap-4 px-2 py-2 md:px-4 md:py-4 md:rounded-2xl rounded-lg bg-input-bg mx-2 md:mx-4 min-h-[180px] md:h-[215px]">
              <p className="text-lg md:text-xl lg:text-2xl font-semibold text-primary-text">
                {items.title}
              </p>
              <p className="text-sm md:text-base font-normal text-text-gray-opacity">
                {items.description}
              </p>
            </div>
            <figure className="flex justify-end">
              <Image
                width={293}
                height={293}
                src={items.icon}
                alt="screen"
                className="w-32 h-32 md:w-48 md:h-48 lg:w-[293px] lg:h-[293px] object-contain"
              />
            </figure>
          </section>
        ))}
      </div>

      <Button
        variant="default"
        size="sm"
        className="w-full md:w-auto text-xs md:text-sm px-4 md:px-6 py-2 md:py-3"
      >
        View our Client Guide
        <ArrowRight className="h-4 w-4 md:h-6 md:w-6 cursor-pointer" />
      </Button>
    </section>
  );
}
