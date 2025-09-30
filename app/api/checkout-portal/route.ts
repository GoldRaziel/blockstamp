import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// opzionale: fallback di default se non passi ?price= nell'URL
const DEFAULT_PRICE = process.env.STRIPE_PRICE_PORTAL || "";

function normalizeLang(input?: string | null): "it" | "en" | "ar" {
  const v = (input || "").toLowerCase();
  if (v.startsWith("it")) return "it";
  if (v.startsWith("ar")) return "ar";
  return "en";
}

function servicePath(lang: "it" | "en" | "ar"): string {
  return lang === "it" ? "/service" : `/${lang}/service`;
}

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_KEY) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

    const { searchParams } = new URL(req.url);
    const lang = normalizeLang(searchParams.get("lang"));
    const price = (searchParams.get("price") || DEFAULT_PRICE).trim();

    if (!price) {
      return NextResponse.json({ error: "Missing price param or STRIPE_PRICE_PORTAL" }, { status: 400 });
    }

    const origin = req.headers.get("x-forwarded-origin") || req.nextUrl.origin;

    const success_url = `${origin}/api/portal-auth?session_id={CHECKOUT_SESSION_ID}&lang=${lang}`;
    const cancel_url = `${origin}${servicePath(lang)}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      billing_address_collection: "required",
      allow_promotion_codes: true,
      // prova a forzare la localizzazione di Stripe in base alla lingua richiesta
      locale: (lang === "it" ? "it" : "en"),
      metadata: { portal_access: "1", lang },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Stripe error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Consenti un GET "di comodo" che crea la session (utile da browser/postman),
  // ma in produzione usa POST dal tuo client.
  return POST(req);
}
