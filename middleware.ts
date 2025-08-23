import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // proteggi /portal e /api/stamp
  const needsPaid =
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname.startsWith("/api/stamp");

  if (needsPaid) {
    const paid = req.cookies.get("paid");
    const isPaid = paid && paid.value === "1";

    if (!isPaid) {
      // Se è una API, rispondi 401 JSON; se è pagina, redirect a Home
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

export const config = {
  matcher: ["/portal", "/portal/:path*", "/api/stamp"],
};
