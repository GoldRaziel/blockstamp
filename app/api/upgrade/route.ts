import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE!;
  const upstream = await fetch(\`\${apiBase}/upgrade\`, { method: "POST", body: form, headers: { Accept: "application/octet-stream" } });

  if (!upstream.ok) {
    const text = await upstream.text();
    return Response.json({ ok: false, vpsStatus: upstream.status, error: text }, { status: 502 });
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="receipt-upgraded.ots"',
      "Cache-Control": "no-store",
    },
  });
}
