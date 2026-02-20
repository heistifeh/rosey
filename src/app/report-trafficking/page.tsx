import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Report Trafficking | Rosey",
  description:
    "Read Rosey.link anti-trafficking policy, warning signs, and official hotline resources for urgent reporting and safety guidance.",
  path: "/report-trafficking",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "report trafficking",
    "anti trafficking resources",
    "human trafficking hotline",
  ],
});

type ExternalResource = {
  label: string;
  href: string;
};

const warningSigns = [
  "Does a provider arrive accompanied by another individual?",
  "Does that individual speak for or appear to maintain control over the provider?",
  "Does the provider seem fearful of that individual?",
  "Does the provider have difficulty communicating due to language barriers or fear?",
  "Does the provider appear underage or close to underage?",
];

const traffickingStatsLinks: ExternalResource[] = [
  {
    label: "Polaris Project warning signs",
    href: "https://polarisproject.org/human-trafficking-warning-signs/",
  },
  {
    label: "U.S. State Department Trafficking in Persons Report",
    href: "https://www.state.gov/trafficking-in-persons-report/",
  },
  {
    label: "Polaris U.S. trafficking hotline statistics",
    href: "https://humantraffickinghotline.org/en/statistics",
  },
];

const usReportingLinks: ExternalResource[] = [
  { label: "Federal Bureau of Investigation", href: "https://www.fbi.gov/" },
  {
    label: "FBI local field offices",
    href: "https://www.fbi.gov/contact-us/field-offices",
  },
  { label: "U.S. Department of Justice", href: "https://www.justice.gov/" },
  {
    label: "ICE Homeland Security Investigations",
    href: "https://www.ice.gov/tipline",
  },
  {
    label: "National Human Trafficking Hotline",
    href: "https://humantraffickinghotline.org/",
  },
  {
    label: "National Center for Missing & Exploited Children",
    href: "https://www.missingkids.org/home",
  },
  { label: "NCMEC CyberTipline", href: "https://report.cybertip.org/" },
];

const internationalHotlines = [
  {
    name: "United States National Human Trafficking Hotline",
    details:
      "24/7 confidential hotline: 1-888-373-7888 | Text 233733 (BeFree)",
    href: "https://humantraffickinghotline.org/",
  },
  {
    name: "FBI Tip Line",
    details: "1-800-CALL-FBI (1-800-225-5324)",
    href: "https://tips.fbi.gov/",
  },
  {
    name: "ICE Homeland Security Investigations Tip Line",
    details:
      "1-866-347-2423 (U.S. & Canada) | 1-802-872-6199 (International)",
    href: "https://www.ice.gov/tipline",
  },
  {
    name: "NCMEC (CSAM reporting)",
    details: "1-800-THE-LOST (1-800-843-5678)",
    href: "https://report.cybertip.org/",
  },
  {
    name: "Canada Human Trafficking Hotline",
    details: "24/7: 1-833-900-1010",
    href: "https://www.canadianhumantraffickinghotline.ca/",
  },
  {
    name: "United Kingdom Modern Slavery Helpline",
    details: "24/7: 0800 0121 700",
    href: "https://www.modernslaveryhelpline.org/",
  },
  {
    name: "Australian Federal Police",
    details: "131 444 (non-emergency) or 000 (emergency)",
    href: "https://www.afp.gov.au/",
  },
  {
    name: "Europol reporting portal",
    details: "Report trafficking concerns across Europe.",
    href: "https://www.europol.europa.eu/report-a-crime",
  },
  {
    name: "Polaris global hotlines directory",
    details: "Directory for many countries and regions.",
    href: "https://polarisproject.org/global-hotlines/",
  },
];

const governmentResources: ExternalResource[] = [
  { label: "DHS Blue Campaign", href: "https://www.dhs.gov/blue-campaign" },
  {
    label: "U.S. Office on Trafficking in Persons",
    href: "https://www.acf.hhs.gov/otip",
  },
  {
    label: "Center for Countering Human Trafficking",
    href: "https://www.dhs.gov/blue-campaign/center-countering-human-trafficking",
  },
  {
    label: "Office of Refugee Resettlement",
    href: "https://www.acf.hhs.gov/orr",
  },
  {
    label: "Switzerland FDFA trafficking resources",
    href: "https://www.eda.admin.ch/eda/en/fdfa/foreign-policy/human-rights/human-trafficking.html",
  },
];

const nonGovernmentResources: ExternalResource[] = [
  { label: "Polaris Project", href: "https://polarisproject.org/" },
  {
    label: "Shared Hope International",
    href: "https://sharedhope.org/",
  },
  { label: "Love146", href: "https://love146.org/" },
  { label: "La Strada International", href: "https://www.lastradainternational.org/" },
  { label: "OSCE", href: "https://www.osce.org/cthb" },
  { label: "Council of Europe", href: "https://www.coe.int/en/web/anti-human-trafficking" },
  { label: "ECPAT International", href: "https://ecpat.org/" },
];

const additionalResources: ExternalResource[] = [
  { label: "Polaris Project", href: "https://polarisproject.org/" },
  {
    label: "U.S. State Department Trafficking in Persons Report",
    href: "https://www.state.gov/trafficking-in-persons-report/",
  },
  { label: "DHS Blue Campaign", href: "https://www.dhs.gov/blue-campaign" },
  { label: "Shared Hope International", href: "https://sharedhope.org/" },
  { label: "ECPAT International", href: "https://ecpat.org/" },
];

const ExternalLinkList = ({ items }: { items: ExternalResource[] }) => (
  <ul className="mt-3 space-y-2">
    {items.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default function ReportTraffickingPage() {
  return (
    <InfoPageShell
      title="Rosey.Link: Report Trafficking"
      subtitle="Anti-trafficking policy statement and reporting resources."
    >
      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Policy Statement
        </h2>
        <p className="mt-3">
          Rosey.Link is committed to raising awareness of human trafficking. We
          implement anti-trafficking initiatives and advocacy efforts to help
          combat exploitation and abuse.
        </p>
        <p className="mt-3">
          If we become aware of trafficking-related incidents, we take swift
          internal action and cooperate with relevant law enforcement agencies
          assigned to combating these crimes.
        </p>
        <p className="mt-3">
          To report suspected trafficking directly to us, email{" "}
          <Link
            href="mailto:report@rosey.link"
            className="text-primary underline underline-offset-4"
          >
            report@rosey.link
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          1. Trafficking Signs and Statistics
        </h2>
        <p className="mt-3 font-semibold text-primary-text">
          Warning signs of possible human trafficking:
        </p>
        <ul className="mt-3 space-y-2">
          {warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
        <p className="mt-4 font-semibold text-primary-text">
          Learn more and review official statistics:
        </p>
        <ExternalLinkList items={traffickingStatsLinks} />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          2. Report Trafficking and CSAM
        </h2>
        <p className="mt-3">
          In emergencies in the United States, call 911 immediately.
          Non-emergency reports can be submitted through:
        </p>
        <ExternalLinkList items={usReportingLinks} />
        <p className="mt-4">
          To report suspected child sexual abuse material (CSAM), use the
          NCMEC CyberTipline. You can also review child-protection guidance
          from ASACP (Association of Sites Advocating Child Protection).
        </p>
        <ul className="mt-2 space-y-2">
          <li>
            <Link
              href="https://report.cybertip.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              NCMEC CyberTipline
            </Link>
          </li>
          <li>
            <Link
              href="https://www.asacp.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              ASACP
            </Link>
          </li>
        </ul>
        <p className="mt-4">
          In Canada emergencies, call 911, then use the Canadian hotline for
          non-emergencies. In the United Kingdom emergencies, call 999. In
          Italy emergencies, call 112.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          3. Anti-Trafficking Resources
        </h2>
        <p className="mt-3 font-semibold text-primary-text">
          Government resources:
        </p>
        <ExternalLinkList items={governmentResources} />
        <p className="mt-4 font-semibold text-primary-text">
          Non-governmental resources:
        </p>
        <ExternalLinkList items={nonGovernmentResources} />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          4. Direct Hotline Numbers
        </h2>
        <div className="mt-4 space-y-4">
          {internationalHotlines.map((hotline) => (
            <article
              key={hotline.name}
              className="rounded-2xl border border-dark-border bg-input-bg/70 p-4"
            >
              <h3 className="text-base font-semibold text-primary-text md:text-lg">
                {hotline.name}
              </h3>
              <p className="mt-1 text-sm text-text-gray md:text-base">
                {hotline.details}
              </p>
              <Link
                href={hotline.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-block text-sm text-primary underline underline-offset-4 hover:opacity-80 md:text-base"
              >
                Visit resource
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          5. Additional Anti-Trafficking Resources
        </h2>
        <ExternalLinkList items={additionalResources} />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
          Disclaimer
        </h2>
        <p className="mt-3">
          The information and links on this page are provided as educational
          resources. We do not guarantee third-party accuracy or endorse every
          listed organization. Nothing on this page is medical, legal, or
          professional advice.
        </p>
        <p className="mt-3">
          If you are in immediate danger, call 911 in the United States or
          contact local emergency services immediately.
        </p>
      </section>
    </InfoPageShell>
  );
}
