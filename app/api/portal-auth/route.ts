import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SignJWT } from "jose";

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal";
const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10); // seconds (48h)
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const encoder = new TextEncoder();
const SECRET = process.env.PORTAL_JWT_SECRET
  ? encoder.encode(process.env.PORTAL_JWT_SECRET)
  : undefined;

function normalizeLang(input?: string | null): "it" | "en" | "ar" {
  const v = (input || "").toLowerCase();
  if (v.startsWith("it")) return "it";
  if (v.startsWith("ar")) return "ar";
  return "en";
}

// in prod reindirizzi non autorizzati a /en/
function servicePath(_: "it" | "en" | "ar"): string {
  return "/en/";
}

function langToPath(lang: "it" | "en" | "ar"): string {
  return lang === "it" ? "/portal" : `/${lang}/portal`;
}

export async function GET(req: NextRequest) {
  if (!STRIPE_KEY || !SECRET) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  let lang = normalizeLang(url.searchParams.get("lang"));

  if (!session_id) {
    return NextResponse.redirect(new URL(servicePath(lang), req.url));
  }

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // se non ci danno lang, prova da session.locale
    if (!url.searchParams.get("lang") && session?.locale) {
      lang = normalizeLang(session.locale);
    }

    // Considera valide tre condizioni:
    // 1) pagamento riuscito (paid)
    // 2) sessione completata (complete / paid)
    // 3) transazione a 0 per coupon (amount_total === 0) o payment_status === "no_payment_required"
    const amountTotal = Number(session?.amount_total ?? 0);
    const free = amountTotal === 0 || session?.payment_status === "no_payment_required";
    const complete = session?.status === "complete" || session?.status === "paid";
    const paid = session?.payment_status === "paid";
    const ok = paid || complete || free;

    if (!ok) {
      return NextResponse.redirect(new URL(servicePath(lang), req.url));
    }

    // firma un JWT con TTL
    const token = await new SignJWT({ sid: session.id, ok: true })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${TTL}s`)
      .sign(SECRET);

    const redirectUrl = new URL(langToPath(lang), req.url);
    const res = NextResponse.redirect(redirectUrl);

    res.cookies.set({
      name: COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax", // ok per redirect top-level da stripe -> portal-auth
      secure: true,
      path: "/",
      maxAge: TTL,
    });

    return res;
  } catch {
    return NextResponse.redirect(new URL(servicePath(lang), req.url));
  }
}
