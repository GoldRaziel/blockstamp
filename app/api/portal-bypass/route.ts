import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const enabled = process.env.PORTAL_BYPASS_ENABLED === "true";
  const secret = process.env.PORTAL_BYPASS_KEY || "";
  const url = new URL(req.url);
  const provided = url.searchParams.get("key") || "";

  if (!enabled || !secret || provided !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  // Imposta cookie HttpOnly per sbloccare /portal (15 min)
  const res = NextResponse.redirect(new URL("/portal", url.origin));
  res.cookies.set({
    name: "bs_portal",
    value: "ok",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });
  return res;
}
