import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";
import {
  Megaphone,
  Users,
  DollarSign,
  BarChart3,
  Eye,
  Target,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Advertise on Rosey | Reach Clients & Providers",
  description:
    "Promote your brand on Rosey.link. Reach thousands of clients and independent providers with banner ads, sponsored listings, and featured placements.",
  path: "/advertisement",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "escort directory advertising",
    "advertise escort site",
    "escort banner ads",
    "sponsored listings",
  ],
});

const businessFeatures = [
  {
    icon: Eye,
    title: "Banner Ads & Popups",
    description:
      "Display eye-catching banner ads across our directory pages. Your brand appears alongside high-traffic escort listings.",
  },
  {
    icon: DollarSign,
    title: "Budget Friendly",
    description:
      "No matter your budget, you can display ads on Rosey. Pay only for the visibility you need with flexible pricing tiers.",
  },
  {
    icon: Target,
    title: "Targeted Placement",
    description:
      "Your ad displays next to related content. Reach users browsing specific cities, categories, or search results.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track impressions, clicks, and engagement with a real-time analytics dashboard included with every ad campaign.",
  },
];

const providerFeatures = [
  {
    icon: Zap,
    title: "Sponsored Listings",
    description:
      "Boost your profile to the top of search results and city pages. Get seen first by clients in your area.",
  },
  {
    icon: DollarSign,
    title: "Flat Price",
    description:
      "You only pay a flat price per listing boost no matter how many views it gets. There are no hidden fees.",
  },
  {
    icon: Users,
    title: "Attract More Clients",
    description:
      "Featured profiles receive significantly more views and inquiries. Stand out from the crowd with premium placement.",
  },
  {
    icon: Shield,
    title: "Verified Badge Priority",
    description:
      "Sponsored listings with verified badges get even more visibility and trust from potential clients.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for individual providers",
    features: [
      "Profile boost in your city",
      "Highlighted listing badge",
      "Basic analytics",
      "7-day featured placement",
    ],
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For providers who want maximum visibility",
    features: [
      "Top of search results",
      "Featured on homepage",
      "Priority placement in 3 cities",
      "Full analytics dashboard",
      "Dedicated support",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "Custom",
    period: "",
    description: "For brands and businesses",
    features: [
      "Banner ads across the site",
      "Custom placement options",
      "Popup and interstitial ads",
      "Multi-city campaigns",
      "Dedicated account manager",
      "API access for ad management",
    ],
  },
];

export default function AdvertisementPage() {
  return (
    <section className="flex min-h-screen flex-col bg-input-bg">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-10 md:px-[60px] md:pb-24 md:pt-16">
        {/* Hero */}
        <div className="rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
              <Megaphone className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-primary-text md:text-4xl">
              Advertise on Rosey
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-gray-opacity md:text-base">
              Reach thousands of clients and independent providers every day.
              Whether you&apos;re a business owner or a provider looking for more
              visibility, we have advertising options for you.
            </p>
          </div>
        </div>

        {/* Two-column ad types */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Business Owners */}
          <div className="rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
            <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
              Business Owners
            </h2>
            <p className="mt-1 text-sm text-text-gray-opacity">
              Pay Per Click, Banners, Popups & Sponsored Content
            </p>

            <div className="mt-6 space-y-5">
              {businessFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-text md:text-base">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-text-gray-opacity md:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/create-account"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 md:text-base"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Escort Advertisers / Providers */}
          <div className="rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
            <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
              Provider Advertisers
            </h2>
            <p className="mt-1 text-sm text-text-gray-opacity">
              Sponsored Listings, Featured Profiles & Priority Placement
            </p>

            <div className="mt-6 space-y-5">
              {providerFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-text md:text-base">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-text-gray-opacity md:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/create-account"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 md:text-base"
            >
              Sign Up Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-6 rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
              Advertising Plans
            </h2>
            <p className="mt-2 text-sm text-text-gray-opacity md:text-base">
              Choose a plan that fits your goals and budget
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-5 md:p-6 ${
                  tier.popular
                    ? "border-primary bg-primary/5"
                    : "border-dark-border bg-input-bg"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-primary-text">
                  {tier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary-text md:text-3xl">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-text-gray-opacity">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-text-gray-opacity md:text-sm">
                  {tier.description}
                </p>

                <ul className="mt-5 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-gray"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={
                    tier.name === "Business"
                      ? "/help-support"
                      : "/create-account"
                  }
                  className={`mt-6 flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                    tier.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  {tier.name === "Business" ? "Contact Us" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-6 rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
          <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
            How It Works
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create an Account",
                description:
                  "Sign up for free and set up your advertiser profile in minutes.",
              },
              {
                step: "2",
                title: "Choose Your Plan",
                description:
                  "Select a plan that matches your budget and advertising goals.",
              },
              {
                step: "3",
                title: "Go Live",
                description:
                  "Your ad or sponsored listing goes live and starts reaching your audience immediately.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center rounded-2xl border border-dark-border bg-input-bg p-5 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-primary-text md:text-base">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-text-gray-opacity md:text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-3xl border border-primary/40 bg-primary/10 p-5 text-center md:p-8">
          <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
            Ready to grow your visibility?
          </h2>
          <p className="mt-2 text-sm text-text-gray-opacity md:text-base">
            Join hundreds of advertisers already reaching their audience on Rosey.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/create-account"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 md:text-base"
            >
              Sign Up Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/help-support"
              className="flex items-center gap-2 rounded-xl border border-dark-border bg-input-bg px-8 py-3 text-sm font-semibold text-primary-text transition-colors hover:bg-primary-bg md:text-base"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      <FooterSection hideLocationsSection />
    </section>
  );
}
