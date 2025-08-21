import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1) Consenti SOLO se pagato (cookie httpOnly)
  const isPaid = cookies().get("paid")?.value === "1";
  if (!isPaid) {
    return NextResponse.json(
      { error: "Pagamento richiesto", code: "PAYMENT_REQUIRED" },
      { status: 402, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 2) Prendi il file
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File mancante" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // 3) Calcola hash server-side (sempre utile/mostrabile al client)
  const buf = Buffer.from(await file.arrayBuffer());
  const hashHex = createHash("sha256").update(buf).digest("hex");

  // 4) Se configurato, inoltra il file al VPS OTS per lo "stamp"
  const base = process.env.OTS_API_BASE; // es: https://<VPS>:8000
  if (base) {
    try {
      const fd = new FormData();
      // Ricrea un Blob per invio (alcuni runtimes vogliono Blob/File originale)
      fd.append("file", new Blob([buf], { type: file.type || "application/octet-stream" }), (file as any).name || "upload.bin");
      const r = await fetch(`${base.replace(/\/+$/, "")}/stamp`, {
        method: "POST",
        body: fd,
      });
      const txt = await r.text();
      let j: any = {};
      try { j = txt ? JSON.parse(txt) : {}; } catch {}
      // Ritorna quanto risponde il VPS, ma sempre includendo il nostro hashHex
      return NextResponse.json(
        { ok: r.ok, vpsStatus: r.status, hash: hashHex, vps: j || txt },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
      );
    } catch (e: any) {
      // Se il VPS fallisce, torna comunque l'hash e l'errore VPS per debug
      return NextResponse.json(
        { ok: false, hash: hashHex, vpsError: e?.message || "VPS error" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  // 5) Fallback: solo hash (se OTS_API_BASE non è settata)
  return NextResponse.json(
    { ok: true, hash: hashHex, vps: null },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
  );
}
