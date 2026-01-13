"use server";

import { NextResponse } from "next/server";
import { createNotification } from "@/server/notifications";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

type AdStatusPayload = {
  adId?: string;
  ad_id?: string;
  status?: string;
};

const VALID_STATUSES = ["paused", "active"] as const;

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { ok: false, error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const payload: AdStatusPayload = await req.json();
    const adId = payload.adId ?? payload.ad_id;
    const status = payload.status as typeof VALID_STATUSES[number];

    if (!adId || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "INVALID_PAYLOAD" },
        { status: 400 }
      );
    }

    const accessToken = getAccessTokenFromRequest(req);
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    if (userError || !userData?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("id,title,status,profile_id,profiles!inner(user_id)")
      .eq("id", adId)
      .maybeSingle();

    if (adError || !ad) {
      return NextResponse.json(
        { ok: false, error: "AD_NOT_FOUND" },
        { status: 404 }
      );
    }

    const ownerId = ad.profiles?.user_id;
    if (!ownerId || ownerId !== userId) {
      return NextResponse.json(
        { ok: false, error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const { data: updatedAd, error: updateError } = await supabase
      .from("ads")
      .update({ status })
      .eq("id", adId)
      .select("id,title,status,profile_id")
      .single();

    if (updateError || !updatedAd) {
      return NextResponse.json(
        { ok: false, error: "AD_UPDATE_FAILED" },
        { status: 500 }
      );
    }

    const notification =
      status === "paused"
        ? {
            user_id: ownerId,
            type: "ad_paused",
            title: "Ad paused",
            body: `Your ad "${updatedAd.title}" has been paused.`,
            data: { ad_id: adId, status: "paused" },
          }
        : {
            user_id: ownerId,
            type: "ad_resumed",
            title: "Ad resumed",
            body: `Your ad "${updatedAd.title}" is active again.`,
            data: { ad_id: adId, status: "active" },
          };

    await createNotification(supabase, notification);

    return NextResponse.json({ ok: true, ad: updatedAd }, { status: 200 });
  } catch (error) {
    console.error("[api/ads/status] error", error);
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
