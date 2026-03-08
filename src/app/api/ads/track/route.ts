import { NextResponse } from "next/server";
import {
  createServiceRoleClient,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let body: { adId?: string; event?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { adId, event } = body;
  if (!adId || !["impression", "click"].includes(event ?? "")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("ad_daily_stats")
    .select("id, impressions, clicks")
    .eq("ad_id", adId)
    .eq("day", today)
    .maybeSingle<{ id: string; impressions: number; clicks: number }>();

  if (existing) {
    await supabase
      .from("ad_daily_stats")
      .update({
        impressions: existing.impressions + (event === "impression" ? 1 : 0),
        clicks: existing.clicks + (event === "click" ? 1 : 0),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("ad_daily_stats").insert({
      ad_id: adId,
      day: today,
      impressions: event === "impression" ? 1 : 0,
      clicks: event === "click" ? 1 : 0,
    });
  }

  return NextResponse.json({ ok: true });
}
