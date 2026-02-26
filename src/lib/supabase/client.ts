import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const trimTrailingSlash = (value?: string) => value?.replace(/\/$/, "");

const baseFromAuth = (value?: string) =>
  value?.replace(/\/auth\/v1\/?$/, "");

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url =
    trimTrailingSlash(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    trimTrailingSlash(baseFromAuth(process.env.NEXT_PUBLIC_BASE_URL));
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("SUPABASE_CLIENT_CONFIG_MISSING");
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
    },
  });

  return browserClient;
}
