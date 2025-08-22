"use client";
import { useState } from "react";

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

export default function TimbraPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");

  async function submitToServer() {
    if (!file || !hash) return;
    // TODO: qui colleghi la tua API /api/stamp come già fai nella home
    // Esempio:
    // const fd = new FormData();
    // fd.append("file", file);
    // const res = await fetch("/api/stamp", { method: "POST", body: fd });
    // ...
    console.log("Ready to stamp:", { file: file.name, hash });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">TIMBRA</h1>

      <input
        type="file"
        className="mb-3"
        onChange={async (e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          if (!f) { setHash(""); return; }
          const buf = await f.arrayBuffer();
          const digest = await crypto.subtle.digest("SHA-256", buf);
          setHash(toHex(digest));
        }}
      />

      {hash && (
        <p className="text-sm opacity-80 break-all mb-3">
          <span className="font-medium">SHA-256:</span> {hash}
        </p>
      )}

      <button
        type="button"
        onClick={submitToServer}
        disabled={!file || !hash}
        className={`px-4 py-2 rounded-lg ${file && hash ? "bg-emerald-600 hover:bg-emerald-500" : "bg-gray-400 cursor-not-allowed"} disabled:opacity-40`}
      >
        ✅ Timbra ora
      </button>

      {!file && <p className="text-sm opacity-70 mt-2">Seleziona un file per procedere.</p>}
    </div>
  );
}
