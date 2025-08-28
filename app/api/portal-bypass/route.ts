import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const enabled = process.env.PORTAL_BYPASS_ENABLED === "true";
  const secret = process.env.PORTAL_BYPASS_KEY || "";
  const provided = url.searchParams.get("key") || "";

  if (!enabled || !secret || provided !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  // usa sempre DOMAIN_URL come host canonico (apex)
  const origin = (process.env.DOMAIN_URL && process.env.DOMAIN_URL.startsWith("http"))
    ? process.env.DOMAIN_URL
    : `https://${url.hostname}`;

  // cookie valido per apex (e www)
  const host = new URL(origin).hostname;
  const domain = host.endsWith("blockstamp.ae") ? ".blockstamp.ae" : host;

  const res = NextResponse.redirect(new URL("/portal", origin));
  res.cookies.set({
    name: "bs_portal",
    value: "ok",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    domain,
    maxAge: 60 * 15,
  });
  res.cookies.set({
    name: "paid",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    domain,
    maxAge: 60 * 15,
  });
  return res;
}
