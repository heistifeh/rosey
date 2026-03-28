"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  buildEthnicityLocationSeoContent,
  type EthnicityLocationSeoInput,
} from "@/lib/ethnicity-location-seo-content";

type Props = EthnicityLocationSeoInput;

export function EthnicityLocationSeoContent(props: Props) {
  const { label, cityName, stateName, countryName } = props;
  const content = buildEthnicityLocationSeoContent(props);
  const ll = label.toLowerCase();

  const locationLine =
    content.granularity === "city"
      ? [cityName, stateName, countryName].filter(Boolean).join(", ")
      : content.granularity === "state"
        ? [stateName, countryName].filter(Boolean).join(", ")
        : countryName;

  const heading =
    content.granularity === "city"
      ? `${label} Escorts in ${locationLine} – Verified Independent Listings`
      : content.granularity === "state"
        ? `${label} Escorts in ${locationLine} – Browse by City`
        : `${label} Escorts in ${locationLine} – Nationwide Directory`;

  // Two sections open by default — always "how-it-works" + one more
  const defaultOpen =
    content.granularity === "country"
      ? ["geographic-coverage", "why-independent"]
      : ["how-it-works", "why-independent"];

  return (
    <section
      className="rounded-[24px] border border-dark-border bg-primary-bg/70 p-4 md:p-6"
      aria-labelledby="ethnicity-location-seo-heading"
    >
      {/* Heading */}
      <h2
        id="ethnicity-location-seo-heading"
        className="text-xl font-semibold text-primary-text md:text-2xl"
      >
        {heading}
      </h2>

      {/* Intro — always visible */}
      <div className="mt-3 space-y-2 text-sm leading-7 text-text-gray-opacity md:text-base">
        {content.introParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Accordion sections */}
      <Accordion
        type="multiple"
        defaultValue={defaultOpen}
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
              {section.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.steps && section.steps.length > 0 && (
                <ol className="space-y-2">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* FAQ */}
        <AccordionItem
          value="faq"
          className="overflow-hidden rounded-[18px] border border-dark-border bg-input-bg/70"
        >
          <AccordionTrigger className="text-sm font-semibold text-primary-text md:text-base">
            Frequently Asked Questions
          </AccordionTrigger>
          <AccordionContent className="space-y-5 text-sm leading-7 text-text-gray-opacity md:text-base">
            {content.faq.map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-primary-text">{item.question}</p>
                <p className="mt-1">{item.answer}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* CTA links */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={content.searchHref}
          className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 md:text-sm"
        >
          Search {ll} escorts in {locationLine}
        </Link>
        <Link
          href={content.browseAllEthnicityHref}
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          All {label} escorts worldwide
        </Link>
        <Link
          href="/locations"
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Explore all locations
        </Link>
      </div>
    </section>
  );
}
