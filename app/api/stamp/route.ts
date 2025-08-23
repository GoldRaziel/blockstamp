import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Difesa aggiuntiva: richiede cookie "paid=1"
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

  // Calcola "receipt code" = SHA-256 del contenuto .zip
  const buf = Buffer.from(await file.arrayBuffer());
  const receiptCode = crypto.createHash("sha256").update(buf).digest("hex");

  const otsUrl = process.env.OTS_SERVICE_URL;
  if (!otsUrl) {
    return new NextResponse("OTS_SERVICE_URL non configurato", { status: 500 });
  }

  // Inoltra al servizio OTS (/stamp) come multipart
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
