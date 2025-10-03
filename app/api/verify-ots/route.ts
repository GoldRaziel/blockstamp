import { NextResponse } from "next/server";

export const runtime = "nodejs";        // usa runtime Node
export const dynamic = "force-dynamic"; // disabilita caching su Vercel/Netlify

// URL del micro-servizio Python (override in prod con env OTS_SERVICE_URL)
const OTS_URL = process.env.OTS_SERVICE_URL ?? "http://127.0.0.1:8081/api/ots/upgrade-verify";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const zip = form.get("zip");
    const ots = form.get("ots");

    if (!(ots instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing OTS file" }, { status: 400 });
    }

    // Ricostruisci un FormData per il micro-servizio
    const outbound = new FormData();

    // .ots (obbligatorio)
    const otsBuf = await ots.arrayBuffer();
    outbound.append("ots", new Blob([otsBuf], { type: "application/octet-stream" }), (ots as File).name || "proof.ots");

    // zip/target (opzionale)
    if (zip instanceof File) {
      const zipBuf = await zip.arrayBuffer();
      outbound.append("target", new Blob([zipBuf], { type: "application/octet-stream" }), (zip as File).name || "target.bin");
    }

    // POST al micro-servizio
    const r = await fetch(OTS_URL, {
      method: "POST",
      body: outbound,
    });

    // Propaga status e payload così com’è (include block_height, status, ots_base64, etc.)
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: r.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Internal error" },
      { status: 500 },
    );
  }
}
