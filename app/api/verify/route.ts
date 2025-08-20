import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
const OTS_BASE = process.env.OTS_BASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Usa multipart/form-data con campi 'file' e 'ots'." }, { status: 415 });
    }
    const form = await req.formData();
    const file = form.get("file");
    const ots  = form.get("ots");
    if (!file || !(file instanceof Blob)) return NextResponse.json({ error: "Manca file ZIP." }, { status: 400 });
    if (!ots  || !(ots  instanceof Blob)) return NextResponse.json({ error: "Manca file .ots." }, { status: 400 });

    const forward = new FormData();
    forward.append("file", file, (file as any).name || "file.zip");
    forward.append("ots",  ots,  "proof.ots");

    const res = await fetch(`${OTS_BASE}/verify`, { method: "POST", body: forward });
    const text = await res.text();
    if (!res.ok) return NextResponse.json({ error: text || "Errore OTS /verify" }, { status: res.status });
    try { return NextResponse.json(JSON.parse(text)); }
    catch { return NextResponse.json({ ok: true, output: text }); }
  } catch (e:any) {
    return NextResponse.json({ error: e.message || "Errore interno" }, { status: 500 });
  }
}
