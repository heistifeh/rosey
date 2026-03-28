"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildEthnicitySeoContent } from "@/lib/ethnicity-seo-content";

type Props = {
  label: string;
  ethnicitySlug: string;
};

export function EthnicitySeoContent({ label, ethnicitySlug }: Props) {
  const content = buildEthnicitySeoContent(label, ethnicitySlug);

  return (
    <section
      className="rounded-[24px] border border-dark-border bg-primary-bg/70 p-4 md:p-6"
      aria-labelledby="ethnicity-seo-heading"
    >
      {/* Section heading */}
      <h2
        id="ethnicity-seo-heading"
        className="text-xl font-semibold text-primary-text md:text-2xl"
      >
        {label} Escorts Near You – Verified {label} Escort Directory
      </h2>

      {/* Intro paragraphs — always visible */}
      <div className="mt-3 space-y-2 text-sm leading-7 text-text-gray-opacity md:text-base">
        {content.introParagraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {/* Accordion sections */}
      <Accordion
        type="multiple"
        defaultValue={["browse-by-city", "why-independent"]}
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
              {section.paragraphs?.map((p) => (
                <p key={`${section.id}-p-${p.slice(0, 30)}`}>{p}</p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={`${section.id}-b-${bullet.slice(0, 30)}`}
                      className="flex gap-2"
                    >
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.steps && section.steps.length > 0 && (
                <ol className="space-y-2">
                  {section.steps.map((step, idx) => (
                    <li
                      key={`${section.id}-s-${step.slice(0, 30)}`}
                      className="flex gap-3"
                    >
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* FAQ section — separate accordion item */}
        <AccordionItem
          value="faq"
          className="overflow-hidden rounded-[18px] border border-dark-border bg-input-bg/70"
        >
          <AccordionTrigger className="text-sm font-semibold text-primary-text md:text-base">
            Frequently Asked Questions
          </AccordionTrigger>
          <AccordionContent className="space-y-5 text-sm leading-7 text-text-gray-opacity md:text-base">
            {content.faq.map((item) => (
              <div key={item.question}>
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
          Search {label} escorts
        </Link>
        <Link
          href={content.locationsHref}
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Explore all locations
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-dark-border bg-input-bg px-3 py-1.5 text-xs font-semibold text-primary-text transition-colors hover:border-primary/40 md:text-sm"
        >
          Read booking guides
        </Link>
      </div>
    </section>
  );
}
