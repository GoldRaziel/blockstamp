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

    const res = NextResponse.json({ ok: true, paid });
    if (paid) {
      res.cookies.set({
        name: "bs_portal",
        value: "ok",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        domain: ".blockstamp.ae",   // << IMPORTANTISSIMO
        maxAge: 60 * 30,            // 30 min
      });
    }
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "retrieve_error" }, { status: 400 });
  }
}
