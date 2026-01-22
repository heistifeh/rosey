"use server";

import { SupabaseClient } from "@supabase/supabase-js";

export type NotificationParams = {
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export async function createNotification(
  supabase: SupabaseClient,
  params: NotificationParams
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: params.user_id,
    type: params.type,
    title: params.title,
    body: params.body,
    data: params.data ?? null,
    is_read: false,
  });

  if (error) {
    console.error("[notifications] insert error:", error);
  }
}

// TODO: Schedule a daily job that calls these helpers.
export async function notifyAdExpiringSoon(_supabase: SupabaseClient) {
  void _supabase;
  // TODO: Query ads whose end_at is within the next 3 days and generate
  //       `ad_expiring_soon` notifications for their owners using
  //       `createNotification`.
}

export async function notifyAdExpired(_supabase: SupabaseClient) {
  void _supabase;
  // TODO: Query ads whose end_at is in the past and whose status is still
  //       active, then mark them expired and insert `ad_expired`
  //       notifications via `createNotification`.
}

export async function notifyWalletToppedUp(
  supabase: SupabaseClient,
  params: {
    user_id: string;
    amount: number;
    new_balance: number;
  }
) {
  // TODO: Call this helper from the wallet top-up webhook once it's wired
  //       to credit balances and insert `wallet_transactions` entries.
  await createNotification(supabase, {
    user_id: params.user_id,
    type: "wallet_topped_up",
    title: "Wallet topped up",
    body: `Your wallet has been credited with ${params.amount} credits. New balance: ${params.new_balance} credits.`,
    data: {
      amount: params.amount,
      new_balance: params.new_balance,
    },
  });
}
