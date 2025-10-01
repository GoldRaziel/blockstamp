export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SignJWT } from "jose";

const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// stessa derivazione usata dal middleware
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
function servicePath(_: "it" | "en" | "ar"): string { return "/en/"; }

export async function GET(req: NextRequest) {
  const SECRET = deriveSecret();
  if (!STRIPE_KEY || !SECRET) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  let lang = normalizeLang(url.searchParams.get("lang"));
  if (!session_id) return NextResponse.redirect(new URL(servicePath(lang), req.url));

  const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!url.searchParams.get("lang") && session?.locale) {
      lang = normalizeLang(session.locale);
    }

    // valido anche con coupon 100% (amount_total=0) o no_payment_required
    const amountTotal = Number(session?.amount_total ?? 0);
    const free = amountTotal === 0 || session?.payment_status === "no_payment_required";
    const complete = session?.status === "complete" || session?.status === "paid";
    const paid = session?.payment_status === "paid";
    const ok = paid || complete || free;
    if (!ok) return NextResponse.redirect(new URL(servicePath(lang), req.url));

    const token = await new SignJWT({ sid: session.id, ok: true })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${TTL}s`)
      .sign(SECRET);

    const redirectPath = `${langToPath(lang)}?_t=${encodeURIComponent(token)}`;
    const html = `<!doctype html><html><head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${redirectPath}">
<script>location.replace("${redirectPath}");</script>
<title>Redirecting…</title>
</head><body>
Redirecting… If you are not redirected, <a href="${redirectPath}">click here</a>.
</body></html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.redirect(new URL(servicePath(lang), req.url));
  }
}
