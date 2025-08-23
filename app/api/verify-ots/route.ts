import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // assicura ambiente server

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

    // forward al tuo servizio: /verify accetta (file, ots) o solo ots a seconda della tua implementazione
    // Qui supponiamo che basti l'ots
    const res = await fetch(`${base}/verify`, { method: "POST", body: fd });

    const text = await res.text();
    // prova a fare parse JSON; se non è JSON, prova a estrarre block height con una regex
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // tentativo di lettura block height nelle chiavi comuni
    let blockHeight: number | null = null;
    const candidates = [
      data?.block_height,
      data?.blockHeight,
      data?.result?.block_height,
      data?.info?.block_height,
    ];

    for (const c of candidates) {
      const n = Number(c);
      if (Number.isFinite(n)) {
        blockHeight = n;
        break;
      }
    }

    // fallback: regex se arriva testo grezzo con "block height: 861234"
    if (blockHeight === null && typeof text === "string") {
      const m = text.match(/block[_\s-]*height[^0-9]*([0-9]{3,})/i);
      if (m) blockHeight = Number(m[1]);
    }

    return NextResponse.json({ ok: true, block_height: blockHeight, raw: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Errore sconosciuto" }, { status: 500 });
  }
}
