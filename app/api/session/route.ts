import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const paid = req.cookies.get("paid")?.value === "1";
  return NextResponse.json({ paid });
}
