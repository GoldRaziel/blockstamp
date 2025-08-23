import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || null;
  const priceId = process.env.STRIPE_PRICE_ID || null;
  const key = process.env.STRIPE_SECRET_KEY || null;

  const maskedPrice = priceId ? (priceId.slice(0,6) + "..." + priceId.slice(-4)) : null;
  const keyMode = key?.startsWith("sk_test_") ? "test" : key?.startsWith("sk_live_") ? "live" : "unknown";

  return NextResponse.json({
    ok: true,
    baseUrl,
    priceIdMasked: maskedPrice,
    stripeKeyMode: keyMode
  });
}
