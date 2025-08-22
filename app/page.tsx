"use client";

import { useEffect, useState } from "react";
import PriceBox from "./components/PriceBox"; // lascia questo: mantiene il riquadro prezzo + spiegazione

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  // --- Checkout Stripe ---
  async function startCheckout() {
    setError("");
    setBusy(true);
    try {
      // Primo tentativo: /api/checkout
      let res = await fetch("/api/checkout", { method: "POST" });
      if (res.status === 404) {
        // Fallback: /api/create-checkout-session
        res = await fetch("/api/create-checkout-session", { method: "POST" });
      }
      if (!res.ok) throw new Error("Errore nella creazione della sessione di pagamento");
      const data = await res.json();
      if (!data?.url) throw new Error("URL di Checkout non ricevuto");
      window.location.href = data.url; // Redirect a Stripe
    } catch (e: any) {
      setError(e?.message || "Pagamento non disponibile al momento.");
    } finally {
      setBusy(false);
    }
  }

  // --- Calcolo SHA-256 on demand ---
  async function calcHash() {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      setHash(toHex(digest));
    } catch (e: any) {
      setError("Impossibile calcolare l'hash. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  function copyHash() {
    if (!hash) return;
    navigator.clipboard.writeText(hash).catch(() => {});
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      {/* HERO + PriceBox (manteniamo riquadro prezzo e spiegazione blockchain) */}
      <section className="grid gap-6 md:grid-cols-2 items-start">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold">Blockstamp — Protezione su Bitcoin</h1>
          <p className="text-sm text-gray-400">
            Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo fino al caricamento volontario post‑pagamento.
          </p>

          {/* Pulsante PAGA ORA collegato a Stripe */}
          <div className="pt-2">
            <button
              onClick={startCheckout}
              disabled={busy}
              className="rounded-xl px-6 py-3 font-semibold shadow hover:opacity-90 disabled:opacity-50 border border-yellow-500/40"
              style={{ background: "#f6c343", color: "#111" }}
              aria-label="Paga ora e vai al checkout"
              title="Paga ora e vai al checkout"
            >
              {busy ? "Attendere..." : "PAGA ORA"}
            </button>
          </div>

          {/* Errori */}
          {error && (
            <div className="mt-3 text-sm text-red-400 border border-red-700/40 bg-red-900/20 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>

        {/* Manteniamo il riquadro prezzo + spiegazione blockchain */}
        <div>
          <PriceBox />
        </div>
      </section>

      {/* Box guida SHA-256 + upload file per calcolo impronta */}
      <section className="rounded-2xl border border-cyan-400/30 bg-cyan-900/10 p-5">
        <h2 className="text-xl font-semibold mb-3">🔐 Calcola la tua impronta SHA‑256</h2>

        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>Seleziona il file da proteggere.</li>
          <li>Clicca <strong>Calcola hash (SHA‑256)</strong>: otterrai la tua impronta digitale univoca.</li>
          <li><strong>Copia</strong> l’impronta e incollala in un file di testo <code>.txt</code>.</li>
          <li>Comprimi il file originale <em>insieme</em> al file <code>.txt</code> in un archivio <code>.zip</code>.</li>
          <li>Torna qui e clicca <strong>PAGA ORA</strong>.</li>
          <li>Dopo il pagamento, carica il file <code>.zip</code> nella pagina successiva.</li>
        </ol>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] items-start">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">File</label>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setHash("");
              }}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-gray-700 file:bg-gray-800 file:px-3 file:py-1.5 file:text-gray-200"
            />
          </div>

          <div className="flex md:justify-end items-end">
            <button
              onClick={calcHash}
              disabled={!file || busy}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              Calcola hash (SHA‑256)
            </button>
          </div>
        </div>

        {/* Output hash + copia */}
        <div className="mt-4">
          <label className="text-sm text-gray-300">Impronta SHA‑256</label>
          <div className="mt-1 grid gap-2 md:grid-cols-[1fr_auto]">
            <textarea
              value={hash}
              readOnly
              rows={2}
              className="w-full rounded-lg border border-gray-700 bg-black/40 p-2 font-mono text-xs text-gray-200"
              placeholder="Calcola per ottenere l'impronta…"
            />
            <button
              onClick={copyHash}
              disabled={!hash}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
              title="Copia impronta"
            >
              Copia
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Suggerimento: rinomina il file di testo con qualcosa come <code>hash.txt</code> e mantienilo dentro lo <code>.zip</code> accanto al file originale.
        </p>
      </section>
    </main>
  );
}
