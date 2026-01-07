import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const AUTH_COOKIE_KEY = "rosey-auth";

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const getAccessToken = (): string | null => {
  const raw = readCookie(AUTH_COOKIE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.access_token ?? null;
  } catch {
    return null;
  }
};

export const LOGINAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: SUPABASE_ANON_KEY
    ? {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    : undefined,
});

export const API = axios.create({
  baseURL: API_BASE_URL,
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Something went wrong");
    return Promise.reject(error);
  }
);
