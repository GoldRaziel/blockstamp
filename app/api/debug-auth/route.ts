import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const host = url.hostname;
  const cookieVal = cookies().get("bs_portal")?.value || "";
  const cookieOk = cookieVal === "ok";
  const bypassEnabled = process.env.PORTAL_BYPASS_ENABLED === "true";
  const key = url.searchParams.get("key") || "";
  const keyOk = bypassEnabled && key && key === (process.env.PORTAL_BYPASS_KEY || "");

  return NextResponse.json({
    host,
    cookieOk,
    bypassEnabled,
    keyProvided: !!key,
    keyOk,
    authorized: cookieOk || keyOk,
  });
}
