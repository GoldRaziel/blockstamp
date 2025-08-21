import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE!;
  const upstream = await fetch(\`\${apiBase}/stamp\`, { method: "POST", body: form });

  if (!upstream.ok) {
    const text = await upstream.text();
    return Response.json({ ok: false, vpsStatus: upstream.status, error: text }, { status: 502 });
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="receipt.ots"',
      "Cache-Control": "no-store",
    },
  });
}
