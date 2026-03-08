import { humanizeLocationSlug } from "@/lib/seo";

type MajorCityNeighborhood = {
  name: string;
  angle: string;
};

export type LocationListingSeoInput = {
  citySlug?: string | null;
  stateSlug?: string | null;
  countrySlug?: string | null;
  cityName?: string | null;
  stateName?: string | null;
  countryName?: string | null;
  profileCount?: number;
  source: "search" | "city";
};

export type LocationListingSeoSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type LocationListingSeoContent = {
  heading: string;
  introParagraphs: string[];
  sections: LocationListingSeoSection[];
  cityName: string;
  stateName?: string;
  countryName: string;
  citySlug: string;
  stateSlug?: string;
  countrySlug: string;
  currentListingsHref: string;
  searchHref: string;
  locationsHref: string;
  blogHref: string;
  homeHref: string;
};

type ResolvedVars = {
  cityName: string;
  stateName?: string;
  countryName: string;
  citySlug: string;
  stateSlug?: string;
  countrySlug: string;
  profileCount?: number;
  source: "search" | "city";
};

const MAJOR_CITY_INTROS: Record<string, string> = {
  "united-states/florida/miami":
    "Miami stays in demand because visitors, nightlife traffic, and locals all look for fast replies, verified profiles, and discreet booking options in one place.",
  "united-states/california/los-angeles":
    "Los Angeles has one of the deepest independent escort markets in the U.S., so clear screening rules, current photos, and real-time availability matter more than volume.",
  "united-states/new-york/new-york":
    "New York moves fast, and the best results usually come from profiles that show recent activity, direct communication preferences, and clearly stated boundaries.",
  "united-states/california/san-francisco":
    "San Francisco searches are often high-intent and time-sensitive, which makes verified listings, response quality, and location clarity especially important.",
  "united-states/nevada/las-vegas":
    "Las Vegas demand changes hour by hour, so clients and providers both benefit from listings that show current availability and clear incall or outcall expectations.",
  "united-states/illinois/chicago":
    "Chicago supports year-round demand across business, nightlife, and local traffic, making quality profiles and respectful screening workflows a real advantage.",
  "united-states/texas/houston":
    "Houston spans a wide metro area, so location detail, travel expectations, and response speed are key signals when choosing an independent escort listing.",
  "canada/ontario/toronto":
    "Toronto searches tend to reward profile quality and consistency, especially when listings are current, well-detailed, and clear about screening and availability.",
  "united-kingdom/london/london":
    "London is a competitive market with strong demand for discretion, so verified profiles and transparent communication help serious users avoid low-quality listings.",
  "united-arab-emirates/dubai/dubai":
    "Dubai searches are highly intent-driven, and users usually prioritize professionalism, discretion, and clear scheduling details before making contact.",
};

const CITY_NEIGHBORHOODS: Record<string, MajorCityNeighborhood[]> = {
  "united-states/florida/miami": [
    { name: "Brickell", angle: "high-end incall options and business-travel demand" },
    { name: "South Beach", angle: "nightlife traffic and short-notice outcall interest" },
    { name: "Downtown Miami", angle: "central access for hotels and visitor bookings" },
    { name: "Wynwood", angle: "trendy nightlife and younger crowd demand" },
    { name: "Coral Gables", angle: "quieter, private, and more discreet meet preferences" },
  ],
  "united-states/california/los-angeles": [
    { name: "Beverly Hills", angle: "VIP bookings and premium discretion" },
    { name: "West Hollywood", angle: "nightlife and late-evening search demand" },
    { name: "Santa Monica", angle: "coastal stays and traveler outcalls" },
    { name: "Hollywood", angle: "central location and hotel-heavy demand" },
    { name: "Downtown Los Angeles", angle: "business travelers and event traffic" },
  ],
  "united-states/new-york/new-york": [
    { name: "Midtown Manhattan", angle: "hotel traffic and business-trip bookings" },
    { name: "Upper East Side", angle: "private and upscale client demand" },
    { name: "Lower Manhattan", angle: "central access and flexible meet options" },
    { name: "Brooklyn", angle: "local demand across multiple neighborhoods" },
    { name: "Queens", angle: "airport-adjacent and outer-borough coverage" },
  ],
  "united-states/california/san-francisco": [
    { name: "SoMa", angle: "business traveler demand and hotel convenience" },
    { name: "Union Square", angle: "central visitor traffic and short-notice inquiries" },
    { name: "Marina District", angle: "upscale local and nightlife demand" },
    { name: "Mission District", angle: "high local search volume and flexible schedules" },
    { name: "Financial District", angle: "weekday business travel demand" },
  ],
  "united-states/nevada/las-vegas": [
    { name: "The Strip", angle: "visitor volume and hotel-based bookings" },
    { name: "Downtown Las Vegas", angle: "nightlife and event-driven demand" },
    { name: "Henderson", angle: "private residential and suburban bookings" },
    { name: "Summerlin", angle: "upscale local demand and discretion" },
    { name: "Arts District", angle: "central access near nightlife zones" },
  ],
  "united-states/illinois/chicago": [
    { name: "River North", angle: "nightlife, hotels, and short-notice demand" },
    { name: "The Loop", angle: "business-travel convenience" },
    { name: "Gold Coast", angle: "upscale and discreet bookings" },
    { name: "West Loop", angle: "trendy dining and nightlife traffic" },
    { name: "Lincoln Park", angle: "local demand with flexible scheduling" },
  ],
  "united-states/texas/houston": [
    { name: "Downtown Houston", angle: "business travel and hotel access" },
    { name: "Uptown / Galleria", angle: "premium demand and central convenience" },
    { name: "Midtown", angle: "nightlife and younger local traffic" },
    { name: "River Oaks", angle: "upscale and private bookings" },
    { name: "Medical Center", angle: "central access and short-notice scheduling" },
  ],
  "canada/ontario/toronto": [
    { name: "Downtown Toronto", angle: "business and hotel demand" },
    { name: "Yorkville", angle: "luxury and discreet bookings" },
    { name: "Entertainment District", angle: "nightlife traffic and later bookings" },
    { name: "North York", angle: "broad local coverage and suburban access" },
    { name: "Etobicoke", angle: "airport-area and western GTA demand" },
  ],
};

const buildCityKey = (vars: Pick<ResolvedVars, "countrySlug" | "citySlug" | "stateSlug">) =>
  [vars.countrySlug, vars.stateSlug, vars.citySlug].filter(Boolean).join("/");

const buildCityListingsHref = (vars: Pick<ResolvedVars, "countrySlug" | "stateSlug" | "citySlug">) =>
  `/escorts/${vars.countrySlug}${vars.stateSlug ? `/${vars.stateSlug}` : ""}/${vars.citySlug}`;

const buildSearchHref = (vars: Pick<ResolvedVars, "countrySlug" | "stateSlug" | "citySlug">) => {
  const params = new URLSearchParams();
  params.set("country", vars.countrySlug);
  if (vars.stateSlug) {
    params.set("state", vars.stateSlug);
  }
  params.set("city", vars.citySlug);
  return `/search?${params.toString()}`;
};

const resolveVars = (input: LocationListingSeoInput): ResolvedVars | null => {
  const citySlug = input.citySlug?.trim();
  const countrySlug = input.countrySlug?.trim();
  if (!citySlug || !countrySlug) {
    return null;
  }

  const stateSlug = input.stateSlug?.trim() || undefined;
  const cityName = (input.cityName || humanizeLocationSlug(citySlug) || "").trim();
  const countryName = (input.countryName || humanizeLocationSlug(countrySlug) || "").trim();
  const stateName = (
    input.stateName ||
    (stateSlug ? humanizeLocationSlug(stateSlug) : undefined) ||
    ""
  ).trim();

  if (!cityName || !countryName) {
    return null;
  }

  return {
    cityName,
    stateName: stateName || undefined,
    countryName,
    citySlug,
    stateSlug,
    countrySlug,
    profileCount:
      typeof input.profileCount === "number" && Number.isFinite(input.profileCount)
        ? Math.max(0, Math.floor(input.profileCount))
        : undefined,
    source: input.source,
  };
};

export function buildLocationListingSeoContent(
  input: LocationListingSeoInput,
): LocationListingSeoContent | null {
  const vars = resolveVars(input);
  if (!vars) {
    return null;
  }

  const cityKey = buildCityKey(vars);
  const introOverride = MAJOR_CITY_INTROS[cityKey];
  const neighborhoods = CITY_NEIGHBORHOODS[cityKey] ?? [];
  const year = new Date().getFullYear();
  const sourceLine =
    vars.source === "search"
      ? "This page updates based on your current search filters, so you can compare profiles, pricing, and availability in one view."
      : "This city page is designed for local discovery, with sponsored placements highlighted separately from organic listings.";

  const profileCountLine =
    typeof vars.profileCount === "number"
      ? vars.profileCount > 0
        ? `There ${vars.profileCount === 1 ? "is" : "are"} currently ${vars.profileCount} profile${vars.profileCount === 1 ? "" : "s"} visible for ${vars.cityName}.`
        : `Listings for ${vars.cityName} can change quickly, so check back often as profiles and ads update.`
      : null;

  const introParagraphs = [
    `Searching for escorts near me in ${vars.cityName}? This guide is built to help you find independent escorts near you in ${vars.cityName} who appear active, clearly listed, and easier to verify before booking.`,
    introOverride ||
      `${vars.cityName} is a high-intent market for independent escorts, and the best results usually come from listings with recent activity, clear communication rules, and transparent availability.`,
    `Use this page to compare verified profiles, review rates and preferences, and narrow down your options before making contact. ${sourceLine}`,
    profileCountLine,
  ].filter(Boolean) as string[];

  const sections: LocationListingSeoSection[] = [
    {
      id: "why-city",
      title: `Why ${vars.cityName} is a strong city for independent escorts in ${year}`,
      paragraphs: [
        `${vars.cityName} consistently attracts searches for "escorts near me in ${vars.cityName}", "independent escorts in ${vars.cityName}", and "available now escorts ${vars.cityName}" because users want fast replies, clear boundaries, and up-to-date listings.`,
      ],
      bullets: [
        "Large pool of independent listings compared with smaller local markets",
        "High demand for discreet communication and professional screening",
        "Mix of incall and outcall options depending on provider preferences",
        "Frequent short-notice searches, especially evenings and weekends",
        "Better outcomes when profiles include recent photos and clear booking details",
      ],
    },
  ];

  if (neighborhoods.length > 0) {
    sections.push({
      id: "neighborhoods",
      title: `Popular areas to search in ${vars.cityName}`,
      paragraphs: [
        `Neighborhood availability changes by day and provider schedule, but these areas are commonly searched in ${vars.cityName}. Always confirm exact coverage, incall or outcall options, and travel expectations directly with the provider.`,
      ],
      bullets: neighborhoods.map(
        (item) => `${item.name} - ${item.angle}`,
      ),
    });
  }

  sections.push(
    {
      id: "how-to-book",
      title: `How to find an independent escort in ${vars.cityName}`,
      paragraphs: [
        `If you are searching for escorts near me in ${vars.cityName}, focus on listing quality first and speed second. A clear, respectful message typically converts better than sending multiple vague messages.`,
      ],
      steps: [
        `Search ${vars.cityName} and filter for the type of escort or availability you need`,
        "Review the full profile, including rates, boundaries, and screening preferences",
        "Check whether the provider lists incall, outcall, or both",
        "Send a polite message with time, duration, location type, and any relevant preferences",
        "Complete light screening if requested and confirm the plan before traveling",
      ],
    },
    {
      id: "search-phrases",
      title: `Common search intents for ${vars.cityName}`,
      paragraphs: [
        `Users often search for variations of the same intent. Strong pages cover these terms naturally while still giving practical booking information.`,
      ],
      bullets: [
        `Escorts near me in ${vars.cityName}`,
        `Independent escorts in ${vars.cityName}`,
        `Verified escorts ${vars.cityName}`,
        `Available now escorts ${vars.cityName}`,
        `${vars.cityName} escort listings with incall or outcall details`,
      ],
    },
    {
      id: "safety",
      title: `Safety and screening tips for bookings in ${vars.cityName}`,
      paragraphs: [
        `Safety is part of a better booking experience. Whether you are local or traveling, mutual screening and respectful communication reduce wasted time and help both sides confirm expectations.`,
      ],
      bullets: [
        "Prefer complete profiles with clear photos, rates, and communication rules",
        "Never send deposits or payments before confirming directly with the provider",
        "Expect light screening requests in many markets and treat them professionally",
        "Confirm timing, location type, and total rate before meeting",
        "Respect boundaries, arrive on time, and communicate clearly if plans change",
      ],
    },
    {
      id: "why-rosey",
      title: `Why Rosey.link is useful for city-based escort searches`,
      paragraphs: [
        `Rosey.link is designed for location-based discovery, so users searching for independent escorts in ${vars.cityName} can compare listings, see current profile details, and browse related cities without restarting the search.`,
        `For broader location browsing, city pages, and booking guidance, use the internal links below to continue exploring.`,
      ],
    },
  );

  return {
    heading: `Escorts Near Me in ${vars.cityName}`,
    introParagraphs,
    sections,
    cityName: vars.cityName,
    stateName: vars.stateName,
    countryName: vars.countryName,
    citySlug: vars.citySlug,
    stateSlug: vars.stateSlug,
    countrySlug: vars.countrySlug,
    currentListingsHref: buildCityListingsHref(vars),
    searchHref: buildSearchHref(vars),
    locationsHref: "/locations",
    blogHref: "/blog",
    homeHref: "/",
  };
}
