import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const runtime = "nodejs";       // evita Edge runtime
export const dynamic = "force-dynamic"; // niente cache

export async function POST(req: Request) {
  // Lettura robusta del cookie "paid"
  const paidCookie = cookies().get("paid")?.value ?? null;
  const headerCookie = req.headers.get("cookie") || "";
  const paidFromHeader = (() => {
    const m = headerCookie.match(/(?:^|;\s*)paid=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  })();

  const isPaid = paidCookie === "1" || paidFromHeader === "1";

  if (!isPaid) {
    return NextResponse.json(
      {
        error: "Pagamento richiesto",
        code: "PAYMENT_REQUIRED",
        debug: { cookiePaid: paidCookie, headerPaid: paidFromHeader }
      },
      { status: 402, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File mancante" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const hashHex = createHash("sha256").update(buf).digest("hex");

    // TODO: integrazione anchoring (OTS) qui, se necessario

    return NextResponse.json(
      { ok: true, hash: hashHex },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Errore durante l'invio" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
