import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export async function POST(req: Request) {
  // 1) Controllo pagamento via cookie httpOnly
  const isPaid = cookies().get("paid")?.value === "1";
  if (!isPaid) {
    return NextResponse.json(
      { error: "Pagamento richiesto", code: "PAYMENT_REQUIRED" },
      { status: 402 }
    );
  }

  try {
    // 2) Leggi il file dal multipart/form-data
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File mancante" },
        { status: 400 }
      );
    }

    // 3) Calcola hash SHA-256 lato server
    const buf = Buffer.from(await file.arrayBuffer());
    const hashHex = createHash("sha256").update(buf).digest("hex");

    // TODO: qui inserisci la tua logica di invio all'anchoring service/OpenTimestamps se necessario

    // 4) Rispondi con l'hash (come facevi già lato client)
    return NextResponse.json({ ok: true, hash: hashHex });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Errore durante l'invio" },
      { status: 500 }
    );
  }
}
