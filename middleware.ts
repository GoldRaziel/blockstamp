import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["it","en","ar"] as const;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean); // ["it","portal"] | ["portal"]

  const isPortal =
    (parts.length === 1 && parts[0] === "portal") ||
    (parts.length === 2 && LOCALES.includes(parts[0] as any) && parts[1] === "portal");

  if (!isPortal) return NextResponse.next();

  const locale = LOCALES.includes(parts[0] as any) ? (parts[0] as any) : "it";
  const sessionId = url.searchParams.get("session_id");

  // Se manca session_id -> redirect a /{locale}/pay
  if (!sessionId) {
    url.pathname = `/pay`;
    url.searchParams.set("reason",  "missing_session");
    return NextResponse.redirect(url);
  }

  // Verifica sessione Stripe via API interna
  try {
    const apiUrl = new URL("/api/stripe/session", req.url);
    apiUrl.searchParams.set("session_id", sessionId);
    const resp = await fetch(apiUrl, { headers: { accept: "application/json" }, cache: "no-store" });

    if (!resp.ok) {
      url.pathname = `/pay`;
      url.searchParams.set("reason",  "session_lookup_failed");
      return NextResponse.redirect(url);
    }

    const data = await resp.json();
    const paid = data?.paid === true || data?.status === "complete" || data?.payment_status === "paid" || data?.payment_status === "no_payment_required";

    if (!paid) {
      url.pathname = `/pay`;
      url.searchParams.set("reason",  "unpaid");
      return NextResponse.redirect(url);
    }

    // OK
    return NextResponse.next();
  } catch {
    url.pathname = `/pay`;
    url.searchParams.set("reason",  "check_error");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/portal", "/it/portal", "/en/portal", "/ar/portal"],
};
