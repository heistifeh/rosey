import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const entityType = url.searchParams.get("entity_type") ?? "";
  const perPage = 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("admin_audit_log")
    .select("id,admin_id,admin_email,action,entity_type,entity_id,metadata,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (entityType) {
    query = query.eq("entity_type", entityType);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ logs: data ?? [], total: count ?? 0 });
}
