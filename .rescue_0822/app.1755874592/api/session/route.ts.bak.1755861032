import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const paid = cookies().get("paid")?.value === "1"; // true solo se il cookie vale "1"
  return NextResponse.json(
    { paid },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
  );
}
