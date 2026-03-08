import { NextResponse } from "next/server";
import { verifyAdmin, logAdminAction } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") ?? "pending"; // pending | all
  const search = url.searchParams.get("search") ?? "";

  let query = supabase
    .from("profiles")
    .select(
      "id,working_name,username,city,country,approval_status,id_verified,verification_photo_verified,min_photos_verified,profile_fields_verified,is_fully_verified,verified_at,verification_notes,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter === "pending") {
    query = query
      .eq("is_fully_verified", false)
      .not("user_id", "is", null)
      .neq("approval_status", "rejected");
  }

  if (search) {
    if (search.includes("@")) {
      // Email search — look up matching auth users then filter by their user_ids
      const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const matchingIds = (usersData?.users ?? [])
        .filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()))
        .map((u) => u.id);

      if (matchingIds.length === 0) {
        return NextResponse.json({ verifications: [] });
      }
      query = query.in("user_id", matchingIds);
    } else {
      query = query.or(
        `working_name.ilike.%${search}%,username.ilike.%${search}%,city.ilike.%${search}%`
      );
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ verifications: data ?? [] });
}

export async function POST(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { admin, supabase } = result;

  const body = await req.json();
  const { profileId, action, notes } = body as {
    profileId: string;
    action: "approve" | "reject";
    notes?: string;
  };

  if (!profileId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updates =
    action === "approve"
      ? {
          is_fully_verified: true,
          verified_at: new Date().toISOString(),
          approval_status: "approved",
          verification_notes: notes ?? null,
        }
      : {
          is_fully_verified: false,
          approval_status: "rejected",
          verification_notes: notes ?? "Rejected by admin",
        };

  const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(supabase, {
    adminId: admin.id,
    adminEmail: admin.email,
    action: `verification_${action}`,
    entityType: "profile",
    entityId: profileId,
    metadata: { notes },
  });

  return NextResponse.json({ ok: true });
}
