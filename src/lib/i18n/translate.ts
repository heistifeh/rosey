import { DEFAULT_LOCALE, type Locale } from "./config";
import { messages } from "./messages";

export type TranslationValues = Record<string, string | number>;

const resolvePath = (source: unknown, path: string): string | undefined => {
  if (!source || typeof source !== "object") return undefined;

  const value = path
    .split(".")
    .reduce<unknown>((accumulator, segment) => {
      if (!accumulator || typeof accumulator !== "object") return undefined;
      return (accumulator as Record<string, unknown>)[segment];
    }, source);

  return typeof value === "string" ? value : undefined;
};

const interpolate = (template: string, values?: TranslationValues) => {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`,
  );
};

export const translate = (
  locale: Locale,
  key: string,
  values?: TranslationValues,
) => {
  const localeMessages = messages[locale] ?? messages[DEFAULT_LOCALE];
  const fallbackMessages = messages[DEFAULT_LOCALE];

  const localized =
    resolvePath(localeMessages, key) ??
    resolvePath(fallbackMessages, key) ??
    key;

  return interpolate(localized, values);
};
