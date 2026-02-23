import type { Metadata } from "next";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, SITE_URL, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ | Rosey",
  description:
    "Frequently asked questions for clients and independent providers using Rosey.link, including safety, payments, profile setup, and support.",
  path: "/faq",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "rosey faq",
    "escort directory faq",
    "provider help",
  ],
});

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
  {
    title: "For Everyone (Clients & Providers)",
    items: [
      {
        question: "What is Rosey.link?",
        answer:
          "Rosey.link is a modern, provider-first escort directory connecting respectful clients with independent adult companions. We emphasize real profiles, fresh photos, clear boundaries, and mutual respect - no agencies, no spam, and no low-effort listings.",
      },
      {
        question: "Is Rosey.link legal?",
        answer:
          "Rosey.link operates as an advertising platform for legal adult companionship services where permitted by local laws. We do not provide, arrange, or participate in any illegal activities. All users must comply with applicable laws in their jurisdiction. We encourage safe, consensual, and legal interactions only.",
      },
      {
        question:
          "How is Rosey.link different from Eros, Tryst, or SkipTheGames?",
        answer:
          "We focus on independent providers with detailed, up-to-date profiles and real-time availability. Clients report better quality interactions (fewer flakes, more respect), and providers appreciate screened, normal clientele. The interface is cleaner with less agency-heavy noise and stronger quality focus.",
      },
      {
        question: "Who can use Rosey.link?",
        answer:
          "Adults 18+ only. Providers must be independent companions offering legal companionship services. Clients must seek consensual adult arrangements. We do not allow minors, illegal services, or any form of exploitation.",
      },
      {
        question: "How do you handle privacy and discretion?",
        answer:
          "Privacy is core to our platform. We use secure connections (HTTPS), do not require real names for browsing, and encourage screening (references and light verification) on both sides. Providers control what info they share. We do not sell user data.",
      },
    ],
  },
  {
    title: "For Clients",
    items: [
      {
        question: "How do I find and book a provider?",
        answer:
          "Browse by city, filters (availability, ethnicity, services, rates, and more), or use Available Now. Read full profiles carefully (rates, menu, boundaries, recent photos). Contact via the provider's preferred method listed in their profile. Always respect their rules and screening process.",
      },
      {
        question: "Do I need an account to browse or contact providers?",
        answer:
          "Browsing is free and no account is required. Creating a free account unlocks extras like saving favorites, real-time notifications, and improved messaging.",
      },
      {
        question: "What if a provider does not respond?",
        answer:
          "Providers set their own availability and may be busy or offline. Be patient, polite, and follow their contact instructions. Avoid spamming or lowballing, which is often ignored or blocked.",
      },
      {
        question: "How do payments work?",
        answer:
          "Payments are handled directly between you and the provider (cash, crypto, deposit, and similar options). Rosey.link does not process payments or take a cut. Always agree on terms upfront and follow provider policy.",
      },
      {
        question: "Is there a review system on Rosey.link?",
        answer:
          "Yes. You can write reviews for providers, and reviews are moderated for quality and policy compliance.",
      },
      {
        question: "What should I do to have a great experience?",
        answer:
          "Be on time, hygienic, respectful, and upfront about expectations. Read the full profile and respect boundaries. Screening helps everyone stay safe.",
      },
    ],
  },
  {
    title: "For Providers (Independent Escorts)",
    items: [
      {
        question: "How do I create a profile?",
        answer:
          "Sign up free, verify your account (photo ID plus selfie for approval, usually within 24 hours), then build your profile with recent photos, rates, services, boundaries, availability, and contact info.",
      },
      {
        question: "Is there a fee to list on Rosey.link?",
        answer:
          "Basic listings are free. Premium and featured visibility options are available for a monthly fee.",
      },
      {
        question: "How long until my profile goes live?",
        answer:
          "Most approvals take 24-48 hours. Listings are reviewed for quality, real photos, and compliance.",
      },
      {
        question: "Can I set my own rules and rates?",
        answer:
          "Yes, 100%. You control your services, boundaries, rates, deposits, and screening requirements.",
      },
      {
        question: "How do you prevent fakes or scams?",
        answer:
          "We require verification, encourage references/screening, and monitor reports. Providers can block/report bad actors, and we actively remove time-wasters and suspicious profiles.",
      },
      {
        question: "Can I promote my availability in real-time?",
        answer:
          "Yes. Use Available Now and your calendar settings to show when you're free for faster bookings.",
      },
      {
        question: "What if I have issues with a client?",
        answer:
          "Report issues via the platform support process. Safety reports are reviewed and actioned quickly when needed.",
      },
    ],
  },
  {
    title: "Safety & General",
    items: [
      {
        question: "How do you keep the site safe?",
        answer:
          "We promote screening (references and deposits where needed), real photos, and clear communication. Both sides should verify each other and avoid sharing sensitive information until trust is established.",
      },
      {
        question: "What if I encounter a scam or fake profile?",
        answer:
          "Report it immediately through the profile tools or support. We investigate and remove violators quickly.",
      },
      {
        question: "I still have a question not answered here.",
        answer:
          "Contact support through the site support form or email support@rosey.link.",
      },
    ],
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ),
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    url: `${SITE_URL}/faq`,
  };

  return (
    <>
      <InfoPageShell
        title="Rosey.link FAQ"
        subtitle="Frequently asked questions for clients and independent providers."
      >
        <p>
          This FAQ covers common questions about using Rosey.link, an
          independent escort directory focused on quality, discretion, and
          respectful connections.
        </p>
        <p>
          Launched in late 2025 and growing in cities like Los Angeles, Chicago,
          St. Louis, Minneapolis, Louisville, and beyond.
        </p>
        <p>
          Rosey.link is built for better experiences in the independent escort
          space: quality over quantity. Stay safe, respectful, and informed.
        </p>

        {faqGroups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
              {group.title}
            </h2>
            <div className="mt-4 space-y-4">
              {group.items.map((item) => (
                <article
                  key={`${group.title}-${item.question}`}
                  className="rounded-2xl border border-dark-border bg-input-bg/70 p-4"
                >
                  <h3 className="text-base font-semibold text-primary-text md:text-lg">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-text-gray md:text-base">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <p className="text-xs text-text-gray-opacity md:text-sm">
          Last updated: February 2026
        </p>
      </InfoPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
