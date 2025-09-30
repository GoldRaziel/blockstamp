import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal";
const encoder = new TextEncoder();
const SECRET = process.env.PORTAL_JWT_SECRET
  ? encoder.encode(process.env.PORTAL_JWT_SECRET)
  : undefined;

function langFromPath(pathname: string): "it" | "en" | "ar" {
  if (pathname.startsWith("/en/")) return "en";
  if (pathname.startsWith("/ar/")) return "ar";
  // IT è la root
  return "it";
}

function servicePath(lang: "it" | "en" | "ar") {
  return lang === "it" ? "/service" : `/${lang}/service`;
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

  // proteggi solo i 3 path del portal
  const isPortal =
    req.nextUrl.pathname === "/portal" ||
    req.nextUrl.pathname === "/en/portal" ||
    req.nextUrl.pathname === "/ar/portal";

  if (!isPortal) return NextResponse.next();

  if (!SECRET) {
    // se manca la secret, meglio non bloccare tutto in prod ma rimandare a /service
    const to = servicePath(langFromPath(req.nextUrl.pathname));
    return NextResponse.redirect(new URL(to, req.url));
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (!cookie) {
    const to = servicePath(langFromPath(req.nextUrl.pathname));
    return NextResponse.redirect(new URL(to, req.url));
  }

  try {
    await jwtVerify(cookie, SECRET, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch {
    const to = servicePath(langFromPath(req.nextUrl.pathname));
    return NextResponse.redirect(new URL(to, req.url));
  }
}

// Limita il middleware ai soli path del portal (più /api/portal-auth che lasciamo passare)
export const config = {
  matcher: ["/portal", "/en/portal", "/ar/portal", "/api/portal-auth"],
};
