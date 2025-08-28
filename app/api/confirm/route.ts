import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  if (!session_id) return NextResponse.json({ ok: false, error: "missing_session_id" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid";
    // Qui potresti anche settare cookie/server flag se vuoi bloccare riuso, ma non è indispensabile.
    return NextResponse.json({ ok: true, paid });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "retrieve_error" }, { status: 400 });
  }
}
