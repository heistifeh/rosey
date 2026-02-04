import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  createServiceRoleClient,
  SERVICE_ROLE_KEY,
} from "@/server/supabase-client";

const SIGNATURE_HEADERS = [
  "btcpay-sig",
  "BTCPay-Sig",
  "Btcpay-Sig",
  "BTCPay-Signature",
];

type WebhookPayload = Record<string, unknown>;

const getHeaderSignature = (headers: Headers) => {
  for (const name of SIGNATURE_HEADERS) {
    const value = headers.get(name);
    if (value) return value;
  }
  return null;
};

const normalizeSignature = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(",");
  for (const part of parts) {
    const candidate = part.trim();
    if (!candidate) continue;
    if (candidate.includes("=")) {
      const [key, sig] = candidate.split("=");
      if (key.trim().toLowerCase().endsWith("sha256") && sig) {
        return sig.trim();
      }
    } else {
      return candidate;
    }
  }
  return trimmed;
};

const isValidSignature = (rawBody: string, signature: string, secret: string) => {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = normalizeSignature(signature);
  if (!received || received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
};

const extractId = (payload: WebhookPayload, keys: string[]) => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value) return value;
  }

  const data = payload.data as WebhookPayload | undefined;
  if (data) {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === "string" && value) return value;
    }
  }

  return null;
};

const getNestedId = (payload: WebhookPayload, path: string[]) => {
  let current: unknown = payload;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as WebhookPayload)[key];
  }
  return typeof current === "string" && current ? current : null;
};

const shouldDebug =
  process.env.BTCPAY_WEBHOOK_DEBUG === "true" ||
  process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SERVICE_ROLE_KEY_MISSING" },
      { status: 500 }
    );
  }

  const secret = process.env.BTCPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "BTCPay webhook secret missing" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = getHeaderSignature(req.headers);
  if (!signature || !isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const invoiceId =
    extractId(payload, ["invoiceId", "invoice_id", "id"]) ||
    getNestedId(payload, ["invoice", "id"]) ||
    "";
  const storeId =
    extractId(payload, ["storeId", "store_id", "storeID"]) ||
    getNestedId(payload, ["store", "id"]) ||
    getNestedId(payload, ["invoice", "storeId"]) ||
    "";
  const eventType =
    extractId(payload, ["type", "eventType"]) ||
    getNestedId(payload, ["event", "type"]) ||
    "";

  if (shouldDebug) {
    console.log("[btcpay-webhook] payload ids", {
      invoiceId,
      storeId,
      eventType,
    });
  }

  if (!storeId || !invoiceId) {
    return NextResponse.json({ ok: true });
  }

  const baseUrl = process.env.BTCPAY_BASE_URL;
  const apiKey = process.env.BTCPAY_API_KEY;

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: "BTCPay configuration missing" },
      { status: 500 }
    );
  }

  const invoiceResponse = await fetch(
    `${baseUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`,
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
  const additionalNormalized = invoiceAdditionalStatus.toLowerCase();
  const hasMeaningfulAdditional =
    additionalNormalized !== "" && additionalNormalized !== "none";
  const statusRaw =
    (hasMeaningfulAdditional ? invoiceAdditionalStatus : "") ||
    invoiceStatus ||
    (typeof invoice.state === "string" && invoice.state) ||
    eventType ||
    "";
  const normalized = statusRaw.toLowerCase();

  if (shouldDebug) {
    console.log("[btcpay-webhook] invoice status", {
      invoiceStatus,
      invoiceAdditionalStatus,
      normalized,
    });
  }

  const settleStatuses = [
    "settled",
    "confirmed",
    "complete",
    "completed",
    "paidinfull",
    "paid",
  ];
  const settleEvents = [
    "invoice_paymentsettled",
    "invoice_confirmed",
    "invoice_completed",
    "invoice_paidinfull",
    "invoicesettled",
  ];

  const normalizedEventType = eventType.toLowerCase();
  const shouldSettle =
    settleStatuses.some((status) => normalized.includes(status)) ||
    settleEvents.includes(normalizedEventType);

  if (!shouldSettle) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceRoleClient();
  const { data: settleData, error: settleError } = await supabase.rpc(
    "settle_wallet_topup",
    {
      p_store_id: storeId,
      p_invoice_id: invoiceId,
      p_invoice_status: invoiceStatus || invoiceAdditionalStatus || normalized,
      p_invoice: invoice,
    }
  );

  if (settleError) {
    if (shouldDebug) {
      console.error("[btcpay-webhook] rpc error", settleError);
    }
    return NextResponse.json({ error: "Settlement failed" }, { status: 500 });
  }

  const result = settleData as { ok?: boolean; reason?: string } | null;
  if (shouldDebug) {
    console.log("[btcpay-webhook] rpc result", result);
  }
  if (result?.reason === "topup_not_found") {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
