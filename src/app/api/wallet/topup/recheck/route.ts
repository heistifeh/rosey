import { NextResponse } from "next/server";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

export async function GET(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("invoiceId")?.trim();

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
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

  const { data: topup, error: topupError } = await supabase
    .from("wallet_topups")
    .select("id,user_id,btcpay_store_id,status,credits")
    .eq("btcpay_invoice_id", invoiceId)
    .maybeSingle<{
      id: string;
      user_id: string;
      btcpay_store_id: string;
      status: string;
      credits: number;
    }>();

  if (topupError) {
    return NextResponse.json({ error: "Topup lookup failed" }, { status: 500 });
  }

  if (!topup || topup.user_id !== userId) {
    return NextResponse.json({ error: "Topup not found" }, { status: 404 });
  }

  const baseUrl = process.env.BTCPAY_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.BTCPAY_API_KEY;

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: "BTCPay configuration missing" },
      { status: 500 }
    );
  }

  const invoiceResponse = await fetch(
    `${baseUrl}/api/v1/stores/${topup.btcpay_store_id}/invoices/${invoiceId}`,
    {
      headers: {
        Authorization: `token ${apiKey}`,
      },
    }
  );

  if (!invoiceResponse.ok) {
    return NextResponse.json({ error: "Invoice lookup failed" }, { status: 500 });
  }

  const invoice = (await invoiceResponse.json()) as Record<string, unknown>;
  const invoiceStatus =
    (typeof invoice.status === "string" && invoice.status) || "";
  const invoiceAdditionalStatus =
    (typeof invoice.additionalStatus === "string" &&
      invoice.additionalStatus) ||
    "";
  const normalized = (
    invoiceAdditionalStatus ||
    invoiceStatus ||
    ""
  ).toLowerCase();

  const finalStatuses = ["settled", "confirmed", "complete", "completed"];
  if (!finalStatuses.includes(normalized)) {
    return NextResponse.json({
      ok: true,
      settled: false,
      status: normalized || "unknown",
    });
  }

  const { data: settleData, error: settleError } = await supabase.rpc(
    "settle_wallet_topup",
    {
      p_store_id: topup.btcpay_store_id,
      p_invoice_id: invoiceId,
      p_invoice_status: invoiceStatus || invoiceAdditionalStatus || normalized,
      p_invoice: invoice,
    }
  );

  if (settleError) {
    return NextResponse.json({ error: "Settlement failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    settled: true,
    status: normalized,
    rpc: settleData,
  });
}
