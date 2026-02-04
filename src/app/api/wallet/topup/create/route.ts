import { NextResponse } from "next/server";
import {
  getCreditPackage,
  isValidPackageId,
} from "@/lib/wallet/packages";
import {
  createServiceRoleClient,
  getAccessTokenFromRequest,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

type CreateTopupBody = {
  packageId?: string;
};

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  try {
    const payload = (await req.json()) as CreateTopupBody | null;
    const packageId = payload?.packageId ?? "";

    if (!isValidPackageId(packageId)) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
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
    const buyerEmail = userData.user.email ?? undefined;

    const { data: existingWallet, error: walletError } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle<{ id: string }>();

    if (walletError) {
      return NextResponse.json({ error: "Wallet lookup failed" }, { status: 500 });
    }

    let walletId = existingWallet?.id ?? null;
    if (!walletId) {
      const { data: newWallet, error: createWalletError } = await supabase
        .from("wallets")
        .insert({ user_id: userId, balance_credits: 0 })
        .select("id")
        .maybeSingle<{ id: string }>();

      if (createWalletError || !newWallet?.id) {
        return NextResponse.json({ error: "Wallet creation failed" }, { status: 500 });
      }

      walletId = newWallet.id;
    }

    const required = [
      "BTCPAY_BASE_URL",
      "BTCPAY_STORE_ID",
      "BTCPAY_API_KEY",
    ] as const;
    const missing = required.filter(
      (key) => !process.env[key]?.trim()
    );
    if (missing.length > 0) {
      console.error("BTCPay config missing:", missing);
      return NextResponse.json(
        { error: "BTCPay configuration missing", missing },
        { status: 500 }
      );
    }

    const rawBaseUrl = process.env.BTCPAY_BASE_URL ?? "";
    const baseUrl = rawBaseUrl.replace(/\/$/, "");
    const storeId = process.env.BTCPAY_STORE_ID ?? "";
    const apiKey = process.env.BTCPAY_API_KEY ?? "";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      new URL(req.url).origin;

    const orderId = crypto.randomUUID();
    const invoicePayload = {
      amount: pkg.amount,
      currency: pkg.currency,
      metadata: {
        orderId,
        itemDesc: pkg.description,
        buyerEmail,
        userId,
        walletId,
        credits: pkg.credits,
        packageId,
      },
      checkout: {
        redirectURL: `${siteUrl}/dashboard/wallet?topup=return`,
        expirationMinutes: 30,
      },
    };

    const invoiceResponse = await fetch(
      `${baseUrl}/api/v1/stores/${storeId}/invoices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}`,
        },
        body: JSON.stringify(invoicePayload),
      }
    );

    if (!invoiceResponse.ok) {
      return NextResponse.json({ error: "BTCPay invoice creation failed" }, { status: 500 });
    }

    const invoice = (await invoiceResponse.json()) as {
      id?: string;
      url?: string;
      checkoutLink?: string;
      [key: string]: unknown;
    };

    const invoiceId = typeof invoice.id === "string" ? invoice.id : null;
    const checkoutUrl =
      (typeof invoice.checkoutLink === "string" && invoice.checkoutLink) ||
      (typeof invoice.url === "string" && invoice.url) ||
      (invoiceId ? `${baseUrl}/i/${invoiceId}` : null);

    if (!invoiceId || !checkoutUrl) {
      return NextResponse.json({ error: "Invalid invoice response" }, { status: 500 });
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const topupPayload = {
      user_id: userId,
      wallet_id: walletId,
      btcpay_store_id: storeId,
      btcpay_invoice_id: invoiceId,
      credits: pkg.credits,
      status: "pending",
      amount_fiat: pkg.amount,
      fiat_currency: pkg.currency,
      metadata: {
        packageId,
        credits: pkg.credits,
        btcpayInvoice: invoice,
        createdVia: "api/wallet/topup/create",
      },
    };

    const { error: insertError } = await supabase
      .from("wallet_topups")
      .insert(topupPayload);

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({
          checkoutUrl,
          expiresAt,
          invoiceId,
          storeId,
        });
      }
      return NextResponse.json({ error: "Topup creation failed" }, { status: 500 });
    }

    return NextResponse.json({
      checkoutUrl,
      expiresAt,
      invoiceId,
      storeId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
