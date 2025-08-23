import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const paid = req.cookies.get("paid");
  return NextResponse.json({
    paid: paid?.value === "1"
  });
}
