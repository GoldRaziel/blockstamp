export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE;
  if (!apiBase) {
    return new Response("OTS_API_BASE not configured", { status: 500 });
  }

  const upstream = await fetch(`${apiBase}/verify`, {
    method: "POST",
    body: form,
  });

  // Pass-through (testo/json/binario) senza alterazioni
  const buf = await upstream.arrayBuffer();
  return new Response(buf, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
