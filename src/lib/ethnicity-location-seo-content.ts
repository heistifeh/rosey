// ─── Types ────────────────────────────────────────────────────────────────────

export type EthnicityLocationSeoSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type EthnicityLocationSeoContent = {
  granularity: "city" | "state" | "country";
  introParagraphs: string[];
  sections: EthnicityLocationSeoSection[];
  faq: { question: string; answer: string }[];
  searchHref: string;
  browseAllEthnicityHref: string;
};

export type EthnicityLocationSeoInput = {
  label: string;           // "Hispanic"
  ethnicitySlug: string;   // "hispanic"
  countrySlug: string;     // "united-states"
  countryName: string;     // "United States"
  stateSlug?: string;      // "florida"
  stateName?: string;      // "Florida"
  citySlug?: string;       // "miami"
  cityName?: string;       // "Miami"
};

// ─── Known city hints ─────────────────────────────────────────────────────────
// Used to give location-specific colour to major city pages.

type CityHint = { vibe: string; note: string };

const CITY_HINTS: Record<string, CityHint> = {
  miami: {
    vibe: "vibrant nightlife and year-round tourism",
    note: "Miami's mix of locals, tourists, and seasonal visitors means new listings appear frequently.",
  },
  "new-york": {
    vibe: "one of the most active independent escort markets in the world",
    note: "New York's fast-paced environment means availability changes quickly — profiles with real-time updates stand out.",
  },
  "los-angeles": {
    vibe: "a deeply established entertainment-driven escort market",
    note: "Los Angeles clients tend to prioritise verified photos and clear rates over everything else.",
  },
  london: {
    vibe: "Europe's largest independent escort marketplace",
    note: "London's diverse population drives strong demand for profiles across all ethnicities.",
  },
  dubai: {
    vibe: "a high-demand premium escort market",
    note: "Dubai visitors typically search with specific requirements around discretion, availability windows, and rates.",
  },
  toronto: {
    vibe: "one of Canada's most active escort markets",
    note: "Toronto's multicultural makeup means ethnicity-specific searches are especially common here.",
  },
  sydney: {
    vibe: "Australia's most active independent escort city",
    note: "Sydney's listings move quickly, so profiles with recent updates are consistently preferred.",
  },
  paris: {
    vibe: "a discreet, high-expectation escort market",
    note: "Visitors to Paris usually combine tourism with private arrangements — availability and discretion are top priorities.",
  },
  bangkok: {
    vibe: "one of Southeast Asia's most searched escort destinations",
    note: "Bangkok draws a mix of long-stay visitors and short-term travellers, creating steady demand across all profile types.",
  },
  amsterdam: {
    vibe: "an open and well-established escort market",
    note: "Amsterdam's reputation for transparency means clients expect clear, detailed profile information.",
  },
};

// ─── City suggestions per country ─────────────────────────────────────────────

const TOP_CITIES_BY_COUNTRY: Record<string, string[]> = {
  "united-states": ["New York", "Miami", "Los Angeles", "Chicago", "Las Vegas", "Houston", "Dallas", "Atlanta"],
  "united-kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
  canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  "united-arab-emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  france: ["Paris", "Marseille", "Lyon", "Nice", "Toulouse"],
  germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  kenya: ["Nairobi", "Mombasa", "Kisumu"],
  thailand: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
  netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export const buildEthnicityLocationSeoContent = (
  input: EthnicityLocationSeoInput,
): EthnicityLocationSeoContent => {
  const { label, ethnicitySlug, countrySlug, countryName, stateSlug, stateName, citySlug, cityName } = input;
  const ll = label.toLowerCase();

  const granularity: "city" | "state" | "country" = citySlug
    ? "city"
    : stateSlug
      ? "state"
      : "country";

  const locationLine =
    granularity === "city"
      ? [cityName, stateName, countryName].filter(Boolean).join(", ")
      : granularity === "state"
        ? [stateName, countryName].filter(Boolean).join(", ")
        : countryName;

  const searchHref = new URLSearchParams(
    Object.fromEntries(
      [
        ["ethnicity", label],
        countrySlug ? ["country", countrySlug] : null,
        stateSlug ? ["state", stateSlug] : null,
        citySlug ? ["city", citySlug] : null,
      ].filter((e): e is [string, string] => e !== null),
    ),
  );

  // ── Intro paragraphs ────────────────────────────────────────────────────────

  const cityHint = citySlug ? CITY_HINTS[citySlug] : undefined;

  const introParagraphs: string[] =
    granularity === "city"
      ? [
          `Find verified ${ll} escorts in ${locationLine} — browse independent profiles with current photos, transparent rates, and real-time availability. ${cityHint?.note ?? `${cityName} draws consistent search demand for ${ll} escort profiles year-round.`}`,
          `This directory is filtered specifically for ${ll} escorts in ${cityName}${stateName ? `, ${stateName}` : ""}, so every profile you see matches your search intent directly.`,
        ]
      : granularity === "state"
        ? [
            `Explore ${ll} escort listings across ${stateName ?? locationLine} — from major cities to regional hubs. Browse independent profiles with updated availability, clear rates, and verified information throughout ${stateName ?? locationLine}.`,
            `Whether you're based in ${stateName} or visiting, this directory shows ${ll} escorts active in the state — filterable by city when you're ready to narrow down.`,
          ]
        : [
            `Browse ${ll} escorts across ${countryName} — spanning major cities and regional markets nationwide. This directory connects you to independent ${ll} escort profiles with verified listings and current availability.`,
            `From high-volume city markets to quieter regional listings, every profile here is filtered for ${ll} escorts in ${countryName} so your results are relevant from the first page.`,
          ];

  // ── Sections ────────────────────────────────────────────────────────────────

  const sections: EthnicityLocationSeoSection[] = [];

  // 1 — How this page works (adapts by granularity)
  if (granularity === "city") {
    sections.push({
      id: "how-it-works",
      title: `${ll.charAt(0).toUpperCase() + ll.slice(1)} Escorts in ${cityName} – How This Directory Works`,
      paragraphs: [
        `This page is a filtered view of ${ll} escort listings in ${cityName}${stateName ? `, ${stateName}` : ""}. Every profile shown has been matched to this city specifically — you won't see listings from other cities mixed in.`,
        `Profiles are ordered by recent activity, which means escorts who have updated their listing, photos, or availability recently appear at the top.`,
      ],
    });
  } else if (granularity === "state") {
    const topCities = TOP_CITIES_BY_COUNTRY[countrySlug]?.slice(0, 5) ?? [];
    sections.push({
      id: "how-it-works",
      title: `${label} Escorts Across ${stateName} – How This Directory Works`,
      paragraphs: [
        `This page shows ${ll} escort profiles listed across ${stateName ?? locationLine}. Results are drawn from all active listings in the state and ordered by recent profile activity.`,
        topCities.length > 0
          ? `You can narrow results further by selecting a specific city within ${stateName}.`
          : `Use the search filters to narrow by city, rate, or availability within ${stateName}.`,
      ],
    });
  } else {
    const topCities = TOP_CITIES_BY_COUNTRY[countrySlug] ?? [];
    sections.push({
      id: "geographic-coverage",
      title: `${label} Escorts Across ${countryName} – Coverage`,
      paragraphs: [
        `This directory covers ${ll} escort listings across all major cities and regions in ${countryName}. Profiles are aggregated from active listings nationwide.`,
      ],
      bullets:
        topCities.length > 0
          ? topCities.map((city) => `${city}, ${countryName}`)
          : [
              `Major cities across ${countryName}`,
              "Regional and suburban listings",
              "New listings added regularly as the directory grows",
            ],
    });
  }

  // 2 — Why independent escorts
  sections.push({
    id: "why-independent",
    title: `Why Browse Independent ${label} Escorts in ${locationLine}`,
    paragraphs: [
      `Users searching specifically for ${ll} escorts in ${locationLine} are looking for something more targeted than a generic escort listing. Independent profiles tend to offer more consistent information, direct communication, and greater control over the booking process.`,
      `Compared to agency-managed listings, independent ${ll} escorts typically provide:`,
    ],
    bullets: [
      "Profiles managed directly by the escort — photos and details stay current",
      "Clear rate structures without hidden agency fees",
      `Availability that reflects real-time schedules in ${granularity === "city" ? cityName! : locationLine}`,
      "Direct communication without intermediaries",
      "Location-specific listings rather than generic national profiles",
    ],
  });

  // 3 — What to look for
  sections.push({
    id: "what-to-look-for",
    title: "What to Look For in a Profile",
    paragraphs: [
      `When browsing ${ll} escort profiles in ${locationLine}, a few indicators separate reliable listings from outdated ones:`,
    ],
    bullets: [
      "Recent profile updates — confirms the listing is actively maintained",
      "Multiple photos showing consistent appearance",
      "A clear rate structure (hourly, overnight, or other arrangements)",
      `Availability that is specific to ${granularity === "city" ? cityName! : locationLine} rather than listed as 'nationwide'`,
      "Contact information that is responsive and consistent with the profile",
    ],
  });

  // 4 — How to search (steps)
  sections.push({
    id: "how-to-search",
    title: `How to Find ${label} Escorts in ${locationLine}`,
    paragraphs: [`Follow these steps to find the most relevant ${ll} escort profiles in ${locationLine}:`],
    steps:
      granularity === "city"
        ? [
            `You're already on the right page — this view is filtered for ${ll} escorts in ${cityName}`,
            "Browse profiles by scrolling the grid — results are ordered by recent activity",
            "Open a profile to review photos, rates, availability, and contact details",
            "Use the search bar to switch ethnicity, gender, or rate range if needed",
            "Bookmark profiles you want to return to before making contact",
          ]
        : granularity === "state"
          ? [
              `Browse the current listings — all profiles are filtered for ${ll} escorts in ${stateName}`,
              "Select a specific city page to narrow results to your area",
              "Review profiles individually — check photos, rates, and availability",
              "Use filters on the search page to refine by rate, gender, or availability",
              "Contact directly from the profile listing",
            ]
          : [
              `Browse the current listings — all profiles are filtered for ${ll} escorts in ${countryName}`,
              "Select a city or state page to narrow to your specific location",
              "Review individual profiles for photos, rates, and availability",
              "Use the search bar to filter by city, rate, or other preferences",
              "Contact directly from the profile — no intermediaries involved",
            ],
  });

  // 5 — City-specific vibe section (city pages only)
  if (granularity === "city" && cityHint) {
    sections.push({
      id: "local-market",
      title: `The ${cityName} Market for ${label} Escorts`,
      paragraphs: [
        `${cityName} is known for ${cityHint.vibe}. ${cityHint.note}`,
        `Browsing ${ll} escorts in ${cityName} specifically — rather than using a broad national search — gives you listings that are more likely to be active, local, and responsive.`,
      ],
    });
  }

  // ── FAQ ─────────────────────────────────────────────────────────────────────

  const faq: { question: string; answer: string }[] =
    granularity === "city"
      ? [
          {
            question: `How do I find ${label} escorts in ${cityName}?`,
            answer: `Browse this page — it's filtered specifically for ${ll} escorts in ${cityName}${stateName ? `, ${stateName}` : ""}. Profiles are ordered by recent activity so you see the most current listings first.`,
          },
          {
            question: `Are the ${label} escort listings in ${cityName} up to date?`,
            answer: `Listings are ordered by recent profile activity. Profiles that have been updated recently — photos, rates, availability — appear higher in the results, helping you avoid outdated listings.`,
          },
          {
            question: `Can I search for ${label} escorts by rate in ${cityName}?`,
            answer: `Yes. Use the search bar with the rate filter to narrow ${ll} escort listings in ${cityName} to a specific price range.`,
          },
          {
            question: `What's the difference between this page and a general escort search?`,
            answer: `This page shows only ${ll} escorts in ${locationLine} — it combines the ethnicity filter with the location so you get targeted results immediately, without adjusting any filters manually.`,
          },
        ]
      : granularity === "state"
        ? [
            {
              question: `How do I find ${label} escorts in ${stateName}?`,
              answer: `Browse this directory page — it shows ${ll} escort profiles across ${stateName}. Select a city within ${stateName} to narrow your results to a specific area.`,
            },
            {
              question: `Which cities in ${stateName} have the most ${label} escort listings?`,
              answer: `Larger cities typically have more listings. Browse the city-level pages within ${stateName} to see the number of available ${ll} escort profiles per city.`,
            },
            {
              question: `Are listings specific to ${stateName} or mixed with other states?`,
              answer: `This page shows listings for ${stateName} specifically. Profiles from other states are not mixed in, so every result is relevant to your location.`,
            },
            {
              question: `Can I filter ${label} escorts in ${stateName} by availability?`,
              answer: `Yes. Use the search filters to show only ${ll} escorts in ${stateName} who are currently available or have recently updated their listing.`,
            },
          ]
        : [
            {
              question: `How do I find ${label} escorts in ${countryName}?`,
              answer: `Browse this directory — it shows ${ll} escort profiles across ${countryName}. Select a city or state/region to narrow down to your specific location.`,
            },
            {
              question: `Does this directory cover smaller cities in ${countryName}?`,
              answer: `Yes, listings are drawn from cities of all sizes across ${countryName}. Larger cities will have more profiles, but regional listings are included as the directory grows.`,
            },
            {
              question: `Are all profiles on this page independent ${label} escorts?`,
              answer: `Yes. This page filters specifically for ${ll} escorts in ${countryName} — independent listings only, without agency-managed profiles mixed in.`,
            },
            {
              question: `How often are ${label} escort listings in ${countryName} updated?`,
              answer: `Listings reflect recent profile activity. Profiles that have been updated recently appear first, ensuring the most active ${ll} escorts in ${countryName} are always visible.`,
            },
          ];

  return {
    granularity,
    introParagraphs,
    sections,
    faq,
    searchHref: `/search?${searchHref.toString()}`,
    browseAllEthnicityHref: `/escorts/ethnicity/${ethnicitySlug}`,
  };
};
