import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Legal Notices | Rosey",
  description:
    "Review Rosey.link legal notices covering disclaimers, age restrictions, intellectual property, DMCA, and legal contact details.",
  path: "/legal-notices",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "legal notices",
    "dmca notice",
    "copyright policy",
  ],
});

export default function LegalNoticesPage() {
  return (
    <InfoPageShell
      title="Legal Notices - Rosey.link"
      subtitle="Last Updated: February 19, 2026"
    >
      <p>
        This Legal Notices page is a consolidated reference for important legal
        statements, disclaimers, intellectual property protections, and related
        notices applicable to use of rosey.link (the &quot;Site&quot;).
      </p>
      <p>
        It supplements our Terms &amp; Conditions and Privacy Policy. By
        accessing or using the Site, you acknowledge and agree to these
        notices.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          1. Adults Only - Age Restriction
        </h2>
        <p className="mt-3">
          The Site contains adult-oriented content related to companionship and
          intimate services, which may include explicit material. It is intended
          only for individuals who are at least 18 years old (or the age of
          majority in your jurisdiction, whichever is higher).
        </p>
        <p className="mt-3">By entering or using the Site, you confirm that:</p>
        <ul className="mt-4 space-y-2">
          <li>You are 18 years of age or older.</li>
          <li>Accessing adult content is legal in your location.</li>
          <li>You will not allow minors to access the Site.</li>
        </ul>
        <p className="mt-3">
          If you are under 18 or access is unlawful in your location, exit
          immediately.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          2. Disclaimer of Endorsement and Liability
        </h2>
        <p className="mt-3">
          Rosey.link is an online directory and informational platform only. We
          do not:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            Provide, arrange, facilitate, or participate in companionship,
            escort, or intimate services.
          </li>
          <li>
            Verify, endorse, guarantee, or assume responsibility for profile or
            listing accuracy, legality, safety, or quality.
          </li>
          <li>
            Act as an agent, employer, or intermediary for transactions between
            users and providers.
          </li>
        </ul>
        <p className="mt-3">
          All profile content is user-submitted and is the sole responsibility
          of the submitting party. Users interact at their own risk.
        </p>
        <p className="mt-3">
          Rosey.link disclaims liability for damages, losses, injuries,
          disputes, fraud, scams, misrepresentation, illegal activity, or
          third-party rights violations arising from Site usage.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          3. No Professional Advice
        </h2>
        <p className="mt-3">
          Nothing on the Site constitutes legal, medical, financial, safety, or
          professional advice. Users are solely responsible for complying with
          all applicable laws in their jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          4. Intellectual Property
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            Copyright © 2026 Rosey.link. All rights reserved. Site design,
            text, graphics, logos, images, software, and related content
            (excluding user-submitted profiles) are protected by U.S. and
            international copyright laws.
          </li>
          <li>
            &quot;Rosey.link&quot; and associated branding may be trademarks or
            service marks. Unauthorized use is prohibited.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          5. DMCA Copyright Infringement Notice
        </h2>
        <p className="mt-3">
          If you believe content on the Site infringes your copyright, send a
          written DMCA notice to{" "}
          <Link
            href="mailto:legal@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            legal@rosey.link
          </Link>
          .
        </p>
        <p className="mt-3">Your notice should include:</p>
        <ul className="mt-4 space-y-2">
          <li>
            Physical or electronic signature of the copyright owner or
            authorized agent.
          </li>
          <li>
            Identification of the copyrighted work claimed to be infringed.
          </li>
          <li>
            Identification of the allegedly infringing material and its location
            (URL/description).
          </li>
          <li>Your contact information (address, phone, and email).</li>
          <li>
            Statement of good-faith belief that use is unauthorized.
          </li>
          <li>
            Statement under penalty of perjury that the notice is accurate and
            you are authorized to act.
          </li>
        </ul>
        <p className="mt-3">
          We may remove or disable access to allegedly infringing material upon
          receipt of a valid notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          6. Governing Law and Jurisdiction
        </h2>
        <p className="mt-3">
          These Legal Notices and your use of the Site are governed by the laws
          of the United States and the State of California, without regard to
          conflict-of-laws principles. Disputes shall be resolved exclusively in
          state or federal courts located in California.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          7. Changes to Legal Notices
        </h2>
        <p className="mt-3">
          We may update these notices at any time. Changes are posted here with
          an updated date. Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          8. Contact for Legal Inquiries
        </h2>
        <p className="mt-3">
          For legal matters, DMCA notices, or questions about these notices,
          email{" "}
          <Link
            href="mailto:legal@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            legal@rosey.link
          </Link>
          .
        </p>
      </section>
    </InfoPageShell>
  );
}
