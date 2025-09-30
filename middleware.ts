import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal";
const encoder = new TextEncoder();
const SECRET = process.env.PORTAL_JWT_SECRET
  ? encoder.encode(process.env.PORTAL_JWT_SECRET)
  : undefined;

// Non usiamo più la lingua: qualsiasi accesso non autorizzato va alla home EN
function servicePath(lang: "it" | "en" | "ar") {
  return "/en/";
}

export async function middleware(req: NextRequest) {
  // lascia passare l'endpoint che setta il cookie
  if (req.nextUrl.pathname.startsWith("/api/portal-auth")) {
    return NextResponse.next();
  }

  // bypass per asset/_next ecc.
  const skip =
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/favicon") ||
    req.nextUrl.pathname.startsWith("/assets") ||
    req.nextUrl.pathname.startsWith("/images") ||
    req.nextUrl.pathname.startsWith("/icons");
  if (skip) return NextResponse.next();

  // proteggiamo i path del portal (root + it/en/ar)
  const isPortal =
    req.nextUrl.pathname === "/portal" ||
    req.nextUrl.pathname === "/it/portal" ||
    req.nextUrl.pathname === "/en/portal" ||
    req.nextUrl.pathname === "/ar/portal";

  if (!isPortal) return NextResponse.next();

  // Se manca la secret, o manca/è invalido il cookie -> redirect a /en/
  const to = servicePath("en");
  if (!SECRET) {
    return NextResponse.redirect(new URL(to, req.url));
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL(to, req.url));
  }

  try {
    await jwtVerify(cookie, SECRET, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(to, req.url));
  }
}

// Limita il middleware ai soli path del portal (e /api/portal-auth che lasciamo passare)
export const config = {
  matcher: ["/portal", "/it/portal", "/en/portal", "/ar/portal", "/api/portal-auth"],
};
