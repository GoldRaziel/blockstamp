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

function langToPath(lang: "it" | "en" | "ar"): string {
  // IT è la root (senza prefisso)
  return lang === "it" ? "/portal" : `/${lang}/portal`;
}

function servicePath(lang: "it" | "en" | "ar"): string {
  return lang === "it" ? "/service" : `/${lang}/service`;
}

export async function GET(req: NextRequest) {
  if (!STRIPE_KEY || !SECRET) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  let lang = normalizeLang(url.searchParams.get("lang"));

  if (!session_id) {
    // se manca session_id, mandiamo alla pagina service della lingua scelta (default EN)
    const fallback = servicePath(lang);
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // se lang non è stato passato, provo da session.locale (es. "en-GB", "it", "ar")
    if (!url.searchParams.get("lang") && session?.locale) {
      lang = normalizeLang(session.locale);
    }

    // accettiamo se pagato o completato
    const paid =
      session?.payment_status === "paid" ||
      session?.status === "complete" ||
      session?.status === "paid"; // fallback in rari casi

    if (!paid) {
      const to = servicePath(lang);
      return NextResponse.redirect(new URL(to, req.url));
    }

    // firmo un piccolo JWT con scadenza TTL
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
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: TTL,
    });

    return res;
  } catch (err) {
    // in errore (sessione inesistente/invalid), rimbalza a service
    const to = servicePath(lang);
    return NextResponse.redirect(new URL(to, req.url));
  }
}
