import { slugifyLocation } from "@/lib/google-places";

type DayTimes = Record<string, string[]>;

type LocationLike = {
  city?: string;
  state?: string;
  country?: string;
  city_slug?: string;
  state_slug?: string;
  country_slug?: string;
  fullLabel?: string;
};

export type ProfileOnboardingData = {
  workingName?: string;
  profileUsername?: string;
  profileType?: string;
  gender?: string;
  pronouns?: string;
  age?: string | number | null;
  catersTo?: string | string[];
  homeLocations?: string;
  homeLocation?: LocationLike | null;
  about?: string;
  baseHourlyRates?: string | number | null;
  baseCurrency?: string;
  dayTimes?: DayTimes;
  selectedDays?: string[];
};

export type NormalizedOnboardingLocation = {
  city: string;
  state: string;
  country: string;
  city_slug: string;
  state_slug: string;
  country_slug: string;
  fullLabel: string;
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeText = (value: unknown) => (hasText(value) ? value.trim() : "");

const parseInteger = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (!hasText(value)) {
    return Number.NaN;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const parseLocationLabel = (label?: string | null) => {
  if (!hasText(label)) {
    return {
      city: "",
      state: "",
      country: "",
    };
  }

  const parts = label
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    city: parts[0] ?? "",
    state: parts[1] ?? "",
    country: parts[2] ?? "",
  };
};

const isLocationLike = (value: unknown): value is LocationLike => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    hasText(candidate.city) ||
    hasText(candidate.state) ||
    hasText(candidate.country) ||
    hasText(candidate.fullLabel)
  );
};

const hasValidCatersTo = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.some((item) => hasText(item));
  }
  return hasText(value);
};

const hasAvailability = (dayTimes?: DayTimes, selectedDays?: string[]) => {
  const hasDayTimes = Object.values(dayTimes ?? {}).some(
    (slots) => Array.isArray(slots) && slots.some((slot) => hasText(slot))
  );

  if (hasDayTimes) return true;

  return Array.isArray(selectedDays) && selectedDays.some((day) => hasText(day));
};

export const normalizeOnboardingLocation = (
  data: Pick<ProfileOnboardingData, "homeLocation" | "homeLocations">
): NormalizedOnboardingLocation => {
  const location = isLocationLike(data.homeLocation) ? data.homeLocation : null;
  const parsedFallback = parseLocationLabel(data.homeLocations);

  const city = normalizeText(location?.city) || parsedFallback.city;
  const state = normalizeText(location?.state) || parsedFallback.state;
  const country = normalizeText(location?.country) || parsedFallback.country;

  const city_slug = normalizeText(location?.city_slug) || (city ? slugifyLocation(city) : "");
  const state_slug = normalizeText(location?.state_slug) || (state ? slugifyLocation(state) : "");
  const country_slug =
    normalizeText(location?.country_slug) || (country ? slugifyLocation(country) : "");
  const fullLabel =
    normalizeText(location?.fullLabel) || [city, state, country].filter(Boolean).join(", ");

  return {
    city,
    state,
    country,
    city_slug,
    state_slug,
    country_slug,
    fullLabel,
  };
};

export const getGeneralMissingFields = (data: ProfileOnboardingData) => {
  const missing: string[] = [];

  if (!hasText(data.workingName)) missing.push("Working name");
  if (!hasText(data.profileUsername)) missing.push("Profile username");
  if (!hasText(data.profileType)) missing.push("Profile type");
  if (!hasText(data.gender)) missing.push("Gender");
  if (!hasText(data.pronouns)) missing.push("Pronouns");
  if (!hasValidCatersTo(data.catersTo)) missing.push("Caters to");

  const parsedAge = parseInteger(data.age);
  if (!Number.isFinite(parsedAge) || parsedAge < 18) {
    missing.push("Age (18+)");
  }

  const location = normalizeOnboardingLocation(data);
  if (!location.city || !location.state || !location.country) {
    missing.push("Home location (city, state, country)");
  }

  return missing;
};

export const getProfileMissingFields = (data: Pick<ProfileOnboardingData, "about">) => {
  const missing: string[] = [];
  if (!hasText(data.about)) {
    missing.push("About");
  }
  return missing;
};

export const getRatesMissingFields = (
  data: Pick<ProfileOnboardingData, "baseHourlyRates" | "baseCurrency">
) => {
  const missing: string[] = [];
  const parsedRate = parseInteger(data.baseHourlyRates);

  if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
    missing.push("Base hourly rates");
  }
  if (!hasText(data.baseCurrency)) {
    missing.push("Base currency");
  }

  return missing;
};

export const getAvailabilityMissingFields = (
  data: Pick<ProfileOnboardingData, "dayTimes" | "selectedDays">
) => {
  const missing: string[] = [];
  if (!hasAvailability(data.dayTimes, data.selectedDays)) {
    missing.push("Availability");
  }
  return missing;
};

export const getBackendRequiredMissingFields = (data: ProfileOnboardingData) => {
  const all = [
    ...getGeneralMissingFields(data),
    ...getProfileMissingFields(data),
    ...getRatesMissingFields(data),
    ...getAvailabilityMissingFields(data),
  ];

  return Array.from(new Set(all));
};

export const formatMissingFields = (missingFields: string[]) => {
  if (missingFields.length === 0) return "";
  if (missingFields.length === 1) return missingFields[0];
  if (missingFields.length === 2) {
    return `${missingFields[0]} and ${missingFields[1]}`;
  }
  return `${missingFields.slice(0, -1).join(", ")}, and ${missingFields.at(-1)}`;
};

export const buildMissingFieldsMessage = (missingFields: string[]) => {
  const list = formatMissingFields(missingFields);
  return `Please complete ${list} before continuing.`;
};
