import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Rosey",
  description:
    "Read how Rosey.link collects, uses, stores, and protects personal information, including cookies and consumer privacy rights.",
  path: "/privacy-policy",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "privacy policy",
    "data protection",
    "consumer privacy rights",
  ],
});

export default function PrivacyPolicyPage() {
  return (
    <InfoPageShell
      title="Rosey.link Privacy Policy"
      subtitle="Last Updated: February 19, 2026"
    >
      <p>
        Rosey.link (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
        rosey.link (the &quot;Site&quot;), a directory platform for adult
        companionship services. We are committed to protecting your privacy.
        This policy explains how we collect, use, disclose, and safeguard your
        information when you visit the Site, submit content, contact us, or use
        our services.
      </p>
      <p>
        By accessing or using the Site, you agree to this Privacy Policy.
      </p>
      <p>
        Important: The Site contains adult-oriented content and is strictly for
        individuals at least 18 years old (or age of majority in your
        jurisdiction). We do not knowingly collect information from minors.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          1. Information We Collect
        </h2>
        <p className="mt-3">
          We may collect information that identifies, relates to, describes, or
          can be linked to a consumer or device (&quot;Personal
          Information&quot;), including:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            Identifiers: name/alias, email address, phone number (if provided),
            and IP address.
          </li>
          <li>
            Internet/network activity: browsing history on the Site, pages
            viewed, time spent, referring/exit pages, device type, browser type,
            and operating system.
          </li>
          <li>
            Limited sensitive data (if voluntarily submitted), for example
            self-described profile details in listings or support messages.
          </li>
        </ul>
        <p className="mt-3">
          Collection sources include direct submissions (profile forms, support
          emails, newsletter sign-ups), cookies/server logs, and analytics
          tools.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          2. How We Use Your Information
        </h2>
        <ul className="mt-4 space-y-2">
          <li>Operate and maintain the Site.</li>
          <li>Provide support and respond to inquiries.</li>
          <li>Improve the Site via usage analytics.</li>
          <li>Send optional newsletters/updates (with opt-out).</li>
          <li>Comply with legal obligations and protect safety/rights.</li>
          <li>Prevent fraud and abuse.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          3. How We Share Your Information
        </h2>
        <p className="mt-3">
          We do not sell or share Personal Information as defined by CCPA/CPRA
          for monetized cross-context behavioral advertising.
        </p>
        <p className="mt-3">We may disclose information to:</p>
        <ul className="mt-4 space-y-2">
          <li>
            Service providers (hosting, analytics, email tools) under
            confidentiality obligations.
          </li>
          <li>
            Legal authorities if required by law/subpoena or to protect
            rights/safety.
          </li>
          <li>Parties in a merger, acquisition, or business transfer.</li>
        </ul>
        <p className="mt-3">
          Public provider profile submissions (descriptions, images, and contact
          details) are visible to users.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          4. Cookies and Tracking Technologies
        </h2>
        <p className="mt-3">
          We use cookies, web beacons, and similar technologies for
          functionality, performance, and analytics. You can manage cookies via
          browser settings. Where applicable, we honor Global Privacy Control
          (GPC) opt-out signals.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          5. Your Privacy Rights (US Consumers)
        </h2>
        <p className="mt-3">
          If you are a California resident (or in another applicable U.S.
          jurisdiction), you may have rights to:
        </p>
        <ul className="mt-4 space-y-2">
          <li>Know/access categories and sources of data collected.</li>
          <li>Request deletion of Personal Information.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Opt out of sale/sharing (we do not sell/share).</li>
          <li>
            Limit use/disclosure of sensitive Personal Information where
            applicable.
          </li>
          <li>Non-discrimination for exercising privacy rights.</li>
        </ul>
        <p className="mt-3">
          To exercise rights, email{" "}
          <Link
            href="mailto:support@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            support@rosey.link
          </Link>{" "}
          with verification details. We typically respond within 45 days
          (extendable to 90 days where allowed).
        </p>
        <p className="mt-3">
          For opt-out requests, use any provided footer control (if available)
          or email support directly.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          6. Children&apos;s Privacy
        </h2>
        <p className="mt-3">
          The Site is not directed to anyone under 18 and we do not knowingly
          collect data from minors. If we learn that minor data has been
          submitted, we will delete it promptly.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          7. Data Security
        </h2>
        <p className="mt-3">
          We use reasonable administrative, technical, and physical safeguards.
          No internet transmission or storage system is fully secure, so use the
          Site at your own risk.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          8. Changes to This Privacy Policy
        </h2>
        <p className="mt-3">
          We may update this policy periodically and post updates on this page
          with a revised date. Continued use after updates constitutes
          acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          9. Contact Us
        </h2>
        <p className="mt-3">
          For questions, privacy rights requests, or concerns, contact{" "}
          <Link
            href="mailto:support@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            support@rosey.link
          </Link>
          .
        </p>
      </section>
    </InfoPageShell>
  );
}
