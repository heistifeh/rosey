import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, isSupportedLocale } from "./config";
import { translate, type TranslationValues } from "./translate";

export const getServerLocale = async () => {
  const cookieStore = await cookies();
  const candidate = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  return isSupportedLocale(candidate) ? candidate : DEFAULT_LOCALE;
};

export const getServerTranslator = async () => {
  const locale = await getServerLocale();
  return {
    locale,
    t: (key: string, values?: TranslationValues) =>
      translate(locale, key, values),
  };
};
