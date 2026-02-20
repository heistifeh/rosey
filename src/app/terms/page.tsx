import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions | Rosey",
  description:
    "Review Rosey.link terms and conditions, including eligibility, acceptable use, liability disclaimers, and governing law.",
  path: "/terms",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "terms and conditions",
    "user agreement",
    "directory terms",
  ],
});

export default function TermsPage() {
  return (
    <InfoPageShell
      title="Rosey.link Terms & Conditions"
      subtitle="Last Updated: February 19, 2026"
    >
      <p>
        By accessing or using Rosey.link (the &quot;Site&quot;), you agree to
        be bound by these Terms &amp; Conditions (&quot;Terms&quot;). If you do
        not agree, do not use the Site.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          1. Eligibility
        </h2>
        <p className="mt-3">
          You must be at least 18 years old (or the age of majority in your
          jurisdiction) to use the Site. By proceeding, you confirm you are of
          legal age and that accessing adult content is lawful in your
          location. The Site contains material related to adult companionship
          services, which may be explicit.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          2. Site Purpose
        </h2>
        <p className="mt-3">
          Rosey.link is a directory platform connecting users with independent
          adult companionship providers. We do not offer, arrange, or
          participate in services. All listings are user-submitted and for
          informational purposes only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          3. User Conduct
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            You agree not to use the Site for illegal activities, including but
            not limited to solicitation where prohibited by law.
          </li>
          <li>Do not post false, harmful, or infringing content.</li>
          <li>
            Respect privacy. Do not harass, spam, or share personal information
            without consent.
          </li>
          <li>
            Providers must ensure listings comply with local laws and contain
            accurate details.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          4. Disclaimers and Liability
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            The Site is provided &quot;as is&quot; without warranties. We do
            not verify profiles, services, or users.
          </li>
          <li>
            Rosey.link is not liable for damages, losses, or disputes arising
            from interactions. Use the Site at your own risk.
          </li>
          <li>
            We may remove content or suspend access without notice for policy
            violations.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          5. Intellectual Property
        </h2>
        <p className="mt-3">
          All Site content (including text, images, and logos) is owned by
          Rosey.link or its licensors. You may not reproduce or redistribute
          content without permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          6. Governing Law
        </h2>
        <p className="mt-3">
          These Terms are governed by the laws of Nigeria (as the Site operates
          from Lagos). Disputes are subject to resolution in Lagos courts.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          7. Changes to Terms
        </h2>
        <p className="mt-3">
          We may update these Terms from time to time. Continued use of the
          Site after updates constitutes acceptance of the revised Terms.
        </p>
        <p className="mt-3">
          Questions:{" "}
          <Link
            href="mailto:support@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            support@rosey.link
          </Link>
        </p>
      </section>
    </InfoPageShell>
  );
}
