"use server";

import { NextResponse } from "next/server";
import { createNotification } from "@/server/notifications";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

const CITY_COST = 15;
const LOW_BALANCE_THRESHOLD = 50;

type PlaceAdBody = {
  title: string;
  placement_available_now: boolean;
  cities: {
    country_slug: string;
    state_slug: string | null;
    city_slug: string;
  }[];
};

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { ok: false, error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const payload: PlaceAdBody = await req.json();
    if (
      !payload ||
      typeof payload.title !== "string" ||
      typeof payload.placement_available_now !== "boolean" ||
      !Array.isArray(payload.cities)
    ) {
      return NextResponse.json({ ok: false, error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const accessToken = getAccessTokenFromRequest(req);
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);
    if (userError || !user?.id) {
      return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const userId = user.id;
    const cities = payload.cities;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (profileError || !profile?.id) {
      return NextResponse.json({ ok: false, error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id,balance_credits")
      .eq("user_id", userId)
      .maybeSingle();
    if (walletError || !wallet?.id) {
      return NextResponse.json({ ok: false, error: "WALLET_NOT_FOUND" }, { status: 404 });
    }

    const creditsNeeded = payload.cities.length * CITY_COST;
    if (wallet.balance_credits < creditsNeeded) {
      return NextResponse.json(
        {
          ok: false,
          error: "NOT_ENOUGH_CREDITS",
          required: creditsNeeded,
          available: wallet.balance_credits,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const durationDays = 30;
    const end = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const { data: ad, error: adError } = await supabase
      .from("ads")
      .insert({
        profile_id: profile.id,
        title: payload.title,
        status: "active",
        placement_available_now: payload.placement_available_now,
        budget_credits: creditsNeeded,
        spent_credits: 0,
        start_at: now.toISOString(),
        end_at: end.toISOString(),
      })
      .select("*")
      .single();
    if (adError || !ad?.id) {
      return NextResponse.json({ ok: false, error: "AD_CREATE_FAILED" }, { status: 500 });
    }

    const targets = payload.cities.map((city) => ({
      ad_id: ad.id,
      country_slug: city.country_slug,
      state_slug: city.state_slug,
      city_slug: city.city_slug,
    }));

    const { error: targetsError } = await supabase
      .from("ad_city_targets")
      .insert(targets);
    if (targetsError) {
      return NextResponse.json({ ok: false, error: "CITY_TARGETS_FAILED" }, { status: 500 });
    }

    const updatedBalance = wallet.balance_credits - creditsNeeded;
    const { data: updatedWallet, error: walletUpdateError } = await supabase
      .from("wallets")
      .update({ balance_credits: updatedBalance })
      .eq("id", wallet.id)
      .select("balance_credits")
      .maybeSingle();
    if (walletUpdateError || !updatedWallet) {
      return NextResponse.json({ ok: false, error: "WALLET_UPDATE_FAILED" }, { status: 500 });
    }

    const { error: transactionError } = await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      type: "ad_spend",
      direction: "debit",
      amount: creditsNeeded,
      reference: `ad:${ad.id}`,
      metadata: { ad_id: ad.id },
    });
    if (transactionError) {
      return NextResponse.json({ ok: false, error: "TRANSACTION_FAILED" }, { status: 500 });
    }

    await createNotification(supabase, {
      user_id: user.id,
      type: "ad_created",
      title: "Ad created",
      body: `Your ad "${ad.title}" is now live in ${cities.length} cities.`,
      data: {
        ad_id: ad.id,
        title: ad.title,
        city_count: cities.length,
      },
    });

    const updatedWalletBalance = updatedWallet.balance_credits ?? 0;
    if (updatedWalletBalance < LOW_BALANCE_THRESHOLD) {
      await createNotification(supabase, {
        user_id: user.id,
        type: "low_balance",
        title: "Your credits are running low",
        body: `Your wallet balance is down to ${updatedWalletBalance} credits. Top up to keep your ads running.`,
        data: {
          balance: updatedWalletBalance,
        },
      });
    }

    return NextResponse.json(
      { ok: true, ad, wallet: { balance_credits: updatedWallet.balance_credits } },
      { status: 200 }
    );
  } catch (error) {
    console.error("place ad error", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
