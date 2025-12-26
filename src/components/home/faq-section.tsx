"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { X, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const faqItems = [
  {
    id: "item-1",
    question: "What services do the companions offer?",
    answer:
      "Our companions offer a variety of services, from social outings to private, intimate appointments. Each provider sets their own boundaries, so please discuss your expectations politely when inquiring. Any form of coercion or pressure will end the appointment immediately.",
  },
  {
    id: "item-2",
    question: "What services do the companions offer?",
    answer:
      "Our companions offer a variety of services, from social outings to private, intimate appointments. Each provider sets their own boundaries, so please discuss your expectations politely when inquiring. Any form of coercion or pressure will end the appointment immediately.",
  },
  {
    id: "item-3",
    question: "What services do the companions offer?",
    answer:
      "Our companions offer a variety of services, from social outings to private, intimate appointments. Each provider sets their own boundaries, so please discuss your expectations politely when inquiring. Any form of coercion or pressure will end the appointment immediately.",
  },
  {
    id: "item-4",
    question: "What services do the companions offer?",
    answer:
      "Our companions offer a variety of services, from social outings to private, intimate appointments. Each provider sets their own boundaries, so please discuss your expectations politely when inquiring. Any form of coercion or pressure will end the appointment immediately.",
  },
  {
    id: "item-5",
    question: "What services do the companions offer?",
    answer:
      "Our companions offer a variety of services, from social outings to private, intimate appointments. Each provider sets their own boundaries, so please discuss your expectations politely when inquiring. Any form of coercion or pressure will end the appointment immediately.",
  },
];

export function FAQSection() {
  return (
    <section className="flex flex-col gap-10 md:gap-20 bg-input-bg  items-center  md:py-20 px-4 md:px-[60px] py-10">
      <div className="flex flex-col gap-3 md:gap-6 items-center text-center">
        <h2 className="text-[24px] md:text-2xl lg:text-4xl font-semibold text-primary-text">
          Have Questions?
        </h2>
        <p className="text-xs md:text-sm font-normal text-text-gray">
          Simple essentials to make the booking process smoother
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-full space-y-4"
        >
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-[24px] overflow-hidden bg-primary-bg py-4 data-[state=open]:bg-[#552833] data-[state=open]:border data-[state=open]:border-[#F63D68] group"
            >
              <AccordionTrigger className="text-primary-text hover:no-underline">
                <span className="text-base md:text-lg font-medium">
                  {item.question}
                </span>
                <div className="ml-auto shrink-0 flex items-center">
                  <Plus className="h-5 w-5 text-white transition-transform duration-200 group-data-[state=open]:hidden" />
                  <X className="h-5 w-5 text-white transition-transform duration-200 hidden group-data-[state=open]:block" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-text-gray-opacity text-sm md:text-base px-6 pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="w-full max-w-4xl rounded-3xl bg-primary py-8 md:py-[100px] flex flex-col gap-4 items-center text-center px-4">
        <h3 className="text-2xl md:text-4xl lg:text-4xl font-semibold text-primary-text">
          Subscribe to our newsletter
        </h3>
        <p className="text-base md:text-lg text-primary-text/90 max-w-2xl">
          Stay Connected With Exclusive Updates, New Companions, and Curated
          Experiences Delivered Privately to Your Inbox
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[590px] pt-9 px-4">
          <Input
            type="email"
            placeholder="JohnDoe@gmail.com"
            className="flex-1 bg-[#c33d5c] text-white placeholder:text-[#FFFFFF] focus:ring-0 focus:ring-transparent px-4 sm:px-4"
          />
          <Button
            variant="default"
            className="bg-primary-bg text-primary-text hover:bg-primary-bg/90 w-full sm:w-[140px] sm:shrink-0"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
