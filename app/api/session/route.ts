import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export const runtime = "nodejs";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
} as const;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("stamp_auth")?.value;
    if (!token || token.length < 20) {
      return new NextResponse(JSON.stringify({ paid: false }), { headers: NO_CACHE });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    await jwtVerify(token, secret);
    return new NextResponse(JSON.stringify({ paid: true }), { headers: NO_CACHE });
  } catch {
    return new NextResponse(JSON.stringify({ paid: false }), { headers: NO_CACHE });
  }
}
