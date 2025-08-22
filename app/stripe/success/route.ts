import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return NextResponse.redirect(new URL("/", req.url));

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete";

    if (!paid) return NextResponse.redirect(new URL("/", req.url));

    cookies().set({
      name: "paid",
      value: "1",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 3, // 3 ore
    });

    return NextResponse.redirect(new URL("/timbra", req.url));
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
