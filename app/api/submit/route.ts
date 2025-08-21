import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Fonte A: cookie httpOnly
  const paidCookie = cookies().get("paid")?.value ?? null;
  // Fonte B: header dal client quando UI mostra TIMBRA
  const xPaid = req.headers.get("x-paid");
  const isPaid = paidCookie === "1" || xPaid === "1";

  if (!isPaid) {
    return NextResponse.json(
      { error: "Pagamento richiesto", code: "PAYMENT_REQUIRED", debug: { cookiePaid: paidCookie, headerPaid: xPaid } },
      { status: 402, headers: { "Cache-Control": "no-store" } }
    );
  }

  // File dal form
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File mancante" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Hash server-side
  const buf = Buffer.from(await file.arrayBuffer());
  const hashHex = createHash("sha256").update(buf).digest("hex");

  // Se configurato, inoltra al VPS OTS
  const base = process.env.OTS_API_BASE?.replace(/\/+$/, "");
  if (base) {
    try {
      const fd = new FormData();
      fd.append("file", new Blob([buf], { type: file.type || "application/octet-stream" }), (file as any).name || "upload.bin");
      const r = await fetch(`${base}/stamp`, { method: "POST", body: fd });
      const txt = await r.text();
      let j: any = {};
      try { j = txt ? JSON.parse(txt) : {}; } catch {}
      return NextResponse.json(
        { ok: r.ok, vpsStatus: r.status, hash: hashHex, vps: j || txt },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, hash: hashHex, vpsError: e?.message || "VPS error" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  // Fallback: solo hash
  return NextResponse.json(
    { ok: true, hash: hashHex, vps: null },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
  );
}
