import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  // Consenti /portal se arriva con ?session_id=...
  if ((pathname === "/portal" || pathname.startsWith("/portal/")) && searchParams.has("session_id")) {
    return NextResponse.next();
  }

  // Proteggi /portal e /api/stamp con cookie paid=1
  const needsPaid =
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname.startsWith("/api/stamp");

  if (needsPaid) {
    const paid = req.cookies.get("paid");
    if (!paid || paid.value !== "1") {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/portal", "/portal/:path*", "/api/stamp"] };
