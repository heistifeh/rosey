"use client";

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buildLocationListingSeoContent, type LocationListingSeoInput } from "@/lib/location-listing-seo-content";
import { cn } from "@/lib/utils";

type LocationListingSeoAccordionProps = {
  location: LocationListingSeoInput;
  className?: string;
};

export function LocationListingSeoAccordion({
  location,
  className,
}: LocationListingSeoAccordionProps) {
  const content = buildLocationListingSeoContent(location);

  if (!content) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-[24px] border border-dark-border bg-primary-bg/70 p-4 md:p-6",
        className,
      )}
      aria-labelledby="city-seo-guide-heading"
    >
      <div className="flex flex-col gap-3">
        <h2
          id="city-seo-guide-heading"
          className="text-xl font-semibold text-primary-text md:text-2xl"
        >
          {content.heading}
        </h2>
        <div className="space-y-2 text-sm leading-7 text-text-gray-opacity md:text-base">
          {content.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["why-city", "how-to-book"]}
        className="mt-5 space-y-3"
      >
        {content.sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="overflow-hidden rounded-[18px] border border-dark-border bg-input-bg/70"
          >
            <AccordionTrigger className="text-sm font-semibold text-primary-text md:text-base">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm leading-7 text-text-gray-opacity md:text-base">
              {section.paragraphs?.map((paragraph) => (
                <p key={`${section.id}-${paragraph}`}>{paragraph}</p>
              ))}

              {section.bullets && section.bullets.length > 0 ? (
                <ul className="space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={`${section.id}-${bullet}`} className="flex gap-2">
                      <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.steps && section.steps.length > 0 ? (
                <ol className="space-y-2">
                  {section.steps.map((step, index) => (
                    <li key={`${section.id}-${step}`} className="flex gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={content.currentListingsHref}
          className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 md:text-sm"
        >
          Browse {content.cityName} escorts
        </Link>
        <Link
          href={content.searchHref}
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Open filtered search
        </Link>
        <Link
          href={content.blogHref}
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Read booking guides
        </Link>
        <Link
          href={content.locationsHref}
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Explore all locations
        </Link>
      </div>
    </section>
  );
}
