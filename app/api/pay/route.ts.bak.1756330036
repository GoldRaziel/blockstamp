import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers as nextHeaders } from "next/headers";

type Locale = "it" | "en" | "ar";

function normalizeLocale(x: string | null | undefined): Locale | null {
  if (!x) return null;
  const v = x.toLowerCase();
  if (v.startsWith("en")) return "en";
  if (v.startsWith("ar")) return "ar";
  if (v.startsWith("it")) return "it";
  return null;
}

export async function POST(req: Request) {
  try {
    const {
      amount = 500,
      currency = "eur",
      description = "Blockstamp Protection",
      locale: bodyLocale,
    } = await req.json().catch(() => ({}));

    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });

    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" } as any);

    // Base di fallback (Netlify)
    const envBase =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://melodious-starburst-f335b3.netlify.app";

    const hdrs = nextHeaders();

    // 1) locale dal body (priorità massima)
    let locale: Locale | null = normalizeLocale(bodyLocale);

    // 2) locale da query ?locale=
    if (!locale) {
      try {
        const u = new URL(req.url);
        locale = normalizeLocale(u.searchParams.get("locale"));
      } catch {}
    }

    // 3) cookie NEXT_LOCALE
    if (!locale) {
      const cookies = hdrs.get("cookie") || "";
      const m = cookies.match(/(?:^|;\s*)NEXT_LOCALE=(it|en|ar)\b/i);
      if (m) locale = normalizeLocale(m[1]);
    }

    // 4) path dal referer o req.url
    let origin = envBase;
    if (!locale) {
      try {
        const ref = hdrs.get("referer") || "";
        const u = new URL(ref || req.url);
        origin = u.origin || envBase;
        const seg0 = u.pathname.split("/")[1];
        locale = normalizeLocale(seg0);
      } catch {
        // resta envBase
      }
    } else {
      // comunque aggiorniamo origin da referer/req, se disponibile
      try {
        const ref = hdrs.get("referer") || "";
        const u = new URL(ref || req.url);
        origin = u.origin || envBase;
      } catch {}
    }

    // 5) Accept-Language (fallback dolce)
    if (!locale) {
      const al = hdrs.get("accept-language") || "";
      locale = normalizeLocale(al);
    }

    // 6) Fallback definitivo
    if (!locale) locale = "it";

    const base = (origin || envBase).replace(/\/+$/, "");

    const success_url = `${base}/${locale}/portal?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url  = `${base}/${locale}/#pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: amount, // centesimi
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
