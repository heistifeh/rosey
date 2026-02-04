import { NextResponse } from "next/server";
import {
  getCreditPackage,
  isValidPackageId,
} from "@/lib/wallet/packages";

type CreateTopupBody = {
  packageId?: string;
};

export async function POST(req: Request) {
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

    void pkg;
    return NextResponse.json({ checkoutUrl: "https://example.com/checkout" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
