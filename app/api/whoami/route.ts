import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const all = cookies().getAll().map(c => ({ name: c.name, value: c.value }));
  const paid = cookies().get("paid")?.value === "1";
  return NextResponse.json({ cookies: all, paid });
}
