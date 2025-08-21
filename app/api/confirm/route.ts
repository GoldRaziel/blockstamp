import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const session_id = url.searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json({ error: "missing session_id" }, { status: 400 });
    }
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
    }

    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" } as any);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete";

    const res = NextResponse.json({ ok: true, paid });
    if (paid) {
      res.cookies.set("paid", "1", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 giorno
      });
    }
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "confirm error" }, { status: 500 });
  }
}
