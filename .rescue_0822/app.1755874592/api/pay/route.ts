import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { amount = 500, currency = "eur", description = "Blockstamp Protection" } = await req.json().catch(() => ({}));

    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });

    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" } as any);

    const headers = new Headers(req.headers);
    const envBase =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://melodious-starburst-f335b3.netlify.app"; // fallback
    const origin = headers.get("origin") || envBase;
    const base = origin.replace(/\/+$/, ""); // rimuove slash finali

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${base}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/pay/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "pay error" }, { status: 500 });
  }
}
