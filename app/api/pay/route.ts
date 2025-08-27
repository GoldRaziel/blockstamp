import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers as nextHeaders } from "next/headers";

export async function POST(req: Request) {
  try {
    const {
      amount = 500,
      currency = "eur",
      description = "Blockstamp Protection",
    } = await req.json().catch(() => ({}));

    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
    }

    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" } as any);

    // Base di fallback dal deploy (Netlify) o env
    const envBase =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://melodious-starburst-f335b3.netlify.app";

    // Ricava origin + locale dal Referer (se c'è), altrimenti da req.url; fallback envBase
    const hdrs = nextHeaders();
    const ref = hdrs.get("referer") || "";

    let origin = envBase;
    let locale: "it" | "en" | "ar" = "it";
    try {
      const u = new URL(ref || req.url);
      origin = u.origin || envBase;
      const seg0 = u.pathname.split("/")[1];
      if (seg0 === "en" || seg0 === "ar" || seg0 === "it") locale = seg0;
    } catch {
      // se new URL fallisse, restiamo su envBase + "it"
    }

    const base = origin.replace(/\/+$/, ""); // rimuove eventuali slash finali

    // URL di ritorno dipendenti dal locale
    const success_url = `${base}/${locale}/portal?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${base}/${locale}/#pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: amount, // in centesimi (es. 500 = €5.00)
          },
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "pay error" }, { status: 500 });
  }
}
