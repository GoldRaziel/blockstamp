import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

    // ✅ usa STRIPE_PRICE_ID o, in fallback, PRICE_ID
    const priceId = process.env.STRIPE_PRICE_ID || process.env.PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!priceId || !baseUrl) {
      return NextResponse.json(
        { error: "ENV mancante (STRIPE_PRICE_ID/PRICE_ID o NEXT_PUBLIC_BASE_URL)" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=1`,
    });

    // ✅ ritorna anche quale priceId è stato usato
    return NextResponse.json({ url: session.url, priceId }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "checkout error" }, { status: 500 });
  }
}
