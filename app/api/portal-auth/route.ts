export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SignJWT } from "jose";

const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";

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
    const SECRET = deriveSecret();
    if (!STRIPE_KEY || !SECRET) {
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    const url = new URL(req.url);
    const session_id = url.searchParams.get("session_id");
    let lang: "it" | "en" | "ar" = "en";
    if (!session_id) return NextResponse.redirect(new URL(servicePath(), req.url));

    const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });
    let session: Stripe.Checkout.Session | null = null;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch {
      return NextResponse.redirect(new URL(servicePath(), req.url));
    }

    // force EN: ignore session.locale

    const amountTotal = Number(session?.amount_total ?? 0);
    const free = amountTotal === 0 || session?.payment_status === "no_payment_required";
    const complete = session?.status === "complete";
    const paid = session?.payment_status === "paid";
    const ok = paid || complete || free;
    if (!ok) return NextResponse.redirect(new URL(servicePath(), req.url));

    const token = await new SignJWT({ sid: session.id, ok: true })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${TTL}s`)
      .sign(SECRET);

    const redirectPath = `${langToPath(lang)}?_t=${encodeURIComponent(token)}`;

    // ⬅️ NEW: imposta SUBITO il cookie (oltre all’handoff via _t)
    const res = htmlRedirect(redirectPath);
    return res;
  } catch {
    return NextResponse.redirect(new URL(servicePath(), req.url));
  }
}
