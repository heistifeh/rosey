export const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_KEY = "rosey_locale";
export const LOCALE_STORAGE_KEY = "rosey_locale";

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === "string" &&
  SUPPORTED_LOCALES.includes(value as Locale);
