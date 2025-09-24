import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Verifica stato di una Checkout Session esistente
export async function GET(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "STRIPE_SECRET_KEY missing" }, { status: 500 });

    const sessionId = new URL(req.url).searchParams.get("session_id");
    if (!sessionId) return NextResponse.json({ error: "session_id missing" }, { status: 400 });

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const s = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      s.payment_status === "paid" ||
      s.payment_status === "no_payment_required" ||
      s.status === "complete";

    return NextResponse.json({
      id: s.id,
      status: s.status,
      payment_status: s.payment_status,
      paid,
      amount_total: s.amount_total,
      currency: s.currency,
      mode: s.mode,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "stripe_session_lookup_failed" }, { status: 500 });
  }
}
