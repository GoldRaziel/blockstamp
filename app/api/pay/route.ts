import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "";
    const priceId = process.env.STRIPE_PRICE_ID!;
    if (!priceId) {
      return NextResponse.json({ error: "STRIPE_PRICE_ID non configurato" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}#upload`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("PAY ERR", err);
    return NextResponse.json({ error: err?.message || "Errore creazione sessione Stripe" }, { status: 500 });
  }
}
