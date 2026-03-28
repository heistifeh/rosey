import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { City, Country, State } from "country-state-city";
import {
  CORE_SEO_KEYWORDS,
  SITE_URL,
  absoluteUrl,
  buildPageMetadata,
  humanizeLocationSlug,
} from "@/lib/seo";
import { canonicalizeCountrySlug } from "@/lib/location-slugs";
import { ETHNICITY_META } from "@/lib/ethnicity-meta";
import { EthnicityLocationPageClient } from "./ethnicity-location-page-client";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageParams = {
  ethnicity: string;
  countrySlug: string;
  locationSegments?: string[];
};

type PageSearchParams = {
  page?: string | string[];
  [key: string]: string | string[] | undefined;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const parsePageParam = (value?: string) => {
  if (!value) return 1;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
};

const slugifyValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^[-]+|[-]+$/g, "")
    .toLowerCase();

const normalizeCountryKey = (slug?: string) => {
  if (!slug) return undefined;
  const key = slug.toLowerCase();
  const aliases: Record<string, string> = {
    usa: "us",
    "u.s.": "us",
    "u.s.a": "us",
    "united-states": "us",
    "united-states-of-america": "us",
    uk: "united-kingdom",
    "u.k.": "united-kingdom",
    uae: "united-arab-emirates",
    "u.a.e.": "united-arab-emirates",
  };
  return aliases[key] ?? key;
};

const getCountryIsoCode = (countrySlug?: string) => {
  if (!countrySlug) return null;
  const normalized = normalizeCountryKey(countrySlug);
  return (
    Country.getAllCountries().find((c) => {
      const nameSlug = slugifyValue(c.name);
      return (
        nameSlug === normalized ||
        c.isoCode.toLowerCase() === normalized ||
        c.isoCode.toLowerCase() === countrySlug?.toLowerCase()
      );
    })?.isoCode ?? null
  );
};

const US_CITY_STATE_PREFERENCE: Record<string, string> = {
  miami: "florida",
  "new-york": "new-york",
  "los-angeles": "california",
  chicago: "illinois",
  houston: "texas",
  "san-francisco": "california",
  "san-diego": "california",
  "las-vegas": "nevada",
  dallas: "texas",
  atlanta: "georgia",
};

const isStateSlugForCountry = (countrySlug: string, segment: string) => {
  const isoCode = getCountryIsoCode(countrySlug);
  if (!isoCode) return false;
  const normalized = slugifyValue(segment);
  return State.getStatesOfCountry(isoCode).some(
    (s) =>
      slugifyValue(s.name) === normalized ||
      s.isoCode.toLowerCase() === normalized,
  );
};

const inferStateSlugFromCity = (countrySlug: string, citySlug?: string) => {
  if (!citySlug) return undefined;
  const isoCode = getCountryIsoCode(countrySlug);
  if (!isoCode) return undefined;
  const normalized = slugifyValue(citySlug);
  const matches: string[] = [];
  for (const state of State.getStatesOfCountry(isoCode)) {
    const hit = (City.getCitiesOfState(isoCode, state.isoCode) ?? []).some(
      (c) => slugifyValue(c.name) === normalized,
    );
    if (hit) {
      const stateSlug = slugifyValue(state.name);
      if (!matches.includes(stateSlug)) matches.push(stateSlug);
    }
  }
  if (matches.length === 1) return matches[0];
  if (matches.length > 1 && isoCode === "US") {
    const preferred = US_CITY_STATE_PREFERENCE[normalized];
    if (preferred && matches.includes(preferred)) return preferred;
  }
  return undefined;
};

const toLocationParams = (params: PageParams) => {
  const canonicalCountry =
    canonicalizeCountrySlug(params.countrySlug) ?? params.countrySlug;
  const segments = params.locationSegments ?? [];

  if (segments.length === 0) {
    return {
      rawCountrySlug: params.countrySlug,
      countrySlug: canonicalCountry,
      citySlug: undefined as string | undefined,
      stateSlug: undefined as string | undefined,
    };
  }

  if (segments.length === 1) {
    const [segment] = segments;
    if (isStateSlugForCountry(params.countrySlug, segment)) {
      return {
        rawCountrySlug: params.countrySlug,
        countrySlug: canonicalCountry,
        citySlug: undefined as string | undefined,
        stateSlug: segment,
      };
    }
    return {
      rawCountrySlug: params.countrySlug,
      countrySlug: canonicalCountry,
      citySlug: segment,
      stateSlug: undefined as string | undefined,
    };
  }

  if (segments.length === 2) {
    const [stateSlug, citySlug] = segments;
    return {
      rawCountrySlug: params.countrySlug,
      countrySlug: canonicalCountry,
      citySlug,
      stateSlug,
    };
  }

  return {
    rawCountrySlug: params.countrySlug,
    countrySlug: canonicalCountry,
    citySlug: undefined as string | undefined,
    stateSlug: undefined as string | undefined,
  };
};

const buildCanonicalPath = (
  ethnicitySlug: string,
  countrySlug: string,
  citySlug?: string,
  stateSlug?: string,
) => {
  const base = `/escorts/ethnicity/${ethnicitySlug}/${countrySlug}`;
  if (!citySlug) return stateSlug ? `${base}/${stateSlug}` : base;
  if (stateSlug) return `${base}/${stateSlug}/${citySlug}`;
  return `${base}/${citySlug}`;
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const meta = ETHNICITY_META[resolvedParams.ethnicity];
  if (!meta) return {};

  const loc = toLocationParams(resolvedParams);
  const preferredState =
    loc.stateSlug ?? inferStateSlugFromCity(loc.countrySlug, loc.citySlug);
  const canonicalPath = buildCanonicalPath(
    resolvedParams.ethnicity,
    loc.countrySlug,
    loc.citySlug,
    preferredState,
  );
  const currentPage = parsePageParam(toSingleValue(resolvedSearchParams?.page));

  const countryName = humanizeLocationSlug(loc.countrySlug) ?? loc.countrySlug;
  const stateName = preferredState
    ? humanizeLocationSlug(preferredState)
    : undefined;
  const cityName = loc.citySlug
    ? humanizeLocationSlug(loc.citySlug)
    : undefined;

  const locationLine = [cityName, stateName, countryName]
    .filter(Boolean)
    .join(", ");

  const pageSuffix = currentPage > 1 ? ` – Page ${currentPage}` : "";

  const title = `${meta.label} Escorts in ${locationLine} | Rosey${pageSuffix}`;
  const description = cityName
    ? `Find verified ${meta.label.toLowerCase()} escorts in ${locationLine} on Rosey. Browse independent profiles with rates, photos, and real-time availability. Discreet and trusted.`
    : `Browse verified ${meta.label.toLowerCase()} escorts across ${locationLine} on Rosey. Discover independent profiles with rates and availability.`;

  return {
    ...buildPageMetadata({
      title,
      description,
      path: canonicalPath,
      keywords: [
        ...CORE_SEO_KEYWORDS,
        `${meta.label.toLowerCase()} escorts`,
        cityName ? `${meta.label.toLowerCase()} escorts in ${cityName}` : "",
        cityName ? `${cityName} escorts` : "",
        countryName ? `${meta.label.toLowerCase()} escorts ${countryName}` : "",
      ].filter(Boolean),
    }),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EthnicityLocationPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const meta = ETHNICITY_META[resolvedParams.ethnicity];
  if (!meta) notFound();

  const loc = toLocationParams(resolvedParams);

  // Canonicalize country slug (e.g. "us" → "united-states")
  if (loc.rawCountrySlug.toLowerCase() !== loc.countrySlug.toLowerCase()) {
    const destination = buildCanonicalPath(
      resolvedParams.ethnicity,
      loc.countrySlug,
      loc.citySlug,
      loc.stateSlug,
    );
    permanentRedirect(destination);
  }

  const preferredState =
    loc.stateSlug ?? inferStateSlugFromCity(loc.countrySlug, loc.citySlug);

  // If city found without state in URL but state can be inferred, canonicalize
  const shouldInsertState = Boolean(
    loc.citySlug &&
      !resolvedParams.locationSegments?.[1] &&
      preferredState,
  );
  if (shouldInsertState) {
    const destination = buildCanonicalPath(
      resolvedParams.ethnicity,
      loc.countrySlug,
      loc.citySlug,
      preferredState,
    );
    permanentRedirect(destination);
  }

  const canonicalPath = buildCanonicalPath(
    resolvedParams.ethnicity,
    loc.countrySlug,
    loc.citySlug,
    preferredState,
  );
  const canonicalUrl = absoluteUrl(canonicalPath);
  const initialPage = parsePageParam(toSingleValue(resolvedSearchParams?.page));

  const countryName = humanizeLocationSlug(loc.countrySlug) ?? loc.countrySlug;
  const stateName = preferredState
    ? humanizeLocationSlug(preferredState)
    : undefined;
  const cityName = loc.citySlug
    ? humanizeLocationSlug(loc.citySlug)
    : undefined;
  const locationLine = [cityName, stateName, countryName]
    .filter(Boolean)
    .join(", ");

  // JSON-LD
  const breadcrumbItems = [
    { position: 1, name: "Home", item: SITE_URL },
    {
      position: 2,
      name: `${meta.label} Escorts`,
      item: absoluteUrl(`/escorts/ethnicity/${resolvedParams.ethnicity}`),
    },
    {
      position: 3,
      name: countryName,
      item: absoluteUrl(
        `/escorts/ethnicity/${resolvedParams.ethnicity}/${loc.countrySlug}`,
      ),
    },
    ...(preferredState
      ? [
          {
            position: 4,
            name: stateName!,
            item: absoluteUrl(
              `/escorts/ethnicity/${resolvedParams.ethnicity}/${loc.countrySlug}/${preferredState}`,
            ),
          },
        ]
      : []),
    ...(loc.citySlug
      ? [
          {
            position: preferredState ? 5 : 4,
            name: cityName!,
            item: canonicalUrl,
          },
        ]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${meta.label} Escorts in ${locationLine} | Rosey`,
        description: `Browse verified independent ${meta.label.toLowerCase()} escort profiles in ${locationLine} on Rosey. Discreet, trusted, and regularly updated.`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
        ...(loc.citySlug
          ? {
              about: {
                "@type": "Place",
                name: locationLine,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: cityName,
                  addressRegion: stateName,
                  addressCountry: countryName,
                },
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems.map((item) => ({
          "@type": "ListItem",
          position: item.position,
          name: item.name,
          item: item.item,
        })),
      },
    ],
  };

  return (
    <>
      <Suspense fallback={null}>
        <EthnicityLocationPageClient
          ethnicitySlug={resolvedParams.ethnicity}
          ethnicityLabel={meta.label}
          countrySlug={loc.countrySlug}
          citySlug={loc.citySlug}
          stateSlug={preferredState}
          initialPage={initialPage}
        />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
