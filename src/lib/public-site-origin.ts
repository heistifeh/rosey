const DEFAULT_PUBLIC_SITE_ORIGIN = "https://rosey.link";

const normalizeOrigin = (value?: string | null) =>
  value?.trim().replace(/\/$/, "") ?? "";

const isLocalOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

export const getPublicSiteOrigin = () => {
  const configured = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const currentOrigin = normalizeOrigin(window.location.origin);

    if (process.env.NODE_ENV === "development") {
      return currentOrigin;
    }

    if (currentOrigin && !isLocalOrigin(currentOrigin)) {
      return currentOrigin;
    }
  }

  return DEFAULT_PUBLIC_SITE_ORIGIN;
};
