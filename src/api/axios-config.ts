import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

const DEFAULT_SUPABASE_URL = "https://axhkwqaxbnsguxzrfsfj.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const trimTrailingSlash = (value?: string) =>
  value ? value.replace(/\/$/, "") : null;

const baseFromAuth = (value?: string) =>
  value?.replace(/\/auth\/v1\/?$/, "");

const SUPABASE_URL =
  trimTrailingSlash(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  trimTrailingSlash(baseFromAuth(process.env.NEXT_PUBLIC_BASE_URL)) ||
  DEFAULT_SUPABASE_URL;

const SUPABASE_AUTH_URL = `${SUPABASE_URL}/auth/v1`;
const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;
const AUTH_COOKIE_KEY = "rosey-auth";

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const parseAuthCookie = () => {
  const raw = readCookie(AUTH_COOKIE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Clear corrupted/truncated auth cookie so the app can recover cleanly.
    if (typeof document !== "undefined") {
      document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
    }
    return null;
  }
};

const pickDefined = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

const compactUserMetadata = (metadata: any) => {
  if (!metadata || typeof metadata !== "object") return undefined;
  return pickDefined({
    role: metadata.role,
    onboarding_step: metadata.onboarding_step,
    email: metadata.email,
    name: metadata.name,
    full_name: metadata.full_name,
    profile_type: metadata.profile_type,
  });
};

const compactAppMetadata = (metadata: any) => {
  if (!metadata || typeof metadata !== "object") return undefined;
  return pickDefined({
    role: metadata.role,
    provider: metadata.provider,
    providers: Array.isArray(metadata.providers) ? metadata.providers : undefined,
  });
};

const compactUser = (user: any) => {
  if (!user || typeof user !== "object" || !user.id) return undefined;

  return pickDefined({
    id: user.id,
    email: user.email,
    role: user.role,
    aud: user.aud,
    user_metadata: compactUserMetadata(user.user_metadata),
    app_metadata: compactAppMetadata(user.app_metadata),
  });
};

const compactAuthPayload = (data: any) => {
  const current = parseAuthCookie() ?? {};
  const sourceUser = data?.user ?? (data?.id ? data : undefined);
  const compactedUser = compactUser(sourceUser) ?? current.user;

  const compacted = pickDefined({
    access_token: data?.access_token ?? current.access_token,
    refresh_token: data?.refresh_token ?? current.refresh_token,
    token_type: data?.token_type ?? current.token_type,
    expires_in: data?.expires_in ?? current.expires_in,
    expires_at: data?.expires_at ?? current.expires_at,
    user: compactedUser,
  });

  return compacted;
};

export const getAccessToken = (): string | null => {
  const parsed = parseAuthCookie();
  return parsed?.access_token ?? null;
};

export const getUserId = (): string | null => {
  const parsed = parseAuthCookie();
  return parsed?.user?.id ?? null;
};

export const getStoredUser = () => {
  const parsed = parseAuthCookie();
  return parsed?.user ?? null;
};

export const getAuthData = () => parseAuthCookie();

export const setAuthCookie = (data: any) => {
  if (typeof document === "undefined") return;
  const compactPayload = compactAuthPayload(data);
  const cookieValue = encodeURIComponent(JSON.stringify(compactPayload));
  // Default to 7 days if no expiry provided
  const maxAge = compactPayload.expires_in ? compactPayload.expires_in : 604800;
  document.cookie = `${AUTH_COOKIE_KEY}=${cookieValue}; path=/; max-age=${maxAge}; samesite=lax`;
};

export const clearAuthCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
};

export const LOGINAPI = axios.create({
  baseURL: SUPABASE_AUTH_URL,
  headers: SUPABASE_ANON_KEY
    ? {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    }
    : undefined,
});

export const API = axios.create({
  baseURL: SUPABASE_REST_URL,
  headers: SUPABASE_ANON_KEY
    ? {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    }
    : undefined,
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      // Ensure we don't send duplicate headers by removing any defaults
      delete config.headers.Authorization;
      delete config.headers.authorization;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Something went wrong");
    return Promise.reject(error);
  }
);

// Add interceptor to LOGINAPI as well for authenticated auth requests
LOGINAPI.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = typeof config.url === "string" ? config.url : "";
    const isTokenGrantRequest = url.startsWith("/token?grant_type=");
    const token = getAccessToken();
    if (token && !isTokenGrantRequest) {
      // Ensure we don't send duplicate headers by removing any defaults
      delete config.headers.Authorization;
      delete config.headers.authorization;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Something went wrong");
    return Promise.reject(error);
  }
);
