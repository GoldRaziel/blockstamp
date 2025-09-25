import { usePathname } from "next/navigation";
"use client";
import { useEffect, useState } from "react";

export default function TestUpload() {
  const pathname = usePathname() || "/";
  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => setMsg(""), []);

  async function send() {
    try {
      setMsg("Uploading...");
      const sp = new URLSearchParams(window.location.search);
      const key = sp.get("key") || "";
      if (!key) { setMsg("Missing ?key=... in URL"); return; }
      if (!file) { setMsg("Select a .zip first"); return; }

      const fd = new FormData();
      fd.append("zip", file);
      const res = await fetch(`/api/stamp?key=${encodeURIComponent(key)}`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const text = await res.text();
      setMsg(`${res.status} ${res.statusText} — ${text.slice(0,200)}...`);
    } catch (e:any) {
      setMsg(`Error: ${e?.message || e}`);
    }
  }

  return (
    <div className="p-6 text-sky-100 space-y-4">
      <h1 className="text-2xl font-bold">Test Upload (bypass key)</h1>
      <p>Apri questa pagina come: <code>/test-upload?key=LA_TUA_CHIAVE</code></p>
      <input type="file" accept=".zip" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      <button onClick={send} className="px-4 py-2 rounded bg-amber-400 text-black font-semibold">INVIA</button>
      <div className="text-sm opacity-80">{msg}</div>
    </div>
  );
}
