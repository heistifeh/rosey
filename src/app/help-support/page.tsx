import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Help & Support | Rosey",
  description:
    "Get help with browsing, bookings, profile management, safety concerns, and technical issues on Rosey.link.",
  path: "/help-support",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "rosey support",
    "live chat support",
    "escort directory help",
  ],
});

export default function HelpSupportPage() {
  return (
    <InfoPageShell
      title="Help & Support - Rosey.link"
      subtitle="Need assistance right now? Use Live Support Chat or contact us directly."
    >
      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Need Assistance Right Now?
        </h2>
        <p className="mt-3">
          Use our Live Support Chat popup on any page of rosey.link for instant
          help from our team. It is available 24 hours and handles questions
          about browsing, bookings, profiles, safety, and technical issues in a
          discreet, private way.
        </p>
        <p className="mt-3">
          Look for the chat bubble icon (usually bottom-right) and click to
          start chatting. No registration is required.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          How to Access Live Support
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            On desktop/mobile, a floating chat icon appears on every page
            (bottom-right).
          </li>
          <li>Click it to open the popup window.</li>
          <li>
            Type your question, for example: &quot;How do I verify a
            profile?&quot; or &quot;My message is not sending.&quot;
          </li>
          <li>
            Our support agents respond in real-time when online. If offline,
            leave a message for callback/email follow-up.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Alternative Contact Options
        </h2>
        <p className="mt-3">
          If live chat is unavailable or your issue is non-urgent:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            Email:{" "}
            <Link
              href="mailto:support@rosey.link"
              className="text-primary underline underline-offset-4"
            >
              support@rosey.link
            </Link>{" "}
            for detailed reports, profile updates, or feedback. Typical reply
            time is 24-48 hours (often sooner).
          </li>
          <li>
            Report urgent issues:{" "}
            <Link
              href="mailto:report@rosey.link"
              className="text-primary underline underline-offset-4"
            >
              report@rosey.link
            </Link>{" "}
            with profile details, screenshots, and a clear description (for
            example suspicious activity, fake listing, or harassment).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Guidance for Clients
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            Browse profiles using filters on the homepage or search page.
          </li>
          <li>
            Contact companions directly via listed methods (WhatsApp, phone, or
            message form). Include alias, preferred time/date, duration,
            incall/outcall, and requests.
          </li>
          <li>
            Discuss boundaries, rates, and screening upfront. Prioritize safety:
            meet in safe places initially, use protection, and confirm
            comfort/consent throughout.
          </li>
          <li>
            Payments are direct between parties. Never share sensitive financial
            details on-platform.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Guidance for Providers
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            For profile changes, visibility issues, or new submissions, email{" "}
            <Link
              href="mailto:support@rosey.link"
              className="text-primary underline underline-offset-4"
            >
              support@rosey.link
            </Link>{" "}
            with your details.
          </li>
          <li>
            Keep your availability updated and respond promptly to build trust.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Safety Reminders
        </h2>
        <ul className="mt-4 space-y-2">
          <li>Verify identities mutually before sharing sensitive details.</li>
          <li>
            Report violations or concerns immediately via live chat or email.
          </li>
          <li>
            Follow local laws on adult services. Rosey.link is a directory only
            and does not mediate or guarantee interactions.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          We Are Here to Help
        </h2>
        <p className="mt-3">
          Live Support makes getting answers fast and easy. If the popup is not
          appearing (rare browser issue), refresh the page or try incognito
          mode.
        </p>
        <p className="mt-3">
          Feedback via chat or email helps us improve the platform. Use
          Rosey.link responsibly. Thank you.
        </p>
      </section>
    </InfoPageShell>
  );
}
