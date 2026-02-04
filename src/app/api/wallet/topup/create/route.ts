import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({ checkoutUrl: "https://example.com/checkout" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
