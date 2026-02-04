import { NextResponse } from "next/server";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActivityItem = {
  id: string;
  source: "transaction" | "topup";
  type: "topup" | "ad_spend" | "refund" | "adjustment";
  direction: "credit" | "debit";
  amount: number;
  status?: "pending" | "settled";
  reference?: string;
  created_at: string;
};

export async function GET(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(
    accessToken
  );

  if (userError || !userData?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("id,balance_credits")
    .eq("user_id", userId)
    .maybeSingle<{ id: string; balance_credits: number }>();

  if (walletError || !wallet?.id) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  const walletId = wallet.id;

  const { data: transactions, error: txError } = await supabase
    .from("wallet_transactions")
    .select("id,type,direction,amount,reference,created_at")
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (txError) {
    return NextResponse.json({ error: "Transactions lookup failed" }, { status: 500 });
  }

  const { data: topups, error: topupError } = await supabase
    .from("wallet_topups")
    .select("id,credits,status,btcpay_invoice_id,created_at")
    .eq("wallet_id", walletId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(20);

  if (topupError) {
    return NextResponse.json({ error: "Topups lookup failed" }, { status: 500 });
  }

  const txItems: ActivityItem[] = (transactions ?? []).map((row) => ({
    id: row.id,
    source: "transaction",
    type: row.type,
    direction: row.direction,
    amount: row.amount,
    status: "settled",
    reference: row.reference ?? undefined,
    created_at: row.created_at,
  }));

  const settledTopupRefs = new Set(
    txItems
      .filter((row) => row.type === "topup" && row.reference)
      .map((row) => row.reference as string)
  );

  const topupItems: ActivityItem[] = (topups ?? [])
    .filter((row) => !settledTopupRefs.has(row.btcpay_invoice_id))
    .map((row) => ({
      id: row.id,
      source: "topup",
      type: "topup",
      direction: "credit",
      amount: row.credits,
      status: "pending",
      reference: row.btcpay_invoice_id,
      created_at: row.created_at,
    }));

  const activity = [...txItems, ...topupItems].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );

  return NextResponse.json({
    wallet: {
      id: wallet.id,
      balance_credits: wallet.balance_credits ?? 0,
    },
    activity,
  });
}
