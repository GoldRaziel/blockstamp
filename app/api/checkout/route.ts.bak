import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
  const origin = new URL(req.url).origin;

  // Imposta STRIPE_PRICE_ID nel tuo .env con il price corretto
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
    success_url: `${origin}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
  });

  return NextResponse.json({ url: session.url });
}
