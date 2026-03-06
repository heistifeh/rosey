import { NextResponse } from "next/server";
import { verifyAdmin, logAdminAction } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPage = 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("profiles")
    .select(
      "id,user_id,working_name,username,city,country,approval_status,is_fully_verified,is_active,claim_status,profile_type,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `working_name.ilike.*${search}*,username.ilike.*${search}*,city.ilike.*${search}*`
    );
  }
  if (status) {
    query = query.eq("approval_status", status);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profiles: data ?? [], total: count ?? 0 });
}

export async function PATCH(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { admin, supabase } = result;

  const body = await req.json();
  const { profileId, updates } = body as {
    profileId: string;
    updates: Record<string, unknown>;
  };

  if (!profileId || !updates) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(supabase, {
    adminId: admin.id,
    adminEmail: admin.email,
    action: "profile_update",
    entityType: "profile",
    entityId: profileId,
    metadata: { updates },
  });

  return NextResponse.json({ ok: true });
}
