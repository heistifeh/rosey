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
    return null;
  }
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
  const cookieValue = encodeURIComponent(JSON.stringify(data));
  // Default to 7 days if no expiry provided
  const maxAge = data.expires_in ? data.expires_in : 604800;
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
      console.log("Attaching auth token to request", token.substring(0, 10) + "...");
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
