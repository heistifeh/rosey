import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
} from "@/server/supabase-client";

async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("rosey-auth")?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function verifyAdmin(req: Request): Promise<
  | { admin: { id: string; email?: string }; supabase: SupabaseClient; error?: never }
  | { error: NextResponse; admin?: never; supabase?: never }
> {
  const supabase = createServiceRoleClient();

  // Try Authorization header first, then fall back to next/headers cookies
  const token = getAccessTokenFromRequest(req) ?? (await getTokenFromCookies());

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const role = data.user.user_metadata?.role;
  if (role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { admin: { id: data.user.id, email: data.user.email }, supabase };
}

export async function logAdminAction(
  supabase: SupabaseClient,
  params: {
    adminId: string;
    adminEmail?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
) {
  await supabase.from("admin_audit_log").insert({
    admin_id: params.adminId,
    admin_email: params.adminEmail,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    metadata: params.metadata ?? null,
  });
}
