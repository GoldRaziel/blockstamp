import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
  const origin = new URL(req.url).origin;

  // Imposta STRIPE_PRICE_ID nel tuo .env con il price corretto
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { bs_route: "app/api/checkout/route.ts", promo_on: "true" },
    allow_promotion_codes: true,
    line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
    success_url: `${origin}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
        // Enable promo codes
  });

  console.log("CHKOUT_SESSION_CREATED", session.id); return NextResponse.json({ url: session.url });
}
