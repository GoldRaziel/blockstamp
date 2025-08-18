"use client";

import Image from "next/image";
import { useState } from "react";

function toHex(buffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleFile(f?: File | null) {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const buf = await f.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      setHash(toHex(digest));
      setFile(f);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore durante il calcolo dell'hash.");
    } finally {
      setBusy(false);
    }
  }

  function downloadRequestJson() {
    if (!hash || !file) return;
    const payload = {
      hash,
      algo: "sha256",
      filename: file.name,
      size: file.size,
      timestamp_request: new Date().toISOString(),
      note: "MVP: invia questo file via email al provider per la marcatura su Bitcoin/OTS."
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blockstamp-request-${file.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyHash() {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
  }

  return (
    <div className="space-y-10">
      <section className="text-center space-y-6">
        <Image
          src="/logo.png"
          alt="BLOCKSTAMP"
          width={96}
          height={96}
          className="mx-auto mb-2 rounded"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Proof of Existence
          <br />
          <span className="text-sky-400">Hash locale</span> · Privacy by design
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Genera l&apos;impronta (SHA-256) del tuo file <b>in locale</b>. Scarica la richiesta e inviala per la
          marcatura su Bitcoin/OpenTimestamps. Nessun upload del contenuto.
        </p>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <label className="block text-sm opacity-80">Seleziona file</label>
            <input
              type="file"
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
            {busy && <div className="text-sm opacity-80">Calcolo hash…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {file && !busy && (
              <div className="text-sm opacity-80">
                <div>
                  <b>Nome:</b> {file.name}
                </div>
                <div>
                  <b>Dimensione:</b> {file.size.toLocaleString()} byte
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm opacity-80">SHA-256</label>
            <textarea
              className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm font-mono"
              readOnly
              value={hash}
              placeholder="L'hash verrà mostrato qui…"
            />
            <div className="flex gap-3">
              <button
                onClick={copyHash}
                disabled={!hash}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
              >
                Copia hash
              </button>
              <button
                onClick={downloadRequestJson}
                disabled={!hash || !file}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40"
              >
                Scarica request.json
              </button>
            </div>
            <p className="text-xs opacity-70">
              Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="space-y-4">
        <h2 className="text-2xl font-semibold">Prezzi (MVP)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Free", price: "€0", desc: "Hash locale + request.json", items: ["Calcolo hash", "Download request.json", "Guida verifica"] },
            { name: "Basic", price: "€19", desc: "Marcatura OpenTimestamps (manuale)", items: ["Ancoraggio OTS", "File .ots di prova", "Report PDF sintetico"] },
            { name: "Pro", price: "€69", desc: "Ancoraggio su
