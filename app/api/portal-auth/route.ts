export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SignJWT } from "jose";

const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";

// stessa derivazione usata dal middleware (da STRIPE_SECRET_KEY)
function deriveSecret(): Uint8Array | null {
  const sk = process.env.STRIPE_SECRET_KEY || "";
  if (!sk) return null;
  const data = new TextEncoder().encode(sk + "::portal");
  let h = 2166136261 >>> 0;
  for (let i = 0; i < data.length; i++) { h ^= data[i]; h = Math.imul(h, 16777619) >>> 0; }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = (h = Math.imul(h ^ i, 16777619) >>> 0) & 0xff;
  return bytes;
}

function normalizeLang(input?: string | null): "it" | "en" | "ar" {
  const v = (input || "").toLowerCase();
  if (v.startsWith("it")) return "it";
  if (v.startsWith("ar")) return "ar";
  return "en";
}
function langToPath(lang: "it" | "en" | "ar"): string {
  return lang === "it" ? "/portal" : `/${lang}/portal`;
}
function servicePath(): string { return "/en/"; }

function htmlRedirect(path: string) {
  const html = `<!doctype html><html><head>
<meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${path}">
<script>location.replace("${path}");</script><title>Redirecting…</title>
</head><body>Redirecting… If you are not redirected, <a href="${path}">click here</a>.</body></html>`;
  return new NextResponse(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function GET(req: NextRequest) {
  try {
    // Se manca la Stripe key o la secret derivata: non rompere, manda a home EN (evita 500)
    const SECRET = deriveSecret();
    if (!STRIPE_KEY || !SECRET) {
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    const url = new URL(req.url);
    const session_id = url.searchParams.get("session_id");
    let lang = normalizeLang(url.searchParams.get("lang"));

    if (!session_id) {
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    // Stripe lato Node (runtime forzato)
    const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

    let session: Stripe.Checkout.Session | null = null;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch {
      // ID non valido o rete: non 500, torna a home EN
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    // prova ad inferire la lingua dalla sessione
    if (!url.searchParams.get("lang") && session?.locale) {
      lang = normalizeLang(session.locale);
    }

    // Valido anche con coupon 100% (amount_total=0) o no_payment_required
    const amountTotal = Number(session?.amount_total ?? 0);
    const free = amountTotal === 0 || session?.payment_status === "no_payment_required";
    const complete = session?.status === "complete" || session?.status === "paid";
    const paid = session?.payment_status === "paid";
    const ok = paid || complete || free;

    if (!ok) {
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    // Genera JWT e fai handoff via query al middleware
    const token = await new SignJWT({ sid: session.id, ok: true })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${TTL}s`)
      .sign(SECRET);

    const redirectPath = `${langToPath(lang)}?_t=${encodeURIComponent(token)}`;
    return htmlRedirect(redirectPath);
  } catch {
    // Qualsiasi errore imprevisto: NO 500, redirect HTML alla home EN
    return htmlRedirect(servicePath());
  }
}
