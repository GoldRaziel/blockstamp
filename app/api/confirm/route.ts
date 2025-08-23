import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/?error=missing_session", req.url));
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const res = NextResponse.redirect(new URL("/portal", req.url));
      res.cookies.set({
        name: "paid",
        value: "1",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 3, // 3 ore
      });
      return res;
    } else {
      return NextResponse.redirect(new URL("/?error=payment_not_confirmed", req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/?error=confirm_error", req.url));
  }
}
