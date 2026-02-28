"use server";

import { NextResponse } from "next/server";
import { createNotification } from "@/server/notifications";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

const VERIFICATION_FEE_CREDITS = 500;

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { ok: false, error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 },
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const accessToken = getAccessTokenFromRequest(req);
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);
    if (userError || !user?.id) {
      return NextResponse.json(
        { ok: false, error: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }

    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,is_fully_verified")
      .eq("user_id", userId)
      .maybeSingle<{ id: string; is_fully_verified: boolean | null }>();
    if (profileError || !profile?.id) {
      return NextResponse.json(
        { ok: false, error: "PROFILE_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (profile.is_fully_verified) {
      return NextResponse.json(
        { ok: false, error: "ALREADY_VERIFIED" },
        { status: 400 },
      );
    }

    let walletId: string | null = null;
    let currentBalance = 0;

    const { data: existingWallet, error: walletError } = await supabase
      .from("wallets")
      .select("id,balance_credits")
      .eq("user_id", userId)
      .maybeSingle<{ id: string; balance_credits: number }>();
    if (walletError) {
      return NextResponse.json(
        { ok: false, error: "WALLET_LOOKUP_FAILED" },
        { status: 500 },
      );
    }

    if (existingWallet?.id) {
      walletId = existingWallet.id;
      currentBalance = existingWallet.balance_credits ?? 0;
    } else {
      const { data: newWallet, error: createWalletError } = await supabase
        .from("wallets")
        .insert({ user_id: userId, balance_credits: 0 })
        .select("id,balance_credits")
        .maybeSingle<{ id: string; balance_credits: number }>();
      if (createWalletError || !newWallet?.id) {
        return NextResponse.json(
          { ok: false, error: "WALLET_CREATE_FAILED" },
          { status: 500 },
        );
      }
      walletId = newWallet.id;
      currentBalance = newWallet.balance_credits ?? 0;
    }

    const reference = `verification:${profile.id}`;
    const { data: existingPayment, error: existingPaymentError } = await supabase
      .from("wallet_transactions")
      .select("id")
      .eq("wallet_id", walletId)
      .eq("reference", reference)
      .eq("direction", "debit")
      .limit(1)
      .maybeSingle<{ id: string }>();

    if (existingPaymentError) {
      return NextResponse.json(
        { ok: false, error: "PAYMENT_LOOKUP_FAILED" },
        { status: 500 },
      );
    }

    if (existingPayment?.id) {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        wallet: { id: walletId, balance_credits: currentBalance },
      });
    }

    if (currentBalance < VERIFICATION_FEE_CREDITS) {
      return NextResponse.json(
        {
          ok: false,
          error: "NOT_ENOUGH_CREDITS",
          required: VERIFICATION_FEE_CREDITS,
          available: currentBalance,
        },
        { status: 400 },
      );
    }

    const updatedBalance = currentBalance - VERIFICATION_FEE_CREDITS;
    const { data: updatedWallet, error: walletUpdateError } = await supabase
      .from("wallets")
      .update({ balance_credits: updatedBalance })
      .eq("id", walletId)
      .select("id,balance_credits")
      .maybeSingle<{ id: string; balance_credits: number }>();
    if (walletUpdateError || !updatedWallet?.id) {
      return NextResponse.json(
        { ok: false, error: "WALLET_UPDATE_FAILED" },
        { status: 500 },
      );
    }

    const { error: transactionError } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: walletId,
        type: "adjustment",
        direction: "debit",
        amount: VERIFICATION_FEE_CREDITS,
        reference,
        metadata: {
          kind: "verification_fee",
          profile_id: profile.id,
        },
      });
    if (transactionError) {
      return NextResponse.json(
        { ok: false, error: "TRANSACTION_FAILED" },
        { status: 500 },
      );
    }

    await createNotification(supabase, {
      user_id: userId,
      type: "verification_fee_paid",
      title: "Verification fee paid",
      body: `We received your verification payment of ${VERIFICATION_FEE_CREDITS} credits.`,
      data: {
        amount: VERIFICATION_FEE_CREDITS,
        balance_credits: updatedWallet.balance_credits ?? updatedBalance,
        profile_id: profile.id,
      },
    });

    return NextResponse.json({
      ok: true,
      deducted: VERIFICATION_FEE_CREDITS,
      wallet: {
        id: updatedWallet.id,
        balance_credits: updatedWallet.balance_credits ?? updatedBalance,
      },
    });
  } catch (error) {
    console.error("verification pay error", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

