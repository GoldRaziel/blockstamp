import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/timbra", "/api/stamp", "/api/verify", "/api/upgrade"];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    const paid = req.cookies.get("paid")?.value === "1";
    if (!paid) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("need_payment", "1");
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/timbra/:path*", "/api/:path*"],
};
