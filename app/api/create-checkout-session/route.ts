import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL || process.env.DOMAIN_URL ?? new URL(req.url).origin;

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
      success_url: `${origin}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      locale: "auto",
      billing_address_collection: "required",
      allow_promotion_codes: false,
      payment_method_types: ["card"],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
