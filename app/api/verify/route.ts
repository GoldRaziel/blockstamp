import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE!;
  const upstream = await fetch(\`\${apiBase}/verify\`, { method: "POST", body: form });

  const vpsStatus = upstream.status;
  const text = await upstream.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  const ok = vpsStatus === 200 && (data?.status === "ok" || data?.status === "pending");
  return Response.json({ ok, vpsStatus, ...data }, { status: ok ? 200 : 502 });
}
