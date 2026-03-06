import { NextResponse } from "next/server";
import { verifyAdmin, logAdminAction } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { supabase } = result;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPage = 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("wallets")
    .select("id,user_id,balance_credits,created_at", { count: "exact" })
    .order("balance_credits", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.ilike("user_id", `*${search}*`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with auth user emails via a single listUsers call
  const wallets = data ?? [];
  const emailMap: Record<string, string> = {};

  if (wallets.length > 0) {
    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    for (const u of usersData?.users ?? []) {
      if (u.email) emailMap[u.id] = u.email;
    }
  }

  const enriched = wallets.map((w) => ({
    ...w,
    user_email: emailMap[w.user_id] ?? null,
  }));

  return NextResponse.json({ wallets: enriched, total: count ?? 0 });
}

export async function POST(req: Request) {
  const result = await verifyAdmin(req);
  if (result.error) return result.error;
  const { admin, supabase } = result;

  const body = await req.json();
  const { walletId, amount, note } = body as {
    walletId: string;
    amount: number;
    note?: string;
  };

  if (!walletId || typeof amount !== "number" || amount === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Fetch current balance
  const { data: wallet, error: fetchError } = await supabase
    .from("wallets")
    .select("id,balance_credits")
    .eq("id", walletId)
    .maybeSingle<{ id: string; balance_credits: number }>();

  if (fetchError || !wallet) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  const newBalance = (wallet.balance_credits ?? 0) + amount;
  if (newBalance < 0) {
    return NextResponse.json({ error: "Balance cannot go negative" }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("wallets")
    .update({ balance_credits: newBalance })
    .eq("id", walletId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Record transaction
  await supabase.from("wallet_transactions").insert({
    wallet_id: walletId,
    type: "adjustment",
    direction: amount > 0 ? "credit" : "debit",
    amount: Math.abs(amount),
    reference: note ?? null,
  });

  await logAdminAction(supabase, {
    adminId: admin.id,
    adminEmail: admin.email,
    action: "wallet_adjustment",
    entityType: "wallet",
    entityId: walletId,
    metadata: { amount, note, new_balance: newBalance },
  });

  return NextResponse.json({ ok: true, new_balance: newBalance });
}
