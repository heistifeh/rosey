import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
export const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://axhkwqaxbnsguxzrfsfj.supabase.co";

const getCookieValue = (cookieHeader: string | null, name: string) => {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const segment = parts.find((part) => part.startsWith(`${name}=`));
  return segment ? segment.split("=")[1] ?? null : null;
};

export function createServiceRoleClient(): SupabaseClient {
  if (!SERVICE_ROLE_KEY) {
    throw new Error("SERVICE_ROLE_KEY_MISSING");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export function getAccessTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  const raw = getCookieValue(cookieHeader, "rosey-auth");
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (parsed?.access_token) {
        return parsed.access_token;
      }
    } catch {
      // fall through and check Authorization header
    }
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return null;
}
