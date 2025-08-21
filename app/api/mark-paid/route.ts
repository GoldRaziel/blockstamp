import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "session_id mancante" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Pagamento non confermato" }, { status: 402 });
    }

    // Imposta cookie httpOnly valido 24h
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "paid",
      value: "1",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err: any) {
    console.error("MARK-PAID ERR", err);
    return NextResponse.json({ error: err?.message || "Errore mark-paid" }, { status: 500 });
  }
}
