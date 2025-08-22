import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const paid = cookies().get("paid")?.value === "1";
  if (!paid) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // TODO: inserisci qui la logica esistente di timbratura (OpenTimestamps)
  return NextResponse.json({ ok: true, message: "Timbro effettuato (placeholder)" });
}
