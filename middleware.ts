// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// API protette da paywall
const PROTECTED = [/^\/api\/stamp/, /^\/api\/upgrade/, /^\/api\/verify/];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((rx) => rx.test(pathname));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("stamp_auth")?.value;
  if (!token) {
    return NextResponse.json({ error: "Pagamento richiesto" }, { status: 402 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    // jwtVerify usa WebCrypto, compatibile con Edge Runtime
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Sessione non valida" }, { status: 401 });
  }
}

// Limita il middleware solo alle API
export const config = {
  matcher: ["/api/:path*"],
};
