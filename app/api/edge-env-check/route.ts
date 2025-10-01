import { NextResponse } from "next/server";
export async function GET() {
  const hasStripe = !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.length > 10;
  const hasCookieName = !!process.env.PORTAL_COOKIE_NAME;
  const ttl = Number(process.env.PORTAL_COOKIE_TTL || "0");
  return NextResponse.json({
    runtime: "edge_or_node_middleware",
    hasStripeSecretKey: hasStripe,
    hasPortalCookieName: hasCookieName,
    portalCookieTTL: ttl
  });
}
