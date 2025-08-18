import { NextRequest, NextResponse } from "next/server";

/**
 * MVP endpoint (disattivato di default).
 * TODO: Collegare provider email/DB e coda OTS.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data?.hash || typeof data.hash !== "string") {
      return NextResponse.json({ error: "hash mancante" }, { status: 400 });
    }
    console.log("BLOCKSTAMP request:", data);
    return NextResponse.json({ ok: true, received: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Errore inatteso" }, { status: 500 });
  }
}
