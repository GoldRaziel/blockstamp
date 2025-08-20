import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";            // forza runtime Node (no Edge)
export const dynamic = "force-dynamic";     // evita caching aggressivo su alcune piattaforme

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Accettiamo SOLO multipart per il tuo caso d'uso (ZIP upload)
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Usa multipart/form-data con campo 'file' (ZIP)." },
        { status: 415 }
      );
    }

    const data = await req.formData();
    const file = data.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Nessun file ricevuto." }, { status: 400 });
    }

    // Calcolo hash lato server (opzionale se poi usi OTS)
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hex = toHex(hashBuffer);

    // TODO: qui potrai integrare OpenTimestamps/servizio di timbratura con il BLOB del file

    return NextResponse.json({
      ok: true,
      hash: hex,
      received: {
        filename: (file as any).name || "file.zip",
        size: arrayBuffer.byteLength
      }
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Errore interno durante l'elaborazione." },
      { status: 500 }
    );
  }
}
