import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Controllo "light" del contenuto ZIP: cerchiamo almeno un filename .txt
// Legge le entry della "central directory" (firma 0x02014b50) e verifica i nomi file.
function zipHasTxtFile(buf: Buffer): boolean {
  const SIG = 0x02014b50; // "PK\x01\x02"
  let i = 0;
  const n = buf.length;

  while (i + 46 <= n) {
    if (buf.readUInt32LE(i) === SIG) {
      const nameLen = buf.readUInt16LE(i + 28);
      const extraLen = buf.readUInt16LE(i + 30);
      const commentLen = buf.readUInt16LE(i + 32);

      const nameStart = i + 46;
      const nameEnd = nameStart + nameLen;
      if (nameEnd > n) break;

      const filename = buf.slice(nameStart, nameEnd).toString("utf8");
      if (filename.toLowerCase().endsWith(".txt")) return true;

      // salta all'header successivo
      i = nameEnd + extraLen + commentLen;
      continue;
    }
    i += 1;
  }
  return false;
}

export async function POST(req: NextRequest) {
  // Difesa ulteriore
  const paid = req.cookies.get("paid");
  if (!paid || paid.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("zip");
  if (!(file instanceof File)) {
    return new NextResponse("File .zip mancante", { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return new NextResponse("Sono ammessi solo file .zip", { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // ✅ Nuovo controllo: obbligo del .txt dentro lo ZIP
  if (!zipHasTxtFile(buf)) {
    return new NextResponse(
      "Nel file .zip deve essere presente un file di testo (.txt) con il codice SHA-256 generato in Home.",
      { status: 400 }
    );
  }

  // Receipt code = hash dello ZIP
  const receiptCode = crypto.createHash("sha256").update(buf).digest("hex");

  const otsUrl = process.env.OTS_SERVICE_URL;
  if (!otsUrl) {
    return new NextResponse("OTS_SERVICE_URL non configurato", { status: 500 });
  }

  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "application/zip" }), file.name);

  let upstream: Response;
  try {
    upstream = await fetch(otsUrl, { method: "POST", body: fd });
  } catch {
    return new NextResponse("Connessione al servizio OTS non riuscita", { status: 502 });
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return new NextResponse(`Errore OTS: ${text}`, { status: 502 });
  }

  const otsBlob = await upstream.blob();

  return new NextResponse(otsBlob, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="blockstamp_receipt.ots"',
      "x-receipt-code": receiptCode,
      "Cache-Control": "no-store",
    },
  });
}
