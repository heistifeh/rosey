import { NextResponse } from "next/server";
import { verifyAdmin, logAdminAction } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPage = 50;

  if (search) {
    // Supabase admin API has no native email search — fetch broadly and filter
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const filtered = data.users.filter((u) =>
      u.email?.toLowerCase().includes(search)
    );
    return NextResponse.json({ users: filtered, total: filtered.length });
  }

  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data.users, total: data.total ?? data.users.length });
}

export async function POST(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { admin, supabase } = result;

  const body = await req.json();
  const { userId, action } = body as { userId: string; action: "disable" | "enable" };

  if (!userId || !["disable", "enable"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (action === "disable") {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "876600h",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Sync profile is_active = false
    await supabase.from("profiles").update({ is_active: false }).eq("user_id", userId);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "none",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Sync profile is_active = true
    await supabase.from("profiles").update({ is_active: true }).eq("user_id", userId);
  }

  await logAdminAction(supabase, {
    adminId: admin.id,
    adminEmail: admin.email,
    action: `user_${action}`,
    entityType: "user",
    entityId: userId,
  });

  return NextResponse.json({ ok: true });
}
