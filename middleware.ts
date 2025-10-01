import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

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

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal_v2";
const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);
function toHome(): string { return "/en/"; }

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lascia passare la route di handoff
  if (pathname.startsWith("/api/portal-auth")) return NextResponse.next();

  // Bypass asset
  const skip =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons");
  if (skip) return NextResponse.next();

  // Proteggi i path del portal
  const isPortal =
    pathname === "/portal" ||
    pathname === "/it/portal" ||
    pathname === "/en/portal" ||
    pathname === "/ar/portal";

  if (!isPortal) return NextResponse.next();

  // ⬅️ NEW: lascia passare le richieste di prefetch del client Next.js
  if (req.headers.get("next-router-prefetch") === "1" || req.headers.get("x-nextjs-data") === "1") {
    return NextResponse.next();
  }

  const SECRET = deriveSecret();
  const homeUrl = new URL(toHome(), req.url);
  if (!SECRET) return NextResponse.redirect(homeUrl);

  // 1) Handoff via _t (token in query): valida, setta cookie e ripulisci URL
  const url = new URL(req.url);
  const tokenParam = url.searchParams.get("_t");
  if (tokenParam) {
    try {
      await jwtVerify(tokenParam, SECRET, { algorithms: ["HS256"] });
      url.searchParams.delete("_t");
      const res = NextResponse.redirect(url);
      res.cookies.set({
        name: COOKIE, value: tokenParam, httpOnly: true, sameSite: "lax",
        secure: true, path: "/", maxAge: TTL,
      });
      return res;
    } catch {}
  }

  // 2) Cookie già presente e valido?
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie) {
    try { await jwtVerify(cookie, SECRET, { algorithms: ["HS256"] }); return NextResponse.next(); }
    catch {}
  }

  // 3) Non autorizzato
  return NextResponse.redirect(homeUrl);
}

export const config = {
  matcher: ["/portal", "/it/portal", "/en/portal", "/ar/portal", "/api/portal-auth"],
};
