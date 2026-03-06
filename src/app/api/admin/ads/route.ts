import { NextResponse } from "next/server";
import { verifyAdmin, logAdminAction } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPage = 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("ads")
    .select(
      "id,title,status,budget_credits,spent_credits,placement_available_now,created_at,profile:profiles(id,working_name,username)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ads: data ?? [], total: count ?? 0 });
}

export async function POST(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { admin, supabase } = result;

  const body = await req.json();
  const { adId, status } = body as { adId: string; status: "active" | "paused" | "expired" };

  if (!adId || !["active", "paused", "expired"].includes(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("ads").update({ status }).eq("id", adId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(supabase, {
    adminId: admin.id,
    adminEmail: admin.email,
    action: "ad_status_change",
    entityType: "ad",
    entityId: adId,
    metadata: { status },
  });

  return NextResponse.json({ ok: true });
}
