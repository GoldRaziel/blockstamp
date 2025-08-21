export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData();
  const apiBase = process.env.OTS_API_BASE;
  if (!apiBase) {
    return new Response("OTS_API_BASE not configured", { status: 500 });
  }

  const upstream = await fetch(`${apiBase}/upgrade`, {
    method: "POST",
    body: form,
    headers: { Accept: "application/octet-stream" },
  });

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
