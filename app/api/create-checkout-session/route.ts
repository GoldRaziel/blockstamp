import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    // Errori espliciti e leggibili dal bottone
    if (!secret) {
      return NextResponse.json({ error: "Stripe: STRIPE_SECRET_KEY non impostata" }, { status: 500 });
    }
    if (!secret.startsWith("sk_live_")) {
      return NextResponse.json({ error: "Stripe è in TEST: imposta chiave LIVE su Netlify" }, { status: 500 });
    }
    if (!priceId) {
      return NextResponse.json({ error: "Stripe: STRIPE_PRICE_ID mancante" }, { status: 400 });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    const origin =
      req.headers.get("origin") ??
      process.env.DOMAIN_URL ??
      new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
        metadata: { bs_marker: "promo-enabled" },
        allow_promotion_codes: true,
      locale: "auto",
      billing_address_collection: "required",
      // payment_method_types opzionale su API recenti; rimuoverlo evita warning
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err?.message || err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
