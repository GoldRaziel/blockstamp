import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const sid = new URL(req.url).searchParams.get("sid");
  if (!sid) return NextResponse.json({ ok:false, error:"missing sid" }, { status:400 });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const s = await stripe.checkout.sessions.retrieve(sid);

    return NextResponse.json({
      ok: true,
      id: s.id,
      mode: s.mode,
      payment_status: s.payment_status,
      success_url: (s as any).success_url ?? null,
      cancel_url:  (s as any).cancel_url ?? null,
      payment_link: (s as any).payment_link ?? null,
      price_ids: (s.line_items ? undefined : undefined), // placeholder: not expanded
      url: s.url ?? null
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status:500 });
  }
}
