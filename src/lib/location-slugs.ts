const COUNTRY_SLUG_ALIASES: Record<string, string> = {
  us: "united-states",
  usa: "united-states",
  "u.s.": "united-states",
  "u.s.a": "united-states",
  "united-states-of-america": "united-states",
  uk: "united-kingdom",
  "u.k.": "united-kingdom",
  uae: "united-arab-emirates",
  "u.a.e.": "united-arab-emirates",
};

export const canonicalizeCountrySlug = (value?: string | null) => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return COUNTRY_SLUG_ALIASES[normalized] ?? normalized;
};
