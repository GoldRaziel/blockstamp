import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal";
const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);
const encoder = new TextEncoder();
const SECRET = process.env.PORTAL_JWT_SECRET
  ? encoder.encode(process.env.PORTAL_JWT_SECRET)
  : undefined;

function toHome(): string {
  return "/en/";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/portal-auth")) {
    return NextResponse.next();
  }

  const skip =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons");
  if (skip) return NextResponse.next();

  const isPortal =
    pathname === "/portal" ||
    pathname === "/it/portal" ||
    pathname === "/en/portal" ||
    pathname === "/ar/portal";

  if (!isPortal) return NextResponse.next();

  const homeUrl = new URL(toHome(), req.url);

  if (!SECRET) {
    return NextResponse.redirect(homeUrl);
  }

  const url = new URL(req.url);
  const tokenParam = url.searchParams.get("_t");
  if (tokenParam) {
    try {
      await jwtVerify(tokenParam, SECRET, { algorithms: ["HS256"] });
      url.searchParams.delete("_t");
      const res = NextResponse.redirect(url);
      res.cookies.set({
        name: COOKIE,
        value: tokenParam,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: TTL,
      });
      return res;
    } catch {}
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie) {
    try {
      await jwtVerify(cookie, SECRET, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {}
  }

  return NextResponse.redirect(homeUrl);
}

export const config = {
  matcher: ["/portal", "/it/portal", "/en/portal", "/ar/portal", "/api/portal-auth"],
};
