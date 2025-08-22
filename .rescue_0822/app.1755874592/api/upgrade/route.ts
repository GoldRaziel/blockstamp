import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
const OTS_BASE = process.env.OTS_BASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Usa multipart/form-data con campo 'ots'." }, { status: 415 });
    }
    const form = await req.formData();
    const ots = form.get("ots");
    if (!ots || !(ots instanceof Blob)) return NextResponse.json({ error: "Nessun file .ots ricevuto." }, { status: 400 });

    const forward = new FormData();
    forward.append("ots", ots, "request.ots");

    const res = await fetch(`${OTS_BASE}/upgrade`, { method: "POST", body: forward });
    if (!res.ok) return NextResponse.json({ error: await res.text() || "Errore OTS /upgrade" }, { status: res.status });

    const buf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="upgraded.ots"`
      }
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || "Errore interno" }, { status: 500 });
  }
}
