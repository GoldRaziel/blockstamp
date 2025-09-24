import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["it","en","ar"];

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, origin } = new URL(req.url);

  // Match /portal e /{lang}/portal
  const parts = pathname.split("/").filter(Boolean);
  const isPortal =
    (parts.length === 1 && parts[0] === "portal") ||
    (parts.length === 2 && LOCALES.includes(parts[0]) && parts[1] === "portal");

  if (!isPortal) return NextResponse.next();

  // 1) Bypass DEV opzionale via chiave (se vuoi disattivalo, elimina questo blocco)
  const bypass = searchParams.get("bypass");
  const bypassKey = process.env.PORTAL_BYPASS_KEY;
  if (bypass && bypassKey && bypass === bypassKey) {
    return NextResponse.next();
  }

  // 2) Richiede session_id Stripe in query (?session_id=...)
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    // No session → redirect a /pay
    const locale = LOCALES.includes(parts[0]) ? parts[0] : "it";
    return NextResponse.redirect(`${origin}/${locale}/pay?reason=missing_session`);
  }

  // 3) Verifica lato server la sessione Stripe (usa tua API interna già presente)
  try {
    const check = await fetch(`${origin}/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`, {
      headers: { "accept": "application/json" },
      // Importante sugli edge: no-cache per evitare falsi positivi
      cache: "no-store"
    });

    if (!check.ok) {
      const locale = LOCALES.includes(parts[0]) ? parts[0] : "it";
      return NextResponse.redirect(`${origin}/${locale}/pay?reason=session_lookup_failed`);
    }

    const data = await check.json();
    // Adatta la condizione al tuo payload (qui assumo { paid: true } oppure status === "complete")
    const paid = data?.paid === true || data?.status === "complete" || data?.payment_status === "paid";
    if (!paid) {
      const locale = LOCALES.includes(parts[0]) ? parts[0] : "it";
      return NextResponse.redirect(`${origin}/${locale}/pay?reason=unpaid`);
    }

    // OK: consenti accesso al portal
    return NextResponse.next();
  } catch {
    const locale = LOCALES.includes(parts[0]) ? parts[0] : "it";
    return NextResponse.redirect(`${origin}/${locale}/pay?reason=check_error`);
  }
}

export const config = {
  matcher: [
    "/portal",
    "/it/portal",
    "/en/portal",
    "/ar/portal",
  ],
};
