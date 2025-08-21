export const runtime = "nodejs";
// opzionale: evita caching di Netlify/Next su route
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE;
  if (!apiBase) {
    return new Response("OTS_API_BASE not configured", { status: 500 });
  }

  const upstream = await fetch(`${apiBase}/stamp`, {
    method: "POST",
    body: form,
  });

  // Pass-through binario (es. .ots)
  const buf = await upstream.arrayBuffer();
  return new Response(buf, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/octet-stream",
      "content-disposition": upstream.headers.get("content-disposition") || "",
      "cache-control": "no-store",
    },
  });
}
