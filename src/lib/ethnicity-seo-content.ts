export type EthnicitySeoSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type EthnicitySeoContent = {
  introParagraphs: string[];
  sections: EthnicitySeoSection[];
  faq: { question: string; answer: string }[];
  searchHref: string;
  locationsHref: string;
};

export const buildEthnicitySeoContent = (
  label: string,
  ethnicitySlug: string,
): EthnicitySeoContent => {
  const l = label;         // "Asian"
  const ll = label.toLowerCase(); // "asian"

  return {
    introParagraphs: [
      `Looking for ${l} escorts near you, ${l} escorts in your city, or browsing verified ${l} call girl listings with updated profiles? This directory is built around location-based discovery — designed to help you find relevant results fast.`,
      `Whether you're searching at home or while travelling, Rosey makes it easy to browse independent ${ll} escort profiles by city, availability, and recent activity.`,
    ],

    sections: [
      {
        id: "browse-by-city",
        title: `Browse ${l} Escorts in Your City`,
        paragraphs: [
          `Most visitors begin with searches like "${ll} escorts near me" or "${ll} escorts in my city" — which is why this directory is structured around location-based discovery.`,
          `Rather than showing generic listings, you can quickly explore ${ll} escorts near you by selecting your city and viewing profiles that are active and recently updated.`,
        ],
      },
      {
        id: "why-independent",
        title: `Why Users Choose Independent ${l} Escorts`,
        paragraphs: [
          `Search demand for independent ${ll} escorts continues to grow because users want more control, clearer information, and better communication than outdated platforms offer.`,
          `Users browsing for ${ll} call girls near them or ${ll} escorts in a specific city consistently look for:`,
        ],
        bullets: [
          "Updated photos and consistent profile details",
          `Clear availability indicators such as "available now"`,
          "Direct and straightforward communication",
          "Independent listings without unnecessary intermediaries",
          "Profiles with verifiable information and recent activity",
        ],
      },
      {
        id: "popular-searches",
        title: `Popular Searches for ${l} Escorts Near Me`,
        paragraphs: [
          `Users searching for ${ll} escorts often use variations of the same intent. Common search patterns include:`,
        ],
        bullets: [
          `${ll} escorts near me`,
          `${ll} escorts in my city`,
          `${ll} call girls near me`,
          `${ll} escorts near you`,
          `independent ${ll} escort listings`,
          `${ll} escort directory near me`,
        ],
      },
      {
        id: "geographic-reach",
        title: `${l} Escorts Across Major Cities`,
        paragraphs: [
          `Many visitors start with broad searches before narrowing to a specific city. This directory connects you to ${ll} escort listings across major locations worldwide, including:`,
        ],
        bullets: [
          "United States — New York, Miami, Los Angeles, Chicago, Las Vegas",
          "United Kingdom — London, Manchester, Birmingham",
          "Canada — Toronto, Vancouver, Montreal",
          "United Arab Emirates — Dubai, Abu Dhabi",
          "Australia — Sydney, Melbourne, Brisbane",
          "And more cities added regularly",
        ],
      },
      {
        id: "how-to-find",
        title: `How to Find ${l} Escorts Near You`,
        paragraphs: [
          `If you're searching for ${ll} escorts near me or ${ll} call girls in your city, this process helps you find relevant profiles quickly:`,
        ],
        steps: [
          "Select your country or city from the location filter",
          `Browse ${ll} escorts near you based on availability and recent updates`,
          "Review profile details, photos, and listed rates",
          "Use filters to narrow results by gender, price range, or availability",
          "Explore related listings in nearby areas for more options",
        ],
      },
      {
        id: "verified-profiles",
        title: "Verified Profiles and Updated Listings",
        paragraphs: [
          `Users searching for ${ll} escorts near me want listings that are current and reliable. Profiles with recent updates, clear photos, and consistent information deliver a better browsing experience and help avoid outdated results.`,
          `This directory prioritises listings with regular activity so you always see the most relevant ${ll} escort profiles first.`,
        ],
      },
    ],

    faq: [
      {
        question: `How do I find ${l} escorts near me?`,
        answer: `Use the location-based search to browse ${ll} escorts near you and filter results by city, availability, and recent updates. Select your location and review profiles that are currently active.`,
      },
      {
        question: `Can I browse ${l} escorts in my city?`,
        answer: `Yes. Select your city from the location filter and view ${ll} escort profiles listed in your area. Results are sorted by recent activity to show the most relevant listings first.`,
      },
      {
        question: `Are the ${l} escort listings up to date?`,
        answer: `Listings with recent profile activity, updated photos, and consistent information are prioritised. This helps you avoid outdated results and find ${ll} escorts near you who are currently available.`,
      },
      {
        question: `What is the best way to search for ${l} escorts near you?`,
        answer: `Start by selecting your city, then use the available filters to refine results by rate, availability, and preference. Browsing by location gives you the most relevant ${ll} escort listings in your area.`,
      },
    ],

    searchHref: `/search?ethnicity=${encodeURIComponent(l)}`,
    locationsHref: "/locations",
  };
};
