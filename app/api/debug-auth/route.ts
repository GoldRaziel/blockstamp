import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sid = url.searchParams.get("session_id") || "";
  const key = url.searchParams.get("key") || "";
  const host = url.hostname;

  const cookieVal = cookies().get("bs_portal")?.value || "";
  const cookieOk = cookieVal === "ok";

  let sidOk = false;
  if (sid && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
      const s = await stripe.checkout.sessions.retrieve(sid);
      sidOk = s.payment_status === "paid";
    } catch {}
  }

  const bypassEnabled = process.env.PORTAL_BYPASS_ENABLED === "true";
  const keyOk = bypassEnabled && key && (process.env.PORTAL_BYPASS_KEY || "") === key;

  const authorized = cookieOk || sidOk || keyOk;

  return NextResponse.json({
    host,
    cookiePresent: !!cookieVal,
    cookieOk,
    sidProvided: !!sid,
    sidOk,
    bypassEnabled,
    keyProvided: !!key,
    keyOk,
    authorized
  });
}
