import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const ots = form.get("ots");
    if (!(ots instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "File .ots mancante" }, { status: 400 });
    }

    const base = process.env.OTS_API_BASE || "http://127.0.0.1:8000";
    const fd = new FormData();
    fd.append("ots", ots);

    const upstream = await fetch(`${base}/verify`, { method: "POST", body: fd });

    const rawText = await upstream.text();
    let data: any;
    try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }

    // Prova ad estrarre il block height
    let blockHeight: number | null = null;
    const candidates = [
      data?.block_height,
      data?.blockHeight,
      data?.result?.block_height,
      data?.info?.block_height,
    ];
    for (const c of candidates) {
      const n = Number(c);
      if (Number.isFinite(n)) { blockHeight = n; break; }
    }
    if (blockHeight === null && typeof rawText === "string") {
      const m = rawText.match(/block[_\s-]*height[^0-9]*([0-9]{3,})/i);
      if (m) blockHeight = Number(m[1]);
    }

    // “Not found” riconoscibile => 404 verso il client
    const rawLower = (rawText || "").toLowerCase();
    const looksNotFound =
      upstream.status === 404 ||
      rawLower.includes("not found") ||
      rawLower.includes("no proof") ||
      rawLower.includes("no attestation") ||
      rawLower.includes("no merkle") ||
      rawLower.includes("unknown");

    if (blockHeight === null && looksNotFound) {
      return NextResponse.json({ ok: false, error: "not_found", raw: data }, { status: 404 });
    }

    // Se l'upstream NON è ok e non è “not found”, propaghiamo (rete/servizio)
    if (!upstream.ok && !looksNotFound) {
      return NextResponse.json({ ok: false, error: data?.error || "fetch failed", raw: data }, { status: upstream.status || 502 });
    }

    // Altrimenti OK (anche se upstream ok ma non abbiamo estratto H: lo gestirà il client come inesistente)
    return NextResponse.json({ ok: true, block_height: blockHeight, raw: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Errore sconosciuto" }, { status: 500 });
  }
}
