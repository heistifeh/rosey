import type { Metadata } from "next";
import { InfoPageShell } from "@/components/static/info-page-shell";
import { CORE_SEO_KEYWORDS, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Escort Terms Guide | Rosey",
  description:
    "Rosey.link Ultimate Escort & Companion Terminology Guide 2025. Learn common A-Z terms used in profiles, bookings, and companion conversations.",
  path: "/escort-terms",
  keywords: [
    ...CORE_SEO_KEYWORDS,
    "escort terms glossary",
    "companion terminology",
    "escort acronyms",
  ],
});

type GlossaryItem = {
  term: string;
  meaning: string;
};

type GlossarySection = {
  title: string;
  items: GlossaryItem[];
};

const glossarySections: GlossarySection[] = [
  {
    title: "Common Services & Acts",
    items: [
      { term: "69", meaning: "Mutual oral sex at the same time." },
      { term: "A-Level (UK/EU)", meaning: "Anal sex." },
      { term: "BBBJ", meaning: "Bareback Blow Job (no condom)." },
      { term: "BBBJTC", meaning: "Bareback BJ to Completion (cum in mouth)." },
      { term: "BBBJTCWS", meaning: "Bareback BJ to completion with swallow." },
      {
        term: "BBFS",
        meaning:
          "Bareback Full Service (unprotected penetration); almost never offered openly for legal reasons.",
      },
      { term: "BLS", meaning: "Ball licking and sucking." },
      { term: "CBJ", meaning: "Covered Blow Job (with condom)." },
      { term: "CFS", meaning: "Covered Full Service (sex with condom)." },
      { term: "CIM", meaning: "Cum in mouth." },
      { term: "CIP", meaning: "Cum in pussy (creampie)." },
      { term: "COB", meaning: "Cum on body." },
      { term: "COF", meaning: "Cum on face." },
      { term: "COH", meaning: "Cum on hair (facial variant)." },
      {
        term: "CREAMPIE",
        meaning:
          "Ejaculation inside vagina or anus (with or without condom removal).",
      },
      { term: "DATY", meaning: "Dining At The Y (cunnilingus)." },
      { term: "DATO", meaning: "Dining At The O (analingus on provider)." },
      {
        term: "DFK / Deep French Kissing",
        meaning: "Passionate open-mouth kissing.",
      },
      { term: "DSG", meaning: "Dirty Sanches Game (rare fetish)." },
      { term: "DT", meaning: "Deep throat." },
      { term: "FIV", meaning: "Finger in vagina." },
      { term: "FIA", meaning: "Finger in ass." },
      { term: "FJ", meaning: "Foot job." },
      { term: "GS / Golden Shower", meaning: "Urinating on someone." },
      { term: "Greek", meaning: "Anal sex (receiving)." },
      { term: "HJ", meaning: "Hand job." },
      { term: "Italian", meaning: "Penis between breasts (titty fuck)." },
      { term: "Pearl Necklace", meaning: "Ejaculating on neck/chest." },
      {
        term: "Pegging",
        meaning: "Provider penetrates client anally with a strap-on.",
      },
      {
        term: "Roman Shower",
        meaning: "Vomiting on someone (extreme fetish).",
      },
      { term: "Russian", meaning: "Titty fuck (same as Italian)." },
      {
        term: "Snowballing",
        meaning: "Passing semen mouth-to-mouth after CIM.",
      },
      { term: "Spanish", meaning: "Between breasts (same as Russian/Italian)." },
    ],
  },
  {
    title: "Experience Types",
    items: [
      {
        term: "GFE",
        meaning:
          "Girlfriend Experience (kissing, affection, mutual touching, usually BBBJ + CFS).",
      },
      {
        term: "VIP GFE / Elite GFE",
        meaning:
          "Higher-end and longer dates, often with dinner, overnights, and more intimacy.",
      },
      {
        term: "PSE",
        meaning:
          "Porn Star Experience (rough, wild, everything allowed; often includes anal and facial).",
      },
      {
        term: "BFE",
        meaning: "Boyfriend Experience (male escorts for women or men).",
      },
    ],
  },
  {
    title: "Session Length & Pricing Slang",
    items: [
      { term: "QV", meaning: "Quick Visit (10-20 minutes)." },
      { term: "HH", meaning: "Half hour." },
      { term: "HHR", meaning: "Half-hour rate." },
      { term: "45", meaning: "45-minute session." },
      { term: "FH", meaning: "Full hour." },
      {
        term: "MSOG",
        meaning: "Multiple Shots On Goal (multiple orgasms allowed).",
      },
      { term: "MOH", meaning: "Multiple orgasms on hour (same as MSOG)." },
    ],
  },
  {
    title: "Location & Logistics",
    items: [
      { term: "Incall", meaning: "Client goes to provider's location." },
      { term: "Outcall", meaning: "Provider travels to client." },
      { term: "Car Date / CD", meaning: "Session in a vehicle." },
      {
        term: "FMTY",
        meaning:
          "Fly Me To You (client pays flight + multi-hour or overnight minimum).",
      },
      {
        term: "Overnight / ON",
        meaning:
          "8-14 hours, usually including sleep and multiple sessions.",
      },
      { term: "LTE", meaning: "Less Than Expected (review term)." },
      { term: "UTF", meaning: "Unbelievable Time & Fun (positive review)." },
    ],
  },
  {
    title: "Appearance & Body Types",
    items: [
      { term: "BBW", meaning: "Big Beautiful Woman." },
      { term: "SSBBW", meaning: "Super-Sized BBW." },
      {
        term: "Spinner",
        meaning: "Very petite body type, often under 110 lbs.",
      },
      { term: "PAWG", meaning: "Phat Ass White Girl." },
      { term: "MILF / Cougar", meaning: "Mature attractive woman." },
      {
        term: "Girl Next Door / GND",
        meaning: "Natural, low-makeup look.",
      },
      {
        term: "Pornstar Look",
        meaning: "Heavy makeup, large implants, filled lips, etc.",
      },
    ],
  },
  {
    title: "Miscellaneous & Review Board Slang",
    items: [
      { term: "420 friendly", meaning: "Okay with weed." },
      { term: "Greek friendly", meaning: "Offers anal." },
      { term: "BBBJ friendly", meaning: "Offers bareback oral." },
      {
        term: "YMMV",
        meaning:
          "Your Mileage May Vary (experience can depend on chemistry).",
      },
      {
        term: "LE Check",
        meaning: "Law enforcement check at the beginning of a date.",
      },
      {
        term: "Shill Review",
        meaning: "Fake positive review written by provider or agency.",
      },
      {
        term: "NCNS",
        meaning: "No Call No Show (client or provider ghosts).",
      },
      {
        term: "UPS / Upsell",
        meaning: "Provider asks for more money mid-date.",
      },
      {
        term: "Menu",
        meaning:
          "List of exact services and prices (often shared after screening).",
      },
      {
        term: "References",
        meaning:
          "Previous providers you have seen who can vouch for you.",
      },
      {
        term: "Screening",
        meaning:
          "Verification process (ID, deposit, work info, or provider references).",
      },
      {
        term: "Deposit / Booking Fee",
        meaning:
          "Non-refundable fee to secure time (standard in 2025 and beyond).",
      },
      {
        term: "White List / VIP List",
        meaning:
          "Pre-screened repeat clients who may skip full screening.",
      },
    ],
  },
  {
    title: "Fetish & BDSM Specific",
    items: [
      { term: "Domme / Dominatrix", meaning: "Female dominant." },
      { term: "Sub", meaning: "Submissive role." },
      { term: "Switch", meaning: "Plays both dominant and submissive roles." },
      { term: "CBT", meaning: "Cock and Ball Torture." },
      {
        term: "Edge Play",
        meaning: "Riskier activities (for example breath play or knife play).",
      },
      {
        term: "Impact Play",
        meaning: "Spanking, whipping, paddling, and similar play.",
      },
      {
        term: "Role Play / RP",
        meaning: "Acting out fantasies (nurse, secretary, etc.).",
      },
      { term: "Strap-on Play", meaning: "Same as pegging." },
      { term: "Foot Fetish / FF", meaning: "Worshipping feet." },
    ],
  },
  {
    title: "Trans & Non-Binary Terms",
    items: [
      {
        term: "Top / Versatile / Bottom",
        meaning: "Sexual role terminology commonly used in trans listings.",
      },
      {
        term: "Fully Functional",
        meaning: "Trans woman with a working penis.",
      },
      {
        term: "Girl Dick / Clitty",
        meaning: "Preferred terms for trans genitalia in some contexts.",
      },
    ],
  },
];

export default function EscortTermsPage() {
  return (
    <InfoPageShell
      title="Rosey.link Ultimate Escort & Companion Terminology Guide 2025"
      subtitle="The most comprehensive A-Z list. Updated December 2025."
    >
      <p>
        This guide defines common terms used in independent companion listings
        and client discussions. Meanings can vary by region and by individual
        provider boundaries, so always confirm directly and respectfully before
        booking.
      </p>

      {glossarySections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold text-primary-text md:text-2xl">
            {section.title}
          </h2>
          <ul className="mt-4 space-y-2">
            {section.items.map((item) => (
              <li key={`${section.title}-${item.term}`}>
                <span className="font-semibold text-primary-text">
                  {item.term}
                </span>
                {" - "}
                {item.meaning}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </InfoPageShell>
  );
}
